const PoemScreen = {
  container: null,
  linesEl: null,
  authorEl: null,
  skipped: false,
  _handler: null,

  async play(poemData) {
    const screen = document.getElementById('screen-poem');
    this.container = screen.querySelector('.poem-container');
    this.linesEl = screen.querySelector('.poem-lines');
    this.authorEl = screen.querySelector('.poem-author');
    this.skipped = false;

    this.linesEl.innerHTML = '';
    this.authorEl.textContent = '';
    this.authorEl.classList.remove('visible');
    this.container.classList.remove('active');

    this._handler = (e) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') this.skipped = true;
    };
    document.addEventListener('keydown', this._handler);
    screen.addEventListener('click', this._handler);

    poemData.lines.forEach((line, i) => {
      const el = document.createElement('div');
      el.className = 'poem-line';
      if (poemData.highlight && poemData.highlight.includes(i)) {
        el.innerHTML = '<span class="poem-highlight">' + line + '</span>';
      } else {
        el.textContent = line;
      }
      this.linesEl.appendChild(el);
    });

    await this.wait(300);
    this.container.classList.add('active');

    const lineEls = this.linesEl.querySelectorAll('.poem-line');
    for (let i = 0; i < lineEls.length; i++) {
      if (this.skipped) break;
      await this.wait(700);
      lineEls[i].classList.add('visible');
      audio.playTypewriter();
    }

    if (!this.skipped) {
      await this.wait(1000);
      this.authorEl.textContent = poemData.author;
      this.authorEl.classList.add('visible');
      await this.wait(2500);
    }

    // 消散
    lineEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('fading'), i * 80);
    });
    this.authorEl.style.transition = 'opacity 0.8s';
    this.authorEl.style.opacity = '0';
    await this.wait(lineEls.length * 80 + 800);

    document.removeEventListener('keydown', this._handler);
    screen.removeEventListener('click', this._handler);
    this._handler = null;
  },

  wait(ms) {
    return new Promise(r => { if (this.skipped) return r(); setTimeout(r, ms); });
  }
};
