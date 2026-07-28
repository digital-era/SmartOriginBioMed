let currentSelectedLeader = null;
let currentSelectedLeaderCategory = '';
let currentGeneratedPrompt = '';

// ═══════════════════════════════════════════════
// 【全局变量挂载】支持跨模块访问
// ═══════════════════════════════════════════════
window.currentSelectedLeader = currentSelectedLeader;
window.currentSelectedLeaderCategory = currentSelectedLeaderCategory;
window.currentGeneratedPrompt = currentGeneratedPrompt;

// --- [新增] 对话画布相关全局变量 ---
let conversationHistory = []; // 存储 {role, text, leaderName, timestamp}
// --- [新增] 用于临时存储从 MD 导入的对话历史
let importedHistory = null;  
let isCanvasModeOpen = false;


// ═══════════════════════════════════════════════
// 【多语言字段解析】统一处理字符串和多语言对象
// ═══════════════════════════════════════════════
function getFieldValue(field, lang) {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
        return field[lang] || field['zh-CN'] || field['en'] || Object.values(field)[0] || '';
    }
    return String(field);
}

// ═══════════════════════════════════════════════
// 【文字流动动效】优雅阅读模式的滚动动画
// ═══════════════════════════════════════════════
function triggerTextFlowEffect(containerId, scrollContainerId) {
    const container = document.getElementById(containerId);
    const scrollArea = document.getElementById(scrollContainerId);
    if (!container || !scrollArea) return;

    // 获取所有顶层区块（段落、标题、列表、引用等）
    const elements = container.children;
    
    // 使用 IntersectionObserver 监听元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // 元素进入视口，触发流动动画
                entry.target.classList.add('flow-animate');
                // 触发后停止观察，保持常驻
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: scrollArea, // 监听滚动区域
        threshold: 0.1,   // 露出10%就开始流动
        rootMargin: "0px 0px -30px 0px" // 底部视口稍微往上一点触发，更有流动感
    });

    Array.from(elements).forEach((el, index) => {
        // 首屏可见的元素（假设前5个），给予阶梯式延迟，产生"哗啦啦"流下来的感觉
        if (index < 6) {
            el.style.animationDelay = `${index * 0.15}s`;
        } else {
            // 滚动出来的元素，仅给微小延迟
            el.style.animationDelay = `0.1s`;
        }
        // 开始观察
        observer.observe(el);
    });
}


// ═══════════════════════════════════════════════
// 【Session 持久化】仅恢复对话画布内容
// ═══════════════════════════════════════════════
(function initCanvasSession() {
    try {
        // 恢复对话历史
        const savedChat = sessionStorage.getItem('northstar_canvas_history');
        if (savedChat) {
            conversationHistory = JSON.parse(savedChat);
        }

        // --- [新增] 恢复导入的历史 ---
        const savedImported = sessionStorage.getItem('northstar_imported_history');
        if (savedImported) {
            importedHistory = JSON.parse(savedImported);
        }
    } catch (e) {
        console.error("Session 恢复失败:", e);
        conversationHistory = [];
        importedHistory = null;
    }
})();

// 优雅模式状态锁，防止动画冲突和频繁点击
let isElegantModeOpen = false;

// --- NEW: Modal Control ---
const apiSettingsModal = document.getElementById('apiSettingsModal');
const apiEndpointSelect = document.getElementById('apiEndpoint'); // Changed ID to match HTML
const apiKeyInput = document.getElementById('apiKey');           // Changed ID to match HTML
const apiModelSelect = document.getElementById('apiModel');       // Changed ID to match HTML
const apiDefaultModelCheck = document.getElementById('apiDefaultModelCheck'); // Added checkbox

function openApiSettingsModal(event) {
    if (event) event.preventDefault(); // Prevent default anchor behavior
    if (apiSettingsModal) apiSettingsModal.style.display = 'block';
    loadApiSettings(); // Load settings when modal opens
}

function closeApiSettingsModal() {
    if (apiSettingsModal) apiSettingsModal.style.display = 'none';
}

// Close modal if user clicks outside of the modal content
window.onclick = function(event) {
    if (event.target == apiSettingsModal) {
        closeApiSettingsModal();
    }
}

// --- NEW: Settings Persistence ---
// Helper to get all settings from localStorage
function getAllApiSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem('apiSettingsMap') || '{}');
        return settings;
    } catch (e) {
        console.error("Error parsing apiSettingsMap from localStorage:", e);
        return {};
    }
}

// Helper to get the default API settings
function getDefaultApiSettings() {
    const allSettings = getAllApiSettings();
    const defaultSetting = Object.values(allSettings).find(s => s.isDefaultModel);
    return defaultSetting || { endpoint: null, apiKey: null, model: null };
}

function saveApiSettings() {
    const selectedModelName = apiModelSelect.value;
    const selectedEndpoint = apiEndpointSelect.value;
    const inputApiKey = apiKeyInput.value;
    const isDefault = apiDefaultModelCheck.checked;

    if (!selectedModelName) {
        alert(translations[currentLang].alertSelectModelToSave); // Ensure this translation key exists
        return;
    }

    const allSettings = getAllApiSettings();

    // Set/update current model's configuration
    allSettings[selectedModelName] = {
        endpoint: selectedEndpoint,
        apiKey: inputApiKey,
        model: selectedModelName,
        isDefaultModel: isDefault
    };

    // If this model is set as default, ensure all others are not
    if (isDefault) {
        Object.keys(allSettings).forEach(modelKey => {
            if (modelKey !== selectedModelName) {
                allSettings[modelKey].isDefaultModel = false;
            }
        });
    }

    localStorage.setItem('apiSettingsMap', JSON.stringify(allSettings));

    alert(translations[currentLang].settingsSaved || 'Settings Saved!');
    closeApiSettingsModal();
}

