/**
 * 用户点击"导入历史MD"按钮时调用
 * 负责文件选择、读取和解析流程
 */
function importFromMD() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,text/markdown';
    input.style.display = 'none';

    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.md')) {
            alert('请上传 .md 格式的文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('文件大小超过5MB，请选择较小的文件');
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const mdContent = event.target.result;
                const parsed = parseMDToHistory(mdContent);

                if (parsed.length === 0) {
                    alert('未能从文件中解析出有效的对话内容');
                    return;
                }

                importedHistory = parsed;
                if (typeof saveCanvasSession === 'function') {
                    saveCanvasSession(); 
                }
                renderDialogueCanvas();

            } catch (err) {
                console.error('导入MD解析失败:', err);
                alert('文件内容解析失败，可能格式不被当前版本支持');
            }
        };

        reader.onerror = function() {
            alert('无法读取文件，请确认文件是否正常');
        };

        reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();

    setTimeout(() => {
        document.body.removeChild(input);
    }, 1000);
}

// 转义正则特殊字符的辅助函数（防止角色名中含有 . * 等字符导致正则失效）
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 【移植增强】专门处理旧格式（### User: / ### 人物名:）的解析函数
 * 采用正则严格匹配，防止正文 ### 标题误切分
 * 【最终稳定修复版】
 * 修复：
 * 1. 专家名被正文 ### 标题误切分
 * 2. assistant 节点丢失
 * 3. leaderInfo 错位
 * 4. 正文中的 markdown 标题被误识别为角色头
 */
