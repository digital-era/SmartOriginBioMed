// ═══════════════════════════════════════════════════════════════
// 星空专栏 - 前端持久化模块
// 双保险: Cloudflare KV (主) + localStorage (备)
// ═══════════════════════════════════════════════════════════════

const PERSISTENCE = {
    API_BASE: '/api/starry-column',     // 同域 API
    STORAGE_KEY: 'angelColumnCards',    // localStorage key
    SCHEMA_VERSION: 2,
    SAVE_DEBOUNCE_MS: 800,               // 防抖间隔
    MAX_RETRIES: 3,                      // 网络失败重试
    RETRY_DELAY_MS: 1000
};

// 内存状态
let _pendingSaveTimer = null;
let _lastPersistedHash = null;
let _isLoading = false;

// ═══════════════════════════════════════════════════════════════
// 初始化
// ═══════════════════════════════════════════════════════════════

/**
 * 初始化星空专栏持久化
 * 1. 先加载内置卡片
 * 2. 尝试从 KV 加载自定义卡片
 * 3. KV 失败则回退 localStorage
 */
async function initAngelColumn() {
    if (_isLoading) return;
    _isLoading = true;

    console.log('[StarryColumn] Initializing... (localStorage only)');

    // ═══════════════════════════════════════════════════
    // 【已注释】Cloudflare KV 加载过慢，暂时禁用
    // ═══════════════════════════════════════════════════
    // try {
    //     const response = await fetchWithRetry(PERSISTENCE.API_BASE, {
    //         method: 'GET'
    //     });
    //     if (response.ok) {
    //         const serverData = await response.json();
    //         await _mergeServerData(serverData);
    //         console.log('[StarryColumn] Loaded from KV:', serverData.cards?.length || 0, 'cards');
    //     } else {
    //         throw new Error(`HTTP ${response.status}`);
    //     }
    // } catch (e) {
    //     console.warn('[StarryColumn] KV load failed, fallback to localStorage:', e.message);
    //     _loadFromLocalStorage();
    // }

    // 直接从 localStorage 加载
    _loadFromLocalStorage();

    _updateHashCache();
    _isLoading = false;

    console.log('[StarryColumn] Initialized. Total cards:', angelColumnCards.length);
}

// ═══════════════════════════════════════════════════════════════
// 持久化入口
// ═══════════════════════════════════════════════════════════════

/**
 * 触发持久化（防抖）
 * 自动检测数据变更，无变化则跳过
 */
function persistangelColumnCards() {
    const cardsToPersist = checkAdminPermission()
        ? angelColumnCards.filter(c => c.configurable)
        : angelColumnCards.filter(c => c.builtIn === false);
    
    const payload = {
        _schema: PERSISTENCE.SCHEMA_VERSION,
        cards: cardsToPersist  // ← 修复：cardsToPersist
    };

    const json = JSON.stringify(payload);
    const currentHash = _simpleHash(json);

    if (currentHash === _lastPersistedHash) {
        console.log('[StarryColumn] No changes, skip persist');
        return { skipped: true };
    }

    clearTimeout(_pendingSaveTimer);

    _pendingSaveTimer = setTimeout(() => {
        _executePersist(json, currentHash, payload);
    }, PERSISTENCE.SAVE_DEBOUNCE_MS);

    return { queued: true };
}

/**
 * 立即执行持久化（内部）
 */
async function _executePersist(json, hash, payload) {
    console.log('[StarryColumn] Persisting', payload.cards.length, 'cards...');

    // 1. 始终写 localStorage（所有登录用户，同步）
    let localSuccess = false;
    try {
        localStorage.setItem(PERSISTENCE.STORAGE_KEY, json);
        localSuccess = true;
    } catch (e) {
        console.error('[StarryColumn] localStorage write failed:', e);
    }

    // 2. 仅 Admin 写 KV（跨设备同步）
    if (checkAdminPermission()) {
        try {
            const response = await fetchWithRetry(PERSISTENCE.API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: json
            });

            if (response.ok) {
                _lastPersistedHash = hash;
                console.log('[StarryColumn] KV + localStorage saved');
                return { success: true, target: 'kv+localStorage' };
            }

            throw new Error(`HTTP ${response.status}`);

        } catch (e) {
            console.warn('[StarryColumn] KV save failed:', e.message);
            // KV 失败，但 localStorage 成功也算保存成功
            if (localSuccess) {
                _lastPersistedHash = hash;
                return {
                    success: true,
                    target: 'localStorage',
                    warning: 'KV unavailable, data saved to localStorage only'
                };
            }
            return { success: false, error: 'All persistence failed' };
        }

    } else {
        // 普通用户：仅 localStorage
        if (localSuccess) {
            _lastPersistedHash = hash;
            console.log('[StarryColumn] Saved to localStorage only (non-admin)');
            return { success: true, target: 'localStorage' };
        }
        return { success: false, error: 'localStorage write failed' };
    }
}

