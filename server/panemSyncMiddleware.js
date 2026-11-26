const STRATEGY_CONFIG = {
  cornucopia: {
    baseRisk: 0.50,
    basePoints: 20,
    supplies: 'Full Cornucopia Pack',
    tool: {
      name: 'Survival Tool Kit',
      icon: '🛠️',
      effect: 'Water purification tabs & signal flare — could come in handy later in the Games.'
    }
  },
  outskirts: {
    baseRisk: 0.25,
    basePoints: 16,
    supplies: 'Outskirts Supplies',
    tool: null
  },
  woods: {
    baseRisk: 0.0,
    basePoints: 12,
    supplies: 'Empty-Handed',
    tool: null
  }
}

const P3_LOCATION_POINTS = {
  puddle: 10,
  pond: 13,
  stream: 16
}

const P3_TRAVEL_DEATH_PROB = {
  puddle: 0.05,
  pond: 0.18,
  stream: 0.35
}

const P3_SICK_PROB = {
  'puddle:drink': 1.0,
  'puddle:purify': 0.20,
  'pond:drink': 1.0,
  'pond:purify': 0.05,
  'stream:drink': 1.0,
  'stream:purify': 0.0
}

function getSpeedBonus(responseTimeSec) {
  if (responseTimeSec == null) return 0
  if (responseTimeSec <= 5) return 3
  if (responseTimeSec <= 10) return 2
  if (responseTimeSec <= 20) return 1
  return 0
}

