import { TreatmentMenu } from '../types';

export const TREATMENT_MENU: TreatmentMenu = [
  {
    name: '操作费',
    items: [
      { name: '滚针/机打', spec: '次', price: 200, effect: '适合单支产品,医生推荐滚针/九针', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/1.png' },
      { name: '机打+滚针', spec: '次', price: 300, effect: '适合多种产品联合', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/2.png' },
      { name: '无针/滚针+雾光渗透', spec: '次', price: 300, effect: '恢复期短,没有恢复期的可选', image: 'https://labs.cabcc.com/wp-content/uploads/2025/07/4.png' },
      { name: '手针单针导入', spec: '次', price: 380, effect: '适合做局部加强', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/3.png' },
    ],
  },
  {
    name: '基础款专区',
    items: [
      { name: '氨甲环酸', spec: '1ml', price: 59, ingredients: '氨甲环酸/传明酸', effect: '美白、提亮', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/5.png' },
      { name: '谷胱甘肽', spec: '1ml', price: 59, ingredients: '谷胱甘肽/维生素C', effect: '美白、提亮', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/7.png' },
      { name: '维生素C', spec: '1ml', price: 59, ingredients: '谷胱甘肽/维生素C', effect: '美白、提亮', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/6.png' },
      { name: '润百颜玻玻', spec: '2ml', price: 99, ingredients: '含麻基础水光', effect: '补水、嫩肤', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/8.png' },
      { name: '富勒烯润白', spec: '3ml', price: 99, ingredients: '透明质酸水光', effect: '补水、嫩肤、美白', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/9.png' },
      { name: '芬生源208', spec: '3ml', price: 99, ingredients: '寡肽、透明质酸', effect: '补水嫩肤、修复', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/10.png' },
      { name: '东国动能素', spec: '5ml', price: 139, ingredients: '氨基酸、透明质酸', effect: '补水嫩肤、营养', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/11.png' },
    ],
  },
  {
    name: '医美原料桶专区',
    items: [
      { name: '纪美禾神经酰胺修复补水', spec: '5ml', price: 199, ingredients: '神经酰胺、透明质酸', effect: '洗脸刺痛、泛红屏障修复', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/12.png' },
      { name: '纪美禾抗氧修复瓶', spec: '5ml', price: 299, ingredients: '聚谷氨酸钠、海藻酸钠', effect: '皮肤泛红修复、美白提亮', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/16.png' },
      { name: '纪美禾·安白瓶', spec: '5ml', price: 299, ingredients: '海藻酸钠、海藻糖、氨甲环酸/传明酸', effect: '淡化色斑、美白、提亮', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/15.png' },
      { name: '纪美禾三型胶原瓶', spec: '5ml', price: 199, ingredients: '重组III型人源化胶原蛋白', effect: '胶原蛋白、补水嫩肤、营养补充、嫩白', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/13.png' },
      { name: '嗨体2.5营养针', spec: '2.5ml', price: 199, ingredients: '肌肽、氨基酸、透明质酸等', effect: '美白、补水嫩肤、营养补充', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/14.png' },
    ],
  },
  {
    name: '医美品牌专区',
    items: [
      { name: '薇绮美平替-爱莉丝胶原水光', spec: '3.0ml', price: 899, ingredients: '45mg 牛跟腱 1型胶原蛋白、适合眶周', effect: '胶原蛋白、补水嫩肤、营养补充、嫩白', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/39.png' },
      { name: '普丽兰动能素', spec: '5ml', price: 499, ingredients: '少量pdrn、透明质酸', effect: '补水、嫩肤、美白', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/17.png' },
      { name: '丝丽516', spec: '5ml', price: 499, ingredients: '氨基酸、透明质酸', effect: '补水、嫩肤、营养补充', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/18.png' },
      { name: '冬活泡泡针', spec: '2.5ml', price: 599, ingredients: 'L-肌肽、氨基酸、透明质酸', effect: '初级抗衰、多种营养、补水', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/20.png' },
      { name: '润致娃娃针', spec: '2ml', price: 599, ingredients: '微交联透明质酸', effect: '补水、嫩肤、增加皮肤弹性', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/21.png' },
      { name: '思伊美·长效水光', spec: '3ml', price: 599, ingredients: '微交联透明质酸', effect: '补水、嫩肤、增加皮肤弹性', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/22.png' },
      { name: '漫渴三型胶原', spec: '6.5ml', price: 599, ingredients: '三型胶原', effect: '初级抗衰、补水嫩肤、营养补充、膨弹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/23.png' },
      { name: '可丽金胶原', spec: '4ml', price: 599, ingredients: '三型胶原', effect: '胶原蛋白、补水嫩肤、营养补充、膨弹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/24.png' },
      { name: '丝丽532', spec: '5ml', price: 599, ingredients: '氨基酸、透明质酸', effect: '补水嫩肤、营养补充', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/19.png' },
      { name: '润致粉底针', spec: '3ml', price: 1280, ingredients: '微交联透明质酸', effect: '长效补水、嫩肤、增加透亮度', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/25.png' },
      { name: '新肤源胶原水光', spec: '2mg', price: 1280, ingredients: '三型胶原纤维', effect: '高端抗衰、补水、嫩肤、淡化细纹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/26.png' },
      { name: '润致格格针', spec: '2ml', price: 1580, ingredients: 'I透明质酸钠、多种氨基酸', effect: '淡化细纹、营养补充、提亮肤色', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/27.png' },
      { name: '丽珠兰·黑盒', spec: '2ml', price: 1880, ingredients: '丽珠兰黑盒', effect: '高端抗衰、补水、嫩肤、淡化细纹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/28.png' },
      { name: '瑞蓝唯瑅', spec: '1ml', price: 2980, ingredients: '交联透明质酸', effect: '长效补水嫩肤、淡化细纹、增加通透感', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/29.png' },
      { name: '薇绮美胶原', spec: '4mg', price: 2980, ingredients: '三型胶原纤维', effect: '高端抗衰、补水、嫩肤、淡化细纹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/30.png' },
      { name: '费丝欧俪+新肤源', spec: '5ml+2mg', price: 2980, ingredients: '一型胶原+三型胶原', effect: '高端抗衰、补水、嫩肤、淡化细纹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/31.png' },
    ],
  },
  {
    name: '光电加购专区',
    notes: ['需搭配水光操作', '不可单独购买'],
    items: [
      { name: '科医人AOPT超光子【蓝】', spec: '次', price: 99, effect: '(不做病症)美白、提亮、淡纹', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/32.png' },
      { name: '黄金射频镇定舒敏', spec: '次', price: 99, effect: '敏肌修复', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/34.png' },
      { name: '白瓷娃娃全脸美白', spec: '次', price: 199, effect: '美白', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/35.png' },
      { name: '热拉提面部 45min标准版', spec: '次', price: 499, effect: '紧致', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/36.png' },
      { name: '钻石超塑下颌缘+双下巴 45min标准版', spec: '次', price: 599, effect: '瘦脸、紧致', image: 'https://labs.cqbcc.com/wp-content/uploads/2025/07/37.png' },
      { name: 'Fotona 4D 60min标准版', spec: '次', price: 699, effect: '紧致、淡纹、提亮肤色', image: 'https://labs.cabcc.com/wp-content/uploads/2025/07/38.png' },
    ],
  },
];