function loadApiSettings() {
    const allSettings = getAllApiSettings();
    const defaultSetting = getDefaultApiSettings();

    // Populate the endpoint dropdown with all available endpoints
    populateEndpointSelect(defaultSetting.endpoint);

    // After populating endpoints, if there's a default, update models for it
    if (defaultSetting.endpoint) {
        updateModelSelectByEndpoint(defaultSetting.endpoint, defaultSetting.model);
    } else {
        // If no default, populate models for the first endpoint in the map, or clear
        const firstEndpoint = Object.keys(endpointModelMap)[0];
        if (firstEndpoint) {
            apiEndpointSelect.value = firstEndpoint;
            updateModelSelectByEndpoint(firstEndpoint);
        } else {
            apiEndpointSelect.value = '';
            apiModelSelect.innerHTML = '';
            apiModelSelect.disabled = true;
        }
    }

    // Now, apply the settings of the *currently selected* model in the dropdown
    // or the default settings if no specific model is selected yet.
    const currentSelectedModelInUI = apiModelSelect.value;
    const cfgToApply = allSettings[currentSelectedModelInUI] || defaultSetting;

    if (cfgToApply.endpoint) apiEndpointSelect.value = cfgToApply.endpoint;
    if (cfgToApply.apiKey) apiKeyInput.value = cfgToApply.apiKey;
    if (cfgToApply.model) apiModelSelect.value = cfgToApply.model;
    apiDefaultModelCheck.checked = Boolean(cfgToApply.isDefaultModel);

    // This ensures that if a model is selected, its corresponding settings are loaded
    // regardless of whether it's the default.
    // This part is crucial for editing settings of non-default models.
    if (currentSelectedModelInUI && allSettings[currentSelectedModelInUI]) {
        const specificModelConfig = allSettings[currentSelectedModelInUI];
        apiEndpointSelect.value = specificModelConfig.endpoint;
        apiKeyInput.value = specificModelConfig.apiKey;
        apiDefaultModelCheck.checked = specificModelConfig.isDefaultModel;
        updateModelSelectByEndpoint(specificModelConfig.endpoint, specificModelConfig.model);
    } else if (defaultSetting.model) {
        apiEndpointSelect.value = defaultSetting.endpoint;
        apiKeyInput.value = defaultSetting.apiKey;
        apiDefaultModelCheck.checked = defaultSetting.isDefaultModel;
        updateModelSelectByEndpoint(defaultSetting.endpoint, defaultSetting.model);
    } else {
        // If no settings at all, clear everything
        apiKeyInput.value = '';
        apiDefaultModelCheck.checked = false;
    }
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    if(evt) evt.currentTarget.className += " active";

    if (currentSelectedLeader && currentSelectedLeaderCategory !== tabName) {
        clearSelection();
    }
    updateAllScrollButtonStates();

    //现代界面风格
    onTabChanged();
}

function populateLeaders() {
    for (const category in allData) {
        const grid = document.getElementById(`${category}Grid`);
        if (!grid) continue;
        grid.innerHTML = '';
        allData[category].forEach(leader => {
            const card = document.createElement('div');
            card.className = 'leader-card';
            card.dataset.id = leader.id;
            card.dataset.category = category;

            const displayedContribution = leader.contribution[currentLang] || leader.contribution['zh-CN'];
            const displayedField = leader.field[currentLang] || leader.field['zh-CN'];
            const displayedRemarks = leader.remarks ? (leader.remarks[currentLang] || leader.remarks['zh-CN']) : '';

            card.innerHTML = `
                <h3>${leader.name}</h3>
                <p><strong>${translations[currentLang].labelContribution}</strong> ${displayedContribution}</p>
                <p class="field"><strong>${translations[currentLang].labelField}</strong> ${displayedField}</p>
                ${displayedRemarks ? `<p class="remarks"><strong>${translations[currentLang].labelRemarks}</strong> ${displayedRemarks}</p>` : ''}
            `;
            card.onclick = () => selectLeader(leader, category, card);
            grid.appendChild(card);
        });
        grid.addEventListener('scroll', () => updateScrollButtonStates(grid));
        updateScrollButtonStates(grid);
    }
}

function clearSelection() {
    if (currentSelectedLeader) {
        const prevSelectedCard = document.querySelector(`.leader-card.selected[data-category='${currentSelectedLeaderCategory}']`);
        if (prevSelectedCard) {
            prevSelectedCard.classList.remove('selected');
        }
    }
    currentSelectedLeader = null;
    currentSelectedLeaderCategory = '';
    document.getElementById('selectedLeaderName').textContent = translations[currentLang].noLeaderSelected;
    currentGeneratedPrompt = '';
    document.getElementById('prompt-display-area').style.display = 'none';
    // --- 新增：重置折叠状态 ---
    document.getElementById('prompt-collapsible-content').style.display = 'none';
    document.getElementById('prompt-toggle-icon').classList.remove('icon-rotated');
    document.getElementById('ai-response-area').style.display = 'none';
    document.getElementById('generatedPromptText').value = '';
    document.getElementById('aiResponseText').textContent = '';
}

function selectLeader(leader, category, cardElement) {
    if (currentSelectedLeader) {
         const prevSelectedCard = document.querySelector(`.leader-card.selected[data-category='${currentSelectedLeaderCategory}']`);
         if (prevSelectedCard) {
            prevSelectedCard.classList.remove('selected');
         }
    }

    currentSelectedLeader = leader;
    currentSelectedLeaderCategory = category;
    
    // 【增强】多语言名称解析
    const lang = window.currentLang || 'zh-CN';
    const nameText = getFieldValue(leader.name, lang);
    document.getElementById('selectedLeaderName').textContent = nameText;
    
    if (cardElement) {
        cardElement.classList.add('selected');
    }
    
    currentGeneratedPrompt = '';
    document.getElementById('prompt-display-area').style.display = 'none';
    document.getElementById('prompt-collapsible-content').style.display = 'none';
    const toggleIcon = document.getElementById('prompt-toggle-icon');
    if(toggleIcon) toggleIcon.classList.remove('icon-rotated');
    document.getElementById('ai-response-area').style.display = 'none';
    document.getElementById('generatedPromptText').value = '';
    document.getElementById('aiResponseText').textContent = '';

    // 【修复】映射短代码到 HTML 中实际的 tab id
    const tabIdMap = {
        'TCM': 'TCM',
        'WM': 'WM',
        'MO': 'MultiOmics',
        'NL': 'NeuralLink',
        'AIDis': 'AIDrugDiscovery',
        'AIHC': 'AIHealthcare'
    };
    const tabId = tabIdMap[category] || category;
    const tabElement = document.getElementById(tabId);
    
    // 【修复】加空值检查，防止 tab 元素不存在时报错
    if (tabElement && !tabElement.classList.contains('active')) {
        const tabButtons = document.getElementsByClassName("tab-button");
        for(let btn of tabButtons) {
            if(btn.onclick && btn.onclick.toString().includes(tabId)){
                btn.click();
                break;
            }
        }
    }
    
    // 【新增】同步 window 全局变量
    window.currentSelectedLeader = currentSelectedLeader;
    window.currentSelectedLeaderCategory = currentSelectedLeaderCategory;
}

function scrollGrid(buttonElement, direction) {
    const scrollContainer = buttonElement.closest('.leader-scroll-container');
    const grid = scrollContainer.querySelector('.leader-grid');
    const firstCard = grid.querySelector('.leader-card');

    let cardWidth = 250;
    if (firstCard) {
         cardWidth = firstCard.offsetWidth;
    }

    const scrollAmount = (cardWidth + parseInt(getComputedStyle(grid).gap || '20px')) * 1.5;

    grid.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth'
    });
}

