const DialogueSystem = {
  active: false,
  currentScene: null,
  nodeIndex: 0,
  isTyping: false,
  _typeTimer: null,
  waitingForInput: false,
  fullText: '',
  _choiceHandler: null,

  els: {},

  init() {
    this.els = {
      screen: document.getElementById('screen-dialogue'),
      bg: document.getElementById('dlg-bg'),
      box: document.getElementById('dlg-box'),
      name: document.getElementById('dlg-name'),
      nameText: document.querySelector('#dlg-name .dlg-name-text'),
      text: document.getElementById('dlg-text'),
      indicator: document.getElementById('dlg-indicator'),
      narration: document.getElementById('dlg-narration'),
      narrationText: document.getElementById('narration-text'),
      choices: document.getElementById('dlg-choices'),
      location: document.getElementById('dlg-location'),
      charaLeft: document.getElementById('dlg-chara-left'),
      charaRight: document.getElementById('dlg-chara-right'),
    };
    this._boundAdvance = (e) => {
      if (!this.active) return;
      if (e.target.closest && e.target.closest('.dlg-choices')) return;
      if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') { e.preventDefault(); this.advance(); }
    };
    document.addEventListener('keydown', this._boundAdvance);
    this.els.screen.addEventListener('click', this._boundAdvance);
  },

  async playScene(sceneData) {
    this.currentScene = sceneData;
    this.nodeIndex = 0;
    this.active = true;
    this.els.charaLeft.innerHTML = '';
    this.els.charaRight.innerHTML = '';
    this.els.charaLeft.classList.remove('speaking');
    this.els.charaRight.classList.remove('speaking');
    if (sceneData.bgColor) this.els.bg.style.background = sceneData.bgColor;
    if (sceneData.location) this.showLocation(sceneData.location.time, sceneData.location.place);
    audio.startCicadas();
    await this.wait(400);
    this.processNode();
  },

  processNode() {
    if (!this.currentScene) return;
    const nodes = this.currentScene.nodes;
    if (this.nodeIndex >= nodes.length) { this.endScene(); return; }
    const node = nodes[this.nodeIndex];
    switch (node.type) {
      case 'narration': this.showNarration(node); break;
      case 'dialogue': this.showDialogue(node); break;
      case 'choice': this.showChoices(node); break;
      case 'effect': this.doEffect(node); break;
      case 'goto': this.gotoScene(node.target); break;
      case 'battle': this.startBattle(node); break;
      case 'explore': this.toExplore(); break;
      case 'unlock': this.doUnlock(node); break;
      case 'end': this.endScene(); break;
      default: this.nodeIndex++; this.processNode();
    }
  },

  showNarration(node) {
    this.els.box.classList.remove('active');
    this.els.narration.classList.add('active');
    const t = this.els.narrationText;
    t.innerHTML = '';
    t.className = 'narration-text';
    if (node.style === 'radio') t.classList.add('style-radio');
    else if (node.style === 'chapter_end') t.classList.add('style-chapter-end');
    let speed = GameState.config.textSpeed;
    if (node.pace === 'slow') speed = 50;
    if (node.pace === 'dramatic') speed = 65;
    if (node.pace === 'pause' || node.pace === 'long_pause') speed = 45;
    this.typeText(t, node.text, speed, () => {
      this.waitingForInput = true;
      if (node.auto) setTimeout(() => this.advance(), node.duration || 1500);
    });
  },

  showDialogue(node) {
    this.els.narration.classList.remove('active');
    this.els.box.classList.add('active');
    this.els.indicator.classList.remove('visible');
    const cd = CHARACTERS[node.speaker];
    if (cd) {
      this.els.nameText.textContent = cd.nameShort || cd.name;
      this.els.name.classList.add('visible');
      this.els.nameText.style.color = cd.color;
      this.els.box.querySelector('.dlg-text-area').style.borderLeftColor = cd.color;
      this.updateChara(node.speaker, node.position || 'left');
    }
    this.typeText(this.els.text, node.text, GameState.config.textSpeed, () => {
      this.waitingForInput = true;
      this.els.indicator.classList.add('visible');
      if (node.auto) setTimeout(() => this.advance(), node.duration || 1500);
    });
  },

  showChoices(node) {
    this.els.narration.classList.remove('active');
    this.els.box.classList.remove('active');
    this.els.choices.innerHTML = '';
    let choiceIdx = 0;
    node.choices.forEach((choice, i) => {
      const item = document.createElement('div');
      item.className = 'choice-item';
      item.innerHTML = `<span class="choice-marker">▸</span><span class="choice-text">${choice.text}</span><span class="choice-effect">${choice.tag ? '['+choice.tag+']' : ''}</span>`;
      item.addEventListener('click', () => this.selectChoice(choice, i, node));
      item.addEventListener('mouseenter', () => { choiceIdx = i; this.hlChoice(i); audio.playSelect(); });
      this.els.choices.appendChild(item);
    });
    requestAnimationFrame(() => this.els.choices.classList.add('active'));
    this.hlChoice(0);
    this._choiceHandler = (e) => {
      if (e.code === 'ArrowUp' || e.code === 'KeyW') { e.preventDefault(); choiceIdx = Math.max(0, choiceIdx-1); this.hlChoice(choiceIdx); audio.playSelect(); }
      else if (e.code === 'ArrowDown' || e.code === 'KeyS') { e.preventDefault(); choiceIdx = Math.min(node.choices.length-1, choiceIdx+1); this.hlChoice(choiceIdx); audio.playSelect(); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.selectChoice(node.choices[choiceIdx], choiceIdx, node); }
    };
    document.addEventListener('keydown', this._choiceHandler);
  },

  hlChoice(idx) {
    this.els.choices.querySelectorAll('.choice-item').forEach((item, i) => item.classList.toggle('highlighted', i === idx));
  },

  selectChoice(choice, idx) {
    if (this._choiceHandler) { document.removeEventListener('keydown', this._choiceHandler); this._choiceHandler = null; }
    audio.playConfirm();
    GameState.applyEffect(choice.effect);
    GameState.story.choices.push({ scene: this.currentScene.id, index: idx, tag: choice.tag });
    const items = this.els.choices.querySelectorAll('.choice-item');
    items.forEach((item, i) => { if (i !== idx) { item.style.transition = 'opacity 0.3s, transform 0.3s'; item.style.opacity = '0'; item.style.transform = 'translateX(30px)'; }});
    setTimeout(() => {
      this.els.choices.classList.remove('active');
      this.els.choices.innerHTML = '';
      if (choice.next) this.gotoScene(choice.next);
      else { this.nodeIndex++; this.processNode(); }
    }, 500);
  },

  async doEffect(node) {
    switch (node.effect) {
      case 'glitch': this.els.screen.classList.add('screen-shake'); audio.playGlitch(); await this.wait(node.duration||500); this.els.screen.classList.remove('screen-shake'); break;
      case 'screen_shake': this.els.screen.classList.add('screen-shake'); await this.wait(node.duration||300); this.els.screen.classList.remove('screen-shake'); break;
      case 'fade_black': await Transitions.fadeToBlack(node.duration||1000); await this.wait(400); await Transitions.fadeFromBlack(node.duration||1000); break;
    }
    this.nodeIndex++; this.processNode();
  },

  doUnlock(node) {
    if (node.archive) GameState.unlockArchive(node.archive.type, node.archive.id);
    if (node.flag) Object.assign(GameState.story.flags, node.flag);
    this.nodeIndex++; this.processNode();
  },

  startBattle(node) {
    this.active = false;
    this.els.box.classList.remove('active');
    this.els.narration.classList.remove('active');
    audio.stopCicadas();
    Engine.startBattle(node.enemy, node.afterScene || null);
  },

  toExplore() {
    this.active = false;
    this.els.box.classList.remove('active');
    this.els.narration.classList.remove('active');
    audio.stopCicadas();
    Transitions.switchScreen('dialogue', 'explore', 'fade', 500).then(() => {
      ExploreSystem.enter(Engine.currentChapterScript);
    });
  },

  gotoScene(targetId) {
    // 在当前章和序章中查找
    const scripts = [Engine.currentChapterScript, SCRIPT_PROLOGUE];
    if (typeof SCRIPT_CHAPTER1 !== 'undefined') scripts.push(SCRIPT_CHAPTER1);
    let target = null;
    for (const s of scripts) {
      if (!s || !s.scenes) continue;
      target = s.scenes.find(sc => sc.id === targetId);
      if (target) break;
    }
    if (target) {
      Transitions.fadeToBlack(300).then(() => {
        if (target.location) this.showLocation(target.location.time, target.location.place);
        if (target.bgColor) this.els.bg.style.background = target.bgColor;
        Transitions.fadeFromBlack(300).then(() => {
          this.currentScene = target;
          this.nodeIndex = 0;
          this.processNode();
        });
      });
    } else {
      this.nodeIndex++; this.processNode();
    }
  },

  advance() {
    if (!this.active) return;
    if (this.isTyping) { this.skipTyping(); return; }
    if (this.waitingForInput) { this.waitingForInput = false; this.els.indicator.classList.remove('visible'); this.nodeIndex++; this.processNode(); }
  },

  typeText(element, text, speed, callback) {
    this.isTyping = true; this.fullText = text; element.innerHTML = '';
    const parsed = [];
    for (const ch of text) { if (ch === '\n') parsed.push({type:'br'}); else parsed.push({type:'char',value:ch}); }
    let i = 0;
    const cursor = document.createElement('span'); cursor.className = 'typing-cursor';
    const step = () => {
      if (!this.isTyping) return;
      if (i >= parsed.length) { this.isTyping = false; cursor.remove(); if (callback) callback(); return; }
      const c = parsed[i];
      if (c.type === 'br') element.appendChild(document.createElement('br'));
      else { element.appendChild(document.createTextNode(c.value)); if (i % 4 === 0) audio.playTypewriter(); }
      cursor.remove(); element.appendChild(cursor);
      let delay = speed;
      if (c.type === 'char') {
        if ('。！？'.includes(c.value)) delay = speed * 5;
        else if ('…'.includes(c.value)) delay = speed * 3;
        else if ('—'.includes(c.value)) delay = speed * 2;
        else if ('，、；：'.includes(c.value)) delay = speed * 2.5;
      }
      i++; this._typeTimer = setTimeout(step, delay);
    };
    step();
  },

  skipTyping() {
    if (this._typeTimer) { clearTimeout(this._typeTimer); this._typeTimer = null; }
    this.isTyping = false;
    const target = this.els.narration.classList.contains('active') ? this.els.narrationText : this.els.text;
    target.innerHTML = this.fullText.replace(/\n/g, '<br>');
    const c = target.querySelector('.typing-cursor'); if (c) c.remove();
    this.waitingForInput = true; this.els.indicator.classList.add('visible');
  },

  showLocation(time, place) {
    const loc = this.els.location;
    loc.querySelector('.loc-time').textContent = time;
    loc.querySelector('.loc-place').textContent = place;
    loc.classList.add('visible');
    setTimeout(() => loc.classList.remove('visible'), 4500);
  },

  updateChara(charId, position) {
    const cd = CHARACTERS[charId]; if (!cd) return;
    const target = position === 'right' ? this.els.charaRight : this.els.charaLeft;
    const other = position === 'right' ? this.els.charaLeft : this.els.charaRight;
    target.innerHTML = '<div class="chara-silhouette" style="color:'+cd.color+'">'+cd.silhouetteChar+'</div>';
    target.classList.add('speaking'); other.classList.remove('speaking');
  },

  endScene() {
    this.active = false;
    this.els.box.classList.remove('active');
    this.els.narration.classList.remove('active');
    this.els.choices.classList.remove('active');
    audio.stopCicadas(); audio.stopVendingHum();
    Engine.onSceneEnd();
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); }
};
