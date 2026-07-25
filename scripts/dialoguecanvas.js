/* --- 对话画布逻辑 (Dialogue Canvas Logic) --- */
function openDialogueCanvas() {
    isCanvasModeOpen = true;
    const modal = document.getElementById('dialogueCanvasModal');
    modal.style.display = 'block';
    
    // 延时一点渲染，确保DOM可见
    setTimeout(() => {
        modal.style.opacity = '1';
        renderDialogueCanvas();
    }, 10);
    
    document.body.style.overflow = 'hidden'; // 锁定主页滚动
}

function closeDialogueCanvas() {
    isCanvasModeOpen = false;
    const modal = document.getElementById('dialogueCanvasModal');
    modal.style.opacity = '0';
    
    // ═══ 停止朗读 ═══
    if (window.canvasTTS?.isPlaying) {
        window.canvasTTS.stop();
    }
    // 恢复朗读按钮状态（无论是否在播放）
    const ttsBtn = document.getElementById('btn-canvas-tts');
    const ttsIcon = document.getElementById('tts-icon');
    if (ttsBtn) {
        ttsBtn.classList.remove('tts-active', 'tts-paused');
        ttsBtn.title = window.currentLang === 'zh-CN' ? '朗读' : 'Read Aloud';
    }
    if (ttsIcon) ttsIcon.className = 'fas fa-volume-high';
    
    // ═══ 停止背景音乐 ═══
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;  // 可选：重置到开头
    }
    // 恢复所有音乐按钮状态
    document.querySelectorAll('.music-wrapper, .music-wrapper-canvas').forEach(btn => {
        btn.classList.remove('music-playing', 'music-active');
    });

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 500);
}

/**
 * 合并导入历史与当前会话历史，返回用于渲染/导出/操作的完整数组
 * @param {Array|null} imported - 从 MD 导入的历史（可能为 null）
 * @param {Array} current - 当前会话的 conversationHistory
 * @returns {Array} 合并后的完整历史数组（imported 在前，current 在后）
 */
function getMergedHistory(imported, current) {
    const result = [];
    
    // 先放入导入的历史（如果存在）
    if (imported && Array.isArray(imported) && imported.length > 0) {
        result.push(...imported);
    }
    
    // 再追加当前会话的新节点
    if (current && Array.isArray(current) && current.length > 0) {
        result.push(...current);
    }
    
    return result;
}

