// ═══════════════════════════════════════════════
// 用户定制北极星 - 全球化文本
// ═══════════════════════════════════════════════
const customExpertexts = {
    // 四角图标 tooltip
    addNorthStar: {
        'zh-CN': '添加专家',
        'en': 'Add Expert'
    },
    editNorthStar: {  // ← 新增
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
    // 删除 fieldFixed，改为可编辑提示
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

// ═══════════════════════════════════════════════
// 全局定制数据存储
// ═══════════════════════════════════════════════
window.customAllData = {};  // 格式与 allData 一致: { category: [leader, ...] }

const CUSTOM_NS_PERSISTENCE = {
    STORAGE_KEY: 'customNorthStars',    // localStorage key
    SCHEMA_VERSION: 1
};

// ═══════════════════════════════════════════════
// 初始化：从 localStorage 加载定制数据
// ═══════════════════════════════════════════════
//定制数据为了支持多语言，name存储的是对象！在 initCustomNorthStars 中，加载数据后自动转换
function initCustomNorthStars() {
    const raw = localStorage.getItem(CUSTOM_NS_PERSISTENCE.STORAGE_KEY);
    if (!raw) {
        window.customAllData = {};
        return;
    }
    
    try {
        const data = JSON.parse(raw);
        if (data._schema === CUSTOM_NS_PERSISTENCE.SCHEMA_VERSION && data.customAllData) {
            window.customAllData = data.customAllData;
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
    // 按领域名称排序
    const sortedKeys = Object.keys(window.customAllData).sort();
    const sortedData = {};
    for (const key of sortedKeys) {
        // 每个领域内的北极星按姓名排序
        sortedData[key] = [...window.customAllData[key]].sort((a, b) => {
            const nameA = getFieldValue(a.name, 'zh-CN') || '';
            const nameB = getFieldValue(b.name, 'zh-CN') || '';
            return nameA.localeCompare(nameB, 'zh-CN');
        });
    }
    window.customAllData = sortedData;  // 更新为排序后的数据
    
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
// 在 updateSingleCard 或渲染卡片的函数中调用
// ═══════════════════════════════════════════════
function renderCustomNorthStarControls(cardContainer, leader, category) {
    const lang = window.currentLang || 'zh-CN';
    const isCustom = leader._isCustom === true;
    
    // 创建四角容器
    const corners = document.createElement('div');
    corners.className = 'ns-corners';
    
    // 右上角图标：自定义=编辑（铅笔），内置=增加（加号）
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
    
    // ═══════════════════════════════════════════════
    // 【修改1】内置北极星彻底去掉删除按钮
    // ═══════════════════════════════════════════════
    let cornersHTML = '';
    
    // 左上：删除（仅自定义显示）
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
    
    // 右上：增加/编辑
    cornersHTML += `
        <button class="ns-corner-btn ns-corner-tr" 
                data-action="${isCustom ? 'edit' : 'add'}"
                title="${getFieldValue(isCustom ? customExpertexts.editNorthStar : customExpertexts.addNorthStar, lang)}">
            ${topRightIcon}
        </button>`;
    
    // 左下：导入
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
    
    // 右下：导出
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
    
    // 隐藏的文件输入（用于导入）
    cornersHTML += `
        <input type="file" class="ns-import-input" accept=".json,application/json" 
               style="display:none">`;
    
    corners.innerHTML = cornersHTML;
    
    // ═══════════════════════════════════════════════
    // 绑定事件
    // ═══════════════════════════════════════════════
    
    // 删除：仅自定义可删（DOM 存在时才绑定）
    if (isCustom) {
        const deleteBtn = corners.querySelector('[data-action="delete"]');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteCustomNorthStar(leader, category);
        });
    }
    
    // 右上：自定义=编辑，内置=新增
    const topRightBtn = corners.querySelector('[data-action="edit"], [data-action="add"]');
    topRightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isCustom) {
            showCustomNorthStarModal(category, leader);  // 编辑
        } else {
            showCustomNorthStarModal(category);            // 新增
        }
    });
    
    // 导入
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
    
    // 导出
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
    
    // 当前值（编辑模式）
    const currentName = isEdit ? getFieldValue(editLeader.name, lang) : '';
    const currentNameOther = isEdit ? getFieldValue(editLeader.name, otherLang) : '';
    
    // 领域值：编辑时取leader的值，新增时取category默认值
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
                <!-- 1. 姓名（保持第一） -->
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

                <!-- 2. 贡献 -->
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

                <!-- 3. 领域【修改：可编辑，移到贡献后面】 -->
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

                <!-- 4. 评注 -->
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
// ═══════════════════════════════════════════════
function saveCustomNorthStar(editId = '') {
    const lang = window.currentLang || 'zh-CN';
    const otherLang = lang === 'zh-CN' ? 'en' : 'zh-CN';
    
    // 【修复】直接从全局状态获取 category
    const category = window.currentSelectedCategory;
    if (!category) {
        console.error('[CustomNS] currentSelectedCategory is empty');
        alert('Error: No category selected');
        return;
    }
    
    // 读取字段
    const namePrimary = document.getElementById('nsNamePrimary')?.value.trim();
    const nameSecondary = document.getElementById('nsNameSecondary')?.value.trim();
    
    const fieldPrimary = document.getElementById('nsFieldPrimary')?.value.trim();
    const fieldSecondary = document.getElementById('nsFieldSecondary')?.value.trim();
    
    const contribPrimary = document.getElementById('nsContributionPrimary')?.value.trim();
    const contribSecondary = document.getElementById('nsContributionSecondary')?.value.trim();
    const remarksPrimary = document.getElementById('nsRemarksPrimary')?.value.trim();
    const remarksSecondary = document.getElementById('nsRemarksSecondary')?.value.trim();
    
    // 校验
    if (!namePrimary) {
        alert(getFieldValue(customExpertexts.nameRequired, lang));
        return;
    }
    
    // 领域默认值处理
    const finalFieldPrimary = fieldPrimary || getCategoryName(category);
    const finalFieldSecondary = fieldSecondary || categoryNames[category]?.[otherLang] || getCategoryName(category);
    
    // 生成 ID
    const id = editId || generateCustomNSId(namePrimary, category);
    
    // 构建对象
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
        _category: category
    };
    
    // 保存到 customAllData
    if (!window.customAllData[category]) {
        window.customAllData[category] = [];
    }
    
    if (editId) {
        const idx = window.customAllData[category].findIndex(n => n.id === editId);
        if (idx > -1) {
            window.customAllData[category][idx] = northStar;
        }
    } else {
        window.customAllData[category].push(northStar);
    }
    
    // 持久化
    persistCustomNorthStars();
    
    closeCustomNSModal();
    showToast(getFieldValue(customExpertexts.saveSuccess, lang), 'success');
    
    // 刷新显示
    if (window.currentSelectedCategory === category) {
        refreshCategoryDisplay(category);
    }
}

