/**
 * 画面转场系统
 */
const Transitions = {
  overlay: null,

  init() {
    this.overlay = document.getElementById('transition-overlay');
  },

  /**
   * 切换画面
   * @param {string} fromId - 源画面ID
   * @param {string} toId - 目标画面ID
   * @param {string} type - 转场类型
   * @param {number} duration - 持续时间ms
   */
  async switchScreen(fromId, toId, type = 'fade', duration = 600) {
    const from = document.getElementById(`screen-${fromId}`);
    const to = document.getElementById(`screen-${toId}`);
    if (!from || !to) return;

    switch (type) {
      case 'fade':
        await this.fadeTransition(from, to, duration);
        break;
      case 'cut':
        this.cutTransition(from, to);
        break;
      case 'glitch':
        await this.glitchTransition(from, to, duration);
        break;
      case 'crt_off':
        await this.crtOffTransition(from, to, duration);
        break;
      default:
        await this.fadeTransition(from, to, duration);
    }

    GameState.currentScreen = toId;
  },

  async fadeTransition(from, to, duration) {
    this.overlay.style.transition = `opacity ${duration / 2}ms var(--ease-in-out)`;

    // Fade out
    this.overlay.classList.add('active');
    await this.wait(duration / 2);

    from.classList.remove('active');
    to.classList.add('active');

    audio.playTransition();

    // Fade in
    this.overlay.classList.remove('active');
    await this.wait(duration / 2);
  },

  cutTransition(from, to) {
    from.classList.remove('active');
    to.classList.add('active');
  },

  async glitchTransition(from, to, duration) {
    from.classList.add('screen-shake');
    audio.playGlitch();
    await this.wait(200);

    this.overlay.style.transition = 'opacity 100ms';
    this.overlay.classList.add('active');
    await this.wait(100);

    from.classList.remove('active', 'screen-shake');
    to.classList.add('active');

    await this.wait(100);
    this.overlay.classList.remove('active');
    await this.wait(duration - 400);
  },

  async crtOffTransition(from, to, duration) {
    // CRT关机效果
    from.style.transition = `transform ${duration * 0.6}ms var(--ease-in-out), opacity ${duration * 0.4}ms`;
    from.style.transform = 'scaleY(0.01)';

    await this.wait(duration * 0.6);

    from.style.transform = 'scaleX(0.01) scaleY(0.01)';
    from.style.opacity = '0';

    await this.wait(duration * 0.4);

    from.classList.remove('active');
    from.style.transform = '';
    from.style.opacity = '';
    from.style.transition = '';

    to.classList.add('active');
  },

  /** 画面内淡黑 */
  async fadeToBlack(duration = 800) {
    this.overlay.style.transition = `opacity ${duration}ms var(--ease-in-out)`;
    this.overlay.classList.add('active');
    await this.wait(duration);
  },

  async fadeFromBlack(duration = 800) {
    this.overlay.style.transition = `opacity ${duration}ms var(--ease-in-out)`;
    this.overlay.classList.remove('active');
    await this.wait(duration);
  },

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