function clearCanvasHistory() {
    // 1. 判断当前是否有内容（考虑导入历史）
    const currentHistory = getMergedHistory(importedHistory, conversationHistory);
    if (!currentHistory || currentHistory.length === 0) {
        alert("画布已经是空的了。");
        return;
    }

    // 2. 提示语稍作调整，提醒用户会清空导入内容
    /*
    const isConfirmed = confirm(
        "⚠️ 高风险操作\n\n" +
        "您确定要清空整个画布吗？\n" +
        "此操作将移除所有当前的思维节点（包括任何从MD导入的历史内容），且无法恢复。\n" +
        "(主界面的对话记录不会受影响)"
    );*/

    // 修改后
    const isConfirmed = confirm(translations[currentLang].confirmClearCanvas);

    // 3. 执行清空
    if (isConfirmed) {
        conversationHistory = [];           // 清空原有对话历史
        importedHistory = null;             // ★ 同时清除导入的历史
        clearCanvasSession();  // ← 追加这行
        renderDialogueCanvas();             // 重绘
        
        // 可选：轻提示
        // alert("画布已清空");
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('inspirationSidebar');
    sidebar.classList.toggle('open');
}

/* --- 核心渲染函数 (renderDialogueCanvas) - 全球化增强版 --- */
function renderDialogueCanvas() {
    // 内部翻译辅助方法
    const _t = (key) => {
        const lang = window.currentLang || 'zh-CN';
        const dict = window.translations?.[lang] || window.translations?.['zh-CN'] || {};
        return dict[key] || key;
    };

    const container = document.getElementById('thoughtStreamContent');
    const svgEl = document.getElementById('thoughtTrailsSvg');
    container.innerHTML = '';
    lastDrawnHash = '';

    const history = getMergedHistory(importedHistory, conversationHistory);
    if (history.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#888; margin-top:100px; font-family:'Noto Serif SC', serif">
            ${_t('canvasEmptyHint')}<br>${_t('canvasEmptyDesc')}
        </div>`;
        svgEl.innerHTML = '';
        return;
    }

    const fragment = document.createDocumentFragment();

    history.forEach((item, index) => {
        const node = document.createElement('div');
        const isUser = item.role === 'user';
        
        node.className = `thought-node ${isUser ? 'question-node' : 'answer-node'}`;
        node.id = `node-${index}`;

        let contentHTML = '';

        // 修改用户节点渲染逻辑
        if (isUser) {
            contentHTML = `
                <div class="user-avatar-mark"><i class="fas fa-user-astronaut"></i></div>
                <div class="node-content user-handwriting">${escapeHtml(item.text)}</div>
            `;
        } else {
            let processedText = item._processedText;
            if (!processedText) {
                processedText = typeof parseMarkdownWithMath === 'function' 
                    ? parseMarkdownWithMath(item.text) 
                    : item.text.replace(/\n/g, '<br>');
                item._processedText = processedText;
            }

            const info = item.leaderInfo || { name: 'Unknown', field: '', contribution: '' };

            contentHTML = `
                <div class="star-decoration-top"><span style="font-family: 'Font Awesome 6 Free'; font-weight: 900;">&#xf4ba;</span></div>
                <div class="leader-header">
                    <div class="leader-name">${info.name}</div>
                    <div class="leader-badges">
                        <span class="badge-field">${info.field}</span>
                    </div>
                </div>
                <div class="leader-contribution-hint" title="${info.contribution}">
                    <i class="fas fa-quote-left"></i> ${info.contribution.substring(0, 30)}...
                </div>
                <div class="node-divider"></div>
                <div class="node-content star-content">${processedText}</div>
                <div class="star-decoration-bottom"><i class="fas fa-feather-alt"></i> SmartOrigin BioMed Insight</div>
            `;
        }
        
        node.innerHTML = contentHTML;
        node.onclick = (e) => addToInspiration(e, item.text);

        /* ═══════════════════════════════════════════════
           【星语上下文按钮】仅 AI 回答节点显示
           用户提问节点不显示上下文按钮
           ═══════════════════════════════════════════════ */
        if (!isUser) {
            // ── 左侧按钮容器 ──
            const leftActions = document.createElement('div');
            leftActions.className = 'left-actions-bar';
        
            // ── 生成页面按钮 ──
            const pageBtn = document.createElement('button');
            pageBtn.className = 'left-action-btn';
            pageBtn.innerHTML = '<i class="fas fa-file-alt"></i>';
            pageBtn.title = _t('generatePageTitle');
            pageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                generateNodePage(item);  // ← 同步执行，确保 window.open 不被拦截
            });
            leftActions.appendChild(pageBtn);
        
            // ── 导入封面按钮 ──
            const coverBtn = document.createElement('button');
            coverBtn.className = 'left-action-btn';
            if (item._cover) {
                coverBtn.classList.add('has-cover');
                coverBtn.title = _t('coverImportedTitle');
            } else {
                coverBtn.title = _t('importCoverTitle');
            }
            coverBtn.innerHTML = '<i class="fas fa-image"></i>';
            coverBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                importNodeCover(item, coverBtn);  // ← 也直接传 item
            });
            leftActions.appendChild(coverBtn);
        
            //node.insertBefore(leftActions, node.firstChild);
            node.appendChild(leftActions);
            
            const ctxBtn = document.createElement('button');
            ctxBtn.className = 'right-action-btn ctx-btn';
            ctxBtn.innerHTML = '<i class="fas fa-star"></i>';  
            ctxBtn.title = _t('contextCanvasAddTitle');
            
            ctxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (!window.starContext) {
                    alert(_t('ctxErrorNotInit'));
                    return;
                }
                
                if (window.starContext.isFull()) {
                    const go = confirm(_t('ctxErrorFullCleanup'));
                    if (go && window.ContextUI) window.ContextUI.openPanel();
                    return;
                }
                
                const res = window.starContext.addFromDialogue(item);
                if (res.success) {
                    ctxBtn.classList.add('just-added');
                    setTimeout(() => ctxBtn.classList.remove('just-added'), 600);
                    
                    if (window.ContextUI && window.ContextUI._renderList) {
                        window.ContextUI._renderList();
                    }
                    
                    const msg = _t('contextToastAdded');
                    const t = document.createElement('div');
                    t.style.cssText = 'position:fixed; bottom:50px; left:50%; transform:translateX(-50%); background:rgba(0,124,240,.12); border:1px solid rgba(0,124,240,.3); color:#007cf0; padding:13px 28px; border-radius:50px; font-size:14px; font-family:"Noto Serif SC",serif; backdrop-filter:blur(12px); z-index:999999; opacity:0; transition:all .35s; pointer-events:none; white-space:nowrap; letter-spacing:1px; box-shadow:0 8px 32px rgba(0,0,0,.3);';
                    t.innerHTML = `<i class="fas fa-star" style="margin-right:8px"></i> ${msg}`;
                    document.body.appendChild(t);
                    requestAnimationFrame(() => requestAnimationFrame(() => t.style.opacity = '1'));
                    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; setTimeout(()=>t.remove(), 350); }, 2200);
                } else {
                    alert(res.message);
                }
            });

            /* ═══════════════════════════════════════════════
               【删除按钮】所有节点保留
            ═══════════════════════════════════════════════ */
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'right-action-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.title = _t('contextRemoveTitleAttr');
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNode(e, index);
            });

            // node.insertBefore(ctxBtn, node.firstChild);
            // ── 右侧按钮容器 ──
            const rightActions = document.createElement('div');
            rightActions.className = 'right-actions-bar';
            
            rightActions.appendChild(ctxBtn);
            rightActions.appendChild(deleteBtn);
            
            //node.insertBefore(rightActions, node.firstChild);            
            node.appendChild(rightActions);
            
        }

        if (isUser) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'right-action-btn delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
            deleteBtn.title = _t('contextRemoveTitleAttr');
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteNode(e, index);
            });
            //node.insertBefore(deleteBtn, node.firstChild);       
            node.appendChild(deleteBtn);
        }
        
        fragment.appendChild(node);
    });

    container.appendChild(fragment);

    if (window.MathJax) {
        const delay = typeof requestIdleCallback !== 'undefined' 
            ? cb => requestIdleCallback(cb, { timeout: 500 })
            : cb => setTimeout(cb, 300);
            
        delay(() => {
            MathJax.typesetPromise([container])
                .then(() => {
                    setTimeout(drawConnections, 100); 
                })
                .catch(err => console.warn('MathJax reflow error:', err));
        });
    } else {
        setTimeout(drawConnections, 200);
    }
}


/* --- 优化版 drawConnections (防抖 + 缓存) --- */
let drawConnectionsTimeout = null;
let lastDrawnHash = '';

function drawConnections() {
    if (drawConnectionsTimeout) clearTimeout(drawConnectionsTimeout);
    drawConnectionsTimeout = setTimeout(() => {
        _doDrawConnections();
    }, 100);
}

function _doDrawConnections() {
    const container = document.getElementById('thoughtStreamContent');
    const svgEl = document.getElementById('thoughtTrailsSvg');
    if (!container || !svgEl) return;
    
    const nodes = container.querySelectorAll('.thought-node');
    
    // 布局未变化则跳过重绘
    const currentHash = Array.from(nodes).map(n => n.offsetTop + ',' + n.offsetHeight).join('|');
    if (currentHash === lastDrawnHash && svgEl.innerHTML !== '') return;
    lastDrawnHash = currentHash;
    
    const newHeight = container.scrollHeight;
    if (svgEl.style.height !== newHeight + 'px') {
        svgEl.style.height = newHeight + 'px';
    }
    
    svgEl.innerHTML = '';
    if (nodes.length < 2) return;

    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < nodes.length - 1; i++) {
        const current = nodes[i];
        const next = nodes[i+1];
        
        const startX = current.offsetLeft + (current.offsetWidth / 2);
        const startY = current.offsetTop + current.offsetHeight;
        const endX = next.offsetLeft + (next.offsetWidth / 2);
        const endY = next.offsetTop;
        
        if (startY >= endY) continue;
        
        const controlY = (endY - startY) / 2;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${startX} ${startY} C ${startX} ${startY + controlY}, ${endX} ${endY - controlY}, ${endX} ${endY}`);
        path.setAttribute("class", "trail-path");
        fragment.appendChild(path);
    }
    
    svgEl.appendChild(fragment);
}


