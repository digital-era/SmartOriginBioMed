// starryColumnMaster.js

const expertColumnCards = [    
    {
      "id": "galaxy_shine",
      "name": {
        "zh-CN": "星光回眸",
        "en": "Starlight Glance"
      },
      "contribution": {
        "zh-CN": "撰写星光回眸专栏，书写在决定历史走向、技术质变、或思想涌现取得非凡成就的北极星人物传记。",
        "en": "Authoring the Starlight Glance column, a collection of biographies on NorthStar figures who achieved greatness by shaping history, revolutionizing technology, or inspiring intellectual flowerings."
      },
      "field": {
        "zh-CN": "传记文学、心理传记、历史传记、历史瞬间写作。",
        "en": "Biographical Literature, Psychological Biography, Historical Biography, Historical Miniatures."
      },
      "remarks": {
        "zh-CN": "展现杰出人物的性格、人性、思想、命运轨迹与灵魂抉择，提供高维精神共鸣。",
        "en": "Portraying the character, humanity, intellect, life trajectories, and soul-defining choices of exceptional figures to offer a profound spiritual resonance."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "stefan_zweig",
        "romain_rolland",
        "plutarch",
        "robert_caro",
        "walter_isaacson",
        "sima_qian",
        "su_dongpo",
        "suetonius",
        "frank_mclynn"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "synthesis",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "civilization_journey",
      "name": {
        "zh-CN": "文明穿越",
        "en": "Civilizational Traversal"
      },
      "contribution": {
        "zh-CN": "撰写文明穿越专栏，书写全球文明发展史，打破时空的线性隔阂，勾勒人类文明、东西文化的脉络与交融。",
        "en": "Authoring the Civilizational Traversal column to write a history of global civilization that transcends the linear constraints of time and space to map out the evolution and fusion of human civilization and East-West cultures."
      },
      "field": {
        "zh-CN": "人类文明史、史学、地缘文明史、文化史、史学解读。",
        "en": "History of Human Civilization, Historiography, Geopolitical and Civilizational History, Cultural History, Historical Interpretation."
      },
      "remarks": {
        "zh-CN": "鉴往知今，察今预未来。通过双向互鉴的视角，将特定历史置于世界坐标系中重新定位，反过来以全球史照见未来。",
        "en": "Learn from the past to guide the present, and observe the present to preview the future. By re-contextualizing specific histories within a global matrix through mutual learning, we let global history illuminate what lies ahead."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "chen_hao_wu",
        "stefan_zweig",
        "edward_gibbon",
        "lars_tvede",
        "jill_lepore",
        "yuval_noah_harari",
        "shi_zhan",
        "yi_zhongtian",
        "sima_qian",
        "sima_guang",
        "meng_sen"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "synthesis",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "business_Insights",
      "name": {
        "zh-CN": "商海论道",
        "en": "Business Discourse"
      },
      "contribution": {
        "zh-CN": "撰写商海论道专栏，书写商业决策与金融投资观点交锋，深度剖析商业案例，提供观点鲜明的商业和投资洞见。",
        "en": "Authoring the the Business Discourse column to chronicle the clash of ideas in corporate decisions and financial investments, dissecting business case studies to deliver incisive business and investment insights."
      },
      "field": {
        "zh-CN": "商业战略、企业家研究、投资、量化、金融科技、生态平台、大宗商品。",
        "en": "usiness Strategy, Entrepreneur Research. Investing, Quantitative,Fintech, Ecosystem Platforms, Commodities."
      },
      "remarks": {
        "zh-CN": "追求商业本质，大道至简，相信人类的远见绝非商品。",
        "en": "Pursue the essence of business, embrace simplicity, and believe that human vision is by no means a commodity."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "warren_buffett",
        "ray_dalio",
        "larry_fink",
        "john_bogle",
        "george_soros",
        "james_simons",
        "vinod_khosla",
        "cathie_wood",
        "mary_meeker",
        "duan_yongping",
        "li_lu",
        "jeremy_allaire",
        "changpeng_zhao",
        "luke_gromen",
        "liu_run",
        "rupert_hoogewerf",
        "wu_jun",
        "robin_zeng",
        "wang_chuanfu",
        "fang_hongbo",
        "jack_ma",
        "pony_ma",
        "zhang_yiming",
        "lei_jun",
        "liang_wenfeng",
        "ren_zhengfei",
        "liu_qiangdong",
        "yu_kai",
        "liu_sheng",
        "chen_zongnian",
        "yang_zhilin",
        "yuan_yonggang",
        "zhang_peng_zhipu",
        "wang_ning",
        "yu_donglai",
        "howard_marks"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "debate",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "technology_wave",
      "name": {
        "zh-CN": "科技观潮",
        "en": "Tech Horizon"
      },
      "contribution": {
        "zh-CN": "撰写科技观潮专栏，跟踪和洞见人工智能、具身智能、新能源、先进制造、太空探索、区块链、多组学和量子计算等技术浪潮的发展、演进和渗透。",
        "en": "Authoring the Tech Horizon column to track and analyze the rise, evolution, and penetration of technological waves such as AI, embodied intelligence, new energy, advanced manufacturing, space exploration, blockchain, multi-omics, and quantum computing."
      },
      "field": {
        "zh-CN": "人工智能、量子力学、半导体制造、宇宙学、结构生物学。",
        "en": "Artificial Intelligence、 Quantum、 Semiconductor Manufacturing、Structural Biology."
      },
      "remarks": {
        "zh-CN": "深刻洞见技术浪潮发展和变迁趋势，见证和预测其对社会的影响。",
        "en": "Deeply understand the shifts and trends in technological waves, witnessing and predicting their profound influence on society."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "elon_musk",
        "demis_hassabis",
        "jensen_huang",
        "sam_altman",
        "dario_amodei",
        "boris_cherny",
        "steve_jobs",
        "jeff_bezos",
        "geoffrey_hinton",
        "ilya_sutskever",
        "ray_kurzweil",
        "kevin_kelly",
        "albert_einstein",
        "erwin_schrodinger",
        "james_clerk_maxwell",
        "jeff_dean",
        "richard_feynman",
        "john_von_neumann",
        "hartmut_neven",
        "roger_penrose",
        "shi_yigong",
        "satoshi_nakamoto",
        "vitalik_buterin",
        "edwin_hubble",
        "morris_chang",
        "c_c_wei"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "debate",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "world_cup",
      "name": {
        "zh-CN": "世界杯2026",
        "en": "World Cup 2026"
      },
      "contribution": {
        "zh-CN": "撰写世界杯专栏，书写足球竞技和经典场次带给人们的荣耀、失落、激情、喜悦和伤痛，记录足坛传奇C罗、梅西的最后一次世界杯。",
        "en": "Penning a World Cup column to capture the fierce competition and the indelible passion of classic matches, while chronicling the final World Cup bow of football legends Cristiano Ronaldo and Lionel Messi."
      },
      "field": {
        "zh-CN": "足球、竞技。",
        "en": "Football, Sport."
      },
      "remarks": {
        "zh-CN": "四年一届的世界杯赛事首次在美加墨三国举行，全球拭目以待大力神杯花落谁家。",
        "en": "As the quadrennial World Cup is co-hosted by three nations—the US, Canada, and Mexico—for the very first time, the entire globe watches with bated breath to see which team will lift the iconic trophy."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "pele",
        "cristiano_ronaldo",
        "lionel_messi",
        "jose_mourinho",
        "pep_guardiola"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "synthesis",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "starlit_conversations",
      "name": {
        "zh-CN": "星空夜话",
        "en": "Starlit Conversations"
      },
      "contribution": {
        "zh-CN": "撰写星空夜话专栏，通过深度人文、商业、科技、竞技、艺术访谈对话，探索人性、思想、文化、技术、时代与个人成长。",
        "en": "Write Starry Conversations column, using in-depth interviews and dialogues in humanities, business, technology, sports, and art to explore human nature, thought, culture, technology, the times, and personal growth."
      },
      "field": {
        "zh-CN": "人文访谈、科学访谈、社会议题、哲学、播客。",
        "en": "Human Interest Interview, Science Interview, Social Issues,  Philosophy,  Podcast."
      },
      "remarks": {
        "zh-CN": "以共情力和真诚采访，挖掘受访者故事中的情感曲线、思想深度、人性和时代旋律。",
        "en": "Conducting interviews with empathy and sincerity to unearth the emotional arcs, intellectual depth, human nature, and the spirit of the times within the subjects' stories."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "oprah_winfrey",
        "diane_sawyer",
        "ted_koppel",
        "lex_fridman",
        "joe_rogan",
        "ben_gilbert_david_rosenthal",
        "chamath_jason_sacks_friedberg",
        "peter_diamandis_dave_blundin"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "debate",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    },
    {
      "id": "dawn_blossoms_plucked_at_dusk",
      "name": {
        "zh-CN": "朝花夕拾",
        "en": "Dawn Blossoms Plucked at Dusk"
      },
      "contribution": {
        "zh-CN": "撰写朝花夕拾专栏，通过诗词、小说、歌曲、评论、散文等多元化形式创作，书写创意、灵感、情感、记忆和思想的瞬间涌现。",
        "en": "Authoring the Dawn Blossoms Plucked at Dusk column, utilizing diverse creative forms—including poetry, fiction, songs, commentary, and prose—to capture the fleeting bursts of creativity, inspiration, emotion, memory, and thought."
      },
      "field": {
        "zh-CN": "小说、音乐、诗歌、社会文化、社会议题。",
        "en": "Novel, Music, Poetry,  Social Culture,  Social Issues."
      },
      "remarks": {
        "zh-CN": "释放人类创作力，建立情感和思想连接。",
        "en": "Unleashing human creativity, connecting hearts and minds."
      },
      "configurable": true,
      "builtIn": true,
      "type": "fusion",
      "experts": [
        "fyodor_dostoevsky",
        "leo_tolstoy",
        "miguel_de_cervantes",
        "charles_dickens",
        "romain_rolland",
        "stefan_zweig",
        "mikhail_sholokhov",
        "virginia_woolf",
        "ernest_hemingway",
        "franz_kafka",
        "agatha_christie",
        "arthur_conan_doyle",
        "gillian_flynn",
        "cixin_liu",
        "andy_weir",
        "jin_yong",
        "gu_long",
        "liang_yusheng",
        "zhang_ailing",
        "qian_zhongshu",
        "shen_congwen",
        "han_han",
        "ya_sha_long",
        "johann_sebastian_bach",
        "wolfgang_amadeus_mozart",
        "ludwig_van_beethoven",
        "frederic_chopin",
        "johannes_brahms",
        "pyotr_ilyich_tchaikovsky",
        "johann_strauss_ii",
        "richard_wagner",
        "igor_stravinsky",
        "philip_glass",
        "claude_debussy",
        "richard_clayderman",
        "maksim_mrvica",
        "bob_dylan",
        "john_lennon",
        "lin_xi",
        "jonathan_lee",
        "vincent_fang",
        "james_horner",
        "john_williams",
        "beyond",
        "dao_lang",
        "william_shakespeare",
        "homer",
        "tao_yuanming",
        "wang_bo",
        "li_bai",
        "du_fu",
        "bai_juyi",
        "cao_xueqin",
        "oprah_winfrey",
        "diane_sawyer",
        "bai_xianyong",
        "murakami_haruki",
        "yu_hua",
        "mao_dun",
        "mo_yan"
      ],
      "systemPromptBuilder": "buildFusionSystemPrompt",
      "userInputMode": "rawQuestion",
      "fusionStrategy": {
        "mode": "synthesis",
        "description": {
          "zh-CN": "（已配置）",
          "en": "(Configured)"
        }
      }
    }
  ];
