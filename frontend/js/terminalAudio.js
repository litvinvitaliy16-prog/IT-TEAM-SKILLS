/**
 * Web Audio API Vintage Mechanical Keyboard & Cyber Sound Synthesizer
 * Generates rich tactile mechanical keypresses (IBM Model M / Cherry MX style) and terminal effects.
 */
class TerminalAudio {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.noiseBuffer = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this._createNoiseBuffer();
      }
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Pre-generate white noise buffer for mechanical click transient
  _createNoiseBuffer() {
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.05; // 50ms of noise
    this.noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Vintage Mechanical Keyboard Typing Sound (Dual-stage Click + Clack)
   * Simulates the sharp buckling spring click + bottom-out hollow keycap clack.
   */
  playKeypress() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;

      // 1. CLICK TRANSIENT (High frequency switch click ~3.5kHz)
      if (this.noiseBuffer) {
        const noise = this.audioCtx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const noiseFilter = this.audioCtx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        // Random variation per key
        noiseFilter.frequency.setValueAtTime(3200 + Math.random() * 800, now);
        noiseFilter.Q.setValueAtTime(3.5, now);

        const noiseGain = this.audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.06 + Math.random() * 0.02, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioCtx.destination);

        noise.start(now);
        noise.stop(now + 0.015);
      }

      // 2. CLACK BODY (Mid-frequency hollow keycap bottom-out resonance ~400-800Hz)
      const oscClack = this.audioCtx.createOscillator();
      const gainClack = this.audioCtx.createGain();
      const clackFilter = this.audioCtx.createBiquadFilter();

      const baseFreq = 480 + Math.random() * 160;
      oscClack.type = 'triangle';
      oscClack.frequency.setValueAtTime(baseFreq, now);
      oscClack.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      clackFilter.type = 'lowpass';
      clackFilter.frequency.setValueAtTime(1800, now);

      gainClack.gain.setValueAtTime(0.08 + Math.random() * 0.02, now);
      gainClack.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      oscClack.connect(clackFilter);
      clackFilter.connect(gainClack);
      gainClack.connect(this.audioCtx.destination);

      oscClack.start(now);
      oscClack.stop(now + 0.035);

      // 3. LOW-END THUMP (Keyboard plate reverberation ~100Hz)
      const oscThump = this.audioCtx.createOscillator();
      const gainThump = this.audioCtx.createGain();

      oscThump.type = 'sine';
      oscThump.frequency.setValueAtTime(140 + Math.random() * 30, now);
      oscThump.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      gainThump.gain.setValueAtTime(0.05, now);
      gainThump.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      oscThump.connect(gainThump);
      gainThump.connect(this.audioCtx.destination);

      oscThump.start(now);
      oscThump.stop(now + 0.04);

    } catch (e) {
      // Audio context policy
    }
  }

  // Futuristic cyber UI button click
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Success chime
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      [880, 1320, 1760].forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.035, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (i + 1) * 0.06);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + (i + 1) * 0.06);
      });
    } catch (e) {}
  }

  // Glitch / Error tone
  playError() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }
}

window.terminalAudio = new TerminalAudio();
