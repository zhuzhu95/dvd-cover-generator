# DVD Cover Generator

一个基于 React + TypeScript + Tailwind CSS 构建的 DVD 封面和光盘标签生成器，灵感来自 [vhs.texs.org](https://vhs.texs.org)。

## 在线预览

访问 [在线演示](https://d2m36cndomnwc.ok.kimi.link) 体验完整功能。

## 功能特性

### DVD 封面生成器
- **TMDB 搜索** — 支持电影和剧集搜索，自动获取影片信息
- **多区域编辑** — 封面正面、书脊、封底独立编辑
- **标志系统** — 自动获取 TMDB 影片标志，支持上传自定义标志
- **封面艺术** — 海报和背景图片选择
- **工作室标志** — 制作公司 logo 显示，支持缩放和颜色切换（本色/白色/黑色）
- **书脊控制** — 标签文字、标志旋转/大小、媒体徽章
- **贴花系统** — 支持上传贴花图片并自由调整位置、大小、旋转
- **颜色控制** — 彩虹渐变、纯色背景、自定义背景图
- **布局设置** — VHS / DVD / 蓝光等多种预设尺寸
- **导出功能** — 支持 PNG、JPEG、PDF 格式导出

### 光盘标签生成器
- **盘面预览** — 实时预览光盘标签效果
- **文字编辑** — 标题、宣传语、简介、年份、来源等
- **简介/元数据字号** — 可独立调整文字大小
- **标志系统** — 同封面生成器
- **工作室标志** — 制作公司 logo 显示，支持缩放和颜色切换
- **封面艺术** — 支持背景图片
- **颜色控制** — 彩虹渐变、纯色背景
- **导出功能** — 支持 PNG、JPEG、PDF 格式导出

## 技术栈

- **React 19** + **TypeScript**
- **Vite** — 构建工具
- **Tailwind CSS** — 样式框架
- **shadcn/ui** — UI 组件库
- **Zustand** — 状态管理
- **html-to-image** — 导出图片
- **jsPDF** — 导出 PDF
- **TMDB API** — 影片数据

## 安装与运行

### 环境要求
- Node.js 20+
- npm 或 pnpm

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/zhuzhu95/dvd-cover-generator.git
cd dvd-cover-generator

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### TMDB API Key 设置

1. 访问 [The Movie Database](https://www.themoviedb.org/) 注册账号
2. 进入账户设置 → API → 申请 API Key
3. 在应用右上角点击设置按钮，输入 API Key

## 项目结构

```
src/
├── pages/              # 页面组件
│   ├── HomePage.tsx    # DVD 封面主页面
│   └── DiscLabelPage.tsx  # 光盘标签主页面
├── sections/           # 页面区块
│   ├── editors/        # DVD 封面编辑器
│   ├── disc/           # 光盘标签编辑器
│   ├── CoverPreview.tsx
│   ├── SearchBar.tsx
│   └── ...
├── store/              # Zustand 状态管理
│   ├── useStore.ts     # DVD 封面 store
│   └── useDiscStore.ts # 光盘标签 store
├── services/           # API 服务
│   └── tmdb.ts         # TMDB API 封装
├── types/              # TypeScript 类型定义
│   ├── index.ts
│   └── disc.ts
└── components/ui/      # shadcn/ui 组件
```

## 使用说明

### DVD 封面生成器
1. 在搜索框输入电影/剧集名称，选择类型（电影/剧集）
2. 点击搜索结果中的影片，自动填充信息
3. 在下方编辑器中调整封面样式
4. 点击"保存图片"或"导出"下载

### 光盘标签生成器
1. 点击顶部"光盘标签"切换到标签页面
2. 搜索影片或手动输入信息
3. 调整盘面文字、标志、工作室等
4. 导出为所需格式

## 开发计划

- [x] DVD 封面生成器
- [x] 光盘标签生成器
- [x] TMDB 电影/剧集搜索
- [x] PNG/JPEG/PDF 导出
- [x] 贴花系统
- [x] 颜色控制面板
- [ ] 更多预设模板
- [ ] 用户账户系统
- [ ] 历史记录保存

## 许可证

本项目仅供个人及非商业用途。请尊重版权。

## 致谢

- 灵感来源：[vhs.texs.org](https://vhs.texs.org)
- 数据来源：[The Movie Database](https://www.themoviedb.org/)
