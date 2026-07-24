// ══════════════════════════════════════════════════════════════
// 星空专栏 - 专栏空间 (Column Space) - 完整修复版
// 修复：
//   1. 支持 YYYYMMDD (8位) 日期格式
//   2. 优先使用 index.json 的 byColumn 字段
//   3. 日期验证支持 6位和8位
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════
// Space Model
// ═══════════════════════════════════════
// 1. 扩展空间类型枚举
const SpaceType = {
    SYSTEM: 'system',
    COLUMN: 'column',
    GITHUB: 'github',
    LOCAL: 'local',
    WEBDAV: 'webdav'  // 【新增】WebDAV 支持
};

// 更新 source 构造函数
function createSpaceSource(type, options = {}) {
    return {
        type,
        basePath: options.basePath || '',
        repo: options.repo || '',
        branch: options.branch || 'main',
        token: options.token || '',
        localPath: options.localPath || '',
        // 【新增】
        webdavUrl: options.webdavUrl || '',
        username: options.username || '',
        password: options.password || ''
    };
}

const iSpaceTexts = {
    settingsTitle: { 'zh-CN': 'iSpace 专栏配置', 'en': 'iSpace Configuration' },
    typeSelect: { 'zh-CN': '存储类型', 'en': 'Storage Type' },
    typeLocal: { 'zh-CN': '本地目录 (Local)', 'en': 'Local Directory' },
    typeGithub: { 'zh-CN': 'Github 私库', 'en': 'Github Private Repo' },
    typeWebDAV: { 'zh-CN': 'WebDAV 云盘', 'en': 'WebDAV Drive' },
    
    // 表单字段
    localPath: { 'zh-CN': '本地绝对路径', 'en': 'Local Absolute Path' },
    localPathPlaceholder: { 'zh-CN': '例如: D:/NorthStar/iSpace', 'en': 'e.g. D:/NorthStar/iSpace' },
    
    repo: { 'zh-CN': '仓库地址', 'en': 'Repository' },
    repoPlaceholder: { 'zh-CN': '例如: username/private-repo', 'en': 'e.g. username/private-repo' },
    branch: { 'zh-CN': '分支', 'en': 'Branch' },
    token: { 'zh-CN': '访问令牌 (Token)', 'en': 'Access Token' },
    tokenPlaceholder: { 'zh-CN': 'ghp_xxxxxxxxxxxx', 'en': 'ghp_xxxxxxxxxxxx' },
    
    webdavUrl: { 'zh-CN': 'WebDAV 基础链接', 'en': 'WebDAV URL' },
    webdavUrlPlaceholder: { 'zh-CN': '例如: https://nas.com:5006/webdav/', 'en': 'e.g. https://nas.com:5006/webdav/' },
    username: { 'zh-CN': '用户名', 'en': 'Username' },
    password: { 'zh-CN': '密码', 'en': 'Password' },
    
    // 按钮
    saveBtn: { 'zh-CN': '保存配置', 'en': 'Save Configuration' },
    cancelBtn: { 'zh-CN': '取消', 'en': 'Cancel' },
    saveSuccess: { 'zh-CN': '配置已保存', 'en': 'Configuration Saved' }
};

// ═══════════════════════════════════════════════════════════════
// 本地文件错误提示文本表（全球化）
// ═══════════════════════════════════════════════════════════════
const localFileErrorTexts = {
    apiNotReady: {
        'zh-CN': '本地文件系统 API 未就绪，请检查应用环境',
        'en': 'Local file system API is not ready, please check the application environment'
    },
    invalidFormat: {
        'zh-CN': '本地目录读取返回格式异常',
        'en': 'Local directory read returned abnormal format'
    },
    userCancelled: {
        'zh-CN': '用户取消了目录选择',
        'en': 'User cancelled directory selection'
    },
    browserNotSupported: {
        'zh-CN': '浏览器不支持文件系统访问，请使用 Electron 版本或配置其他存储类型',
        'en': 'Browser does not support file system access, please use Electron version or configure another storage type'
    },
    permissionDenied: {
        'zh-CN': '目录访问权限被拒绝，请重新授权',
        'en': 'Directory access permission denied, please re-authorize'
    },
    noHtmlFiles: {
        'zh-CN': '所选目录中未找到 .html 文件',
        'en': 'No .html files found in selected directory'
    },
    fileNotFound: {
        'zh-CN': '文件未找到',
        'en': 'File not found'
    }
};

function getISpaceText(key, lang) {
    return iSpaceTexts[key]?.[lang] || iSpaceTexts[key]?.['zh-CN'] || key;
}

const columnSpaceTexts = {
    spaceLoading: { 'zh-CN': '时空折叠中，请稍候...', 'en': 'Folding spacetime, please wait...' },
    spaceTitle: { 'zh-CN': '专栏空间', 'en': 'Column Space' },
    latestColumn: { 'zh-CN': '专栏精选', 'en': 'Column Picks' },
    directory: { 'zh-CN': '目录', 'en': 'Directory' },
    backToList: { 'zh-CN': '返回列表', 'en': 'Back to List' },
    backToDirectory: { 'zh-CN': '返回目录', 'en': 'Back to Directory' },
    prevPage: { 'zh-CN': '上一页', 'en': 'Previous' },
    nextPage: { 'zh-CN': '下一页', 'en': 'Next' },
    viewImage: { 'zh-CN': '图像', 'en': 'Image' },
    pageIndicator: { 'zh-CN': '第 {current} / {total} 页', 'en': 'Page {current} / {total}' },
    emptyDirectory: { 'zh-CN': '暂无专栏文章', 'en': 'No column articles yet' },
    loadError: { 'zh-CN': '加载失败，请稍后重试', 'en': 'Failed to load, please try again later' },
    parseError: { 'zh-CN': '内容解析异常', 'en': 'Content parsing error' },
    close: { 'zh-CN': '关闭', 'en': 'Close' },
    fileNotFound: { 'zh-CN': '未找到专栏文件', 'en': 'Column files not found' }
};

function getColumnSpaceText(key, lang) {
    return columnSpaceTexts[key]?.[lang] || columnSpaceTexts[key]?.['zh-CN'] || key;
}


window._imageZoomScale = 1;   // 当前缩放比例
window._imagePanX = 0;        // 水平偏移
window._imagePanY = 0;        // 垂直偏移
window._isImageDragging = false;  // 是否正在拖拽（防止触发 click）

// ═══════════════════════════════════════════════════════════════
// 文件列表获取 - 修复版
// ═══════════════════════════════════════════════════════════════

async function fetchColumnSpaceFiles(fileName) {
    const basePath = '/StarryColumn/';

    try {
        const indexResponse = await fetch(`${basePath}index.json?t=${Date.now()}`, {
            method: 'GET',
            cache: 'no-cache'
        });

        if (indexResponse.ok) {
            const indexData = await indexResponse.json();

            if (indexData.byColumn && indexData.byColumn[fileName]) {
                // 统一交给 filterAndSortFiles 处理：过滤无日期文件、重新标记 latest
                const fileNames = (indexData.byColumn[fileName].files || []).map(f => f.name);
                const filtered = filterAndSortFiles(fileNames, fileName);
                return filtered.map(f => ({
                    ...f,
                    path: `${basePath}${f.name}`
                }));
            }

            return filterAndSortFiles(indexData.files || [], fileName);
        }
    } catch (e) {
        console.log('[ColumnSpace] index.json not available, using probe mode');
    }

    return await probeColumnFiles(fileName, basePath);
}

