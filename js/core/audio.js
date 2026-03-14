class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.enabled = true;
    this.initialized = false;
    this.activeSources = new Map();
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
      this.initialized = true;
    } catch (e) {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  setVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v));
  }

  playCRTBoot() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const dur = 0.12;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(gain).connect(this.masterGain);
    src.start(now);
  }

  playTypewriter() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.025);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playSelect() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.05);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  playConfirm() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    [660, 880, 1100].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.12);
      osc.connect(gain).connect(this.masterGain);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.13);
    });
  }

  playHit() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const dur = 0.15;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    src.connect(filter).connect(gain).connect(this.masterGain);
    src.start(now);
  }

  playDeclare() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.3);
    osc.frequency.setValueAtTime(440, now + 1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    gain.gain.setValueAtTime(0.12, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.3);
  }

  startCicadas() {
    if (!this.enabled || !this.initialized || this.activeSources.has('cicadas')) return;
    const cicadas = [];
    const configs = [
      { freq: 4200, pan: -0.7 },
      { freq: 3800, pan: 0.5 },
      { freq: 4600, pan: 0.2 },
    ];
    configs.forEach(cfg => {
      const osc = this.ctx.createOscillator();
      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();
      osc.type = 'sawtooth';
      osc.frequency.value = cfg.freq;
      modOsc.type = 'sine';
      modOsc.frequency.value = 5 + Math.random() * 15;
      modGain.gain.value = cfg.freq * 0.3;
      modOsc.connect(modGain).connect(osc.frequency);
      gain.gain.value = 0;
      panner.pan.value = cfg.pan;
      osc.connect(gain).connect(panner).connect(this.masterGain);
      const pulse = () => {
        if (!this.activeSources.has('cicadas')) return;
        const now = this.ctx.currentTime;
        const dur = 2 + Math.random() * 4;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
        gain.gain.setValueAtTime(0.01, now + dur - 0.5);
        gain.gain.linearRampToValueAtTime(0, now + dur);
        setTimeout(pulse, dur * 1000 + Math.random() * 3000);
      };
      osc.start();
      modOsc.start();
      pulse();
      cicadas.push({ osc, modOsc, gain });
    });
    this.activeSources.set('cicadas', cicadas);
  }

  stopCicadas() {
    const c = this.activeSources.get('cicadas');
    if (!c) return;
    c.forEach(s => {
      s.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => { try { s.osc.stop(); s.modOsc.stop(); } catch(e){} }, 1200);
    });
    this.activeSources.delete('cicadas');
  }

  startVendingHum() {
    if (!this.enabled || !this.initialized || this.activeSources.has('vending')) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.value = 0.012;
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    this.activeSources.set('vending', { osc, gain });
  }

  stopVendingHum() {
    const v = this.activeSources.get('vending');
    if (!v) return;
    v.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    setTimeout(() => { try { v.osc.stop(); } catch(e){} }, 600);
    this.activeSources.delete('vending');
  }

  playGlitch() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const dur = 0.25;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin((i / this.ctx.sampleRate) * 100) * Math.exp(-(i / this.ctx.sampleRate) * 5);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;
    src.connect(gain).connect(this.masterGain);
    src.start(now);
  }

  playTransition() {
    if (!this.enabled || !this.initialized) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.7);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.8);
  }

  stopAll() {
    this.activeSources.forEach(source => {
      if (Array.isArray(source)) {
        source.forEach(s => { try { s.osc.stop(); if(s.modOsc) s.modOsc.stop(); } catch(e){} });
      } else {
        try { source.osc.stop(); } catch(e){}
      }
    });
    this.activeSources.clear();
  }
}

const audio = new AudioEngine();
