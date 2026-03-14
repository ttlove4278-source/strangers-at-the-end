/**
 * 战斗系统
 * 命题展开式回合制
 */
const BattleSystem = {
  active: false,
  player: null,
  enemy: null,
  turn: 'player',
  menuIndex: 0,
  _keyHandler: null,
  subMenuOpen: false,
  subMenuIndex: 0,

  els: {},

  async start(enemyId) {
    const enemyData = ENEMIES[enemyId];
    if (!enemyData) { Engine.onBattleEnd(); return; }

    this.els = {
      screen: document.getElementById('screen-battle'),
      stage: document.getElementById('battle-stage'),
      env: document.getElementById('battle-env'),
      enemyVisual: document.getElementById('battle-enemy-visual'),
      playerVisual: document.getElementById('battle-player-visual'),
      enemyInfo: document.getElementById('battle-enemy-info'),
      playerStatus: document.getElementById('battle-player-status'),
      menu: document.getElementById('battle-menu'),
      log: document.getElementById('battle-log'),
      declaration: document.getElementById('battle-declaration'),
      fx: document.getElementById('battle-fx'),
    };

    // 初始化战斗数据
    this.player = {
      ...CHARACTERS.haku,
      stats: { ...CHARACTERS.haku.stats, hp: GameState.player.hp, logos: GameState.player.logos }
    };
    this.enemy = {
      ...enemyData,
      stats: { ...enemyData.stats }
    };

    this.active = true;
    this.turn = 'player';
    this.menuIndex = 0;
    this.subMenuOpen = false;

    // 渲染
    this.renderStage();
    this.renderUI();
    this.bindInput();

    // 战斗开场白
    this.els.log.innerHTML = '';
    if (enemyData.battleIntro) {
      this.addLog(enemyData.battleIntro, 'system');
    }
    this.addLog('——战斗开始——', 'system');
    this.updateMenuHighlight();
  },

  renderStage() {
    this.els.env.className = 'battle-env heat';
    this.els.enemyVisual.innerHTML = `
      <div class="battle-entity-name" style="color:${this.enemy.color}">${this.enemy.name}</div>
      <div class="battle-entity enemy" style="color:${this.enemy.color}">${this.enemy.silhouetteChar}</div>
      <div class="battle-entity-philo" style="color:${this.enemy.color}">${this.enemy.philosopher} — ${this.enemy.ability}</div>
    `;
    this.els.playerVisual.innerHTML = `
      <div class="battle-entity player" style="color:${this.player.color}">${this.player.silhouetteChar}</div>
    `;
  },

  renderUI() {
    // 敌方信息
    this.els.enemyInfo.innerHTML = `
      <div class="bei-name">${this.enemy.name}</div>
      <div class="bei-sub">[${this.enemy.philosopher}] ${this.enemy.proposition}</div>
      <div class="bei-bars">
        <div class="bei-bar">
          <span class="bei-bar-label">HP</span>
          <div class="bei-bar-gauge"><div class="bei-bar-fill hp" id="enemy-hp-bar" style="width:${(this.enemy.stats.hp/this.enemy.stats.hpMax)*100}%"></div></div>
        </div>
        <div class="bei-bar">
          <span class="bei-bar-label">LG</span>
          <div class="bei-bar-gauge"><div class="bei-bar-fill lg" id="enemy-lg-bar" style="width:${(this.enemy.stats.logos/this.enemy.stats.logosMax)*100}%"></div></div>
        </div>
      </div>
    `;

    // 玩家状态
    this.els.playerStatus.innerHTML = `
      <div class="bps-name">${this.player.nameShort}</div>
      <div class="bps-bar">
        <span class="bps-bar-label">HP</span>
        <div class="bps-bar-gauge"><div class="bps-bar-fill hp" id="player-hp-bar" style="width:${(this.player.stats.hp/this.player.stats.hpMax)*100}%"></div></div>
        <span class="bps-bar-val" id="player-hp-val">${this.player.stats.hp}/${this.player.stats.hpMax}</span>
      </div>
      <div class="bps-bar">
        <span class="bps-bar-label">LG</span>
        <div class="bps-bar-gauge"><div class="bps-bar-fill lg" id="player-lg-bar" style="width:${(this.player.stats.logos/this.player.stats.logosMax)*100}%"></div></div>
        <span class="bps-bar-val" id="player-lg-val">${this.player.stats.logos.toFixed(1)}赫</span>
      </div>
      <div class="bps-bar">
        <span class="bps-bar-label">結晶</span>
        <div class="bps-bar-gauge"><div class="bps-bar-fill cr" id="player-cr-bar" style="width:${GameState.player.crystallization}%"></div></div>
        <span class="bps-bar-val">${GameState.player.crystallization}%</span>
      </div>
      <div class="bps-death-count">DEATH: ×${GameState.player.deathCount}</div>
    `;
  },

  updateBars() {
    const $ = id => document.getElementById(id);
    if ($('enemy-hp-bar')) $('enemy-hp-bar').style.width = Math.max(0, (this.enemy.stats.hp / this.enemy.stats.hpMax) * 100) + '%';
    if ($('enemy-lg-bar')) $('enemy-lg-bar').style.width = Math.max(0, (this.enemy.stats.logos / this.enemy.stats.logosMax) * 100) + '%';
    if ($('player-hp-bar')) $('player-hp-bar').style.width = Math.max(0, (this.player.stats.hp / this.player.stats.hpMax) * 100) + '%';
    if ($('player-hp-val')) $('player-hp-val').textContent = Math.max(0, this.player.stats.hp) + '/' + this.player.stats.hpMax;
    if ($('player-lg-bar')) $('player-lg-bar').style.width = Math.max(0, (this.player.stats.logos / this.player.stats.logosMax) * 100) + '%';
    if ($('player-lg-val')) $('player-lg-val').textContent = this.player.stats.logos.toFixed(1) + '赫';
  },

  bindInput() {
    this._keyHandler = (e) => {
      if (!this.active || this.turn !== 'player') return;

      if (this.subMenuOpen) {
        this.handleSubMenuInput(e);
        return;
      }

      const items = this.els.menu.querySelectorAll('.bmenu-item:not(.disabled)');
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        this.menuIndex = Math.max(0, this.menuIndex - 1);
        this.updateMenuHighlight();
        audio.playSelect();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.menuIndex = Math.min(items.length - 1, this.menuIndex + 1);
        this.updateMenuHighlight();
        audio.playSelect();
      } else if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        this.confirmMenuAction();
      }
    };
    document.addEventListener('keydown', this._keyHandler);

    // 鼠标
    this.els.menu.querySelectorAll('.bmenu-item').forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        if (this.turn !== 'player' || this.subMenuOpen) return;
        this.menuIndex = i;
        this.updateMenuHighlight();
        audio.playSelect();
      });
      item.addEventListener('click', () => {
        if (this.turn !== 'player' || this.subMenuOpen) return;
        this.menuIndex = i;
        this.updateMenuHighlight();
        this.confirmMenuAction();
      });
    });
  },

  updateMenuHighlight() {
    this.els.menu.querySelectorAll('.bmenu-item').forEach((item, i) => {
      item.classList.toggle('highlighted', i === this.menuIndex);
    });
  },

  confirmMenuAction() {
    const items = this.els.menu.querySelectorAll('.bmenu-item');
    const action = items[this.menuIndex]?.dataset.action;
    if (!action) return;
    audio.playConfirm();

    switch (action) {
      case 'quote': this.openQuoteMenu(); break;
      case 'proposition': this.useProposition(); break;
      case 'silence': this.useSilence(); break;
      case 'item': this.useItem(); break;
      case 'dialectic': this.addLog('——尚未觉醒——', 'system'); break;
    }
  },

  openQuoteMenu() {
    const skills = this.player.skills.quotes;
    if (!skills || skills.length === 0) return;

    this.subMenuOpen = true;
    this.subMenuIndex = 0;

    let subEl = document.querySelector('.battle-submenu');
    if (!subEl) {
      subEl = document.createElement('div');
      subEl.className = 'battle-submenu';
      this.els.screen.appendChild(subEl);
    }

    subEl.innerHTML = skills.map((sk, i) => `
      <div class="bsub-item" data-idx="${i}">
        <span class="bsub-name">${sk.name}</span>
        <span class="bsub-desc">${sk.desc}</span>
        <span class="bsub-cost">${sk.cost}赫</span>
      </div>
    `).join('') + `<div class="bsub-item" data-idx="back"><span class="bsub-name" style="color:var(--grey)">返回</span></div>`;

    subEl.querySelectorAll('.bsub-item').forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        this.subMenuIndex = i;
        this.updateSubHighlight(subEl);
        audio.playSelect();
      });
      item.addEventListener('click', () => {
        this.subMenuIndex = i;
        this.confirmSubMenu(subEl);
      });
    });

    requestAnimationFrame(() => subEl.classList.add('active'));
    this.updateSubHighlight(subEl);
  },

  updateSubHighlight(subEl) {
    subEl.querySelectorAll('.bsub-item').forEach((item, i) => {
      item.classList.toggle('highlighted', i === this.subMenuIndex);
    });
  },

  handleSubMenuInput(e) {
    const subEl = document.querySelector('.battle-submenu');
    if (!subEl) return;
    const items = subEl.querySelectorAll('.bsub-item');

    if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      this.subMenuIndex = Math.max(0, this.subMenuIndex - 1);
      this.updateSubHighlight(subEl);
      audio.playSelect();
    } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      this.subMenuIndex = Math.min(items.length - 1, this.subMenuIndex + 1);
      this.updateSubHighlight(subEl);
      audio.playSelect();
    } else if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      this.confirmSubMenu(subEl);
    } else if (e.code === 'Escape') {
      e.preventDefault();
      this.closeSubMenu(subEl);
    }
  },

  confirmSubMenu(subEl) {
    const items = subEl.querySelectorAll('.bsub-item');
    const idx = items[this.subMenuIndex]?.dataset.idx;

    if (idx === 'back' || idx === undefined) {
      this.closeSubMenu(subEl);
      return;
    }

    const skill = this.player.skills.quotes[parseInt(idx)];
    if (!skill) return;

    if (this.player.stats.logos < skill.cost) {
      this.addLog('逻各斯不足。', 'system');
      return;
    }

    audio.playConfirm();
    this.closeSubMenu(subEl);
    this.executePlayerSkill(skill);
  },

  closeSubMenu(subEl) {
    this.subMenuOpen = false;
    subEl.classList.remove('active');
    audio.playSelect();
  },

  async executePlayerSkill(skill) {
    this.turn = 'executing';
    this.els.menu.classList.add('disabled');

    // 消耗逻各斯
    this.player.stats.logos = Math.max(0, this.player.stats.logos - skill.cost);
    this.updateBars();

    if (skill.type === 'attack') {
      this.addLog(`珀 使用了「${skill.name}」`, 'action');
      await this.wait(300);
      // 攻击演出
      audio.playHit();
      const ev = this.els.enemyVisual.querySelector('.battle-entity');
      if (ev) ev.classList.add('damaged');
      setTimeout(() => { if (ev) ev.classList.remove('damaged'); }, 500);

      const dmg = skill.power + Math.floor(Math.random() * 5);
      this.enemy.stats.hp -= dmg;
      this.updateBars();
      this.addLog(`造成 ${dmg} 点伤害`, 'damage');

      await this.wait(600);
    } else if (skill.type === 'heal') {
      this.addLog(`珀 使用了「${skill.name}」`, 'action');
      const heal = skill.power;
      this.player.stats.hp = Math.min(this.player.stats.hpMax, this.player.stats.hp + heal);
      this.updateBars();
      this.addLog(`恢复了 ${heal} HP`, 'heal');
      await this.wait(600);
    }

    // 检查胜负
    if (this.enemy.stats.hp <= 0) {
      await this.victory();
      return;
    }

    this.turn = 'enemy';
    await this.enemyTurn();
  },

  async useProposition() {
    const prop = this.player.skills.propositions[0];
    if (!prop) return;

    if (this.player.stats.logos < prop.cost) {
      this.addLog('逻各斯不足。', 'system');
      return;
    }

    this.turn = 'executing';
    this.els.menu.classList.add('disabled');
    this.player.stats.logos -= prop.cost;
    this.updateBars();

    // 宣言演出
    await this.showDeclaration(prop.declaration, this.player.color);

    this.addLog(`命题展开——「${prop.name}」`, 'action');

    // 特殊效果：大伤害
    audio.playHit();
    const ev = this.els.enemyVisual.querySelector('.battle-entity');
    if (ev) ev.classList.add('damaged');
    this.els.screen.classList.add('screen-shake');
    setTimeout(() => { if (ev) ev.classList.remove('damaged'); this.els.screen.classList.remove('screen-shake'); }, 600);

    const dmg = 25 + Math.floor(Math.random() * 10);
    this.enemy.stats.hp -= dmg;
    this.updateBars();
    this.addLog(`造成 ${dmg} 点伤害`, 'damage');

    // 结晶化代价
    GameState.player.crystallization += 2;
    this.addLog('结晶化进度 +2%', 'system');

    await this.wait(800);

    if (this.enemy.stats.hp <= 0) { await this.victory(); return; }
    this.turn = 'enemy';
    await this.enemyTurn();
  },

  async useSilence() {
    this.turn = 'executing';
    this.els.menu.classList.add('disabled');
    this.addLog('珀 选择了沉默。', 'system');
    this.player.stats.logos = Math.min(this.player.stats.logosMax, this.player.stats.logos + 1);
    this.updateBars();
    this.addLog('逻各斯 +1.0赫', 'heal');
    await this.wait(500);
    this.turn = 'enemy';
    await this.enemyTurn();
  },

  useItem() {
    this.addLog('——口袋里只有宝矿力的空罐——', 'system');
  },

  async showDeclaration(text, color) {
    const decl = this.els.declaration;
    decl.innerHTML = `
      <div class="declaration-text" style="color:${color};text-shadow:0 0 40px ${color}40">${text}</div>
      <div class="declaration-signature" style="color:${color}">${this.player.signature}</div>
    `;
    decl.classList.add('active');
    audio.playDeclare();

    await this.wait(200);
    decl.querySelector('.declaration-text').classList.add('animate');
    await this.wait(600);
    decl.querySelector('.declaration-signature').classList.add('animate');
    await this.wait(1200);

    decl.style.transition = 'opacity 0.5s';
    decl.style.opacity = '0';
    await this.wait(500);
    decl.classList.remove('active');
    decl.style.opacity = '';
    decl.style.transition = '';
  },

  async enemyTurn() {
    await this.wait(800);

    // AI选择技能
    const skills = this.enemy.skills;
    let skill;
    if (this.enemy.stats.logos >= 2 && Math.random() > 0.5) {
      skill = skills.find(s => s.cost <= this.enemy.stats.logos && s.type === 'attack' && s.power >= 12) || skills[0];
    } else {
      skill = skills[0];
    }

    if (this.enemy.stats.logos < skill.cost) {
      this.addLog(`${this.enemy.nameShort} 逻各斯枯竭，陷入沉默。`, 'system');
      this.enemy.stats.logos = Math.min(this.enemy.stats.logosMax, this.enemy.stats.logos + 1);
      await this.wait(600);
      this.startPlayerTurn();
      return;
    }

    // 宣言演出（大招）
    if (skill.declaration) {
      await this.showDeclaration(skill.declaration, this.enemy.color);
    }

    this.enemy.stats.logos -= skill.cost;

    if (skill.type === 'attack') {
      this.addLog(`${this.enemy.nameShort} 使用了「${skill.name}」`, 'action');
      await this.wait(300);
      audio.playHit();
      const pv = this.els.playerVisual.querySelector('.battle-entity');
      if (pv) pv.classList.add('damaged');
      setTimeout(() => { if (pv) pv.classList.remove('damaged'); }, 500);

      const dmg = skill.power + Math.floor(Math.random() * 5) - 2;
      this.player.stats.hp -= Math.max(1, dmg);
      this.updateBars();
      this.addLog(`受到 ${Math.max(1, dmg)} 点伤害`, 'damage');
      await this.wait(500);
    } else if (skill.type === 'debuff') {
      this.addLog(`${this.enemy.nameShort} 使用了「${skill.name}」`, 'action');
      this.addLog('世界在计算你的幸福——', 'system');
      GameState.player.crystallization += 3;
      this.addLog('结晶化进度 +3%', 'damage');
      await this.wait(600);
    }

    // 检查玩家死亡
    if (this.player.stats.hp <= 0) {
      await this.playerDeath();
      return;
    }

    this.startPlayerTurn();
  },

  startPlayerTurn() {
    this.turn = 'player';
    this.els.menu.classList.remove('disabled');
    this.menuIndex = 0;
    this.updateMenuHighlight();
  },

  async playerDeath() {
    GameState.player.deathCount++;
    this.addLog(`——第${GameState.player.deathCount}次死亡——`, 'system');
    this.addLog('心跳停止。', 'damage');

    this.els.screen.classList.add('screen-shake');
    audio.playGlitch();
    await this.wait(800);
    this.els.screen.classList.remove('screen-shake');

    this.addLog('……', 'system');
    await this.wait(1000);
    this.addLog('3秒前。重置。', 'system');
    this.addLog('只有记忆不会消失。', 'system');

    // 重置HP
    this.player.stats.hp = Math.floor(this.player.stats.hpMax * 0.5);
    this.player.stats.logos = Math.min(this.player.stats.logosMax, this.player.stats.logos + 2);
    GameState.player.crystallization += 1;
    this.updateBars();

    await this.wait(800);
    this.addLog(`HP恢复至${this.player.stats.hp}。代价：结晶化+1%`, 'system');
    this.startPlayerTurn();
  },

  async victory() {
    this.addLog('——战斗结束——', 'system');
    await this.wait(500);

    if (this.enemy.drops) {
      if (this.enemy.drops.logos) {
        this.player.stats.logos = Math.min(this.player.stats.logosMax, this.player.stats.logos + this.enemy.drops.logos);
        this.addLog(`逻各斯 +${this.enemy.drops.logos}赫`, 'heal');
      }
      if (this.enemy.drops.crystal) {
        GameState.player.crystallization = Math.max(0, GameState.player.crystallization + this.enemy.drops.crystal);
        this.addLog(`结晶化 ${this.enemy.drops.crystal}%`, 'heal');
      }
    }

    // 同步回GameState
    GameState.player.hp = this.player.stats.hp;
    GameState.player.logos = this.player.stats.logos;

    await this.wait(1500);
    this.end();
  },

  end() {
    this.active = false;
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
      this._keyHandler = null;
    }
    const sub = document.querySelector('.battle-submenu');
    if (sub) sub.remove();
    Engine.onBattleEnd();
  },

  addLog(text, type = '') {
    const entry = document.createElement('div');
    entry.className = 'battle-log-entry';
    entry.innerHTML = `<span class="log-${type}">${text}</span>`;
    this.els.log.appendChild(entry);
    this.els.log.scrollTop = this.els.log.scrollHeight;
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