// ═══════════════════════════════════════════════════════════════
// 【修复2】filterAndSortFiles - 支持 6位和8位日期
// ═══════════════════════════════════════════════════════════════

function filterAndSortFiles(files, fileName) {
    const validFiles = [];
    const dateRegex6 = new RegExp(`^${escapeRegex(fileName)}-(\\d{6})\\.html$`);
    const dateRegex8 = new RegExp(`^${escapeRegex(fileName)}-(\\d{8})\\.html$`);

    for (const file of files) {
        const name = typeof file === 'string' ? file : file.name;

        // 8位日期：朝花夕拾-20260621.html
        const match8 = name.match(dateRegex8);
        if (match8 && validateDate(match8[1], 8)) {
            validFiles.push({
                name: name,
                path: `/StarryColumn/${name}`,
                rawDate: match8[1],      // 原始日期，如 20260621
                sortKey: match8[1]        // 8位可直接排序
            });
            continue;
        }

        // 6位日期：朝花夕拾-260621.html → 统一转为 20260621 排序
        const match6 = name.match(dateRegex6);
        if (match6 && validateDate(match6[1], 6)) {
            validFiles.push({
                name: name,
                path: `/StarryColumn/${name}`,
                rawDate: match6[1],      // 原始日期，如 260621
                sortKey: '20' + match6[1] // 转为8位用于排序：20260621
            });
            continue;
        }
    }

    // 按日期降序排列（日期大的在前）
    validFiles.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

    // 标记日期最大的为 latest，其余为 dated
    // 标记日期最大的为 latest
    if (validFiles.length > 0) {
        validFiles[0].type = 'latest';
        validFiles[0].displayName = validFiles[0].rawDate;  // ← 修复：用真实日期，不是 'latest'
    
        for (let i = 1; i < validFiles.length; i++) {
            validFiles[i].type = 'dated';
            validFiles[i].displayName = validFiles[i].rawDate;
        }
    }
    return validFiles;
}

// ═══════════════════════════════════════════════════════════════
// 【修复3】日期验证 - 支持 6位和8位
// ═══════════════════════════════════════════════════════════════

function validateDate(dateStr, format) {
    if (!dateStr) return false;

    try {
        let year, month, day;

        if (format === 8) {
            // YYYYMMDD
            if (dateStr.length !== 8 || !/^\d{8}$/.test(dateStr)) return false;
            year = parseInt(dateStr.substring(0, 4));
            month = parseInt(dateStr.substring(4, 6));
            day = parseInt(dateStr.substring(6, 8));
        } else {
            // YYMMDD
            if (dateStr.length !== 6 || !/^\d{6}$/.test(dateStr)) return false;
            year = 2000 + parseInt(dateStr.substring(0, 2));
            month = parseInt(dateStr.substring(2, 4));
            day = parseInt(dateStr.substring(4, 6));
        }

        if (month < 1 || month > 12 || day < 1 || day > 31) return false;
        if (year < 2000 || year > 2100) return false;

        const dt = new Date(year, month - 1, day);
        return dt.getFullYear() === year && 
               dt.getMonth() === month - 1 && 
               dt.getDate() === day;
    } catch (e) {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════
// 探测文件（备选方案）
// ═══════════════════════════════════════════════════════════════

async function probeColumnFiles(fileName, basePath) {
    const files = [];
    const today = new Date();

    // 不再探测无日期的基础文件 fileName.html
    // 只探测 8位日期文件
    for (let i = 0; i < 90; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = formatDateYYYYMMDD(d);
        try {
            const res = await fetchWithTimeout(`${basePath}${fileName}-${ds}.html`, { method: 'HEAD' }, 1500);
            if (res.ok) {
                files.push({
                    name: `${fileName}-${ds}.html`,
                    path: `${basePath}${fileName}-${ds}.html`,
                    rawDate: ds,
                    sortKey: ds
                });
            }
        } catch (e) {}
        if (i % 5 === 4) await new Promise(r => setTimeout(r, 30));
    }

    // 按日期降序排列
    files.sort((a, b) => b.sortKey.localeCompare(a.sortKey));

    // 标记日期最大的为 latest
    if (files.length > 0) {
        files[0].type = 'latest';
        files[0].displayName = files[0].rawDate;  // ← 修复：用真实日期，不是 'latest'
    
        for (let i = 1; i < files.length; i++) {
            files[i].type = 'dated';
            files[i].displayName = files[i].rawDate;
        }
    }

    return files;
}

function fetchWithTimeout(url, options, timeout = 3000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ]);
}