// 生成唯一 ID
function generateCustomNSId(name, category) {
    const base = name.toLowerCase().replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_');
    const timestamp = Date.now().toString(36);
    return `custom_${category}_${base}_${timestamp}`;
}

// ═══════════════════════════════════════════════
// 删除定制北极星
// ═══════════════════════════════════════════════
function deleteCustomNorthStar(leader, category) {
    const lang = window.currentLang || 'zh-CN';
    
    if (!leader._isCustom) {
        showToast(getFieldValue(customExpertexts.deleteBuiltIn, lang), 'error');
        return;
    }
    
    if (!confirm(getFieldValue(customExpertexts.deleteConfirm, lang))) return;
    
    const list = window.customAllData[category];
    if (!list) return;
    
    const idx = list.findIndex(n => n.id === leader.id);
    if (idx > -1) {
        list.splice(idx, 1);
        if (list.length === 0) {
            delete window.customAllData[category];
        }
        persistCustomNorthStars();
        refreshCategoryDisplay(category);
        showToast(getFieldValue(angelColumnTexts.deleteCardSuccess, lang), 'success');
    }
}

// ═══════════════════════════════════════════════
// 导出定制北极星
// ═══════════════════════════════════════════════
function exportCustomNorthStars() {
    const lang = window.currentLang || 'zh-CN';
    
    // 检查是否有数据
    const allCustom = window.customAllData || {};
    const totalCount = Object.values(allCustom).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalCount === 0) {
        showToast(getFieldValue(customExpertexts.exportEmpty, lang), 'info');
        return { success: false, error: 'empty' };
    }
    
    const exportData = {
        _schema: CUSTOM_NS_PERSISTENCE.SCHEMA_VERSION,
        _exportedAt: Date.now(),
        _type: 'customNorthStars',
        customAllData: allCustom
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-northstars-${timestamp}.json`;
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
// ═══════════════════════════════════════════════
async function importCustomNorthStars(file) {
    const lang = window.currentLang || 'zh-CN';
    
    if (!file || file.type !== 'application/json') {
        return { success: false, error: 'Invalid file type' };
    }
    
    // 确认覆盖
    const confirmMsg = getFieldValue(customExpertexts.importConfirm, lang);
    if (!confirm(confirmMsg)) {
        return { success: false, error: 'cancelled' };
    }
    
    return new Promise((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // 校验
                if (data._type !== 'customNorthStars' || !data.customAllData) {
                    resolve({ success: false, error: 'Invalid file format' });
                    return;
                }
                
                let added = 0, updated = 0;
                
                // 合并数据
                for (const [category, leaders] of Object.entries(data.customAllData)) {
                    if (!Array.isArray(leaders)) continue;
                    
                    if (!window.customAllData[category]) {
                        window.customAllData[category] = [];
                    }
                    
                    for (const leader of leaders) {
                        if (!leader.id || !leader.name) continue;
                        
                        const existing = window.customAllData[category].find(n => n.id === leader.id);
                        if (existing) {
                            Object.assign(existing, leader);
                            updated++;
                        } else {
                            window.customAllData[category].push(leader);
                            added++;
                        }
                    }
                }
                
                persistCustomNorthStars();
                
                const msg = getFieldValue(customExpertexts.importSuccess, lang)
                    .replace('{added}', added)
                    .replace('{updated}', updated);
                showToast(msg, 'success');
                
                // 刷新当前显示
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
// ═══════════════════════════════════════════════
function refreshCategoryDisplay(category) {
    // 合并内置数据和定制数据
    const builtIn = allData[category] || [];
    const custom = window.customAllData[category] || [];
    
    // 创建临时合并数组（不修改原始 allData）
    const merged = [...builtIn, ...custom];
    
    // 更新显示
    // 这里需要根据你的实际渲染逻辑调整
    // 例如：重新渲染 chips、更新大卡片等
    
    // 如果当前选中的领袖是定制的，需要刷新
    if (window.currentSelectedLeader?._isCustom) {
        const updated = custom.find(n => n.id === window.currentSelectedLeader.id);
        if (updated) {
            updateSingleCard(updated);
        }
    }
}

// ═══════════════════════════════════════════════
// 获取合并后的领域数据（用于搜索、筛选等）
// ═══════════════════════════════════════════════
function getMergedCategoryData(category) {
    const builtIn = allData[category] || [];
    const custom = window.customAllData[category] || [];
    return [...builtIn, ...custom];
}

// ═══════════════════════════════════════════════
// 初始化时调用
// ═══════════════════════════════════════════════
function initCustomNorthStarSystem() {
    initCustomNorthStars();
    
    // 将定制数据注入到全局搜索/筛选中
    // 例如：修改 getFilteredCandidates 使用 getMergedCategoryData
}
