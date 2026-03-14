const Transitions = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('transition-overlay');
  },

  async switchScreen(fromId, toId, type = 'fade', duration = 600) {
    const from = document.getElementById('screen-' + fromId);
    const to = document.getElementById('screen-' + toId);
    if (!from || !to) return;

    switch (type) {
      case 'fade': await this._fade(from, to, duration); break;
      case 'cut': this._cut(from, to); break;
      case 'glitch': await this._glitch(from, to, duration); break;
      case 'crt_off': await this._crtOff(from, to, duration); break;
      default: await this._fade(from, to, duration);
    }
    GameState.currentScreen = toId;
  },

  async _fade(from, to, dur) {
    this.overlay.style.transition = `opacity ${dur/2}ms var(--ease-in-out)`;
    this.overlay.classList.add('active');
    await this.wait(dur / 2);
    from.classList.remove('active');
    to.classList.add('active');
    audio.playTransition();
    this.overlay.classList.remove('active');
    await this.wait(dur / 2);
  },

  _cut(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
  },

  async _glitch(from, to, dur) {
    from.classList.add('screen-shake');
    audio.playGlitch();
    await this.wait(200);
    this.overlay.style.transition = 'opacity 80ms';
    this.overlay.classList.add('active');
    await this.wait(80);
    from.classList.remove('active', 'screen-shake');
    to.classList.add('active');
    await this.wait(80);
    this.overlay.classList.remove('active');
    await this.wait(dur - 360);
  },

  async _crtOff(from, to, dur) {
    from.style.transition = `transform ${dur*0.6}ms var(--ease-in-out), opacity ${dur*0.4}ms`;
    from.style.transform = 'scaleY(0.008)';
    await this.wait(dur * 0.6);
    from.style.transform = 'scaleX(0.008) scaleY(0.008)';
    from.style.opacity = '0';
    await this.wait(dur * 0.4);
    from.classList.remove('active');
    from.style.transform = '';
    from.style.opacity = '';
    from.style.transition = '';
    to.classList.add('active');
  },

  async fadeToBlack(dur = 800) {
    this.overlay.style.transition = `opacity ${dur}ms var(--ease-in-out)`;
    this.overlay.classList.add('active');
    await this.wait(dur);
  },

  async fadeFromBlack(dur = 800) {
    this.overlay.style.transition = `opacity ${dur}ms var(--ease-in-out)`;
    this.overlay.classList.remove('active');
    await this.wait(dur);
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