function formatDateYYYYMMDD(date) {
    return `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ═══════════════════════════════════════════════════════════════
// HTML 解析
// ═══════════════════════════════════════════════════════════════

function parseColumnHTML(htmlText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    let coverImage = null;
    const heroImg = doc.querySelector('.hero img');
    if (heroImg) {
        const src = heroImg.getAttribute('src');
        //if (src && src.startsWith('data:image')) coverImage = src;        
        if (src) {
            coverImage = src;
        }
    }

    let articleTitle = '';
    const h1 = doc.querySelector('.body-text h1');
    if (h1) articleTitle = h1.textContent.trim();
    if (!articleTitle) {
        const titleTag = doc.querySelector('title');
        if (titleTag) {
            const parts = titleTag.textContent.split('·');
            articleTitle = parts[parts.length - 1].trim();
        }
    }

    let articleContent = '';
    const bodyText = doc.querySelector('.body-text');
    if (bodyText) {
        const clone = bodyText.cloneNode(true);
        const h1InClone = clone.querySelector('h1');
        if (h1InClone) h1InClone.remove();
        articleContent = clone.innerHTML;
    }

    let metaName = '', metaField = '';
    const metaNameEl = doc.querySelector('.meta-name');
    const metaFieldEl = doc.querySelector('.meta-field');
    if (metaNameEl) metaName = metaNameEl.textContent.trim();
    if (metaFieldEl) metaField = metaFieldEl.textContent.trim();

    return { coverImage, articleTitle, articleContent, metaName, metaField, rawHTML: htmlText };
}

// ═══════════════════════════════════════════════════════════════
// 预加载文章
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// 预加载文章 - 修复版
// 修复：Local 浏览器环境使用 File System Access API 读取文件内容
// ═══════════════════════════════════════════════════════════════

async function preloadArticles(files, source) {
    const articles = {};
    const CONCURRENT_LIMIT = 3;
    const lang = window.currentLang || 'zh-CN';

    for (let i = 0; i < files.length; i += CONCURRENT_LIMIT) {
        const batch = files.slice(i, i + CONCURRENT_LIMIT);
        await Promise.all(batch.map(async (file) => {
            try {
                let htmlText;

                if (source.type === SpaceType.GITHUB && file.apiUrl) {
                    // ═══ GitHub 私库：通过 API 获取 base64 内容 ═══
                    const response = await fetchWithTimeout(file.apiUrl, {
                        headers: { 'Authorization': `Bearer ${source.token}` }
                    }, 5000);

                    if (!response.ok) {
                        throw new Error(`GitHub API error: ${response.status}`);
                    }

                    const data = await response.json();

                    // 大文件（>1MB）content 为空，走 Blob API
                    if (data.encoding === 'none' || !data.content) {
                        const blobResponse = await fetchWithTimeout(data.git_url, {
                            headers: { 'Authorization': `Bearer ${source.token}` }
                        }, 5000);

                        if (!blobResponse.ok) {
                            throw new Error(`GitHub Blob API error: ${blobResponse.status}`);
                        }

                        const blobData = await blobResponse.json();
                        htmlText = base64ToUtf8(blobData.content);
                    } else {
                        htmlText = base64ToUtf8(data.content);
                    }
                } 
                // ═══【修复】Local 浏览器环境 ═══
                else if (source.type === SpaceType.LOCAL) {
                    const isElectron = window.api && typeof window.api.readFolder === 'function';
                    if (isElectron) {
                        // Electron：直接 fetch 本地文件路径
                        const response = await fetchWithTimeout(file.path, {}, 5000);
                        htmlText = await response.text();
                    } else {
                        // 浏览器：通过 File System Access API 读取
                        htmlText = await readLocalFileBrowser(file.name, source, lang);
                    }
                }
                else {
                    // ═══ WebDAV / Column 等 ═══
                    let fetchOptions = {};
                    if (source.type === SpaceType.WEBDAV && source.username) {
                        fetchOptions.headers = {
                            'Authorization': 'Basic ' + btoa(`${source.username}:${source.password}`)
                        };
                    }
                    const response = await fetchWithTimeout(file.path, fetchOptions, 5000);
                    htmlText = await response.text();
                }

                articles[file.name] = parseColumnHTML(htmlText);
            } catch (e) {
                console.warn(`[ColumnSpace] Failed to load ${file.name}:`, e);
                articles[file.name] = null;
            }
        }));
    }
    return articles;
}

// ═══【依赖函数】Base64 → UTF-8 安全解码 ═══
function base64ToUtf8(base64) {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
}

// ═══════════════════════════════════════════════════════════════
// 主入口， 保存当前模式标记
// ═══════════════════════════════════════════════════════════════

async function openUnifiedSpace(card, mode) {
    const lang = window.currentLang || 'zh-CN';
    let source;

    // ═══【新增】保存当前模式到全局变量 ═══
    window._columnSpaceMode = mode;
    window._columnSpaceCurrentCard = card;

    if (mode === 'column') {
        if (!checkSystemLogin(lang)) return;
        source = createSpaceSource(SpaceType.COLUMN, { basePath: '/StarryColumn/' });
    }
    else if (mode === 'ispace') {
        if (!checkSystemLogin(lang)) return;

        const configStr = localStorage.getItem(`ispace_config_${card.id}`);
        let activeConfig = card.iSpace || { type: 'local' };
        if (configStr) {
            try { activeConfig = JSON.parse(configStr); } catch(e){}
        }

        const isUnconfigured = !activeConfig.type || 
            (activeConfig.type === 'local' && !activeConfig.path && !activeConfig.localPath);

        if (isUnconfigured) {
            showToast(getISpaceText('configureFirst', lang) || '请先配置 iSpace');
            openISpaceSettings(card);
            return;
        }

        source = createSpaceSource(activeConfig.type, activeConfig);
    }
    else {
        showToast('未知空间类型');
        return;
    }

    showColumnSpaceLoading(lang);

    try {
        //const fileName = getFieldValue(card.name, lang);
        // ═══【修复】fileName 始终使用中文，不受界面语言影响 ═══
        const fileName = getFieldValue(card.name, 'zh-CN');
        const files = await fetchFiles(fileName, source);

        if (!files.length) {
            showColumnSpaceEmpty(lang);
            return;
        }

        const articles = await preloadArticles(files, source);
        window._columnSpaceArticles = articles;
        window._columnSpaceFiles = files;
        renderColumnSpace(card, files, articles, lang);
    }
    catch (error) {
        console.error(error);
        showColumnSpaceError(lang, error.message);
    }
}

// ═══════════════════════════════════════════════════════════════
// 3. 【新增】重新配置 iSpace 函数
// ═══════════════════════════════════════════════════════════════

function reconfigureISpace() {
    const card = window._columnSpaceCurrentCard;
    if (!card) {
        console.warn('[iSpace] No current card found for reconfiguration');
        return;
    }

    // 关闭当前阅读器
    closeColumnSpace();

    // 延迟打开设置面板，等待关闭动画完成
    setTimeout(() => {
        openISpaceSettings(card);
    }, 400);
}


async function openColumnSpace(card) {
    const lang = window.currentLang || 'zh-CN';

    // 登录检查
    const token = localStorage.getItem('qgr_jwt_token');
    let isLoggedIn = false;

    if (token) {
        const decoded = parseJWTClientSide(token);
        if (decoded) {
            isLoggedIn = true;
        }
    }

    if (!isLoggedIn) {
        alert(
            lang === 'en'
                ? 'Please login first to access Column Space.'
                : '访问专栏空间需要先登录。'
        );

        // 如果有设置窗口
        if (typeof openApiSettingsModal === 'function') {
            openApiSettingsModal();
            checkAuthStatus();
        }

        return;
    }
    
    showColumnSpaceLoading(lang);

    try {
        const fileName = getFieldValue(card.name, 'zh-CN');
        const files = await fetchColumnSpaceFiles(fileName);

        if (files.length === 0) {
            showColumnSpaceEmpty(lang);
            return;
        }

        const articles = await preloadArticles(files);
        window._columnSpaceArticles = articles;
        window._columnSpaceFiles = files;
        renderColumnSpace(card, files, articles, lang);

    } catch (error) {
        console.error('[ColumnSpace] Error:', error);
        showColumnSpaceError(lang, error.message);
    }
}

async function openISpace(card) {
    const lang = window.currentLang || 'zh-CN';
    
    // 【修改点】动态合并配置：优先读取 localStorage 里用户刚填写的配置，否则用卡片原配置
    const configStr = localStorage.getItem(`ispace_config_${card.id}`);
    let activeConfig = card.iSpace || { type: 'local' };
    if (configStr) {
        try { activeConfig = JSON.parse(configStr); } catch(e){}
    }

    // 检查是否有配置（如果是全新进入）
    if (!activeConfig.type || (activeConfig.type === 'local' && !activeConfig.path)) {
        showToast('请先配置 iSpace 专栏参数');
        // 主动弹起设置面板
        openISpaceSettings(card);
        return;
    }

    // 将用户配置构建为标准化 source 对象
    let source = createSpaceSource(activeConfig.type, activeConfig);

    // 调用我们在上一环节写好的统一加载流水线
    await openUnifiedSpaceFlow(card, source);
}

async function fetchFiles(fileName, source) {
    switch (source.type) {
        case SpaceType.COLUMN:
        case SpaceType.SYSTEM:
            // 原有的 fetchColumnSpaceFiles 逻辑写在这里
            return await fetchSystemFiles(fileName, source);
        case SpaceType.GITHUB:
            return await fetchGithubFiles(fileName, source);
        case SpaceType.LOCAL:
            return await fetchLocalFiles(fileName, source);
        case SpaceType.WEBDAV:
            // 【新增】WebDAV 处理逻辑
            return await fetchWebDAVFiles(fileName, source);
        default:
            return [];
    }
}



// 【新增 WebDAV 读取方法】
// ═══════════════════════════════════════════════════════════════
// WebDAV 文件获取 - 修复版
// 修复：复用 filterAndSortFiles 统一过滤和排序逻辑
// ═══════════════════════════════════════════════════════════════

async function fetchWebDAVFiles(fileName, source) {
    const lang = window.currentLang || 'zh-CN';
    const authHeader = 'Basic ' + btoa(`${source.username}:${source.password}`);

    const response = await fetch(source.webdavUrl, {
        method: 'PROPFIND',
        headers: {
            'Authorization': authHeader,
            'Depth': '1'
        }
    });

    if (!response.ok) {
        throw new Error(getLocalFileErrorText('webdavReadFailed', lang) || 'WebDAV 读取失败');
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const responses = xmlDoc.getElementsByTagNameNS('*', 'response');

    // ═══【修复】先收集所有 .html 文件名，再用 filterAndSortFiles 处理 ═══
    const rawFileNames = [];
    for (let i = 0; i < responses.length; i++) {
        const hrefEl = responses[i].getElementsByTagNameNS('*', 'href')[0];
        if (!hrefEl) continue;

        const href = hrefEl.textContent;
        const name = decodeURIComponent(href.split('/').pop());

        if (name.endsWith('.html')) {
            rawFileNames.push(name);
        }
    }

    // 使用统一的过滤和排序逻辑（支持 latest / 6位日期 / 8位日期）
    const filtered = filterAndSortFiles(rawFileNames, fileName);

    // 构建完整路径
    const baseUrl = source.webdavUrl.replace(/\/$/, '');
    return filtered.map(f => ({
        name: f.name,
        path: baseUrl + '/' + f.name,
        type: f.type,
        date: f.date,
        displayName: f.displayName,
        sortKey: f.sortKey
    }));
}

async function fetchSystemFiles(fileName, source) {
    const basePath = source.basePath;

    try {
        const response = await fetch(`${basePath}index.json?t=${Date.now()}`, {
            cache: 'no-cache'
        });

        if (response.ok) {
            const indexData = await response.json();

            if (indexData.byColumn && indexData.byColumn[fileName]) {
                const columnFiles = indexData.byColumn[fileName].files || [];
                const fileNames = columnFiles.map(f => f.name);
                const filtered = filterAndSortFiles(fileNames, fileName);
                return filtered.map(f => ({
                    ...f,
                    path: basePath + f.name
                }));
            }

            return filterAndSortFiles(indexData.files || [], fileName);
        }
    } catch (e) {
        console.log('[ColumnSpace] index.json not available, using probe mode');
    }

    return await probeColumnFiles(fileName, basePath);
}

async function fetchGithubFiles(fileName, source) {
    const api = `https://api.github.com/repos/${source.repo}/contents`;
    const response = await fetch(api, {
        headers: { Authorization: `Bearer ${source.token}` }
    });
    if (!response.ok) throw new Error('Github读取失败');

    const data = await response.json();

    // 提取所有 .html 文件名，统一过滤排序
    const fileNames = data
        .filter(item => item.name.endsWith('.html'))
        .map(item => item.name);

    const filtered = filterAndSortFiles(fileNames, fileName);
    const fileMap = new Map(data.map(item => [item.name, item]));

    return filtered.map(f => {
        const item = fileMap.get(f.name);
        return {
            ...f,
            path: item?.download_url || '',
            apiUrl: item?.url || ''
        };
    });
}

