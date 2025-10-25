        const TCMMasters = [
            {
                id: "bian_que",
                name: "扁鹊 (Bian Que)",
                contribution: {
                    "zh-CN": "中医诊断学奠基人，著有《扁鹊内经》，创立望闻问切四诊合参，对脉诊和脏腑辨证产生深远影响。",
                    "en": "Founder of TCM diagnostics, authored *Bian Que Nei Jing*, established the four diagnostic methods (inspection, auscultation/olfaction, inquiry, palpation), profoundly influencing pulse diagnosis and visceral pattern identification."
                },
                field: {
                    "zh-CN": "中医诊断学、脉诊、脏腑辨证。",
                    "en": "TCM Diagnostics, Pulse Diagnosis, Visceral Pattern Identification."
                },
                remarks: {
                    "zh-CN": "战国时期名医，被尊为‘脉学之宗’，奠定中医临床诊断基础。",
                    "en": "Renowned physician of the Warring States period, revered as the 'Ancestor of Pulse Studies', establishing the foundation of TCM clinical diagnostics."
                }
            },
            {
                id: "zhang_zhongjing",
                name: "张仲景 (Zhang Zhongjing)",
                contribution: {
                    "zh-CN": "中医方剂学之祖，著《伤寒杂病论》，系统阐述六经辨证，奠定中医内科学理论与临床基础。",
                    "en": "Ancestor of TCM prescription science, authored *Treatise on Cold Damage and Miscellaneous Disorders*, systematically expounded six-channel pattern identification, laying the theoretical and clinical foundation of TCM internal medicine."
                },
                field: {
                    "zh-CN": "中医内科学、方剂学、六经辨证。",
                    "en": "TCM Internal Medicine, Prescription Science, Six-Channel Pattern Identification."
                },
                remarks: {
                    "zh-CN": "东汉医圣，其著作被誉为‘方书之祖’，影响中医两千年。",
                    "en": "Sage of Medicine in the Eastern Han Dynasty; his works are hailed as the 'Ancestor of Prescription Texts', influencing TCM for over two millennia."
                }
            },
            {
                id: "hua_tuo",
                name: "华佗 (Hua Tuo)",
                contribution: {
                    "zh-CN": "外科与针灸鼻祖，发明麻沸散和五禽戏，擅长针灸治疗麻痹、中风等心脑相关疾病。",
                    "en": "Founder of surgery and acupuncture, invented Mafeisan anesthetic and the Five-Animal Frolics, excelled in acupuncture for treating paralysis, stroke, and related cardio-cerebral conditions."
                },
                field: {
                    "zh-CN": "中医外科、针灸学、麻醉、运动疗法。",
                    "en": "TCM Surgery, Acupuncture, Anesthesia, Exercise Therapy."
                },
                remarks: {
                    "zh-CN": "东汉神医，针灸精准疗效卓著，可惜医术失传部分。",
                    "en": "Divine physician of the Eastern Han; renowned for precise acupuncture efficacy, though parts of his techniques were lost."
                }
            },
            {
                id: "sun_simiao",
                name: "孙思邈 (Sun Simiao)",
                contribution: {
                    "zh-CN": "药王，著《千金方》，强调养生预防医学，记载针灸治疗中风等脑血管疾患。",
                    "en": "King of Medicine, authored *Qianjin Prescriptions*, emphasized preventive medicine and health preservation, documented acupuncture for treating stroke and cerebrovascular disorders."
                },
                field: {
                    "zh-CN": "中医临床、方剂学、养生学、针灸。",
                    "en": "TCM Clinical Practice, Prescription Science, Health Preservation, Acupuncture."
                },
                remarks: {
                    "zh-CN": "唐代医学巨匠，其书被誉为‘中医百科全书’。",
                    "en": "Giant of Tang Dynasty medicine; his texts are regarded as the 'Encyclopedia of TCM'."
                }
            },
            {
                id: "li_shizhen",
                name: "李时珍 (Li Shizhen)",
                contribution: {
                    "zh-CN": "药学巨匠，著《本草纲目》，系统整理药物学知识，对心脑血管相关药材进行详尽分类与记载。",
                    "en": "Giant of pharmacology, authored *Compendium of Materia Medica*, systematically organized pharmacological knowledge with detailed classification and documentation of cardio-cerebral medicinal materials."
                },
                field: {
                    "zh-CN": "中药学、药性理论、本草分类。",
                    "en": "Chinese Materia Medica, Medicinal Properties Theory, Herbal Classification."
                },
                remarks: {
                    "zh-CN": "明代博物学家，历时27年完成巨著，影响全球药学。",
                    "en": "Ming Dynasty naturalist; completed the monumental work over 27 years, influencing global pharmacology."
                }
            },
            {
                id: "shi_xuemin",
                name: "石学敏 (Shi Xuemin)",
                contribution: {
                    "zh-CN": "针灸学泰斗，中国工程院院士，发明‘醒脑开窍针法’，专治中风、脑梗等脑血管疾病。",
                    "en": "Doyen of acupuncture, Academician of Chinese Academy of Engineering, invented the 'Xingnao Kaiqiao' acupuncture method, specializing in treating stroke, cerebral infarction, and cerebrovascular diseases."
                },
                field: {
                    "zh-CN": "针灸学、脑血管疾病、中风康复。",
                    "en": "Acupuncture, Cerebrovascular Diseases, Stroke Rehabilitation."
                },
                remarks: {
                    "zh-CN": "获全国中医药杰出贡献奖，创立天津中医药大学针灸研究院。",
                    "en": "Recipient of the National Outstanding Contribution Award in TCM; founded the Acupuncture Research Institute at Tianjin University of TCM."
                }
            },
            {
                id: "wang_guilin",
                name: "王桂玲 (Wang Guiling)",
                contribution: {
                    "zh-CN": "中西医结合专家，精通贺氏针灸三通法，治疗脑血管疾病、面神经炎及心脑相关疼痛症。",
                    "en": "Expert in integrated Chinese-Western medicine, masters He's Three-Channel acupuncture method, treating cerebrovascular diseases, facial paralysis, and cardio-cerebral pain syndromes."
                },
                field: {
                    "zh-CN": "针灸、中西医结合、脑血管病、疼痛管理。",
                    "en": "Acupuncture, Integrated Chinese-Western Medicine, Cerebrovascular Diseases, Pain Management."
                },
                remarks: {
                    "zh-CN": "北京市名中医，临床疗效显著，传承贺氏针灸。",
                    "en": "Beijing Famous TCM Physician; remarkable clinical efficacy, inheritor of He's acupuncture lineage."
                }
            },
            {
                id: "jia_haizhong",
                name: "贾海忠 (Jia Haizhong)",
                contribution: {
                    "zh-CN": "中医心血管病专家，运用针灸结合中药治疗冠心病、高血压等心血管疾患。",
                    "en": "TCM cardiovascular disease expert, employs acupuncture combined with Chinese herbs to treat coronary heart disease, hypertension, and other cardiovascular disorders."
                },
                field: {
                    "zh-CN": "中医心血管病、针灸、内科。",
                    "en": "TCM Cardiovascular Diseases, Acupuncture, Internal Medicine."
                },
                remarks: {
                    "zh-CN": "北京中日友好医院主任医师，中西医并重，临床经验丰富。",
                    "en": "Chief Physician at China-Japan Friendship Hospital; emphasizes both Chinese and Western approaches with extensive clinical experience."
                }
            },
            {
                id: "li_yongfeng",
                name: "李永峰 (Li Yongfeng)",
                contribution: {
                    "zh-CN": "针灸大师，精通快速针刺法，用于脑心血管急症及慢性病，强调‘心到针到’精准操作。",
                    "en": "Acupuncture master, proficient in rapid needling techniques for cardio-cerebral vascular emergencies and chronic conditions, emphasizing precise 'mind-guided needle' manipulation."
                },
                field: {
                    "zh-CN": "针灸、急症处理、心脑血管病。",
                    "en": "Acupuncture, Emergency Treatment, Cardio-Cerebral Vascular Diseases."
                },
                remarks: {
                    "zh-CN": "临床操作迅捷高效，传承创新针灸技法。",
                    "en": "Swift and efficient clinical operations; inherits and innovates acupuncture techniques."
                }
            },
            {
                id: "shang_dejun",
                name: "尚德俊 (Shang Dejun)",
                contribution: {
                    "zh-CN": "中西医结合外科专家，开创针灸治疗周围血管疾病理论体系，获国医大师称号。",
                    "en": "Integrated Chinese-Western surgical expert, pioneered the theoretical system of acupuncture for peripheral vascular diseases, awarded the title of National TCM Master."
                },
                field: {
                    "zh-CN": "周围血管病、针灸、中西医结合外科。",
                    "en": "Peripheral Vascular Diseases, Acupuncture, Integrated Chinese-Western Surgery."
                },
                remarks: {
                    "zh-CN": "山东中医药大学教授，临床与教学双优，影响深远。",
                    "en": "Professor at Shandong University of TCM; excels in both clinical practice and teaching with profound influence."
                }
            }
        ];


        const WMMasters = [
            {
                id: "hippocrates",
                name: "希波克拉底 (Hippocrates)",
                contribution: {
                    "zh-CN": "西医之父，著《希波克拉底文集》，建立临床观察与伦理准则，分析中风、癫痫等脑血管疾病，奠定神经学基础。",
                    "en": "Father of Western Medicine, authored the *Hippocratic Corpus*, established clinical observation and ethical principles, analyzed stroke, epilepsy, and cerebrovascular diseases, laying the foundation of neurology."
                },
                field: {
                    "zh-CN": "临床医学、医学伦理、神经学。",
                    "en": "Clinical Medicine, Medical Ethics, Neurology."
                },
                remarks: {
                    "zh-CN": "古希腊医学奠基人，其誓言至今影响全球医师职业规范。",
                    "en": "Founder of ancient Greek medicine; the Hippocratic Oath continues to influence global medical professional standards."
                }
            },
            {
                id: "asclepius",
                name: "阿斯克勒庇俄斯 (Asclepius)",
                contribution: {
                    "zh-CN": "希腊医学之神，传说发明外科手术与药物疗法，影响古希腊医学神殿治疗体系，包括心脑相关症状。",
                    "en": "Greek God of Medicine, legendary inventor of surgery and pharmacotherapy, influenced ancient Greek temple medicine systems, including cardio-cerebral symptoms."
                },
                field: {
                    "zh-CN": "外科、药物疗法、古代医学体系。",
                    "en": "Surgery, Pharmacotherapy, Ancient Medical Systems."
                },
                remarks: {
                    "zh-CN": "神话时代象征，其杖与蛇标志成为现代医学国际符号。",
                    "en": "Mythical era symbol; the rod and serpent became the international emblem of medicine."
                }
            },
            {
                id: "herophilus",
                name: "赫罗菲卢斯 (Herophilus)",
                contribution: {
                    "zh-CN": "解剖学先驱，进行人体解剖，描述大脑结构与脉搏作为心血管指标，推进神经与循环系统研究。",
                    "en": "Pioneer of anatomy, conducted human dissections, described brain structures and pulse as cardiovascular indicators, advancing nervous and circulatory system research."
                },
                field: {
                    "zh-CN": "¿解剖学、神经系统、心血管生理。",
                    "en": "Anatomy, Nervous System, Cardiovascular Physiology."
                },
                remarks: {
                    "zh-CN": "亚历山大里亚学派代表，被誉为‘解剖学之父’。",
                    "en": "Representative of the Alexandrian School, hailed as the 'Father of Anatomy'."
                }
            },
            {
                id: "erasistratus",
                name: "埃拉斯特拉图斯 (Erasistratus)",
                contribution: {
                    "zh-CN": "生理学奠基人，提出心脏泵血理论，研究神经传导与脑功能，对心脑血管生理有早期贡献。",
                    "en": "Founder of physiology, proposed the heart as a pump theory, studied nerve conduction and brain function, providing early contributions to cardio-cerebral vascular physiology."
                },
                field: {
                    "zh-CN": "生理学、心脏功能、神经传导。",
                    "en": "Physiology, Cardiac Function, Nerve Conduction."
                },
                remarks: {
                    "zh-CN": "古希腊解剖与实验医学先驱，影响盖伦等后世学者。",
                    "en": "Pioneer of ancient Greek anatomy and experimental medicine, influencing later scholars like Galen."
                }
            },
            {
                id: "galen",
                name: "盖伦 (Galen)",
                contribution: {
                    "zh-CN": "罗马医学巨匠，著数百部著作，系统描述心血管解剖与脉诊，影响中世纪医学1300余年。",
                    "en": "Roman medical giant, authored hundreds of works, systematically described cardiovascular anatomy and pulse diagnosis, influencing medieval medicine for over 1,300 years."
                },
                field: {
                    "zh-CN": "解剖学、心血管学、脉诊。",
                    "en": "Anatomy, Cardiovascular Science, Pulse Diagnosis."
                },
                remarks: {
                    "zh-CN": "罗马帝国御医，其理论主导欧洲医学直至文艺复兴。",
                    "en": "Physician to the Roman Empire; his theories dominated European medicine until the Renaissance."
                }
            },
            {
                id: "eugene_braunwald",
                name: "Eugene Braunwald",
                contribution: {
                    "zh-CN": "现代心脏病学之父，著《Braunwald心脏病学》，领导心血管临床试验，推动冠心病与心衰治疗标准化。",
                    "en": "Father of modern cardiology, authored *Braunwald's Heart Disease*, led cardiovascular clinical trials, standardized treatments for coronary artery disease and heart failure."
                },
                field: {
                    "zh-CN": "心脏病学、心血管临床试验、心衰管理。",
                    "en": "Cardiology, Cardiovascular Clinical Trials, Heart Failure Management."
                },
                remarks: {
                    "zh-CN": "哈佛医学院教授，主编全球心脏病学标准教材，获多项国际大奖。",
                    "en": "Professor at Harvard Medical School, editor of the global standard cardiology textbook, recipient of numerous international awards."
                }
            },
            {
                id: "valentin_fuster",
                name: "Valentin Fuster",
                contribution: {
                    "zh-CN": "心脏病专家，Mount Sinai医院院长，研究动脉粥样硬化机制，专注心血管预防与影像学。",
                    "en": "Cardiology expert, President of Mount Sinai Heart, researches atherosclerosis mechanisms, focuses on cardiovascular prevention and imaging."
                },
                field: {
                    "zh-CN": "心血管预防、动脉粥样硬化、影像诊断。",
                    "en": "Cardiovascular Prevention, Atherosclerosis, Imaging Diagnostics."
                },
                remarks: {
                    "zh-CN": "前美国心脏协会主席，领导多项全球多中心研究，获普林斯顿奖。",
                    "en": "Former President of the American Heart Association, led multiple global multicenter studies, recipient of the Prince Mahidol Award."
                }
            },
            {
                id: "steven_nissen",
                name: "Steven Nissen",
                contribution: {
                    "zh-CN": "介入心脏病学权威，开发药物洗脱支架，领导FDA药物安全研究，专治冠心病与高血压。",
                    "en": "Authority in interventional cardiology, developed drug-eluting stents, led FDA drug safety studies, specializes in coronary artery disease and hypertension."
                },
                field: {
                    "zh-CN": "介入心脏病学、冠心病、药物支架。",
                    "en": "Interventional Cardiology, Coronary Artery Disease, Drug-Eluting Stents."
                },
                remarks: {
                    "zh-CN": "克利夫兰诊所心脏中心主席，影响美国心脏病治疗指南制定。",
                    "en": "Chairman of Cardiovascular Medicine at Cleveland Clinic, influences U.S. cardiology treatment guideline development."
                }
            },
            {
                id: "antonio_damasio",
                name: "Antonio Damasio",
                contribution: {
                    "zh-CN": "神经学家，著《笛卡尔的错误》，揭示脑损伤与情绪、心血管调控的关系，推进脑血管神经科学。",
                    "en": "Neurologist, authored *Descartes' Error*, reveals relationships between brain injury, emotion, and cardiovascular regulation, advancing cerebrovascular neuroscience."
                },
                field: {
                    "zh-CN": "神经科学、脑血管病、情绪神经生物学。",
                    "en": "Neuroscience, Cerebrovascular Disease, Affective Neurobiology."
                },
                remarks: {
                    "zh-CN": "南加州大学教授，桥接神经学与心血管自主调控研究。",
                    "en": "Professor at the University of Southern California, bridges neurology and cardiovascular autonomic regulation research."
                }
            },
            {
                id: "oliver_sacks",
                name: "Oliver Sacks",
                contribution: {
                    "zh-CN": "神经学家，著《错把太太当帽子》，临床描述中风与脑血管病变对认知的影响，桥接神经病学与人文。",
                    "en": "Neurologist, authored *The Man Who Mistook His Wife for a Hat*, clinically described impacts of stroke and cerebrovascular lesions on cognition, bridging neurology and humanities."
                },
                field: {
                    "zh-CN": "临床神经学、脑血管病、认知神经科学。",
                    "en": "Clinical Neurology, Cerebrovascular Disease, Cognitive Neuroscience."
                },
                remarks: {
                    "zh-CN": "纽约大学教授，其案例著作普及神经科学，影响全球医学教育。",
                    "en": "Professor at New York University; his case studies popularized neuroscience, influencing global medical education."
                }
            }
        ];


        const MultiOmicsMasters = [
           {
                id: "eric_lander",
                name: "Eric Lander",
                contribution: {
                    "zh-CN": "人类基因组计划主要领导者，开发多组学计算框架整合基因组、转录组与表观组数据，揭示复杂疾病遗传与调控网络，推动癌症与心血管精准诊疗。",
                    "en": "Principal leader of the Human Genome Project, develops multi-omics computational frameworks integrating genomics, transcriptomics, and epigenomics data, elucidates genetic and regulatory networks in complex diseases, advancing precision diagnostics in cancer and cardiovascular conditions."
                },
                field: {
                    "zh-CN": "基因组学、多组学计算生物学、复杂疾病遗传学。",
                    "en": "Genomics, Multi-omics Computational Biology, Complex Disease Genetics."
                },
                remarks: {
                    "zh-CN": "Broad研究所创始主任，发表Nature/Science系列突破性论文，获美国国家科学奖章，奠定现代基因组医学基础。",
                    "en": "Founding Director of the Broad Institute, published landmark papers in Nature/Science series, recipient of the National Medal of Science, established foundations of modern genomic medicine."
                }
            },
                
            {
                id: "adriana_huertas_vazquez",
                name: "Adriana Huertas-Vazquez",
                contribution: {
                    "zh-CN": "多组学整合专家，领导心血管疾病分子框架研究，整合基因组、表观组与代谢组数据，揭示冠心病与心衰机制，推动精准医学。",
                    "en": "Multi-omics integration expert, leads molecular framework research in cardiovascular disease, integrates genomics, epigenomics, and metabolomics data, elucidates mechanisms of coronary artery disease and heart failure, advancing precision medicine."
                },
                field: {
                    "zh-CN": "多组学整合、心血管遗传学、精准医学。",
                    "en": "Multi-omics Integration, Cardiovascular Genomics, Precision Medicine."
                },
                remarks: {
                    "zh-CN": "获NIH多项资助，构建心血管多组学数据库，助力风险预测模型开发。",
                    "en": "Recipient of multiple NIH grants, constructed cardiovascular multi-omics databases, supporting risk prediction model development."
                }
            },
            {
                id: "jessica_wang",
                name: "Jessica Wang",
                contribution: {
                    "zh-CN": "心脏病学家，多组学应用于心衰与肥厚，结合转录组与蛋白质组识别关键通路（如炎症与脂质代谢），设计临床试验。",
                    "en": "Cardiologist, applies multi-omics to heart failure and hypertrophy, integrates transcriptomics and proteomics to identify key pathways (e.g., inflammation and lipid metabolism), designs clinical trials."
                },
                field: {
                    "zh-CN": "心脏病学、多组学生物信息学、心衰机制。",
                    "en": "Cardiology, Multi-omics Bioinformatics, Heart Failure Mechanisms."
                },
                remarks: {
                    "zh-CN": "领导多中心队列研究，成果应用于心衰早期干预策略。",
                    "en": "Leads multicenter cohort studies; findings applied to early intervention strategies in heart failure."
                }
            },
            {
                id: "manuel_mayr",
                name: "Manuel Mayr",
                contribution: {
                    "zh-CN": "系统生物学先驱，开发多组学网络模型分析动脉粥样硬化，整合蛋白质组与代谢组数据，揭示心血管风险生物标志物。",
                    "en": "Systems biology pioneer, develops multi-omics network models for atherosclerosis, integrates proteomics and metabolomics data, identifies cardiovascular risk biomarkers."
                },
                field: {
                    "zh-CN": "系统生物学、蛋白质组学、心血管代谢组学。",
                    "en": "Systems Biology, Proteomics, Cardiovascular Metabolomics."
                },
                remarks: {
                    "zh-CN": "发表Nat Rev Cardiol综述，领导欧洲心血管蛋白质组联盟。",
                    "en": "Published reviews in Nat Rev Cardiol, leads the European Cardiovascular Proteomics Consortium."
                }
            },
            {
                id: "aldons_lusis",
                name: "Aldons J. Lusis",
                contribution: {
                    "zh-CN": "系统遗传学奠基人，使用小鼠多样性面板多组学研究动脉粥样硬化与脑血管病，识别ADAMTS2等驱动基因。",
                    "en": "Founder of systems genetics, uses mouse diversity panels with multi-omics to study atherosclerosis and cerebrovascular disease, identifies driver genes like ADAMTS2."
                },
                field: {
                    "zh-CN": "系统遗传学、动脉粥样硬化、脑血管病。",
                    "en": "Systems Genetics, Atherosclerosis, Cerebrovascular Disease."
                },
                remarks: {
                    "zh-CN": "UCLA终身教授，发表Cell/Nature系列论文，奠定复杂疾病遗传架构研究范式。",
                    "en": "Tenured Professor at UCLA, published in Cell/Nature series, established paradigm for complex disease genetic architecture research."
                }
             },
   
            {
                id: "patricia_munroe",
                name: "Patricia B. Munroe",
                contribution: {
                    "zh-CN": "高血压遗传学权威，领导ICBP联盟多组学GWAS，识别535个血压相关位点，整合转录组数据预测高血压风险。",
                    "en": "Hypertension genetics authority, leads ICBP consortium multi-omics GWAS, identifies 535 blood pressure loci, integrates transcriptomics for hypertension risk prediction."
                },
                field: {
                    "zh-CN": "高血压遗传学、多组学GWAS、风险预测。",
                    "en": "Hypertension Genetics, Multi-omics GWAS, Risk Prediction."
                },
                remarks: {
                    "zh-CN": "推动多祖先队列研究，成果纳入国际高血压指南。",
                    "en": "Promotes multi-ancestry cohort studies; findings incorporated into international hypertension guidelines."
                }
            },
            {
                id: "evangelos_evangelou",
                name: "Evangelos Evangelou",
                contribution: {
                    "zh-CN": "流行病遗传学家，大规模多组学meta分析血压与中风，识别901个独立信号，强调环境-遗传交互。",
                    "en": "Epidemiological geneticist, conducts large-scale multi-omics meta-analysis of blood pressure and stroke, identifies 901 independent signals, emphasizes gene-environment interactions."
                },
                field: {
                    "zh-CN": "流行病遗传学、中风多组学、基因-环境交互。",
                    "en": "Epidemiological Genetics, Stroke Multi-omics, Gene-Environment Interaction."
                },
                remarks: {
                    "zh-CN": "伦敦卫生与热带医学院教授，领导全球最大血压遗传联盟。",
                    "en": "Professor at London School of Hygiene & Tropical Medicine, leads the world's largest blood pressure genetics consortium."
                }
            },
            {
                id: "marios_georgakis",
                name: "Marios Georgakis",
                contribution: {
                    "zh-CN": "脑血管多组学专家，整合基因组与表观组数据研究缺血性中风与小血管病，揭示疾病风险机制。",
                    "en": "Cerebrovascular multi-omics expert, integrates genomics and epigenomics data to study ischemic stroke and small vessel disease, elucidates disease risk mechanisms."
                },
                field: {
                    "zh-CN": "脑血管病、多组学整合、表观遗传学。",
                    "en": "Cerebrovascular Disease, Multi-omics Integration, Epigenetics."
                },
                remarks: {
                    "zh-CN": "德国ISD研究所组长，获欧洲研究理事会资助，专注中风精准预防。",
                    "en": "Group Leader at ISD Germany, recipient of ERC grant, focuses on precision prevention of stroke."
                }
            },
            {
                id: "amelia_hains",
                name: "Amelia Hains",
                contribution: {
                    "zh-CN": "分子蛋白质组学主任，开发质谱技术整合多组学分析心血管重塑与糖尿病并发症，推动早期诊断与个性化治疗。",
                    "en": "Director of Molecular Proteomics, develops mass spectrometry for multi-omics integration in cardiovascular remodeling and diabetic complications, advances early diagnosis and personalized treatment."
                },
                field: {
                    "zh-CN": "蛋白质组学、心血管重塑、糖尿病并发症。",
                    "en": "Proteomics, Cardiovascular Remodeling, Diabetic Complications."
                },
                remarks: {
                    "zh-CN": "Baker心脏与糖尿病研究所核心PI，构建临床转化质谱平台。",
                    "en": "Core PI at Baker Heart and Diabetes Institute, established clinical translational mass spectrometry platform."
                }
            },
            {
                id: "david_greening",
                name: "David Greening",
                contribution: {
                    "zh-CN": "蛋白质组与代谢组平台主任，领导细胞信号多组学研究心血管衰老与炎症，桥接组学与临床转化。",
                    "en": "Director of Proteomics and Metabolomics Platform, leads multi-omics studies of cell signaling in cardiovascular aging and inflammation, bridges omics and clinical translation."
                },
                field: {
                    "zh-CN": "细胞信号多组学、心血管衰老、炎症机制。",
                    "en": "Cell Signaling Multi-omics, Cardiovascular Aging, Inflammation Mechanisms."
                },
                remarks: {
                    "zh-CN": "La Trobe大学教授，开发外泌体多组学技术，应用于心血管液体活检。",
                    "en": "Professor at La Trobe University, developed exosome multi-omics technology for cardiovascular liquid biopsy."
                }
            },
            {
                id: "folkert_asselbergs",
                name: "Folkert W. Asselbergs",
                contribution: {
                    "zh-CN": "大数据多组学专家，领导心血管生物银行整合研究，结合电子健康记录与组学预测高血压与心梗风险。",
                    "en": "Big data multi-omics expert, leads cardiovascular biobank integration, combines EHRs with omics to predict hypertension and myocardial infarction risk."
                },
                field: {
                    "zh-CN": "大数据多组学、心血管生物银行、风险预测。",
                    "en": "Big Data Multi-omics, Cardiovascular Biobanking, Risk Prediction."
                },
                remarks: {
                    "zh-CN": "Utrecht大学教授，领导欧洲心脏病学大数据联盟，成果用于临床决策支持系统。",
                    "en": "Professor at Utrecht University, leads European Cardiology Big Data Alliance, outcomes applied in clinical decision support systems."
                }
            }
        ];


        const NeuralLinkMasters = [
            {
                id: "john_donoghue",
                name: "John Donoghue",
                contribution: {
                    "zh-CN": "BrainGate系统创始人，领导侵入式BCI临床试验，实现瘫痪患者通过脑信号控制机械臂，推动中风康复技术标准化。",
                    "en": "Founder of BrainGate system, led invasive BCI clinical trials, enabled paralyzed patients to control robotic arms via brain signals, standardized stroke rehabilitation technology."
                },
                field: {
                    "zh-CN": "侵入式脑机接口、中风康复、神经工程。",
                    "en": "Invasive Brain-Computer Interface, Stroke Rehabilitation, Neural Engineering."
                },
                remarks: {
                    "zh-CN": "布朗大学教授，成果获FDA突破性器械认定，奠定BCI临床转化范式。",
                    "en": "Professor at Brown University; achievements earned FDA Breakthrough Device designation, establishing BCI clinical translation paradigm."
                }
            },
            {
                id: "miguel_nicolelis",
                name: "Miguel Nicolelis",
                contribution: {
                    "zh-CN": "BCI先驱，开发脑机接口实现灵长类远程控制机器人，奠定多模态BCI基础，影响中风后运动恢复研究。",
                    "en": "BCI pioneer, developed interfaces for primates to remotely control robots, established multimodal BCI foundation, influencing post-stroke motor recovery research."
                },
                field: {
                    "zh-CN": "多模态BCI、运动解码、神经可塑性。",
                    "en": "Multimodal BCI, Motor Decoding, Neural Plasticity."
                },
                remarks: {
                    "zh-CN": "杜克大学教授，2014年世界杯BCI开球展示全球首例，开启神经假肢时代。",
                    "en": "Professor at Duke University; 2014 World Cup BCI kickoff was the world's first demonstration, ushering in the era of neural prosthetics."
                }
            },

           {
                id: "philip_sabes",
                name: "Philip Sabes",
                contribution: {
                    "zh-CN": "Neuralink联合创始人和神经科学主任，领导灵长类运动解码研究，开发高通道数线程电极系统，实现瘫痪患者高精度脑控植入，推动2025年多例人类试验。",
                    "en": "Neuralink co-founder and neuroscience director, leads primate motor decoding research, developed high-channel thread electrode systems, enabling high-precision brain-controlled implants for paralyzed patients, advancing 2025 multi-human trials."
                },
                field: {
                    "zh-CN": "运动神经解码、高密度电极植入、灵长类BCI。",
                    "en": "Motor Neural Decoding, High-Density Electrode Implantation, Primate BCI."
                },
                remarks: {
                    "zh-CN": "前UCSF教授，领导DARPA RE-NET项目，奠定Neuralink临床转化基础，获多项NIH资助。",
                    "en": "Former UCSF professor, led DARPA RE-NET project, established Neuralink's clinical translation foundation, recipient of multiple NIH grants."
                }
            },
                
            {
                id: "andrew_schwartz",
                name: "Andrew Schwartz",
                contribution: {
                    "zh-CN": "匹兹堡大学教授，优化BCI解码算法提升假肢控制精度，应用于慢性中风患者上肢康复临床试验。",
                    "en": "Professor at University of Pittsburgh, optimized BCI decoding algorithms for prosthetic precision, applied in chronic stroke upper-limb rehabilitation trials."
                },
                field: {
                    "zh-CN": "BCI解码算法、上肢假肢、中风康复。",
                    "en": "BCI Decoding Algorithms, Upper-Limb Prosthetics, Stroke Rehabilitation."
                },
                remarks: {
                    "zh-CN": "领导DARPA资助项目，实现7维连续运动控制，精度达临床可用水平。",
                    "en": "Led DARPA-funded projects achieving 7-DOF continuous motion control at clinically viable precision."
                }
            },
            {
                id: "bin_he",
                name: "Bin He",
                contribution: {
                    "zh-CN": "非侵入式EEG-BCI专家，开发高分辨率脑电成像，实现无创无人机控制，扩展至中风早期康复干预。",
                    "en": "Non-invasive EEG-BCI expert, developed high-resolution EEG imaging, achieved non-invasive drone control, extended to early stroke rehabilitation interventions."
                },
                field: {
                    "zh-CN": "非侵入式BCI、脑电成像、中风早期干预。",
                    "en": "Non-Invasive BCI, EEG Imaging, Early Stroke Intervention."
                },
                remarks: {
                    "zh-CN": "卡内基梅隆大学教授，发表Nature系列论文，推动无创BCI临床普及。",
                    "en": "Professor at Carnegie Mellon University, published in Nature series, promoting clinical adoption of non-invasive BCI."
                }
            },
                
            {
                id: "maryam_shanechi",
                name: "Maryam Shanechi",
                contribution: {
                    "zh-CN": "USC教授，设计闭环BCI解码认知状态，潜在应用于神经精神障碍及心血管自主神经调控，如血压反馈系统。",
                    "en": "Professor at USC, designs closed-loop BCI for decoding cognitive states, with potential applications in neuropsychiatric disorders and cardiovascular autonomic regulation, e.g., blood pressure feedback."
                },
                field: {
                    "zh-CN": "闭环BCI、认知解码、心血管神经调控。",
                    "en": "Closed-Loop BCI, Cognitive Decoding, Cardiovascular Neural Control."
                },
                remarks: {
                    "zh-CN": "开发动态状态空间模型，获NSF职业奖，桥接BCI与自主神经系统。",
                    "en": "Developed dynamical state-space models, received NSF CAREER Award, bridging BCI and autonomic nervous system."
                }
            },
            {
                id: "david_brandman",
                name: "David Brandman",
                contribution: {
                    "zh-CN": "UC Davis神经外科医生，领导BCI植入试验获2025年临床研究成就奖，专注中风后运动功能恢复。",
                    "en": "UC Davis neurosurgeon, led BCI implantation trials, awarded 2025 Clinical Research Achievement, focused on post-stroke motor recovery."
                },
                field: {
                    "zh-CN": "BCI临床植入、中风运动康复、神经外科。",
                    "en": "BCI Clinical Implantation, Stroke, Stroke Motor Rehabilitation, Neurosurgery."
                },
                remarks: {
                    "zh-CN": "主导高密度皮层电极植入，实现长期稳定信号采集，患者可在家使用。",
                    "en": "Led high-density cortical electrode implantation, achieving long-term stable signal acquisition, enabling home use by patients."
                }
            },
            {
                id: "sergey_stavisky",
                name: "Sergey Stavisky",
                contribution: {
                    "zh-CN": "UC Davis神经科学家，开发高密度电极阵列BCI，提升中风患者精细运动解码精度，推动实时康复反馈。",
                    "en": "UC Davis neuroscientist, developed high-density electrode array BCI, improved fine motor decoding in stroke patients, enabling real-time rehabilitation feedback."
                },
                field: {
                    "zh-CN": "高密度BCI、精细运动解码、实时反馈。",
                    "en": "High-Density BCI, Fine Motor Decoding, Real-Time Feedback."
                },
                remarks: {
                    "zh-CN": "领导Speech Neuroprosthesis项目，实现中风失语患者自然语音合成。",
                    "en": "Leads Speech Neuroprosthesis project, achieving natural speech synthesis in aphasic stroke patients."
                }
            },
            {
                id: "eric_leuthardt",
                name: "Eric Leuthardt",
                contribution: {
                    "zh-CN": "华盛顿大学教授，发明IpsiHand BCI外骨骼系统，获FDA批准用于中风上肢康复，桥接脑信号与物理疗法。",
                    "en": "Professor at Washington University, invented IpsiHand BCI exoskeleton, FDA-approved for stroke upper-limb rehab, bridging brain signals with physical therapy."
                },
                field: {
                    "zh-CN": "BCI外骨骼、中风上肢康复、FDA认证。",
                    "en": "BCI Exoskeleton, Stroke Upper-Limb Rehab, FDA Approval."
                },
                remarks: {
                    "zh-CN": "全球首款BCI康复器械获批，患者居家训练改善率达70%。",
                    "en": "World's first FDA-approved BCI rehab device; 70% improvement rate in home-based training."
                }
            },
            {
                id: "jose_contreras_vidal",
                name: "Jose Luis Contreras-Vidal",
                contribution: {
                    "zh-CN": "德克萨斯大学教授，进行BCI元分析评估中风运动康复疗效，开发混合BCI-机器人系统改善患者预后。",
                    "en": "Professor at University of Texas, conducted BCI meta-analysis on stroke motor rehab efficacy, developed hybrid BCI-robot systems to improve patient outcomes."
                },
                field: {
                    "zh-CN": "BCI元分析、混合机器人系统、中风预后。",
                    "en": "BCI Meta-Analysis, Hybrid Robotic Systems, Stroke Prognosis."
                },
                remarks: {
                    "zh-CN": "领导NIH多中心研究，构建全球最大BCI中风康复数据库。",
                    "en": "Leads NIH multicenter studies, built the world's largest BCI stroke rehabilitation database."
                }
            },
            {
                id: "cindy_chestak",
                name: "Cindy Chestek",
                contribution: {
                    "zh-CN": "密歇根大学教授，领导1900万美元项目开发植入式BCI，帮助中风失语患者实时言语恢复，整合AI解码技术。",
                    "en": "Professor at University of Michigan, leads $19M project developing implantable BCI for real-time speech restoration in aphasic stroke patients, integrating AI decoding."
                },
                field: {
                    "zh-CN": "植入式BCI、言语神经假体、AI解码。",
                    "en": "Implantable BCI, Speech Neuroprosthetics, AI Decoding."
                },
                remarks: {
                    "zh-CN": "2025年实现100词/分钟自然语音输出，接近正常对话速度。",
                    "en": "Achieved 100 words/minute natural speech output in 2025, approaching normal conversation speed."
                }
            }
        ];

        const allData = {
            TCM: TCMMasters,
            WM: WMMasters,
            MultiOmics: MultiOmicsMasters,
            NeuralLink: NeuralLinkMasters
        };