function updateScrollButtonStates(gridElement) {
    if (!gridElement || !gridElement.closest('.tab-content.active')) {
         const scrollContainerInactive = gridElement.closest('.leader-scroll-container');
         if(scrollContainerInactive) {
            const leftBtnInactive = scrollContainerInactive.querySelector('.scroll-button.left');
            const rightBtnInactive = scrollContainerInactive.querySelector('.scroll-button.right');
            if(leftBtnInactive) leftBtnInactive.style.display = 'none';
            if(rightBtnInactive) rightBtnInactive.style.display = 'none';
         }
        return;
    }

    const scrollContainer = gridElement.closest('.leader-scroll-container');
    if (!scrollContainer) return;

    const leftButton = scrollContainer.querySelector('.scroll-button.left');
    const rightButton = scrollContainer.querySelector('.scroll-button.right');

    if (!leftButton || !rightButton) return;

    leftButton.style.display = 'flex';
    rightButton.style.display = 'flex';

    const scrollLeft = gridElement.scrollLeft;
    const scrollWidth = gridElement.scrollWidth;
    const clientWidth = gridElement.clientWidth;

    if (scrollWidth <= clientWidth + 1) {
        leftButton.style.display = 'none';
        rightButton.style.display = 'none';
    } else {
        leftButton.disabled = scrollLeft <= 0;
        rightButton.disabled = scrollLeft >= (scrollWidth - clientWidth - 1);
    }
}

function updateAllScrollButtonStates() {
    setTimeout(() => {
        document.querySelectorAll('.leader-grid').forEach(grid => {
            updateScrollButtonStates(grid);
        });
    }, 50);
}

function generateBasePrompt() {
    const question = document.getElementById('userQuestion').value.trim();
    const lang = currentLang;

    if (!window.currentSelectedLeader) {
        alert(translations[lang].alertSelectLeaderFirst);
        return "";
    }
    if (!question) {
        alert(translations[lang].alertEnterQuestion);
        return "";
    }

    const leader = window.currentSelectedLeader;

    // 【新增】统一转换 name 为字符串
    const leaderName = getFieldValue(leader.name, lang) || getFieldValue(leader.name, 'zh-CN') || '';

    // ═══════════════════════════════════════════════════
    // 【修复】兼容普通领袖（多语言对象）和星空专栏虚拟领袖（_raw对象）
    // 逻辑：
    // 1. 优先使用 _raw 对象（星空专栏有，普通领袖无）
    // 2. 回退到 leader.xxx（普通领袖是多语言对象，星空专栏是字符串）
    // 3. getFieldValue 统一处理：字符串直接返回，对象按语言解析
    // ═══════════════════════════════════════════════════

    const contributionObj = leader._rawContribution || leader.contribution;
    const fieldObj = leader._rawField || leader.field;
    const remarksObj = leader._rawRemarks || leader.remarks;

    const leaderContribution = getFieldValue(contributionObj, lang) 
        || getFieldValue(contributionObj, 'zh-CN') 
        || '';

    const leaderField = getFieldValue(fieldObj, lang) 
        || getFieldValue(fieldObj, 'zh-CN') 
        || '';

    const leaderRemarks = remarksObj 
        ? (getFieldValue(remarksObj, lang) || getFieldValue(remarksObj, 'zh-CN') || '')
        : '';

    const remarksText = leaderRemarks || translations[lang].promptBaseRemarksNone;
    const remarksSection = leaderRemarks
        ? translations[lang].promptBaseRemarksWith.replace('${remarks}', leaderRemarks)
        : '';

    const replyInstructionKey = lang === 'zh-CN' ? 'promptReplyInChinese' : 'promptReplyInEnglish';

    // ═══════════════════════════════════════════════════
    // 【判断】是否为星空专栏卡片（通过全局数组匹配名称）
    // ═══════════════════════════════════════════════════
    const isAngelCard = angelColumnCards.some(card => 
        card.name["zh-CN"] === leaderName || card.name["en"] === leaderName
    );

    // ═══════════════════════════════════════════════════
    // 【构建】思考框架（根据类型选择6条或8条）
    // ═══════════════════════════════════════════════════
    const thinkingFrameworks = isAngelCard ? `
1.  **${translations[lang].promptFirstPrinciplesThinking}**: ${translations[lang].promptFirstPrinciplesDetail}
2.  **${translations[lang].promptDomainExpertise}**: ${translations[lang].promptDomainExpertiseDetail1.replace('${field}', leaderField)} ${translations[lang].promptDomainExpertiseDetail2}
3.  **${translations[lang].promptCorePhilosophyDrivingForce}**: ${translations[lang].promptCorePhilosophyDetail1.replace('${name}', leaderName).replace('${remarksSection}', remarksSection)}
4.  **${translations[lang].promptProblemAnalysis}**: ${translations[lang].promptProblemAnalysisDetail}
5.  **${translations[lang].promptSolutionInsight}**: ${translations[lang].promptSolutionInsightDetail1.replace('${name}', leaderName)} ${translations[lang].promptSolutionInsightDetail2} ${translations[lang].promptSolutionInsightDetail3}
6.  **${translations[lang].promptLanguageStyle}**: ${translations[lang].promptLanguageStyleDetail1.replace('${name}', leaderName)} ${translations[lang].promptLanguageStyleDetail2}
` : `
1.  **${translations[lang].promptFirstPrinciplesThinking}**: ${translations[lang].promptFirstPrinciplesDetail}
2.  **${translations[lang].promptDomainExpertise}**: ${translations[lang].promptDomainExpertiseDetail1.replace('${field}', leaderField)} ${translations[lang].promptDomainExpertiseDetail2}
3.  **${translations[lang].promptCorePhilosophyDrivingForce}**: ${translations[lang].promptCorePhilosophyDetail1.replace('${name}', leaderName).replace('${remarksSection}', remarksSection)}
4.  **${translations[lang].promptProblemAnalysis}**: ${translations[lang].promptProblemAnalysisDetail}
5.  **${translations[lang].promptSolutionInsight}**: ${translations[lang].promptSolutionInsightDetail1.replace('${name}', leaderName)} ${translations[lang].promptSolutionInsightDetail2} ${translations[lang].promptSolutionInsightDetail3}
6.  **${translations[lang].promptCognitiveFriction}**: ${translations[lang].promptCognitiveFrictionDetail1}
7.  **${translations[lang].promptCognitiveFriction}**: ${translations[lang].promptCognitiveFrictionDetail2}
8.  **${translations[lang].promptLanguageStyle}**: ${translations[lang].promptLanguageStyleDetail1.replace('${name}', leaderName)} ${translations[lang].promptLanguageStyleDetail2}
`;

    // ═══════════════════════════════════════════════════
    // 【组装】最终 Prompt（公共部分只写一次）
    // ═══════════════════════════════════════════════════
    return `
${translations[lang].promptBackgroundSetting}
${translations[lang].promptYouAre} ${leaderName}. ${translations[lang].promptBasedOnPublicContributions}

${leaderName}${translations[lang].promptCoreInfoFor}
- ${translations[lang].promptMainContributions} ${leaderContribution}
- ${translations[lang].promptExpertise} ${leaderField}
- ${translations[lang].promptKeyRemarksFeatures} ${remarksText}

${translations[lang].promptThinkingFrameworkGuidance.replace('${name}', leaderName)}
${thinkingFrameworks}

${translations[lang].promptUserQuestion}
"${question}"

${translations[lang].promptAs} ${leaderName}, ${translations[lang][replyInstructionKey]}
`;
}

