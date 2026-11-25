// Multi-Device & Multi-Tab Synchronization Service
const STORAGE_KEY = "panem_arena_tributes_shared_v4";
const BROADCAST_CHANNEL = "panem_broadcast_channel_v4";
const MAX_PEDESTALS = 12;

const DEFAULT_GAME_STATE = {
  phase: 'lobby',
  completedPhase: 0,
  durationSeconds: 30,
  votingStartedAt: null,
  choices: {},
  poll: {
    cornucopia: 0,
    outskirts: 0,
    woods: 0,
    totalVoted: 0,
    totalTributes: 0
  },
  scaledRisks: {
    cornucopia: 0,
    outskirts: 0,
    woods: 0
  },
  roundCalculated: false,
  p2Choices: {},
  p2Poll: {
    alliance: 0,
    solo: 0,
    totalVoted: 0,
    totalTributes: 0
  },
  alliances: [],
  soloIds: [],
  p2Assigned: false,
  p3Locations: {},
  p3Actions: {},
  p3LocationPoll: { puddle: 0, pond: 0, stream: 0, totalVoted: 0, totalTributes: 0 },
  p3ActionPoll: { drink: 0, purify: 0, totalVoted: 0, totalTributes: 0 },
  p3Calculated: false,
  p4Initial: {},
  p4Twist: null,
  p4Rethink: {},
  p4InitialPoll: { stay: 0, river: 0, alliance: 0, totalVoted: 0, totalTributes: 0 },
  p4TwistPoll: { stick: 0, change: 0, totalVoted: 0, totalTributes: 0 },
  p4Calculated: false,
  p5Pitches: {},
  p5Votes: {},
  p5VoteCounts: {},
  p5Podium: [],
  p5Calculated: false
};

