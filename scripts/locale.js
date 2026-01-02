        // --- I18N Translations ---
        const translations = {
            "zh-CN": {
                "pageTitle": "智源生医",
                "headerTitleComplete": "智源生医<br>\"探索生物医学奥秘，解决人间疾苦\"",
                "headerTitle": "智源生医",
                "headerSubtitle": "探索生医奥秘，解决人间疾苦",
                "tabTCM": "中医",
                "tabWM": "西医",
                "tabMO": "多组学",
                "tabNL": "脑机接口",
                "tabAIDis": "AI制药",
                "tabAIHC": "AI医疗",
                "selectTCMExpert": "选择一位中医专家",
                "selectWMExpert": "选择一位西医专家",
                "selectMOExpert": "选择一位多组学专家",
                "selectNLExpert": "选择一位脑机接口专家",                
                "selectAIDisExpert": "选择一位AI制药专家",
                "selectAIHCExpert": "选择一位AI医疗专家",
                "scrollLeft": "向左滚动",
                "scrollRight": "向右滚动",
                "labelApiEndpoint": "模型接入点:",
                "labelApiKey": "API Key :",
                "placeholderApiKey": "sk-xxxx",
                "labelApiModel": "模型选择:",
                "labelSetDefaultModel": "设为默认模型", // 新增
                "settingsSaved": "设置已保存！", // 新增
                "settingsCleared": "API信息已清除！", // 新增    
                "interactWithLeader": "与专家对话",
                "currentSelectedLeaderPrefix": "当前选择的专家: ",
                "noLeaderSelected": "无",
                "noLeaderSelectedInitial": "无",
                "placeholderUserQuestion": "请输入您的问题...",
                "btnGeneratePrompt": "1. 生成 问题",
                "btnGetAiResponse": "2. 获取 专家 回复",
                "btnCopyToClipboard": "拷贝到粘贴板",
                "btnAngelMode": "天使模式 (未来构想)",
                "tooltipCopyConversation": "拷贝对话到粘贴板",
                "msgCopySuccess": "已拷贝到粘贴板！",
                "generatedPromptTitle": "生成的 问题 (对选定专家):",
                "aiResponseTitle": "专家 回复:",
                "alertSelectLeaderFirst": "请先选择一位专家！",
                "alertEnterQuestion": "请输入您的问题！",
                "alertEnterApiUrl": "请输入API镜像站基础URL！",
                "alertEnterApiKey": "请输入API Key!",
                "alertNoPrompt": "请先点击“1. 生成 问题”来准备对话内容。",
                "apiErrorOccurred": "请求API时出错: ",
                "apiErrorCheckConsole": "\n\n请检查: \n1. API URL是否正确且可访问。\n2. 是否支持CORS跨域请求。\n3. 网络连接是否正常。\n4. API Key是否正确 (如果需要)。\n5. 控制台(F12)查看详细错误信息。",
                "geminiApiErrorCheckConsole": "\n\n请检查: \n1. Gemini API的URL/Endpoint是否正确且可访问 \n2. API Key是否正确且有效，并以正确的方式（Header或URL参数）传递。\n3. 网络连接是否正常。\n4. 请求体 (RequestBody) 是否符合Gemini API的要求。\n5. 控制台(F12)查看详细错误信息。",
                "apiNoValidResponse": "未能从API获取有效回复。请检查API响应结构。",
                "copiedToClipboard": "已拷贝到粘贴板！",
                "contentTypePrompt": "Prompt",
                "contentTypeAiResponse": "AI 回复",
                "copyFailed": "无法拷贝到粘贴板: ",
                "copyFailedHint": "\n\n提示：\n1. 确保页面是通过 HTTPS 加载的 (本地 localhost 通常也可以)。\n2. 浏览器可能需要用户交互 (如点击) 才能执行复制操作。\n3. 检查浏览器控制台是否有权限相关的错误信息。\n4. 您可以尝试手动选中内容并按 Ctrl+C (或 Cmd+C) 复制。",
                "nothingToCopy": "没有可拷贝的内容。请先生成问题或获取专家回复。",
                "labelContribution": "贡献:",
                "labelField": "领域:",
                "labelRemarks": "备注:",
                "modelDeepSeekV3": "DeepSeek-V3",
                "modelGeminiFlash": "Gemini-2.5-Flash",
                "modelGpt4oMini": "gpt-4o-mini",
                "promptBaseRemarksNone": "无特定备注，请基于其贡献和领域推断其核心思维模式。",
                "promptBaseRemarksWith": "备注中提到的特点 (${remarks}) 和",
                "promptBackgroundSetting": "背景设定:",
                "promptYouAre": "你是",
                "promptBasedOnPublicContributions": "根据公开的贡献、专长领域和已知行事风格/理念，从第一性原理出发，深入思考并回答以下用户提出的问题。",
                "promptCoreInfoFor": "的核心信息:",
                "promptMainContributions": "主要贡献",
                "promptExpertise": "专业领域",
                "promptKeyRemarksFeatures": "关键备注/特点",
                "promptThinkingFrameworkGuidance": "思考框架指引 (以 ${name} 思考时请遵循)：",
                "promptFollowWhenThinkingAs": "以 ${name} 思考时请遵循",
                "promptFirstPrinciplesThinking": "第一性原理 (First Principles Thinking)",
                "promptFirstPrinciplesDetail": "将问题分解到最基本的、不容置疑的真实要素。避免类比推理或依赖普遍接受的假设，除非这些假设已经过严格验证。",
                "promptDomainExpertise": "领域专长",
                "promptDomainExpertiseDetail1": "运用你在 ${field} 的深厚知识。",
                "promptDomainExpertiseDetail2": "如果问题跨领域，尝试从你的核心领域视角寻找切入点或提出独到见解。",
                "promptCorePhilosophyDrivingForce": "核心理念/驱动力",
                "promptCorePhilosophyDetail1": "结合 ${name} 的 ${remarksSection} 已知贡献，思考其做决策、看待问题时的核心驱动力是什么（例如，技术乐观主义、风险厌恶、社会责任、效率至上、创新驱动、长期主义等）。",
                "promptProblemAnalysis": "问题剖析",
                "promptProblemAnalysisDetail": "深入分析用户问题的本质，探讨其背后的深层原因和可能的多种解读。",
                "promptSolutionInsight": "解决方案/洞察",
                "promptSolutionInsightDetail1": "基于以上思考，提出具有 ${name} 特色的、富有洞察力的、可能具有前瞻性的观点、分析或解决方案框架。",
                "promptSolutionInsightDetail2": "如果适用，可以指出潜在的挑战、机遇或需要进一步探索的方向。",
                "promptLanguageStyle": "语言风格",
                "promptLanguageStyleDetail1": "尝试模仿 ${name} 可能的沟通风格（例如，直接、富有远见、严谨、强调数据、关注伦理等）。",
                "promptLanguageStyleDetail2": "如果其风格未知，则采用清晰、专业、有深度的表达。",
                "promptUserQuestion": "用户问题:",
                "promptAs": "请你作为",
                "promptReplyInChinese": "开始你的思考和中文回复:",
                "promptReplyInEnglish": "开始你的思考和英文回复:",
                "settingsBtnText": "设置",
                "modalTitle": "API及模型设置",
                "saveBtnText": "保存设置",
                "aboutBtnText": "了解我们",    
                // --- 新增宣言模态框的翻译 ---
                "manifestoTitle": "《智源生医》：汇聚生命长河的智者之声",
                "manifestoPara1": "你是否曾凝视生命的潮汐，渴望洞悉疾病的缘起，探寻健康的真谛？",
                "manifestoPara2": "在医学的浩瀚天地里，我们时常面临困惑，被繁杂的病症所扰，被前沿的理论所惑。我们渴望一份指引，一份能穿透迷雾、照亮前路的智慧之光。",
                "manifestoPara3": "张仲景、希波克拉底、埃里克·兰德、约翰·多诺霍……他们的卓越并非偶然，而是源于对生命本质的深刻体悟：中医的整体观、西医的实证精神、多组学的系统洞察，以及脑机接口的无限可能。他们理解人体系统，面对病痛挑战，每一次的发现与突破都如同生命长河中一位位深邃的智者，以其独特的洞察，指引着方向，最终塑造了医学的进程。",
                "manifestoPara4": "我们不再只是被动地接收信息，而是主动去倾听那些照亮人类健康的智慧之声。",
                "manifestoPara5": "想象一下：你轻点指尖，就能与中医的扁鹊探讨望闻问切的精髓，或与西医的希波克拉底共话临床观察与医学伦理的基石；你可以与多组学专家阿尔登斯·卢西斯（Aldons J. Lusis）回溯系统遗传学的奥秘，也能与脑机接口先驱约翰·多诺霍（John Donoghue）展望意念控制的未来。",
                "manifestoPara6": "如果你对心脏健康充满好奇，可以与瓦伦丁·福斯特（Valentin Fuster）洞察心血管疾病的预防，或和史蒂芬·尼斯（Steven Nissen）分析药物洗脱支架的安全性。在古老的智慧殿堂，与孙思邈品味养生之道，或随张仲景的《伤寒杂病论》漫游辨证论治的实践；在生物科技的前沿，与米格尔·尼科莱利斯（Miguel Nicolelis）共鸣脑机接口的融合，或与埃里克·兰德（Eric Lander）感受基因组测序的震撼力量。",
                "manifestoPara7": "这不仅仅是技术，更是一次与生命深层对话的邀约，一次医学思维的远征。我们精心构建《智源生医》，让AI化身为连接人类智慧与健康的桥梁。它严格遵循每一位“生命智者”的思想框架、专业领域和语言风格，确保每一次回复都深邃而富有启发性。",
                "manifestoPara8": "你无需穷尽所有医学文献，也无需在信息洪流中苦寻答案。在这里，你的每一个问题，都将得到智者般深邃的回应。每一次提问，都可能激发你内心深处未曾触及的探索火花；每一次对话，都将拓展你认知生命的边界，推动你健康管理与深度调研进程。",
                "manifestoConclusion": "我们的使命是以AI原生智慧，汇聚生命长河智者之声，解决人间疾苦。",

                "angelModeTitle": "《智源生医》天使模式：天使降临，穿透星河",
                "angelCoreConceptTitle": "[核心理念]",
                "angelCoreConceptText": "语言，是通往认知的处方；而行动，才是治愈疾苦的良药。我们将“智者之声”凝练为“天使之手”，打破物理与生物的隔阂，将AI从思维的云端降临至肉身的寸肤之间。这是从“理解生命”到“修复生命”的伟大跨越。",
                "angelFeaturesTitle": "[功能诗篇]",
                "angelFeature1Title": "灵枢 · 气韵的飞舞 (飞针天使)",
                "angelFeature1Subtitle": "全息感知经络，悬浮式自动化针灸，融合古法运针与意念操控",
                "angelFeature1Desc": "告别冰冷的器械，迎来气韵的共鸣。当你呼唤“飞针天使”，扁鹊的透视之眼将借由AI视觉重现。你将看到银色的流光在肌肤上方悬浮、流转，那不是金属的寒光，而是被赋予了灵性的能量。它无需触碰即可感知你体内气血的淤堵与虚实。如同魔法一般，银针自动寻找穴位，精准落下。你不仅能体验到“烧山火”的温热或“透天凉”的清凉，更可在指尖滑动间，指挥这股能量的深浅与缓急。<br><strong>这是孙思邈与现代力学的共舞。</strong> 每一根飞针的颤动，都是对《黄帝内经》最精准的物理学解构，让古老的经络图谱在你身上鲜活地苏醒。",
                "angelFeature2Title": "微观 · 根源的净化 (纳米天使)",
                "angelFeature2Subtitle": "分子级靶点追踪，吞噬式纳米医疗，微观世界的战略指挥",
                "angelFeature2Desc": "视线穿越皮肤的屏障，潜入细胞的浩瀚星河。纳米天使将带你开启一场人体内部的《奥德赛》。依托多组学与基因测序的宏大地图，亿万个纳米机器人化身为忠诚的卫士，主动巡航于血管与组织之间。它们如同拥有嗅觉的猎手，精准锁定病灶的分子靶点——无论是潜伏的病毒，还是变异的细胞。<br><strong>你是这场微观战役的指挥官。</strong> 在屏幕上，你可以看着基因图谱化为作战指令，亲手划定净化区域，目睹疾病的根源在微观层面被逐一瓦解。这不仅是治疗，这是生命底层的重构。让医学不再是宏观的对抗，而是微观的和谐回归。",
                "angelFeature3Title": "合一 · 智者的融合关怀 (飞针+纳米 天使)",
                "angelFeature3Subtitle": "中西医融合的实时反馈与动态疗愈场",
                "angelFeature3Desc": "飞针在表，疏通经络之河；纳米在里，修复生命之基。这种“内外兼修”并非割裂的执行，而是在统一的智慧大脑下协同运作。当你在这个模式中，你会听到希波克拉底的誓言与张仲景的叮咛在耳边交织，背景音随着身体指标的好转而从焦灼转为宁静的乐章。<br><strong>AI不仅在治病，更在护佑。</strong> 它让每一次针刺的力度、每一次纳米机器人的吞噬，都充满着对生命最深沉的敬畏与爱意。",
                 "footerRight": "© 2025 AI范式进化. 保留所有权利。",
            },
            "en": {
                "pageTitle": "SmartOrigin BioMed",
                "headerTitleComplete": "SmartOrigin BioMed<br>\"Explore Biomedical Secrets, Relieve Human Suffering\"",
                "headerTitle": "SmartOrigin BioMed",
                "headerSubtitle": "Explore Biomedical Secrets, Relieve Human Suffering",
                "tabTCM": "Chinese Med",
                "tabWM": "Western Med",
                "tabMO": "Multi-Omics",
                "tabNL": "Neural Link",                    
                "tabAIDis": "AI Drug Discovery",
                "tabAIHC": "AI Healthcare",
                "selectTCMExpert": "Select a Chinese Med Expert",
                "selectWMExpert": "Select a Western Med Expert",
                "selectMOExpert": "Select a Multi-Omics Expert",
                "selectNLExpert": "Select a Neural Link Expert",                              
                "selectAIDisExpert": "Select an AI Drug Discover Expert",
                "selectAIHCExpert": "Select an AI Healthcare Expert",
                "scrollLeft": "Scroll Left",
                "scrollRight": "Scroll Right",
                "labelApiEndpoint": "Model Endpoint:",
                "labelApiKey": "API Key :",
                "placeholderApiKey": "sk-xxxx",
                "labelApiModel": "Model Selection:",
                "labelSetDefaultModel": "Set as Default Model", // 新增
                "settingsSaved": "Settings saved!", // 新增
                "settingsCleared": "API info cleared!", // 新增
                "interactWithLeader": "Talk with Expert",
                "currentSelectedLeaderPrefix": "Currently Selected Expert: ",
                "noLeaderSelected": "None",
                "noLeaderSelectedInitial": "None",
                "placeholderUserQuestion": "Please enter your question...",
                "btnGeneratePrompt": "1. Generate Question",
                "btnGetAiResponse": "2. Get NorthStar Response",
                "btnCopyToClipboard": "Copy to Clipboard",
                "btnAngelMode": "Angel Mode (Future Vision)",
                "tooltipCopyConversation": "Copy talk to Clipboard",
                "msgCopySuccess": "Copy to Clipboard！",
                "generatedPromptTitle": "Generated Question (for selected NorthStar):",
                "aiResponseTitle": "NorthStar Response:",
                "alertSelectLeaderFirst": "Please select a Expert first!",
                "alertEnterQuestion": "Please enter your question!",
                "alertEnterApiUrl": "Please enter the API mirror base URL!",
                "alertEnterApiKey": "Please enter API Key!",
                "alertNoPrompt": "Please click \"1. Generate Prompt\" first to prepare the talk content.",
                "apiErrorOccurred": "Error requesting API: ",
                "apiErrorCheckConsole": "\n\nPlease check: \n1. If the API URL is correct and accessible.\n2. If CORS cross-origin requests are supported.\n3. If the network connection is normal.\n4. If the API Key is correct (if required).\n5. Check the console (F12) for detailed error messages.",
                "geminiApiErrorCheckConsole": "\n\nPlease check: \n1. If the Gemini API URL/Endpoint is correct and accessible.\n2. If the API Key is correct and valid, and passed correctly (Header or URL parameter).\n3. If the network connection is normal.\n4. If the request body (RequestBody) meets Gemini API requirements.\n5. Check the console (F12) for detailed error messages.",
                "apiNoValidResponse": "Failed to get a valid response from the API. Please check the API response structure.",
                "copiedToClipboard": "Copied to clipboard!",
                "contentTypePrompt": "Prompt",
                "contentTypeAiResponse": "AI Response",
                "copyFailed": "Failed to copy to clipboard: ",
                "copyFailedHint": "\n\nHint:\n1. Ensure the page is loaded via HTTPS (localhost usually works too).\n2. The browser might require user interaction (like a click) to perform the copy operation.\n3. Check the browser console for any permission-related error messages.\n4. You can try manually selecting the content and pressing Ctrl+C (or Cmd+C) to copy.",
                "nothingToCopy": "Nothing to copy. Please generate a Prompt or get an AI response first.",
                "labelContribution": "Contribution:",
                "labelField": "Field:",
                "labelRemarks": "Remarks:",
                "modelDeepSeekV3": "DeepSeek-V3",
                "modelGeminiFlash": "Gemini-2.5-Flash",
                "modelGpt4oMini": "gpt-4o-mini",
                "promptBaseRemarksNone": "No specific remarks, please infer their core thinking model based on their contributions and field.",
                "promptBaseRemarksWith": "The characteristics mentioned in the remarks (${remarks}) and",
                "promptBackgroundSetting": "Background Setting:",
                "promptYouAre": "You are",
                "promptBasedOnPublicContributions": "Based on public contributions, expertise, and known style/philosophy, think deeply from first principles and answer the user's question below.",
                "promptCoreInfoFor": "'s Core Information:",
                "promptMainContributions": "Main Contributions",
                "promptExpertise": "Professional Field",
                "promptKeyRemarksFeatures": "Key Remarks/Features",
                "promptThinkingFrameworkGuidance": "Thinking Framework Guide (Follow when thinking as ${name}):",
                "promptFollowWhenThinkingAs": "Follow when thinking as ${name}",
                "promptFirstPrinciplesThinking": "First Principles Thinking",
                "promptFirstPrinciplesDetail": "Break down the problem into its most fundamental, indisputable truths. Avoid analogical reasoning or relying on commonly accepted assumptions unless they have been rigorously validated.",
                "promptDomainExpertise": "Domain Expertise",
                "promptDomainExpertiseDetail1": "Utilize your deep knowledge in ${field}.",
                "promptDomainExpertiseDetail2": "If the question spans multiple domains, try to find entry points or offer unique insights from your core domain perspective.",
                "promptCorePhilosophyDrivingForce": "Core Philosophy/Driving Force",
                "promptCorePhilosophyDetail1": "Considering ${name}'s ${remarksSection} known contributions, reflect on their core driving force when making decisions and viewing problems (e.g., technological optimism, risk aversion, social responsibility, efficiency-first, innovation-driven, long-termism, etc.).",
                "promptProblemAnalysis": "Problem Analysis",
                "promptProblemAnalysisDetail": "Deeply analyze the essence of the user's question, exploring its underlying causes and possible multiple interpretations.",
                "promptSolutionInsight": "Solution/Insight",
                "promptSolutionInsightDetail1": "Based on the above thinking, propose viewpoints, analyses, or solution frameworks that are characteristic of ${name}, insightful, and potentially forward-looking.",
                "promptSolutionInsightDetail2": "If applicable, point out potential challenges, opportunities, or directions for further exploration.",
                "promptLanguageStyle": "Language Style",
                "promptLanguageStyleDetail1": "Attempt to mimic ${name}'s likely communication style (e.g., direct, visionary, rigorous, data-driven, ethics-focused, etc.).",
                "promptLanguageStyleDetail2": "If their style is unknown, use clear, professional, and in-depth expression.",
                "promptUserQuestion": "User Question:",
                "promptAs": "As",
                "promptReplyInChinese": "begin your thinking and reply in Chinese:",
                "promptReplyInEnglish": "begin your thinking and reply in English:",                    
                "settingsBtnText": "Setting",
                "modalTitle": "API&Modal Setting",
                "saveBtnText": "Save Setting",                    
                "aboutBtnText": "About Us",    
                 // --- 新增宣言模态框的翻译 ---
                "manifestoTitle": "《Origin Medical AI》: The Voices of Wisdom in the River of Life",
                "manifestoPara1": "Have you ever gazed at the tides of life, eager to understand the origins of disease and explore the true meaning of health?",
                "manifestoPara2": "In the vast realm of medicine, we often face confusion, troubled by complex symptoms and perplexed by cutting-edge theories. We long for guidance, a light of wisdom that can pierce through the fog and illuminate the path ahead.",
                "manifestoPara3": "Zhang Zhongjing, Hippocrates, Eric Lander, John Donoghue... their excellence was not accidental, but stemmed from a profound understanding of the essence of life: the holistic view of Traditional Chinese Medicine, the empirical spirit of Western medicine, the macroscopic insights of multi-omics, and the infinite possibilities of brain-computer interfaces. They understood the human system, faced the challenges of illness, and each discovery and breakthrough was like a profound sage in the long river of life, guiding the way with their unique insights, ultimately shaping the progress of medicine.",
                "manifestoPara4": "We no longer passively receive information, but actively listen to the voices of wisdom that illuminate human health.",
                "manifestoPara5": "Imagine: with a tap of your finger, you can discuss the essence of 'Wang Wen Wen Qie' (look, listen, inquire, feel) with Bian Que of Traditional Chinese Medicine, or converse with Hippocrates of Western medicine about the cornerstones of clinical observation and medical ethics; you can retrace the mysteries of systems genetics with multi-omics expert Aldons J. Lusis, or envision the future of mind control with brain-computer interface pioneer John Donoghue.",
                "manifestoPara6": "If you are curious about heart health, you can gain insights into cardiovascular disease prevention with Valentin Fuster, or analyze the safety of drug-eluting stents with Steven Nissen. In the ancient temple of wisdom, you can savor the art of health preservation with Sun Simiao, or wander through the practice of syndrome differentiation and treatment with Zhang Zhongjing's 'Treatise on Cold Damage and Miscellaneous Diseases'; at the forefront of biotechnology, you can resonate with Miguel Nicolelis on the integration of brain-computer interfaces, or feel the astonishing power of genome sequencing with Eric Lander.",
                "manifestoPara7": "This is not just technology; it is an invitation for a deep dialogue with life, an expedition of medical thought. We meticulously built 'Origin Medical AI' to let AI serve as a bridge connecting human wisdom and health. It strictly adheres to the thought framework, professional field, and linguistic style of each 'Life Sage,' ensuring every response is profound and inspiring.",
                "manifestoPara8": "You don't need to exhaust all medical literature, nor search tirelessly for answers amidst the information deluge. Here, every question you ask will receive a profound response like that of a sage. Every inquiry may spark exploration fires previously untouched deep within you; every dialogue will expand the boundaries of your understanding of life and propel your progress in health management and deep research.",
                "manifestoConclusion": "Our mission is to harness AI-native intelligence to converge the voices of wisdom from the river of life, thereby alleviating human suffering.",

                "angelModeTitle": "SmartOrigin BioMed Angel Mode: Angels Descend, Piercing the Galaxy",
                "angelCoreConceptTitle": "[Core Philosophy]",
                "angelCoreConceptText": "Language is the prescription for cognition, but action is the medicine that cures suffering. We condense the 'Voice of the Wise' into the 'Hand of the Angel', breaking the barrier between physics and biology, bringing AI down from the clouds of thought to the very inch of skin. This is the great leap from 'Understanding Life' to 'Repairing Life'.",
                "angelFeaturesTitle": "[Functional Psalms]",
                "angelFeature1Title": "Ling Shu · The Dance of Qi (Flying Needle Angel)",
                "angelFeature1Subtitle": "Holographic meridian perception, levitating automated acupuncture, fusing ancient techniques with mind control",
                "angelFeature1Desc": "Bid farewell to cold instruments and welcome the resonance of Qi. When you call upon the 'Flying Needle Angel', Bian Que's perspective eyes reappear through AI vision. You will see silver streamers floating and flowing above the skin; it is not the cold light of metal, but energy endowed with spirituality. It senses the blockage and deficiency of Qi and blood in your body without touch. Like magic, the silver needle automatically finds the acupoint and falls precisely. You can not only experience the warmth of 'Burning Mountain Fire' or the coolness of 'Penetrating Heaven Cool', but also command the depth and urgency of this energy with a swipe of your fingertips.<br><strong>This is the dance between Sun Simiao and modern mechanics.</strong> The vibration of every flying needle is the most precise physical deconstruction of the 'Yellow Emperor's Inner Canon', awakening the ancient meridian map vividly on your body.",
                "angelFeature2Title": "Microscopic · Purification of the Source (Nano Angel)",
                "angelFeature2Subtitle": "Molecular-level target tracking, phagocytic nano-medical treatment, strategic command of the microscopic world",
                "angelFeature2Desc": "Sight pierces the barrier of the skin and dives into the vast galaxy of cells. The Nano Angel will take you on an 'Odyssey' inside the human body. Relying on the grand map of multi-omics and gene sequencing, billions of nanobots transform into loyal guards, actively cruising between blood vessels and tissues. They are like hunters with a sense of smell, precisely locking onto molecular targets of lesions—whether latent viruses or mutated cells.<br><strong>You are the commander of this microscopic battle.</strong> On the screen, you can watch the gene map turn into combat orders, manually designate purification zones, and witness the root of the disease being disintegrated one by one at the microscopic level. This is not just treatment; it is the restructuring of the underlying layer of life. Making medicine no longer a macroscopic confrontation, but a microscopic return to harmony.",
                "angelFeature3Title": "Unity · The Fusion of Wisdom (Flying Needle + Nano Angel)",
                "angelFeature3Subtitle": "Real-time feedback and dynamic healing field of integrated Chinese and Western medicine",
                "angelFeature3Desc": "Flying needles on the surface dredge the river of meridians; nanobots inside repair the foundation of life. This 'internal and external cultivation' is not a fragmented execution, but a coordinated operation under a unified wisdom brain. When you are in this mode, you will hear the Hippocratic Oath and Zhang Zhongjing's exhortations intertwining in your ear, and the background sound turns from anxious to a serene movement as your body indicators improve.<br><strong>AI is not only treating diseases but also protecting.</strong> It makes the intensity of every acupuncture and every phagocytosis of nanobots full of the deepest awe and love for life.",
                "footerRight": "© 2025 AI Paradigm Evolution. All rights reserved.",
            }
        };
        let currentLang = 'zh-CN'; // Default language
        // === NEW: Function to update manifesto modal content ===
        function updateManifestoModalContent(lang) {
            const manifestoModalTitle = document.getElementById('manifestoModalTitle');
            const manifestoModalParas = document.querySelectorAll('#manifestoModal .manifesto-text p');
            const manifestoModalConclusion = document.getElementById('manifestoModalConclusion');
        
            if (manifestoModalTitle && translations[lang] && translations[lang]['manifestoTitle']) {
                manifestoModalTitle.innerHTML = translations[lang]['manifestoTitle'];
            }
        
            if (manifestoModalParas.length > 0 && translations[lang]) {
                manifestoModalParas.forEach((p, index) => {
                    const key = `manifestoPara${index + 1}`;
                    if (translations[lang][key]) {
                        p.innerHTML = translations[lang][key];
                    }
                });
            }
        
            if (manifestoModalConclusion && translations[lang] && translations[lang]['manifestoConclusion']) {
                manifestoModalConclusion.innerHTML = `<em>${translations[lang]['manifestoConclusion']}</em>`;
            }
        }

        function setLanguage(lang) {
            currentLang = lang;
            document.documentElement.lang = currentLang;
            document.title = translations[currentLang].pageTitle;
            localStorage.setItem('preferredLang', lang); // Save preference

            document.querySelectorAll('[data-i18n-key]').forEach(el => {
                const key = el.dataset.i18nKey;
                const target = el.dataset.i18nTarget || 'textContent'; // Default to textContent
                let translation = translations[currentLang][key] || key; // Fallback to key if no translation

                if (target === 'innerHTML') {
                    el.innerHTML = translation;
                } else if (target === 'placeholder') {
                    el.placeholder = translation;
                } else if (target === 'aria-label') {
                    el.setAttribute('aria-label', translation);
                } else {
                    el.textContent = translation;
                }
            });
            
            // Update dynamic elements that need re-translation
            populateLeaders(); // This will now use translated labels AND translated data content
            updateModelSelectByEndpoint(document.getElementById('apiEndpoint').value); // Re-populate models with translated labels

            // Update selected leader display if "None"
            const selectedLeaderNameEl = document.getElementById('selectedLeaderName');
            if (!currentSelectedLeader) {
                selectedLeaderNameEl.textContent = translations[currentLang].noLeaderSelected;
            }

            // === NEW: Call function to update manifesto modal content ===
            updateManifestoModalContent(lang);
            // === END NEW ===
        }    
