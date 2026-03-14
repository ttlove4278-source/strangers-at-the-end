const PauseMenu = {
  active: false,
  menuIndex: 0,
  _keyHandler: null,

  open() {
    if (this.active) return;
    this.active = true;
    this.menuIndex = 0;

    const overlay = document.getElementById('pause-overlay');
    overlay.classList.add('active');

    document.getElementById('pause-deaths').textContent = '×' + GameState.player.deathCount;
    document.getElementById('pause-logos').textContent = GameState.player.logos.toFixed(1) + '赫';
    document.getElementById('pause-crystal').textContent = GameState.player.crystallization + '%';

    this.updateHighlight();
    this.bindInput();
  },

  close() {
    this.active = false;
    document.getElementById('pause-overlay').classList.remove('active');
    this.unbindInput();
  },

  updateHighlight() {
    const items = document.querySelectorAll('#pause-overlay .menu-item');
    items.forEach((item, i) => item.classList.toggle('active', i === this.menuIndex));
  },

  confirmAction() {
    const items = document.querySelectorAll('#pause-overlay .menu-item');
    const action = items[this.menuIndex]?.dataset.action;
    if (!action) return;
    audio.playConfirm();

    switch (action) {
      case 'resume':
        this.close();
        break;
      case 'save':
        this.close();
        Engine.showSaveScreen('save');
        break;
      case 'load':
        this.close();
        Engine.showSaveScreen('load');
        break;
      case 'archive':
        this.close();
        Engine.showArchive();
        break;
      case 'config':
        this.close();
        Engine.showConfig();
        break;
      case 'title':
        this.close();
        audio.stopAll();
        Transitions.switchScreen(GameState.currentScreen, 'title', 'fade', 800).then(() => TitleScreen.init());
        break;
    }
  },

  bindInput() {
    this._keyHandler = (e) => {
      if (!this.active) return;
      const items = document.querySelectorAll('#pause-overlay .menu-item');
      if (e.code === 'Escape') { e.preventDefault(); this.close(); }
      else if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); this.menuIndex = Math.max(0, this.menuIndex-1); this.updateHighlight(); audio.playSelect(); }
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); this.menuIndex = Math.min(items.length-1, this.menuIndex+1); this.updateHighlight(); audio.playSelect(); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.confirmAction(); }
    };
    document.addEventListener('keydown', this._keyHandler);

    document.querySelectorAll('#pause-overlay .menu-item').forEach((item, i) => {
      item.onclick = () => { this.menuIndex = i; this.updateHighlight(); this.confirmAction(); };
      item.onmouseenter = () => { this.menuIndex = i; this.updateHighlight(); audio.playSelect(); };
    });
  },

  unbindInput() {
    if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
  }
};