// ═══════════════════════════════════════════════════════════════
// 主函数：本地文件获取（支持 Electron + 浏览器双环境）
// ═══════════════════════════════════════════════════════════════

async function fetchLocalFiles(fileName, source) {
    const lang = window.currentLang || 'zh-CN';
    const isElectron = window.api && typeof window.api.readFolder === 'function';
    let rawFiles;
    
    if (isElectron) {
        rawFiles = await window.api.readFolder(source.localPath);
        if (!Array.isArray(rawFiles)) {
            throw new Error(getLocalFileErrorText('invalidFormat', lang));
        }
    } else {
        rawFiles = await fetchLocalFilesBrowser(fileName, source, lang);
    }
    
    // ═══【修复】统一使用 filterAndSortFiles 按 fileName 过滤和排序 ═══
    const filtered = filterAndSortFiles(rawFiles, fileName);
    
    // 修正 path 为本地实际路径
    return filtered.map(f => ({
        ...f,
        path: source.localPath + '/' + f.name
    }));
}

// ═══════════════════════════════════════════════════════════════
// 浏览器环境：File System Access API
// ═══════════════════════════════════════════════════════════════

async function fetchLocalFilesBrowser(fileName, source, lang) {
    const dirHandleKey = 'ispace_dir_' + btoa(unescape(encodeURIComponent(source.localPath || 'default')));

    // 尝试恢复已授权的目录句柄
    let dirHandle = await getDirectoryHandle(dirHandleKey);

    // 验证句柄是否仍有效（权限可能已过期）
    if (dirHandle) {
        try {
            // 尝试验证权限
            const permission = await dirHandle.requestPermission({ mode: 'read' });
            if (permission !== 'granted') {
                dirHandle = null;
                await removeDirectoryHandle(dirHandleKey);
            }
        } catch (e) {
            dirHandle = null;
            await removeDirectoryHandle(dirHandleKey);
        }
    }

    // 如果没有有效句柄，弹出目录选择器
    if (!dirHandle) {
        // 检查浏览器是否支持 File System Access API
        if (!window.showDirectoryPicker) {
            throw new Error(getLocalFileErrorText('browserNotSupported', lang));
        }

        try {
            dirHandle = await window.showDirectoryPicker();
            // 保存句柄供下次使用
            await saveDirectoryHandle(dirHandleKey, dirHandle);
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error(getLocalFileErrorText('userCancelled', lang));
            }
            throw new Error(getLocalFileErrorText('browserNotSupported', lang));
        }
    }

    // 遍历目录获取文件列表
    const files = [];
    try {
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.html')) {
                // 获取文件的 File 对象以读取内容
                const file = await entry.getFile();
                files.push({
                    name: entry.name,
                    file: file,           // File 对象，用于后续读取
                    lastModified: file.lastModified
                });
            }
        }
    } catch (e) {
        if (e.name === 'NotAllowedError') {
            await removeDirectoryHandle(dirHandleKey);
            throw new Error(getLocalFileErrorText('permissionDenied', lang));
        }
        throw e;
    }

    if (files.length === 0) {
        console.warn('[iSpace]', getLocalFileErrorText('noHtmlFiles', lang));
    }

    // 返回文件名数组（兼容 filterAndSortFiles 的输入格式）
    return files.map(f => f.name);
}