function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function createPanemSyncMiddleware() {
  const GAMEMAKER_KEY = (process.env.GAMEMAKER_KEY || 'Friday').trim()
  let tributes = []
  let timerState = {
    running: false,
    countdown: 30,
    duration: 30,
    visible: false,
    lastTick: Date.now()
  }

  function createInitialGameState(duration = 30, keepGamemaker = null) {
    return {
      phase: 'lobby',
      started: false,       // false while on Home / Instruction Slides; true once Gamemaker clicks "Let the Games Begin!"
      slideIndex: 0,        // 0 = Home Title Page, 1..6 = Instruction Slides
      completedPhase: 0,
      gamemakerId: keepGamemaker?.gamemakerId || null,
      gamemakerName: keepGamemaker?.gamemakerName || null,
      resetToken: keepGamemaker?.resetToken || 0,
      selectedLessonIndex: 0, // Gamemaker picks which 1 of the 3 papers is featured on takeaway slides
      takeawaySlideIndex: 0,  // Synced slide index within a multi-slide takeaway presentation
      takeawayHidden: false,  // Gamemaker can hide takeaway content from players (private preview vs visible)
      durationSeconds: duration,
      votingStartedAt: null,
      // Phase 1
      choices: {},
      poll: { cornucopia: 0, outskirts: 0, woods: 0, totalVoted: 0, totalTributes: 0 },
      scaledRisks: { cornucopia: 0, outskirts: 0, woods: 0 },
      roundCalculated: false,
      // Phase 2
      p2Choices: {},
      p2Poll: { alliance: 0, solo: 0, totalVoted: 0, totalTributes: 0 },
      alliances: [],
      soloIds: [],
      p2Assigned: false,
      // Phase 3
      p3Locations: {},
      p3Actions: {},
      p3LocationPoll: { puddle: 0, pond: 0, stream: 0, totalVoted: 0, totalTributes: 0 },
      p3ActionPoll: { drink: 0, purify: 0, totalVoted: 0, totalTributes: 0 },
      p3Calculated: false,
      // Phase 4: Fire Disaster + The Feast
      p4Fire: {},  // { [tributeId]: 'downhill' | 'tree' | 'ditch' }
      p4Feast: {}, // { [tributeId]: 'skip' | 'scout' | 'grab' }
      p4FirePoll: { downhill: 0, tree: 0, ditch: 0, totalVoted: 0, totalTributes: 0 },
      p4FeastPoll: { skip: 0, scout: 0, grab: 0, totalVoted: 0, totalTributes: 0 },
      p4Calculated: false,
      // Phase 5
      p5Pitches: {},
      p5Votes: {},
      p5VoteCounts: {},
      p5Podium: [],
      p5Calculated: false
    }
  }

  let gameState = createInitialGameState(30)
  const clients = new Set()

  function appendScoreHistory(t, entry) {
    const existing = Array.isArray(t.scoreHistory) ? t.scoreHistory : []
    return [...existing.filter(e => e.phase !== entry.phase), entry]
  }

  function recomputePoll() {
    let cornucopia = 0, outskirts = 0, woods = 0
    for (const t of tributes) {
      const c = gameState.choices[t.id]
      if (c?.strategy === 'cornucopia') cornucopia++
      else if (c?.strategy === 'outskirts') outskirts++
      else if (c?.strategy === 'woods') woods++
    }
    gameState.poll = {
      cornucopia, outskirts, woods,
      totalVoted: cornucopia + outskirts + woods,
      totalTributes: tributes.length
    }
  }

  function recomputeP2Poll() {
    let alliance = 0, solo = 0
    for (const t of tributes) {
      const c = gameState.p2Choices[t.id]
      if (c?.choice === 'alliance') alliance++
      else if (c?.choice === 'solo') solo++
    }
    gameState.p2Poll = {
      alliance, solo,
      totalVoted: alliance + solo,
      totalTributes: tributes.length
    }
  }

  function recomputeP3Polls() {
    let puddle = 0, pond = 0, stream = 0
    let drink = 0, purify = 0
    for (const t of tributes) {
      const loc = gameState.p3Locations[t.id]
      if (loc === 'puddle') puddle++
      else if (loc === 'pond') pond++
      else if (loc === 'stream') stream++

      const act = gameState.p3Actions[t.id]
      if (act === 'drink') drink++
      else if (act === 'purify') purify++
    }
    gameState.p3LocationPoll = {
      puddle, pond, stream,
      totalVoted: puddle + pond + stream,
      totalTributes: tributes.length
    }
    gameState.p3ActionPoll = {
      drink, purify,
      totalVoted: drink + purify,
      totalTributes: tributes.length
    }
  }

  function recomputeP4Polls() {
    let downhill = 0, tree = 0, ditch = 0
    let skip = 0, scout = 0, grab = 0
    for (const t of tributes) {
      const f = gameState.p4Fire[t.id]
      if (f === 'downhill') downhill++
      else if (f === 'tree') tree++
      else if (f === 'ditch') ditch++

      const fe = gameState.p4Feast[t.id]
      if (fe === 'skip') skip++
      else if (fe === 'scout') scout++
      else if (fe === 'grab') grab++
    }
    gameState.p4FirePoll = {
      downhill, tree, ditch,
      totalVoted: downhill + tree + ditch,
      totalTributes: tributes.length
    }
    gameState.p4FeastPoll = {
      skip, scout, grab,
      totalVoted: skip + scout + grab,
      totalTributes: tributes.length
    }
  }

  function recomputeP5Votes() {
    const counts = {}
    for (const t of tributes) {
      // Carry forward +1 bonus vote if the tribute survived grabbing their pack at The Feast!
      counts[t.id] = t.feastBonusVote ? 1 : 0
    }
    for (const targetId of Object.values(gameState.p5Votes)) {
      if (targetId && counts[targetId] !== undefined) {
        counts[targetId] += 1
      }
    }
    gameState.p5VoteCounts = counts
  }

  function calculateConsequences() {
    if (gameState.roundCalculated) return
    const totalTributes = Math.max(tributes.length, 1)

    for (const t of tributes) {
      if (!gameState.choices[t.id]) {
        gameState.choices[t.id] = {
          strategy: 'woods',
          responseTime: gameState.durationSeconds,
          timedOut: true
        }
      }
    }

    recomputePoll()

    const probCornucopia = STRATEGY_CONFIG.cornucopia.baseRisk * (gameState.poll.cornucopia / totalTributes)
    const probOutskirts = Math.max(0.10, STRATEGY_CONFIG.outskirts.baseRisk * (gameState.poll.outskirts / totalTributes))

    gameState.scaledRisks = {
      cornucopia: Number((probCornucopia * 100).toFixed(1)),
      outskirts: Number((probOutskirts * 100).toFixed(1)),
      woods: 0
    }

    tributes = tributes.map(t => {
      const choice = gameState.choices[t.id]
      const timedOut = Boolean(choice?.timedOut)
      const strategy = choice?.strategy || 'woods'
      const responseTime = choice?.responseTime ?? gameState.durationSeconds
      const config = STRATEGY_CONFIG[strategy] || STRATEGY_CONFIG.woods

      let actualProb = 0
      let latePenalty = 0
      const timeRemaining = Math.max(0, gameState.durationSeconds - responseTime)

      if (strategy === 'cornucopia') {
        actualProb = probCornucopia
        if (timeRemaining <= 5) latePenalty = ((6 - timeRemaining) / 5) * 0.30
      } else if (strategy === 'outskirts') {
        actualProb = probOutskirts
        if (timeRemaining <= 5) latePenalty = ((6 - timeRemaining) / 5) * 0.15
      }

      const finalElimProb = Math.min(0.95, actualProb + latePenalty)
      const fell = timedOut ? true : (finalElimProb > 0 ? Math.random() < finalElimProb : false)
      const speedBonus = fell ? 0 : getSpeedBonus(responseTime)
      const roundPoints = timedOut ? -2 : (fell ? -5 : (config.basePoints + speedBonus))
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      const detail = timedOut
        ? 'Timed out (-2)'
        : fell
        ? `Hit in ${strategy} (-5)`
        : `${strategy} (+${config.basePoints})${speedBonus ? ` + Speed (+${speedBonus})` : ''}`

      return {
        ...t,
        strategy,
        responseTime,
        latePenaltyPct: Math.round(latePenalty * 100),
        supplies: fell ? 'Lost in Arena' : config.supplies,
        arenaTool: !fell && config.tool ? config.tool : null,
        survivalStatus: fell ? 'eliminated' : 'alive',
        speedBonus,
        roundPoints,
        totalScore: prevScore + roundPoints,
        scoreHistory: appendScoreHistory(t, { phase: 'Phase 1: Cornucopia', points: roundPoints, detail })
      }
    })

    gameState.roundCalculated = true
  }

  function assignAlliances() {
    if (gameState.p2Assigned) return

    for (const t of tributes) {
      if (!gameState.p2Choices[t.id]) {
        gameState.p2Choices[t.id] = {
          choice: 'solo',
          responseTime: gameState.durationSeconds,
          timedOut: true
        }
      }
    }

    recomputeP2Poll()

    const allianceSeekers = shuffleArray(
      tributes.filter(t => gameState.p2Choices[t.id]?.choice === 'alliance')
    )
    const soloTributes = tributes.filter(t => gameState.p2Choices[t.id]?.choice !== 'alliance')

    const alliances = []
    const soloIds = soloTributes.map(t => t.id)

    if (allianceSeekers.length === 1) {
      soloIds.push(allianceSeekers[0].id)
    } else if (allianceSeekers.length >= 2) {
      let teamNum = 1
      for (let i = 0; i < allianceSeekers.length; i += 2) {
        if (i + 3 === allianceSeekers.length) {
          alliances.push({
            id: `alliance-${teamNum}`,
            name: `Alliance ${teamNum}`,
            memberIds: [
              allianceSeekers[i].id,
              allianceSeekers[i + 1].id,
              allianceSeekers[i + 2].id
            ]
          })
          break
        } else {
          alliances.push({
            id: `alliance-${teamNum}`,
            name: `Alliance ${teamNum}`,
            memberIds: [allianceSeekers[i].id, allianceSeekers[i + 1].id]
          })
          teamNum++
        }
      }
    }

    tributes = tributes.map(t => {
      const team = alliances.find(a => a.memberIds.includes(t.id))
      if (team) {
        return { ...t, allianceMode: 'alliance', allianceId: team.id, allianceName: team.name }
      }
      return { ...t, allianceMode: 'solo', allianceId: null, allianceName: 'Solo' }
    })

    gameState.alliances = alliances
    gameState.soloIds = soloIds
    gameState.p2Assigned = true
  }

  function calculatePhase3Outcomes() {
    if (gameState.p3Calculated) return

    for (const t of tributes) {
      if (!gameState.p3Locations[t.id]) gameState.p3Locations[t.id] = 'puddle'
      if (!gameState.p3Actions[t.id]) gameState.p3Actions[t.id] = 'drink'
    }

    recomputeP3Polls()

    const allianceStats = {}
    for (const team of gameState.alliances) {
      const members = team.memberIds.map(id => tributes.find(t => t.id === id)).filter(Boolean)
      const locs = new Set(members.map(m => gameState.p3Locations[m.id]))
      const acts = new Set(members.map(m => gameState.p3Actions[m.id]))
      const hasPurifyTool = members.some(m => Boolean(m.arenaTool))
      const locMismatch = members.length > 1 && locs.size > 1
      const actMismatch = members.length > 1 && acts.size > 1
      allianceStats[team.id] = { hasPurifyTool, locMismatch, actMismatch }
    }

    tributes = tributes.map(t => {
      const loc = gameState.p3Locations[t.id] || 'puddle'
      const act = gameState.p3Actions[t.id] || 'drink'
      const locPts = P3_LOCATION_POINTS[loc] ?? 10
      const purifyPts = act === 'purify' ? 4 : 0
      const baseScore = locPts + purifyPts

      const deathProb = P3_TRAVEL_DEATH_PROB[loc] ?? 0.05
      const died = Math.random() < deathProb

      const sickProbBase = P3_SICK_PROB[`${loc}:${act}`] ?? 0.25
      const teamInfo = t.allianceId ? allianceStats[t.allianceId] : null
      const hasToolBenefit = Boolean(t.arenaTool) || Boolean(teamInfo?.hasPurifyTool)
      const effectiveSickProb = act === 'drink'
        ? 1.0
        : (hasToolBenefit ? sickProbBase * 0.5 : sickProbBase)
      const gotSick = !died && effectiveSickProb > 0 ? Math.random() < effectiveSickProb : false

      const deathPenalty = died ? -5 : 0
      const sickPenalty = gotSick ? -2 : 0
      const mismatchPenalty =
        (teamInfo?.locMismatch ? -3 : 0) +
        (teamInfo?.actMismatch ? -3 : 0)
      const toolTeamBonus = teamInfo?.hasPurifyTool ? 2 : 0

      const p3RoundPoints = baseScore + deathPenalty + sickPenalty + mismatchPenalty + toolTeamBonus
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      const parts = [`${loc} (+${locPts})`]
      if (purifyPts) parts.push('Purify (+4)')
      if (died) parts.push('Killed on journey (-5)')
      if (gotSick) parts.push('Sick (-2)')
      if (mismatchPenalty) parts.push(`Team mismatch (${mismatchPenalty})`)
      if (toolTeamBonus) parts.push('Team purifier (+2)')

      return {
        ...t,
        p3Location: loc,
        p3Action: act,
        p3Died: died,
        p3GotSick: gotSick,
        p3MismatchPenalty: mismatchPenalty,
        p3ToolBonus: toolTeamBonus,
        p3RoundPoints,
        totalScore: prevScore + p3RoundPoints,
        scoreHistory: appendScoreHistory(t, {
          phase: 'Phase 3: Finding Water',
          points: p3RoundPoints,
          detail: parts.join(' • ')
        })
      }
    })

    gameState.p3Calculated = true
  }

  function startP4Feast(secs) {
    const feastSecs = typeof secs === 'number' && secs >= 5 ? secs : 20
    gameState.p4Feast = {}
    gameState.phase = 'p4_twist'
    timerState.duration = feastSecs
    timerState.countdown = feastSecs
    timerState.running = true
    recomputeP4Polls()
  }

  function calculatePhase4Outcomes() {
    if (gameState.p4Calculated) return
    recomputeP4Polls()

    tributes = tributes.map(t => {
      const fireChoice = gameState.p4Fire[t.id] || null
      const feastChoice = gameState.p4Feast[t.id] || null

      // Part 1: Fire Disaster
      // downhill: +4 | tree: -3 & 60% dying (-5) | ditch: +5 | timeout: -8
      let firePoints = 0
      let fireDied = false
      let fireLabel = ''
      if (!fireChoice) {
        firePoints = -2
        fireDied = true
        fireLabel = 'Fire timeout (-2)'
      } else if (fireChoice === 'downhill') {
        firePoints = 4
        fireLabel = 'Moved downhill (+4)'
      } else if (fireChoice === 'ditch') {
        firePoints = 5
        fireLabel = 'Ditched gear (+5)'
      } else if (fireChoice === 'tree') {
        fireDied = Math.random() < 0.60
        firePoints = fireDied ? -8 : -3
        fireLabel = fireDied ? 'Climbed tree — fell in flames (-8)' : 'Climbed tree (-3)'
      }

      // Part 2: The Feast
      // skip: +5 | scout: +1 | grab: 50% killed (-5) else +3 & +1 bonus vote in Phase 5 | timeout: -8
      let feastPoints = 0
      let feastDied = false
      let feastBonusVote = false
      let feastLabel = ''
      if (!feastChoice) {
        feastPoints = -2
        feastDied = true
        feastLabel = 'Feast timeout (-2)'
      } else if (feastChoice === 'skip') {
        feastPoints = 5
        feastLabel = 'Skipped Feast (+5)'
      } else if (feastChoice === 'scout') {
        feastPoints = 1
        feastLabel = 'Scouted tree line (+1)'
      } else if (feastChoice === 'grab') {
        feastDied = Math.random() < 0.50
        if (feastDied) {
          feastPoints = -5
          feastLabel = 'Feast ambush (-5)'
        } else {
          feastPoints = 3
          feastBonusVote = true
          feastLabel = 'Grabbed pack (+3 & +1 Pitch Vote)'
        }
      }

      const p4RoundPoints = firePoints + feastPoints
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      return {
        ...t,
        p4FireChoice: fireChoice,
        p4FeastChoice: feastChoice,
        p4FireDied: fireDied,
        p4FeastDied: feastDied,
        p4FirePoints: firePoints,
        p4FeastPoints: feastPoints,
        feastBonusVote,
        p4RoundPoints,
        totalScore: prevScore + p4RoundPoints,
        scoreHistory: appendScoreHistory(t, {
          phase: 'Phase 4: Fire & The Feast',
          points: p4RoundPoints,
          detail: `${fireLabel} • ${feastLabel}`
        })
      }
    })

    gameState.p4Calculated = true
  }

  function calculatePhase5Outcomes() {
    if (gameState.p5Calculated) return
    recomputeP5Votes()

    const ranked = [...tributes]
      .map(t => ({
        tributeId: t.id,
        votes: gameState.p5VoteCounts[t.id] || 0,
        pitched: Boolean(gameState.p5Pitches[t.id]?.pitch?.trim())
      }))
      .sort((a, b) => b.votes - a.votes || (b.pitched ? 1 : 0) - (a.pitched ? 1 : 0))

    const bonusMap = {}
    const podium = []
    const bonuses = [5, 3, 1]

    ranked.forEach((entry, idx) => {
      if (idx < 3 && entry.votes > 0) {
        const bonus = bonuses[idx]
        bonusMap[entry.tributeId] = bonus
        podium.push({ ...entry, rank: idx + 1, bonus })
      }
    })

    tributes = tributes.map(t => {
      const pitchData = gameState.p5Pitches[t.id]
      const pitchText = pitchData?.pitch?.trim() || ''
      const votes = gameState.p5VoteCounts[t.id] || 0
      const didVote = Boolean(gameState.p5Votes[t.id])
      const noVotePenalty = didVote ? 0 : -4
      const ptsSponsor = bonusMap[t.id] || 0
      const p5RoundPoints = ptsSponsor + noVotePenalty
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      const parts = []
      if (ptsSponsor > 0) parts.push(`Sponsor bonus (+${ptsSponsor}, ${votes} vote${votes === 1 ? '' : 's'})`)
      else parts.push(`${votes} sponsor vote${votes === 1 ? '' : 's'} (+0)`)
      if (t.feastBonusVote) parts.push('includes +1 Feast vote')
      if (!didVote) parts.push('Did not vote (-4)')

      return {
        ...t,
        p5Pitch: pitchText,
        p5Votes: votes,
        p5DidVote: didVote,
        p5NoVotePenalty: noVotePenalty,
        p5SponsorBonus: ptsSponsor,
        p5RoundPoints,
        totalScore: prevScore + p5RoundPoints,
        scoreHistory: appendScoreHistory(t, {
          phase: 'Phase 5: Sponsors',
          points: p5RoundPoints,
          detail: parts.join(' • ')
        })
      }
    })

    gameState.p5Podium = podium
    gameState.p5Calculated = true
  }

  function broadcast(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    for (const res of clients) {
      try {
        res.write(payload)
      } catch (e) {
        clients.delete(res)
      }
    }
  }

  function broadcastAll() {
    broadcast('tributes', tributes)
    broadcast('timer', timerState)
    broadcast('game', gameState)
  }

  setInterval(() => {
    if (timerState.running && timerState.countdown > 0) {
      timerState.countdown -= 1
      if (timerState.countdown <= 0) {
        timerState.running = false
        if (gameState.phase === 'choice') {
          gameState.phase = 'results'
          recomputePoll()
          broadcast('game', gameState)
        } else if (gameState.phase === 'p2_choice') {
          assignAlliances()
          gameState.phase = 'p2_alliances'
          broadcastAll()
          return
        } else if (gameState.phase === 'p3_location') {
          for (const t of tributes) {
            if (!gameState.p3Locations[t.id]) gameState.p3Locations[t.id] = 'puddle'
          }
          recomputeP3Polls()
          gameState.phase = 'p3_purify'
          timerState.countdown = gameState.durationSeconds
          timerState.running = true
          broadcastAll()
          return
        } else if (gameState.phase === 'p3_purify') {
          calculatePhase3Outcomes()
          gameState.phase = 'p3_outcome'
          broadcastAll()
          return
        } else if (gameState.phase === 'p4_event') {
          startP4Feast(20)
          broadcastAll()
          return
        } else if (gameState.phase === 'p4_twist') {
          calculatePhase4Outcomes()
          gameState.phase = 'p4_outcome'
          broadcastAll()
          return
        } else if (gameState.phase === 'p5_pitch') {
          gameState.phase = 'p5_vote'
          timerState.duration = gameState.durationSeconds || 45
          timerState.countdown = gameState.durationSeconds || 45
          timerState.running = true
          recomputeP5Votes()
          broadcastAll()
          return
        } else if (gameState.phase === 'p5_vote') {
          calculatePhase5Outcomes()
          gameState.phase = 'p5_winner'
          broadcastAll()
          return
        }
      }
      broadcast('timer', timerState)
    }
  }, 1000)

  setInterval(() => {
    for (const res of clients) {
      try {
        res.write(': keep-alive\n\n')
      } catch (e) {
        clients.delete(res)
      }
    }
  }, 25000)

  return function panemSyncMiddleware(req, res, next) {
    const url = req.url ? req.url.split('?')[0] : ''

    if (url === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('ok')
      return
    }

    if (url === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*'
      })
      res.write(`data: ${JSON.stringify({ tributes, timer: timerState, game: gameState })}\n\n`)
      clients.add(res)
      req.on('close', () => clients.delete(res))
      return
    }

    if (url === '/api/state' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.end(JSON.stringify({ tributes, timer: timerState, game: gameState }))
      return
    }

    if (url === '/api/tributes' && req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const tribute = JSON.parse(body)
          if (tribute.role === 'gamemaker') {
            if (gameState.gamemakerId && gameState.gamemakerId !== tribute.id) {
              res.statusCode = 409
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({
                success: false,
                error: 'A Gamemaker is already active in this session.'
              }))
              return
            }
            if (!gameState.gamemakerId || gameState.gamemakerId !== tribute.id) {
              const providedKey = (tribute.gamemakerKey || '').trim()
              if (providedKey !== GAMEMAKER_KEY) {
                res.statusCode = 403
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({
                  success: false,
                  error: 'Invalid Gamemaker access key.'
                }))
                return
              }
            }
            gameState.gamemakerId = tribute.id
            gameState.gamemakerName = tribute.realName || 'Gamemaker'
            tribute.pedestalNumber = null
            delete tribute.gamemakerKey
            broadcast('game', gameState)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, tribute, tributes, game: gameState }))
            return
          }

          const existingIndex = tributes.findIndex(t => t.id === tribute.id)
          if (existingIndex >= 0) {
            tributes[existingIndex] = { ...tributes[existingIndex], ...tribute }
          } else {
            const taken = new Set(tributes.map(t => t.pedestalNumber))
            let ped = 1
            for (let i = 1; i <= 15; i++) {
              if (!taken.has(i)) { ped = i; break }
            }
            tribute.pedestalNumber = ped
            tribute.totalScore = tribute.totalScore ?? 0
            tribute.survivalStatus = tribute.survivalStatus ?? 'alive'
            tribute.scoreHistory = tribute.scoreHistory ?? []
            tributes.push(tribute)
          }

          recomputePoll()
          recomputeP2Poll()
          recomputeP3Polls()
          recomputeP4Polls()
          recomputeP5Votes()
          broadcast('tributes', tributes)
          broadcast('game', gameState)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, tribute, tributes }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    if (url === '/api/timer' && req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const command = JSON.parse(body)
          if (command.action === 'toggle_visibility') {
            timerState.visible = typeof command.visible === 'boolean' ? command.visible : !timerState.visible
          } else if (command.action === 'set_duration') {
            const secs = Math.max(5, Math.min(300, parseInt(command.countdown, 10) || 30))
            timerState.duration = secs
            gameState.durationSeconds = secs
            if (!timerState.running) timerState.countdown = secs
            broadcast('game', gameState)
          } else if (command.action === 'start') {
            const secs = command.countdown ? Math.max(5, Math.min(300, parseInt(command.countdown, 10))) : timerState.duration
            if (timerState.countdown <= 0) timerState.countdown = secs
            timerState.running = true
          } else if (command.action === 'pause') {
            timerState.running = false
          } else if (command.action === 'reset') {
            const secs = command.countdown ? Math.max(5, Math.min(300, parseInt(command.countdown, 10))) : timerState.duration
            timerState.running = false
            timerState.duration = secs
            timerState.countdown = secs
            gameState.durationSeconds = secs
            broadcast('game', gameState)
          } else if (command.action === 'reset_arena') {
            // Remove all players EXCEPT the Gamemaker, and bump resetToken to send players back to Reaping
            tributes = []
            timerState.running = false
            timerState.countdown = 30
            timerState.duration = 30
            timerState.visible = false
            gameState = createInitialGameState(30, {
              gamemakerId: gameState.gamemakerId,
              gamemakerName: gameState.gamemakerName,
              resetToken: Date.now()
            })
            broadcastAll()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, timer: timerState, game: gameState }))
            return
          }
          broadcast('timer', timerState)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, timer: timerState }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    if (url === '/api/game' && req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const { action, durationSeconds, index } = JSON.parse(body)
          if (typeof durationSeconds === 'number' && durationSeconds >= 5) {
            gameState.durationSeconds = durationSeconds
            timerState.duration = durationSeconds
          }

          if (action === 'set_slide') {
            const safeSlide = Math.max(0, Math.min(7, parseInt(index, 10) || 0))
            gameState.slideIndex = safeSlide
          } else if (action === 'begin_games') {
            gameState.started = true
            gameState.phase = 'lobby'
          } else if (action === 'select_lesson_topic') {
            const safeIdx = Math.max(0, Math.min(2, parseInt(index, 10) || 0))
            gameState.selectedLessonIndex = safeIdx
            gameState.takeawaySlideIndex = 0
          } else if (action === 'set_takeaway_slide') {
            const safeSlide = Math.max(0, Math.min(10, parseInt(index, 10) || 0))
            gameState.takeawaySlideIndex = safeSlide
          } else if (action === 'toggle_takeaway_hidden') {
            gameState.takeawayHidden = !gameState.takeawayHidden
          } else if (action === 'start_intro') {
            gameState.phase = 'intro'
            gameState.choices = {}
            gameState.roundCalculated = false
            timerState.running = false
            timerState.countdown = gameState.durationSeconds
            recomputePoll()
          } else if (action === 'start_choice') {
            gameState.phase = 'choice'
            gameState.choices = {}
            gameState.roundCalculated = false
            gameState.votingStartedAt = Date.now()
            timerState.countdown = gameState.durationSeconds
            timerState.running = true
            recomputePoll()
          } else if (action === 'show_results') {
            timerState.running = false
            gameState.phase = 'results'
            recomputePoll()
          } else if (action === 'reveal_consequences') {
            timerState.running = false
            calculateConsequences()
            gameState.phase = 'consequences'
          } else if (action === 'show_lesson') {
            gameState.selectedLessonIndex = 0
            gameState.takeawaySlideIndex = 0
            gameState.takeawayHidden = false
            gameState.phase = 'lesson'
          } else if (action === 'back_to_lobby') {
            timerState.running = false
            timerState.countdown = gameState.durationSeconds
            if (gameState.phase === 'lesson' || gameState.phase === 'consequences') gameState.completedPhase = Math.max(gameState.completedPhase, 1)
            else if (gameState.phase === 'p2_lesson' || gameState.phase === 'p2_alliances') gameState.completedPhase = Math.max(gameState.completedPhase, 2)
            else if (gameState.phase === 'p3_lesson' || gameState.phase === 'p3_outcome') gameState.completedPhase = Math.max(gameState.completedPhase, 3)
            else if (gameState.phase === 'p4_lesson' || gameState.phase === 'p4_outcome') gameState.completedPhase = Math.max(gameState.completedPhase, 4)
            else if (gameState.phase === 'p5_lesson' || gameState.phase === 'p5_winner' || gameState.phase === 'finale') gameState.completedPhase = Math.max(gameState.completedPhase, 5)
            gameState.phase = 'lobby'
          } else if (action === 'start_p2_intro') {
            const p2Secs = typeof durationSeconds === 'number' ? durationSeconds : 60
            gameState.phase = 'p2_intro'
            gameState.durationSeconds = p2Secs
            gameState.p2Choices = {}
            gameState.alliances = []
            gameState.soloIds = []
            gameState.p2Assigned = false
            timerState.running = false
            timerState.duration = p2Secs
            timerState.countdown = p2Secs
            recomputeP2Poll()
          } else if (action === 'start_p2_choice') {
            const p2Secs = typeof durationSeconds === 'number' ? durationSeconds : 60
            gameState.phase = 'p2_choice'
            gameState.durationSeconds = p2Secs
            gameState.p2Choices = {}
            gameState.alliances = []
            gameState.soloIds = []
            gameState.p2Assigned = false
            gameState.votingStartedAt = Date.now()
            timerState.duration = p2Secs
            timerState.countdown = p2Secs
            timerState.running = true
            recomputeP2Poll()
          } else if (action === 'assign_alliances') {
            timerState.running = false
            assignAlliances()
            gameState.phase = 'p2_alliances'
          } else if (action === 'show_p2_lesson') {
            gameState.selectedLessonIndex = 0
            gameState.takeawaySlideIndex = 0
            gameState.takeawayHidden = true
            gameState.phase = 'p2_lesson'
          } else if (action === 'start_p3_intro') {
            const p3Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p3_intro'
            gameState.durationSeconds = p3Secs
            gameState.p3Locations = {}
            gameState.p3Actions = {}
            gameState.p3Calculated = false
            timerState.running = false
            timerState.duration = p3Secs
            timerState.countdown = p3Secs
            recomputeP3Polls()
          } else if (action === 'start_p3_location') {
            const p3Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p3_location'
            gameState.durationSeconds = p3Secs
            gameState.p3Locations = {}
            gameState.p3Actions = {}
            gameState.p3Calculated = false
            gameState.votingStartedAt = Date.now()
            timerState.duration = p3Secs
            timerState.countdown = p3Secs
            timerState.running = true
            recomputeP3Polls()
          } else if (action === 'start_p3_purify') {
            for (const t of tributes) {
              if (!gameState.p3Locations[t.id]) gameState.p3Locations[t.id] = 'puddle'
            }
            const p3Secs = typeof durationSeconds === 'number' ? durationSeconds : gameState.durationSeconds
            gameState.phase = 'p3_purify'
            gameState.p3Actions = {}
            gameState.votingStartedAt = Date.now()
            timerState.duration = p3Secs
            timerState.countdown = p3Secs
            timerState.running = true
            recomputeP3Polls()
          } else if (action === 'reveal_p3_outcome') {
            timerState.running = false
            calculatePhase3Outcomes()
            gameState.phase = 'p3_outcome'
          } else if (action === 'show_p3_lesson') {
            gameState.selectedLessonIndex = 0
            gameState.takeawaySlideIndex = 0
            gameState.takeawayHidden = false
            gameState.phase = 'p3_lesson'
          } else if (action === 'start_p4_intro') {
            const p4Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p4_intro'
            gameState.durationSeconds = p4Secs
            gameState.p4Fire = {}
            gameState.p4Feast = {}
            gameState.p4Calculated = false
            timerState.running = false
            timerState.duration = p4Secs
            timerState.countdown = p4Secs
            recomputeP4Polls()
          } else if (action === 'start_p4_event') {
            const p4Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p4_event'
            gameState.durationSeconds = p4Secs
            gameState.p4Fire = {}
            gameState.p4Feast = {}
            gameState.p4Calculated = false
            gameState.votingStartedAt = Date.now()
            timerState.duration = p4Secs
            timerState.countdown = p4Secs
            timerState.running = true
            recomputeP4Polls()
          } else if (action === 'trigger_p4_twist') {
            startP4Feast(typeof durationSeconds === 'number' ? durationSeconds : 20)
          } else if (action === 'reveal_p4_outcome') {
            timerState.running = false
            calculatePhase4Outcomes()
            gameState.phase = 'p4_outcome'
          } else if (action === 'show_p4_lesson') {
            gameState.selectedLessonIndex = 0
            gameState.takeawaySlideIndex = 0
            gameState.takeawayHidden = false
            gameState.phase = 'p4_lesson'
          } else if (action === 'start_p5_intro') {
            const p5Secs = typeof durationSeconds === 'number' ? durationSeconds : 60
            gameState.phase = 'p5_intro'
            gameState.durationSeconds = p5Secs
            gameState.p5Pitches = {}
            gameState.p5Votes = {}
            gameState.p5VoteCounts = {}
            gameState.p5Podium = []
            gameState.p5Calculated = false
            timerState.running = false
            timerState.duration = p5Secs
            timerState.countdown = p5Secs
          } else if (action === 'start_p5_pitch') {
            const p5Secs = typeof durationSeconds === 'number' ? durationSeconds : 60
            gameState.phase = 'p5_pitch'
            gameState.durationSeconds = p5Secs
            gameState.p5Pitches = {}
            gameState.p5Votes = {}
            gameState.p5VoteCounts = {}
            gameState.p5Podium = []
            gameState.p5Calculated = false
            timerState.duration = p5Secs
            timerState.countdown = p5Secs
            timerState.running = true
          } else if (action === 'start_p5_vote') {
            const voteSecs = typeof durationSeconds === 'number' && durationSeconds >= 5 ? durationSeconds : 45
            gameState.phase = 'p5_vote'
            gameState.p5Votes = {}
            recomputeP5Votes()
            timerState.duration = voteSecs
            timerState.countdown = voteSecs
            timerState.running = true
          } else if (action === 'reveal_p5_winner') {
            timerState.running = false
            calculatePhase5Outcomes()
            gameState.phase = 'p5_winner'
          } else if (action === 'show_p5_lesson') {
            gameState.selectedLessonIndex = 0
            gameState.takeawaySlideIndex = 0
            gameState.takeawayHidden = false
            gameState.phase = 'p5_lesson'
          } else if (action === 'show_finale') {
            timerState.running = false
            gameState.completedPhase = 5
            gameState.phase = 'finale'
          }

          broadcastAll()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, game: gameState, timer: timerState, tributes }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    if (url === '/api/vote' && req.method === 'POST') {
      let body = ''
      req.on('data', chunk => { body += chunk })
      req.on('end', () => {
        try {
          const { tributeId, strategy, phase: votePhase, pitch } = JSON.parse(body)

          if (votePhase === 'phase5_pitch' || gameState.phase === 'p5_pitch') {
            if (gameState.phase !== 'p5_pitch') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Pitch submissions are closed' }))
              return
            }
            gameState.p5Pitches[tributeId] = {
              pitch: typeof pitch === 'string' ? pitch.trim().slice(0, 240) : ''
            }
            broadcast('game', gameState)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, pitch: gameState.p5Pitches[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase5_vote' || gameState.phase === 'p5_vote') {
            if (gameState.phase !== 'p5_vote') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Sponsor voting is closed' }))
              return
            }
            if (!strategy || strategy === tributeId) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'You cannot vote for yourself' }))
              return
            }
            if (!gameState.p5Votes[tributeId]) {
              gameState.p5Votes[tributeId] = strategy
              recomputeP5Votes()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, votedFor: gameState.p5Votes[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase4_fire' || gameState.phase === 'p4_event') {
            if (gameState.phase !== 'p4_event') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Fire voting is closed' }))
              return
            }
            if (!['downhill', 'tree', 'ditch'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid fire move' }))
              return
            }
            if (!gameState.p4Fire[tributeId]) {
              gameState.p4Fire[tributeId] = strategy
              recomputeP4Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, choice: gameState.p4Fire[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase4_feast' || gameState.phase === 'p4_twist') {
            if (gameState.phase !== 'p4_twist') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Feast voting is closed' }))
              return
            }
            if (!['skip', 'scout', 'grab'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid feast move' }))
              return
            }
            if (!gameState.p4Feast[tributeId]) {
              gameState.p4Feast[tributeId] = strategy
              recomputeP4Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, choice: gameState.p4Feast[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase3_location' || gameState.phase === 'p3_location') {
            if (gameState.phase !== 'p3_location') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Location voting is closed' }))
              return
            }
            if (!['puddle', 'pond', 'stream'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid location' }))
              return
            }
            if (!gameState.p3Locations[tributeId]) {
              gameState.p3Locations[tributeId] = strategy
              recomputeP3Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, location: gameState.p3Locations[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase3_purify' || gameState.phase === 'p3_purify') {
            if (gameState.phase !== 'p3_purify') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Purification voting is closed' }))
              return
            }
            if (!['drink', 'purify'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid action' }))
              return
            }
            if (!gameState.p3Actions[tributeId]) {
              gameState.p3Actions[tributeId] = strategy
              recomputeP3Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, action: gameState.p3Actions[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase2' || gameState.phase === 'p2_choice') {
            if (gameState.phase !== 'p2_choice') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Phase 2 voting is closed' }))
              return
            }
            if (!['alliance', 'solo'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid Phase 2 choice' }))
              return
            }
            if (!gameState.p2Choices[tributeId]) {
              const elapsedSec = gameState.votingStartedAt
                ? Math.max(0, Math.round((Date.now() - gameState.votingStartedAt) / 1000))
                : 0
              gameState.p2Choices[tributeId] = {
                choice: strategy,
                responseTime: Math.min(elapsedSec, gameState.durationSeconds)
              }
              recomputeP2Poll()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, choice: gameState.p2Choices[tributeId], game: gameState }))
            return
          }

          if (gameState.phase !== 'choice') {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Voting is closed' }))
            return
          }
          if (!['cornucopia', 'outskirts', 'woods'].includes(strategy)) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid strategy' }))
            return
          }
          if (!gameState.choices[tributeId]) {
            const elapsedSec = gameState.votingStartedAt
              ? Math.max(0, Math.round((Date.now() - gameState.votingStartedAt) / 1000))
              : 0
            gameState.choices[tributeId] = {
              strategy,
              responseTime: Math.min(elapsedSec, gameState.durationSeconds)
            }
            recomputePoll()
            broadcast('game', gameState)
          }

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, choice: gameState.choices[tributeId], game: gameState }))
        } catch (err) {
          res.statusCode = 400
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
        }
      })
      return
    }

    next()
  }
}
