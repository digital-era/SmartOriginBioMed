// modern-filter.js
// 现代风格相关完整逻辑：胶囊动态生成、过滤动画、风格切换
// 【增强版】补充水晶球、转盘、定制专家等功能，修复类名控制BUG

// 防抖工具函数
function debounce(fn, delay = 250) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ──────────────────────────────────────────────
// 1. 获取分类数据（增强版：合并自定义数据）
// ──────────────────────────────────────────────
function getMastersByCategory(category) {
    // 【修复】短代码转长代码，统一映射
    const categoryIdMap = {
        'TCM': 'TCM',
        'WM': 'WM',
        'MO': 'MultiOmics',
        'NL': 'NeuralLink',
        'AIDis': 'AIDrugDiscovery',
        'AIHC': 'AIHealthcare'
    };
    const dataKey = categoryIdMap[category] || category;

    let builtIn = [];
    if (window.allData && allData[dataKey]) {
        builtIn = allData[dataKey] || [];
    } else {
        const map = {
            'TCM': typeof TCMMasters !== 'undefined' ? TCMMasters : [],
            'WM': typeof WMMasters !== 'undefined' ? WMMasters : [],
            'MultiOmics': typeof MultiOmicsMasters !== 'undefined' ? MultiOmicsMasters : [],
            'NeuralLink': typeof NeuralLinkMasters !== 'undefined' ? NeuralLinkMasters : [],
            'AIDrugDiscovery': typeof AIDrugDiscoveryMasters !== 'undefined' ? AIDrugDiscoveryMasters : [],
            'AIHealthcare': typeof AIHealthcareMasters !== 'undefined' ? AIHealthcareMasters : []
        };
        builtIn = map[dataKey] || [];
    }

    // 【新增】合并自定义专家数据
    const custom = window.customAllData?.[dataKey] || [];
    
    return [...builtIn, ...custom];
}

// ──────────────────────────────────────────────
// 2. 从 field 提取关键词 (最终融合版)
// ──────────────────────────────────────────────
function extractCommonFieldKeywords(category, lang) {
    const targetLang = lang || window.currentLang || 'zh-CN';
    const masters = getMastersByCategory(category);
    if (!masters || !masters.length) return [];
    
    const keywordCount = new Map();
    
    masters.forEach(master => {
        let text = '';
        if (master.field && typeof master.field === 'object') {
            text = master.field[targetLang] || master.field['en'] || master.field['zh-CN'] || '';
        } else if (typeof master.field === 'string') {
            text = master.field;
        }

        if (!text) return;        
        
        const parts = text.split(/[()（）\[\]、,，；;./]+/) 
            .map(p => p.trim().replace(/[。.。]+$/, ''))
            .filter(p => p && p.length >= 2 && p.length <= 60);

        parts.forEach(k => {
            if (!/^[\d\s]+$/.test(k)) {
                const keyLower = k.toLowerCase();
                if (!keywordCount.has(keyLower)) {
                    keywordCount.set(keyLower, { text: k, count: 0 });
                }
                keywordCount.get(keyLower).count++;
            }
        });
    });

    return [...keywordCount.values()]
        .sort((a, b) => b.count - a.count || b.text.length - a.text.length)
        .map(item => item.text);
}

// ──────────────────────────────────────────────
// 3. 生成胶囊
// ──────────────────────────────────────────────
function generateChipsForCategory(category, container) {
    if (!container) return;
    container.innerHTML = '';

    const lang = window.currentLang || 'zh-CN';

    const allBtn = document.createElement('button');
    allBtn.className = 'chip active';
    allBtn.dataset.filter = 'all';
    
    let allText = '全部';
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang].all) {
        allText = translations[lang].all;
    } else if (lang === 'en') {
        allText = 'All';
    }
    allBtn.textContent = allText;
    
    allBtn.addEventListener('click', () => filterModernGrid(allBtn, category));
    container.appendChild(allBtn);

    const keywords = extractCommonFieldKeywords(category, lang);
    
    if (keywords.length > 0) {
        keywords.forEach(kw => {
            const btn = document.createElement('button');
            btn.className = 'chip';
            btn.dataset.filter = kw;
            btn.textContent = kw;
            btn.addEventListener('click', () => filterModernGrid(btn, category));
            container.appendChild(btn);
        });
    }
}