class SyncService {
  constructor() {
    this.tributeListeners = new Set();
    this.timerListeners = new Set();
    this.gameListeners = new Set();
    this.tributes = [];
    this.timer = { running: false, countdown: 30, duration: 30, visible: false };
    this.game = { ...DEFAULT_GAME_STATE };
    this.sseSource = null;
    this.channel = null;

    // 1. BroadcastChannel for intra-browser multi-tab sync
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL);
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'TRIBUTES') {
            this.tributes = event.data.tributes;
            this.notifyTributes();
          } else if (event.data?.type === 'TIMER') {
            this.timer = event.data.timer;
            this.notifyTimer();
          } else if (event.data?.type === 'GAME') {
            this.game = event.data.game;
            this.notifyGame();
          }
        };
      } catch (e) {}
    }

    // 2. Server-Sent Events (SSE) for cross-device network sync
    this.initNetworkSync();
  }

  initNetworkSync() {
    if (typeof window === 'undefined') return;

    try {
      this.sseSource = new EventSource('/api/events');

      this.sseSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.tributes) {
            this.tributes = data.tributes;
            this.notifyTributes();
          }
          if (data.timer) {
            this.timer = data.timer;
            this.notifyTimer();
          }
          if (data.game) {
            this.game = data.game;
            this.notifyGame();
          }
        } catch (err) {}
      };

      this.sseSource.addEventListener('tributes', (e) => {
        try {
          this.tributes = JSON.parse(e.data);
          this.notifyTributes();
        } catch (err) {}
      });

      this.sseSource.addEventListener('timer', (e) => {
        try {
          this.timer = JSON.parse(e.data);
          this.notifyTimer();
        } catch (err) {}
      });

      this.sseSource.addEventListener('game', (e) => {
        try {
          this.game = JSON.parse(e.data);
          this.notifyGame();
        } catch (err) {}
      });
    } catch (e) {
      this.loadLocalFallback();
    }
  }

  loadLocalFallback() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.tributes = JSON.parse(raw);
        this.notifyTributes();
      }
    } catch (e) {}
  }

  getTributes() {
    return this.tributes;
  }

  getTimer() {
    return this.timer;
  }

  getGame() {
    return this.game;
  }

  subscribe(onTributesChange, onTimerChange, onGameChange) {
    if (onTributesChange) {
      this.tributeListeners.add(onTributesChange);
      onTributesChange(this.tributes);
    }
    if (onTimerChange) {
      this.timerListeners.add(onTimerChange);
      onTimerChange(this.timer);
    }
    if (onGameChange) {
      this.gameListeners.add(onGameChange);
      onGameChange(this.game);
    }

    return () => {
      if (onTributesChange) this.tributeListeners.delete(onTributesChange);
      if (onTimerChange) this.timerListeners.delete(onTimerChange);
      if (onGameChange) this.gameListeners.delete(onGameChange);
    };
  }

  notifyTributes() {
    this.tributeListeners.forEach(fn => fn(this.tributes));
  }

  notifyTimer() {
    this.timerListeners.forEach(fn => fn(this.timer));
  }

  notifyGame() {
    this.gameListeners.forEach(fn => fn(this.game));
  }

  // Register tribute onto the next sequential pedestal (1-12) or claim single Gamemaker slot
  async registerTribute(tribute) {
    try {
      const res = await fetch('/api/tributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tribute)
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error || 'Could not register', rejected: true };
      }
      if (data.game) {
        this.game = data.game;
        this.notifyGame();
      }
      if (data.tributes) {
        this.tributes = data.tributes;
        this.notifyTributes();
        return data.tribute;
      }
      return data.tribute || tribute;
    } catch (e) {}

    if (tribute.role === 'gamemaker') {
      tribute.pedestalNumber = null;
      return tribute;
    }

    // Offline fallback
    const current = [...this.tributes];
    const existingIndex = current.findIndex(t => t.id === tribute.id);

    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...tribute };
    } else {
      const taken = new Set(current.map(t => t.pedestalNumber));
      let ped = 1;
      for (let i = 1; i <= MAX_PEDESTALS; i++) {
        if (!taken.has(i)) {
          ped = i;
          break;
        }
      }
      tribute.pedestalNumber = ped;
      tribute.totalScore = tribute.totalScore ?? 0;
      tribute.survivalStatus = tribute.survivalStatus ?? 'alive';
      current.push(tribute);
    }

    this.tributes = current;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      if (this.channel) {
        this.channel.postMessage({ type: 'TRIBUTES', tributes: current });
      }
    } catch (e) {}

    this.notifyTributes();
    return tribute;
  }

  // Gamemaker: start, pause, reset, set_duration, toggle_visibility, reset_arena
  async controlTimer(action, countdown = 30, extra = {}) {
    try {
      const res = await fetch('/api/timer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, countdown, ...extra })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.timer) {
          this.timer = data.timer;
          this.notifyTimer();
        }
        if (data.game) {
          this.game = data.game;
          this.notifyGame();
        }
        return;
      }
    } catch (e) {}

    // Offline fallback
    if (action === 'toggle_visibility') {
      this.timer.visible = typeof extra.visible === 'boolean' ? extra.visible : !this.timer.visible;
    } else if (action === 'set_duration') {
      this.timer.duration = countdown;
      if (!this.timer.running) this.timer.countdown = countdown;
      this.game.durationSeconds = countdown;
      this.notifyGame();
    } else if (action === 'start') {
      this.timer.running = true;
    } else if (action === 'pause') {
      this.timer.running = false;
    } else if (action === 'reset') {
      this.timer.running = false;
      this.timer.countdown = countdown;
      this.timer.duration = countdown;
    } else if (action === 'reset_arena') {
      this.tributes = [];
      this.timer.running = false;
      this.timer.countdown = this.timer.duration;
      this.game = { ...DEFAULT_GAME_STATE, durationSeconds: this.timer.duration };
      this.notifyTributes();
      this.notifyGame();
    }

    try {
      if (this.channel) {
        this.channel.postMessage({ type: 'TIMER', timer: this.timer });
        this.channel.postMessage({ type: 'GAME', game: this.game });
      }
    } catch (e) {}
    this.notifyTimer();
  }

  // Gamemaker: advance game phases ('start_intro' | 'start_choice' | 'show_results' | 'reveal_consequences' | 'show_lesson' | 'back_to_lobby')
  async controlGame(action, durationSeconds) {
    try {
      const res = await fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, durationSeconds })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.game) {
          this.game = data.game;
          this.notifyGame();
        }
        if (data.timer) {
          this.timer = data.timer;
          this.notifyTimer();
        }
        if (data.tributes) {
          this.tributes = data.tributes;
          this.notifyTributes();
        }
        return data;
      }
    } catch (e) {}
    return null;
  }

  // Tribute: submit private strategy choice during Phase 1, 2, 3, or 4
  async submitVote(tributeId, strategy, phase = 'phase1', extra = {}) {
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tributeId, strategy, phase, ...extra })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.game) {
          this.game = data.game;
          this.notifyGame();
        }
        return data;
      }
    } catch (e) {}
    return null;
  }
}

export const syncService = new SyncService();
