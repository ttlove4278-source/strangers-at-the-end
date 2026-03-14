const DLCMiyuki = {
  active: false,
  state: null,

  // === 标题翻转 ===
  initTitleFlip() {
    const flipper = document.getElementById('title-flipper');
    const toBack = document.getElementById('flip-to-back');
    const toFront = document.getElementById('flip-to-front');

    if (!toBack || !toFront) return;

    // 生成DLC粒子
    this.createParticles();

    toBack.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playTransition();
      flipper.classList.add('flipped');
      // 延迟后初始化DLC菜单
      setTimeout(() => this.initDLCMenu(), 800);
    });

    toFront.addEventListener('click', (e) => {
      e.stopPropagation();
      audio.playTransition();
      flipper.classList.remove('flipped');
      setTimeout(() => TitleScreen.init(), 800);
    });
  },

  createParticles() {
    const container = document.getElementById('dlc-particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = 1 + Math.random() * 3;
      const x = Math.random() * 100;
      const dur = 8 + Math.random() * 12;
      const delay = Math.random() * 10;
      p.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        background: rgba(135,206,235,${0.1 + Math.random()*0.3});
        border-radius:50%;
        left:${x}%; bottom:-5%;
        animation: dlcParticleRise ${dur}s linear ${delay}s infinite;
        pointer-events:none;
      `;
      container.appendChild(p);
    }

    // 注入动画
    if (!document.getElementById('dlc-particle-style')) {
      const style = document.createElement('style');
      style.id = 'dlc-particle-style';
      style.textContent = `
        @keyframes dlcParticleRise {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-105vh) translateX(${-30 + Math.random()*60}px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // === DLC菜单 ===
  initDLCMenu() {
    const items = document.querySelectorAll('#title-menu-dlc .menu-item');
    let idx = 0;

    const update = () => items.forEach((item, i) => item.classList.toggle('active', i === idx));
    update();

    // 继续按钮状态
    const cont = document.querySelector('[data-action="dlc-continue"]');
    if (cont) cont.classList.toggle('disabled', !localStorage.getItem('seiki_dlc_save'));

    const handler = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); idx = Math.max(0, idx-1); update(); audio.playSelect(); }
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); idx = Math.min(items.length-1, idx+1); update(); audio.playSelect(); }
      else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        const action = items[idx].dataset.action;
        if (items[idx].classList.contains('disabled')) return;
        audio.playConfirm();
        document.removeEventListener('keydown', handler);
        if (action === 'dlc-start') this.startDLC();
        else if (action === 'dlc-continue') this.continueDLC();
      }
    };
    document.addEventListener('keydown', handler);
    this._dlcMenuHandler = handler;

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => { if (item.classList.contains('disabled')) return; idx = i; update(); audio.playSelect(); });
      item.addEventListener('click', () => {
        if (item.classList.contains('disabled')) return;
        idx = i; update();
        const action = item.dataset.action;
        audio.playConfirm();
        if (this._dlcMenuHandler) document.removeEventListener('keydown', this._dlcMenuHandler);
        if (action === 'dlc-start') this.startDLC();
        else if (action === 'dlc-continue') this.continueDLC();
      });
    });
  },

  // === 开始DLC ===
  async startDLC() {
    this.active = true;
    this.state = JSON.parse(JSON.stringify(SCRIPT_DLC_MIYUKI.state));

    // 切换色调
    document.documentElement.style.setProperty('--heat', '#87CEEB');
    document.documentElement.style.setProperty('--heat-glow', 'rgba(135,206,235,0.3)');

    await Transitions.switchScreen('title', 'poem', 'fade', 800);
    await PoemScreen.play(SCRIPT_DLC_MIYUKI.poem);
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);

    // 显示剩余日数
    this.updateDaysUI();

    const first = SCRIPT_DLC_MIYUKI.scenes.find(s => s.id === 'dlc_prologue');
    if (first) this.playDLCScene(first);
  },

  async continueDLC() {
    // 简化：重新开始
    this.startDLC();
  },

  playDLCScene(scene) {
    // 使用DialogueSystem但注入DLC特殊处理
    Engine.currentChapterScript = SCRIPT_DLC_MIYUKI;
    DialogueSystem.playScene(scene);
  },

  // === DLC特殊节点处理 ===
  handleDLCNode(node) {
    switch (node.type) {
      case 'dlc_days':
        this.state.daysLeft = node.days;
        this.updateDaysUI();
        return true;
      case 'dlc_letter':
        this.showLetter(node.date, node.text);
        return true;
      case 'dlc_end':
        this.endDLC();
        return true;
      default:
        return false;
    }
  },

  updateDaysUI() {
    const el = document.getElementById('dlc-days-left');
    const num = document.getElementById('days-number');
    if (!el || !num) return;
    el.classList.add('visible');
    num.textContent = this.state.daysLeft;

    if (this.state.daysLeft <= 3) {
      num.style.color = '#E74C3C';
      num.style.textShadow = '0 0 15px rgba(231,76,60,0.5)';
    } else if (this.state.daysLeft <= 14) {
      num.style.color = '#F39C12';
    }
  },

  // === 写信演出 ===
  async showLetter(date, text) {
    const ui = document.getElementById('dlc-letter-ui');
    const dateEl = document.getElementById('letter-date');
    const bodyEl = document.getElementById('letter-body');
    const promptEl = document.getElementById('letter-prompt');

    dateEl.textContent = date;
    bodyEl.innerHTML = '';
    promptEl.textContent = '';
    ui.classList.add('active');

    // 打字机效果——信纸上的字
    await this.wait(600);

    const chars = [];
    for (const ch of text) {
      if (ch === '\n') chars.push({ type: 'br' });
      else chars.push({ type: 'char', value: ch });
    }

    const cursor = document.createElement('span');
    cursor.className = 'letter-cursor';

    let i = 0;
    await new Promise(resolve => {
      const step = () => {
        if (i >= chars.length) {
          cursor.remove();
          resolve();
          return;
        }
        const c = chars[i];
        if (c.type === 'br') bodyEl.appendChild(document.createElement('br'));
        else {
          bodyEl.appendChild(document.createTextNode(c.value));
          if (i % 5 === 0) audio.playTypewriter();
        }
        cursor.remove();
        bodyEl.appendChild(cursor);

        let delay = 55;
        if (c.type === 'char') {
          if ('。！？'.includes(c.value)) delay = 250;
          else if ('，、'.includes(c.value)) delay = 120;
          else if ('…'.includes(c.value)) delay = 150;
          else if ('——'.includes(c.value)) delay = 100;
          else if (c.value === '\n') delay = 180;
        }
        i++;
        setTimeout(step, delay);
      };
      step();
    });

    // 完成后等待点击
    promptEl.textContent = '—— 点击继续 ——';
    await new Promise(resolve => {
      const handler = (e) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') {
          document.removeEventListener('keydown', handler);
          ui.removeEventListener('click', handler);
          resolve();
        }
      };
      document.addEventListener('keydown', handler);
      ui.addEventListener('click', handler);
    });

    ui.classList.remove('active');

    // 保存信件
    this.state.letters.push({ date, text });

    // 继续剧情
    DialogueSystem.nodeIndex++;
    DialogueSystem.processNode();
  },

  // === DLC结束 ===
  async endDLC() {
    this.active = false;
    document.getElementById('dlc-days-left').classList.remove('visible');

    // 恢复色调
    document.documentElement.style.setProperty('--heat', '#FF6B35');
    document.documentElement.style.setProperty('--heat-glow', 'rgba(255,107,53,0.3)');

    // 解锁本篇档案
    GameState.unlockArchive('persons', 'miyuki');

    await this.wait(3000);
    await Transitions.switchScreen('dialogue', 'title', 'fade', 1500);

    // 翻回正面
    const flipper = document.getElementById('title-flipper');
    flipper.classList.remove('flipped');
    setTimeout(() => TitleScreen.init(), 500);
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