// 将内容添加到手稿区
function addToInspiration(event, text) {
    if(event) event.stopPropagation();

    const sidebar = document.getElementById('inspirationSidebar');
    const notesDiv = document.getElementById('notesContainer');
    console.log("笔记功能，未来考虑");
    // // 1. 确保侧边栏滑出
    // if(!sidebar.classList.contains('open')) {
    //     sidebar.classList.add('open');
    // }

    // // 2. 创建精美的笔记块
    // const noteBlock = document.createElement('div');
    // noteBlock.className = 'inspiration-note-block'; // 对应上面的CSS
    // noteBlock.contentEditable = "false"; // 建议设为 false，防止用户不小心把格式删乱了，用户可以在块外面打字
    
    // // 截取文本
    // const snippet = text.length > 100 ? text.substring(0, 100) + "..." : text;
    // noteBlock.innerText = snippet;
    
    // // 3. 处理 contenteditable 的插入逻辑
    // // 如果容器是空的（显示placeholder），先清空内容
    // if (notesDiv.innerText.trim() === "") {
    //     notesDiv.innerHTML = "";
    // }
    
    // // 插入笔记块
    // notesDiv.appendChild(noteBlock);
    
    // // 4. 插入一个换行符，方便用户在引用后面打字
    // const spacer = document.createElement('div');
    // spacer.innerHTML = "<br>";
    // notesDiv.appendChild(spacer);

    // // 5. 滚动到底部
    // notesDiv.scrollTop = notesDiv.scrollHeight;
}