// ──────────────────────────────────────────────
// 4. 刷新当前 tab 胶囊
// ──────────────────────────────────────────────
function refreshChipsForActiveTab() {
    const tab = document.querySelector('.tab-content.active');
    if (tab) {
        const container = tab.querySelector('.filter-chips-container');
        generateChipsForCategory(tab.id, container);
    }
}

// ──────────────────────────────────────────────
// 5. 风格切换核心函数（增强版：支持水晶球、转盘、定制专家）
// ──────────────────────────────────────────────
function switchUIStyle(style) {
    style = (style === 'modern') ? 'modern' : 'traditional';
    console.log("switchUIStyle", style);
    
    // 【修复】正确设置全局变量和 body 类名
    window.currentUIStyle = style;
    document.body.classList.toggle('modern-mode', style === 'modern');
    
    localStorage.setItem('northstarUIStyle', style);

    if (style === 'traditional') {
        // 【新增】初始化定制专家数据（传统模式也需要）
        if (typeof initCustomExperts === 'function') {
            initCustomExperts();
        }
        
        // ════════════════════════════════════════
        // 传统模式：对话卡片选择界面
        // ════════════════════════════════════════
        
        // 1. 隐藏水晶球
        const nebulaCrystal = document.getElementById('nebula-crystal');
        if (nebulaCrystal) nebulaCrystal.style.display = 'none';
        
        // 2. 隐藏转盘和左右布局
        const wheel = document.getElementById('wheel-of-destiny');
        if (wheel) wheel.style.display = 'none';
        const layout = document.getElementById('category-layout-container');
        if (layout) layout.style.display = 'none';

        // 3. 恢复标签页
        const tabsBar = document.querySelector('.tabs');
        if (tabsBar) tabsBar.style.display = 'flex';

        // 4. 显示传统容器
        const container = document.querySelector('.container');
        if (container) container.style.display = 'block';
        
        document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
        
        // 5. 设置网格容器
        document.querySelectorAll('.leader-scroll-container').forEach(container => {
            container.style.display = 'flex';
            container.style.overflow = 'hidden';
            const leftBtn = container.querySelector('.scroll-button.left');
            const rightBtn = container.querySelector('.scroll-button.right');
            const grid = container.querySelector('.leader-grid');
            if (leftBtn) leftBtn.style.display = 'block';
            if (rightBtn) rightBtn.style.display = 'block';
            if (grid) {
                grid.style.display = 'flex';
                grid.style.flexWrap = 'nowrap';
                grid.style.justifyContent = 'flex-start';
                grid.style.gap = '20px';
                grid.style.overflowX = 'auto';
                grid.style.scrollbarWidth = 'none';
            }
            if (typeof updateScrollButtonStates === 'function' && grid) {
                updateScrollButtonStates(grid);
            }
        });

        // 6. 为所有 Tab 生成子类胶囊
        document.querySelectorAll('.modern-filter-bar').forEach(bar => {
            bar.style.display = 'flex';
            const tabContent = bar.closest('.tab-content');
            if (tabContent) {
                const chipsContainer = tabContent.querySelector('.filter-chips-container');
                if (chipsContainer && typeof generateChipsForCategory === 'function') {
                    generateChipsForCategory(tabContent.id, chipsContainer);
                }
                if (chipsContainer) {
                    chipsContainer.style.flexWrap = 'nowrap';
                    chipsContainer.style.overflowX = 'auto';
                    chipsContainer.style.scrollbarWidth = 'none';
                    chipsContainer.style.msOverflowStyle = 'none';
                }
            }
        });

        // 7. 激活当前选中的标签
        const activeBtn = document.querySelector('.tab-button.active') || document.querySelector('.tab-button');
        if (activeBtn) {
            const match = activeBtn.getAttribute('onclick').match(/'([^']+)'/);
            if (match) openTab(null, match[1]);
        }

        // 8. 刷新当前网格
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            filterModernGrid(null, activeTab.id);
        }
        
    } else {
        // ════════════════════════════════════════
        // 现代模式：星云水晶球
        // ════════════════════════════════════════
        
        // 1. 隐藏标签页
        const tabsBar = document.querySelector('.tabs');
        if (tabsBar) tabsBar.style.display = 'none';

        // 2. 隐藏传统模式元素
        document.querySelectorAll('.modern-filter-bar').forEach(bar => bar.style.display = 'none');
        document.querySelectorAll('.leader-scroll-container').forEach(container => container.style.display = 'none');
        document.querySelectorAll('.tab-content').forEach(tc => tc.style.display = 'none');
        
        const container = document.querySelector('.container');
        if (container) container.style.display = 'none';

        // 3. 隐藏转盘和左右布局
        const wheel = document.getElementById('wheel-of-destiny');
        if (wheel) wheel.style.display = 'none';
        const layout = document.getElementById('category-layout-container');
        if (layout) layout.style.display = 'none';

        // 4. 【关键】显示水晶球
        const nebulaCrystal = document.getElementById('nebula-crystal');
        if (nebulaCrystal) nebulaCrystal.style.display = 'flex';

        // 5. 初始化水晶球
        if (typeof initNebulaCrystal === 'function') {
            initNebulaCrystal();
        }

        // 【新增】初始化定制专家数据
        if (typeof initCustomExperts === 'function') {
            initCustomExperts();
        }

        // 【修复】：从传统模式切回现代模式时，确保重置显示状态
        const manualSelector = document.getElementById('nebula-manual-selector');
        if (manualSelector) {
            manualSelector.classList.remove('fading-out');
        } else if (typeof renderNebulaManualSelector === 'function') {
            renderNebulaManualSelector();
        }
    }
}

