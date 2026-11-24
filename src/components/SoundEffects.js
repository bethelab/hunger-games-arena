// Web Audio API synthesizer for cinematic Hunger Games sound effects
// Completely zero external asset dependencies

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Iconic Capitol Fanfare (Trumpet-like brass triad)
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [
      { f: 293.66, time: 0, dur: 0.25 }, // D4
      { f: 369.99, time: 0.26, dur: 0.25 }, // F#4
      { f: 440.00, time: 0.52, dur: 0.35 }, // A4
      { f: 587.33, time: 0.90, dur: 0.9 }   // D5 (held)
    ];

    const now = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, now + n.time);

      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.18, now + n.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + n.time);
      osc.stop(now + n.time + n.dur);
    });
  }

  // Hydraulic Pedestal Rising Sound
  playPedestalRise() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Low hydraulic rumble
    const rumble = this.ctx.createOscillator();
    const rumbleGain = this.ctx.createGain();
    rumble.type = 'triangle';
    rumble.frequency.setValueAtTime(60, now);
    rumble.frequency.linearRampToValueAtTime(140, now + 1.2);

    rumbleGain.gain.setValueAtTime(0.01, now);
    rumbleGain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    rumble.connect(rumbleGain);
    rumbleGain.connect(this.ctx.destination);
    rumble.start(now);
    rumble.stop(now + 1.4);

    // High energy beam chime
    const beam = this.ctx.createOscillator();
    const beamGain = this.ctx.createGain();
    beam.type = 'sine';
    beam.frequency.setValueAtTime(520, now + 0.4);
    beam.frequency.exponentialRampToValueAtTime(1100, now + 1.3);

    beamGain.gain.setValueAtTime(0.001, now + 0.4);
    beamGain.gain.linearRampToValueAtTime(0.12, now + 0.9);
    beamGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    beam.connect(beamGain);
    beamGain.connect(this.ctx.destination);
    beam.start(now + 0.4);
    beam.stop(now + 1.6);
  }

  // Cannon salute (deep sub boom)
  playCannon() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 1.5);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.8);
  }

  // Countdown pulse tick
  playBeep(high = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(high ? 880 : 440, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }
}

export const sound = new SoundController();
