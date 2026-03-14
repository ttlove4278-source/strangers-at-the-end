/**
 * 卷首诗演出系统
 * BLEACH式竖排诗句 + 横向滚入
 */
const PoemScreen = {
  container: null,
  linesEl: null,
  authorEl: null,
  skipped: false,
  skipHandler: null,

  /**
   * 播放卷首诗
   * @param {Object} poemData - { lines, highlight, author }
   */
  async play(poemData) {
    const screen = document.getElementById('screen-poem');
    this.container = screen.querySelector('.poem-container');
    this.linesEl = screen.querySelector('.poem-lines');
    this.authorEl = screen.querySelector('.poem-author');
    this.skipped = false;

    // 清空
    this.linesEl.innerHTML = '';
    this.authorEl.textContent = '';
    this.authorEl.classList.remove('visible');
    this.container.classList.remove('active');

    // 监听跳过
    this.skipHandler = (e) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') {
        this.skipped = true;
      }
    };
    document.addEventListener('keydown', this.skipHandler);
    screen.addEventListener('click', this.skipHandler);

    // 生成诗行
    poemData.lines.forEach((line, index) => {
      const el = document.createElement('div');
      el.className = 'poem-line';
      if (poemData.highlight && poemData.highlight.includes(index)) {
        el.innerHTML = `<span class="poem-highlight">${line}</span>`;
      } else {
        el.textContent = line;
      }
      this.linesEl.appendChild(el);
    });

    // 激活装饰线
    await this.wait(300);
    this.container.classList.add('active');

    // 逐行显现
    const lineEls = this.linesEl.querySelectorAll('.poem-line');
    for (let i = 0; i < lineEls.length; i++) {
      if (this.skipped) break;
      await this.wait(800);
      lineEls[i].classList.add('visible');
      audio.playTypewriter();
    }

    if (!this.skipped) {
      // 署名显现
      await this.wait(1200);
      this.authorEl.textContent = poemData.author;
      this.authorEl.classList.add('visible');

      // 停留
      await this.wait(3000);
    }

    // 退出动画：文字碎裂消散
    await this.dissolve(lineEls);

    // 清理
    document.removeEventListener('keydown', this.skipHandler);
    screen.removeEventListener('click', this.skipHandler);
    this.skipHandler = null;
  },

  async dissolve(lineEls) {
    // 所有行开始消散
    lineEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('fading');
      }, i * 100);
    });

    this.authorEl.style.transition = 'opacity 0.8s';
    this.authorEl.style.opacity = '0';

    await this.wait(lineEls.length * 100 + 1000);

    // 创建粒子碎片效果
    this.createParticles();
    await this.wait(1500);
  },

  createParticles() {
    const container = this.container;
    const count = 30;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${Math.random() > 0.5 ? 'var(--white)' : 'var(--heat)'};
        top: ${30 + Math.random() * 40}%;
        left: ${20 + Math.random() * 60}%;
        opacity: ${0.3 + Math.random() * 0.7};
        pointer-events: none;
        transform: rotate(${Math.random() * 360}deg);
      `;

      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 150;
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      particle.animate([
        { transform: `translate(0, 0) rotate(0deg) scale(1)`, opacity: 0.8 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${180 + Math.random() * 360}deg) scale(0)`, opacity: 0 }
      ], {
        duration: 800 + Math.random() * 1200,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        fill: 'forwards',
        delay: Math.random() * 300
      });

      container.appendChild(particle);
      setTimeout(() => particle.remove(), 2500);
    }
  },

  wait(ms) {
    return new Promise(resolve => {
      if (this.skipped) return resolve();
      setTimeout(resolve, ms);
    });
  }
};
