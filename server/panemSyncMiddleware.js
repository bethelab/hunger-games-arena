const STRATEGY_CONFIG = {
  cornucopia: {
    baseRisk: 0.50,
    basePoints: 20,
    supplies: 'Full Cornucopia Pack',
    tool: {
      name: 'Survival Tool Kit',
      icon: '🛠️',
      effect: 'Water purification tabs & signal flare — helps protect you in later phases!'
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

const P3_COMBO_RISK = {
  'puddle:drink': { illnessProb: 0.65, penalty: 8, label: 'High illness risk' },
  'puddle:purify': { illnessProb: 0.20, penalty: 4, label: 'Safer, but still risky' },
  'pond:drink': { illnessProb: 0.40, penalty: 6, label: 'Moderate illness risk' },
  'pond:purify': { illnessProb: 0.0, penalty: 0, label: 'Good outcome' },
  'stream:drink': { illnessProb: 0.15, penalty: 4, label: 'Lower risk, not guaranteed safe' },
  'stream:purify': { illnessProb: 0.0, penalty: 0, label: 'Best outcome' }
}

const P4_TWISTS = [
  {
    id: 'fire',
    icon: '🔥',
    category: 'Fire',
    headline: 'YOUR ESCAPE ROUTE IS BLOCKED!',
    message: 'Tributes, it appears some of you have become a little too predictable. Your planned escape route is no longer available.'
  },
  {
    id: 'weather',
    icon: '⛈️',
    category: 'Weather',
    headline: 'A SUDDEN STORM MAKES TRAVELLING DANGEROUS!',
    message: 'Tributes, visibility has dropped to zero and lightning is striking the treetops. Moving across open ground is now treacherous.'
  },
  {
    id: 'alliance',
    icon: '👥',
    category: 'Alliance',
    headline: 'YOUR PARTNER HAS DISAPPEARED!',
    message: 'Tributes, the smoke has separated the arena. You have lost contact with your allies and cannot be sure where they are.'
  },
  {
    id: 'resources',
    icon: '🎒',
    category: 'Resources',
    headline: 'YOUR SUPPLIES HAVE BEEN LOST!',
    message: 'Tributes, in the scramble away from the flames, your pack was left behind. You must decide your next move with nothing in hand.'
  }
]

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
  let tributes = []
  let timerState = {
    running: false,
    countdown: 30,
    duration: 30,
    visible: false,
    lastTick: Date.now()
  }

  function createInitialGameState(duration = 30) {
    return {
      phase: 'lobby',
      completedPhase: 0,
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
      // Phase 4
      p4Initial: {},
      p4Twist: null,
      p4Rethink: {},
      p4InitialPoll: { stay: 0, river: 0, alliance: 0, totalVoted: 0, totalTributes: 0 },
      p4TwistPoll: { stick: 0, change: 0, totalVoted: 0, totalTributes: 0 },
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
    let stay = 0, river = 0, alliance = 0
    let stick = 0, change = 0
    for (const t of tributes) {
      const init = gameState.p4Initial[t.id]
      if (init?.move === 'stay') stay++
      else if (init?.move === 'river') river++
      else if (init?.move === 'alliance') alliance++

      const rev = gameState.p4Rethink[t.id]
      if (rev?.action === 'stick') stick++
      else if (rev?.action === 'change') change++
    }
    gameState.p4InitialPoll = {
      stay, river, alliance,
      totalVoted: stay + river + alliance,
      totalTributes: tributes.length
    }
    gameState.p4TwistPoll = {
      stick, change,
      totalVoted: stick + change,
      totalTributes: tributes.length
    }
  }

  function recomputeP5Votes() {
    const counts = {}
    for (const t of tributes) counts[t.id] = 0
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
    const probOutskirts = STRATEGY_CONFIG.outskirts.baseRisk * (gameState.poll.outskirts / totalTributes)

    gameState.scaledRisks = {
      cornucopia: Number((probCornucopia * 100).toFixed(1)),
      outskirts: Number((probOutskirts * 100).toFixed(1)),
      woods: 0
    }

    tributes = tributes.map(t => {
      const choice = gameState.choices[t.id]
      const strategy = choice?.strategy || 'woods'
      const responseTime = choice?.responseTime ?? gameState.durationSeconds
      const config = STRATEGY_CONFIG[strategy] || STRATEGY_CONFIG.woods

      let actualProb = 0
      let latePenalty = 0
      const timeRemaining = Math.max(0, gameState.durationSeconds - responseTime)

      if (strategy === 'cornucopia') {
        actualProb = probCornucopia
        // Steep last-5-second danger for rushing the Cornucopia late (+6% at 5s left up to +36% at 0s)
        if (timeRemaining <= 5) {
          latePenalty = ((6 - timeRemaining) / 5) * 0.30
        }
      } else if (strategy === 'outskirts') {
        actualProb = probOutskirts
        // Moderate last-5-second danger for lingering at the Outskirts (+3% at 5s left up to +18% at 0s)
        if (timeRemaining <= 5) {
          latePenalty = ((6 - timeRemaining) / 5) * 0.15
        }
      }

      const finalElimProb = Math.min(0.95, actualProb + latePenalty)

      const eliminated = finalElimProb > 0 ? Math.random() < finalElimProb : false
      const speedBonus = eliminated ? 0 : getSpeedBonus(responseTime)
      const roundPoints = eliminated ? -5 : (config.basePoints + speedBonus)
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      return {
        ...t,
        strategy,
        responseTime,
        latePenaltyPct: Math.round(latePenalty * 100),
        supplies: eliminated ? 'Lost in Arena' : config.supplies,
        arenaTool: !eliminated && config.tool ? config.tool : null,
        survivalStatus: eliminated ? 'eliminated' : 'alive',
        speedBonus,
        roundPoints,
        totalScore: prevScore + roundPoints
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

    tributes = tributes.map(t => {
      const loc = gameState.p3Locations[t.id] || 'puddle'
      const act = gameState.p3Actions[t.id] || 'drink'
      const locPts = P3_LOCATION_POINTS[loc] ?? 10
      const purifyPts = act === 'purify' ? 4 : 0
      const baseScore = locPts + purifyPts

      const combo = P3_COMBO_RISK[`${loc}:${act}`] || { illnessProb: 0.5, penalty: 6, label: 'Risky' }
      // Phase 1 Cornucopia Survival Tool Kit halves water contamination illness risk!
      const effectiveIllnessProb = t.arenaTool ? combo.illnessProb * 0.5 : combo.illnessProb
      const gotSick = effectiveIllnessProb > 0 ? Math.random() < effectiveIllnessProb : false
      const penaltyApplied = gotSick ? combo.penalty : 0
      const p3RoundPoints = baseScore - penaltyApplied
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      return {
        ...t,
        p3Location: loc,
        p3Action: act,
        p3GotSick: gotSick,
        p3Penalty: penaltyApplied,
        p3BaseScore: baseScore,
        p3RoundPoints,
        p3OutcomeLabel: combo.label,
        totalScore: prevScore + p3RoundPoints
      }
    })

    gameState.p3Calculated = true
  }

  function startP4Twist() {
    gameState.p4Twist = P4_TWISTS[Math.floor(Math.random() * P4_TWISTS.length)]
    gameState.p4Rethink = {}
    gameState.phase = 'p4_twist'
    timerState.duration = 15
    timerState.countdown = 15
    timerState.running = true
    recomputeP4Polls()
  }

  function calculatePhase4Outcomes() {
    if (gameState.p4Calculated) return
    recomputeP4Polls()

    tributes = tributes.map(t => {
      const init = gameState.p4Initial[t.id]
      const rev = gameState.p4Rethink[t.id]

      const madeInitial = Boolean(init?.move)
      const hasReason = Boolean((init?.reason && init.reason.trim().length >= 3) || (rev?.reason && rev.reason.trim().length >= 3))
      const adaptedToTwist = Boolean(rev?.action)
      const withinCountdown = Boolean(init?.inTime || rev?.inTime)

      const ptsInitial = madeInitial ? 5 : 0
      const ptsReason = hasReason ? 5 : 0
      const ptsAdapt = adaptedToTwist ? 5 : 0
      const ptsTimer = withinCountdown ? 5 : 0
      const p4RoundPoints = ptsInitial + ptsReason + ptsAdapt + ptsTimer
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      return {
        ...t,
        p4InitialMove: init?.move || null,
        p4TwistAction: rev?.action || null,
        p4FinalMove: rev?.action === 'change' ? (rev.newMove || init?.move) : (init?.move || null),
        p4Reason: rev?.reason || init?.reason || '',
        p4Breakdown: { ptsInitial, ptsReason, ptsAdapt, ptsTimer },
        p4RoundPoints,
        totalScore: prevScore + p4RoundPoints
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
      if (idx < 3 && (entry.votes > 0 || (idx === 0 && entry.pitched))) {
        const bonus = bonuses[idx]
        bonusMap[entry.tributeId] = bonus
        podium.push({ ...entry, rank: idx + 1, bonus })
      }
    })

    tributes = tributes.map(t => {
      const pitchData = gameState.p5Pitches[t.id]
      const pitchText = pitchData?.pitch?.trim() || ''
      const votes = gameState.p5VoteCounts[t.id] || 0

      const ptsPitch = pitchText.length >= 3 ? 5 : 0
      const ptsCreative = (pitchData?.persona && pitchData.persona !== 'myself') || pitchText.length >= 25 ? 5 : 0
      const ptsPersuasive = votes >= 1 || pitchText.length >= 55 ? 5 : 0
      const ptsSponsor = bonusMap[t.id] || 0
      const p5RoundPoints = ptsPitch + ptsCreative + ptsPersuasive + ptsSponsor
      const prevScore = typeof t.totalScore === 'number' ? t.totalScore : 0

      return {
        ...t,
        p5Persona: pitchData?.persona || 'myself',
        p5Pitch: pitchText,
        p5Votes: votes,
        p5SponsorBonus: ptsSponsor,
        p5Breakdown: { ptsPitch, ptsCreative, ptsPersuasive, ptsSponsor },
        p5RoundPoints,
        totalScore: prevScore + p5RoundPoints
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

  // Server-side 1-second countdown ticker
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
          startP4Twist()
          broadcastAll()
          return
        } else if (gameState.phase === 'p4_twist') {
          calculatePhase4Outcomes()
          gameState.phase = 'p4_outcome'
          broadcastAll()
          return
        } else if (gameState.phase === 'p5_pitch') {
          gameState.phase = 'p5_vote'
          timerState.duration = 45
          timerState.countdown = 45
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

  // SSE keep-alive heartbeat every 25s so Render/cloud proxies never drop idle streams
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
            tribute.pedestalNumber = null
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, tribute, tributes }))
            return
          }

          const existingIndex = tributes.findIndex(t => t.id === tribute.id)
          if (existingIndex >= 0) {
            tributes[existingIndex] = { ...tributes[existingIndex], ...tribute }
          } else {
            const taken = new Set(tributes.map(t => t.pedestalNumber))
            let ped = 1
            for (let i = 1; i <= 12; i++) {
              if (!taken.has(i)) { ped = i; break }
            }
            tribute.pedestalNumber = ped
            tribute.totalScore = tribute.totalScore ?? 0
            tribute.survivalStatus = tribute.survivalStatus ?? 'alive'
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
            tributes = []
            timerState.running = false
            timerState.countdown = 30
            timerState.duration = 30
            timerState.visible = false
            gameState = createInitialGameState(30)
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
          const { action, durationSeconds } = JSON.parse(body)
          if (typeof durationSeconds === 'number' && durationSeconds >= 5) {
            gameState.durationSeconds = durationSeconds
            timerState.duration = durationSeconds
          }

          if (action === 'start_intro') {
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
            gameState.phase = 'lesson'
          } else if (action === 'back_to_lobby') {
            timerState.running = false
            timerState.countdown = gameState.durationSeconds
            if (gameState.phase === 'lesson') gameState.completedPhase = Math.max(gameState.completedPhase, 1)
            else if (gameState.phase === 'p2_lesson') gameState.completedPhase = Math.max(gameState.completedPhase, 2)
            else if (gameState.phase === 'p3_lesson') gameState.completedPhase = Math.max(gameState.completedPhase, 3)
            else if (gameState.phase === 'p4_lesson') gameState.completedPhase = Math.max(gameState.completedPhase, 4)
            else if (gameState.phase === 'p5_lesson' || gameState.phase === 'finale') gameState.completedPhase = Math.max(gameState.completedPhase, 5)
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
            gameState.phase = 'p3_lesson'
          } else if (action === 'start_p4_intro') {
            const p4Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p4_intro'
            gameState.durationSeconds = p4Secs
            gameState.p4Initial = {}
            gameState.p4Twist = null
            gameState.p4Rethink = {}
            gameState.p4Calculated = false
            timerState.running = false
            timerState.duration = p4Secs
            timerState.countdown = p4Secs
            recomputeP4Polls()
          } else if (action === 'start_p4_event') {
            const p4Secs = typeof durationSeconds === 'number' ? durationSeconds : 30
            gameState.phase = 'p4_event'
            gameState.durationSeconds = p4Secs
            gameState.p4Initial = {}
            gameState.p4Twist = null
            gameState.p4Rethink = {}
            gameState.p4Calculated = false
            gameState.votingStartedAt = Date.now()
            timerState.duration = p4Secs
            timerState.countdown = p4Secs
            timerState.running = true
            recomputeP4Polls()
          } else if (action === 'trigger_p4_twist') {
            startP4Twist()
          } else if (action === 'reveal_p4_outcome') {
            timerState.running = false
            calculatePhase4Outcomes()
            gameState.phase = 'p4_outcome'
          } else if (action === 'show_p4_lesson') {
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
            gameState.phase = 'p5_vote'
            gameState.p5Votes = {}
            recomputeP5Votes()
            timerState.duration = 45
            timerState.countdown = 45
            timerState.running = true
          } else if (action === 'reveal_p5_winner') {
            timerState.running = false
            calculatePhase5Outcomes()
            gameState.phase = 'p5_winner'
          } else if (action === 'show_p5_lesson') {
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
          const { tributeId, strategy, phase: votePhase, reason, newMove, persona, pitch } = JSON.parse(body)

          if (votePhase === 'phase5_pitch' || gameState.phase === 'p5_pitch') {
            if (gameState.phase !== 'p5_pitch') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Pitch submissions are closed' }))
              return
            }
            gameState.p5Pitches[tributeId] = {
              persona: persona || 'myself',
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

          if (votePhase === 'phase4_initial' || gameState.phase === 'p4_event') {
            if (gameState.phase !== 'p4_event') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Phase 4 initial voting is closed' }))
              return
            }
            if (!['stay', 'river', 'alliance'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid Phase 4 move' }))
              return
            }
            if (!gameState.p4Initial[tributeId]) {
              gameState.p4Initial[tributeId] = {
                move: strategy,
                reason: typeof reason === 'string' ? reason.trim().slice(0, 160) : '',
                inTime: timerState.countdown > 0
              }
              recomputeP4Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, initial: gameState.p4Initial[tributeId], game: gameState }))
            return
          }

          if (votePhase === 'phase4_twist' || gameState.phase === 'p4_twist') {
            if (gameState.phase !== 'p4_twist') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Twist voting is closed' }))
              return
            }
            if (!['stick', 'change'].includes(strategy)) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid twist response' }))
              return
            }
            if (!gameState.p4Rethink[tributeId]) {
              gameState.p4Rethink[tributeId] = {
                action: strategy,
                newMove: strategy === 'change' ? (newMove || null) : (gameState.p4Initial[tributeId]?.move || null),
                reason: typeof reason === 'string' ? reason.trim().slice(0, 160) : '',
                inTime: timerState.countdown > 0
              }
              recomputeP4Polls()
              broadcast('game', gameState)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, rethink: gameState.p4Rethink[tributeId], game: gameState }))
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
