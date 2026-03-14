const DLCMiyuki = {
  active: false,
  state: null,
  _dlcMenuHandler: null,

  // === 标题翻转 ===
  initTitleFlip() {
    const flipper = document.getElementById('title-flipper');
    const toBack = document.getElementById('flip-to-back');
    const toFront = document.getElementById('flip-to-front');

    if (!toBack || !toFront) return;

    this.createParticles();

    // 移除旧监听器防止重复绑定
    const newToBack = toBack.cloneNode(true);
    toBack.parentNode.replaceChild(newToBack, toBack);
    const newToFront = toFront.cloneNode(true);
    toFront.parentNode.replaceChild(newToFront, toFront);

    newToBack.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      audio.playTransition();
      // 先销毁TitleScreen的键盘监听，防止冲突
      TitleScreen.destroy();
      flipper.classList.add('flipped');
      setTimeout(() => this.initDLCMenu(), 900);
    });

    newToFront.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      audio.playTransition();
      // 销毁DLC菜单监听
      this.destroyDLCMenu();
      flipper.classList.remove('flipped');
      setTimeout(() => TitleScreen.init(), 900);
    });
  },

  createParticles() {
    const container = document.getElementById('dlc-particles');
    if (!container) return;
    container.innerHTML = '';

    // 注入动画样式
    if (!document.getElementById('dlc-particle-style')) {
      const style = document.createElement('style');
      style.id = 'dlc-particle-style';
      style.textContent = '@keyframes dlcParticleRise { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.6; } 100% { transform: translateY(-110vh); opacity: 0; } }';
      document.head.appendChild(style);
    }

    for (var i = 0; i < 25; i++) {
      var p = document.createElement('div');
      var size = 1 + Math.random() * 3;
      var x = Math.random() * 100;
      var dur = 8 + Math.random() * 14;
      var delay = Math.random() * 12;
      p.style.cssText = 'position:absolute; width:' + size + 'px; height:' + size + 'px; background:rgba(135,206,235,' + (0.15 + Math.random() * 0.35) + '); border-radius:50%; left:' + x + '%; bottom:-5%; animation:dlcParticleRise ' + dur + 's linear ' + delay + 's infinite; pointer-events:none;';
      container.appendChild(p);
    }
  },

  // === DLC菜单 ===
  initDLCMenu() {
    var items = document.querySelectorAll('#title-menu-dlc .menu-item');
    var idx = 0;
    var self = this;

    var update = function() {
      items.forEach(function(item, i) {
        item.classList.toggle('active', i === idx);
      });
    };
    update();

    // 继续按钮状态
    var cont = document.querySelector('[data-action="dlc-continue"]');
    if (cont) {
      cont.classList.toggle('disabled', !localStorage.getItem('seiki_dlc_save'));
    }

    // 键盘
    this._dlcMenuHandler = function(e) {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        idx = Math.max(0, idx - 1);
        update();
        audio.playSelect();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        idx = Math.min(items.length - 1, idx + 1);
        update();
        audio.playSelect();
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        var action = items[idx].dataset.action;
        if (items[idx].classList.contains('disabled')) return;
        audio.playConfirm();
        self.destroyDLCMenu();
        if (action === 'dlc-start') self.startDLC();
        else if (action === 'dlc-continue') self.continueDLC();
      }
    };
    document.addEventListener('keydown', this._dlcMenuHandler);

    // 鼠标
    items.forEach(function(item, i) {
      item.onmouseenter = function() {
        if (item.classList.contains('disabled')) return;
        idx = i;
        update();
        audio.playSelect();
      };
      item.onclick = function() {
        if (item.classList.contains('disabled')) return;
        idx = i;
        update();
        var action = item.dataset.action;
        audio.playConfirm();
        self.destroyDLCMenu();
        if (action === 'dlc-start') self.startDLC();
        else if (action === 'dlc-continue') self.continueDLC();
      };
    });
  },

  destroyDLCMenu() {
    if (this._dlcMenuHandler) {
      document.removeEventListener('keydown', this._dlcMenuHandler);
      this._dlcMenuHandler = null;
    }
    // 清除鼠标事件
    var items = document.querySelectorAll('#title-menu-dlc .menu-item');
    items.forEach(function(item) {
      item.onmouseenter = null;
      item.onclick = null;
    });
  },

  // === 开始DLC ===
  async startDLC() {
    this.active = true;
    this.state = {
      daysLeft: 155,
      wordsWritten: 0,
      wordsMax: 100,
      currentDay: '1994.03.03',
      letters: []
    };

    // 切换色调为蓝色
    document.documentElement.style.setProperty('--heat', '#87CEEB');
    document.documentElement.style.setProperty('--heat-glow', 'rgba(135,206,235,0.3)');

    // 设置引擎脚本为DLC
    Engine.currentChapterScript = SCRIPT_DLC_MIYUKI;

    await Transitions.switchScreen('title', 'poem', 'fade', 800);
    await PoemScreen.play(SCRIPT_DLC_MIYUKI.poem);
    await Transitions.switchScreen('poem', 'dialogue', 'fade', 500);

    // 显示剩余日数
    this.updateDaysUI();

    var first = SCRIPT_DLC_MIYUKI.scenes.find(function(s) { return s.id === 'dlc_prologue'; });
    if (first) {
      DialogueSystem.playScene(first);
    }
  },

  async continueDLC() {
    this.startDLC();
  },

  // === DLC特殊节点处理 ===
  handleDLCNode(node) {
    switch (node.type) {
      case 'dlc_days':
        this.state.daysLeft = node.days;
        this.updateDaysUI();
        // 关键：处理完后推进到下一个节点
        DialogueSystem.nodeIndex++;
        DialogueSystem.processNode();
        return true;

      case 'dlc_letter':
        this.showLetter(node.date, node.text);
        // showLetter内部会在完成后推进nodeIndex
        return true;

      case 'dlc_end':
        this.endDLC();
        return true;

      default:
        return false;
    }
  },

  updateDaysUI() {
    var el = document.getElementById('dlc-days-left');
    var num = document.getElementById('days-number');
    if (!el || !num) return;
    el.classList.add('visible');
    num.textContent = this.state.daysLeft;

    // 颜色变化
    if (this.state.daysLeft <= 3) {
      num.style.color = '#E74C3C';
      num.style.textShadow = '0 0 15px rgba(231,76,60,0.5)';
    } else if (this.state.daysLeft <= 14) {
      num.style.color = '#F39C12';
      num.style.textShadow = '0 0 10px rgba(243,156,18,0.3)';
    } else {
      num.style.color = '';
      num.style.textShadow = '';
    }
  },

  // === 写信演出 ===
  async showLetter(date, text) {
    var ui = document.getElementById('dlc-letter-ui');
    var dateEl = document.getElementById('letter-date');
    var bodyEl = document.getElementById('letter-body');
    var promptEl = document.getElementById('letter-prompt');

    if (!ui || !dateEl || !bodyEl || !promptEl) {
      // 元素不存在则跳过
      DialogueSystem.nodeIndex++;
      DialogueSystem.processNode();
      return;
    }

    dateEl.textContent = date;
    bodyEl.innerHTML = '';
    promptEl.textContent = '';
    ui.classList.add('active');

    await this.wait(600);

    // 解析文字
    var chars = [];
    for (var ci = 0; ci < text.length; ci++) {
      var ch = text[ci];
      if (ch === '\n') chars.push({ type: 'br' });
      else chars.push({ type: 'char', value: ch });
    }

    // 信纸打字机效果
    var cursor = document.createElement('span');
    cursor.className = 'letter-cursor';

    await new Promise(function(resolve) {
      var i = 0;
      var step = function() {
        if (i >= chars.length) {
          cursor.remove();
          resolve();
          return;
        }
        var c = chars[i];
        if (c.type === 'br') {
          bodyEl.appendChild(document.createElement('br'));
        } else {
          bodyEl.appendChild(document.createTextNode(c.value));
          if (i % 5 === 0) audio.playTypewriter();
        }
        cursor.remove();
        bodyEl.appendChild(cursor);

        var delay = 55;
        if (c.type === 'char') {
          if ('。！？'.indexOf(c.value) >= 0) delay = 250;
          else if ('，、'.indexOf(c.value) >= 0) delay = 120;
          else if ('…'.indexOf(c.value) >= 0) delay = 150;
          else if ('—'.indexOf(c.value) >= 0) delay = 100;
        }
        i++;
        setTimeout(step, delay);
      };
      step();
    });

    // 完成后等待点击
    promptEl.textContent = '—— 点击继续 ——';

    await new Promise(function(resolve) {
      var handler = function(e) {
        if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') {
          e.preventDefault();
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
    this.state.letters.push({ date: date, text: text });

    // 推进到下一个节点
    DialogueSystem.nodeIndex++;
    DialogueSystem.processNode();
  },

  // === DLC结束 ===
  async endDLC() {
    this.active = false;

    // 隐藏剩余日数
    var daysEl = document.getElementById('dlc-days-left');
    if (daysEl) daysEl.classList.remove('visible');

    // 恢复色调为橙色
    document.documentElement.style.setProperty('--heat', '#FF6B35');
    document.documentElement.style.setProperty('--heat-glow', 'rgba(255,107,53,0.3)');

    // 解锁本篇档案
    GameState.unlockArchive('persons', 'miyuki');

    // 隐藏对话层
    DialogueSystem.active = false;
    DialogueSystem.els.box.classList.remove('active');
    DialogueSystem.els.narration.classList.remove('active');
    audio.stopCicadas();

    await this.wait(2000);

    // 回到标题画面
    await Transitions.switchScreen('dialogue', 'title', 'fade', 1500);

    // 翻回正面
    var flipper = document.getElementById('title-flipper');
    if (flipper) flipper.classList.remove('flipped');

    await this.wait(600);
    TitleScreen.init();
    this.initTitleFlip();
  },

  wait(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }
};
