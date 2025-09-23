# SmartSkinAnalysis - AI智能皮肤诊断助手 🌟

<div align="center">
  <img src="https://docs.bccsw.cn/logo.png" alt="SmartSkinAnalysis Logo" width="120" height="120">
  
  <h3>一款基于Google Gemini AI的智能皮肤诊断与护肤建议应用</h3>
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
</div>

---

## 📋 项目简介

**SmartSkinAnalysis** 是一款专业的AI驱动皮肤诊断应用，利用Google Gemini 2.5 Flash模型提供个性化的皮肤分析和护肤建议。应用支持多种皮肤问题的诊断，包括敏感肌、痤疮、色斑、抗衰老等9大类别，为用户提供专业的三阶段护肤方案。

### ✨ 核心特性

- 🔬 **AI智能诊断**: 基于Google Gemini 2.5 Flash的先进图像识别和文本分析
- 📊 **多维度评估**: 支持9种不同类型的皮肤问题诊断问卷
- 📸 **图像分析**: 支持上传皮肤照片进行视觉诊断
- 💬 **智能问答**: 基于诊断报告的AI互动问答系统
- 📱 **响应式设计**: 完全适配移动端和桌面端
- 🎨 **主题定制**: 支持明暗主题切换和多种配色方案
- 💾 **本地存储**: 诊断历史本地保存，保护用户隐私
- 📄 **报告导出**: 支持PDF打印和Markdown格式导出

---

## 🛠️ 技术栈

### 前端框架
- **React 19.1.1** - 最新的React框架
- **TypeScript 5.8.2** - 类型安全的JavaScript
- **Vite 6.2.0** - 快速的构建工具

### UI与样式
- **TailwindCSS** - 实用优先的CSS框架
- **自定义图标组件** - SVG图标库
- **响应式设计** - 移动端优先

### AI与后端服务
- **Google Gemini AI 2.5 Flash** - 图像和文本分析
- **@google/genai 1.20.0** - Google AI SDK

### 状态管理与工具
- **自定义Hooks** - 状态管理和本地存储
- **LocalStorage** - 数据持久化

---

## 🚀 快速开始

### 系统要求

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **现代浏览器** (Chrome, Firefox, Safari, Edge)

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/SmartSkinAnalysis.git
   cd SmartSkinAnalysis
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或使用yarn
   yarn install
   ```

3. **配置环境变量**
   
   在项目根目录创建 `.env.local` 文件：
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > 📝 **获取API Key**: 访问 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取免费的Gemini API密钥

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或使用yarn
   yarn dev
   ```

5. **访问应用**
   
   打开浏览器访问 `http://localhost:3000`

---

## 📱 功能介绍

### 1. 皮肤诊断类型

应用支持以下9种皮肤问题的专业诊断：

| 诊断类型 | 描述 | 主要特征 |
|---------|------|----------|
| 🌸 敏感肌 | 容易泛红、刺痛的脆弱肌肤 | 泛红、瘙痒、紧绷、脱皮 |
| 🎯 痤疮诊断 | 青春痘、成人痘等痤疮问题 | 脓疱、囊肿、黑头、白头 |
| 🌟 色斑分析 | 各类色素沉着问题 | 晒斑、黄褐斑、炎症色沉 |
| ⏰ 抗衰老 | 皮肤老化相关问题 | 皱纹、松弛、暗沉、容量流失 |
| 💧 干性皮肤 | 缺水缺油的干燥肌肤 | 紧绷、脱屑、粗糙 |
| 🌹 玫瑰痤疮 | 红血丝和持续泛红 | 潮红、血管扩张、丘疹 |
| 🎨 色素异常 | 复杂的色素沉着问题 | 不规则色斑、色素分布异常 |
| 🏜️ 皮肤脱水 | 内干外油的脱水状态 | 外油内干、细纹、暗沉 |
| ⚖️ 混合性皮肤 | T区油腻U区干燥 | 分区护理需求 |

### 2. AI诊断流程

1. **选择诊断类型** - 根据主要皮肤问题选择对应问卷
2. **填写详细问卷** - 提供基本信息和皮肤状况描述
3. **上传皮肤照片** (可选) - AI进行图像分析
4. **获取诊断报告** - 生成个性化的三阶段护肤方案
5. **AI互动问答** - 针对报告内容进行深入咨询

### 3. 三阶段护肤方案

- **第一阶段**: 修复与准备 - 基础护理和问题修复
- **第二阶段**: 核心治疗与改善 - 针对性治疗方案
- **第三阶段**: 巩固与维持 - 长期护理和预防

---

## 🎨 界面特性

### 主题定制
- **明暗主题**: 自动适应系统偏好或手动切换
- **配色方案**: 蓝色、玫瑰、薰衣草、薄荷四种主题色
- **字号调节**: 小、中、大三档字号选择

### AI设置
- **输出风格**: 专业、共情、简洁三种风格
- **内容长度**: 标准、详细、摘要三种长度

