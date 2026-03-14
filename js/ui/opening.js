const Opening = {
  container: null,
  skipped: false,
  _handler: null,

  async play() {
    this.container = document.querySelector('#screen-opening .op-container');
    this.container.innerHTML = '';
    this.skipped = false;

    this._handler = (e) => {
      if (e.code === 'Space' || e.type === 'click') this.skipped = true;
    };
    document.addEventListener('keydown', this._handler);
    document.querySelector('.op-skip').addEventListener('click', this._handler);

    await this.phaseDate();
    if (this.skipped) return this.cleanup();
    await this.phaseQuote();
    if (this.skipped) return this.cleanup();
    await this.phaseChars();
    if (this.skipped) return this.cleanup();
    await this.phaseTitle();
    if (this.skipped) return this.cleanup();
    await this.wait(2200);
    this.cleanup();
  },

  async phaseDate() {
    const el = document.createElement('div');
    el.className = 'op-date';
    el.textContent = '1 9 9 9 . 7 . 1 3';
    this.container.appendChild(el);
    await this.wait(150);
    el.classList.add('animate');
    audio.playGlitch();
    await this.wait(2200);
    el.remove();
  },

  async phaseQuote() {
    const w = document.createElement('div');
    w.className = 'op-quote';
    const tb = document.createElement('div');
    tb.className = 'op-quote-text';
    ['人必须想象', '西西弗是幸福的', '——但西西弗', '从未被问过'].forEach(l => {
      const s = document.createElement('span');
      s.className = 'vline';
      s.textContent = l;
      tb.appendChild(s);
    });
    const attr = document.createElement('div');
    attr.className = 'op-quote-attr';
    attr.textContent = '——Albert Camus, 1942';
    w.appendChild(tb);
    w.appendChild(attr);
    this.container.appendChild(w);
    const vlines = tb.querySelectorAll('.vline');
    for (let i = 0; i < vlines.length; i++) {
      if (this.skipped) return;
      await this.wait(500);
      vlines[i].classList.add('animate');
    }
    await this.wait(700);
    attr.classList.add('animate');
    await this.wait(2200);
    w.style.transition = 'opacity 0.8s';
    w.style.opacity = '0';
    await this.wait(1000);
    w.remove();
  },

  async phaseChars() {
    const chars = [
      { name: '夏目 珀', sub: 'CAMUS — 西西弗的愉悦', color: 'var(--camus)' },
      { name: '御厨 光', sub: 'PLATO — 洞穴', color: 'var(--plato)' },
      { name: '高城 黎', sub: 'NIETZSCHE — 超人', color: 'var(--nietzsche)' },
      { name: '久我 冻夜', sub: 'KANT — 純粹理性批判', color: 'var(--kant)' },
    ];
    for (const c of chars) {
      if (this.skipped) return;
      const el = document.createElement('div');
      el.className = 'op-silhouette';
      const stripe = document.createElement('div');
      stripe.className = 'op-sil-stripe';
      stripe.style.background = c.color;
      const name = document.createElement('div');
      name.className = 'op-sil-name';
      name.textContent = c.name;
      name.dataset.sub = c.sub;
      name.style.color = c.color;
      name.style.textShadow = `0 0 40px ${c.color}40`;
      el.appendChild(stripe);
      el.appendChild(name);
      this.container.appendChild(el);
      await this.wait(80);
      stripe.classList.add('animate');
      el.classList.add('animate');
      audio.playCRTBoot();
      await this.wait(850);
      el.remove();
      await this.wait(150);
    }
  },

  async phaseTitle() {
    const w = document.createElement('div');
    w.className = 'op-title-reveal';
    const m = document.createElement('div');
    m.className = 'op-title-main';
    m.textContent = '世紀末異鄉人';
    const s = document.createElement('div');
    s.className = 'op-title-sub';
    s.textContent = '推 石 頭 的 人 們';
    w.appendChild(m);
    w.appendChild(s);
    this.container.appendChild(w);
    await this.wait(200);
    w.classList.add('animate');
    audio.playConfirm();
    await this.wait(1000);
    s.classList.add('animate');
  },

  cleanup() {
    if (this._handler) {
      document.removeEventListener('keydown', this._handler);
      this._handler = null;
    }
  },

  wait(ms) {
    return new Promise(r => {
      if (this.skipped) return r();
      setTimeout(r, ms);
    });
  }
};
