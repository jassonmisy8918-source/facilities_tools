---
description: 排水设施管理平台前端Web端开发流程（Tailwind CSS + 深色/浅色护眼模式，登录真实JSON API，其他静态交互）
---

# 前端 Web 端开发 Agent

> **核心原则**：
> - 登录模块使用 JSON 文件模拟真实 API 接口
> - 其他所有功能做静态交互（Mock 数据 + 完整 UI 交互效果）
> - 使用 **Tailwind CSS v4** + **深色/浅色护眼模式** 切换

---

## Step 0：环境准备

确认 Node.js 已安装：

```bash
node --version
```

若未安装，使用 `winget install OpenJS.NodeJS.LTS` 安装。

---

## Step 1：项目初始化

// turbo
```bash
npm create vite@latest ./ -- --template vue-ts
```

// turbo
```bash
npm install
```

安装核心依赖：

```bash
npm install vue-router@4 pinia echarts ol lucide-vue-next
```

安装 Tailwind CSS v4：

```bash
npm install tailwindcss @tailwindcss/vite
```

安装开发依赖（Mock API）：

```bash
npm install -D vite-plugin-mock mockjs @types/mockjs
```

---

## Step 2：Tailwind CSS v4 配置

### 2.1 vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    viteMockServe({
      mockPath: 'src/mock',
      enable: true,
    }),
  ],
})
```

### 2.2 src/styles/main.css — 全局样式入口

```css
@import "tailwindcss";

/* ===========================
   Google Fonts
   =========================== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* ===========================
   Tailwind v4 自定义 Theme
   =========================== */
@theme {
  /* 字体 */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* ==================
     深色模式色板 (默认)
     ================== */
  --color-primary: #1B65B9;
  --color-primary-light: #2E7DE0;
  --color-primary-dark: #144B8A;
  --color-primary-50: #EBF2FC;
  --color-primary-100: #C4D9F5;
  --color-primary-500: #1B65B9;
  --color-primary-600: #1557A0;
  --color-primary-700: #144B8A;

  /* 功能色 */
  --color-success: #00D4AA;
  --color-success-light: #34E0C0;
  --color-success-dark: #00A888;
  --color-warning: #FFB020;
  --color-warning-light: #FFC34D;
  --color-warning-dark: #E09800;
  --color-danger: #FF4757;
  --color-danger-light: #FF6B7A;
  --color-danger-dark: #E03040;
  --color-info: #3B82F6;

  /* 侧边栏尺寸 */
  --sidebar-width: 260px;
  --sidebar-collapsed: 64px;
  --header-height: 60px;
}

/* ===========================
   深色/浅色护眼模式 CSS 变量
   =========================== */

