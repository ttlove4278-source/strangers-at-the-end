/**
 * 音频引擎 — Web Audio API 程序化生成
 * 无需外部音频文件
 */
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
      console.warn('AudioContext not supported');
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ===== 音效 =====

  /** CRT开机声 */
  playCRTBoot() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    // 噪声 burst
    const dur = 0.15;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.3));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    src.connect(gain).connect(this.masterGain);
    src.start(now);
  }

  /** 打字机按键声 */
  playTypewriter() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  /** 菜单选择音 */
  playSelect() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.05);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  /** 菜单确认音 */
  playConfirm() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    [660, 880, 1100].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
      osc.connect(gain).connect(this.masterGain);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.16);
    });
  }

  /** 蝉鸣循环 */
  startCicadas() {
    if (!this.enabled || this.activeSources.has('cicadas')) return;
    this.init();

    const createCicada = (baseFreq, panValue) => {
      const osc = this.ctx.createOscillator();
      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gain = this.ctx.createGain();
      const panner = this.ctx.createStereoPanner();

      osc.type = 'sawtooth';
      osc.frequency.value = baseFreq;
      modOsc.type = 'sine';
      modOsc.frequency.value = 5 + Math.random() * 15;
      modGain.gain.value = baseFreq * 0.3;

      modOsc.connect(modGain);
      modGain.connect(osc.frequency);

      gain.gain.value = 0;
      panner.pan.value = panValue;

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain);

      // 呼吸式音量
      const fadeIn = () => {
        const now = this.ctx.currentTime;
        const dur = 2 + Math.random() * 4;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.012, now + 0.5);
        gain.gain.setValueAtTime(0.012, now + dur - 0.5);
        gain.gain.linearRampToValueAtTime(0, now + dur);
        setTimeout(fadeIn, dur * 1000 + Math.random() * 3000);
      };

      osc.start();
      modOsc.start();
      fadeIn();

      return { osc, modOsc, gain };
    };

    const cicadas = [
      createCicada(4200, -0.7),
      createCicada(3800, 0.5),
      createCicada(4600, 0.2),
    ];

    this.activeSources.set('cicadas', cicadas);
  }

  stopCicadas() {
    const cicadas = this.activeSources.get('cicadas');
    if (!cicadas) return;
    cicadas.forEach(c => {
      c.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
      setTimeout(() => {
        c.osc.stop();
        c.modOsc.stop();
      }, 1200);
    });
    this.activeSources.delete('cicadas');
  }

  /** 贩卖机嗡鸣 */
  startVendingHum() {
    if (!this.enabled || this.activeSources.has('vending')) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 60;
    gain.gain.value = 0.015;
    osc.connect(gain).connect(this.masterGain);
    osc.start();
    this.activeSources.set('vending', { osc, gain });
  }

  stopVendingHum() {
    const v = this.activeSources.get('vending');
    if (!v) return;
    v.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    setTimeout(() => v.osc.stop(), 600);
    this.activeSources.delete('vending');
  }

  /** 故障音效 */
  playGlitch() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const dur = 0.3;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / this.ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin(t * 100) * Math.exp(-t * 5);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;
    src.connect(gain).connect(this.masterGain);
    src.start(now);
  }

  /** 低音脉冲（场景转换） */
  playTransition() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.8);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gain).connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  stopAll() {
    this.activeSources.forEach((source, key) => {
      if (Array.isArray(source)) {
        source.forEach(s => {
          try { s.osc.stop(); s.modOsc && s.modOsc.stop(); } catch(e) {}
        });
      } else {
        try { source.osc.stop(); } catch(e) {}
      }
    });
    this.activeSources.clear();
  }
}

const audio = new AudioEngine();
