const TitleScreen = {
  menuItems: [],
  currentIndex: 0,
  active: false,
  _keyHandler: null,

  init() {
    this.menuItems = [];
    var items = document.querySelectorAll('#title-menu-main .menu-item');
    for (var i = 0; i < items.length; i++) {
      this.menuItems.push(items[i]);
    }
    this.active = true;
    this.currentIndex = 0;

    var cont = document.querySelector('#title-menu-main [data-action="continue"]');
    if (cont) {
      if (GameState.hasSave()) {
        cont.classList.remove('disabled');
      } else {
        cont.classList.add('disabled');
      }
    }

    this.updateMenu();
    this.bindEvents();
  },

  bindEvents() {
    var self = this;

    // 先清理旧的
    this.destroy();

    this._keyHandler = function(e) {
      if (!self.active) return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        self.navigate(-1);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        self.navigate(1);
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        self.confirm();
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    this.menuItems.forEach(function(item, i) {
      item.onmouseenter = function() {
        if (!self.active || item.classList.contains('disabled')) return;
        self.currentIndex = i;
        self.updateMenu();
        audio.playSelect();
      };
      item.onclick = function(e) {
        e.stopPropagation();
        if (!self.active || item.classList.contains('disabled')) return;
        self.currentIndex = i;
        self.updateMenu();
        self.confirm();
      };
    });
  },

  navigate(dir) {
    var next = this.currentIndex;
    for (var i = 0; i < this.menuItems.length; i++) {
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
    this.menuItems.forEach(function(item, i) {
      item.classList.toggle('active', i === this.currentIndex);
    }.bind(this));
  },

  confirm() {
    if (!this.active) return;
    if (this.menuItems.length === 0) return;
    if (this.currentIndex >= this.menuItems.length) return;

    var action = this.menuItems[this.currentIndex].dataset.action;
    if (!action) return;

    audio.playConfirm();
    this.active = false;
    this.destroy();

    switch (action) {
      case 'start':
        Engine.startNewGame();
        break;
      case 'continue':
        GameState.load(0);
        if (GameState.story.chapter >= 1) {
          Engine.currentChapterScript = SCRIPT_CHAPTER1;
          Transitions.switchScreen('title', 'explore', 'fade', 500).then(function() {
            ExploreSystem.enter(Engine.currentChapterScript);
          });
        } else {
          Engine.startNewGame();
        }
        break;
      case 'archive':
        Engine.showArchive();
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
    // 清除鼠标事件
    this.menuItems.forEach(function(item) {
      item.onmouseenter = null;
      item.onclick = null;
    });
  }
};

var ConfigScreen = {
  _keyHandler: null,

  init: function() {
    var tsSlider = document.getElementById('cfg-text-speed');
    var tsVal = document.getElementById('cfg-text-speed-val');
    var volSlider = document.getElementById('cfg-volume');
    var volVal = document.getElementById('cfg-volume-val');
    var scanBtn = document.getElementById('cfg-scanlines');
    var noiseBtn = document.getElementById('cfg-noise');
    var backBtn = document.querySelector('#screen-config .config-back');

    tsSlider.value = GameState.config.textSpeed;
    tsVal.textContent = GameState.config.textSpeed + 'ms';
    volSlider.value = GameState.config.volume * 100;
    volVal.textContent = Math.round(GameState.config.volume * 100) + '%';
    scanBtn.textContent = GameState.config.scanlines ? 'ON' : 'OFF';
    scanBtn.classList.toggle('active', GameState.config.scanlines);
    noiseBtn.textContent = GameState.config.noise ? 'ON' : 'OFF';
    noiseBtn.classList.toggle('active', GameState.config.noise);

    tsSlider.oninput = function() {
      GameState.config.textSpeed = parseInt(tsSlider.value);
      tsVal.textContent = tsSlider.value + 'ms';
    };
    volSlider.oninput = function() {
      GameState.config.volume = parseInt(volSlider.value) / 100;
      volVal.textContent = volSlider.value + '%';
      audio.setVolume(GameState.config.volume);
    };
    scanBtn.onclick = function() {
      GameState.config.scanlines = !GameState.config.scanlines;
      scanBtn.textContent = GameState.config.scanlines ? 'ON' : 'OFF';
      scanBtn.classList.toggle('active', GameState.config.scanlines);
      document.getElementById('scanlines').classList.toggle('off', !GameState.config.scanlines);
      audio.playSelect();
    };
    noiseBtn.onclick = function() {
      GameState.config.noise = !GameState.config.noise;
      noiseBtn.textContent = GameState.config.noise ? 'ON' : 'OFF';
      noiseBtn.classList.toggle('active', GameState.config.noise);
      document.getElementById('noise').classList.toggle('off', !GameState.config.noise);
      audio.playSelect();
    };
    backBtn.onclick = function() {
      audio.playConfirm();
      ConfigScreen.destroy();
      Engine.returnFromOverlay();
    };
    this._keyHandler = function(e) {
      if (e.code === 'Escape') {
        audio.playConfirm();
        ConfigScreen.destroy();
        Engine.returnFromOverlay();
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  destroy: function() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
  }
};
