// ═══════════════════════════════════════════════
// 用户定制北极星 - 全球化文本
// ═══════════════════════════════════════════════
const customExpertexts = {
    // 四角图标 tooltip
    addNorthStar: {
        'zh-CN': '添加专家',
        'en': 'Add Expert'
    },
    editNorthStar: {
        'zh-CN': '修改专家',
        'en': 'Edit Expert'
    },
    deleteNorthStar: {
        'zh-CN': '删除专家',
        'en': 'Delete Expert'
    },
    importNorthStars: {
        'zh-CN': '导入专家',
        'en': 'Import Experts'
    },
    exportNorthStars: {
        'zh-CN': '导出专家',
        'en': 'Export Experts'
    },
    
    // 模态框文本
    modalTitleAdd: {
        'zh-CN': '定制专家',
        'en': 'Customize Expert'
    },
    modalTitleEdit: {
        'zh-CN': '编辑专家',
        'en': 'Edit Expert'
    },
    fieldLabel: {
        'zh-CN': '领域',
        'en': 'Field'
    },
    fieldPlaceholder: {
        'zh-CN': '如：中医诊断学、神经学',
        'en': 'e.g. TCM Diagnostics, Neurology'
    },
    nameLabel: {
        'zh-CN': '姓名',
        'en': 'Name'
    },
    contributionLabel: {
        'zh-CN': '贡献',
        'en': 'Contribution'
    },
    remarksLabel: {
        'zh-CN': '评注',
        'en': 'Remarks'
    },
    
    // 提示信息
    deleteConfirm: {
        'zh-CN': '确定要删除这位专家吗？此操作不可恢复。',
        'en': 'Are you sure you want to delete this Expert? This cannot be undone.'
    },
    deleteBuiltIn: {
        'zh-CN': '内置专家不能删除',
        'en': 'Built-in Experts cannot be deleted'
    },
    importConfirm: {
        'zh-CN': '导入将覆盖现有定制专家，确定继续？',
        'en': 'Import will overwrite existing custom experts. Continue?'
    },
    importSuccess: {
        'zh-CN': '导入成功：新增 {added} 位，更新 {updated} 位',
        'en': 'Import success: {added} added, {updated} updated'
    },
    importFailed: {
        'zh-CN': '导入失败：{error}',
        'en': 'Import failed: {error}'
    },
    exportSuccess: {
        'zh-CN': '已导出 {count} 位定制专家',
        'en': 'Exported {count} custom Experts'
    },
    exportEmpty: {
        'zh-CN': '没有可导出的定制北极星',
        'en': 'No custom Experts to export'
    },
    saveSuccess: {
        'zh-CN': '专家已保存',
        'en': 'Expert saved'
    },
    nameRequired: {
        'zh-CN': '请填写姓名',
        'en': 'Please enter a name'
    }
};


// 反向映射表（内部键名 → 外部键名），运行时构建
const TAB_ID_TO_CATEGORY = Object.fromEntries(
    Object.entries(CATEGORY_TO_TAB_ID).map(([k, v]) => [v, k])
);

// ═══════════════════════════════════════════════
// 辅助函数：外部键名 → 内部键名
// ═══════════════════════════════════════════════
function toInternalCategory(externalCategory) {
    return CATEGORY_TO_TAB_ID[externalCategory] || externalCategory;
}

// ═══════════════════════════════════════════════
// 辅助函数：内部键名 → 外部键名
// ═══════════════════════════════════════════════
function toExternalCategory(internalCategory) {
    return TAB_ID_TO_CATEGORY[internalCategory] || internalCategory;
}

// ═══════════════════════════════════════════════
// 全局定制数据存储
// ═══════════════════════════════════════════════
window.customAllData = {};  // 格式与 allData 一致: { category: [leader, ...] }

const CUSTOM_NS_PERSISTENCE = {
    STORAGE_KEY: 'customNorthStars',
    SCHEMA_VERSION: 1
};

