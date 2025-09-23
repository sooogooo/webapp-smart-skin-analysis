import { FormStructure, FormType, FormSection } from './types';
import { SENSITIVE_THUMBNAIL, ACNE_THUMBNAIL, PIGMENTATION_THUMBNAIL, ANTI_AGING_THUMBNAIL, DRY_THUMBNAIL, ROSACEA_THUMBNAIL, PIGMENTATION_DISORDERS_THUMBNAIL, DEHYDRATED_SKIN_THUMBNAIL, COMBINATION_SKIN_THUMBNAIL } from './imageData';

const commonBasicInfoSection: FormSection = {
  title: '基本信息',
  questions: [
    { id: 'name', label: '姓名', type: 'text' },
    {
      id: 'gender',
      label: '性别',
      type: 'radio',
      options: [
        { value: 'female', label: '女' },
        { value: 'male', label: '男' },
      ],
      defaultValue: 'female',
    },
    {
      id: 'age_range',
      label: '年龄范围',
      type: 'radio',
      options: [
        { value: '<20', label: '20岁以下' },
        { value: '20-29', label: '20-29岁' },
        { value: '30-39', label: '30-39岁' },
        { value: '40-49', label: '40-49岁' },
        { value: '50+', label: '50岁以上' },
      ],
      defaultValue: '20-29',
    },
    {
      id: 'age_custom',
      label: '或输入具体年龄',
      type: 'text',
    },
    {
      id: 'menstrual_cycle',
      label: '生理周期',
      type: 'radio',
      options: [
        { value: 'regular', label: '规律' },
        { value: 'irregular', label: '不规律' },
        { value: 'not_applicable', label: '不适用' },
      ],
      defaultValue: 'regular',
    },
    {
      id: 'allergens',
      label: '是否有已知过敏原',
      type: 'radio',
      options: [
        { value: 'none', label: '无' },
        { value: 'yes', label: '有' },
      ],
      defaultValue: 'none',
    },
    {
      id: 'allergens_details',
      label: '若有，请填写具体过敏原',
      type: 'textarea',
      condition: {
        id: 'allergens',
        value: 'yes',
      },
    },
  ],
};

const advancedAnalysisSection: (questions: FormSection['questions']) => FormSection = (questions) => ({
    title: '深度分析 (可选)',
    questions: questions,
});


