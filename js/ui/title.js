/**
 * 标题画面控制
 */
const TitleScreen = {
  menuItems: [],
  currentIndex: 0,
  active: false,

  init() {
    this.menuItems = document.querySelectorAll('#screen-title .menu-item');
    this.active = true;
    this.currentIndex = 0;
    this.updateMenu();

    // 设置CSS变量给标题字动画
    document.querySelectorAll('.title-char').forEach(char => {
      char.style.setProperty('--i', char.dataset.index);
    });

    // 继续按钮状态
    const continueItem = document.querySelector('[data-action="continue"]');
    if (continueItem) {
      if (!GameState.hasSave()) {
        continueItem.style.opacity = '0.3';
        continueItem.style.pointerEvents = 'none';
      }
    }

    this.bindEvents();
  },

  bindEvents() {
    // 键盘
    this._keyHandler = (e) => {
      if (!this.active) return;
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          this.navigate(-1);
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          this.navigate(1);
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          this.confirm();
          break;
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    // 鼠标
    this.menuItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        this.currentIndex = index;
        this.updateMenu();
        audio.playSelect();
      });
      item.addEventListener('click', () => {
        this.currentIndex = index;
        this.updateMenu();
        this.confirm();
      });
    });
  },

  navigate(dir) {
    const enabledItems = [...this.menuItems].filter(
      item => item.style.pointerEvents !== 'none'
    );
    // Find next enabled index
    let newIndex = this.currentIndex + dir;
    if (newIndex < 0) newIndex = this.menuItems.length - 1;
    if (newIndex >= this.menuItems.length) newIndex = 0;

    // Skip disabled
    if (this.menuItems[newIndex].style.pointerEvents === 'none') {
      this.currentIndex = newIndex;
      this.navigate(dir);
      return;
    }

    this.currentIndex = newIndex;
    this.updateMenu();
    audio.playSelect();
  },

  updateMenu() {
    this.menuItems.forEach((item, i) => {
      item.classList.toggle('active', i === this.currentIndex);
    });
  },

  async confirm() {
    const action = this.menuItems[this.currentIndex].dataset.action;
    audio.playConfirm();
    this.active = false;
    document.removeEventListener('keydown', this._keyHandler);

    switch (action) {
      case 'start':
        await Engine.startGame();
        break;
      case 'continue':
        GameState.load();
        await Engine.continueGame();
        break;
      case 'config':
        // TODO: 设置画面
        this.active = true;
        document.addEventListener('keydown', this._keyHandler);
        break;
    }
  },

  destroy() {
    this.active = false;
    document.removeEventListener('keydown', this._keyHandler);
  }
};