// ──────────────────────────────────────────────
// 6. 初始化恢复上次风格
// ──────────────────────────────────────────────
function initUIStyle() {
    //const saved = localStorage.getItem('northstarUIStyle') || 'traditional';
    const saved = localStorage.getItem('northstarUIStyle') || 'modern';
    const select = document.getElementById('uiStyle');
    if (select) select.value = saved;
    switchUIStyle(saved);
}

// ──────────────────────────────────────────────
// 7. 过滤核心函数（增强版：支持 deselect + 多语言 name）
// ──────────────────────────────────────────────
function filterModernGrid(trigger, category = null) {
    const tab = category ? document.getElementById(category) : document.querySelector('.tab-content.active');
    if (!tab) return;
    const grid = tab.querySelector('.leader-grid');
    if (!grid) return;

    const lang = window.currentLang || 'zh-CN';

    // 1. 确定过滤条件 + 胶囊 UI 状态（【新增】合并处理 deselect）
    let filterVal = 'all';
    if (trigger) {
        if (trigger.tagName === 'INPUT') {
            filterVal = trigger.value.trim();
        } else if (trigger.classList?.contains('chip')) {
            const isAlreadyActive = trigger.classList.contains('active');
            const isAllChip = trigger.dataset?.filter === 'all';
            
            if (isAlreadyActive && !isAllChip) {
                // 【新增】deselect：点击已激活的子类 → 切换到全部
                const allChip = tab.querySelector('.chip[data-filter="all"]');
                if (allChip) {
                    tab.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
                    allChip.classList.add('active');
                    allChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    filterVal = 'all';
                }
            } else {
                // 正常选择：激活当前芯片
                tab.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
                trigger.classList.add('active');
                trigger.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                filterVal = trigger.dataset.filter;
            }
        }
    }

    // 2. 获取并过滤数据
    const masters = getMastersByCategory(tab.id);
    let filtered = masters;

    if (filterVal !== 'all' && filterVal) {
        const q = filterVal.toLowerCase();
        filtered = masters.filter(m => {
            const getName = (obj) => (typeof obj === 'string' ? obj : (obj[lang] || obj['en'] || obj['zh-CN'] || ''));
            const searchStr = [
                getName(m.name),           // 【修复】使用 getName 解析多语言
                getName(m.contribution), 
                getName(m.field), 
                getName(m.remarks)
            ].join(' ').toLowerCase();
            return searchStr.includes(q);
        });
    }

    // 3. 开始渲染
    grid.innerHTML = '';

    if (filtered.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'no-result-message';
        const t = translations[lang] || translations['en'] || {};
        msg.textContent = t.noMatchingLeader || 'No matching results';
        grid.appendChild(msg);
    } else {
        filtered.forEach((leader, i) => {
            const card = document.createElement('div');
            card.className = 'leader-card stagger-animate';
            card.dataset.id = leader.id;
            card.style.setProperty('--i', i);

            const getText = (fieldObj) => {
                if (!fieldObj) return '';
                if (typeof fieldObj === 'string') return fieldObj;
                return fieldObj[lang] || fieldObj['en'] || fieldObj['zh-CN'] || '';
            };

            const txtContrib = getText(leader.contribution);
            const txtField = getText(leader.field);
            const txtRemarks = getText(leader.remarks);
            
            const t = translations[lang] || translations['zh-CN'] || {};
            const lblContrib = t.labelContribution || 'Contribution';
            const lblField = t.labelField || 'Field';
            const lblRemarks = t.labelRemarks || 'Remarks';

            card.innerHTML = `
                <h3>${getText(leader.name)}</h3>     <!-- 【修复】多语言 name 解析 -->
                <p><strong>${lblContrib}</strong> ${txtContrib}</p>
                <p class="field"><strong>${lblField}</strong> ${txtField}</p>
                ${txtRemarks ? `<p class="remarks"><strong>${lblRemarks}</strong> ${txtRemarks}</p>` : ''}
            `;
            
            // 单选互斥逻辑
            card.onclick = function() {
                grid.querySelectorAll('.leader-card').forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                if(typeof selectLeader === 'function') {
                    selectLeader(leader, tab.id, this);
                }
            };

            grid.appendChild(card);
        });
    }
    
    // 4. 更新滚动按钮状态（双保险）
    requestAnimationFrame(() => {
        if(typeof updateScrollButtonStates === 'function') updateScrollButtonStates(grid);
    });

    setTimeout(() => {
        if(typeof updateScrollButtonStates === 'function') updateScrollButtonStates(grid);
    }, 500);
}