// --- 新增：控制 Prompt 区域折叠与展开 ---
function togglePromptCollapse() {
    const content = document.getElementById('prompt-collapsible-content');
    const icon = document.getElementById('prompt-toggle-icon');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        icon.classList.add('icon-rotated'); // 旋转箭头
    } else {
        content.style.display = 'none';
        icon.classList.remove('icon-rotated'); // 恢复箭头
    }
}


async function getAIResponse() {
    const promptText = document.getElementById('generatedPromptText').value.trim();

    if (!promptText) {
        alert(translations[currentLang].alertNoPrompt);
        return;
    }

    const apiBaseUrl = apiEndpointSelect.value;
    const apiKey = apiKeyInput.value;
    const modelWithSuffix = apiModelSelect.value; // 这是带后缀的名字，如 gemini-1.5-flash@proxy
    // 【新增这一行】：去掉 @ 符号及其后面的内容，恢复成 Google 认识的真实名称
    const model = modelWithSuffix.split('@')[0]; 

    const aiResponseArea = document.getElementById('ai-response-area');
    const aiResponseTextElement = document.getElementById('aiResponseText');
    const getAIResponseButton = document.getElementById('getAIResponseButton');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (!apiBaseUrl || !apiKey || !model) {
        alert(translations[currentLang].alertApiSettingsIncomplete);
        return;
    }

    // 1. 预设 Header
    const headers = { 'Content-Type': 'application/json' };
    const isGeminiModel = model.toLowerCase().includes("gemini");

    //修改 getAIResponse() 中的 Qwen 判断逻辑
    const isQwenModel = apiBaseUrl === "https://qwenapi.aivibeinvest.com";

    // 判断是否为 Qwen 模型（通过 endpoint 或 model 名）
    //const isQwenModel = apiBaseUrl.includes("dashscope.aliyuncs.com") || 
    //                model.startsWith("qwen-");
 
    // ═══════════════════════════════════════════════
    // 【星语上下文注入】与 Prompt 完全解耦
    // ═══════════════════════════════════════════════
    const ctxMessages = (window.starContext && window.starContext.getAll().length > 0)
      ? window.starContext.getContextMessages()
      : [];
    const ctxSystemContent = ctxMessages.length > 0 ? ctxMessages[0].content : '';

    // ═══════════════════════════════════════════════
    // 【星际领航员模式】判断
    // ═══════════════════════════════════════════════
    const isNavigatorMode = window.currentSelectedLeader?.id === 'interstellar_navigator' 
                         || window.currentSelectedLeader?.id === 'intrastellar_navigator';

    // ═══════════════════════════════════════════════
    // 【星空专栏融合模式】判断 —— 新增
    // ═══════════════════════════════════════════════
    const isStarryFusionMode = window.currentSelectedLeader?._isAngelCard === true 
                            && window.currentSelectedLeader?._cardType === 'fusion';

    // ═══════════════════════════════════════════════
    // 【系统指令合并】上下文 + 领航员指令 + 融合体指令（可叠加）
    // ═══════════════════════════════════════════════
    let finalSystemContent = '';
    if (ctxSystemContent) finalSystemContent += ctxSystemContent + '\n\n';
    
    if (isNavigatorMode) {
        if (window.currentSelectedLeader?.id === 'interstellar_navigator') {
            finalSystemContent += buildNavigatorSystemPrompt(currentLang);
        } else {
            finalSystemContent += buildIntraStellarSystemPrompt(window.currentSelectedLeaderCategory, currentLang);
        }
    } else if (isStarryFusionMode) {
        // 直接传 virtualLeader，函数内部兼容处理
        finalSystemContent += buildFusionSystemPrompt(window.currentSelectedLeader, currentLang);
    }
    
    finalSystemContent = finalSystemContent.trim();

    // 2. 构造 URL
    let fullApiUrl;
    if (isGeminiModel) {
        const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        fullApiUrl = `${baseUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`;
    } else if (isQwenModel) {  // DashScope Qwen 的专属路径        
        // 使用你的自定义代理，路径由 Worker 自动拼接
        // 为了代理环境下可以执行所以固定赋值可以访问的地址
        const baseUrl = "/api/qwenproxy"
        //const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        
        fullApiUrl = `${baseUrl}/api/v1/services/aigc/text-generation/generation`;
        
        // 【关键修改】使用 X-API-Key 而不是 Authorization
        headers['X-API-Key'] = apiKey; // ← 不要加 Bearer
        
        // 可选：如果你的 Worker 需要 Content-Type（通常需要）
        headers['Content-Type'] = 'application/json';
        
        // 注意：X-DashScope-Async 不再需要，因为你的 Worker 是通用代理
        // 如果 DashScope 后端仍需要，可保留；否则建议移除
        // headers['X-DashScope-Async'] = 'disable'; // 删除或注释掉
    } else {
        fullApiUrl = (apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl) + "/v1/chat/completions";
        // 非 Gemini 模型需要在 Header 里传 Key
        headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // 3. 构造 Body
    let requestBody;
    if (isGeminiModel) {
        const contents = [];
        
        if (isNavigatorMode) {
            // 领航员模式：合并 system 内容 + 用户原始问题
            const userQuestion = document.getElementById('userQuestion').value.trim();
            const geminiUserContent = finalSystemContent 
                ? finalSystemContent + "\n\n用户问题：" + userQuestion
                : userQuestion;
            contents.push({ role: "user", parts: [{ text: geminiUserContent }] });
        } else {
            // 普通模式：原有逻辑
            if (finalSystemContent) {
                contents.push({ role: "user", parts: [{ text: finalSystemContent }] });
            }
            contents.push({ role: "user", parts: [{ text: promptText }] });
        }
        
        requestBody = {
            contents: contents,
            generationConfig: { temperature: 0.7 }
        };
    } else if (isQwenModel) {
        const messages = [];
        
        if (finalSystemContent) {
            messages.push({ role: "system", content: finalSystemContent });
        }
        
        messages.push({ 
            role: "user", 
            content: isNavigatorMode 
                ? document.getElementById('userQuestion').value.trim() 
                : promptText 
        });
        
        requestBody = {
            model: model,
            input: { messages: messages },
            parameters: {
                temperature: 0.7,
                // 【关键】启用代搜索插件
                // 【关键】plugins 必须是对象，不是数组
                plugins: {
                    web_search: {}  // 启用网络搜索插件
                },
                // 加上这一行！关键！
                function_call: "auto"
            }
        };
    } else {
        // OpenAI 兼容格式
        const messages = [];
        
        if (finalSystemContent) {
            messages.push({ role: "system", content: finalSystemContent });
        }
        
        messages.push({ 
            role: "user", 
            content: isNavigatorMode 
                ? document.getElementById('userQuestion').value.trim() 
                : promptText 
        });
        
        requestBody = {
            model: model,
            messages: messages,
            temperature: 0.7,
        };
    }

    // UI 状态更新
    aiResponseTextElement.textContent = ''; 
    aiResponseArea.style.display = 'block';
    loadingIndicator.style.display = 'inline-block';
    getAIResponseButton.disabled = true;

    try {
        const response = await fetch(fullApiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(`API Error: ${response.status} - ${errorData.error?.message || errorData.detail || 'Unknown error'}`);
        }
        
        const data = await response.json();
        // 【修正 1】先定义变量，确保用来存储原始文本
        let rawContent = "";
        if (isGeminiModel) {
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                // 【修正 2】先赋值给变量，而不是直接操作 DOM
                rawContent = data.candidates[0].content.parts[0].text.trim();
            } else {
                throw new Error("Gemini 返回数据结构异常");
            }
        } else if (isQwenModel) {
            // Qwen 响应解析
            if (data.output && data.output.text) {
                rawContent = data.output.text.trim();
            } else {
                console.error("Qwen response:", data);
                throw new Error("Qwen 返回数据结构异常或配额不足");
            }
        } else {
            if (data.choices && data.choices[0]?.message?.content) {
                // 【修正 2】同上
                rawContent = data.choices[0].message.content.trim();
            } else {
                throw new Error("API 返回数据结构异常");
            }
        } 

        // 【修正 3】现在 rawContent 有值了，把它存入 dataset
        aiResponseTextElement.dataset.raw = rawContent;

        // 【修正 4】主界面显示：如果主界面也想支持 Markdown，可以在这里也用 marked.parse(rawContent)
        // 这里为了保持和你原逻辑一致（可能主界面只需要简单显示），我们保留直接赋值，或者简单的换行处理
        // 建议：如果主界面也想好看，也可以变成 aiResponseTextElement.innerHTML = marked.parse(rawContent);    
        aiResponseTextElement.innerHTML = rawContent.replace(/\n/g, "<br>");
        
        // --- [新增]画布保存到对话历史 ---
        // 1. 获取纯净的用户问题 (不带Prompt指令)
        const rawUserQuestion = document.getElementById('userQuestion').value.trim();
    
        // 2. 准备专家的元数据 (防止当前没选人报错)
        const leaderMeta = currentSelectedLeader ? {
            name: getFieldValue(currentSelectedLeader.name, currentLang) 
                || getFieldValue(currentSelectedLeader.name, 'zh-CN') 
                || 'Expert',
            field: getFieldValue(currentSelectedLeader.field, currentLang) 
                || getFieldValue(currentSelectedLeader.field, 'zh-CN') 
                || 'TCM Diagnostics',
            contribution: getFieldValue(currentSelectedLeader.contribution, currentLang) 
                || getFieldValue(currentSelectedLeader.contribution, 'zh-CN') 
                || ''
        } : { name: 'Expert', field: 'TCM Diagnostics', contribution: '' };
    
        // 3. 存入历史 - 用户提问
        conversationHistory.push({
            id: Date.now() + '_user',
            role: 'user',
            text: rawUserQuestion || "（用户仅生成了提示词，未填写问题）", // 兜底
            leaderInfo: null, // 用户不需要leader信息
            timestamp: new Date()
        });
        saveCanvasSession();  // ← 追加这行
        
        // 4. 存入历史 - AI回答
        conversationHistory.push({
            id: Date.now() + '_ai',
            role: 'ai',
            text: rawContent, 
            leaderInfo: leaderMeta, // 保存这一刻的专家状态
            timestamp: new Date()
        });
        saveCanvasSession();  // ← 追加这行
        
        // 如果画布当前是打开的，实时刷新
        if(isCanvasModeOpen) {
            renderDialogueCanvas();
        }
        
        // 数学公式渲染
        if (window.MathJax) {
            MathJax.typesetPromise([aiResponseTextElement]).catch(err => console.error('MathJax error:', err));
        }

    } catch (error) {
        console.error('Error calling API:', error);
        aiResponseTextElement.textContent = `发生错误: ${error.message}`;
    } finally {
        loadingIndicator.style.display = 'none';
        getAIResponseButton.disabled = false;
    }
}