// ═══════════════════════════════════════════════
// 初始化：从 localStorage 加载定制数据
// 【修改】加载时自动将外部键名映射为内部键名
// ═══════════════════════════════════════════════
function initCustomNorthStars() {
    const raw = localStorage.getItem(CUSTOM_NS_PERSISTENCE.STORAGE_KEY);
    if (!raw) {
        window.customAllData = {};
        return;
    }
    
    try {
        const data = JSON.parse(raw);
        if (data._schema === CUSTOM_NS_PERSISTENCE.SCHEMA_VERSION && data.customAllData) {
            // 加载时统一映射为内部键名
            window.customAllData = {};
            for (const [key, leaders] of Object.entries(data.customAllData)) {
                const internalKey = toInternalCategory(key);
                window.customAllData[internalKey] = (leaders || []).map(leader => ({
                    ...leader,
                    _category: internalKey
                }));
            }
            console.log('[CustomNS] Loaded from localStorage:', Object.keys(window.customAllData));
        } else {
            window.customAllData = {};
        }
    } catch (e) {
        console.error('[CustomNS] Parse failed:', e);
        window.customAllData = {};
    }
}

// ═══════════════════════════════════════════════
// 持久化到 localStorage（按领域排序）
// ═══════════════════════════════════════════════
function persistCustomNorthStars() {
    const sortedKeys = Object.keys(window.customAllData).sort();
    const sortedData = {};
    for (const key of sortedKeys) {
        sortedData[key] = [...window.customAllData[key]].sort((a, b) => {
            const nameA = getFieldValue(a.name, 'zh-CN') || '';
            const nameB = getFieldValue(b.name, 'zh-CN') || '';
            return nameA.localeCompare(nameB, 'zh-CN');
        });
    }
    window.customAllData = sortedData;
    
    const payload = {
        _schema: CUSTOM_NS_PERSISTENCE.SCHEMA_VERSION,
        _savedAt: Date.now(),
        customAllData: sortedData
    };
    
    try {
        localStorage.setItem(CUSTOM_NS_PERSISTENCE.STORAGE_KEY, JSON.stringify(payload));
        console.log('[CustomNS] Saved to localStorage');
        return true;
    } catch (e) {
        console.error('[CustomNS] Save failed:', e);
        return false;
    }
}

// ═══════════════════════════════════════════════
// 渲染北极星卡片四角图标
// ═══════════════════════════════════════════════
function renderCustomNorthStarControls(cardContainer, leader, category) {
    const lang = window.currentLang || 'zh-CN';
    const isCustom = leader._isCustom === true;
    
    const corners = document.createElement('div');
    corners.className = 'ns-corners';
    
    const topRightIcon = isCustom 
        ? `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" 
                 stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
           </svg>`
        : `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" 
                 stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
           </svg>`;
    
    let cornersHTML = '';
    
    if (isCustom) {
        cornersHTML += `
        <button class="ns-corner-btn ns-corner-tl" 
                data-action="delete"
                title="${getFieldValue(customExpertexts.deleteNorthStar, lang)}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" 
                 stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        </button>`;
    }
    
    cornersHTML += `
        <button class="ns-corner-btn ns-corner-tr" 
                data-action="${isCustom ? 'edit' : 'add'}"
                title="${getFieldValue(isCustom ? customExpertexts.editNorthStar : customExpertexts.addNorthStar, lang)}">
            ${topRightIcon}
        </button>`;
    
    cornersHTML += `
        <button class="ns-corner-btn ns-corner-bl" 
                data-action="import"
                title="${getFieldValue(customExpertexts.importNorthStars, lang)}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" 
                 stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
        </button>`;
    
    cornersHTML += `
        <button class="ns-corner-btn ns-corner-br" 
                data-action="export"
                title="${getFieldValue(customExpertexts.exportNorthStars, lang)}">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" 
                 stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
        </button>`;
    
    cornersHTML += `
        <input type="file" class="ns-import-input" accept=".json,application/json" 
               style="display:none">`;
    
    corners.innerHTML = cornersHTML;
    
    if (isCustom) {
        const deleteBtn = corners.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomNorthStar(leader, category);
        });
    }
    
    const topRightBtn = corners.querySelector('[data-action="edit"], [data-action="add"]');
    topRightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isCustom) {
            showCustomNorthStarModal(category, leader);
        } else {
            showCustomNorthStarModal(category);
        }
    });
    
    const importBtn = corners.querySelector('[data-action="import"]');
    const importInput = corners.querySelector('.ns-import-input');
    importBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        importInput.click();
    });
    importInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) await importCustomNorthStars(file);
        e.target.value = '';
    });
    
    const exportBtn = corners.querySelector('[data-action="export"]');
    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exportCustomNorthStars();
    });
    
    cardContainer.appendChild(corners);
}