// ──────────────────────────────────────────────
// 8. 其他辅助函数
// ──────────────────────────────────────────────
function updateModernFilterBarVisibility() {
    const isModern = localStorage.getItem('northstarUIStyle') === 'modern';
    document.querySelectorAll('.modern-filter-bar').forEach(el => {
        el.style.display = isModern ? 'flex' : 'none';
    });
    if (isModern) refreshChipsForActiveTab();
}

// 搜索框切换
function toggleModernSearch(iconElement) {
    const wrapper = iconElement.closest('.modern-search-wrapper');
    if (!wrapper) return;

    const input = wrapper.querySelector('.modern-search-input');
    
    wrapper.classList.toggle('search-active');
    const isActive = wrapper.classList.contains('search-active');

    console.log('[DEBUG] 搜索框状态:', isActive ? '展开' : '收起');

    if (isActive) {
        if (input) input.focus();
    } else {
        if (input) {
            input.blur();
        }
    }
}

function onTabChanged() {
    if (localStorage.getItem('northstarUIStyle') === 'modern') {
        refreshChipsForActiveTab();
        const tab = document.querySelector('.tab-content.active');
        if (tab) {
            const allChip = tab.querySelector('.chip[data-filter="all"]');
            if (allChip) filterModernGrid(allChip);
        }
    }
}

function onLanguageChanged() {
    const langSelect = document.getElementById('languageSelector');
    if (langSelect) window.currentLang = langSelect.value;
    
    console.log('[DEBUG] 语言切换为:', window.currentLang);

    const currentStyle = localStorage.getItem('northstarUIStyle');
    if (currentStyle === 'modern') {
        const activeTab = document.querySelector('.tab-content.active');
        if (!activeTab) return;

        refreshChipsForActiveTab();

        setTimeout(() => {
            const allBtn = activeTab.querySelector('.chip[data-filter="all"]');
            if (allBtn) {
                allBtn.click();
            } else {
                filterModernGrid({ dataset: { filter: 'all' } }, activeTab.id);
            }
        }, 50);
    } else {
        // 【新增】传统模式下也要重新生成胶囊
        if (typeof refreshChipsForActiveTab === 'function') {
            refreshChipsForActiveTab();
        }
        if (typeof populateLeaders === 'function') populateLeaders();
    }
}

// ──────────────────────────────────────────────
// 初始化
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initUIStyle();
    
    document.querySelectorAll('.modern-search-input').forEach(el => {
        if (!el.dataset.bound) {
            el.addEventListener('input', (e) => filterModernGrid(e.target));
            el.dataset.bound = 'true';
        }
    });

    document.querySelectorAll('.search-icon').forEach(el => {
        if (!el.dataset.bound) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                toggleModernSearch(e.target);
            });
            el.dataset.bound = 'true';
        }
    });
});

// 暴露全局接口
window.switchUIStyle = switchUIStyle;
window.onTabChanged = onTabChanged;
window.onLanguageChanged = onLanguageChanged;
window.toggleModernSearch = toggleModernSearch;
window.filterModernGrid = filterModernGrid;