async function copyContentToClipboard() {
    const aiResponseArea = document.getElementById('ai-response-area');
    const aiResponseTextElement = document.getElementById('aiResponseText');
    const promptDisplayArea = document.getElementById('prompt-display-area');
    const generatedPromptTextElement = document.getElementById('generatedPromptText');

    let textToCopy = '';
    let contentTypeKey = '';

    if (aiResponseArea.style.display !== 'none' && aiResponseTextElement.textContent.trim()) {
        textToCopy = aiResponseTextElement.textContent.trim();
        contentTypeKey = 'contentTypeAiResponse';
    }
    else if (promptDisplayArea.style.display !== 'none' && generatedPromptTextElement.value.trim()) {
        textToCopy = generatedPromptTextElement.value.trim();
        contentTypeKey = 'contentTypePrompt';
    }

    if (textToCopy) {
        try {
            await navigator.clipboard.writeText(textToCopy);
            alert(`${translations[currentLang][contentTypeKey]} ${translations[currentLang].copiedToClipboard}`);
        } catch (err) {
            console.error('Copy failed: ', err);
            alert(`${translations[currentLang].copyFailed}${err.message}.${translations[currentLang].copyFailedHint}`);
        }
    } else {
        alert(translations[currentLang].nothingToCopy);
    }
}