// ═══════════════════════════════════════════════════════════════
// 浏览器环境：读取单个文件内容（用于 preloadArticles）
// ═══════════════════════════════════════════════════════════════

async function readLocalFileBrowser(fileName, source, lang) {
    const dirHandleKey = 'ispace_dir_' + btoa(unescape(encodeURIComponent(source.localPath || 'default')));
    const dirHandle = await getDirectoryHandle(dirHandleKey);

    if (!dirHandle) {
        throw new Error(getLocalFileErrorText('permissionDenied', lang));
    }

    try {
        const fileHandle = await dirHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        return await file.text();
    } catch (e) {
        if (e.name === 'NotFoundError') {
            throw new Error(getLocalFileErrorText('fileNotFound', lang));
        }
        throw e;
    }
}

// ═══════════════════════════════════════════════════════════════
// IndexedDB 辅助：持久化保存目录句柄
// ═══════════════════════════════════════════════════════════════

const DB_NAME = 'iSpaceLocalDirDB';
const DB_VERSION = 1;
const STORE_NAME = 'dirHandles';

async function openDirDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

async function saveDirectoryHandle(key, handle) {
    try {
        const db = await openDirDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const req = store.put(handle, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.warn('[iSpace] Failed to save directory handle:', e);
    }
}

async function getDirectoryHandle(key) {
    try {
        const db = await openDirDB();
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        return await new Promise((resolve, reject) => {
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.warn('[iSpace] Failed to get directory handle:', e);
        return null;
    }
}

async function removeDirectoryHandle(key) {
    try {
        const db = await openDirDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
            const req = store.delete(key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.warn('[iSpace] Failed to remove directory handle:', e);
    }
}

// ═══════════════════════════════════════════════════════════════
// UI 组件
// ═══════════════════════════════════════════════════════════════

function showColumnSpaceLoading(lang) {
    closeColumnSpace();
    const modal = document.createElement('div');
    modal.id = 'columnSpaceModal';
    modal.className = 'column-space-modal';
    modal.innerHTML = `
        <div class="column-space-overlay"></div>
        <div class="column-space-loading">
            <div class="spacetime-fold-icon">
                <svg viewBox="0 0 100 100" width="80" height="80">
                    <defs>
                        <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea"/>
                            <stop offset="100%" style="stop-color:#c5a059"/>
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#foldGrad)" stroke-width="2" 
                            stroke-dasharray="10 5" opacity="0.6">
                        <animateTransform attributeName="transform" type="rotate" 
                                          from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#667eea" stroke-width="1.5" 
                            stroke-dasharray="5 10" opacity="0.4">
                        <animateTransform attributeName="transform" type="rotate" 
                                          from="360 50 50" to="0 50 50" dur="6s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="50" cy="50" r="15" fill="url(#foldGrad)" opacity="0.3">
                        <animate attributeName="r" values="15;18;15" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            </div>
            <div class="spacetime-fold-text">${getColumnSpaceText('spaceLoading', lang)}</div>
            <div class="spacetime-fold-dots"><span></span><span></span><span></span></div>
        </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function showColumnSpaceEmpty(lang) {
    const modal = document.getElementById('columnSpaceModal');
    if (modal) modal.innerHTML = `
        <div class="column-space-overlay" onclick="closeColumnSpace()"></div>
        <div class="column-space-empty">
            <div class="empty-icon">📚</div>
            <div class="empty-text">${getColumnSpaceText('emptyDirectory', lang)}</div>
            <button class="btn-close-space" onclick="closeColumnSpace()">${getColumnSpaceText('close', lang)}</button>
        </div>`;
}

function showColumnSpaceError(lang, message) {
    const modal = document.getElementById('columnSpaceModal');
    if (modal) modal.innerHTML = `
        <div class="column-space-overlay" onclick="closeColumnSpace()"></div>
        <div class="column-space-error">
            <div class="error-icon">⚠️</div>
            <div class="error-text">${getColumnSpaceText('loadError', lang)}</div>
            <div class="error-detail">${message}</div>
            <button class="btn-close-space" onclick="closeColumnSpace()">${getColumnSpaceText('close', lang)}</button>
        </div>`;
}

function closeColumnSpace() {
    const modal = document.getElementById('columnSpaceModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            window._columnSpaceArticles = null;
            window._columnSpaceFiles = null;
            window._columnSpaceCurrentPages = null;
            window._columnSpaceCurrentPage = null;
            document.removeEventListener('keydown', handleReaderKeydown);
        }, 400);
    }
}

// ═══════════════════════════════════════════════════════════════
// renderColumnSpace：阅读器工具栏增加"重新配置"按钮
// ═══════════════════════════════════════════════════════════════

function renderColumnSpace(card, files, articles, lang) {
    const modal = document.getElementById('columnSpaceModal');
    if (!modal) return;

    const cardName = getFieldValue(card.name, lang);

    // ═══【新增】判断当前是否为 iSpace 模式 ═══
    const isISpaceMode = window._columnSpaceMode === 'ispace';

    modal.innerHTML = `
        <div class="column-space-overlay" onclick="closeColumnSpace()"></div>
        <div class="column-space-container">
            <div class="column-space-directory" id="columnSpaceDirectory">
                <div class="directory-header">
                    <button class="btn-back-close" onclick="closeColumnSpace()" title="${getColumnSpaceText('close', lang)}">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                    <h2 class="directory-title">
                        <span class="title-icon">✦</span>${cardName}
                        <span class="title-sub">${getColumnSpaceText('spaceTitle', lang)}</span>
                    </h2>                   

                </div>                
                <div class="directory-list" id="directoryList">
                    ${renderDirectoryItems(files, articles, lang)}
                </div>
            </div>
            <div class="column-space-reader" id="columnSpaceReader" style="display:none;">
                <div class="reader-toolbar">
                    <button class="btn-back-directory" onclick="showDirectoryView()" title="${getColumnSpaceText('backToDirectory', lang)}">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span>${getColumnSpaceText('backToDirectory', lang)}</span>
                    </button>
                    <div style="flex: 1;"></div>
       
                    <div class="reader-pagination" id="readerPagination"></div>
                </div>
                <div class="reader-book" id="readerBook">
                    <div class="book-pages" id="bookPages"></div>
                </div>
                <div class="reader-nav">
                    <button class="btn-nav prev" id="btnPrevPage" onclick="flipPage(-1)">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg><span>${getColumnSpaceText('prevPage', lang)}</span>
                    </button>
                    <button class="btn-nav next" id="btnNextPage" onclick="flipPage(1)">
                        <span>${getColumnSpaceText('nextPage', lang)}</span>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                    <button class="btn-nav view-image" id="btnViewImage" onclick="showFullImage()" style="display: none;">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg><span>${getColumnSpaceText('viewImage', lang)}</span>
                    </button>
                </div>
            </div>
        </div>`;

    document.addEventListener('keydown', handleReaderKeydown);
    bindTouchEvents();
}



function renderDirectoryItems(files, articles, lang) {
    return files.map((file, index) => {
        const article = articles[file.name];
        const isLatest = file.type === 'latest';
        /*
        const displayLabel = isLatest 
            ? getColumnSpaceText('latestColumn', lang)
            : formatDisplayDate(file.displayName, lang);*/
        const displayLabel = formatDisplayDate(file.displayName, lang); //目录统一显示日期
        const hasContent = article && article.articleTitle;
        const title = hasContent ? article.articleTitle : file.name;
        const excerpt = hasContent && article.articleContent 
            ? stripHtml(article.articleContent).slice(0, 120) + '...' 
            : '';

        return `
            <div class="directory-item ${isLatest ? 'latest' : ''} ${!hasContent ? 'error' : ''}" 
                 onclick="${hasContent ? `openArticle('${file.name}')` : ''}" 
                 style="animation-delay: ${index * 0.08}s">
                <div class="item-glow"></div>
                <div class="item-content">
                    <div class="item-label">
                        <span class="label-badge">${displayLabel}</span>
                        ${isLatest ? '<span class="latest-star">★</span>' : ''}
                    </div>
                    <div class="item-title">${escapeHtml(title)}</div>
                    ${excerpt ? `<div class="item-excerpt">${escapeHtml(excerpt)}</div>` : ''}
                    ${!hasContent ? `<div class="item-error">${getColumnSpaceText('parseError', lang)}</div>` : ''}
                </div>
                <div class="item-arrow">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </div>
            </div>`;
    }).join('');
}

function formatDisplayDate(dateStr, lang) {
    // 支持 YYYYMMDD (8位) 和 YYMMDD (6位)
    let year, month, day;
    
    if (!dateStr)
        return '';

    if (dateStr.length === 8) {
        year = dateStr.substring(0, 4);
        month = dateStr.substring(4, 6);
        day = dateStr.substring(6, 8);
    } else {
        year = '20' + dateStr.substring(0, 2);
        month = dateStr.substring(2, 4);
        day = dateStr.substring(4, 6);
    }

    if (lang === 'zh-CN') {
        return `${year}年${month}月${day}日`;
    } else {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${months[parseInt(month)-1]} ${day}, ${year}`;
    }
}

// ═══════════════════════════════════════════════════════════════
// 阅读器
// ═══════════════════════════════════════════════════════════════

function openArticle(fileName) {
    const lang = window.currentLang || 'zh-CN';
    const articles = window._columnSpaceArticles || {};
    const article = articles[fileName];

    if (!article) {
        showToast(getColumnSpaceText('loadError', lang), 'error');
        return;
    }

    const pages = buildPages(article);
    window._columnSpaceCurrentPages = pages;
    window._columnSpaceCurrentPage = 0;
    window._columnSpaceCurrentFile = fileName;

    showReaderView();
    renderBookPages(pages, 0, lang);
    updatePagination(0, pages.length, lang);

    const btnViewImage = document.getElementById('btnViewImage');
    if (btnViewImage) {
        // 如果文章有封面图才显示按钮
        btnViewImage.style.display = pages[0].coverImage ? 'flex' : 'none';
    }
}

function buildPages(article) {
    const pages = [];
    pages.push({
        type: 'cover',
        coverImage: article.coverImage,
        title: article.articleTitle,
        metaName: article.metaName,
        metaField: article.metaField
    });

    if (article.articleContent) {
        const contentPages = splitContentToPages(article.articleContent);
        contentPages.forEach(content => pages.push({ type: 'content', content }));
    }
    return pages;
}

function splitContentToPages(htmlContent) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const elements = Array.from(tempDiv.children);
    const pages = [];
    let currentPage = [];
    let currentLength = 0;
    const MAX_CHARS = 1500;

    for (const el of elements) {
        const elText = el.textContent || '';
        const elHTML = el.outerHTML;

        if (currentLength + elText.length > MAX_CHARS && currentPage.length > 0) {
            pages.push(currentPage.join(''));
            currentPage = [elHTML];
            currentLength = elText.length;
        } else {
            currentPage.push(elHTML);
            currentLength += elText.length;
        }
    }

    if (currentPage.length > 0) pages.push(currentPage.join(''));
    if (pages.length === 0) pages.push(htmlContent);
    return pages;
}

// ═══════════════════════════════════════════════════════════════
// 【修复】renderBookPages - 封面页结构修正
// ═══════════════════════════════════════════════════════════════
function renderBookPages(pages, currentIndex, lang) {
    const container = document.getElementById('bookPages');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;

    container.innerHTML = pages.map((page, index) => {
        const isActive = index === currentIndex;
        const isPrev = index === currentIndex - 1;
        const isNext = index === currentIndex + 1;

        let pageContent = '';

        if (page.type === 'cover') {
            // 【修复】封面页：标题在最上，图片在中间，装饰在下方
            pageContent = `
                <div class="page-cover">
                    <!-- 标题区域 (已移到图片容器外部的上方) -->
                    <div class="cover-title-area">
                        <h1 class="cover-title">${escapeHtml(page.title || '')}</h1>
                        ${page.metaField ? `<div class="cover-meta">${escapeHtml(page.metaField)}</div>` : ''}
                    </div>

                    <!-- 图片区域 -->
                    ${page.coverImage ? `
                        <div class="cover-image-wrapper">
                            <img src="${page.coverImage}" alt="${escapeHtml(page.title || '')}">
                        </div>
                    ` : ''}

                    <!-- 装饰 (在底部) -->
                    <div class="cover-decoration">
                        <div class="deco-line"></div>
                        <div class="deco-star">✦</div>
                        <div class="deco-line"></div>
                    </div>
                </div>
            `;
        } else {
            // 内容页：只显示正文
            pageContent = `
                <div class="page-content-body">
                    ${page.content}
                </div>
            `;
        }

        return `
            <div class="book-page ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}"
                 data-page-index="${index}"
                 style="z-index: ${pages.length - index}">
                <div class="page-shadow"></div>
                <div class="page-content">
                    ${pageContent}
                </div>
                <div class="page-number">${index + 1}</div>
            </div>
        `;
    }).join('');

    // 更新标题栏（封面页不显示标题，避免重复）
    const titleEl = document.getElementById('readerTitle');
    if (titleEl && pages[currentIndex]) {
        // 封面页不设置标题，由 .cover-title 显示
        if (pages[currentIndex].type === 'cover') {
            titleEl.textContent = '';
        } else {
            titleEl.textContent = pages[currentIndex].title || '';
        }
    }
}

function flipPage(direction) {
    const pages = window._columnSpaceCurrentPages;
    const current = window._columnSpaceCurrentPage;
    const newIndex = current + direction;
    const lang = window.currentLang || 'zh-CN';

    if (!pages || newIndex < 0 || newIndex >= pages.length) return;

    const container = document.getElementById('bookPages');
    if (!container) return;

    const pageEls = container.querySelectorAll('.book-page');

    // 【核心修复】移除手机端特有的上下翻页动画，统一使用书本式的左右翻页动画
    if (direction > 0) {
        pageEls[current]?.classList.add('flip-left-out');
        pageEls[newIndex]?.classList.remove('next');
        pageEls[newIndex]?.classList.add('active', 'flip-left-in');
    } else {
        pageEls[current]?.classList.remove('active');
        pageEls[current]?.classList.add('next');
        pageEls[newIndex]?.classList.remove('prev');
        pageEls[newIndex]?.classList.add('active', 'flip-right-in');
    }

    window._columnSpaceCurrentPage = newIndex;
    updatePagination(newIndex, pages.length, lang);

    const titleEl = document.getElementById('readerTitle');
    if (titleEl && pages[newIndex]?.title) titleEl.textContent = pages[newIndex].title;

    setTimeout(() => {
        pageEls.forEach((el, i) => {
            el.classList.remove('flip-left-out', 'flip-left-in', 'flip-right-in', 
                               'flip-up-out', 'flip-up-in', 'flip-down-in', 'prev', 'next');
            if (i === newIndex) el.classList.add('active');
            else if (i < newIndex) el.classList.add('prev');
            else el.classList.add('next');
        });
    }, 600);
}

// 将以下两个函数放在 JS 代码中的合适位置
function showFullImage() {
    const pages = window._columnSpaceCurrentPages;
    if (!pages || !pages[0].coverImage) return;

    const imgSrc = pages[0].coverImage;
    //const lang = window.currentLang || 'zh-CN';
    //const hintText = lang === 'zh-CN' ? '滚轮缩放 · 拖拽移动 · 点击缩小' : 'Scroll to zoom · Drag to move · Click to zoom out';

    const viewer = document.createElement('div');
    viewer.id = 'columnSpaceImageViewer';
    viewer.className = 'column-space-image-viewer';
    viewer.innerHTML = `
        <div class="image-viewer-overlay" onclick="closeFullImage()"></div>
        <button class="image-viewer-close" onclick="closeFullImage()">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
        <div class="image-viewer-wrapper" id="imageViewerWrapper">
            <img src="${imgSrc}" class="image-viewer-img" id="imageViewerImg" 
                 onclick="toggleImageZoom(event)" 
                 onwheel="handleImageWheel(event)" />
        </div>
        <!-- 提示文字已注释 -->
    `;
    document.body.appendChild(viewer);

    // ═══【新增】绑定拖拽事件 ═══
    bindImageDragEvents();

    requestAnimationFrame(() => {
        viewer.classList.add('show');
    });
}

// ═══ 点击缩放 ═══
function toggleImageZoom(event) {
    // 如果正在拖拽，不触发点击
    if (window._isImageDragging) return;
    
    const img = document.getElementById('imageViewerImg');
    if (!img) return;
    
    if (img.classList.contains('zoomed')) {
        // 缩小：重置位置和缩放
        img.classList.remove('zoomed');
        img.style.transform = 'scale(1) translate(0px, 0px)';
        window._imageZoomScale = 1;
        window._imagePanX = 0;
        window._imagePanY = 0;
    } else {
        // 放大
        img.classList.add('zoomed');
        window._imageZoomScale = 1.8;
        window._imagePanX = 0;
        window._imagePanY = 0;
        updateImageTransform();
    }
}

// ═══【新增】滚轮缩放 ═══
function handleImageWheel(event) {
    event.preventDefault();
    const img = document.getElementById('imageViewerImg');
    if (!img || !img.classList.contains('zoomed')) return;
    
    const delta = event.deltaY > 0 ? -0.2 : 0.2;
    window._imageZoomScale = Math.max(1, Math.min(5, window._imageZoomScale + delta));
    updateImageTransform();
}

// ═══【新增】更新变换 ═══
function updateImageTransform() {
    const img = document.getElementById('imageViewerImg');
    if (!img) return;
    img.style.transform = `scale(${window._imageZoomScale}) translate(${window._imagePanX}px, ${window._imagePanY}px)`;
}

// ═══【新增】拖拽事件绑定 ═══
function bindImageDragEvents() {
    const img = document.getElementById('imageViewerImg');
    if (!img) return;
    
    let isDragging = false;
    let startX, startY;
    let initialPanX = 0, initialPanY = 0;
    
    // 鼠标按下
    img.addEventListener('mousedown', (e) => {
        if (!img.classList.contains('zoomed')) return;
        isDragging = true;
        window._isImageDragging = false;  // 重置标记
        img.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        initialPanX = window._imagePanX || 0;
        initialPanY = window._imagePanY || 0;
        e.preventDefault();
    });
    
    // 鼠标移动
    const handleMove = (e) => {
        if (!isDragging) return;
        window._isImageDragging = true;  // 标记正在拖拽
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        window._imagePanX = initialPanX + dx / window._imageZoomScale;
        window._imagePanY = initialPanY + dy / window._imageZoomScale;
        
        updateImageTransform();
    };
    
    // 鼠标释放
    const handleEnd = () => {
        isDragging = false;
        img.classList.remove('dragging');
        // 延迟重置 _isImageDragging，防止触发 click
        setTimeout(() => { window._isImageDragging = false; }, 100);
    };
    
    img.addEventListener('mousemove', handleMove);
    img.addEventListener('mouseup', handleEnd);
    img.addEventListener('mouseleave', handleEnd);
    
    // 触摸支持
    img.addEventListener('touchstart', (e) => {
        if (!img.classList.contains('zoomed')) return;
        if (e.touches.length !== 1) return;  // 单指拖拽
        
        isDragging = true;
        window._isImageDragging = false;
        img.classList.add('dragging');
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        initialPanX = window._imagePanX || 0;
        initialPanY = window._imagePanY || 0;
    }, { passive: false });
    
    img.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault();  // 防止页面滚动
        
        window._isImageDragging = true;
        
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        
        window._imagePanX = initialPanX + dx / window._imageZoomScale;
        window._imagePanY = initialPanY + dy / window._imageZoomScale;
        
        updateImageTransform();
    }, { passive: false });
    
    img.addEventListener('touchend', handleEnd);
    img.addEventListener('touchcancel', handleEnd);
}