/**
 * 强制立即保存（用于页面卸载前）
 */
async function _mergeServerData(serverData) {
    if (!serverData || !Array.isArray(serverData.cards)) {
        console.log('[Merge] No cards in serverData');
        return;
    }

    console.log('[Merge] Starting merge, server cards:', serverData.cards.length);

    for (const savedCard of serverData.cards) {
        /*
        console.log('[Merge] Processing card:', savedCard.id);
        console.log('[Merge] Raw experts:', savedCard.experts, 
                    'type:', typeof savedCard.experts,
                    'isArray:', Array.isArray(savedCard.experts),
                    'length:', savedCard.experts?.length);
        */
        if (!_isValidCard(savedCard)) {
            console.warn('[Merge] Invalid card skipped:', savedCard.id);
            continue;
        }

        const existing = angelColumnCards.find(c => c.id === savedCard.id);
        /*
        console.log('[Merge] Found existing:', !!existing, 
                    'configurable:', existing?.configurable,
                    'builtIn:', existing?.builtIn);*/

        if (existing && existing.configurable) {
            /*console.log('[Merge] Updating existing card');*/
            
            // 先记录旧值
            const oldExperts = existing.experts;
            
            Object.assign(existing, {
                name: savedCard.name || existing.name,
                contribution: savedCard.contribution || existing.contribution,
                field: savedCard.field || existing.field,
                remarks: savedCard.remarks || existing.remarks,
                experts: savedCard.experts || [],
                fusionStrategy: savedCard.fusionStrategy || { mode: 'synthesis' }
            });
            
            /*console.log('[Merge] After update, experts:', existing.experts,
                        'was:', oldExperts);*/

        } else if (!existing) {
            console.log('[Merge] Adding new card');
            angelColumnCards.push(savedCard);
            
        } else {
            console.log('[Merge] Skipped builtIn card:', existing.id);
        }
    }

    console.log('[Merge] Complete. Total cards:', angelColumnCards.length);

    // 缓存到 localStorage
    try {
        localStorage.setItem(PERSISTENCE.STORAGE_KEY, JSON.stringify(serverData));
    } catch (e) {
        console.error('[Merge] Cache failed:', e);
    }
}

/**
 * 强制立即保存（用于页面卸载前）
 */
function _flushPendingSave() {
    clearTimeout(_pendingSaveTimer);

    const customCards = angelColumnCards.filter(c => c.builtIn === false);
    const payload = {
        _schema: PERSISTENCE.SCHEMA_VERSION,
        _savedAt: Date.now(),
        cards: customCards
    };
    const json = JSON.stringify(payload);

    // 同步写 localStorage（所有用户）
    try {
        localStorage.setItem(PERSISTENCE.STORAGE_KEY, json);
    } catch (e) {
        console.error('[StarryColumn] Flush to localStorage failed:', e);
    }

    // 仅 Admin：尝试同步发送 beacon（KV）
    if (checkAdminPermission() && navigator.sendBeacon) {
        navigator.sendBeacon(
            PERSISTENCE.API_BASE,
            new Blob([json], { type: 'application/json' })
        );
    }
}


// ═══════════════════════════════════════════════════════════════
// 数据加载与合并
// ═══════════════════════════════════════════════════════════════

/**
 * 从 localStorage 加载（回退方案）
 */