// --- 新增功能：合并拷贝用户问题和AI回答 ---
function copyConversationToClipboard() {
    // 1. 获取内容
    // 优先获取生成的 Prompt，如果没有则获取用户输入的原始问题
    const generatedPrompt = document.getElementById('generatedPromptText').value;
    const userQuestion = document.getElementById('userQuestion').value;
    const finalQuestion = generatedPrompt ? generatedPrompt : userQuestion;
    
    // 获取 AI 回复内容 (innerText 获取纯文本)
    const aiResponse = document.getElementById('aiResponseText').innerText;

    // 2. 检查是否有内容
    if (!finalQuestion && !aiResponse) {
        // 如果没有任何内容，可以在这里处理，或者直接返回
        return; 
    }

    // 3. 格式化合并文本
    const clipboardText = `【问题 / Question】:\n${finalQuestion}\n\n【专家答复 / Expert Answer】:\n${aiResponse}`;

    // 4. 写入剪贴板
    navigator.clipboard.writeText(clipboardText).then(() => {
        // 5. 获取当前的成功提示语 (支持 i18n)
        // 假设你有一个全局的 translations 对象存储了所有翻译
        // 或者我们可以直接通过一个隐藏元素或者手动判断来获取文本
        
        let successMsg = "已拷贝到粘贴板！"; // 默认中文
        
        // 尝试从翻译对象中获取 (假设 locale.js 定义了 translations 变量和 currentLanguage 变量)
        if (typeof translations !== 'undefined' && typeof currentLanguage !== 'undefined') {
            if (translations[currentLanguage] && translations[currentLanguage]['msgCopySuccess']) {
                successMsg = translations[currentLanguage]['msgCopySuccess'];
            }
        } else {
             // 简单的回退机制：如果检测到 html lang 不是 zh-CN，则显示英文
             const lang = document.documentElement.lang || 'zh-CN';
             if (lang !== 'zh-CN') {
                 successMsg = "Merged Copy [Question] & [Expert Answer] to Clipboard!";
             }
        }
        alert(successMsg);
    }).catch(err => {
        console.error('无法拷贝文本: ', err);
    });
}

const endpointModelMap = {
    "https://api.deepseek.com": [
        //{ value: "deepseek-chat", labelKey: "modelDeepSeekV3" }
        { value: "deepseek-v4-flash", labelKey: "modelDeepSeekV4" }
    ],
    // 新增：你的自定义 Cloudflare Gemin代理接入点
    "https://geminiapi.aivibeinvest.com": [
        { value: "gemini-2.5-flash@proxy", labelKey: "modelGeminiFlash" },
    ],
    "https://generativelanguage.googleapis.com": [
        { value: "gemini-2.5-flash", labelKey: "modelGeminiFlash" }
    ],
    "https://api.openai.com": [
        { value: "gpt-4o-mini", labelKey: "modelGpt4oMini" }
    ],
    // 自定义 Qwen 代理（BYOK 模式）<- 新增：阿里云 DashScope - Qwen 系列
    "https://qwenapi.aivibeinvest.com": [
        { value: "qwen-max", labelKey: "modelQwenMax" },
        { value: "qwen-plus", labelKey: "modelQwenPlus" }
    ]
};

function populateEndpointSelect(selectedEndpoint = null) {
    apiEndpointSelect.innerHTML = ""; // Clear existing options
    let hasDefaultEndpoint = false;

    // Add a default "Select an endpoint" option if no specific endpoint is passed initially
    if (!selectedEndpoint) {
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = translations[currentLang].selectApiEndpoint || "选择一个接入点";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        apiEndpointSelect.appendChild(defaultOption);
    }

    for (const ep in endpointModelMap) {
        const option = document.createElement('option');
        option.value = ep;
        option.textContent = ep;
        if (ep === selectedEndpoint) {
            option.selected = true;
            hasDefaultEndpoint = true;
        }
        apiEndpointSelect.appendChild(option);
    }

    // If selectedEndpoint was provided but not found, or no default,
    // ensure a valid option is selected or the default prompt is shown.
    if (selectedEndpoint && !hasDefaultEndpoint && apiEndpointSelect.options.length > 0) {
        apiEndpointSelect.value = selectedEndpoint; // Try to set it even if not explicitly added, might exist.
        if (apiEndpointSelect.value !== selectedEndpoint) { // If it didn't set, fallback
            apiEndpointSelect.selectedIndex = 0;
            // If the first option is the "Select an endpoint" prompt, then set its value to empty
            if (apiEndpointSelect.options[0].value === "") {
                apiEndpointSelect.value = "";
            }
        }
    }
}


function updateModelSelectByEndpoint(endpoint, selectedModelValue = null) {
    apiModelSelect.innerHTML = "";
    apiModelSelect.disabled = true;

    const modelsForEndpoint = endpointModelMap[endpoint];

    if (!endpoint || !modelsForEndpoint || modelsForEndpoint.length === 0) {
        const noModelsOption = document.createElement('option');
        noModelsOption.value = "";
        noModelsOption.textContent = translations[currentLang].noModelsForEndpoint || "该接入点无预设模型";
        noModelsOption.disabled = true;
        noModelsOption.selected = true;
        apiModelSelect.appendChild(noModelsOption);
        apiKeyInput.value = '';
        apiDefaultModelCheck.checked = false;
        return;
    }

    apiModelSelect.disabled = false;
    let hasSelectedModel = false;

    modelsForEndpoint.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = translations[currentLang][model.labelKey] || model.value;
        if (model.value === selectedModelValue) {
            option.selected = true;
            hasSelectedModel = true;
        }
        apiModelSelect.appendChild(option);
    });

    // If selectedModelValue was provided but not found in the list, try to select the first one
    if (selectedModelValue && !hasSelectedModel && apiModelSelect.options.length > 0) {
        apiModelSelect.selectedIndex = 0;
        selectedModelValue = apiModelSelect.value; // Update selectedModelValue to the actually selected one
    } else if (!selectedModelValue && apiModelSelect.options.length > 0) {
        // If no specific model value was requested, just select the first one
        apiModelSelect.selectedIndex = 0;
        selectedModelValue = apiModelSelect.value;
    }

    // Now load the specific settings for the *currently selected* model in the dropdown
    const allSettings = getAllApiSettings();
    const cfg = allSettings[selectedModelValue] || {};

    apiKeyInput.value = cfg.apiKey || '';
    apiDefaultModelCheck.checked = Boolean(cfg.isDefaultModel);
}

function updateEndpointByModel(modelValue) {
    if (!modelValue) {
        // If no model is selected, clear everything
        populateEndpointSelect('');
        updateModelSelectByEndpoint('');
        return;
    }

    const allSettings = getAllApiSettings();
    const specificModelConfig = allSettings[modelValue];

    if (specificModelConfig && specificModelConfig.endpoint) {
        apiEndpointSelect.value = specificModelConfig.endpoint;
        apiKeyInput.value = specificModelConfig.apiKey || '';
        apiDefaultModelCheck.checked = specificModelConfig.isDefaultModel || false;
        updateModelSelectByEndpoint(specificModelConfig.endpoint, modelValue);
    } else {
        // If the selected model doesn't have saved settings,
        // find its endpoint from the hardcoded map and try to populate.
        for (const ep in endpointModelMap) {
            if (endpointModelMap[ep].some(m => m.value === modelValue)) {
                apiEndpointSelect.value = ep;
                // No API key or default status if not saved
                apiKeyInput.value = '';
                apiDefaultModelCheck.checked = false;
                updateModelSelectByEndpoint(ep, modelValue);
                break;
            }
        }
    }
}