export const DIAGNOSIS_FORMS: Record<FormType, FormStructure> = {
  sensitive: {
    title: '敏感肌诊断问卷',
    thumbnail: SENSITIVE_THUMBNAIL,
    sections: [
      commonBasicInfoSection,
      {
        title: '皮肤状况',
        questions: [
          {
            id: 'skin_concerns',
            label: '您最主要的皮肤困扰是什么？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'redness', label: '泛红' },
              { value: 'itching', label: '瘙痒' },
              { value: 'tightness', label: '紧绷' },
              { value: 'peeling', label: '脱皮' },
            ],
          },
          {
            id: 'triggers',
            label: '哪些情况会加重您的皮肤敏感？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'season_change', label: '季节变换' },
              { value: 'new_products', label: '使用新护肤品' },
              { value: 'diet', label: '饮食' },
              { value: 'stress', label: '压力' },
            ],
          },
          {
            id: 'frequency',
            label: '您的皮肤敏感问题多久发生一次？',
            type: 'radio',
            options: [
                { value: 'daily', label: '几乎每天' },
                { value: 'weekly', label: '每周数次' },
                { value: 'monthly', label: '每月数次' },
                { value: 'rarely', label: '很少' },
            ]
          }
        ],
      },
      {
        title: '护肤习惯',
        questions: [
           {
            id: 'skincare_routine',
            label: '请描述您目前的护肤流程（洁面、水、精华、乳液、防晒等）',
            type: 'textarea',
          },
          {
            id: 'active_ingredients',
            label: '您目前使用的护肤品中是否含有以下成分？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'retinoids', label: '维A醇（视黄醇）' },
              { value: 'aha_bha', label: '果酸/水杨酸' },
              { value: 'vitamin_c', label: '高浓度维C' },
              { value: 'none', label: '不含以上成分或不确定' },
            ],
          },
        ],
      },
      advancedAnalysisSection([
        {
          id: 'advanced_sensitive',
          label: '进阶因素评估',
          type: 'group',
          subQuestions: [
            { id: 'family_history', label: '家族中是否有敏感肌或过敏性疾病史？ (遗传倾向)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'stress_level', label: '您近期的压力水平如何？ (生活方式)', type: 'radio', options: [{value: 'low', label: '低'}, {value: 'medium', label: '中'}, {value: 'high', label: '高'}]},
            { id: 'environment', label: '您常处的环境是否有高污染或极端气候？ (环境诱因)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
          ]
        }
      ]),
    ],
  },
  acne: {
    title: '痤疮（痘痘）诊断问卷',
    thumbnail: ACNE_THUMBNAIL,
    sections: [
        commonBasicInfoSection,
        {
            title: '痤疮详情',
            questions: [
              { id: 'acne_type', label: '您的痘痘主要是什么类型？', type: 'checkbox', options: [{value: 'pustules', label: '脓疱'}, {value: 'cysts', label: '囊肿'}, {value: 'blackheads', label: '黑头'}, {value: 'whiteheads', label: '白头'}] },
              { id: 'location', label: '痘痘主要长在哪个部位？', type: 'text' },
            ],
        },
        advancedAnalysisSection([
            {
              id: 'advanced_acne',
              label: '核心成因探究',
              type: 'group',
              subQuestions: [
                { id: 'hormonal_triggers', label: '痘痘是否与生理周期或压力显著相关？ (内分泌因素)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
                { id: 'dietary_habits', label: '您是否经常摄入高糖、高脂食物或乳制品？ (饮食关联)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}, {value: 'sometimes', label: '偶尔'}]},
                { id: 'microbiome_factors', label: '您是否有消化系统问题或长期使用抗生素？ (皮肤微生态)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
              ]
            }
        ])
    ]
  },
  pigmentation: {
    title: '色斑诊断问卷',
    thumbnail: PIGMENTATION_THUMBNAIL,
    sections: [
        commonBasicInfoSection,
        {
            title: '色斑详情',
            questions: [
                { id: 'spot_type', label: '您的色斑主要是哪种类型？', type: 'radio', options: [{value: 'sunspots', label: '晒斑'}, {value: 'melasma', label: '黄褐斑'}, {value: 'pih', label: '炎症后色素沉着'}, {value: 'freckles', label: '雀斑'}] },
                { id: 'sun_exposure', label: '您的日晒情况如何？', type: 'radio', options: [{value: 'high', label: '经常暴晒'}, {value: 'medium', label: '偶尔日晒'}, {value: 'low', label: '很少日晒'}] },
            ],
        },
        advancedAnalysisSection([
            {
                id: 'advanced_pigmentation',
                label: '色素源头追溯',
                type: 'group',
                subQuestions: [
                  { id: 'photoaging_level', label: '根据您的日晒史，评估光损伤历史？ (光老化评估)', type: 'radio', options: [{value: 'mild', label: '轻微'}, {value: 'moderate', label: '中度'}, {value: 'severe', label: '严重'}]},
                  { id: 'hormonal_history', label: '您是否有怀孕、服用避孕药或激素治疗史？ (荷尔蒙波动)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
                  { id: 'inflammation_history', label: '色斑区域之前是否有过炎症或皮肤损伤？ (炎症后反应)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
                ]
            }
        ])
    ]
  },
  'anti-aging': {
    title: '抗衰老诊断问卷',
    thumbnail: ANTI_AGING_THUMBNAIL,
    sections: [
        commonBasicInfoSection,
        {
            title: '衰老迹象',
            questions: [
                { id: 'signs', label: '您最关注的衰老迹象是什么？', type: 'checkbox', options: [{value: 'wrinkles', label: '皱纹/细纹'}, {value: 'sagging', label: '松弛'}, {value: 'dullness', label: '暗沉'}, {value: 'volume_loss', label: '容量流失'}] },
                { id: 'lifestyle', label: '您的生活习惯如何？(如睡眠、饮食、吸烟)', type: 'textarea' },
            ],
        },
        advancedAnalysisSection([
            {
                id: 'advanced_anti_aging',
                label: '衰老维度评估',
                type: 'group',
                subQuestions: [
                  { id: 'glycation_risk', label: '您的饮食中是否包含大量甜食和精制碳水？ (糖化风险评估)', type: 'radio', options: [{value: 'high', label: '高'}, {value: 'medium', label: '中'}, {value: 'low', label: '低'}]},
                  { id: 'oxidative_stress', label: '您是否经常熬夜、吸烟或处于高压环境？ (氧化应激水平)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
                  { id: 'genetic_factor', label: '您的直系亲属看起来比同龄人年轻还是显老？ (遗传背景)', type: 'radio', options: [{value: 'younger', label: '更年轻'}, {value: 'older', label: '更显老'}, {value: 'average', label: '差不多'}]}
                ]
            }
        ])
    ]
  },
  dry: {
    title: '干性皮肤诊断问卷',
    thumbnail: DRY_THUMBNAIL,
    sections: [
        commonBasicInfoSection,
        {
            title: '干燥状况',
            questions: [
                { id: 'dryness_level', label: '您的皮肤感觉有多干燥？', type: 'radio', options: [{value: 'mild', label: '轻微'}, {value: 'moderate', label: '中度'}, {value: 'severe', label: '严重，有脱屑或干裂'}] },
                { id: 'climate', label: '您所居住地区的气候如何？', type: 'text' },
            ],
        },
        advancedAnalysisSection([
            {
                id: 'advanced_dry',
                label: '屏障功能探查',
                type: 'group',
                subQuestions: [
                  { id: 'barrier_function', label: '您是否经常使用强力清洁产品或过度去角质？ (屏障功能指标)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
                  { id: 'hydration_habits', label: '您每天的饮水量和保湿产品使用频率？ (水合习惯)', type: 'textarea'},
                  { id: 'nutrition_intake', label: '您的饮食中是否包含足够的健康脂肪 (如鱼、坚果)？ (营养摄入)', type: 'radio', options: [{value: 'sufficient', label: '充足'}, {value: 'insufficient', label: '不足'}]}
                ]
            }
        ])
    ]
  },
  rosacea: {
    title: '玫瑰痤疮（红血丝）诊断问卷',
    thumbnail: ROSACEA_THUMBNAIL,
    sections: [
      commonBasicInfoSection,
      {
        title: '玫瑰痤疮详情',
        questions: [
          {
            id: 'rosacea_symptoms',
            label: '您的主要症状是什么？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'persistent_redness', label: '持续性泛红' },
              { value: 'flushing', label: '阵发性潮红' },
              { value: 'bumps_pimples', label: '丘疹/脓疱' },
              { value: 'visible_vessels', label: '可见细小血管' },
            ],
          },
          {
            id: 'rosacea_triggers',
            label: '哪些因素会引发或加重您的症状？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'sun_exposure', label: '日晒' },
              { value: 'spicy_food', label: '辛辣食物' },
              { value: 'alcohol', label: '饮酒' },
              { value: 'stress', label: '情绪波动' },
              { value: 'hot_drinks', label: '热饮' },
              { value: 'extreme_temps', label: '极端温度' },
            ],
          },
        ],
      },
      advancedAnalysisSection([
        {
          id: 'advanced_rosacea',
          label: '深层诱因分析',
          type: 'group',
          subQuestions: [
            { id: 'vascular_reactivity', label: '您的皮肤对温度或情绪变化的反应是否特别迅速和强烈？ (血管反应性)', type: 'radio', options: [{value: 'high', label: '非常强烈'}, {value: 'moderate', label: '中等'}, {value: 'low', label: '轻微'}]},
            { id: 'demodex_association', label: '您是否有眼部不适（如干涩、瘙痒）或口周皮炎？ (蠕形螨关联性)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'neurogenic_inflammation', label: '您的皮肤是否在压力大时感觉有灼热或刺痛感？ (神经性炎症)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
          ]
        }
      ]),
    ],
  },
  pigmentation_disorders: {
    title: '色素沉着异常诊断问卷',
    thumbnail: PIGMENTATION_DISORDERS_THUMBNAIL,
    sections: [
      commonBasicInfoSection,
      {
        title: '色斑详情',
        questions: [
          {
            id: 'pigmentation_type',
            label: '您的色斑更接近哪种类型？',
            type: 'radio',
            options: [
              { value: 'melasma', label: '黄褐斑' },
              { value: 'sunspots', label: '晒斑' },
              { value: 'pih', label: '炎症后色素沉着（痘印、疤痕）' },
              { value: 'freckles', label: '雀斑' },
            ],
          },
          {
            id: 'pigmentation_shape',
            label: '色斑的形态是怎样的？',
            type: 'radio',
            options: [
              { value: 'patchy', label: '片状模糊' },
              { value: 'defined', label: '点状清晰' },
            ],
          },
          {
            id: 'pigmentation_cause',
            label: '您认为色斑的主要成因是什么？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'sun_exposure', label: '日晒' },
              { value: 'hormonal', label: '荷尔蒙变化（如怀孕、避孕药）' },
              { value: 'inflammation', label: '皮肤炎症或损伤后' },
              { value: 'genetic', label: '遗传' },
            ],
          },
        ],
      },
      advancedAnalysisSection([
        {
          id: 'advanced_pigmentation_disorders',
          label: '色素代谢深度探究',
          type: 'group',
          subQuestions: [
            { id: 'melanin_depth', label: '您的色斑颜色是浅棕色还是深褐色/灰色？ (色素深度评估)', type: 'radio', options: [{value: 'superficial', label: '浅棕色 (表皮)'}, {value: 'deep', label: '深褐色/灰色 (真皮)'}]},
            { id: 'endocrine_metabolism', label: '您是否有甲状腺或肝脏相关健康问题？ (内分泌与代谢)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'photobiomodulation', label: '您过去是否接受过激光或强脉冲光治疗？ (光生物学调节史)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
          ]
        }
      ]),
    ],
  },
  dehydrated_skin: {
    title: '皮肤脱水状况评估问卷',
    thumbnail: DEHYDRATED_SKIN_THUMBNAIL,
    sections: [
      commonBasicInfoSection,
      {
        title: '脱水状况',
        questions: [
          {
            id: 'dehydration_feeling',
            label: '您的皮肤通常有什么感觉？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'tightness', label: '紧绷感' },
              { value: 'fine_lines', label: '出现细干纹' },
              { value: 'dullness', label: '皮肤暗沉无光泽' },
              { value: 'oily_and_dry', label: '感觉外油内干' },
            ],
          },
          {
            id: 'water_intake',
            label: '您每天的饮水量大约是多少？',
            type: 'radio',
            options: [
              { value: 'low', label: '少于1升' },
              { value: 'medium', label: '1至2升' },
              { value: 'high', label: '超过2升' },
            ],
          },
          {
            id: 'environment',
            label: '请描述您常处的环境（如空调房、干燥地区等）',
            type: 'textarea',
          },
        ],
      },
      advancedAnalysisSection([
        {
          id: 'advanced_dehydrated_skin',
          label: '水合能力根源分析',
          type: 'group',
          subQuestions: [
            { id: 'tewl_assessment', label: '您的皮肤在洁面后是否很快感到紧绷？ (经皮水分流失评估)', type: 'radio', options: [{value: 'very_fast', label: '非常快'}, {value: 'moderate', label: '一般'}, {value: 'slow', label: '不明显'}]},
            { id: 'lipid_status', label: '您的皮肤是否缺乏光泽且触感粗糙？ (细胞间脂质状况)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'nmf_level', label: '您是否即使在湿润环境中也感觉皮肤干燥？ (天然保湿因子水平)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
          ]
        }
      ]),
    ],
  },
  combination_skin: {
    title: '混合性皮肤诊断问卷',
    thumbnail: COMBINATION_SKIN_THUMBNAIL,
    sections: [
      commonBasicInfoSection,
      {
        title: '区域特征',
        questions: [
          {
            id: 't_zone_char',
            label: '您的T区（额头、鼻子、下巴）有哪些特征？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'oily', label: '油脂分泌旺盛' },
              { value: 'large_pores', label: '毛孔粗大' },
              { value: 'blackheads', label: '有黑头粉刺' },
            ],
          },
          {
            id: 'u_zone_char',
            label: '您的U区（脸颊）有哪些特征？（可多选）',
            type: 'checkbox',
            options: [
              { value: 'dry', label: '干燥或紧绷' },
              { value: 'normal', label: '肤质正常' },
              { value: 'sensitive', label: '偶尔敏感泛红' },
            ],
          },
        ],
      },
      advancedAnalysisSection([
        {
          id: 'advanced_combination_skin',
          label: '水油失衡溯源',
          type: 'group',
          subQuestions: [
            { id: 'sebaceous_activity', label: '您的T区出油情况是否随季节或生理周期变化很大？ (皮脂腺活动评估)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'keratin_metabolism', label: '您的T区是否更容易出现毛孔堵塞和角质堆积？ (角质层代谢差异)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]},
            { id: 'hydration_distribution', label: '使用保湿产品后，脸颊感觉舒适但T区很快泛油？ (水合分布不均)', type: 'radio', options: [{value: 'yes', label: '是'}, {value: 'no', label: '否'}]}
          ]
        }
      ]),
    ],
  },
};