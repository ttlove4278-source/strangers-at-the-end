/**
 * OP动画序列控制器
 */
const Opening = {
  container: null,
  skipped: false,
  skipHandler: null,

  async play() {
    this.container = document.querySelector('#screen-opening .op-container');
    this.container.innerHTML = '';
    this.skipped = false;

    // 监听跳过
    this.skipHandler = (e) => {
      if (e.code === 'Space' || e.type === 'click') {
        this.skipped = true;
      }
    };
    document.addEventListener('keydown', this.skipHandler);
    document.querySelector('.op-skip')?.addEventListener('click', this.skipHandler);

    // 执行OP序列
    await this.phase_date();
    if (this.skipped) return this.end();

    await this.phase_quote();
    if (this.skipped) return this.end();

    await this.phase_characters();
    if (this.skipped) return this.end();

    await this.phase_title();
    if (this.skipped) return this.end();

    await this.wait(2500);
    this.end();
  },

  async phase_date() {
    const el = document.createElement('div');
    el.className = 'op-date';
    el.textContent = '1 9 9 9 . 7 . 1 3';
    this.container.appendChild(el);

    await this.wait(200);
    el.classList.add('animate');
    audio.playGlitch();

    await this.wait(2500);
    el.remove();
  },

  async phase_quote() {
    const wrapper = document.createElement('div');
    wrapper.className = 'op-quote';
    wrapper.style.opacity = '1';

    const textBlock = document.createElement('div');
    textBlock.className = 'op-quote-text';

    const lines = [
      '人必须想象',
      '西西弗是幸福的',
      '——但西西弗',
      '从未被问过',
    ];

    lines.forEach(line => {
      const span = document.createElement('span');
      span.className = 'vline';
      span.textContent = line;
      textBlock.appendChild(span);
    });

    const attr = document.createElement('div');
    attr.className = 'op-quote-attr';
    attr.textContent = '——Albert Camus, 1942';

    wrapper.appendChild(textBlock);
    wrapper.appendChild(attr);
    this.container.appendChild(wrapper);

    // 逐行出现
    const vlines = textBlock.querySelectorAll('.vline');
    for (let i = 0; i < vlines.length; i++) {
      if (this.skipped) return;
      await this.wait(600);
      vlines[i].classList.add('animate');
    }

    await this.wait(800);
    attr.classList.add('animate');
    await this.wait(2500);

    wrapper.style.transition = 'opacity 1s';
    wrapper.style.opacity = '0';
    await this.wait(1200);
    wrapper.remove();
  },

  async phase_characters() {
    const chars = [
      { name: '夏目 珀', sub: 'CAMUS — 西西弗的愉悦', color: 'var(--camus)' },
      { name: '御厨 光', sub: 'PLATO — 洞穴', color: 'var(--plato)' },
      { name: '高城 黎', sub: 'NIETZSCHE — 超人', color: 'var(--nietzsche)' },
      { name: '久我 冻夜', sub: 'KANT — 純粹理性批判', color: 'var(--kant)' },
    ];

    for (const char of chars) {
      if (this.skipped) return;

      const el = document.createElement('div');
      el.className = 'op-silhouette';

      const stripe = document.createElement('div');
      stripe.className = 'op-sil-stripe';
      stripe.style.background = char.color;

      const nameEl = document.createElement('div');
      nameEl.className = 'op-sil-name';
      nameEl.textContent = char.name;
      nameEl.dataset.sub = char.sub;
      nameEl.style.color = char.color;
      nameEl.style.textShadow = `0 0 40px ${char.color}40`;

      el.appendChild(stripe);
      el.appendChild(nameEl);
      this.container.appendChild(el);

      await this.wait(100);
      stripe.classList.add('animate');
      el.classList.add('animate');
      audio.playCRTBoot();

      await this.wait(900);
      el.remove();
      await this.wait(200);
    }
  },

  async phase_title() {
    const wrapper = document.createElement('div');
    wrapper.className = 'op-title-reveal';

    const main = document.createElement('div');
    main.className = 'op-title-main';
    main.textContent = '世紀末異鄉人';

    const sub = document.createElement('div');
    sub.className = 'op-title-sub';
    sub.textContent = '推 石 頭 的 人 們';

    wrapper.appendChild(main);
    wrapper.appendChild(sub);
    this.container.appendChild(wrapper);

    await this.wait(300);
    wrapper.classList.add('animate');
    audio.playConfirm();

    await this.wait(1200);
    sub.classList.add('animate');
  },

  end() {
    document.removeEventListener('keydown', this.skipHandler);
    this.skipHandler = null;
    // Engine会处理画面切换
  },

  wait(ms) {
    return new Promise(resolve => {
      const check = () => {
        if (this.skipped) return resolve();
        setTimeout(resolve, ms);
      };
      check();
    });
  }
};