function generateAndShowPrompt() {
    currentGeneratedPrompt = generateBasePrompt();
    const promptDisplayArea = document.getElementById('prompt-display-area');
    const promptTextElement = document.getElementById('generatedPromptText');
    const content = document.getElementById('prompt-collapsible-content');
    const icon = document.getElementById('prompt-toggle-icon');

    if (currentGeneratedPrompt) {
        promptTextElement.value = currentGeneratedPrompt.trim();
        
        // 【新增】Admin 权限控制
        const isAdmin = document.body.classList.contains('admin-logged-in');
        
        if (isAdmin) {
            promptDisplayArea.style.display = 'block';
            content.style.display = 'none';
            if (icon) icon.classList.remove('icon-rotated');
        } else {
            // 非 Admin：整个区域由 CSS .admin-only 隐藏
            promptDisplayArea.style.display = 'block';
        }
        
        document.getElementById('ai-response-area').style.display = 'none';
        document.getElementById('aiResponseText').textContent = '';
    } else {
        promptDisplayArea.style.display = 'none';
        promptTextElement.value = '';
    }
    
    // 同步全局变量
    window.currentGeneratedPrompt = currentGeneratedPrompt;
}

function fillSampleQuestion(type) {
    const textarea = document.getElementById('userQuestion');
    const key = 'sampleQuestionText' + type;
    
    const text = translations[currentLang]?.[key] 
              || translations['zh-CN']?.[key] 
              || '';
    
    textarea.value = text;
    
    // 对应图标触发点击反馈动画
    const iconClass = type === 1 ? '.sample-q-icon' 
                    : type === 2 ? '.sample-q-icon2' 
                    : '.sample-q-icon3';
    const icon = document.querySelector(iconClass);
    if (icon) {
        icon.classList.add('active');
        setTimeout(() => icon.classList.remove('active'), 600);
    }
}

// 天使模式逻辑处理函数
function handleAngelMode() {
    // 1. 获取所有参数 (虽然根据需求，只有参数1用于逻辑分支，但这里演示获取所有参数)
    const selectedExpert = currentSelectedLeader; // 参数 (1)
    const userQuestion = document.getElementById('userQuestion').value; // 参数 (2)
    const generatedPrompt = document.getElementById('generatedPromptText').value; // 参数 (3)
    
    // 获取 AI 回复内容 (innerText 获取纯文本)
    const aiResponseTextDiv = document.getElementById('aiResponseText');
    const aiResponse = aiResponseTextDiv ? aiResponseTextDiv.innerText : ''; // 参数 (4)

    // 2. 逻辑判断
    if (!selectedExpert) {
        // 如果参数(1)为空，执行与“生成问题”按钮一样的处理
        // generateAndShowPrompt 函数内部已经包含了 alert("请先选择一位专家") 的逻辑
        // 并且会生成 Prompt 放入文本框
        generateAndShowPrompt(); 
    } else {
        // 如果参数(1)不为空，弹出模态框
        openAngelModeModal();
    }
}

// 3. 模态框控制函数
const angelModeModal = document.getElementById('angelModeModal');

function openAngelModeModal() {
    if (angelModeModal) {
        angelModeModal.style.display = 'block';
    }
}

function closeAngelModeModal() {
    if (angelModeModal) {
        angelModeModal.style.display = 'none';
    }
}

// 点击模态框外部区域也可以关闭
window.addEventListener('click', function(event) {
    if (angelModeModal && event.target == angelModeModal) {
        closeAngelModeModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 0. 加载定制数据
    initCustomNorthStars();
    
    // 1. 【优先】初始化语言设置
    const preferredLang = localStorage.getItem('preferredLang');
    const browserLang = navigator.language || navigator.userLanguage;
    let targetLang = 'zh-CN';

    if (preferredLang && translations[preferredLang]) {
        targetLang = preferredLang;
    } else if (browserLang.startsWith('en') && translations['en']) {
        targetLang = 'en';
    }
    
    window.currentLang = targetLang;
    const langSelect = document.getElementById('languageSelector');
    if (langSelect) langSelect.value = targetLang;

    // 2. 加载 API 设置
    if (typeof loadApiSettings === 'function') {
        loadApiSettings();
    }

    // 3. 设置语言文本
    if (typeof setLanguage === 'function') {
        setLanguage(targetLang);
    }

    // 4. 【关键】处理 Tab 状态
    if (typeof openTab === 'function') {
        openTab(null, 'TCM'); // 默认打开 TCM Tab
    }
    
    const firstTabButton = document.querySelector('.tab-button[onclick*="TCM"]');
    if (firstTabButton && !document.querySelector('.tab-button.active')) {
         firstTabButton.classList.add('active');
    }

    // 5. 【核心修复】初始化 UI 风格与数据渲染
    initUIStyle(); 

    // 6. 绑定搜索框与按钮事件
    bindModernEvents();

    // 7. 【致命冲突修复】仅在"非现代模式"下调用旧的 populateLeaders
    const currentStyle = localStorage.getItem('northstarUIStyle');
    if (currentStyle !== 'modern' && typeof populateLeaders === 'function') {
        console.log('[Init] 传统模式，执行 populateLeaders');
        populateLeaders();
    } else {
        console.log('[Init] 现代模式，跳过 populateLeaders，由 switchUIStyle 接管渲染');
    }

    // 【新增】初始化 admin UI 状态
    if (typeof updateAdminUI === 'function') {
        updateAdminUI();
    }

    // 8. 绑定 API 下拉框事件
    if (apiEndpointSelect && typeof updateModelSelectByEndpoint === 'function') {
        apiEndpointSelect.addEventListener('change', function() {
            updateModelSelectByEndpoint(this.value);
        });
    }
    
    if (apiModelSelect && typeof updateEndpointByModel === 'function') {
        apiModelSelect.addEventListener('change', function() {
            updateEndpointByModel(this.value);
        });
    }

    // 9. 处理窗口调整
    window.addEventListener('resize', updateAllScrollButtonStates);
});

// 辅助函数：将事件绑定逻辑抽离，避免闭包重复引用
function bindModernEvents() {
    document.querySelectorAll('.modern-search-input').forEach(el => {
        // 移除旧监听器比较麻烦，这里利用 dataset 标记防止重复绑定
        if (el.dataset.bound) return;
        el.addEventListener('input', (e) => {
            filterModernGrid(e.target);
        });
        el.dataset.bound = 'true';
    });

    document.querySelectorAll('.search-icon').forEach(el => {
        if (el.dataset.bound) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleModernSearch(el);
        });
        el.dataset.bound = 'true';
    });
}


/* --- 音乐播放控制逻辑 --- */
// 1. 主按钮点击：播放/暂停指定音乐
function toggleMusic(btnElement) {
    var audio = document.getElementById("bgMusic");
    
    // 检查 audio 元素是否存在
    if (!audio) return;

    if (audio.paused) {
        audio.play().then(() => {
            // 播放成功，添加旋转动画类
            btnElement.classList.add("music-playing");
        }).catch(error => {
            console.error("播放失败 (可能是浏览器策略限制自动播放):", error);
        });
    } else {
        audio.pause();
        // 暂停，移除旋转动画类
        btnElement.classList.remove("music-playing");
    }
}

