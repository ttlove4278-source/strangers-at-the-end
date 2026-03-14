const SaveUI = {
  mode: 'save',
  selectedSlot: 0,
  _keyHandler: null,

  init(mode) {
    this.mode = mode || 'save';
    this.selectedSlot = 0;

    document.getElementById('save-title').textContent = this.mode === 'save' ? '記 録' : '讀 取';
    this.renderSlots();
    this.bindInput();
  },

  renderSlots() {
    const container = document.getElementById('save-slots');
    container.innerHTML = '';

    for (let i = 0; i < 6; i++) {
      const info = GameState.getSaveInfo(i);
      const slot = document.createElement('div');
      slot.className = 'save-slot';
      if (i === this.selectedSlot) slot.classList.add('highlighted');

      if (info) {
        const date = new Date(info.timestamp);
        const dateStr = `${date.getFullYear()}.${String(date.getMonth()+1).padStart(2,'0')}.${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
        const chapterNames = ['序章', '第一章', '第二章', '第三章', '第四章'];
        slot.innerHTML = `
          <div class="slot-header">
            <span class="slot-number">SLOT ${i + 1}</span>
            <span class="slot-date">${dateStr}</span>
          </div>
          <div class="slot-info">
            <span class="slot-chapter">${chapterNames[info.chapter] || '?'}</span>
            <span class="slot-day">${info.day}</span>
          </div>
          <div class="slot-stats">
            <span class="slot-stat">DEATH: ×${info.deaths}</span>
            <span class="slot-stat">結晶: ${info.crystal}%</span>
          </div>
        `;
      } else {
        slot.innerHTML = `
          <div class="slot-header">
            <span class="slot-number">SLOT ${i + 1}</span>
            <span class="slot-date">—— EMPTY ——</span>
          </div>
          <div class="slot-info"><span class="slot-empty">空</span></div>
        `;
      }

      slot.addEventListener('click', () => { this.selectedSlot = i; this.renderSlots(); this.confirmSlot(); });
      slot.addEventListener('mouseenter', () => { this.selectedSlot = i; this.renderSlots(); audio.playSelect(); });
      container.appendChild(slot);
    }

    // 返回按钮
    const backBtn = document.querySelector('#screen-save .save-back');
    backBtn.onclick = () => { audio.playConfirm(); this.destroy(); Engine.returnFromOverlay(); };
  },

  confirmSlot() {
    audio.playConfirm();

    if (this.mode === 'save') {
      GameState.save(this.selectedSlot);
      this.showNotification('記録完了');
      this.renderSlots();
    } else {
      const info = GameState.getSaveInfo(this.selectedSlot);
      if (!info) return;
      GameState.load(this.selectedSlot);
      this.showNotification('讀取完了');
      setTimeout(() => {
        this.destroy();
        // 根据章节恢复游戏
        if (GameState.story.chapter === 0) {
          Engine.currentChapterScript = SCRIPT_PROLOGUE;
        } else {
          Engine.currentChapterScript = SCRIPT_CHAPTER1;
        }
        Transitions.switchScreen('save', 'explore', 'fade', 500).then(() => {
          ExploreSystem.enter(Engine.currentChapterScript);
        });
      }, 800);
    }
  },

  showNotification(text) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position:fixed; top:3vh; left:50%; transform:translateX(-50%);
      font-family:var(--font-serif); font-size:0.9rem; color:var(--crt-green);
      letter-spacing:0.4em; z-index:999;
      text-shadow:0 0 10px var(--crt-green-dim);
      animation: fadeIn 0.3s ease, fadeIn 0.3s ease 1.5s reverse forwards;
    `;
    notif.textContent = text;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
  },

  bindInput() {
    this._keyHandler = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); this.selectedSlot = Math.max(0, this.selectedSlot-1); this.renderSlots(); audio.playSelect(); }
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); this.selectedSlot = Math.min(5, this.selectedSlot+1); this.renderSlots(); audio.playSelect(); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.confirmSlot(); }
      else if (e.code === 'Escape') { e.preventDefault(); audio.playConfirm(); this.destroy(); Engine.returnFromOverlay(); }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  destroy() {
    if (this._keyHandler) { document.removeEventListener('keydown', this._keyHandler); this._keyHandler = null; }
  }
};