// 替换原有的resize监听（需先移除旧监听）
let resizeTimeout = null;
window.addEventListener('resize', () => {
    if (!isCanvasModeOpen) return;
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(drawConnections, 200);
});

/* --- 新增功能逻辑 --- */

// 1. 删除单个节点功能
function deleteNode(event, index) {
    // 1. 阻止事件冒泡 (防止误触其他功能)
    if (event) {
        event.stopPropagation();
    }
    
    // 2. 弹出确认框
   //const isConfirmed = confirm("🗑️ 确认删除\n\n您确定要移除这个对话节点吗？\n删除后，画布上的连线将自动重新连接。");
    const isConfirmed = confirm(translations[currentLang].confirmDeleteNode);

    // 3. 用户点击“确定”后执行
    if (isConfirmed) {
        // 获取导入历史的长度（防止为null报错，默认为0）
        const importedLen = (importedHistory && Array.isArray(importedHistory)) ? importedHistory.length : 0;

        // 【核心修复】判断 index 落在哪个数组里
        if (index < importedLen) {
            // 情况 A: 索引小于导入长度，说明点击的是【导入历史】里的节点
            // 直接从 importedHistory 数组中移除该元素
            importedHistory.splice(index, 1);
        } else {
            // 情况 B: 索引大于等于导入长度，说明点击的是【当前新对话】里的节点
            // 计算它在 conversationHistory 中的相对位置
            const relativeIndex = index - importedLen;
            
            // 安全检查并删除
            if (conversationHistory && conversationHistory[relativeIndex]) {
                conversationHistory.splice(relativeIndex, 1);
            }
        }

        // --- [核心修复] 删除后立即保存到持久化 ---
        saveCanvasSession(); 
        
        // 4. 重新渲染画布 (这时候数据源已经真的变少了)
        renderDialogueCanvas();
    }
}

/* --- 辅助函数：创建全屏封面页 (配合 Named Pages) --- */
function createCoverPage(imagePath, type) {
    const pageContainer = document.createElement('div');
    pageContainer.className = 'print-cover-page';
    
    // 基础样式：Flex布局
    pageContainer.style.display = 'flex';
    pageContainer.style.width = '100%';
    pageContainer.style.height = '100%'; 
    
    // 默认居中
    pageContainer.style.justifyContent = 'center';
    pageContainer.style.alignItems = 'center';

    const img = document.createElement('img');
    img.src = imagePath;
    img.style.width = '100%'; 
    img.style.objectFit = 'contain'; 
    pageContainer.appendChild(img);

    // --- 分页逻辑 ---
    if (type === 'back') {
        pageContainer.style.breakBefore = 'page';
    } else {
        pageContainer.style.breakAfter = 'page';
    }
    return pageContainer;
}