### 数据管理
- **诊断历史**: 本地保存所有诊断记录
- **报告导出**: 支持复制、Markdown导出、打印
- **隐私保护**: 所有数据仅在本地存储

---

## 📂 项目结构

```
SmartSkinAnalysis/
├── components/                 # React组件
│   ├── icons/                 # SVG图标组件
│   ├── DiagnosisForm.tsx      # 诊断问卷组件
│   ├── ImageUploader.tsx      # 图片上传组件
│   ├── PackageDesigner.tsx    # 套餐设计组件
│   ├── Spinner.tsx            # 加载动画组件
│   ├── SplashScreen.tsx       # 启动屏幕组件
│   └── Tutorial.tsx           # 引导教程组件
├── data/                      # 静态数据
│   ├── quotes.ts             # 启发性引言
│   └── treatments.ts         # 治疗方案数据
├── hooks/                     # 自定义Hooks
│   └── useLocalStorage.ts    # 本地存储Hook
├── services/                  # 服务层
│   └── geminiService.ts      # Gemini AI服务
├── App.tsx                    # 主应用组件
├── constants.ts               # 常量和配置
├── types.ts                   # TypeScript类型定义
├── index.tsx                  # 应用入口
├── index.html                 # HTML模板
├── vite.config.ts            # Vite配置
├── tsconfig.json             # TypeScript配置
└── package.json              # 项目依赖
```

---

## 🚀 部署指南

### 本地构建

```bash
npm run build
# 构建文件将生成在 dist/ 目录
```

### Vercel部署 (推荐)

1. **Fork项目到GitHub**
2. **连接Vercel账户**
3. **导入项目**
4. **配置环境变量**:
   - `GEMINI_API_KEY`: 你的Gemini API密钥
5. **部署完成**

### Netlify部署

1. **构建项目**
   ```bash
   npm run build
   ```
2. **上传dist文件夹到Netlify**
3. **配置环境变量**:
   - `GEMINI_API_KEY`: 你的Gemini API密钥

### 自定义服务器

项目生成静态文件，可部署到任何支持静态网站的服务器：
- Apache
- Nginx
- GitHub Pages (需要配置环境变量)
- 阿里云OSS
- 腾讯云COS

---

## 🔧 开发指南

### 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 核心开发概念

#### 1. 诊断表单结构

每个诊断类型都有对应的表单结构，定义在 `constants.ts` 中：

```typescript
export const DIAGNOSIS_FORMS: Record<FormType, FormStructure> = {
  sensitive: {
    title: '敏感肌诊断问卷',
    sections: [
      // 表单章节定义
    ]
  }
}
```

#### 2. AI服务集成

`geminiService.ts` 提供了与Google Gemini AI的完整集成：

- **图像分析**: 使用Gemini 2.5 Flash Image Preview模型
- **诊断生成**: 结构化JSON输出
- **聊天对话**: 上下文感知的问答

#### 3. 状态管理

使用React Hooks和自定义Hook进行状态管理：

- `useLocalStorage`: 持久化存储
- `useState`: 组件内状态
- `useEffect`: 副作用处理

---

## 🔒 隐私与安全

### 数据处理
- ✅ **本地存储**: 所有诊断数据仅存储在用户浏览器本地
- ✅ **API安全**: 仅向Google AI发送必要的诊断数据
- ✅ **无服务器架构**: 不保存任何用户数据到自有服务器
- ✅ **HTTPS传输**: 所有网络传输均采用加密连接

### 免责声明
- 🚨 本应用提供的建议仅供参考，不能替代专业医疗诊断
- 🚨 如有严重皮肤问题，请及时咨询专业皮肤科医生
- 🚨 AI生成的内容可能存在不准确性，请理性对待

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 贡献方式

1. **提交Issue**: 报告bug或提出功能建议
2. **Fork项目**: 创建你的功能分支
3. **提交PR**: 提交你的改进

### 开发规范

- 遵循现有的代码风格
- 添加适当的TypeScript类型
- 组件应当具有良好的可复用性
- 提交前请测试功能正常运行

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 📞 联系方式

- **技术支持**: yuxiaodong@beaucare.org
- **项目地址**: [GitHub Repository](https://github.com/your-username/SmartSkinAnalysis)
- **在线演示**: [Live Demo](https://your-demo-url.com)

---

## 🙏 致谢

- [Google Gemini AI](https://ai.google.dev/) - 提供强大的AI能力
- [React](https://reactjs.org/) - 优秀的前端框架
- [TailwindCSS](https://tailwindcss.com/) - 高效的CSS框架
- [Vite](https://vitejs.dev/) - 快速的构建工具

---

<div align="center">
  <p>🌟 如果这个项目对你有帮助，请给它一个Star！</p>
  <p>Copyright © 2025 SmartSkinAnalysis | Built with ❤️</p>
</div>
