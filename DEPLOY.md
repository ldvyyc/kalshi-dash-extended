# Kalshi Dashboard Extended — 部署指南

## 新增图表

在原版基础上新增了 6 个分析组件：

1. **Drawdown Chart** — 从峰值累计 PnL 的回撤百分比曲线
2. **Weekly P&L Bar** — 按自然周汇总的净盈亏柱状图
3. **Monthly P&L Heatmap** — 年×月热力图，颜色深度代表盈亏幅度
4. **Return Distribution Histogram** — 每笔交易净盈亏的频率分布直方图
5. **Holding Period vs P&L Scatter** — 持仓天数 vs 净盈亏散点图（赢/亏分色）
6. **Per-Market Performance Table** — 每个 Ticker 的净 PnL、ROI、胜率、持仓时间，支持点击列排序

---

## 本地开发

```bash
git clone <your-repo>
cd kalshi-dash-extended
npm install
npm run dev
# 浏览器打开 http://localhost:3000
```

---

## 部署到 Cloudflare Pages + 自定义域名

### 第一步：推到 GitHub

```bash
# 在项目根目录
git init
git add .
git commit -m "init: kalshi-dash extended"

# 在 GitHub 上新建一个 repo（比如 kalshi-dash-extended）
git remote add origin https://github.com/<你的用户名>/kalshi-dash-extended.git
git push -u origin main
```

### 第二步：在 Cloudflare Pages 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 左侧菜单 → **Workers & Pages** → **Create application** → **Pages**
3. 点 **Connect to Git** → 选择你刚推的 repo
4. **Build settings** 填写：
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
5. 点 **Save and Deploy**，等待首次构建完成（约 1-2 分钟）
6. 构建成功后你会得到一个 `xxx.pages.dev` 的地址，可以先测试

### 第三步：绑定你的子域名

因为你的 `ldvyyc.com` 已经在 Cloudflare，这步很简单：

1. 在 Pages 项目页面，点 **Custom domains** → **Set up a custom domain**
2. 输入子域名，例如：`kalshi.ldvyyc.com`
3. Cloudflare 会自动在你的 DNS 里添加 CNAME，点 **Activate domain** 确认
4. 几分钟后生效，HTTPS 也会自动配好

### 后续更新

每次 `git push main`，Cloudflare Pages 会自动重新构建并部署，无需手动操作。

---

## 目录结构

```
src/
├── app/
│   ├── page.tsx          # 主页面（不用改）
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── CsvUploader.tsx   # 主容器，控制组件渲染顺序
│   ├── Overview.tsx      # 统计卡片
│   ├── PnlChart.tsx      # 累计 PnL 折线图（原版）
│   ├── DrawdownChart.tsx         ← 新增
│   ├── WeeklyPnlBar.tsx          ← 新增
│   ├── MonthlyPnlHeatmap.tsx     ← 新增
│   ├── PnlHistogram.tsx          ← 新增
│   ├── HoldingPeriodScatter.tsx  ← 新增
│   ├── TopMarketsTable.tsx       ← 新增
│   ├── RiskAdjustedReturns.tsx
│   ├── SeriesStatsTable.tsx
│   ├── TradeDirectionPie.tsx
│   ├── TradeSettlementPie.tsx
│   ├── MakerTakerPie.tsx
│   └── TradeList.tsx
└── utils/
    └── processData.ts    # CSV 解析逻辑（原版，未修改）
```
