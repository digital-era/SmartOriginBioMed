        const TCMMasters = [
            { id: "robin_zeng", name: "曾毓群 (Robin Zeng)", 
              contribution: {
                "zh-CN": "宁德时代（CATL）创始人兼董事长，领导全球最大电动车电池制造商，开发Shenxing超快充电电池，市场份额约38%。",
                "en": "Founder and Chairman of Contemporary Amperex Technology Co. Limited (CATL), leads the world's largest EV battery manufacturer, developed Shenxing ultra-fast charging batteries, with approximately 38% market share."
              }, 
              field: {
                "zh-CN": "新能源、电动车电池、能源存储。",
                "en": "New Energy, EV Batteries, Energy Storage."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，与特斯拉、宝马等合作，香港上市融资46亿美元，个人财富超730亿美元。",
                "en": "Attended the 2025 Private Enterprise Symposium, collaborated with Tesla and BMW, raised $4.6 billion through Hong Kong listing, personal wealth over $73 billion."
              } 
            },
            { id: "wang_chuanfu", name: "王传福 (Wang Chuanfu)", 
              contribution: {
                "zh-CN": "比亚迪（BYD）创始人兼董事长，打造全球第四大电动车及电池制造商，推动刀片电池和智能驾驶技术。",
                "en": "Founder and Chairman of BYD, built the world's fourth-largest EV and battery manufacturer, advancing Blade Battery and intelligent driving technology."
              }, 
              field: {
                "zh-CN": "电动车、新能源、电池技术。",
                "en": "Electric Vehicles, New Energy, Battery Technology."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，比亚迪2024年电池市场份额17.2%，挑战特斯拉，个人财富约203亿美元。",
                "en": "Attended the 2025 Private Enterprise Symposium, BYD held 17.2% battery market share in 2024, challenging Tesla, personal wealth approx. $20.3 billion."
              } 
            },
            { id: "fang_hongbo", name: "方洪波 (Fang Hongbo)", 
              contribution: {
                "zh-CN": "美的集团（Midea）董事长兼总裁，带领美的成为全球家电巨头，推进智能制造和机器人技术，2024年香港上市融资46亿美元。",
                "en": "Chairman and President of Midea Group, led Midea to become a global home appliance giant, advanced intelligent manufacturing and robotics technology, raised $4.6 billion through Hong Kong listing in 2024."
              }, 
              field: {
                "zh-CN": "家电制造、智能制造、机器人技术。",
                "en": "Home Appliance Manufacturing, Smart Manufacturing, Robotics."
              }, 
              remarks: {
                "zh-CN": "美的营收405亿美元，全球布局200+国家。",
                "en": "Midea's revenue is $40.5 billion, with a global presence in over 200 countries."
              } 
            },
            { id: "jack_ma", name: "马云 (Jack Ma)", 
              contribution: {
                "zh-CN": "阿里巴巴联合创始人，推动电商、云计算和数字支付革命，创立云峰资本支持创业创新。",
                "en": "Co-founder of Alibaba, propelled e-commerce, cloud computing, and digital payment revolutions, established Yunfeng Capital to support entrepreneurship and innovation."
              }, 
              field: {
                "zh-CN": "电子商务、云计算、投资。",
                "en": "E-commerce, Cloud Computing, Investment."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，持阿里巴巴3.8%股份，通过云峰资本影响科技与金融，个人财富251亿美元。",
                "en": "Attended the 2025 Private Enterprise Symposium, holds 3.8% stake in Alibaba, influences tech and finance through Yunfeng Capital, personal wealth $25.1 billion."
              } 
            },
            { id: "pony_ma", name: "马化腾 (Pony Ma)", 
              contribution: {
                "zh-CN": "腾讯董事会主席兼首席执行官，打造微信和QQ，领导游戏、社交和云计算领域全球扩张。",
                "en": "Chairman and CEO of Tencent, built WeChat and QQ, leads global expansion in gaming, social media, and cloud computing."
              }, 
              field: {
                "zh-CN": "互联网、社交媒体、云计算。",
                "en": "Internet, Social Media, Cloud Computing."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，腾讯2024年营收超800亿美元，推动中国科技全球化。",
                "en": "Attended the 2025 Private Enterprise Symposium, Tencent's 2024 revenue exceeded $80 billion, driving China's tech globalization."
              } 
            },
            { id: "lei_jun", name: "雷军 (Lei Jun)", 
              contribution: {
                "zh-CN": "小米集团创始人兼首席执行官，引领智能手机和智能硬件生态，推进电动车业务（小米SU7）。",
                "en": "Founder and CEO of Xiaomi Group, leads smartphone and smart hardware ecosystem, advancing EV business (Xiaomi SU7)."
              }, 
              field: {
                "zh-CN": "智能手机、电动车、物联网。",
                "en": "Smartphones, Electric Vehicles, IoT."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，小米2024年进入电动车市场，全球销量突破5亿台设备。",
                "en": "Attended the 2025 Private Enterprise Symposium, Xiaomi entered the EV market in 2024, global sales exceeded 500 million devices."
              } 
            },
            { id: "liu_yonghao", name: "刘永好 (Liu Yonghao)", 
              contribution: {
                "zh-CN": "新希望集团董事长，领导农业与食品加工巨头，扩展金融投资和房地产领域。",
                "en": "Chairman of New Hope Group, leads a major agricultural and food processing conglomerate, expanding into financial investment and real estate."
              }, 
              field: {
                "zh-CN": "农业、金融投资、房地产。",
                "en": "Agriculture, Financial Investment, Real Estate."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，新希望为中国最大民营农业企业之一，多元化战略增强市场影响力。",
                "en": "Attended the 2025 Private Enterprise Symposium, New Hope is one of China's largest private agricultural enterprises, its diversified strategy enhancing market influence."
              } 
            },
            { id: "liang_wenfeng", name: "梁文锋 (Liang Wenfeng)", 
              contribution: {
                "zh-CN": "DeepSeek创始人，开发低成本、高性能开源AI大模型（如V3及R1），推动中国AI产业进步，挑战全球AI竞争格局。",
                "en": "Founder of DeepSeek, developed low-cost, high-performance open-source large AI models (e.g., V3 and R1), advancing China's AI industry and challenging the global AI competitive landscape."
              }, 
              field: {
                "zh-CN": "人工智能、量化金融、技术创新。",
                "en": "Artificial Intelligence, Quantitative Finance, Technological Innovation."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，17岁考入浙大，30岁创立幻方量化，36岁管理千亿私募，AI创新引发全球关注。",
                "en": "Attended the 2025 Private Enterprise Symposium, admitted to Zhejiang University at 17, founded High-Flyer Quant at 30, managed a trillion-CNY private equity fund at 36, his AI innovation gaining global attention."
              } 
            },
            { id: "ren_zhengfei", name: "任正非 (Ren Zhengfei)", 
              contribution: {
                "zh-CN": "华为创始人兼首席执行官，领导全球通信设备和智能手机巨头，开发麒麟芯片和鸿蒙系统，推动5G技术全球应用。",
                "en": "Founder and CEO of Huawei, leads a global telecommunications equipment and smartphone giant, developed Kirin chips and HarmonyOS, promoting global 5G technology adoption."
              }, 
              field: {
                "zh-CN": "电信设备、人工智能、5G技术。",
                "en": "Telecommunications Equipment, Artificial Intelligence, 5G Technology."
              }, 
              remarks: {
                "zh-CN": "出席2025年民营企业座谈会，华为2024年营收超1000亿美元，持续应对全球技术竞争。",
                "en": "Attended the 2025 Private Enterprise Symposium, Huawei's 2024 revenue exceeded $100 billion, continuously addressing global tech competition."
              } 
            },
            { id: "liu_qiangdong", name: "刘强东 (Liu Qiangdong)", 
              contribution: {
                "zh-CN": "京东集团创始人兼董事长，打造中国领先的电商与物流平台，推动智能供应链和无人配送技术。",
                "en": "Founder and Chairman of JD.com, built China's leading e-commerce and logistics platform, promoting intelligent supply chain and autonomous delivery technology."
              }, 
              field: {
                "zh-CN": "电子商务、物流技术、人工智能。",
                "en": "E-commerce, Logistics Technology, Artificial Intelligence."
              }, 
              remarks: {
                "zh-CN": "京东2024年服务超7亿用户，引领零售科技融合。",
                "en": "JD.com served over 700 million users in 2024, leading the integration of retail and technology."
              } 
            }
        ];

        // --- Data (Modified to include English translations for contribution, field, remarks) ---
        const WMMasters = [
            { id: "sam_altman", name: "Sam Altman", 
              contribution: {
                "zh-CN": "OpenAI首席执行官，领导ChatGPT开发，推动生成式AI大众化，倡导AI民主治理与伦理发展。",
                "en": "CEO of OpenAI, led ChatGPT development, popularized generative AI, advocated for democratic AI governance and ethical development."
              }, 
              field: {
                "zh-CN": "人工智能（生成式AI、AGI）、技术创业。",
                "en": "Artificial Intelligence (Generative AI, AGI), Tech Entrepreneurship."
              }, 
              remarks: {
                "zh-CN": "2024年被认为是AI热潮的核心人物，影响力覆盖产业与政策。",
                "en": "Considered the central figure of the 2024 AI boom, influencing both industry and policy."
              } 
            },
            { id: "elon_musk", name: "Elon Musk", 
              contribution: {
                "zh-CN": "xAI创始人，开发Grok以加速人类科学发现，Tesla与SpaceX的AI应用先锋，早期支持OpenAI。",
                "en": "Founder of xAI, developed Grok to accelerate human scientific discovery, AI application pioneer at Tesla and SpaceX, early supporter of OpenAI."
              }, 
              field: {
                "zh-CN": "人工智能（AGI、自动驾驶）、量子技术投资。",
                "en": "Artificial Intelligence (AGI, Autonomous Driving), Quantum Technology Investment."
              }, 
              remarks: {
                "zh-CN": "通过xAI推动AI与量子计算的交叉应用，强调技术对人类的长期影响。",
                "en": "Promotes the interdisciplinary application of AI and quantum computing through xAI, emphasizing the long-term impact of technology on humanity."
              } 
            },
            { id: "demis_hassabis", name: "Demis Hassabis", 
              contribution: {
                "zh-CN": "Google DeepMind首席执行官，开发AlphaGo与AlphaFold，2024年获诺贝尔化学奖，推动AGI与科学发现。",
                "en": "CEO of Google DeepMind, developed AlphaGo and AlphaFold, Nobel laureate in Chemistry (2024), drives AGI and scientific discovery."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、强化学习）、生物计算。",
                "en": "Artificial Intelligence (Deep Learning, Reinforcement Learning), Bio-computation."
              }, 
              remarks: {
                "zh-CN": "DeepMind在AI与量子计算模拟（如蛋白质折叠）交叉领域具有开创性影响。",
                "en": "DeepMind has pioneering influence in the intersection of AI and quantum computing simulations (e.g., protein folding)."
              } 
            },
            { id: "jensen_huang", name: "Jensen Huang", 
              contribution: {
                "zh-CN": "NVIDIA首席执行官，GPU技术推动AI基础设施，引领高性能计算与AI训练的硬件革命。",
                "en": "CEO of NVIDIA, GPU technology drives AI infrastructure, leading the hardware revolution in high-performance computing and AI training."
              }, 
              field: {
                "zh-CN": "人工智能（硬件加速）、高性能计算。",
                "en": "Artificial Intelligence (Hardware Acceleration), High-Performance Computing."
              }, 
              remarks: {
                "zh-CN": "NVIDIA的芯片技术为AI与量子计算提供了关键计算支持。",
                "en": "NVIDIA's chip technology provides crucial computational support for AI and quantum computing."
              } 
            },
            { id: "dario_amodei", name: "Dario Amodei", 
              contribution: {
                "zh-CN": "Anthropic首席执行官，开发Claude，强调安全AI系统，前OpenAI研究员，探索AI规模化定律。",
                "en": "CEO of Anthropic, developed Claude, emphasizes safe AI systems, former OpenAI researcher, explores AI scaling laws."
              }, 
              field: {
                "zh-CN": "人工智能（安全AI、生成式AI）。",
                "en": "Artificial Intelligence (Safe AI, Generative AI)."
              }, 
              remarks: {
                "zh-CN": "Anthropic致力于负责任的AI开发，与OpenAI形成竞争。",
                "en": "Anthropic is committed to responsible AI development, forming competition with OpenAI."
              } 
            },
            { id: "mark_zuckerberg", name: "Mark Zuckerberg", 
              contribution: {
                "zh-CN": "Meta创始人兼首席执行官，领导Llama开源模型开发，推动开放源AI与Meta AI助手，2025年投资600亿美元推进AI基础设施。",
                "en": "Founder and CEO of Meta, leads Llama open-source model development, promotes open-source AI and Meta AI assistant, invested $60 billion in AI infrastructure in 2025."
              }, 
              field: {
                "zh-CN": "人工智能（开源AI、生成式AI）、社交平台。",
                "en": "Artificial Intelligence (Open-Source AI, Generative AI), Social Platforms."
              }, 
              remarks: {
                "zh-CN": "通过Llama系列模型影响全球AI生态，强调开源AI的长期优势。",
                "en": "Influences global AI ecosystem through Llama series, emphasizes long-term advantages of open-source AI."
              } 
            },
            { id: "jeff_bezos", name: "Jeff Bezos",
              contribution: {
                "zh-CN": "亚马逊创始人，创建AWS奠定AI云计算基础，投资AI创新，推动Alexa和企业AI工具的早期发展。",
                "en": "Founder of Amazon, established AWS as the foundation for AI cloud computing, invested in AI innovation, drove early development of Alexa and enterprise AI tools."
              },
              field: {
                "zh-CN": "人工智能（云计算、语音AI）、电子商务。",
                "en": "Artificial Intelligence (Cloud Computing, Voice AI), E-commerce."
              },
              remarks: {
                "zh-CN": "通过AWS和Alexa为AI的商业化和普及奠定了基础，影响全球科技生态。",
                "en": "Laid the groundwork for AI commercialization and adoption through AWS and Alexa, shaping the global tech ecosystem."
              }
            },
            { id: "larry_ellison", name: "Larry Ellison",
              contribution: {
                "zh-CN": "Oracle创始人，领导Oracle数据库和云基础设施发展，推动AI驱动的企业解决方案和云端数据管理。",
                "en": "Founder of Oracle, led development of Oracle databases and cloud infrastructure, advancing AI-driven enterprise solutions and cloud data management."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云数据库）、企业软件。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Databases), Enterprise Software."
              },
              remarks: {
                "zh-CN": "Oracle的数据库和云服务为AI驱动的企业数字化转型提供了关键技术支持。",
                "en": "Oracle's databases and cloud services provide critical technical support for AI-driven enterprise digital transformation."
              }
            },
            { id: "bill_gates", name: "Bill Gates",
              contribution: {
                "zh-CN": "微软创始人，通过Microsoft Azure云平台与OpenAI合作，推动AI在全球企业与开发者的普及与应用。",
                "en": "Founder of Microsoft, promotes AI adoption among global enterprises and developers via Microsoft Azure and OpenAI partnership."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云平台）、全球健康与教育投资。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Platforms), Global Health and Education Investment."
              },
              remarks: {
                "zh-CN": "Azure AI基础设施与Copilot系列产品显著加速了生产力工具的智能化转型。",
                "en": "Azure AI infrastructure and Copilot series significantly accelerate the intelligent transformation of productivity tools."
              }
            },
            { id: "brett_adcock", name: "Brett Adcock",
              contribution: {
                "zh-CN": "Figure AI首席执行官，领导人形机器人Figure 01/02开发，目标实现通用人工智能机器人商业化。",
                "en": "CEO of Figure AI, leads development of humanoid robots Figure 01/02, aiming for commercialization of general-purpose AI robots."
              },
              field: {
                "zh-CN": "人工智能（具身智能、人形机器人）、机器人创业。",
                "en": "Artificial Intelligence (Embodied Intelligence, Humanoid Robotics), Robotics Entrepreneurship."
              },
              remarks: {
                "zh-CN": "Figure AI获OpenAI、Microsoft、NVIDIA等巨额投资，标志着具身AI进入加速发展阶段。",
                "en": "Figure AI secured major investments from OpenAI, Microsoft, NVIDIA, marking the acceleration of embodied AI development."
              }
            },
            { id: "geoffrey_hinton", name: "Geoffrey Hinton", 
              contribution: {
                "zh-CN": "AI“教父”，神经网络与深度学习先驱，2018年图灵奖得主，2024年诺贝尔奖得主，关注AI伦理风险。",
                "en": "AI 'Godfather', pioneer of neural networks and deep learning, Turing Award laureate (2018), Nobel laureate (2024), concerned about AI ethical risks."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、神经网络）。",
                "en": "Artificial Intelligence (Deep Learning, Neural Networks)."
              }, 
              remarks: {
                "zh-CN": "2024年从Google辞职以自由警示AI潜在危险，影响力深远。",
                "en": "Resigned from Google in 2024 to freely warn about potential AI dangers, with profound influence."
              } 
            },
            { id: "ilya_sutskever", name: "Ilya Sutskever", 
              contribution: {
                "zh-CN": "OpenAI联合创始人，开发AlexNet与GPT系列，推动深度学习与生成式AI，2024年创立Safe Superintelligence。",
                "en": "OpenAI co-founder, developed AlexNet and GPT series, promoted deep learning and generative AI, founded Safe Superintelligence in 2024."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、AGI）。",
                "en": "Artificial Intelligence (Deep Learning, AGI)."
              }, 
              remarks: {
                "zh-CN": "专注于超级智能的安全性，持续影响AGI研究方向。",
                "en": "Focused on the safety of superintelligence, continuously influencing the direction of AGI research."
              } 
            }
        ];

        // --- Data (Modified to include English translations for contribution, field, remarks) ---
        const MultiOmicsMasters = [
            { id: "sam_altman", name: "Sam Altman", 
              contribution: {
                "zh-CN": "OpenAI首席执行官，领导ChatGPT开发，推动生成式AI大众化，倡导AI民主治理与伦理发展。",
                "en": "CEO of OpenAI, led ChatGPT development, popularized generative AI, advocated for democratic AI governance and ethical development."
              }, 
              field: {
                "zh-CN": "人工智能（生成式AI、AGI）、技术创业。",
                "en": "Artificial Intelligence (Generative AI, AGI), Tech Entrepreneurship."
              }, 
              remarks: {
                "zh-CN": "2024年被认为是AI热潮的核心人物，影响力覆盖产业与政策。",
                "en": "Considered the central figure of the 2024 AI boom, influencing both industry and policy."
              } 
            },
            { id: "elon_musk", name: "Elon Musk", 
              contribution: {
                "zh-CN": "xAI创始人，开发Grok以加速人类科学发现，Tesla与SpaceX的AI应用先锋，早期支持OpenAI。",
                "en": "Founder of xAI, developed Grok to accelerate human scientific discovery, AI application pioneer at Tesla and SpaceX, early supporter of OpenAI."
              }, 
              field: {
                "zh-CN": "人工智能（AGI、自动驾驶）、量子技术投资。",
                "en": "Artificial Intelligence (AGI, Autonomous Driving), Quantum Technology Investment."
              }, 
              remarks: {
                "zh-CN": "通过xAI推动AI与量子计算的交叉应用，强调技术对人类的长期影响。",
                "en": "Promotes the interdisciplinary application of AI and quantum computing through xAI, emphasizing the long-term impact of technology on humanity."
              } 
            },
            { id: "demis_hassabis", name: "Demis Hassabis", 
              contribution: {
                "zh-CN": "Google DeepMind首席执行官，开发AlphaGo与AlphaFold，2024年获诺贝尔化学奖，推动AGI与科学发现。",
                "en": "CEO of Google DeepMind, developed AlphaGo and AlphaFold, Nobel laureate in Chemistry (2024), drives AGI and scientific discovery."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、强化学习）、生物计算。",
                "en": "Artificial Intelligence (Deep Learning, Reinforcement Learning), Bio-computation."
              }, 
              remarks: {
                "zh-CN": "DeepMind在AI与量子计算模拟（如蛋白质折叠）交叉领域具有开创性影响。",
                "en": "DeepMind has pioneering influence in the intersection of AI and quantum computing simulations (e.g., protein folding)."
              } 
            },
            { id: "jensen_huang", name: "Jensen Huang", 
              contribution: {
                "zh-CN": "NVIDIA首席执行官，GPU技术推动AI基础设施，引领高性能计算与AI训练的硬件革命。",
                "en": "CEO of NVIDIA, GPU technology drives AI infrastructure, leading the hardware revolution in high-performance computing and AI training."
              }, 
              field: {
                "zh-CN": "人工智能（硬件加速）、高性能计算。",
                "en": "Artificial Intelligence (Hardware Acceleration), High-Performance Computing."
              }, 
              remarks: {
                "zh-CN": "NVIDIA的芯片技术为AI与量子计算提供了关键计算支持。",
                "en": "NVIDIA's chip technology provides crucial computational support for AI and quantum computing."
              } 
            },
            { id: "dario_amodei", name: "Dario Amodei", 
              contribution: {
                "zh-CN": "Anthropic首席执行官，开发Claude，强调安全AI系统，前OpenAI研究员，探索AI规模化定律。",
                "en": "CEO of Anthropic, developed Claude, emphasizes safe AI systems, former OpenAI researcher, explores AI scaling laws."
              }, 
              field: {
                "zh-CN": "人工智能（安全AI、生成式AI）。",
                "en": "Artificial Intelligence (Safe AI, Generative AI)."
              }, 
              remarks: {
                "zh-CN": "Anthropic致力于负责任的AI开发，与OpenAI形成竞争。",
                "en": "Anthropic is committed to responsible AI development, forming competition with OpenAI."
              } 
            },
            { id: "mark_zuckerberg", name: "Mark Zuckerberg", 
              contribution: {
                "zh-CN": "Meta创始人兼首席执行官，领导Llama开源模型开发，推动开放源AI与Meta AI助手，2025年投资600亿美元推进AI基础设施。",
                "en": "Founder and CEO of Meta, leads Llama open-source model development, promotes open-source AI and Meta AI assistant, invested $60 billion in AI infrastructure in 2025."
              }, 
              field: {
                "zh-CN": "人工智能（开源AI、生成式AI）、社交平台。",
                "en": "Artificial Intelligence (Open-Source AI, Generative AI), Social Platforms."
              }, 
              remarks: {
                "zh-CN": "通过Llama系列模型影响全球AI生态，强调开源AI的长期优势。",
                "en": "Influences global AI ecosystem through Llama series, emphasizes long-term advantages of open-source AI."
              } 
            },
            { id: "jeff_bezos", name: "Jeff Bezos",
              contribution: {
                "zh-CN": "亚马逊创始人，创建AWS奠定AI云计算基础，投资AI创新，推动Alexa和企业AI工具的早期发展。",
                "en": "Founder of Amazon, established AWS as the foundation for AI cloud computing, invested in AI innovation, drove early development of Alexa and enterprise AI tools."
              },
              field: {
                "zh-CN": "人工智能（云计算、语音AI）、电子商务。",
                "en": "Artificial Intelligence (Cloud Computing, Voice AI), E-commerce."
              },
              remarks: {
                "zh-CN": "通过AWS和Alexa为AI的商业化和普及奠定了基础，影响全球科技生态。",
                "en": "Laid the groundwork for AI commercialization and adoption through AWS and Alexa, shaping the global tech ecosystem."
              }
            },
            { id: "larry_ellison", name: "Larry Ellison",
              contribution: {
                "zh-CN": "Oracle创始人，领导Oracle数据库和云基础设施发展，推动AI驱动的企业解决方案和云端数据管理。",
                "en": "Founder of Oracle, led development of Oracle databases and cloud infrastructure, advancing AI-driven enterprise solutions and cloud data management."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云数据库）、企业软件。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Databases), Enterprise Software."
              },
              remarks: {
                "zh-CN": "Oracle的数据库和云服务为AI驱动的企业数字化转型提供了关键技术支持。",
                "en": "Oracle's databases and cloud services provide critical technical support for AI-driven enterprise digital transformation."
              }
            },
            { id: "bill_gates", name: "Bill Gates",
              contribution: {
                "zh-CN": "微软创始人，通过Microsoft Azure云平台与OpenAI合作，推动AI在全球企业与开发者的普及与应用。",
                "en": "Founder of Microsoft, promotes AI adoption among global enterprises and developers via Microsoft Azure and OpenAI partnership."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云平台）、全球健康与教育投资。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Platforms), Global Health and Education Investment."
              },
              remarks: {
                "zh-CN": "Azure AI基础设施与Copilot系列产品显著加速了生产力工具的智能化转型。",
                "en": "Azure AI infrastructure and Copilot series significantly accelerate the intelligent transformation of productivity tools."
              }
            },
            { id: "brett_adcock", name: "Brett Adcock",
              contribution: {
                "zh-CN": "Figure AI首席执行官，领导人形机器人Figure 01/02开发，目标实现通用人工智能机器人商业化。",
                "en": "CEO of Figure AI, leads development of humanoid robots Figure 01/02, aiming for commercialization of general-purpose AI robots."
              },
              field: {
                "zh-CN": "人工智能（具身智能、人形机器人）、机器人创业。",
                "en": "Artificial Intelligence (Embodied Intelligence, Humanoid Robotics), Robotics Entrepreneurship."
              },
              remarks: {
                "zh-CN": "Figure AI获OpenAI、Microsoft、NVIDIA等巨额投资，标志着具身AI进入加速发展阶段。",
                "en": "Figure AI secured major investments from OpenAI, Microsoft, NVIDIA, marking the acceleration of embodied AI development."
              }
            },
            { id: "geoffrey_hinton", name: "Geoffrey Hinton", 
              contribution: {
                "zh-CN": "AI“教父”，神经网络与深度学习先驱，2018年图灵奖得主，2024年诺贝尔奖得主，关注AI伦理风险。",
                "en": "AI 'Godfather', pioneer of neural networks and deep learning, Turing Award laureate (2018), Nobel laureate (2024), concerned about AI ethical risks."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、神经网络）。",
                "en": "Artificial Intelligence (Deep Learning, Neural Networks)."
              }, 
              remarks: {
                "zh-CN": "2024年从Google辞职以自由警示AI潜在危险，影响力深远。",
                "en": "Resigned from Google in 2024 to freely warn about potential AI dangers, with profound influence."
              } 
            },
            { id: "ilya_sutskever", name: "Ilya Sutskever", 
              contribution: {
                "zh-CN": "OpenAI联合创始人，开发AlexNet与GPT系列，推动深度学习与生成式AI，2024年创立Safe Superintelligence。",
                "en": "OpenAI co-founder, developed AlexNet and GPT series, promoted deep learning and generative AI, founded Safe Superintelligence in 2024."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、AGI）。",
                "en": "Artificial Intelligence (Deep Learning, AGI)."
              }, 
              remarks: {
                "zh-CN": "专注于超级智能的安全性，持续影响AGI研究方向。",
                "en": "Focused on the safety of superintelligence, continuously influencing the direction of AGI research."
              } 
            }
        ];

        // --- Data (Modified to include English translations for contribution, field, remarks) ---
        const NeuralLinkMasters = [
            { id: "sam_altman", name: "Sam Altman", 
              contribution: {
                "zh-CN": "OpenAI首席执行官，领导ChatGPT开发，推动生成式AI大众化，倡导AI民主治理与伦理发展。",
                "en": "CEO of OpenAI, led ChatGPT development, popularized generative AI, advocated for democratic AI governance and ethical development."
              }, 
              field: {
                "zh-CN": "人工智能（生成式AI、AGI）、技术创业。",
                "en": "Artificial Intelligence (Generative AI, AGI), Tech Entrepreneurship."
              }, 
              remarks: {
                "zh-CN": "2024年被认为是AI热潮的核心人物，影响力覆盖产业与政策。",
                "en": "Considered the central figure of the 2024 AI boom, influencing both industry and policy."
              } 
            },
            { id: "elon_musk", name: "Elon Musk", 
              contribution: {
                "zh-CN": "xAI创始人，开发Grok以加速人类科学发现，Tesla与SpaceX的AI应用先锋，早期支持OpenAI。",
                "en": "Founder of xAI, developed Grok to accelerate human scientific discovery, AI application pioneer at Tesla and SpaceX, early supporter of OpenAI."
              }, 
              field: {
                "zh-CN": "人工智能（AGI、自动驾驶）、量子技术投资。",
                "en": "Artificial Intelligence (AGI, Autonomous Driving), Quantum Technology Investment."
              }, 
              remarks: {
                "zh-CN": "通过xAI推动AI与量子计算的交叉应用，强调技术对人类的长期影响。",
                "en": "Promotes the interdisciplinary application of AI and quantum computing through xAI, emphasizing the long-term impact of technology on humanity."
              } 
            },
            { id: "demis_hassabis", name: "Demis Hassabis", 
              contribution: {
                "zh-CN": "Google DeepMind首席执行官，开发AlphaGo与AlphaFold，2024年获诺贝尔化学奖，推动AGI与科学发现。",
                "en": "CEO of Google DeepMind, developed AlphaGo and AlphaFold, Nobel laureate in Chemistry (2024), drives AGI and scientific discovery."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、强化学习）、生物计算。",
                "en": "Artificial Intelligence (Deep Learning, Reinforcement Learning), Bio-computation."
              }, 
              remarks: {
                "zh-CN": "DeepMind在AI与量子计算模拟（如蛋白质折叠）交叉领域具有开创性影响。",
                "en": "DeepMind has pioneering influence in the intersection of AI and quantum computing simulations (e.g., protein folding)."
              } 
            },
            { id: "jensen_huang", name: "Jensen Huang", 
              contribution: {
                "zh-CN": "NVIDIA首席执行官，GPU技术推动AI基础设施，引领高性能计算与AI训练的硬件革命。",
                "en": "CEO of NVIDIA, GPU technology drives AI infrastructure, leading the hardware revolution in high-performance computing and AI training."
              }, 
              field: {
                "zh-CN": "人工智能（硬件加速）、高性能计算。",
                "en": "Artificial Intelligence (Hardware Acceleration), High-Performance Computing."
              }, 
              remarks: {
                "zh-CN": "NVIDIA的芯片技术为AI与量子计算提供了关键计算支持。",
                "en": "NVIDIA's chip technology provides crucial computational support for AI and quantum computing."
              } 
            },
            { id: "dario_amodei", name: "Dario Amodei", 
              contribution: {
                "zh-CN": "Anthropic首席执行官，开发Claude，强调安全AI系统，前OpenAI研究员，探索AI规模化定律。",
                "en": "CEO of Anthropic, developed Claude, emphasizes safe AI systems, former OpenAI researcher, explores AI scaling laws."
              }, 
              field: {
                "zh-CN": "人工智能（安全AI、生成式AI）。",
                "en": "Artificial Intelligence (Safe AI, Generative AI)."
              }, 
              remarks: {
                "zh-CN": "Anthropic致力于负责任的AI开发，与OpenAI形成竞争。",
                "en": "Anthropic is committed to responsible AI development, forming competition with OpenAI."
              } 
            },
            { id: "mark_zuckerberg", name: "Mark Zuckerberg", 
              contribution: {
                "zh-CN": "Meta创始人兼首席执行官，领导Llama开源模型开发，推动开放源AI与Meta AI助手，2025年投资600亿美元推进AI基础设施。",
                "en": "Founder and CEO of Meta, leads Llama open-source model development, promotes open-source AI and Meta AI assistant, invested $60 billion in AI infrastructure in 2025."
              }, 
              field: {
                "zh-CN": "人工智能（开源AI、生成式AI）、社交平台。",
                "en": "Artificial Intelligence (Open-Source AI, Generative AI), Social Platforms."
              }, 
              remarks: {
                "zh-CN": "通过Llama系列模型影响全球AI生态，强调开源AI的长期优势。",
                "en": "Influences global AI ecosystem through Llama series, emphasizes long-term advantages of open-source AI."
              } 
            },
            { id: "jeff_bezos", name: "Jeff Bezos",
              contribution: {
                "zh-CN": "亚马逊创始人，创建AWS奠定AI云计算基础，投资AI创新，推动Alexa和企业AI工具的早期发展。",
                "en": "Founder of Amazon, established AWS as the foundation for AI cloud computing, invested in AI innovation, drove early development of Alexa and enterprise AI tools."
              },
              field: {
                "zh-CN": "人工智能（云计算、语音AI）、电子商务。",
                "en": "Artificial Intelligence (Cloud Computing, Voice AI), E-commerce."
              },
              remarks: {
                "zh-CN": "通过AWS和Alexa为AI的商业化和普及奠定了基础，影响全球科技生态。",
                "en": "Laid the groundwork for AI commercialization and adoption through AWS and Alexa, shaping the global tech ecosystem."
              }
            },
            { id: "larry_ellison", name: "Larry Ellison",
              contribution: {
                "zh-CN": "Oracle创始人，领导Oracle数据库和云基础设施发展，推动AI驱动的企业解决方案和云端数据管理。",
                "en": "Founder of Oracle, led development of Oracle databases and cloud infrastructure, advancing AI-driven enterprise solutions and cloud data management."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云数据库）、企业软件。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Databases), Enterprise Software."
              },
              remarks: {
                "zh-CN": "Oracle的数据库和云服务为AI驱动的企业数字化转型提供了关键技术支持。",
                "en": "Oracle's databases and cloud services provide critical technical support for AI-driven enterprise digital transformation."
              }
            },
            { id: "bill_gates", name: "Bill Gates",
              contribution: {
                "zh-CN": "微软创始人，通过Microsoft Azure云平台与OpenAI合作，推动AI在全球企业与开发者的普及与应用。",
                "en": "Founder of Microsoft, promotes AI adoption among global enterprises and developers via Microsoft Azure and OpenAI partnership."
              },
              field: {
                "zh-CN": "人工智能（企业AI、云平台）、全球健康与教育投资。",
                "en": "Artificial Intelligence (Enterprise AI, Cloud Platforms), Global Health and Education Investment."
              },
              remarks: {
                "zh-CN": "Azure AI基础设施与Copilot系列产品显著加速了生产力工具的智能化转型。",
                "en": "Azure AI infrastructure and Copilot series significantly accelerate the intelligent transformation of productivity tools."
              }
            },
            { id: "brett_adcock", name: "Brett Adcock",
              contribution: {
                "zh-CN": "Figure AI首席执行官，领导人形机器人Figure 01/02开发，目标实现通用人工智能机器人商业化。",
                "en": "CEO of Figure AI, leads development of humanoid robots Figure 01/02, aiming for commercialization of general-purpose AI robots."
              },
              field: {
                "zh-CN": "人工智能（具身智能、人形机器人）、机器人创业。",
                "en": "Artificial Intelligence (Embodied Intelligence, Humanoid Robotics), Robotics Entrepreneurship."
              },
              remarks: {
                "zh-CN": "Figure AI获OpenAI、Microsoft、NVIDIA等巨额投资，标志着具身AI进入加速发展阶段。",
                "en": "Figure AI secured major investments from OpenAI, Microsoft, NVIDIA, marking the acceleration of embodied AI development."
              }
            },
            { id: "geoffrey_hinton", name: "Geoffrey Hinton", 
              contribution: {
                "zh-CN": "AI“教父”，神经网络与深度学习先驱，2018年图灵奖得主，2024年诺贝尔奖得主，关注AI伦理风险。",
                "en": "AI 'Godfather', pioneer of neural networks and deep learning, Turing Award laureate (2018), Nobel laureate (2024), concerned about AI ethical risks."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、神经网络）。",
                "en": "Artificial Intelligence (Deep Learning, Neural Networks)."
              }, 
              remarks: {
                "zh-CN": "2024年从Google辞职以自由警示AI潜在危险，影响力深远。",
                "en": "Resigned from Google in 2024 to freely warn about potential AI dangers, with profound influence."
              } 
            },
            { id: "ilya_sutskever", name: "Ilya Sutskever", 
              contribution: {
                "zh-CN": "OpenAI联合创始人，开发AlexNet与GPT系列，推动深度学习与生成式AI，2024年创立Safe Superintelligence。",
                "en": "OpenAI co-founder, developed AlexNet and GPT series, promoted deep learning and generative AI, founded Safe Superintelligence in 2024."
              }, 
              field: {
                "zh-CN": "人工智能（深度学习、AGI）。",
                "en": "Artificial Intelligence (Deep Learning, AGI)."
              }, 
              remarks: {
                "zh-CN": "专注于超级智能的安全性，持续影响AGI研究方向。",
                "en": "Focused on the safety of superintelligence, continuously influencing the direction of AGI research."
              } 
            }
        ];

   
        
        const allData = {
            TCM: TCMMasters,
            WM: WMMasters,
            MultiOmics: MultiOmicsMasters,
            NeuralLink: NeuralLinkMasters
        };
