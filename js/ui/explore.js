const ExploreSystem = {
  active: false,
  locations: [],
  currentIndex: 0,
  actionIndex: 0,
  _keyHandler: null,
  chapterScript: null,

  enter(chapterScript) {
    this.chapterScript = chapterScript;
    this.locations = LOCATIONS;
    this.active = true;
    this.currentIndex = 0;
    this.actionIndex = -1;

    this.updateStatus();
    this.renderLocation();
    this.renderNav();
    this.bindInput();

    // 检查是否有终章触发条件
    if (chapterScript.scenes) {
      const finale = chapterScript.scenes.find(s => s.id === 'ch1_finale');
      if (finale && this.checkFinale()) {
        this.active = false;
        this.unbindInput();
        Engine.enterSceneFromExplore('ch1_finale');
        return;
      }
    }
  },

  checkFinale() {
    const f = GameState.story.flags;
    const visited = GameState.story.completedScenes;
    // 终章条件：已见过光、黎、九课、打过暗巷
    return f.know_prognosis && f.met_rei &&
      visited.includes('ch1_library_hikaru') &&
      visited.includes('ch1_shopping_alley');
  },

  renderLocation() {
    const loc = this.locations[this.currentIndex];
    const $ = id => document.getElementById(id);

    $('explore-date').textContent = GameState.story.day;
    $('ch-number').textContent = String(loc.channel).padStart(2, '0');
    $('explore-location').textContent = loc.name;
    $('explore-desc').textContent = loc.desc;

    const bg = $('explore-bg');
    bg.style.background = loc.bgColor;

    // 渲染行动按钮
    const actionsEl = $('explore-actions');
    actionsEl.innerHTML = '';

    const availableActions = loc.actions.filter(a => !a.condition || a.condition());

    availableActions.forEach((action, i) => {
      const btn = document.createElement('div');
      btn.className = 'action-btn';
      if (i === this.actionIndex) btn.classList.add('highlighted');
      btn.innerHTML = `<span class="action-icon">${action.icon || '◇'}</span><span class="action-text">${action.label}</span>`;
      btn.addEventListener('click', () => { this.actionIndex = i; this.highlightActions(); this.confirmAction(); });
      btn.addEventListener('mouseenter', () => { this.actionIndex = i; this.highlightActions(); audio.playSelect(); });
      actionsEl.appendChild(btn);
    });

    this.actionIndex = availableActions.length > 0 ? 0 : -1;
    this.highlightActions();
  },

  renderNav() {
    const navEl = document.getElementById('nav-channels');
    navEl.innerHTML = '';
    this.locations.forEach((loc, i) => {
      const ch = document.createElement('div');
      ch.className = 'nav-ch';
      if (i === this.currentIndex) ch.classList.add('active');
      ch.addEventListener('click', () => { this.switchChannel(i); });
      navEl.appendChild(ch);
    });

    document.getElementById('nav-prev').onclick = () => this.switchChannel(this.currentIndex - 1);
    document.getElementById('nav-next').onclick = () => this.switchChannel(this.currentIndex + 1);
  },

  switchChannel(idx) {
    if (idx < 0) idx = this.locations.length - 1;
    if (idx >= this.locations.length) idx = 0;
    if (idx === this.currentIndex) return;

    audio.playSelect();
    this.currentIndex = idx;
    this.renderLocation();
    this.renderNav();
  },

  highlightActions() {
    const btns = document.querySelectorAll('#explore-actions .action-btn');
    btns.forEach((btn, i) => btn.classList.toggle('highlighted', i === this.actionIndex));
  },

  confirmAction() {
    const loc = this.locations[this.currentIndex];
    const available = loc.actions.filter(a => !a.condition || a.condition());
    const action = available[this.actionIndex];
    if (!action) return;

    audio.playConfirm();

    if (action.scene) {
      // 记录已完成
      if (!GameState.story.completedScenes.includes(action.scene)) {
        GameState.story.completedScenes.push(action.scene);
      }
      this.active = false;
      this.unbindInput();
      Engine.enterSceneFromExplore(action.scene);
    } else if (action.text) {
      // 简单文本效果
      if (action.effect) GameState.applyEffect(action.effect);
      this.showQuickText(action.text);
      this.updateStatus();
    }
  },

  showQuickText(text) {
    const desc = document.getElementById('explore-desc');
    desc.style.transition = 'opacity 0.3s';
    desc.style.opacity = '0';
    setTimeout(() => {
      desc.textContent = text;
      desc.style.opacity = '1';
    }, 300);
    setTimeout(() => {
      this.renderLocation();
    }, 3000);
  },

  updateStatus() {
    const $ = id => document.getElementById(id);
    const p = GameState.player;
    $('logos-bar').style.width = (p.logos / p.logosMax * 100) + '%';
    $('logos-value').textContent = p.logos.toFixed(1) + '赫';
    $('crystal-bar').style.width = p.crystallization + '%';
    $('crystal-value').textContent = p.crystallization + '%';
  },

  bindInput() {
    this._keyHandler = (e) => {
      if (!this.active) return;

      if (e.code === 'Escape' || e.code === 'menu') {
        e.preventDefault();
        PauseMenu.open();
        return;
      }

      const available = this.locations[this.currentIndex].actions.filter(a => !a.condition || a.condition());

      switch (e.code) {
        case 'ArrowLeft': case 'KeyA':
          e.preventDefault(); this.switchChannel(this.currentIndex - 1); break;
        case 'ArrowRight': case 'KeyD':
          e.preventDefault(); this.switchChannel(this.currentIndex + 1); break;
        case 'ArrowUp': case 'KeyW':
          e.preventDefault();
          this.actionIndex = Math.max(0, this.actionIndex - 1);
          this.highlightActions(); audio.playSelect(); break;
        case 'ArrowDown': case 'KeyS':
          e.preventDefault();
          this.actionIndex = Math.min(available.length - 1, this.actionIndex + 1);
          this.highlightActions(); audio.playSelect(); break;
        case 'Enter': case 'Space':
          e.preventDefault(); this.confirmAction(); break;
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  unbindInput() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }
};
