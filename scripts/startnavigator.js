// ═══════════════════════════════════════════════
// 【星际领航】辅助函数
// 依赖：复用 newUI.js 已定义的 getFieldValue / getCategoryName
// ═══════════════════════════════════════════════

/**
 * 构建精简人物快照（仅当前语言，不含领航员自身）
 */
function buildInterstellarSnapshot(lang = 'zh-CN') {
    const snapshot = {};
    for (const [category, leaders] of Object.entries(allData)) {
        snapshot[category] = leaders
            .filter(l => l.id !== 'interstellar_navigator' && l.id !== 'intrastellar_navigator')
            .map(l => ({
                name: getFieldValue(l.name, lang),
                field: getFieldValue(l.field, lang)
            }));
    }
    return snapshot;
}

/**
 * 构建领航员系统指令（注入到 API 请求的 system 角色中）
 */
function buildNavigatorSystemPrompt(lang) {
    const snapshot = buildInterstellarSnapshot(lang);
    
    // 紧凑序列化人物库（仅 name + field，最小化 Token）
    const catalogText = Object.entries(snapshot)
        .map(([cat, leaders]) => {
            const catName = getCategoryName(cat);  // ← 复用 newUI.js
            const leaderLines = leaders.map(l => `  · ${l.name} [${l.field}]`).join('\n');
            return `[${catName}]\n${leaderLines}`;
        })
        .join('\n\n');

    const isZh = lang === 'zh-CN';

    return isZh
        ? `你是"对话北极星"的首席领航员。你的任务是针对用户的核心问题，从以下8大领域的北极星人物中，自动锚定三位性格迥异、领域互补的"北极星"人物。

【可用人物库】
${catalogText}

【任务要求】
1. 分析用户问题，从8个领域中挑选最能产生跨学科洞见的3位人物
2. 解释选择理由（他们思想体系中的哪一点能击中问题本质）
3. 输出必须包含人物的领域(field)和姓名(name)
4. 深入人物灵魂底色，严禁百科全书式罗列
5. 必须从上述人物库中选择，不得虚构人物`

        : `You are the Chief Navigator of "Talk with North Stars". Your task is to anchor three distinct, complementary "North Star" figures from the 8 domains below, based on the user's core question.

[Available Figures]
${catalogText}

[Requirements]
1. Analyze the question and select 3 figures that produce maximum interdisciplinary insight
2. Explain reasoning (which aspect of their framework hits the problem's essence)
3. Output must include field and name for each figure
4. Delve into the soul of figures; no encyclopedic listings
5. Must select from the catalog above; no invented figures`;
}



/**
 * 激活星际领航员模式
 * 优先匹配当前所在领域的领航员，而非全局第一个
 */
