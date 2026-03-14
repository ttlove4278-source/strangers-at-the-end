const TitleScreen = {
  menuItems: [],
  currentIndex: 0,
  active: false,
  _keyHandler: null,

  init() {
    this.menuItems = [...document.querySelectorAll('#screen-title .menu-item')];
    this.active = true;
    this.currentIndex = 0;

    const cont = document.querySelector('[data-action="continue"]');
    if (cont) cont.classList.toggle('disabled', !GameState.hasSave());

    this.updateMenu();
    this.bindEvents();
  },

  bindEvents() {
    this._keyHandler = (e) => {
      if (!this.active) return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); this.navigate(-1); }
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); this.navigate(1); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.confirm(); }
    };
    document.addEventListener('keydown', this._keyHandler);
    this.menuItems.forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        if (!this.active || item.classList.contains('disabled')) return;
        this.currentIndex = i;
        this.updateMenu();
        audio.playSelect();
      });
      item.addEventListener('click', () => {
        if (!this.active || item.classList.contains('disabled')) return;
        this.currentIndex = i;
        this.updateMenu();
        this.confirm();
      });
    });
  },

  navigate(dir) {
    let next = this.currentIndex;
    for (let i = 0; i < this.menuItems.length; i++) {
      next += dir;
      if (next < 0) next = this.menuItems.length - 1;
      if (next >= this.menuItems.length) next = 0;
      if (!this.menuItems[next].classList.contains('disabled')) break;
    }
    this.currentIndex = next;
    this.updateMenu();
    audio.playSelect();
  },

  updateMenu() {
    this.menuItems.forEach((item, i) => item.classList.toggle('active', i === this.currentIndex));
  },

  async confirm() {
    const action = this.menuItems[this.currentIndex].dataset.action;
    audio.playConfirm();
    this.active = false;
    this.destroy();

    switch (action) {
      case 'start':
        Engine.startNewGame();
        break;
      case 'continue':
        GameState.load();
        Engine.startNewGame();
        break;
      case 'config':
        Engine.showConfig();
        break;
    }
  },

  destroy() {
    this.active = false;
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }
};

const ConfigScreen = {
  _keyHandler: null,

  init() {
    const $ = id => document.getElementById(id);

    const tsSlider = $('cfg-text-speed');
    const tsVal = $('cfg-text-speed-val');
    const volSlider = $('cfg-volume');
    const volVal = $('cfg-volume-val');
    const scanBtn = $('cfg-scanlines');
    const noiseBtn = $('cfg-noise');
    const backBtn = document.querySelector('#screen-config .config-back');

    tsSlider.value = GameState.config.textSpeed;
    tsVal.textContent = GameState.config.textSpeed + 'ms';
    volSlider.value = GameState.config.volume * 100;
    volVal.textContent = Math.round(GameState.config.volume * 100) + '%';
    scanBtn.textContent = GameState.config.scanlines ? 'ON' : 'OFF';
    scanBtn.classList.toggle('active', GameState.config.scanlines);
    noiseBtn.textContent = GameState.config.noise ? 'ON' : 'OFF';
    noiseBtn.classList.toggle('active', GameState.config.noise);

    tsSlider.oninput = () => {
      GameState.config.textSpeed = parseInt(tsSlider.value);
      tsVal.textContent = tsSlider.value + 'ms';
    };
    volSlider.oninput = () => {
      GameState.config.volume = parseInt(volSlider.value) / 100;
      volVal.textContent = volSlider.value + '%';
      audio.setVolume(GameState.config.volume);
    };
    scanBtn.onclick = () => {
      GameState.config.scanlines = !GameState.config.scanlines;
      scanBtn.textContent = GameState.config.scanlines ? 'ON' : 'OFF';
      scanBtn.classList.toggle('active', GameState.config.scanlines);
      document.getElementById('scanlines').classList.toggle('off', !GameState.config.scanlines);
      audio.playSelect();
    };
    noiseBtn.onclick = () => {
      GameState.config.noise = !GameState.config.noise;
      noiseBtn.textContent = GameState.config.noise ? 'ON' : 'OFF';
      noiseBtn.classList.toggle('active', GameState.config.noise);
      document.getElementById('noise').classList.toggle('off', !GameState.config.noise);
      audio.playSelect();
    };
    backBtn.onclick = () => {
      audio.playConfirm();
      Engine.backToTitle();
    };
    this._keyHandler = (e) => {
      if (e.code === 'Escape') {
        audio.playConfirm();
        Engine.backToTitle();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  destroy() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }
};
