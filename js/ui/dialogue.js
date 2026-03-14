/**
 * 对话/剧情系统
 * 支持: 旁白、对话、选项、特效指令
 */
const DialogueSystem = {
  // 状态
  active: false,
  currentScene: null,
  nodeIndex: 0,
  isTyping: false,
  typingTimer: null,
  waitingForInput: false,
  fullText: '',
  displayedChars: 0,

  // DOM
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

    this.bindInput();
  },

  bindInput() {
    this._inputHandler = (e) => {
      if (!this.active) return;

      if (e.code === 'Space' || e.code === 'Enter' || e.type === 'click') {
        e.preventDefault();
        this.advance();
      }
    };

    document.addEventListener('keydown', this._inputHandler);
    this.els.screen.addEventListener('click', (e) => {
      // 不处理选项区域的点击
      if (e.target.closest('.dlg-choices')) return;
      this._inputHandler(e);
    });
  },

  /**
   * 加载并播放场景
   */
  async playScene(sceneData) {
    this.currentScene = sceneData;
    this.nodeIndex = 0;
    this.active = true;

    // 设置背景
    if (sceneData.bgColor) {
      this.els.bg.style.background = sceneData.bgColor;
    }

    // 设置场景信息
    if (sceneData.location) {
      this.showLocation(sceneData.location.time, sceneData.location.place);
    }

    // 开始环境音
    audio.startCicadas();
    audio.startVendingHum();

    // 处理第一个节点
    await this.wait(600);
    this.processNode();
  },

  /**
   * 处理当前节点
   */
  processNode() {
    if (!this.currentScene) return;

    const nodes = this.currentScene.nodes;
    if (this.nodeIndex >= nodes.length) {
      this.endScene();
      return;
    }

    const node = nodes[this.nodeIndex];

    switch (node.type) {
      case 'narration':
        this.showNarration(node);
        break;
      case 'dialogue':
        this.showDialogue(node);
        break;
      case 'choice':
        this.showChoices(node);
        break;
      case 'effect':
        this.executeEffect(node);
        break;
      case 'goto':
        this.gotoScene(node.target);
        break;
      default:
        this.nodeIndex++;
        this.processNode();
    }
  },

  /**
   * 显示旁白
   */
  showNarration(node) {
    // 隐藏对话框，显示旁白层
    this.els.box.classList.remove('active');
    this.els.narration.classList.add('active');

    // 根据样式调整
    const narText = this.els.narrationText;
    narText.innerHTML = '';
    narText.className = 'narration-text';

    if (node.style === 'radio') {
      narText.style.color = 'var(--crt-green)';
      narText.style.fontFamily = 'var(--font-mono)';
      narText.style.fontSize = '0.95rem';
      narText.style.textShadow = '0 0 8px var(--crt-green-dim)';
    } else if (node.style === 'chapter_end') {
      narText.style.color = 'var(--grey)';
      narText.style.fontFamily = 'var(--font-serif)';
      narText.style.fontSize = '1.3rem';
      narText.style.letterSpacing = '0.4em';
    } else {
      narText.style.color = '';
      narText.style.fontFamily = '';
      narText.style.fontSize = '';
      narText.style.textShadow = '';
      narText.style.letterSpacing = '';
    }

    // 打字速度
    let speed = GameState.config.textSpeed;
    if (node.pace === 'slow') speed = 50;
    if (node.pace === 'dramatic') speed = 70;
    if (node.pace === 'pause') speed = 40;

    this.typeText(narText, node.text, speed, () => {
      this.waitingForInput = true;
      // 旁白模式下的继续提示
      if (node.auto) {
        setTimeout(() => this.advance(), node.duration || 1500);
      }
    });
  },

  /**
   * 显示对话
   */
  showDialogue(node) {
    // 隐藏旁白，显示对话框
    this.els.narration.classList.remove('active');
    this.els.box.classList.add('active');

    // 角色信息
    const charData = CHARACTERS[node.speaker];
    if (charData) {
      this.els.nameText.textContent = charData.nameShort || charData.name;
      this.els.name.classList.add('visible');

      // 名牌颜色
      this.els.name.querySelector('.dlg-name-text').style.color = charData.color;
      this.els.box.querySelector('.dlg-text-area').style.borderLeftColor = charData.color;

      // 角色立绘（文字剪影）
      this.updateCharaSilhouette(node.speaker, node.position || 'left');
    }

    this.els.indicator.classList.remove('visible');

    let speed = GameState.config.textSpeed;
    this.typeText(this.els.text, node.text, speed, () => {
      this.waitingForInput = true;
      this.els.indicator.classList.add('visible');
      if (node.auto) {
        setTimeout(() => this.advance(), node.duration || 1500);
      }
    });
  },

  /**
   * 显示选项
   */
  showChoices(node) {
    this.els.narration.classList.remove('active');
    this.els.box.classList.remove('active');
    this.els.choices.innerHTML = '';

    node.choices.forEach((choice, index) => {
      const item = document.createElement('div');
      item.className = 'choice-item';
      item.style.animationDelay = `${index * 0.1}s`;

      const marker = document.createElement('span');
      marker.className = 'choice-marker';
      marker.textContent = '▸';

      const text = document.createElement('span');
      text.className = 'choice-text';
      text.textContent = choice.text;

      const effect = document.createElement('span');
      effect.className = 'choice-effect';
      if (choice.tag) {
        effect.textContent = `[${choice.tag}]`;
      }

      item.appendChild(marker);
      item.appendChild(text);
      item.appendChild(effect);

      item.addEventListener('click', () => {
        this.selectChoice(choice, index);
      });

      item.addEventListener('mouseenter', () => {
        audio.playSelect();
      });

      this.els.choices.appendChild(item);
    });

    // 显示选项面板
    requestAnimationFrame(() => {
      this.els.choices.classList.add('active');
    });

    // 键盘支持
    this._choiceIndex = 0;
    this._choiceItems = this.els.choices.querySelectorAll('.choice-item');
    this._choiceHandler = (e) => {
      switch (e.code) {
        case 'ArrowUp':
        case 'KeyW':
          e.preventDefault();
          this._choiceIndex = Math.max(0, this._choiceIndex - 1);
          this.highlightChoice(this._choiceIndex);
          audio.playSelect();
          break;
        case 'ArrowDown':
        case 'KeyS':
          e.preventDefault();
          this._choiceIndex = Math.min(node.choices.length - 1, this._choiceIndex + 1);
          this.highlightChoice(this._choiceIndex);
          audio.playSelect();
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          this.selectChoice(node.choices[this._choiceIndex], this._choiceIndex);
          break;
      }
    };
    document.addEventListener('keydown', this._choiceHandler);
    this.highlightChoice(0);
  },

  highlightChoice(index) {
    this._choiceItems.forEach((item, i) => {
      item.style.borderLeftColor = i === index ? 'var(--heat)' : 'transparent';
      item.style.background = i === index ? 'rgba(255,107,53,0.08)' : '';
      item.querySelector('.choice-marker').style.opacity = i === index ? '1' : '0';
      item.querySelector('.choice-text').style.color = i === index ? 'var(--white)' : '';
    });
  },

  selectChoice(choice, index) {
    // 移除键盘监听
    if (this._choiceHandler) {
      document.removeEventListener('keydown', this._choiceHandler);
      this._choiceHandler = null;
    }

    audio.playConfirm();

    // 应用效果
    GameState.applyEffect(choice.effect);
    GameState.story.choices.push({
      scene: this.currentScene.id,
      index: index,
      tag: choice.tag,
      text: choice.text
    });

    // 选中动画
    const items = this.els.choices.querySelectorAll('.choice-item');
    items.forEach((item, i) => {
      if (i !== index) {
        item.style.transition = 'opacity 0.3s, transform 0.3s';
        item.style.opacity = '0';
        item.style.transform = 'translateX(30px)';
      } else {
        item.style.transition = 'all 0.3s';
        item.style.borderLeftColor = 'var(--heat)';
        item.style.background = 'rgba(255,107,53,0.15)';
      }
    });

    setTimeout(() => {
      this.els.choices.classList.remove('active');
      this.els.choices.innerHTML = '';

      // 跳转到选择结果场景
      if (choice.next) {
        this.gotoScene(choice.next);
      } else {
        this.nodeIndex++;
        this.processNode();
      }
    }, 600);
  },

  /**
   * 执行特效
   */
  async executeEffect(node) {
    switch (node.effect) {
      case 'glitch':
        this.els.screen.classList.add('screen-shake');
        audio.playGlitch();
        await this.wait(node.duration || 500);
        this.els.screen.classList.remove('screen-shake');
        break;

      case 'screen_shake':
        this.els.screen.classList.add('screen-shake');
        await this.wait(node.duration || 300);
        this.els.screen.classList.remove('screen-shake');
        break;

      case 'fade_black':
        await Transitions.fadeToBlack(node.duration || 1000);
        await this.wait(500);
        await Transitions.fadeFromBlack(node.duration || 1000);
        break;

      case 'flash_white':
        const flash = document.createElement('div');
        flash.style.cssText = `
          position:fixed; top:0; left:0; width:100%; height:100%;
          background:white; z-index:999; opacity:0;
          transition: opacity 0.1s;
        `;
        document.body.appendChild(flash);
        requestAnimationFrame(() => { flash.style.opacity = '0.8'; });
        await this.wait(100);
        flash.style.transition = 'opacity 0.6s';
        flash.style.opacity = '0';
        await this.wait(700);
        flash.remove();
        break;
    }

    this.nodeIndex++;
    this.processNode();
  },

  /**
   * 跳转场景
   */
  gotoScene(targetId) {
    // 在当前剧本中查找目标场景
    const allScenes = SCRIPT_PROLOGUE.scenes;
    const targetScene = allScenes.find(s => s.id === targetId);
    if (targetScene) {
      // 转场
      Transitions.fadeToBlack(400).then(() => {
        // 更新位置信息
        if (targetScene.location) {
          this.showLocation(targetScene.location.time, targetScene.location.place);
        }
        if (targetScene.bgColor) {
          this.els.bg.style.background = targetScene.bgColor;
        }
        Transitions.fadeFromBlack(400).then(() => {
          this.playScene(targetScene);
        });
      });
    } else {
      // 场景未找到，继续下一个节点
      this.nodeIndex++;
      this.processNode();
    }
  },

  /**
   * 推进（点击/按键）
   */
  advance() {
    if (!this.active) return;

    if (this.isTyping) {
      // 快进打字
      this.skipTyping();
      return;
    }

    if (this.waitingForInput) {
      this.waitingForInput = false;
      this.els.indicator.classList.remove('visible');
      this.nodeIndex++;
      this.processNode();
    }
  },

  /**
   * 打字效果
   */
  typeText(element, text, speed = 30, callback) {
    this.isTyping = true;
    this.fullText = text;
    this.displayedChars = 0;

    // 替换\n为<br>
    const htmlText = text.replace(/\n/g, '<br>');
    element.innerHTML = '';

    const chars = [];
    // 解析文本，保留<br>标签
    let temp = document.createElement('div');
    temp.innerHTML = htmlText;
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const ch of node.textContent) {
          chars.push({ type: 'char', value: ch });
        }
      } else if (node.nodeName === 'BR') {
        chars.push({ type: 'br' });
      } else {
        for (const child of node.childNodes) {
          walk(child);
        }
      }
    };
    walk(temp);

    let index = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';

    this.typingTimer = setInterval(() => {
      if (index >= chars.length) {
        clearInterval(this.typingTimer);
        this.typingTimer = null;
        this.isTyping = false;
        cursor.remove();
        if (callback) callback();
        return;
      }

      const ch = chars[index];
      if (ch.type === 'br') {
        element.appendChild(document.createElement('br'));
      } else {
        const span = document.createTextNode(ch.value);
        element.appendChild(span);

        // 随机微弱打字音
        if (index % 3 === 0) {
          audio.playTypewriter();
        }
      }

      // 移动光标
      cursor.remove();
      element.appendChild(cursor);

      // 标点符号延迟
      let nextDelay = speed;
      if ('。、！？…——'.includes(ch.value)) nextDelay = speed * 4;
      else if ('，；：'.includes(ch.value)) nextDelay = speed * 2;
      else if (ch.value === '\n') nextDelay = speed * 3;

      if (nextDelay !== speed) {
        clearInterval(this.typingTimer);
        this.typingTimer = setTimeout(() => {
          index++;
          this.typingTimer = setInterval(arguments.callee, speed);
          // 重新开始interval需要用递归方式
        }, nextDelay);
        // 这种方式有问题，改用递归
        clearInterval(this.typingTimer);
        this.typingTimer = null;
        this._typeRecursive(element, chars, index + 1, speed, cursor, callback);
        return;
      }

      index++;
    }, speed);

    // 替代方案：全部用递归
    clearInterval(this.typingTimer);
    this.typingTimer = null;
    element.innerHTML = '';
    this._typeRecursive(element, chars, 0, speed, cursor, callback);
  },

  _typeRecursive(element, chars, index, speed, cursor, callback) {
    if (!this.isTyping) return; // 已跳过

    if (index >= chars.length) {
      this.isTyping = false;
      cursor.remove();
      if (callback) callback();
      return;
    }

    const ch = chars[index];
    if (ch.type === 'br') {
      element.appendChild(document.createElement('br'));
    } else {
      element.appendChild(document.createTextNode(ch.value));
      if (index % 3 === 0) audio.playTypewriter();
    }

    cursor.remove();
    element.appendChild(cursor);

    // 计算延迟
    let delay = speed;
    if (ch.type === 'char') {
      if ('。！？'.includes(ch.value)) delay = speed * 5;
      else if ('…'.includes(ch.value)) delay = speed * 3;
      else if ('——'.includes(ch.value)) delay = speed * 2;
      else if ('，、；：'.includes(ch.value)) delay = speed * 2.5;
    }

    this.typingTimer = setTimeout(() => {
      this._typeRecursive(element, chars, index + 1, speed, cursor, callback);
    }, delay);
  },

  skipTyping() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
      clearInterval(this.typingTimer);
      this.typingTimer = null;
    }
    this.isTyping = false;

    // 直接显示完整文本
    const targetEl = this.els.narration.classList.contains('active')
      ? this.els.narrationText
      : this.els.text;

    targetEl.innerHTML = this.fullText.replace(/\n/g, '<br>');

    // 移除光标
    const cursor = targetEl.querySelector('.typing-cursor');
    if (cursor) cursor.remove();

    this.waitingForInput = true;
    this.els.indicator.classList.add('visible');
  },

  /**
   * 显示场景位置信息
   */
  showLocation(time, place) {
    const loc = this.els.location;
    loc.querySelector('.loc-time').textContent = time;
    loc.querySelector('.loc-place').textContent = place;
    loc.classList.add('visible');

    // 5秒后淡出
    setTimeout(() => {
      loc.classList.remove('visible');
    }, 5000);
  },

  /**
   * 更新角色剪影
   */
  updateCharaSilhouette(charId, position) {
    const charData = CHARACTERS[charId];
    if (!charData) return;

    const targetEl = position === 'right' ? this.els.charaRight : this.els.charaLeft;
    const otherEl = position === 'right' ? this.els.charaLeft : this.els.charaRight;

    // 创建文字剪影
    targetEl.innerHTML = `
      <div class="chara-silhouette" style="color: ${charData.color}">
        ${charData.silhouetteChar}
      </div>
    `;
    targetEl.classList.add('speaking');
    otherEl.classList.remove('speaking');
  },

  /**
   * 场景结束
   */
  endScene() {
    this.active = false;
    this.els.box.classList.remove('active');
    this.els.narration.classList.remove('active');
    this.els.choices.classList.remove('active');
    audio.stopCicadas();
    audio.stopVendingHum();

    // 通知引擎
    if (Engine.onSceneEnd) {
      Engine.onSceneEnd();
    }
  },

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