/* --- PDF导出最终版 --- */
/* --- PDF导出最终版 (彻底修复重名冲突与封面排版) --- */
function exportToPDF() {
    console.group("🚀 [PDF Export] Start");
    
    const source = document.getElementById('thoughtStreamContent');
    if (!source) {
        //alert("无可导出内容");
        alert(translations[currentLang].alertNoExportContent);
        return;
    }

    // --- 图片加载追踪器 ---
    const imagePromises = [];
    function trackImageLoad(img) {
        return new Promise((resolve) => {
            if (img.complete && img.naturalHeight !== 0) resolve();
            else { img.onload = resolve; img.onerror = resolve; }
        });
    }

    // 1. 清理旧层
    let oldOverlay = document.getElementById('print-overlay');
    if (oldOverlay) document.body.removeChild(oldOverlay);

    // 2. 创建新层
    const overlay = document.createElement('div');
    overlay.id = 'print-overlay';

    // --- 步骤 A: 注入 Named Page 样式 ---
    const style = document.createElement('style');
    style.innerHTML = `
        @page cover-layout { margin: 0 !important; size: auto; }
        @media print {
            html, body { height: auto !important; overflow: visible !important; margin: 0 !important; }
            #print-overlay { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; display: block !important; }
            #print-content-wrapper { page: auto; break-before: page; position: relative; width: 100%; display: block !important; }
        }
    `;
    overlay.appendChild(style);

    // ★ 根据当前语言选择封面图片（英文版使用 -En 后缀）
    const isEnglish = (window.currentLang === 'en');
    const cover1Src = isEnglish ? 'images/智源生医Cover1-EN.jpg' : 'images/智源生医Cover1.jpg';
    const cover2Src = isEnglish ? 'images/智源生医Cover2-EN.jpg' : 'images/智源生医Cover2.jpg';
    const cover3Src = isEnglish ? 'images/智源生医Cover3-EN.jpg' : 'images/智源生医Cover3.jpg';

    // --- 步骤 B: 第一页 商业级封面排版 ---
    const coverPage1 = document.createElement('div');
    // 强制内联样式，完美融合深空背景
    coverPage1.style.cssText = 'break-after: page; width: 100%; height: 260mm; display: flex; flex-direction: column; justify-content: center; background-color: #0b111e; margin-bottom: 20px;'; 

    const img1 = document.createElement('img');
    img1.src = cover1Src; 
    img1.style.cssText = 'width: 100%; height: 50%; object-fit: contain; object-position: bottom; margin: 0; padding: 0; display: block; margin-bottom: -1px;'; 
    imagePromises.push(trackImageLoad(img1));
    coverPage1.appendChild(img1);

    const img2 = document.createElement('img');
    img2.src = cover2Src; 
    img2.style.cssText = 'width: 100%; height: 50%; object-fit: contain; object-position: top; margin: 0; padding: 0; display: block; margin-top: -1px;'; 
    imagePromises.push(trackImageLoad(img2));
    coverPage1.appendChild(img2);
    
    overlay.appendChild(coverPage1);

    // --- 步骤 C: 处理对话内容, 重新构建对话内容（修复尖括号丢失）--- */
    const contentWrapper = document.createElement('div');
    contentWrapper.id = 'print-content-wrapper';
    
    const history = getMergedHistory(importedHistory, conversationHistory);
    
    history.forEach((item) => {
        const isUser = item.role === 'user';
        const node = document.createElement('div');
        node.className = `thought-node ${isUser ? 'question-node' : 'answer-node'}`;
    
        if (isUser) {
            // 用户节点：HTML 实体转义，防止 < > 被解析为标签
            node.innerHTML = `
                <div class="print-role-title user-role">🧑 User</div>
                <div class="node-content user-handwriting">${escapeHtml(item.text)}</div>
            `;
        } else {
            // AI 节点：使用已修复的 parseMarkdownWithMath，安全渲染 Markdown
            let processedText = '';
            if (typeof parseMarkdownWithMath === 'function') {
                processedText = parseMarkdownWithMath(item.text);
            } else {
                processedText = escapeHtml(item.text).replace(/\n/g, '<br>');
            }
    
            const info = item.leaderInfo || { name: 'Unknown', field: '', contribution: '' };

            node.innerHTML = `
                <div class="print-role-title ai-role">
                    <span style='font-family: "Font Awesome 6 Free"; font-weight: 900; margin-right: 5px;'>&#xf4ba;</span>Expert
                </div>
                <div class="leader-header">
                    <div class="leader-name">${escapeHtml(info.name)}</div>
                    <div class="leader-badges">
                        <span class="badge-field">${escapeHtml(info.field)}</span>
                    </div>
                </div>
                <div class="leader-contribution-hint" title="${escapeHtml(info.contribution || '')}">
                    <i class="fas fa-quote-left"></i> ${escapeHtml(info.contribution?.substring(0, 30) || '')}...
                </div>
                <div class="node-divider"></div>
                <div class="node-content star-content">${processedText}</div>
                <div class="star-decoration-bottom"><i class="fas fa-feather-alt"></i> SmartOrigin BioMed Insight</div>
            `;
        }
    
        contentWrapper.appendChild(node);
    });
    
    overlay.appendChild(contentWrapper);

    // --- 步骤 D: 最后一页 商业级封底排版 ---
    const backCoverWrapper = document.createElement('div');
    // 强制内联样式，深色背景延伸，居中显示
    backCoverWrapper.style.cssText = 'break-before: page; width: 100%; height: 260mm; display: flex; align-items: center; justify-content: center; background-color: #0f1524;'; 
    
    const img3 = document.createElement('img');
    img3.src = cover3Src;
    img3.style.cssText = 'width: 100%; max-height: 85%; object-fit: contain;'; 
    imagePromises.push(trackImageLoad(img3));
    backCoverWrapper.appendChild(img3);
    
    overlay.appendChild(backCoverWrapper);

    // 3. 挂载
    document.body.appendChild(overlay);

    // 4. 执行打印
    console.log(`⏳ 等待 ${imagePromises.length} 张图片资源...`);
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
    
    Promise.race([Promise.all(imagePromises), timeoutPromise]).then(() => {
        const originalTitle = document.title;
        
        // 文件名设定
        let finalName = "对话记录";
        if (typeof getExportFileName === 'function') {
            finalName = getExportFileName();
        } else {
            const d = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            finalName = `智源生医_${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
        }

        document.title = finalName;
        console.log("📄 文件名已设置为:", finalName);

        const mediaQueryList = window.matchMedia('print');
        
        // 备用清理机制
        const backupCleanup = setTimeout(() => {
            document.title = originalTitle;
            if (document.body.contains(overlay)) document.body.removeChild(overlay);
            if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', handlePrintChange);
            else mediaQueryList.removeListener(handlePrintChange);
            console.groupEnd();
        }, 10000); 
        
        const handlePrintChange = (event) => {
            if (!event.matches) {
                clearTimeout(backupCleanup);
                setTimeout(() => {
                    document.title = originalTitle;
                    if (document.body.contains(overlay)) document.body.removeChild(overlay);
                    overlay.innerHTML = "";
                    if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', handlePrintChange);
                    else mediaQueryList.removeListener(handlePrintChange);
                    console.groupEnd();
                }, 500); 
            }
        };
        
        if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', handlePrintChange);
        else mediaQueryList.addListener(handlePrintChange);
        
        setTimeout(() => {
            if (document.title !== finalName) document.title = finalName;
            window.print();
        }, 300);
    });
}

/* --- 新增：导出为 HTML 功能（修复连线 + 尖括号丢失）--- */
function exportToHTML() {
    const history = getMergedHistory(importedHistory, conversationHistory);
    
    if (!history || history.length === 0) {
        alert(translations[currentLang].alertCanvasEmpty || "画布为空，无法导出。");
        return;
    }

    let fileName = "对话记录";
    if (typeof getExportFileName === 'function') {
        fileName = getExportFileName();
    }

    // ═══════════════════════════════════════════════
    // 【步骤 1】构建节点 HTML（带 id，供布局计算使用）
    // ═══════════════════════════════════════════════
    let nodesHtml = '';
    
    history.forEach((item, index) => {
        const isUser = item.role === 'user';
        const nodeId = `node-${index}`;
        
        if (isUser) {
            nodesHtml += `
                <div class="thought-node question-node" id="${nodeId}">
                    <div class="user-avatar-mark"><i class="fas fa-user-astronaut"></i></div>
                    <div class="node-content user-handwriting">${escapeHtml(item.text)}</div>
                </div>
            `;
        } else {
            let processedText = '';
            if (typeof parseMarkdownWithMath === 'function') {
                processedText = parseMarkdownWithMath(item.text);
            } else {
                processedText = escapeHtml(item.text).replace(/\n/g, '<br>');
            }

            const info = item.leaderInfo || { name: 'Unknown', field: '', contribution: '' };

            nodesHtml += `
                <div class="thought-node answer-node" id="${nodeId}">
                    <div class="star-decoration-top"><span style="font-family: 'Font Awesome 6 Free'; font-weight: 900;">&#xf4ba;</span></div>
                    <div class="leader-header">
                        <div class="leader-name">${escapeHtml(info.name)}</div>
                        <div class="leader-badges">
                            <span class="badge-field">${escapeHtml(info.field)}</span>
                        </div>
                    </div>
                    <div class="leader-contribution-hint" title="${escapeHtml(info.contribution || '')}">
                        <i class="fas fa-quote-left"></i> ${escapeHtml(info.contribution?.substring(0, 30) || '')}...
                    </div>
                    <div class="node-divider"></div>
                    <div class="node-content star-content">${processedText}</div>
                    <div class="star-decoration-bottom"><i class="fas fa-feather-alt"></i> SmartOrigin BioMed Insight</div>
                </div>
            `;
        }
    });

    // ═══════════════════════════════════════════════
    // 【步骤 2】预计算 SVG 连线路径（核心修复）
    // ═══════════════════════════════════════════════
    let svgPathsHtml = '';
    let streamWidth = 900;
    let streamHeight = 0;
    
    // 创建临时隐藏容器，用于精确计算节点布局
    const tempWrapper = document.createElement('div');
    tempWrapper.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 1200px;
        opacity: 0;
        pointer-events: none;
        z-index: -9999;
    `;
    
    // 注入与导出文件一致的容器结构（固定宽度 900px，确保坐标精确）
    tempWrapper.innerHTML = `
        <div class="thought-stream" id="temp-thought-stream" style="
            width: 900px;
            margin: 0 auto;
            padding: 80px 20px;
            display: flex;
            flex-direction: column;
            gap: 60px;
            position: relative;
        ">
            ${nodesHtml}
        </div>
    `;
    
    document.body.appendChild(tempWrapper);
    
    try {
        // 计算连线
        const stream = tempWrapper.querySelector('#temp-thought-stream');
        const nodes = stream.querySelectorAll('.thought-node');
        
        streamWidth = stream.offsetWidth;
        streamHeight = stream.scrollHeight;
        
        if (nodes.length >= 2) {
            const streamRect = stream.getBoundingClientRect();
            
            for (let i = 0; i < nodes.length - 1; i++) {
                const current = nodes[i];
                const next = nodes[i + 1];
                
                const currentRect = current.getBoundingClientRect();
                const nextRect = next.getBoundingClientRect();
                
                // 相对于 thought-stream 的坐标
                const startX = currentRect.left - streamRect.left + currentRect.width / 2;
                const startY = currentRect.top - streamRect.top + currentRect.height;
                const endX = nextRect.left - streamRect.left + nextRect.width / 2;
                const endY = nextRect.top - streamRect.top;
                
                // 只连接垂直方向上有间距的节点
                if (startY < endY) {
                    const controlY = (endY - startY) / 2;
                    svgPathsHtml += `<path d="M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${startX.toFixed(1)} ${(startY + controlY).toFixed(1)}, ${endX.toFixed(1)} ${(endY - controlY).toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}" class="trail-path"/>`;
                }
            }
        }
    } catch (e) {
        console.error('[exportToHTML] SVG path calculation failed:', e);
    } finally {
        document.body.removeChild(tempWrapper);
    }
    
    // ═══════════════════════════════════════════════
    // 【步骤 3】组装最终 HTML
    // ═══════════════════════════════════════════════
    const htmlContent = `<!DOCTYPE html>
<html lang="${window.currentLang || 'zh-CN'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(fileName)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Ma+Shan+Zheng&family=Noto+Serif+SC:wght@400;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Noto Serif SC', serif;
            overflow-x: auto;
            background: linear-gradient(to bottom, #02060a 0%, #0d1620 100%);
            min-height: 100vh;
            color: #ccc;
        }
        
        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image:
                radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.4), transparent),
                radial-gradient(2px 2px at 50% 50%, rgba(255,255,255,0.3), transparent),
                radial-gradient(1px 1px at 90% 90%, rgba(255,255,255,0.4), transparent);
            background-size: 500px 500px;
            opacity: 0.5;
            z-index: -1;
            pointer-events: none;
        }
        
        .thought-stream {
            width: 900px;
            margin: 0 auto;
            padding: 80px 20px 120px;
            display: flex;
            flex-direction: column;
            gap: 60px;
            position: relative;
        }
        
        /* ═══ SVG 连线层 ═══ */
        #thought-trails-svg {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: visible;
        }
        
        .trail-path {
            fill: none;
            stroke: rgba(197, 160, 89, 0.5);
            stroke-width: 2.5;
            stroke-dasharray: 8 4;
            animation: dashFlow 30s linear infinite;
        }
        
        @keyframes dashFlow {
            to { stroke-dashoffset: -1000; }
        }
        
        /* ═══ 节点样式 ═══ */
        .thought-node {
            position: relative;
            max-width: 80%;
            padding: 0;
            border-radius: 4px;
            margin-bottom: 20px;
            z-index: 1;
        }
        
        .thought-node.question-node {
            align-self: flex-start;
            background: rgba(255, 255, 255, 0.1);
            border-left: 4px solid #fff;
            padding: 20px 25px;
            color: #fff;
            border-radius: 0 10px 10px 0;
            backdrop-filter: blur(5px);
        }
        
        .user-avatar-mark {
            position: absolute;
            left: -20px;
            top: -15px;
            width: 40px;
            height: 40px;
            background: #fff;
            color: #0d1218;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }
        
        .user-handwriting {
            font-family: 'Ma Shan Zheng', cursive;
            font-size: 1.3rem;
            line-height: 1.6;
            letter-spacing: 1px;
        }
        
        .thought-node.answer-node {
            align-self: flex-end;
            background: #f4ecd8;
            color: #2c1e12;
            border-radius: 4px 4px 4px 50px;
            padding: 30px 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid rgba(139, 90, 43, 0.2);
            position: relative;
        }
        
        .thought-node.answer-node::after {
            content: '';
            position: absolute;
            bottom: 8px;
            right: 8px;
            width: 40px;
            height: 40px;
            z-index: -1;
            box-shadow: 8px 8px 15px rgba(0, 0, 0, 0.4);
            transform: skew(15deg) rotate(5deg);
            border-radius: 50%;
        }
        
        .leader-name {
            font-family: 'Cinzel', serif;
            font-weight: 700;
            font-size: 1.4rem;
            color: #3e2723;
            text-align: center;
        }
        
        .badge-field {
            background: #3e2723;
            color: #d7ccc8;
            padding: 2px 8px;
            border-radius: 2px;
            font-size: 0.75rem;
            display: inline-block;
        }
        
        .leader-header {
            text-align: center;
            margin-bottom: 10px;
        }
        
        .leader-contribution-hint {
            font-size: 0.9rem;
            color: #6d4c41;
            font-style: italic;
            text-align: center;
            margin-bottom: 15px;
        }
        
        .node-divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #8b5a2b, transparent);
            margin: 15px 0;
            opacity: 0.4;
        }
        
        .star-content {
            font-size: 1rem;
            line-height: 1.8;
            color: #1a1a1a;
            text-align: justify;
        }
        
        .star-content p { margin-bottom: 1em; }
        .star-content h1, .star-content h2, .star-content h3 {
            color: #3e2723;
            margin: 1.2em 0 0.6em;
        }
        .star-content blockquote {
            margin: 1em 0;
            padding: 10px 16px;
            border-left: 3px solid #8b5a2b;
            background: rgba(139, 90, 43, 0.05);
            font-style: italic;
        }
        .star-content code {
            background: rgba(0,0,0,0.08);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 0.9em;
        }
        .star-content pre {
            background: rgba(0,0,0,0.05);
            padding: 12px;
            border-radius: 6px;
            overflow-x: auto;
        }
        .star-content ul, .star-content ol {
            margin: 0.8em 0;
            padding-left: 1.8em;
        }
        .star-content a {
            color: #8b5a2b;
            text-decoration: none;
            border-bottom: 1px solid rgba(139, 90, 43, 0.3);
        }
        
        .star-decoration-top {
            text-align: center;
            color: #8b5a2b;
            margin-bottom: 10px;
        }
        
        .star-decoration-bottom {
            margin-top: 20px;
            text-align: right;
            font-size: 0.8rem;
            color: #8b5a2b;
            font-family: 'Cinzel', serif;
            opacity: 0.6;
        }
        
        footer {
            text-align: center;
            padding: 50px;
            color: #555;
            font-size: 0.8rem;
            font-family: sans-serif;
        }
        
        @media print {
            body { background: #fff; color: #000; }
            .thought-node { box-shadow: none; border: 1px solid #ddd; }
            .trail-path { stroke: #999; animation: none; }
        }
    </style>
</head>
<body>
    <div class="thought-stream">
        <!-- SVG 连线层：预计算路径，纯静态渲染 -->
        <svg id="thought-trails-svg" width="${streamWidth}" height="${streamHeight}">
            ${svgPathsHtml}
        </svg>
        
        ${nodesHtml}
    </div>
    
    <footer>
        Exported from SmartOrgin BioMed • ${new Date().toLocaleString()}
    </footer>
</body>
</html>`;

    // ═══════════════════════════════════════════════
    // 【步骤 4】触发下载
    // ═══════════════════════════════════════════════
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════
   画布节点上下文按钮处理器
   ═══════════════════════════════════════════════ */
function handleCtxCanvasBtn(event, historyIndex) {
    event.stopPropagation();
    
    // 确保上下文管理器已初始化
    if (!window.starContext) {
        alert('星语上下文系统尚未初始化');
        return;
    }
    
    const history = getMergedHistory(importedHistory, conversationHistory);
    const data = history[historyIndex];
    if (!data || !data.id) return;
    
    const res = window.starContext.addFromDialogue(data);
    if (res.success) {
        const isIn = res.action === 'added';
        const btn = event.currentTarget;
        btn.classList.toggle('in-context', isIn);
        btn.innerHTML = `<i class="fas ${isIn ? 'fa-minus' : 'fa-plus'}"></i>`;
        btn.title = isIn ? '从星语上下文移除' : '加入星语上下文';
        
        // 刷新侧滑面板列表（如果打开）
        if (window.ContextUI && window.ContextUI._renderList) {
            window.ContextUI._renderList();
        }
        
        // Toast 提示
        const msg = isIn ? '已加入星语上下文' : '已从上下文移除';
        const t = document.createElement('div');
        t.className = 'ctx-toast show';
        t.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
        t.style.cssText = 'position:fixed; bottom:50px; left:50%; transform:translateX(-50%); background:rgba(0,223,216,.12); border:1px solid rgba(0,223,216,.3); color:#00dfd8; padding:13px 28px; border-radius:50px; font-size:14px; font-family:\"Noto Serif SC\",serif; backdrop-filter:blur(12px); z-index:999999; opacity:1; pointer-events:none; white-space:nowrap; letter-spacing:1px; box-shadow:0 8px 32px rgba(0,0,0,.3);';
        document.body.appendChild(t);
        setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; setTimeout(()=>t.remove(), 350); }, 2200);
    } else {
        alert(res.message);
    }
}

/* ═══════════════════════════════════════════════
   对话画布 Session 持久化（仅 conversationHistory）
   ═══════════════════════════════════════════════ */
function saveCanvasSession() {
    try {
        // 保存当前对话
        if (conversationHistory && conversationHistory.length > 0) {
            sessionStorage.setItem('northstar_canvas_history', JSON.stringify(conversationHistory));
        } else {
            sessionStorage.removeItem('northstar_canvas_history');
        }

        // --- [新增] 保存导入的历史 ---
        if (importedHistory && importedHistory.length > 0) {
            sessionStorage.setItem('northstar_imported_history', JSON.stringify(importedHistory));
        } else {
            sessionStorage.removeItem('northstar_imported_history');
        }
    } catch (e) {
        // 静默失败
    }
}

// 补充：清空函数也要同步
function clearCanvasSession() {
    sessionStorage.removeItem('northstar_canvas_history');
}