// ═══════════════════════════════════════════════
// 显示定制北极星模态框
// ═══════════════════════════════════════════════
function showCustomNorthStarModal(category, editLeader = null) {
    const lang = window.currentLang || 'zh-CN';
    const otherLang = lang === 'zh-CN' ? 'en' : 'zh-CN';
    const isEdit = !!editLeader;
    
    const currentName = isEdit ? getFieldValue(editLeader.name, lang) : '';
    const currentNameOther = isEdit ? getFieldValue(editLeader.name, otherLang) : '';
    
    let currentField, currentFieldOther;
    if (isEdit) {
        currentField = getFieldValue(editLeader.field, lang);
        currentFieldOther = getFieldValue(editLeader.field, otherLang);
    } else {
        currentField = getCategoryName(category);
        currentFieldOther = categoryNames[category]?.[otherLang] || getCategoryName(category);
    }
    
    const currentContrib = isEdit ? getFieldValue(editLeader.contribution, lang) : '';
    const currentContribOther = isEdit ? getFieldValue(editLeader.contribution, otherLang) : '';
    const currentRemarks = isEdit ? getFieldValue(editLeader.remarks, lang) : '';
    const currentRemarksOther = isEdit ? getFieldValue(editLeader.remarks, otherLang) : '';
    
    const modal = document.createElement('div');
    modal.className = 'starry-modal ns-modal';
    modal.id = 'customNSModal';
    
    modal.innerHTML = `
        <div class="starry-modal-overlay" onclick="if(event.target===this)closeCustomNSModal()"></div>
        <div class="starry-modal-content">
            <div class="starry-modal-header">
                <h3>${getFieldValue(isEdit ? customExpertexts.modalTitleEdit : customExpertexts.modalTitleAdd, lang)}</h3>
                <button class="modal-close" onclick="closeCustomNSModal()">×</button>
            </div>
            
            <div class="starry-modal-body">
                <div class="config-section">
                    <label class="config-label">
                        ${getFieldValue(customExpertexts.nameLabel, lang)}
                        <span class="lang-tag">${lang === 'zh-CN' ? '中文' : 'English'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsNamePrimary" 
                           value="${currentName}" placeholder="${lang === 'zh-CN' ? '输入姓名' : 'Enter name'}">
                    
                    <label class="config-label secondary">
                        ${lang === 'zh-CN' ? '英文姓名' : 'Chinese Name'}
                        <span class="lang-tag secondary">${lang === 'zh-CN' ? 'English' : '中文'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsNameSecondary" 
                           value="${currentNameOther}" placeholder="${lang === 'zh-CN' ? 'Enter English name' : '输入英文姓名'}">
                </div>

                <div class="config-section">
                    <label class="config-label">
                        ${getFieldValue(customExpertexts.contributionLabel, lang)}
                        <span class="lang-tag">${lang === 'zh-CN' ? '中文' : 'English'}</span>
                    </label>
                    <textarea class="config-textarea" id="nsContributionPrimary" rows="3"
                        placeholder="${lang === 'zh-CN' ? '描述贡献...' : 'Describe contribution...'}">${currentContrib}</textarea>
                    
                    <label class="config-label secondary">
                        ${lang === 'zh-CN' ? '英文贡献' : 'Chinese Contribution'}
                        <span class="lang-tag secondary">${lang === 'zh-CN' ? 'English' : '中文'}</span>
                    </label>
                    <textarea class="config-textarea" id="nsContributionSecondary" rows="3"
                        placeholder="${lang === 'zh-CN' ? 'Describe in English...' : '用英文描述...'}">${currentContribOther}</textarea>
                </div>

                <div class="config-section">
                    <label class="config-label">
                        ${getFieldValue(customExpertexts.fieldLabel, lang)}
                        <span class="lang-tag">${lang === 'zh-CN' ? '中文' : 'English'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsFieldPrimary" 
                           value="${currentField}" 
                           placeholder="${getFieldValue(customExpertexts.fieldPlaceholder, lang)}">
                    
                    <label class="config-label secondary">
                        ${lang === 'zh-CN' ? '英文领域' : 'Chinese Field'}
                        <span class="lang-tag secondary">${lang === 'zh-CN' ? 'English' : '中文'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsFieldSecondary" 
                           value="${currentFieldOther}" 
                           placeholder="${lang === 'zh-CN' ? 'e.g. AI' : '如：人工智能'}">
                </div>

                <div class="config-section">
                    <label class="config-label">
                        ${getFieldValue(customExpertexts.remarksLabel, lang)}
                        <span class="lang-tag">${lang === 'zh-CN' ? '中文' : 'English'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsRemarksPrimary" 
                           value="${currentRemarks}" placeholder="${lang === 'zh-CN' ? '一句评注...' : 'A remark...'}">
                    
                    <label class="config-label secondary">
                        ${lang === 'zh-CN' ? '英文评注' : 'Chinese Remarks'}
                        <span class="lang-tag secondary">${lang === 'zh-CN' ? 'English' : '中文'}</span>
                    </label>
                    <input type="text" class="config-input" id="nsRemarksSecondary" 
                           value="${currentRemarksOther}" placeholder="${lang === 'zh-CN' ? 'English remark...' : '英文评注...'}">
                </div>
            </div>
            
            <div class="starry-modal-footer">
                <button class="btn-secondary" onclick="closeCustomNSModal()">
                    ${getFieldValue(angelColumnTexts.cancel, lang)}
                </button>
                <button class="btn-primary" onclick="saveCustomNorthStar('${editLeader?.id || ''}')">
                    ${getFieldValue(angelColumnTexts.save, lang)}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeCustomNSModal() {
    document.getElementById('customNSModal')?.remove();
}

// ═══════════════════════════════════════════════
// 保存定制北极星
// 【修改】存储时用内部键名
// ═══════════════════════════════════════════════
function saveCustomNorthStar(editId = '') {
    const lang = window.currentLang || 'zh-CN';
    const otherLang = lang === 'zh-CN' ? 'en' : 'zh-CN';
    
    const category = window.currentSelectedCategory;
    if (!category) {
        console.error('[CustomNS] currentSelectedCategory is empty');
        alert('Error: No category selected');
        return;
    }
    
    // 外部键名 → 内部键名
    const internalCategory = toInternalCategory(category);
    
    const namePrimary = document.getElementById('nsNamePrimary')?.value.trim();
    const nameSecondary = document.getElementById('nsNameSecondary')?.value.trim();
    const fieldPrimary = document.getElementById('nsFieldPrimary')?.value.trim();
    const fieldSecondary = document.getElementById('nsFieldSecondary')?.value.trim();
    const contribPrimary = document.getElementById('nsContributionPrimary')?.value.trim();
    const contribSecondary = document.getElementById('nsContributionSecondary')?.value.trim();
    const remarksPrimary = document.getElementById('nsRemarksPrimary')?.value.trim();
    const remarksSecondary = document.getElementById('nsRemarksSecondary')?.value.trim();
    
    if (!namePrimary) {
        alert(getFieldValue(customExpertexts.nameRequired, lang));
        return;
    }
    
    const finalFieldPrimary = fieldPrimary || getCategoryName(category);
    const finalFieldSecondary = fieldSecondary || categoryNames[category]?.[otherLang] || getCategoryName(category);
    
    const id = editId || generateCustomNSId(namePrimary, internalCategory);
    
    const northStar = {
        id: id,
        name: {
            [lang]: namePrimary,
            [otherLang]: nameSecondary || namePrimary
        },
        field: {
            [lang]: finalFieldPrimary,
            [otherLang]: finalFieldSecondary || finalFieldPrimary
        },
        contribution: {
            [lang]: contribPrimary,
            [otherLang]: contribSecondary || contribPrimary
        },
        remarks: {
            [lang]: remarksPrimary,
            [otherLang]: remarksSecondary || remarksPrimary
        },
        _isCustom: true,
        _category: internalCategory
    };
    
    if (!window.customAllData[internalCategory]) {
        window.customAllData[internalCategory] = [];
    }
    
    if (editId) {
        const idx = window.customAllData[internalCategory].findIndex(n => n.id === editId);
        if (idx > -1) {
            window.customAllData[internalCategory][idx] = northStar;
        }
    } else {
        window.customAllData[internalCategory].push(northStar);
    }
    
    persistCustomNorthStars();
    closeCustomNSModal();
    showToast(getFieldValue(customExpertexts.saveSuccess, lang), 'success');
    
    if (window.currentSelectedCategory === category) {
        refreshCategoryDisplay(category);
    }
}

// 生成唯一 ID
function generateCustomNSId(name, internalCategory) {
    const base = name.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_');
    const timestamp = Date.now().toString(36);
    return `custom_${internalCategory}_${base}_${timestamp}`;
}

// ═══════════════════════════════════════════════
// 删除定制北极星
// 【修改】删除时用内部键名
// ═══════════════════════════════════════════════
function deleteCustomNorthStar(leader, category) {
    const lang = window.currentLang || 'zh-CN';
    
    if (!leader._isCustom) {
        showToast(getFieldValue(customExpertexts.deleteBuiltIn, lang), 'error');
        return;
    }
    
    if (!confirm(getFieldValue(customExpertexts.deleteConfirm, lang))) return;
    
    const internalCategory = toInternalCategory(category);
    const list = window.customAllData[internalCategory];
    if (!list) return;
    
    const idx = list.findIndex(n => n.id === leader.id);
    if (idx > -1) {
        list.splice(idx, 1);
        if (list.length === 0) {
            delete window.customAllData[internalCategory];
        }
        persistCustomNorthStars();
        refreshCategoryDisplay(category);
        showToast(getFieldValue(angelColumnTexts.deleteCardSuccess, lang), 'success');
    }
}

// ═══════════════════════════════════════════════
// 导出定制北极星
// 【修改】内部键名 → 外部键名导出
// ═══════════════════════════════════════════════
function exportCustomNorthStars() {
    const lang = window.currentLang || 'zh-CN';
    
    const allCustom = window.customAllData || {};
    const totalCount = Object.values(allCustom).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalCount === 0) {
        showToast(getFieldValue(customExpertexts.exportEmpty, lang), 'info');
        return { success: false, error: 'empty' };
    }
    
    const exportCustomAllData = {};
    for (const [internalKey, leaders] of Object.entries(allCustom)) {
        const externalKey = toExternalCategory(internalKey);
        exportCustomAllData[externalKey] = leaders.map(leader => ({
            ...leader,
            _category: externalKey
        }));
    }
    
    const exportData = {
        _schema: CUSTOM_NS_PERSISTENCE.SCHEMA_VERSION,
        _exportedAt: Date.now(),
        _type: 'customNorthStars',
        customAllData: exportCustomAllData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-experts-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showToast(getFieldValue(customExpertexts.exportSuccess, lang).replace('{count}', totalCount), 'success');
    return { success: true, count: totalCount };
}

// ═══════════════════════════════════════════════
// 导入定制北极星
// 【修改】外部键名 → 内部键名导入
// ═══════════════════════════════════════════════
async function importCustomNorthStars(file) {
    const lang = window.currentLang || 'zh-CN';
    
    if (!file || file.type !== 'application/json') {
        return { success: false, error: 'Invalid file type' };
    }
    
    const confirmMsg = getFieldValue(customExpertexts.importConfirm, lang);
    if (!confirm(confirmMsg)) {
        return { success: false, error: 'cancelled' };
    }
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data._type !== 'customNorthStars' || !data.customAllData) {
                    resolve({ success: false, error: 'Invalid file format' });
                    return;
                }
                
                let added = 0, updated = 0;
                
                for (const [category, leaders] of Object.entries(data.customAllData)) {
                    if (!Array.isArray(leaders)) continue;
                    
                    const internalCategory = toInternalCategory(category);
                    
                    if (!window.customAllData[internalCategory]) {
                        window.customAllData[internalCategory] = [];
                    }
                    
                    for (const leader of leaders) {
                        if (!leader.id || !leader.name) continue;
                        
                        const mappedLeader = {
                            ...leader,
                            _category: internalCategory
                        };
                        
                        const existing = window.customAllData[internalCategory].find(n => n.id === mappedLeader.id);
                        if (existing) {
                            Object.assign(existing, mappedLeader);
                            updated++;
                        } else {
                            window.customAllData[internalCategory].push(mappedLeader);
                            added++;
                        }
                    }
                }
                
                persistCustomNorthStars();
                
                const msg = getFieldValue(customExpertexts.importSuccess, lang)
                    .replace('{added}', added)
                    .replace('{updated}', updated);
                showToast(msg, 'success');
                
                if (window.currentSelectedCategory) {
                    refreshCategoryDisplay(window.currentSelectedCategory);
                }
                
                resolve({ success: true, added, updated });
                
            } catch (err) {
                const msg = getFieldValue(customExpertexts.importFailed, lang)
                    .replace('{error}', err.message);
                showToast(msg, 'error');
                resolve({ success: false, error: err.message });
            }
        };
        
        reader.onerror = () => {
            resolve({ success: false, error: 'Failed to read file' });
        };
        
        reader.readAsText(file);
    });
}

// ═══════════════════════════════════════════════
// 刷新领域显示（合并内置 + 定制）
// 【修改】用内部键名获取定制数据
// ═══════════════════════════════════════════════
function refreshCategoryDisplay(category) {
    const internalCategory = toInternalCategory(category);
    const builtIn = allData[category] || [];
    const custom = window.customAllData[internalCategory] || [];
    const merged = [...builtIn, ...custom];
    
    // 你的渲染逻辑...
    
    if (window.currentSelectedLeader?._isCustom) {
        const updated = custom.find(n => n.id === window.currentSelectedLeader.id);
        if (updated) {
            updateSingleCard(updated);
        }
    }
}

// ═══════════════════════════════════════════════
// 获取合并后的领域数据（用于搜索、筛选等）
// 【修改】支持外部键名传入，自动查找内部键名
// ═══════════════════════════════════════════════
function getMergedCategoryData(category) {
    const builtIn = allData[category] || [];
    
    let custom = window.customAllData[category] || [];
    
    if (custom.length === 0) {
        const internalKey = toInternalCategory(category);
        if (internalKey !== category) {
            custom = window.customAllData[internalKey] || [];
        }
    }
    
    return [...builtIn, ...custom];
}

// ═══════════════════════════════════════════════
// 初始化时调用
// ═══════════════════════════════════════════════
function initCustomNorthStarSystem() {
    initCustomNorthStars();
}