/* --- 深色模式 (默认) --- */
:root {
  --bg-base: #0F1923;
  --bg-surface: #1A2736;
  --bg-card: #213345;
  --bg-hover: #2A3F54;
  --bg-input: #1A2736;
  --bg-sidebar: #0C1420;

  --text-primary: #E8EDF3;
  --text-secondary: #8899AA;
  --text-muted: #5A6B7C;
  --text-inverse: #0F1923;

  --border-default: #2A3F54;
  --border-light: #1E3348;

  --shadow-base: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* --- 浅色护眼模式 --- */
:root.light {
  --bg-base: #F0F4F8;
  --bg-surface: #FFFFFF;
  --bg-card: #FFFFFF;
  --bg-hover: #E8EEF4;
  --bg-input: #F5F7FA;
  --bg-sidebar: #1E293B;

  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;
  --text-inverse: #FFFFFF;

  --border-default: #E2E8F0;
  --border-light: #F1F5F9;

  --shadow-base: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* ===========================
   基础全局样式
   =========================== */
body {
  font-family: var(--font-sans);
  background-color: var(--bg-base);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 滚动条样式 */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-surface); }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
```

### 2.3 main.ts 引入

```typescript
import './styles/main.css'
```

### 2.4 Tailwind 使用规范

在组件中同时使用 **Tailwind 工具类** + **CSS 变量**：

```html
<!-- 示例：卡片组件 -->
<div class="rounded-lg p-6 transition-all duration-300 cursor-pointer
            hover:shadow-lg"
     style="background-color: var(--bg-card); border: 1px solid var(--border-default);">
  <h3 class="text-lg font-semibold" style="color: var(--text-primary);">标题</h3>
  <p class="text-sm mt-2" style="color: var(--text-secondary);">描述文字</p>
</div>
```

**或者创建 Tailwind 自定义工具类**（推荐）：

在 `main.css` 中添加：

```css
@utility bg-base { background-color: var(--bg-base); }
@utility bg-surface { background-color: var(--bg-surface); }
@utility bg-card { background-color: var(--bg-card); }
@utility bg-hover { background-color: var(--bg-hover); }
@utility text-default { color: var(--text-primary); }
@utility text-dim { color: var(--text-secondary); }
@utility text-muted { color: var(--text-muted); }
@utility border-themed { border-color: var(--border-default); }
@utility shadow-themed { box-shadow: var(--shadow-base); }
@utility shadow-themed-md { box-shadow: var(--shadow-md); }
```

这样组件可以直接写：

```html
<div class="bg-card border border-themed rounded-lg p-6 shadow-themed
            hover:shadow-themed-md transition-all duration-300">
  <h3 class="text-lg font-semibold text-default">标题</h3>
  <p class="text-sm mt-2 text-dim">描述</p>
</div>
```

---

## Step 3：深色/浅色模式切换

### 3.1 主题 Store（src/stores/theme.ts）

```typescript
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true) // 默认深色

  function toggle() {
    isDark.value = !isDark.value
  }

  // 监听变化，切换 <html> class
  watch(isDark, (dark) => {
    if (dark) {
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, { immediate: true })

  // 初始化：读取 localStorage
  const saved = localStorage.getItem('theme')
  if (saved === 'light') isDark.value = false

  return { isDark, toggle }
})
```

### 3.2 切换按钮（在 AppHeader.vue 中）

在顶栏右侧放置太阳/月亮图标切换按钮：
- 深色模式：显示 Sun 图标（点击切换到浅色）
- 浅色模式：显示 Moon 图标（点击切换到深色）
- 按钮带平滑旋转动画

### 3.3 ECharts 主题联动

ECharts 图表需根据当前主题动态切换配色：
- 深色：深色背景 + 亮色线条/文字
- 浅色：白色背景 + 深色线条/文字
- 监听 `isDark` 变化，调用 `chart.setOption()` 更新主题

---

## Step 4：项目目录结构

```
src/
├── assets/                     # 静态资源
├── components/
│   ├── layout/
│   │   ├── AppTopNav.vue       # 顶栏（Logo + 6大系统菜单 + 用户区）
│   │   ├── SubSidebar.vue      # 左侧子菜单（根据当前系统动态渲染）
│   │   └── AppBreadcrumb.vue   # 面包屑
│   ├── common/
│   │   ├── DataTable.vue       # 数据表格
│   │   ├── StatCard.vue        # 统计卡片
│   │   ├── ChartPanel.vue      # 图表面板（主题联动）
│   │   ├── StatusBadge.vue     # 状态徽章
│   │   ├── SearchBar.vue       # 搜索栏
│   │   ├── ModalDialog.vue     # 弹窗
│   │   └── ThemeToggle.vue     # 深/浅模式切换按钮
│   └── map/
│       ├── MapContainer.vue    # 地图容器
│       ├── LayerPanel.vue      # 图层面板
│       └── FacilityPopup.vue   # 设施信息弹窗
├── layouts/
│   └── MainLayout.vue
├── views/
│   ├── login/LoginPage.vue
│   ├── dashboard/DashboardView.vue
│   ├── assets/                 # 排水设施资产管理
│   │   ├── MapView.vue
│   │   ├── LedgerView.vue
│   │   ├── DataQualityView.vue
│   │   ├── AnalysisView.vue
│   │   └── DistrictView.vue
│   ├── monitoring/             # 综合监测
│   │   ├── WeatherView.vue
│   │   ├── RealtimeView.vue
│   │   ├── DataAnalysisView.vue
│   │   └── AlarmView.vue
│   ├── patrol/                 # 巡查养护
│   │   ├── PlanView.vue
│   │   ├── WorkOrderView.vue
│   │   ├── IssuesView.vue
│   │   ├── MaintenanceView.vue
│   │   └── StatisticsView.vue
│   ├── pump-station/           # 泵站运维
│   │   ├── MonitorView.vue
│   │   ├── EquipmentView.vue
│   │   ├── AlarmView.vue
│   │   ├── OperationView.vue
│   │   └── EnergyView.vue
│   ├── quality/                # 提质增效
│   │   ├── PipeHealthView.vue
│   │   ├── IntrusionView.vue
│   │   ├── CrossConnectionView.vue
│   │   ├── DispatchView.vue
│   │   └── DrainageUsersView.vue
│   └── system/
│       ├── UsersView.vue
│       └── RolesView.vue
├── router/index.ts
├── stores/
│   ├── user.ts                 # 用户（登录/Token/权限）
│   ├── theme.ts                # 主题（深色/浅色切换）
│   ├── app.ts                  # 应用状态
│   └── menu.ts                 # 菜单配置
├── mock/
│   ├── user.ts                 # 登录接口 Mock
│   └── data/
│       ├── users.json
│       ├── facilities.json
│       ├── monitoring.json
│       ├── alarms.json
│       ├── work-orders.json
│       └── statistics.json
├── styles/
│   └── main.css                # Tailwind 入口 + 主题变量 + 自定义工具类
├── utils/
│   ├── request.ts              # HTTP 请求封装
│   ├── auth.ts                 # Token 管理
│   └── mock-data.ts            # Mock 辅助
├── App.vue
└── main.ts
```

---

## Step 5：登录模块（真实 JSON API）

**唯一需要「真实 API 交互」的模块。**

### 5.1 Mock API 接口（src/mock/user.ts）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 验证用户名密码，返回 Token |
| GET | `/api/auth/userinfo` | 根据 Token 返回用户信息 |
| POST | `/api/auth/logout` | 退出登录 |

Mock 用户数据（src/mock/data/users.json）：

```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "admin123",
    "name": "系统管理员",
    "role": "admin",
    "avatar": "",
    "token": "mock-token-admin-xxxxx",
    "permissions": ["*"]
  },
  {
    "id": 2,
    "username": "operator",
    "password": "123456",
    "name": "运维操作员",
    "role": "operator",
    "avatar": "",
    "token": "mock-token-operator-xxxxx",
    "permissions": ["assets", "monitoring", "patrol"]
  }
]
```

### 5.2 登录页面（LoginPage.vue）

- 全屏渐变背景（深色模式：暗蓝渐变；浅色模式：浅蓝白渐变）
- 中央登录卡片，`bg-card border border-themed rounded-2xl shadow-themed-md`
- 左侧品牌区：系统名称「智慧排水管理平台」+ 简介 + 特性图标列表
- 右侧表单区：
  - 用户名输入框（带用户图标前缀）
  - 密码输入框（带锁图标前缀 + 显示/隐藏切换）
  - 记住我复选框
  - 登录按钮（`bg-primary hover:bg-primary-light`，全宽，圆角）
- 错误提示（`text-danger` + 抖动动画）
- 登录成功 → 跳转 `/dashboard`

### 5.3 路由守卫

- `beforeEach`：无 Token → 重定向 `/login`
- 已登录访问 `/login` → 重定向 `/dashboard`

---

## Step 6：主布局框架（MainLayout.vue）

**布局结构：顶栏系统菜单 + 左侧子菜单 + 内容区**

```
┌──────────────────────────────────────────────────────────────┐
│  Logo  │ 资产管理 │ 综合监测 │ 巡查养护 │ 泵站运维 │ 提质增效 │ 驾驶舱 │ 🌙 👤 │
├────────┼─────────────────────────────────────────────────────┤
│ 子菜单  │                                                    │
│        │                                                    │
│ 设施地图│              主内容区                                │
│ 设施台账│          （<router-view>）                           │
│ 数据管理│                                                    │
│ 空间分析│                                                    │
│ 分区管理│                                                    │
│        │                                                    │
└────────┴─────────────────────────────────────────────────────┘
```

### 顶栏（AppTopNav.vue）

**始终深色背景**（`bg-[#0C1420]`），深色/浅色模式下顶栏不变。

- **左侧**：Logo + 系统名称「智慧排水管理平台」
- **中间**：6 大系统主菜单，水平排列，Lucide SVG 图标 + 文字：
  - Map → 排水设施资产管理
  - Activity → 综合监测
  - Search → 巡查养护
  - Settings → 泵站运维
  - Droplets → 提质增效
  - LayoutDashboard → 运行驾驶舱
- **当前激活系统高亮**：底部 2px 高亮条（`border-b-2 border-primary`）+ 文字亮色
- **右侧**：全局搜索 + **主题切换按钮（太阳/月亮）** + 通知铃铛 + 用户头像下拉
- 点击系统菜单 → 路由切换到对应系统首页，左侧子菜单联动更新

### 左侧子菜单（SubSidebar.vue）

根据**当前激活的系统**动态渲染对应的子菜单项。

- 深色模式：`bg-[var(--bg-sidebar)]`
- 浅色模式：`bg-slate-800`（始终深色，与内容区形成对比）
- 宽度：`w-52`（208px），支持折叠到 `w-16`（64px，仅图标）
- 顶部：当前系统名称 + 折叠按钮
- 菜单项：Lucide SVG 图标 + 文字
- 当前路由高亮：`bg-primary/20 text-primary-light border-l-2 border-primary`
- 展开/折叠动画：`transition-all duration-300`

**各系统子菜单配置：**

| 系统 | 子菜单 |
|------|--------|
| 排水设施资产管理 | 设施一张图、设施台账、数据资源管理、网络/空间分析、排水分区管理 |
| 综合监测 | 气象信息、实时监测、数据分析、智能预警、监测设备管理 |
| 巡查养护 | 巡查计划、巡查工单、问题上报、养护管理、统计分析 |
| 泵站运维 | 远程监控、设备管理、报警管理、运维工单、能耗管理 |
| 提质增效 | 管道健康、外水入侵、雨污混接、污水调度、排水户管理 |
| 运行驾驶舱 | 无子菜单（全屏大屏模式，隐藏子菜单） |

### 面包屑（AppBreadcrumb.vue）
- 位于主内容区顶部
- 格式：`当前系统 / 当前页面`
- 可点击导航

### 内容区
- `bg-base min-h-screen transition-colors duration-300`
- `<router-view>` + fade 过渡动画
- 内容区有 `p-6` 内边距

---

## Step 7：排水设施资产管理（静态交互）

> 对应需求 9.1.1

### 7.1 设施一张图（MapView.vue）
- OpenLayers 地图（自适应主题：深色/浅色地图瓦片）
- 左侧图层面板（`bg-surface` 浮层，设施类型勾选列表）
- 底部统计面板（ECharts 柱状/饼图，主题联动）
- 右侧工具栏（放大/缩小/全局/测量按钮组）
- 点击点位 → 弹出设施信息卡片

### 7.2 设施台账（LedgerView.vue）
- Tab 栏：排水户/管网/检查井/泵站/污水厂…
- DataTable 组件（筛选栏 + 表格 + 分页）
- 行点击 → 右侧抽屉详情
- 深色/浅色表格行交替色自适应

### 7.3 数据资源管理（DataQualityView.vue）
- 质检任务列表 + 状态 Badge
- 质检报告弹窗

### 7.4 网络/空间分析（AnalysisView.vue）
- 左侧分析工具菜单 + 中间地图 + 右侧结果面板

### 7.5 排水分区管理（DistrictView.vue）
- 分区类型 Tab + 分区列表 + 指标看板

---

## Step 8：综合监测系统（静态交互）

> 对应需求 9.1.2

### 8.1 气象信息（WeatherView.vue）
- 天气卡片（温度/湿度/风力）+ 降雨柱状图

### 8.2 实时监测（RealtimeView.vue）
- 四宫格：雨量/流量/水位/水质 仪表盘
- 监测点位地图

### 8.3 数据分析（DataAnalysisView.vue）
- 查询条件 + 折线图 + 数据表

### 8.4 智能预警（AlarmView.vue）
- 报警列表（等级颜色 Badge） + 报警统计饼图

---

## Step 9：巡查养护系统（静态交互）

> 对应需求 9.1.3

### 9.1 巡查计划（PlanView.vue）— 日历/列表视图
### 9.2 巡查工单（WorkOrderView.vue）— 看板（4列状态流）
### 9.3 问题上报（IssuesView.vue）— 问题列表 + 地图
### 9.4 养护管理（MaintenanceView.vue）— 养护计划/工单
### 9.5 统计分析（StatisticsView.vue）— KPI 卡片 + 图表集

---

## Step 10：泵站智能运维系统（静态交互）

> 对应需求 9.1.4

### 10.1 远程监控（MonitorView.vue）— 泵站卡片 + 仪表盘 + 曲线
### 10.2 设备管理（EquipmentView.vue）— 台账表 + KPI 卡片
### 10.3 报警管理（AlarmView.vue）— 列表 + 处置流程
### 10.4 运维工单（OperationView.vue）— 工单列表 + 流程
### 10.5 能耗管理（EnergyView.vue）— 电耗仪表盘 + 碳排放

---

## Step 11：提质增效系统（静态交互）

> 对应需求 9.1.5

### 11.1 管道健康（PipeHealthView.vue）— 健康评分 + 缺陷列表
### 11.2 外水入侵（IntrusionView.vue）— 入侵列表 + 地图
### 11.3 雨污混接（CrossConnectionView.vue）— 混接分析
### 11.4 污水调度（DispatchView.vue）— 策略 + 监控面板
### 11.5 排水户管理（DrainageUsersView.vue）— 表格 + 详情

---

## Step 12：运行驾驶舱大屏（静态交互）

> 对应需求 9.1.6

`DashboardView.vue` — **全屏大屏布局，隐藏侧边栏和顶栏**

```
┌──────────────────────────────────────────────┐
│              智慧排水运行驾驶舱                 │
├──────────┬─────────────────────┬─────────────┤
│ 左面板    │    中央 GIS 地图     │   右面板     │
│ 设施统计  │  专题图层 + 预警闪烁  │  预警列表    │
│ 缺陷分布  │                     │  工单进度    │
│ 监测概况  │                     │  泵站状态    │
├──────────┴─────────────────────┴─────────────┤
│          底部面板（图表统计看板行）               │
│   降雨趋势 │ 巡查完成率 │ 能耗对比 │ 水质达标     │
└──────────────────────────────────────────────┘
```

深色/浅色主题全面适配所有面板、图表、地图。

---

## Step 13：验证

1. 启动项目：

// turbo
```bash
npm run dev
```

2. 浏览器验证清单：
   - [ ] 访问首页 → 自动跳转 `/login`
   - [ ] admin / admin123 登录成功 → 跳转驾驶舱
   - [ ] 错误密码 → 错误提示
   - [ ] 顶栏6大系统菜单可点击，左侧子菜单联动切换
   - [ ] 子菜单各页面可正常渲染
   - [ ] **深色/浅色切换**：点击顶栏主题按钮 → 全局颜色平滑过渡
   - [ ] 图表主题联动（深色/浅色配色切换）
   - [ ] 表格、卡片、弹窗等组件主题适配
   - [ ] 退出登录 → 返回登录页
   - [ ] 直接访问内页（无 Token）→ 重定向登录页

---

## 技术规范速查

| 项目 | 规范 |
|------|------|
| CSS 框架 | **Tailwind CSS v4** |
| 主题 | **深色（默认）+ 浅色护眼**，通过 `<html class="light">` 切换 |
| 颜色系统 | CSS 变量 + Tailwind `@utility` 自定义工具类 |
| 图标 | Lucide SVG，**禁止 emoji** |
| 字体 | Google Fonts `Inter` |
| 图表 | ECharts 5，动态跟随主题 |
| 地图 | OpenLayers + OSM 瓦片 |
| Mock | vite-plugin-mock + JSON 文件 |
| 状态管理 | Pinia（user / theme / app / menu） |
| 组件命名 | PascalCase |
| 过渡动画 | Tailwind `transition-*` + `duration-300` |
