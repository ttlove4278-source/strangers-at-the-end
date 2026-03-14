const MobileControls = {
  init() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    const controls = document.getElementById('mobile-controls');

    if (!isMobile) {
      controls.style.display = 'none';
      return;
    }

    controls.style.display = 'flex';

    controls.querySelectorAll('.mobile-btn').forEach(btn => {
      const key = btn.dataset.key;

      const fire = () => {
        if (key === 'menu') {
          if (PauseMenu.active) PauseMenu.close();
          else PauseMenu.open();
          return;
        }
        const ev = new KeyboardEvent('keydown', { code: key, bubbles: true });
        document.dispatchEvent(ev);
      };

      btn.addEventListener('touchstart', (e) => { e.preventDefault(); btn.classList.add('pressed'); fire(); });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); btn.classList.remove('pressed'); });
      btn.addEventListener('click', (e) => { e.preventDefault(); fire(); });
    });

    // 对话画面点击推进
    document.getElementById('screen-dialogue').addEventListener('touchstart', (e) => {
      if (e.target.closest('.dlg-choices')) return;
      const ev = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
      document.dispatchEvent(ev);
    });
  }
};