// 2. 小标记点击：随机播放 (未来功能)
function playRandomMusic(event) {
    // 关键：阻止事件冒泡！
    // 这样点击小圆点时，不会触发父级按钮的 toggleMusic
    event.stopPropagation(); 
    
    console.log("未来功能：随机播放触发");
    
    // 这里留作未来扩展：
    // var songs = ['song1.mp3', 'song2.mp3', ...];
    // var randomSong = songs[Math.floor(Math.random() * songs.length)];
    // var audio = document.getElementById("bgMusic");
    // audio.src = randomSong;
    // audio.play();
}

// 设置模态框内部标签页切换
function switchSettingsTab(event, tabId) {
    // 阻止默认事件
    event.preventDefault();

    // 隐藏所有设置标签页内容
    const tabContents = document.querySelectorAll('.settings-tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });

    // 移除所有按钮的 active 状态
    const tabBtns = document.querySelectorAll('.settings-tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示目标标签页，激活对应按钮
    document.getElementById(tabId).style.display = 'block';
    event.currentTarget.classList.add('active');
}


/* --- [新增] 优雅阅读模式逻辑 --- */
// 【新增辅助函数】安全解析 Markdown，保护数学公式不被 marked.js 破坏
function renderMarkdownWithMath(rawText) {
    if (!rawText) return '';

    // 1. 临时占位符数组
    const mathBlocks = [];
    
    // 2. 正则匹配 LaTeX 公式：
    // 匹配 $$...$$, \[...\], \(...\), $...$
    // 注意：这就要求 AI 返回标准的 LaTeX 格式
    const protectMath = (text) => {
        return text.replace(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\(.*?\\\)|(?<!\\)\$.*?(?<!\\)\$)/gm, (match) => {
            mathBlocks.push(match); // 存入数组
            return `__MATH_BLOCK_${mathBlocks.length - 1}__`; // 用占位符替换
        });
    };

    // 3. 恢复公式
    const restoreMath = (text) => {
        return text.replace(/__MATH_BLOCK_(\d+)__/g, (match, index) => {
            return mathBlocks[index];
        });
    };

    // 4. 执行流程
    let protectedText = protectMath(rawText);
    
    let html = '';
    // 如果引入了 marked.js 则使用，否则简单换行
    if (typeof marked !== 'undefined') {
        html = marked.parse(protectedText);
    } else {
        html = protectedText.replace(/\n/g, '<br>');
    }

    // 5. 恢复公式并返回
    return restoreMath(html);
}

function parseMarkdownWithMath(rawText) {
    if (!rawText) return "";

    // 1. 存储公式的临时数组
    const mathSegments = [];
    
    // 2. 保护公式：将 LaTeX 内容替换为占位符
    // 使用 @@ 而不是 __，避免被 marked 解析为粗体/斜体
    const protectedText = rawText.replace(
        /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\(.*?\\\)|(?<!\\)\$.*?(?<!\\)\$)/gm, 
        (match) => {
            mathSegments.push(match);
            // 【修改点1】使用 @@ 包裹，或者其他不会触发 Markdown 渲染的字符
            return `@@MATH_PLACEHOLDER_${mathSegments.length - 1}@@`;
        }
    );

    // 3. Markdown 转换
    let htmlContent = "";
    if (typeof marked !== 'undefined') {
        htmlContent = marked.parse(protectedText);
    } else {
        htmlContent = protectedText.replace(/\n/g, "<br>");
    }

    // 4. 还原公式
    // 【修改点2】正则匹配 @@...@@
    const finalHtml = htmlContent.replace(/@@MATH_PLACEHOLDER_(\d+)@@/g, (match, index) => {
        // 【优化】防止公式中的 < > 等符号被浏览器当作 HTML 标签解析错误
        // 如果你的公式里包含 a < b，直接 innerHTML 会出问题
        return escapeHtml(mathSegments[index]); 
    });

    return finalHtml;
}

// 辅助函数：防止 LaTeX 中的 < 和 > 破坏 HTML 结构
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function openElegantMode() {
    if (isElegantModeOpen) return;
    
    const userQuestionEl = document.getElementById('userQuestion');
    const aiResponseEl = document.getElementById('aiResponseText');
    const elegantQuestionBox = document.getElementById('elegantQuestionText');
    const elegantAnswerBox = document.getElementById('elegantAnswerText');
    const modal = document.getElementById('elegantModal');

    const rawAiContent = aiResponseEl.dataset.raw || aiResponseEl.innerText;
    if (!rawAiContent || rawAiContent.trim() === "") {
        alert(translations[currentLang].alertNoNorthStarResponse || "✦ 请先获取专家的回复，才能开启专家阅读模式。");
        return;
    }

    elegantQuestionBox.innerText = userQuestionEl?.value || "「 探寻专家视角的深度洞见 」";
    
    // 【新增】在解析前，先给容器加上准备流动的 class
    elegantAnswerBox.classList.add('flowing-ready');
    elegantAnswerBox.innerHTML = parseMarkdownWithMath(rawAiContent);

    modal.style.display = 'flex'; 
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            isElegantModeOpen = true;
        });
    });

    // 异步且安全地触发 MathJax 渲染
    if (window.MathJax && window.MathJax.typesetPromise) {
        try {
            await MathJax.typesetPromise([elegantAnswerBox]);
        } catch (err) {
            console.warn('✦ 公式渲染出现微小扰动:', err);
        }
    }
    
    // 【新增】确保 MathJax 渲染完成后，再触发文字流动
    const scrollContainer = document.querySelector('.elegant-content');
    if (scrollContainer) {
        if (!scrollContainer.id) scrollContainer.id = 'elegantContentArea';
        triggerTextFlowEffect('elegantAnswerText', 'elegantContentArea');
    }
}

function closeElegantMode() {
    if (!isElegantModeOpen) return;
    
    const modal = document.getElementById('elegantModal');
    modal.classList.remove('show');
    
    // 监听 CSS 动画结束事件，彻底替代硬编码的 setTimeout，更优雅且不卡顿
    modal.addEventListener('transitionend', function handler() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // 恢复默认滚动
        modal.removeEventListener('transitionend', handler);
        isElegantModeOpen = false;
    }, { once: true });
}

// 7. 事件监听：点击模态框背景关闭
document.getElementById('elegantModal').addEventListener('click', function(e) {
    // 如果点击的是背景（elegantModal）或 container 外部区域，则关闭
    if (e.target === this) {
        closeElegantMode();
    }
});

// 8. [新增] 键盘无障碍交互：加入 ESC 键丝滑退出（符合高级 UX 直觉）
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isElegantModeOpen) {
        closeElegantMode();
    }
});