function _loadFromLocalStorage() {
    const raw = localStorage.getItem(PERSISTENCE.STORAGE_KEY);
    if (!raw) {
        console.log('[StarryColumn] No localStorage data');
        return;
    }

    try {
        const data = JSON.parse(raw);
        const cards = data.cards || [];

        for (const savedCard of cards) {
            if (!_isValidCard(savedCard)) continue;

            const existing = angelColumnCards.find(c => c.id === savedCard.id);
            if (existing && existing.configurable) {
                Object.assign(existing, {
                    name: savedCard.name || existing.name,
                    contribution: savedCard.contribution || existing.contribution,
                    field: savedCard.field || existing.field,
                    remarks: savedCard.remarks || existing.remarks,
                    experts: savedCard.experts || [],
                    fusionStrategy: savedCard.fusionStrategy || { mode: 'synthesis' }
                });
            } else if (!existing) {
                angelColumnCards.push(savedCard);
            }
        }

        console.log('[StarryColumn] Loaded from localStorage:', cards.length, 'cards');

    } catch (e) {
        console.error('[StarryColumn] localStorage parse failed:', e);
    }
}

// ═══════════════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════════════

/**
 * 带重试的 fetch
 */
async function fetchWithRetry(url, options, retries = PERSISTENCE.MAX_RETRIES) {
    try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response;
    } catch (e) {
        if (retries > 0) {
            console.log(`[StarryColumn] Retry ${PERSISTENCE.MAX_RETRIES - retries + 1}/${PERSISTENCE.MAX_RETRIES}`);
            await _sleep(PERSISTENCE.RETRY_DELAY_MS);
            return fetchWithRetry(url, options, retries - 1);
        }
        throw e;
    }
}

/**
 * 卡片基础校验
 */
function _isValidCard(card) {
    if (!card || typeof card !== 'object') return false;
    if (!card.id || typeof card.id !== 'string') return false;
    if (!card.name || typeof card.name !== 'object') return false;
    if (!card.type || typeof card.type !== 'string') return false;
    return true;
}

/**
 * 简单哈希
 */
function _simpleHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return h.toString(16);
}

/**
 * 更新哈希缓存
 */
function _updateHashCache() {
    const customCards = angelColumnCards.filter(c => c.configurable);
    const payload = { _schema: PERSISTENCE.SCHEMA_VERSION, cards: customCards };
    _lastPersistedHash = _simpleHash(JSON.stringify(payload));
}

/**
 * 延迟
 */
function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadSystemColumn(card) {
    const lang = window.currentLang || 'zh-CN';

    if (!card) {
        console.error('[StarryColumn] No card provided');
        return;
    }

    // ═══ 防御：确保全局变量是数组 ═══
    if (!Array.isArray(importedHistory)) importedHistory = [];
    if (!Array.isArray(conversationHistory)) conversationHistory = [];

    const fileName = getFieldValue(card.name, 'zh-CN') + '.md';
    const filePath = `/StarryColumn/${fileName}`;
    
    // ═══ 画布非空检查 ═══
    let canvasHistory;
    try {
        canvasHistory = getMergedHistory(importedHistory, conversationHistory);
    } catch (e) {
        console.error('[StarryColumn] getMergedHistory failed:', e);
        canvasHistory = [];
    }
    // 最终防御
    if (!Array.isArray(canvasHistory)) canvasHistory = [];    

    if (canvasHistory.length > 0) {
        const isOnlySystemColumn = (
            importedHistory.length > 0 &&
            importedHistory._source === 'systemColumn' &&
            conversationHistory.length === 0
        );

        if (isOnlySystemColumn) {
            importedHistory = [];
            conversationHistory = [];
            if (typeof saveCanvasSession === 'function') saveCanvasSession();
        } else {
            const title = getFieldValue(starryColumnTexts.canvasNotEmptyTitle, lang);
            const message = getFieldValue(starryColumnTexts.canvasNotEmptyMessage, lang);
            alert(`${title}\n\n${message}`);
            return;
        }
    }

    // ═══ 关键：先关闭画布，确保错误时不显示乱七八糟内容 ═══
    const canvasModal = document.getElementById('dialogueCanvasModal');
    if (canvasModal) {
        canvasModal.style.display = 'none';
        canvasModal.style.opacity = '0';
    }

    try {
        const response = await fetch(filePath);
        
        // ═══ 关键：检查 HTTP 状态 ═══
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('FILE_NOT_FOUND');
            }
            throw new Error(`HTTP ${response.status}`);
        }

        const mdContent = await response.text();

        // 空内容检查
        if (!mdContent || mdContent.trim().length === 0) {
            throw new Error('EMPTY_FILE');
        }

        // 解析检查
        const parsed = parseMDToHistory(mdContent);
        if (parsed.length === 0) {
            throw new Error('PARSE_EMPTY');
        }

        // ═══ 成功后才写入并打开画布 ═══
        importedHistory = parsed;
        importedHistory._source = 'systemColumn';
        importedHistory._sourceCardId = card.id;
        importedHistory._loadedAt = Date.now();

        if (typeof saveCanvasSession === 'function') {
            saveCanvasSession();
        }

        // 打开画布
        openDialogueCanvas();
        renderDialogueCanvas();

        showToast(
            getFieldValue(starryColumnTexts.systemColumnLoaded, lang),
            'success'
        );

    } catch (e) {
        console.error('[StarryColumn] Failed to load system column:', e);

        // ═══ 确保画布已关闭 ═══
        if (canvasModal) {
            canvasModal.style.display = 'none';
            canvasModal.style.opacity = '0';
        }

        // 清理可能残留的 importedHistory
        importedHistory = [];

        let errorMsg;
        if (e.message === 'FILE_NOT_FOUND') {
            errorMsg = lang === 'zh-CN' 
                ? `系统专栏文件不存在：${fileName}` 
                : `System column file not found: ${fileName}`;
        } else if (e.message === 'EMPTY_FILE') {
            errorMsg = lang === 'zh-CN' 
                ? '系统专栏文件内容为空' 
                : 'System column file is empty';
        } else if (e.message === 'PARSE_EMPTY') {
            errorMsg = lang === 'zh-CN' 
                ? '无法解析专栏内容' 
                : 'Unable to parse column content';
        } else {
            errorMsg = getFieldValue(starryColumnTexts.systemColumnLoadFailed, lang) + e.message;
        }

        showToast(errorMsg, 'error');
    }
}