function closeFullImage() {
    const viewer = document.getElementById('columnSpaceImageViewer');
    if (viewer) {
        viewer.classList.remove('show');
        setTimeout(() => viewer.remove(), 300);
    }
    // 清理状态
    window._imageZoomScale = 1;
    window._imagePanX = 0;
    window._imagePanY = 0;
    window._isImageDragging = false;
}

function updatePagination(current, total, lang) {
    const pagination = document.getElementById('readerPagination');
    if (pagination) {
        pagination.textContent = getColumnSpaceText('pageIndicator', lang)
            .replace('{current}', current + 1).replace('{total}', total);
    }
    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
}

function showDirectoryView() {
    const directory = document.getElementById('columnSpaceDirectory');
    const reader = document.getElementById('columnSpaceReader');
    if (directory) { directory.style.display = 'block'; directory.style.opacity = '0'; setTimeout(() => directory.style.opacity = '1', 10); }
    if (reader) { reader.style.opacity = '0'; setTimeout(() => reader.style.display = 'none', 400); }
}

function showReaderView() {
    const directory = document.getElementById('columnSpaceDirectory');
    const reader = document.getElementById('columnSpaceReader');
    if (directory) { directory.style.opacity = '0'; setTimeout(() => directory.style.display = 'none', 400); }
    if (reader) { reader.style.display = 'flex'; reader.style.opacity = '0'; setTimeout(() => reader.style.opacity = '1', 10); }
}