function parseOldFormatMD(normalized) {
    const history = [];

    // =========================================================
    // 【移植核心】正则严格匹配：只匹配真正的角色头
    //
    // 匹配 ### User:  或  ### 张医生:
    // 不匹配正文里的：### 第一颗星：xxx  或  ### 总结
    // =========================================================
    const roleBlockRegex =
        /^###\s+(.+?):\s*\n([\s\S]*?)(?=^###\s+.+?:\s*$|(?![\s\S]))/gm;

    const matches = [...normalized.matchAll(roleBlockRegex)];

    if (!matches.length) return [];

    let pendingUser = null;

    for (const match of matches) {
        const roleName = (match[1] || '').trim();
        const body = (match[2] || '').trim();

        if (!body) continue;

        let rawLines = body.split('\n');

        // =====================================================
        // USER 节点处理
        // =====================================================
        if (roleName === 'User') {
            let userLines = rawLines.map(line => {
                if (line.trim().startsWith('>')) {
                    return line.replace(/^>\s?/, '');
                }
                return line;
            });

            let userText = userLines.join('\n');

            // =================================================
            // 【移植增强】提取关联专家信息块（兼容中英文冒号）
            // =================================================
            const infoBlockPatterns = [
                // 标准格式: **🧩 关联专家**: 姓名
                /\*\*🧩\s*关联专家\*\*[：:]\s*(.+?)\n\s*-\s*领域[：:]\s*(.+?)\n\s*-\s*贡献[：:]\s*(.+?)(?=\n|$)/s,
                
                // 无加粗格式: 🧩 关联专家: 姓名
                /🧩\s*关联专家[：:]\s*(.+?)\n\s*-\s*领域[：:]\s*(.+?)\n\s*-\s*贡献[：:]\s*(.+?)(?=\n|$)/s,
                
                // 宽松兼容
                /\*\*🧩\s*关联专家\*\*[：:](.+?)(?:-\s*领域[：:](.+?))?(?:-\s*贡献[：:](.+?))?/s
            ];

            let extractedLeaderInfo = null;

            for (const pattern of infoBlockPatterns) {
                const match = userText.match(pattern);
                if (match) {
                    extractedLeaderInfo = {
                        name: (match[1] || '').trim() || 'Unknown',
                        field: (match[2] || '').trim(),
                        contribution: (match[3] || '').trim()
                    };
                    userText = userText.replace(pattern, '').trim();
                    break;
                }
            }

            // 清理多余空行
            userText = userText
                .replace(/\n{3,}/g, '\n\n')
                .trim();

            pendingUser = {
                role: 'user',
                text: userText,
                leaderInfo: null
            };

            // 临时保存 leaderInfo 给下一个 assistant
            if (extractedLeaderInfo) {
                pendingUser._tempLeaderInfo = extractedLeaderInfo;
            }

            continue;
        }

        // =====================================================
        // ASSISTANT 节点处理
        // =====================================================
        let textLines = rawLines.map(line => {
            if (line.trim().startsWith('>')) {
                return line.replace(/^>\s?/, '');
            }
            return line;
        });

        textLines = textLines.map(l => l.trimEnd());

        let text = textLines.join('\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // =====================================================
        // 【移植增强】防止正文重复角色名
        // =====================================================
        if (roleName && text) {
            const prefixRegex = new RegExp(
                `^\\s*${escapeRegExp(roleName)}[：:]?\\s*`,
                'i'
            );
            text = text.replace(prefixRegex, '').trim();
        }

        // =====================================================
        // 【移植增强】清理残余 markdown 噪音
        // =====================================================
        text = text
            .replace(/^(?:-{3,}|={3,})\s*$/gm, '---')
            .trim();

        // =====================================================
        // 默认 leaderInfo
        // =====================================================
        let leaderInfo = {
            name: roleName,
            field: '',
            contribution: ''
        };

        // =====================================================
        // 【移植增强】优先使用 User 中提取的关联信息
        // =====================================================
        if (pendingUser && pendingUser._tempLeaderInfo) {
            leaderInfo = pendingUser._tempLeaderInfo;
            delete pendingUser._tempLeaderInfo;
        }

        // =====================================================
        // 先 push user
        // =====================================================
        if (pendingUser) {
            history.push(pendingUser);
            pendingUser = null;
        }

        // =====================================================
        // push assistant
        // =====================================================
        history.push({
            role: 'assistant',
            text: text,
            leaderInfo: leaderInfo
        });
    }

    // =========================================================
    // 收尾：如果最后一个是 user 没有 assistant
    // =========================================================
    if (pendingUser) {
        history.push(pendingUser);
    }

    return history.filter(item => item && item.text?.trim());
}

/**
 * 从【问题 / Question】块中精确提取用户真正提问
 * 优先级：1. "用户问题:"后双引号内容（最可靠）  2. 到第一个"请你作为"前的非空内容
 */
function extractRealUserQuestion(block) {
    console.group('【extractRealUserQuestion 调试】');
    console.log('原始输入 block（完整内容）：', block);
    console.log('block 长度：', block.length);
    console.log('block 前 200 字符：', block.substring(0, 200));

    block = block.trim();
    console.log('清理 trim 后 block：', block);

    // 步骤1：严格匹配"用户问题:"后（允许中间换行）的双引号内容
    const strictPattern = /用户问题\s*[:：]\s*(?:\n\s*)*["“]([^"”]+)["”]/;
    const strictMatch = block.match(strictPattern);
    console.log('步骤1 - strictPattern 正则：', strictPattern);
    console.log('步骤1 - 匹配结果 strictMatch：', strictMatch);
    if (strictMatch && strictMatch[1]) {
        const result = strictMatch[1].trim();
        console.log('【成功】步骤1 命中，返回：', result);
        console.groupEnd();
        return result;
    }

    // 步骤2：匹配"用户问题:"后到"请你作为"前的所有内容
    const untilCmd = block.match(/用户问题\s*[:：]\s*([\s\S]*?)(?=请你作为\s|$)/);
    console.log('步骤2 - untilCmd 正则：', /用户问题\s*[:：]\s*([\s\S]*?)(?=请你作为\s|$)/);
    console.log('步骤2 - 匹配结果 untilCmd：', untilCmd);
    if (untilCmd && untilCmd[1]) {
        let candidate = untilCmd[1]
            .replace(/^\n+/, '')
            .replace(/["“]([^"”]*)["”]/g, '$1')
            .replace(/\s+$/, '')
            .trim();

        console.log('步骤2 - 清理后的 candidate：', candidate);
        if (candidate && !candidate.includes('请你作为')) {
            console.log('【成功】步骤2 命中，返回：', candidate);
            console.groupEnd();
            return candidate;
        }
    }

    // 步骤3：兜底取第一个完整双引号
    const firstQuote = block.match(/["“](.+?)["”]/);
    console.log('步骤3 - firstQuote 正则：', /["“](.+?)["”]/);
    console.log('步骤3 - 匹配结果 firstQuote：', firstQuote);
    if (firstQuote && firstQuote[1]) {
        const result = firstQuote[1].trim();
        console.log('【兜底成功】步骤3 命中，返回：', result);
        console.groupEnd();
        return result;
    }

    console.log('【兜底失败】未匹配到任何有效内容，返回默认值');
    console.groupEnd();
    return '（未提取到具体问题）';
}

/**
 * 【增强版】从背景设定中提取专家信息
 * 
 * 兼容格式：
 *   1. 原有格式：你是 张医生（Dr. Zhang）\n主要贡献: xxx\n专业领域: xxx
 *   2. 新格式：你是 大道修真. 根据...\n- 主要贡献 xxx\n- 专业领域 xxx
 */
function extractLeaderInfoFromPrompt(block) {
    const info = { name: 'Unknown', field: '', contribution: '' };

    // ========== 提取名字 ==========
    // 策略A：原有格式 — 你是 名字（英文名）
    const nameMatchLegacy = block.match(/你是\s+([^\s（(]+)[（(]([^）)]+)[）)]/);
    // 策略B：新格式 — 你是 名字. 根据...（无括号英文名，名字后紧跟句号或空格）
    const nameMatchNew = block.match(/你是\s+([^\s.（(]+)(?:[.．。]|\s+根据|$)/);
    
    if (nameMatchLegacy) {
        info.name = nameMatchLegacy[1].trim();
    } else if (nameMatchNew) {
        info.name = nameMatchNew[1].trim();
    }

    // ========== 提取贡献 ==========
    // 兼容：原有格式（冒号分隔）和新格式（空格/列表项分隔）
    const contribPatterns = [
        // 原有格式：主要贡献: xxx 或 主要贡献：xxx
        /(?:^|\n)\s*主要贡献\s*[：:]\s*([^\n]+?)(?=\n\s*-|\n|$)/,
        // 新格式：- 主要贡献 xxx（空格分隔，无冒号）
        /(?:^|\n)\s*-\s*主要贡献\s+([^\n]+?)(?=\n\s*-|\n|$)/,
        // 兜底：主要贡献 xxx（无列表符号，无冒号）
        /(?:^|\n)\s*主要贡献\s+([^\n]+?)(?=\n\s*-|\n|$)/,
    ];
    
    for (const pattern of contribPatterns) {
        const match = block.match(pattern);
        if (match && match[1]) {
            info.contribution = match[1].trim();
            break;
        }
    }

    // ========== 提取领域 ==========
    const fieldPatterns = [
        // 原有格式：专业领域: xxx 或 专业领域：xxx
        /(?:^|\n)\s*专业领域\s*[：:]\s*([^\n]+?)(?=\n\s*-|\n|$)/,
        // 新格式：- 专业领域 xxx（空格分隔，无冒号）
        /(?:^|\n)\s*-\s*专业领域\s+([^\n]+?)(?=\n\s*-|\n|$)/,
        // 兜底：专业领域 xxx（无列表符号，无冒号）
        /(?:^|\n)\s*专业领域\s+([^\n]+?)(?=\n\s*-|\n|$)/,
    ];
    
    for (const pattern of fieldPatterns) {
        const match = block.match(pattern);
        if (match && match[1]) {
            info.field = match[1].trim();
            break;
        }
    }

    return info.name !== 'Unknown' ? info : null;
}


/**
 * 【移植增强】从MD内容解析出 conversationHistory 格式
 * 支持两种主要导出格式
 * 
 * 增强特性：
 * 1. HTML 错误页面检测（防止 Cloudflare 404 误解析）
 * 2. 三特征指纹校验（防止普通 MD 文章误解析）
 * 3. 正则严格匹配旧格式（防止正文 ### 标题误切分）
 */
function parseMDToHistory(mdContent) {
    // ═══════════════════════════════════════════════════════
    // 【移植增强】关键修复：检查是否是 HTML 错误页面
    // ═══════════════════════════════════════════════════════
    const trimmed = mdContent.trim();
    if (trimmed.startsWith('<!DOCTYPE') || 
        trimmed.startsWith('<html') ||
        trimmed.includes('<head>') ||
        trimmed.includes('<body>')) {
        console.error('[MD Parse] Received HTML instead of Markdown, likely 404 or server error');
        alert('文件格式错误：请上传 Markdown (.md) 文件，而非 HTML 页面');
        return [];
    }
    // ═══════════════════════════════════════════════════════

    let history = [];

    const normalized = mdContent
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    if (!normalized) return [];

    // ── 策略1：尝试解析【问题 / Question】格式 ───────
    if (normalized.includes('【问题 / Question】') || normalized.includes('【专家答复】')) {
        const parts = normalized.split(/【([^】]+)】\s*[:：]/).filter(Boolean);
        let currentRole = null;
        let questionBlock = '';
        const tempHistory = [];

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            if (i % 2 === 0) {
                const title = part.toLowerCase();
                if (title.includes('问题') || title.includes('question')) {
                    currentRole = 'user';
                    questionBlock = '';
                } else if (title.includes('答复') || title.includes('northstar answer')) {
                    currentRole = 'assistant';
                }
            } else {
                if (currentRole === 'user') {
                    questionBlock += part + '\n';
                    const userQuestion = extractRealUserQuestion(questionBlock);
                    const leaderInfo = extractLeaderInfoFromPrompt(questionBlock);
                    tempHistory.push({
                        role: 'user',
                        text: userQuestion || '（未提取到具体问题）',
                        leaderInfo: null
                    });
                    if (leaderInfo) tempHistory[tempHistory.length - 1]._pendingLeader = leaderInfo;
                } else if (currentRole === 'assistant') {
                    let leaderInfo = { name: 'Unknown', field: '', contribution: '' };
                    if (tempHistory.length > 0 && tempHistory[tempHistory.length - 1]._pendingLeader) {
                        leaderInfo = tempHistory[tempHistory.length - 1]._pendingLeader;
                        delete tempHistory[tempHistory.length - 1]._pendingLeader;
                    }
                    tempHistory.push({
                        role: 'assistant',
                        text: part.trim(),
                        leaderInfo: leaderInfo
                    });
                }
            }
        }
        
        if (tempHistory.length > 0) {
            history = tempHistory;
        }
    }
    
    // ── 策略2：尝试解析旧格式（### 格式） ───────────────────────────────
    // 【移植增强】增加严苛的"指纹校验"
    // 必须同时满足三个条件（或其关键组合），才会被认定为是旧版导出的对话记录
    
    // 1. 特征一：是否存在 "### User" 分隔符（结构特征）
    const hasUserSeparator = /^###\s+User/im.test(normalized);
    
    // 2. 特征二：是否存在特定的文件头标识（身份特征）
    // 匹配 "# 智源生医" 或 "SmartOrigin BioMed"
    const hasHeaderSignature = /#\s*(?:智源生医|SmartOrigin BioMed)/i.test(normalized);
    
    // 3. 特征三：是否存在导出时间戳（辅助特征）
    const hasExportMeta = />\s*Exported on/i.test(normalized);

    // 【判定逻辑】：
    // 必须有 "### User" 结构，且 (包含标题签名 或 包含导出时间)
    // 这样既能防止普通MD文章误判，也能兼容用户可能不小心删掉了一行头部的边缘情况
    const isOldFormatDialogue = hasUserSeparator && (hasHeaderSignature || hasExportMeta);

    if (history.length === 0 && isOldFormatDialogue) {
        // 只有验明正身后，才调用【移植增强】的正则严格匹配解析器
        const oldFormatResult = parseOldFormatMD(normalized);
        if (oldFormatResult.length > 0) {
            history = oldFormatResult;
        }
    }

    // ── 策略3（兜底）：如果不符合上述任何结构，或上述解析均失效 ──────────
    if (history.length === 0) {
        history.push({
            role: 'assistant',
            text: normalized,
            leaderInfo: { 
                name: 'Imported Doc', 
                field: '', 
                contribution: '' 
            }
        });
    }

    return history.filter(item => item && item.text?.trim());
}

/* --- 辅助函数：生成文件名时间戳 --- */
function getExportFileName() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    // 格式：SmartOriginBioMed20231027103000
    return `SmartOriginBioMed${year}${month}${day}${hour}${minute}${second}`;
}

// 导出为 Markdown
function exportToMD() {
    const history = getMergedHistory(importedHistory, conversationHistory);
    
    if (!history || history.length === 0) {
        alert(translations[currentLang].alertCanvasEmpty || '画布为空，无法导出。');
        return;
    }

    let mdContent = "# 智源生医 (SmartOrigin BioMed)\n\n";
    const timestamp = new Date().toLocaleString();
    mdContent += `> Exported on: ${timestamp}\n\n---\n\n`;

    history.forEach((item, index) => {
        const isUser = item.role === 'user';
        const roleName = isUser ? "User" : (item.leaderInfo?.name || "Expert");
        
        let text = item.text.replace(/\n/g, '\n> '); 
        
        if (isUser) {
            const nextItem = history[index + 1];
            if (nextItem && nextItem.role !== 'user' && nextItem.leaderInfo) {
                const info = nextItem.leaderInfo;
                const leaderLabel = currentLang === 'en' ? 'Related Expert' : '关联专家';
                const fieldLabel = currentLang === 'en' ? 'Field' : '领域';
                const contributionLabel = currentLang === 'en' ? 'Contribution' : '贡献';
                
                text += `\n\n> **🧩 ${leaderLabel}**: ${info.name}`;
                text += `\n> - ${fieldLabel}: ${info.field}`;
                text += `\n> - ${contributionLabel}: ${info.contribution}`;
            }
        }

        mdContent += `### ${roleName}:\n${text}\n\n`;
    });

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getExportFileName()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