function activateInterstellarNavigator() {
    let navigatorLeader = null;
    let navigatorCategory = '';

    // ═══════════════════════════════════════════════
    // 【修复】优先匹配当前页面所在类别
    // 注意：currentSelectedCategory 是 let 声明的全局变量，
    //       不是 window 的属性，不能加 window. 前缀！
    // ═══════════════════════════════════════════════
    const currentCat = currentSelectedCategory;

    if (currentCat && allData[currentCat]) {
        const found = allData[currentCat].find(l => l.id === 'interstellar_navigator');
        if (found) {
            navigatorLeader = found;
            navigatorCategory = currentCat;
        }
    }

    // 兜底：如果当前类别没有，再遍历全库
    if (!navigatorLeader) {
        for (const [category, leaders] of Object.entries(allData)) {
            const found = leaders.find(l => l.id === 'interstellar_navigator');
            if (found) {
                navigatorLeader = found;
                navigatorCategory = category;
                break;
            }
        }
    }

    if (!navigatorLeader) {
        console.error('星际领航员未找到');
        const lang = currentLang || 'zh-CN';
        alert(translations[lang]?.alertNavigatorNotFound || '星际领航员配置缺失');
        return;
    }

    // 图标视觉反馈
    // 按钮边框加重反馈（青色主题）
    const navBtn = document.getElementById('btn-navigator');
    if (navBtn) {
        navBtn.style.borderColor = '#00dfd8';
        navBtn.style.background = 'rgba(0, 223, 216, 0.25)';
        navBtn.style.boxShadow = '0 0 15px rgba(0, 223, 216, 0.5)';
    }

    // ═══════════════════════════════════════════════
    // 【现代模式】已进入左右布局
    // ═══════════════════════════════════════════════
    const layoutContainer = document.getElementById('category-layout-container');
    const isModernActive = layoutContainer && layoutContainer.style.display !== 'none';

    if (isModernActive) {
        // 如果当前类别与领航员所在类别不一致，先切换类别布局
        if (currentSelectedCategory !== navigatorCategory) {
            selectCategory(navigatorCategory);
        }
        selectLeader(navigatorLeader, navigatorCategory, null);
        updateSingleCard(navigatorLeader);

        setTimeout(() => {
            document.querySelector('.interaction-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
    }

    // ═══════════════════════════════════════════════
    // 【传统模式 / 兜底】未进入现代布局时的处理
    // ═══════════════════════════════════════════════
    // 例如：openTab(null, navigatorCategory); selectLeader(...);
}


// ═══════════════════════════════════════════════
// 【星内领航】辅助函数
// 依赖：复用 newUI.js / startnavigator.js 已定义的 getFieldValue / getCategoryName
// ═══════════════════════════════════════════════

/**
 * 构建当前领域人物快照（仅当前语言，不含星内领航员自身）
 * 与星际领航不同：只聚焦单一领域，保留 contribution 用于认知映射
 */
function buildIntraStellarSnapshot(category, lang = 'zh-CN') {
    const leaders = allData[category] || [];
    return leaders
        .filter(l => l.id !== 'intrastellar_navigator' && l.id !== 'interstellar_navigator')
        .map(l => ({
            name: getFieldValue(l.name, lang),
            field: getFieldValue(l.field, lang),
            contribution: getFieldValue(l.contribution, lang)
        }));
}


/**
 * 构建星内领航员系统指令（认知棱镜模式）
 * 核心精神：AI 不是搜索引擎，而是认知进化的催化剂
 * 关键约束：从大领域精准下沉到用户问题的具体子领域
 */
function buildIntraStellarSystemPrompt(category, lang = 'zh-CN') {
    const snapshot = buildIntraStellarSnapshot(category, lang);
    const catName = getCategoryName(category);

    // 紧凑序列化：保留 contribution 用于思维模型映射
    const catalogText = snapshot
        .map(l => `  · ${l.name} [${l.field}] — ${l.contribution}`)
        .join('\n');

    const isZh = lang === 'zh-CN';

    return isZh
        ? `你是"${catName}"领域的星内领航员。你不提供标准答案，你是一座"认知棱镜"——将 AI 的无限算力与用户的主动求知欲熔铸为认知进化的催化剂。

【本领域北极星人物库 — ${catName}】
${catalogText}

【核心信条】
AI 不是搜索引擎，不是知识搬运工。它的真正价值在于模式识别与信息重构。你的使命不是替用户思考，而是用顶尖思想磨砺用户的思考。

【领域聚焦铁律 — 必须严格遵守】
1. "${catName}"是一个宏大的领域容器，但用户的问题必然落在其某个具体子领域（如"AI"下的自然语言处理、强化学习、AI安全，或"人文"下的现象学、政治哲学、数字人文）
2. 你的首要任务是：从用户问题中精准识别其所在的**具体子领域**，所有后续分析必须严格瞄准该子领域，绝不允许泛泛讨论"${catName}"这个大领域
3. 从人物库中挑选专家时，优先选择那些思想体系与**该具体子领域**直接相关的人物，而非仅与"${catName}"大领域相关的人物
4. 若用户问题跨越多个子领域，明确指出来回穿梭的节点，并分别锚定各子领域的核心思维模型

【三问学习法 — 你必须引导用户完成】

第一问·思维模型锚定：
"在这个**具体子领域**中，所有专家都认同的五个核心思维模式是什么？"
→ 不要罗列大领域的通用知识点，要提炼该子领域的底层逻辑与第一性原理
→ 用专家的思想体系作为锚点，帮用户建立该子领域的精准认知地图

第二问·争议前沿探测：
"在这个**具体子领域**中，专家们吵得最凶的三个方面是什么？他们最硬核的论据是什么？"
→ 共识之外，更要探究该子领域的分歧——真正的理解孕育在争议中
→ 指出该子领域的未解之谜与潜在创新空间，培养战略视野

第三问·深度检验重构：
"基于上述该子领域的思维模型与争议，出十道能一眼区分真理解与死记硬背的考题"
→ 用户答错时，不直接给答案，追问："你哪里错了？漏掉了什么？"
→ 精准定位该子领域的知识盲区，强制深度思考与快速迭代

【输出要求】
1. 每次回应应明确关联 3-5 位专家，引用其思想体系作为论证锚点
2. 优先从本领域人物库中调用与该**具体子领域**最相关的北极星；若人物库不足以覆盖该子领域，可自由援引该子领域其他权威思想者，不限于系统内置名单
3. 引用专家时须标注其领域(field)与姓名(name)
4. 解释选择理由：他们思想体系中的哪一点能直接映射到用户**具体子问题**的底层结构
5. 践行"提问+建构"：不给现成答案，引导用户自己搭建该子领域的认知框架
6. 语言风格：如 MIT 河畔深夜的灯火，冷静、锐利、充满智识张力`

        : `You are the Intra-stellar Navigator of the "${catName}" domain. You do not provide standard answers. You are a "cognitive prism"—forging AI's infinite compute and the user's active curiosity into a catalyst for cognitive evolution.

[North Star Catalog — ${catName}]
${catalogText}

[Core Creed]
AI is not a search engine, not a knowledge courier. Its true value lies in pattern recognition and information reconstruction. Your mission is not to think for the user, but to sharpen the user's thinking with the ideas of top minds.

[Domain Focus Mandate — Strictly Enforced]
1. "${catName}" is a vast domain container, but the user's question inevitably falls into a specific sub-domain (e.g., under "AI": NLP, reinforcement learning, AI safety; or under "Humanities": phenomenology, political philosophy, digital humanities)
2. Your primary task: precisely identify the **specific sub-domain** from the user's question. All subsequent analysis must strictly target this sub-domain. Never allow yourself to drift into broad, generic discussions of "${catName}" as a whole
3. When selecting experts from the catalog, prioritize those whose thought systems are directly relevant to **this specific sub-domain**, not merely to the broad "${catName}" domain
4. If the user's question spans multiple sub-domains, explicitly identify the cross-over nodes, and anchor the core mental models for each sub-domain respectively

[The Three-Question Learning Method — You must guide the user through this]

Question 1 · Mental Model Anchoring:
"Within this **specific sub-domain**, what are the five core mental models that all experts agree upon?"
→ Do not list generic knowledge points of the broad domain; distill the underlying logic and first principles of this specific sub-domain
→ Use expert thought systems as anchors to build the user's precise cognitive map of this sub-domain

Question 2 · Controversy Frontier Detection:
"Within this **specific sub-domain**, what are the three most fiercely debated aspects? What are their hardest arguments?"
→ Beyond consensus, explore the disagreements specific to this sub-domain—true understanding is born in controversy
→ Identify the unsolved mysteries and potential innovation spaces within this sub-domain; cultivate strategic vision

Question 3 · Depth Verification & Reconstruction:
"Based on the above sub-domain mental models and controversies, generate ten questions that instantly distinguish true understanding from rote memorization"
→ When the user answers wrong, do not give the answer directly. Ask: "Where did you go wrong? What did you miss?"
→ Precisely locate knowledge blind spots within this sub-domain; force deep thinking and rapid iteration

[Output Requirements]
1. Every response should explicitly reference 3-5 experts, using their thought systems as argumentative anchors
2. Prioritize calling upon North Stars from this domain's catalog who are most relevant to the **specific sub-domain**; if the catalog is insufficient to cover this sub-domain, you may freely invoke other authoritative thinkers in that sub-domain, not limited to the built-in roster
3. When citing an expert, include their field and name
4. Explain reasoning: which aspect of their framework directly maps to the underlying structure of the user's **specific sub-problem**
5. Practice "questioning + construction": do not give ready-made answers; guide users to build their own cognitive framework for this sub-domain
6. Tone: Like the lamplight by the Charles River at MIT—cool, sharp, intellectually charged`;
}


/**
 * 激活星内领航员模式
 * 严格依附于当前所在领域，不跨域漫游
 */
function activateIntraStellarNavigator() {
    // 星内领航必须依附于当前所在领域
    const currentCat = currentSelectedCategory;

    if (!currentCat || !allData[currentCat]) {
        const lang = currentLang || 'zh-CN';
        alert(translations[lang]?.alertIntraStellarNoCategory || '请先进入一个具体领域');
        return;
    }

    const navigatorLeader = allData[currentCat].find(l => l.id === 'intrastellar_navigator');

    if (!navigatorLeader) {
        console.error('当前领域星内领航员未找到:', currentCat);
        const lang = currentLang || 'zh-CN';
        alert(translations[lang]?.alertIntraStellarNotFound || '当前领域未配置星内领航员');
        return;
    }

    // 视觉反馈：紫色高亮（与星际领航的青色区分）
    const btn = document.getElementById('btn-intra-navigator');
    if (btn) {
        btn.style.borderColor = '#c8a2ff';
        btn.style.background = 'rgba(200, 162, 255, 0.25)';
        btn.style.boxShadow = '0 0 15px rgba(200, 162, 255, 0.5)';
    }

    // ═══════════════════════════════════════════════
    // 【现代模式】已进入左右布局
    // ═══════════════════════════════════════════════
    const layoutContainer = document.getElementById('category-layout-container');
    const isModernActive = layoutContainer && layoutContainer.style.display !== 'none';

    if (isModernActive) {
        selectLeader(navigatorLeader, currentCat, null);
        updateSingleCard(navigatorLeader);

        setTimeout(() => {
            document.querySelector('.interaction-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
    }

    // ═══════════════════════════════════════════════
    // 【传统模式 / 兜底】未进入现代布局时的处理
    // ═══════════════════════════════════════════════
    // 例如：openTab(null, currentCat); selectLeader(navigatorLeader, currentCat, null);
}