function handleReaderKeydown(e) {
    const modal = document.getElementById('columnSpaceModal');
    if (!modal) return;
    const reader = document.getElementById('columnSpaceReader');
    const isReaderVisible = reader && reader.style.display !== 'none';

    if (isReaderVisible) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); flipPage(-1); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); flipPage(1); }
        else if (e.key === 'Escape') showDirectoryView();
    } else {
        if (e.key === 'Escape') closeColumnSpace();
    }
}

function bindTouchEvents() {
    let startY = 0, startX = 0;
    const container = document.querySelector('.column-space-container');
    if (!container) return;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const reader = document.getElementById('columnSpaceReader');
        if (!reader || reader.style.display === 'none') return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // 【核心修复】无论手机还是电脑，统一使用“左右滑动”来翻页
        // 判定条件：横向滑动距离大于50px，且横向位移大于纵向位移
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                flipPage(1);  // 向左滑，下一页
            } else {
                flipPage(-1); // 向右滑，上一页
            }
        }
    }, { passive: true });
}

function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// ═══════════════════════════════════════════════════════════════
// iSpace 配置面板 (Settings Modal)
// ═══════════════════════════════════════════════════════════════

function openISpaceSettings(card) {
    const lang = window.currentLang || 'zh-CN';
    
    // 尝试从持久化存储(如 localStorage) 或卡片本身读取配置
    // 为了防止跨设备丢失，实际项目中建议存入数据库或 Electron store
    const configStr = localStorage.getItem(`ispace_config_${card.id}`);
    let config = card.iSpace || { type: 'local' };
    if (configStr) {
        try { config = JSON.parse(configStr); } catch(e){}
    }

    // 避免重复创建
    closeISpaceSettings();

    const modal = document.createElement('div');
    modal.id = 'iSpaceSettingsModal';
    modal.className = 'column-space-modal ispace-settings-modal'; // 复用遮罩样式
    
    modal.innerHTML = `
        <div class="column-space-overlay" onclick="closeISpaceSettings()"></div>
        <div class="ispace-settings-container">
            <div class="settings-header">
                <h3>${getISpaceText('settingsTitle', lang)}</h3>
                <button class="btn-back-close" onclick="closeISpaceSettings()">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            
            <div class="settings-body">
                <!-- 类型选择 -->
                <div class="form-group">
                    <label>${getISpaceText('typeSelect', lang)}</label>
                    <select id="iSpaceTypeSelect" onchange="toggleISpaceFormGroups()">
                        <option value="local" ${config.type === 'local' ? 'selected' : ''}>${getISpaceText('typeLocal', lang)}</option>
                        <option value="github" ${config.type === 'github' ? 'selected' : ''}>${getISpaceText('typeGithub', lang)}</option>
                        <option value="webdav" ${config.type === 'webdav' ? 'selected' : ''}>${getISpaceText('typeWebDAV', lang)}</option>
                    </select>
                </div>

                <!-- 本地配置区域 -->
                <div id="formGroup-local" class="type-form-group">
                    <div class="form-group">
                        <label>${getISpaceText('localPath', lang)}</label>
                        <input type="text" id="iSpaceLocalPath" value="${config.path || config.localPath || ''}" placeholder="${getISpaceText('localPathPlaceholder', lang)}">
                    </div>
                </div>

                <!-- Github 配置区域 -->
                <div id="formGroup-github" class="type-form-group">
                    <div class="form-group">
                        <label>${getISpaceText('repo', lang)}</label>
                        <input type="text" id="iSpaceGithubRepo" value="${config.repo || ''}" placeholder="${getISpaceText('repoPlaceholder', lang)}">
                    </div>
                    <div class="form-group">
                        <label>${getISpaceText('branch', lang)}</label>
                        <input type="text" id="iSpaceGithubBranch" value="${config.branch || 'main'}">
                    </div>
                    <div class="form-group">
                        <label>${getISpaceText('token', lang)}</label>
                        <input type="password" id="iSpaceGithubToken" value="${config.token || ''}" placeholder="${getISpaceText('tokenPlaceholder', lang)}">
                    </div>
                </div>

                <!-- WebDAV 配置区域 -->
                <div id="formGroup-webdav" class="type-form-group">
                    <div class="form-group">
                        <label>${getISpaceText('webdavUrl', lang)}</label>
                        <input type="text" id="iSpaceWebdavUrl" value="${config.webdavUrl || ''}" placeholder="${getISpaceText('webdavUrlPlaceholder', lang)}">
                    </div>
                    <div class="form-group row-group">
                        <div class="form-group half">
                            <label>${getISpaceText('username', lang)}</label>
                            <input type="text" id="iSpaceWebdavUser" value="${config.username || ''}">
                        </div>
                        <div class="form-group half">
                            <label>${getISpaceText('password', lang)}</label>
                            <input type="password" id="iSpaceWebdavPass" value="${config.password || ''}">
                        </div>
                    </div>
                </div>
            </div>

            <div class="settings-footer">
                <button class="btn-cancel" onclick="closeISpaceSettings()">${getISpaceText('cancelBtn', lang)}</button>
                <button class="btn-save" onclick="saveISpaceSettings('${card.id}')">${getISpaceText('saveBtn', lang)}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // 初始化显示隐藏
    toggleISpaceFormGroups();
}

function toggleISpaceFormGroups() {
    const type = document.getElementById('iSpaceTypeSelect').value;
    document.getElementById('formGroup-local').style.display = type === 'local' ? 'block' : 'none';
    document.getElementById('formGroup-github').style.display = type === 'github' ? 'block' : 'none';
    document.getElementById('formGroup-webdav').style.display = type === 'webdav' ? 'block' : 'none';
}

function closeISpaceSettings() {
    const modal = document.getElementById('iSpaceSettingsModal');
    if (modal) modal.remove();
}

function saveISpaceSettings(cardId) {
    const type = document.getElementById('iSpaceTypeSelect').value;
    const config = { type: type };

    if (type === 'local') {
        config.path = document.getElementById('iSpaceLocalPath').value.trim();
        config.localPath = config.path; // 兼容不同命名
    } else if (type === 'github') {
        config.repo = document.getElementById('iSpaceGithubRepo').value.trim();
        config.branch = document.getElementById('iSpaceGithubBranch').value.trim() || 'main';
        config.token = document.getElementById('iSpaceGithubToken').value.trim();
    } else if (type === 'webdav') {
        config.webdavUrl = document.getElementById('iSpaceWebdavUrl').value.trim();
        config.username = document.getElementById('iSpaceWebdavUser').value.trim();
        config.password = document.getElementById('iSpaceWebdavPass').value.trim();
    }

    // 保存到 localStorage (或者直接更新绑定在内存在 card.iSpace)
    localStorage.setItem(`ispace_config_${cardId}`, JSON.stringify(config));
    
    // 如果你有全局 card 对象，这里可以同步更新
    // window.currentCard.iSpace = config; 

    const lang = window.currentLang || 'zh-CN';
    showToast(getISpaceText('saveSuccess', lang));
    closeISpaceSettings();
}