// ═══════════════════════════════════════════════════════════════
// 数据导出 / 导入 JSON 文件
// ═══════════════════════════════════════════════════════════════

/**
 * 导出星空专栏配置为 JSON 文件下载
 */
function exportStarryColumnData() {
    let exportCards;

    if (checkAdminPermission()) {
        // Admin：导出内存中所有自定义卡片（含 KV 同步的数据）
        exportCards = angelColumnCards.filter(c => c.configurable);
    } else {
        // 普通用户：仅从 localStorage 导出（本设备数据）
        const raw = localStorage.getItem(PERSISTENCE.STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                exportCards = data.cards || [];
            } catch (e) {
                console.error('Parse localStorage failed:', e);
                exportCards = [];
            }
        } else {
            exportCards = [];
        }
    }

    const exportData = {
        _schema: PERSISTENCE.SCHEMA_VERSION,
        _exportedAt: Date.now(),
        _exportedBy: checkAdminPermission() ? 'admin' : 'user',
        cards: exportCards
    };

    const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

    const a = document.createElement('a');
    a.href = url;
    a.download = `angel-column-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);

    console.log('[StarryColumn] Exported', exportCards.length, 'cards');
    return { success: true, count: exportCards.length };
}

/**
 * 从 JSON 文件导入配置
 */
async function importStarryColumnData(file) {
    if (!file || file.type !== 'application/json') {
        return { success: false, error: 'Please select a JSON file' };
    }

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // 校验结构
                if (!data.cards || !Array.isArray(data.cards)) {
                    resolve({ success: false, error: 'Invalid file format: missing cards array' });
                    return;
                }

                // 版本检查
                const fileSchema = data._schema || 1;
                if (fileSchema > PERSISTENCE.SCHEMA_VERSION) {
                    resolve({ success: false, error: `File schema v${fileSchema} is newer than supported v${PERSISTENCE.SCHEMA_VERSION}` });
                    return;
                }

                // 校验每张卡片
                const validCards = [];
                const errors = [];

                for (const card of data.cards) {
                    if (_isValidCard(card)) {
                        validCards.push(card);
                    } else {
                        errors.push(`Invalid card: ${card.id || 'unknown'}`);
                    }
                }

                if (validCards.length === 0) {
                    resolve({ success: false, error: 'No valid cards found in file' });
                    return;
                }

                // 合并到内存（只替换/新增自定义卡片，不碰内置）
                let added = 0, updated = 0;

                for (const card of validCards) {
                    const existing = angelColumnCards.find(c => c.id === card.id);

                    if (existing && existing.configurable) {
                        Object.assign(existing, card);
                        updated++;
                    } else if (!existing) {
                        angelColumnCards.push(card);
                        added++;
                    }
                    // builtIn 卡片跳过
                }

                // 1. 所有用户：写入 localStorage
                persistToLocalStorageOnly();

                // 2. Admin 额外：同步到 KV
                if (checkAdminPermission()) {
                    persistToKV();
                }

                resolve({
                    success: true,
                    imported: validCards.length,
                    added: added,
                    updated: updated,
                    errors: errors.length > 0 ? errors : undefined
                });

            } catch (parseError) {
                resolve({ success: false, error: 'Failed to parse JSON: ' + parseError.message });
            }
        };

        reader.onerror = () => {
            resolve({ success: false, error: 'Failed to read file' });
        };

        reader.readAsText(file);
    });
}

/**
 * 仅写入 localStorage（普通用户导入/保存用）
 */
function persistToLocalStorageOnly() {
    const customCards = angelColumnCards.filter(c => c.builtIn === false);
    const payload = {
        _schema: PERSISTENCE.SCHEMA_VERSION,
        _savedAt: Date.now(),
        cards: customCards
    };

    try {
        localStorage.setItem(PERSISTENCE.STORAGE_KEY, JSON.stringify(payload));
        _updateHashCache();
        console.log('[StarryColumn] Saved to localStorage:', customCards.length, 'cards');
        return true;
    } catch (e) {
        console.error('[StarryColumn] localStorage write failed:', e);
        return false;
    }
}

/**
 * 同步到 KV（admin 专用）
 */
async function persistToKV() {
    const customCards = angelColumnCards.filter(c => c.builtIn === false);
    const payload = {
        _schema: PERSISTENCE.SCHEMA_VERSION,
        cards: customCards
    };
    const json = JSON.stringify(payload);

    try {
        const response = await fetchWithRetry(PERSISTENCE.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: json
        });

        if (response.ok) {
            _lastPersistedHash = _simpleHash(json);
            console.log('[StarryColumn] Saved to KV:', customCards.length, 'cards');
            return true;
        }
    } catch (e) {
        console.warn('[StarryColumn] KV save failed:', e.message);
    }

    return false;
}

/**
 * 创建导出/导入 UI（管理员专用）
 */
function renderImportExportButtons(container) {
    if (!container) return;
    
    const lang = window.currentLang || 'zh-CN';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'import-export-bar';
    wrapper.innerHTML = `
        <button class="btn-export" id="btn-export-data">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ${lang === 'zh-CN' ? '导出配置' : 'Export Config'}
        </button>
        <label class="btn-import" for="import-file-input">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            ${lang === 'zh-CN' ? '导入配置' : 'Import Config'}
        </label>
        <input type="file" id="import-file-input" accept=".json,application/json" style="display:none">
    `;
    
    container.appendChild(wrapper);
    
    // 绑定事件
    document.getElementById('btn-export-data')?.addEventListener('click', () => {
        const result = exportStarryColumnData();
        if (result.success) {
            alert(lang === 'zh-CN' 
                ? `已导出 ${result.count} 张卡片配置` 
                : `Exported ${result.count} cards`);
        }
    });
    
    document.getElementById('import-file-input')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const confirmed = confirm(lang === 'zh-CN' 
            ? '导入将覆盖现有自定义卡片配置，确定继续？' 
            : 'Import will overwrite existing custom cards. Continue?');
        
        if (!confirmed) {
            e.target.value = ''; // 重置
            return;
        }
        
        const result = await importStarryColumnData(file);
        
        if (result.success) {
            alert(lang === 'zh-CN' 
                ? `导入成功：新增 ${result.added} 张，更新 ${result.updated} 张` 
                : `Import success: ${result.added} added, ${result.updated} updated`);
            // 刷新列表
            const isAdmin = checkAdminPermission();
            renderStarryCardsList(isAdmin);
        } else {
            alert(lang === 'zh-CN' 
                ? `导入失败：${result.error}` 
                : `Import failed: ${result.error}`);
        }
        
        e.target.value = ''; // 重置，允许重复导入同一文件
    });
}
