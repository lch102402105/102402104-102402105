# 校园失物招领 · 小程序原型说明文档（README）

> 一套纯静态的移动端「校园失物招领」原型：5 个独立 HTML 页面 + 浏览器本地存储（localStorage），无需后端、无需构建、无需安装依赖，直接用浏览器打开即可演示「浏览 → 搜索 → 查看详情 → 发布 → 管理我的发布」的完整闭环。

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>项目</p></th><th colspan="1" rowspan="1"><p>说明</p></th></tr><tr><td colspan="1" rowspan="1"><p>项目名称</p></td><td colspan="1" rowspan="1"><p>校园失物招领（移动端原型）</p></td></tr><tr><td colspan="1" rowspan="1"><p>代码位置</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">/workspace/lost-and-found.html/</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>页面数量</p></td><td colspan="1" rowspan="1"><p>5 个（<code class="tp-code" spellcheck="false">home.html</code>、<code class="tp-code" spellcheck="false">search.html</code>、<code class="tp-code" spellcheck="false">detail.html</code>、<code class="tp-code" spellcheck="false">publish.html</code>、<code class="tp-code" spellcheck="false">my-posts.html</code>）</p></td></tr><tr><td colspan="1" rowspan="1"><p>技术形态</p></td><td colspan="1" rowspan="1"><p>纯静态 HTML + 内联 CSS/JS，无后端、无打包、无独立资源目录</p></td></tr><tr><td colspan="1" rowspan="1"><p>样式与图标</p></td><td colspan="1" rowspan="1"><p>Tailwind CSS 原子类 + Iconify 图标组件（均以 <code class="tp-code" spellcheck="false">&lt;script src&gt;</code> 引入）</p></td></tr><tr><td colspan="1" rowspan="1"><p>数据存储</p></td><td colspan="1" rowspan="1"><p>浏览器 <code class="tp-code" spellcheck="false">localStorage</code>，键名 <code class="tp-code" spellcheck="false">campus_lost_found_items</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>文档更新时间</p></td><td colspan="1" rowspan="1"><p>2026-10-10</p></td></tr></tbody></table></div>

---

## 一、项目简介

本原型面向校园失物招领业务，模拟一个"同学自助发布 / 自助查找"的信息广场。它不连接任何服务端，所有信息都保存在**当前浏览器本地**，因此：

-   打开就能演示完整交互，方便做方案评审、交互走查和答辩展示；
    
-   数据不是真实共享的：换浏览器、换设备、换端口会看到各自的本地数据；
    
-   代码是单文件自包含的，适合作为"交互原型 → 前端开发"的交付基线。
    

原型内预置了 **6 条种子数据**（`SEED_DATA`，`id` 为 1–6），涵盖"寻物 / 招领"两种类型和"进行中 / 已完结"两种状态，覆盖全部页面的渲染分支。

需要特别注意的一处命名差异：早期需求文档中首页写作 `index.html`，**本代码的实际首页文件名是** `home.html`，所有页面间跳转也都指向 `home.html`。

---

## 二、目录与文件结构

项目目录是平铺结构，没有子目录、没有构建产物、没有独立 CSS/JS 文件夹：

```plaintext
/workspace/lost-and-found.html/
├── home.html        首页：统计、搜索入口、分类标签、信息卡片列表、底部导航
├── search.html      搜索页：实时搜索、热门关键词、类型筛选、结果列表、空状态
├── detail.html      详情页：物品大图、类型/状态徽章、描述、地点时间、发布者卡片、联系弹窗
├── publish.html     发布页：类型选择、必填校验、类别选择、发布成功浮层
└── my-posts.html    我的发布：进行中/已完成统计、状态 Tab、列表、标记已找回/已归还
```

代码组织约定（5 个页面完全一致）：

1.  **单文件自包含**：每个页面把结构（HTML）、样式（`<style>` 内联少量自定义类）与脚本（`<script>` 内联全部逻辑）写在一个文件里。
    
2.  **移动端画布**：`<body>` 居中放置一个 `max-w-[393px] max-h-[852px]` 的手机容器，页面在宽屏下呈现为"手机壳"效果。
    
3.  **自定义工具类**：每个页面 `<style>` 里都定义了 3 个辅助类 —— `.no-scrollbar`（隐藏滚动条）、`.is-hidden`（`display: none !important`，用于弹层/空状态显隐）、`.no-scrollbar` 系列滚动优化。
    
4.  **数据层重复内联**：8 个数据层函数与 `SEED_DATA` 被**完整复制到每一个页面**（原设计稿中这部分是独立文件 `js/store.js`，本实现改为内联注入）。这一点在二次开发时很重要，见第七节。
    
5.  **图标与图片**：
    
    -   图标通过 `<iconify-icon icon="mdi:xxx">` 使用 Material Design Icons（`mdi:` 前缀）；
        
    -   图片使用平台生成的图片地址，并统一做"兜底"处理——缩略图容器为 `bg-gradient-to-br` 渐变底色 + 居中图标，`<img>` 绝对定位覆盖在上层；图片加载失败时自动露出下层渐变 + 图标。
        

---

## 三、五个页面的职责

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>页面</p></th><th colspan="1" rowspan="1"><p>文件</p></th><th colspan="1" rowspan="1"><p>核心职责</p></th><th colspan="1" rowspan="1"><p>关键元素</p></th></tr><tr><td colspan="1" rowspan="1"><p>首页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">home.html</code></p></td><td colspan="1" rowspan="1"><p>汇总展示全部信息，支持按类型筛选</p></td><td colspan="1" rowspan="1"><p>顶部统计条、搜索入口、分类标签（全部/寻物/招领）、卡片列表、底部导航</p></td></tr><tr><td colspan="1" rowspan="1"><p>搜索页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">search.html</code></p></td><td colspan="1" rowspan="1"><p>按关键词与类型检索信息</p></td><td colspan="1" rowspan="1"><p>返回、实时搜索框、热门关键词、类型筛选、结果列表、无结果空状态</p></td></tr><tr><td colspan="1" rowspan="1"><p>详情页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">detail.html</code></p></td><td colspan="1" rowspan="1"><p>展示单条信息全貌并给出联系方式</p></td><td colspan="1" rowspan="1"><p>物品大图、类型/状态徽章、编号与提示、物品描述、地点时间、发布者卡片、「联系发布者」弹窗</p></td></tr><tr><td colspan="1" rowspan="1"><p>发布页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">publish.html</code></p></td><td colspan="1" rowspan="1"><p>采集并入库一条新信息</p></td><td colspan="1" rowspan="1"><p>类型选择（寻物/招领）、名称/地点/时间/联系方式（必填校验）、类别（选填）、补充描述、发布成功浮层</p></td></tr><tr><td colspan="1" rowspan="1"><p>我的发布</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">my-posts.html</code></p></td><td colspan="1" rowspan="1"><p>管理自己发布的信息并标记完结</p></td><td colspan="1" rowspan="1"><p>进行中/已完成统计、状态 Tab（全部/进行中/已完成）、列表、标记「已找回 / 已归还」、Toast 提示</p></td></tr></tbody></table></div>

各页面补充说明：

-   **首页** `home.html`：头部为蓝色渐变区，含"今日新增 / 待认领"等展示性统计数字（当前为静态文案）；右侧头像入口跳转 `my-posts.html`。分类标签用 `data-chip` 标记选中态，切换时调用 `filterCards(btn, type)`，再由 `renderCards()` 重新渲染列表；列表右侧 `countText` 显示"共 N 条信息"。已完结条目在卡片右下角显示状态标签（如"已找回"），进行中条目显示"详情 >"。
    
-   **搜索页** `search.html`：输入框绑定 `input` 事件，输入即搜（无需回车），同时保留"搜索"按钮（`runSearch()`）与清空按钮（`clearKeyword()`）。关键词为空时展示"大家都在搜"热门词（雨伞、校园卡、图书馆、耳机、钥匙），点击即用 `useKeyword()` 填入并搜索；结果数为 0 时切换到空状态区块，提供"重新搜索 / 去发布信息"两个出口。
    
-   **详情页** `detail.html`：底部是操作条（收藏 `toggleFav()` + 「联系发布者」`openContact()`），不是四宫格导航。打开弹窗后可一键复制手机号或微信号（`copyValue()`，调用 `navigator.clipboard`，复制后按钮变为"已复制"）。顶部"分享"按钮为展示态，无实际行为。
    
-   **发布页** `publish.html`：类型切换（`chooseType()`）会同步更新提示文案与输入框 placeholder；类别按钮为可反选的多态标签（`chooseCat()`），未选择时默认写入"其他"。图片上传区为展示态，点击提示"原型演示：图片上传功能将在正式版本开放"。
    
-   **我的发布** `my-posts.html`：只展示 `owner === true` 的记录（种子数据中 id 1/2/3/6 为 `owner: true`），因此初始为"进行中 3 条 / 已完成 1 条"。列表项含「查看详情」和「标记已找回 / 标记已归还」按钮；已完结记录的按钮置灰为"信息已完结"。
    

---

## 四、数据层与关键函数

### 4.1 存储与读写

-   存储介质：`window.localStorage`
    
-   存储键名：`campus_lost_found_items`（代码中为常量 `STORE_KEY`）
    
-   存储内容：一个 JSON 数组，数组第一项是最新发布的信息（`addItem()` 使用 `unshift` 置顶）
    
-   容错：`getAll()` 用 `try/catch` 包裹 `JSON.parse`，解析失败时返回 `[]`，不会因脏数据白屏
    

### 4.2 数据层函数清单

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>函数</p></th><th colspan="1" rowspan="1"><p>签名</p></th><th colspan="1" rowspan="1"><p>语义</p></th></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">getAll()</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">() =&gt; Item[]</code></p></td><td colspan="1" rowspan="1"><p>读取全部数据；<code class="tp-code" spellcheck="false">JSON.parse</code> 失败时返回空数组</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">saveAll(list)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(list) =&gt; void</code></p></td><td colspan="1" rowspan="1"><p>把整个数组序列化写回 localStorage</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">genNo()</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">() =&gt; string</code></p></td><td colspan="1" rowspan="1"><p>生成编号，形如 <code class="tp-code" spellcheck="false">LF20261010001</code>（<code class="tp-code" spellcheck="false">LF</code> + 年月日 + 3 位序号，序号取"当前条数 + 1"并左补零）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">addItem(item)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(item) =&gt; Item</code></p></td><td colspan="1" rowspan="1"><p>新增一条：自动补 <code class="tp-code" spellcheck="false">id: Date.now()</code>、<code class="tp-code" spellcheck="false">no</code>、<code class="tp-code" spellcheck="false">status</code>（<code class="tp-code" spellcheck="false">type === 'lost'</code> 为「寻找中」，否则「待认领」）、<code class="tp-code" spellcheck="false">createTime</code>，并 <code class="tp-code" spellcheck="false">unshift</code> 到数组最前，返回新记录</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">getById(id)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(id) =&gt; Item | null</code></p></td><td colspan="1" rowspan="1"><p>按 id 查询，使用 <code class="tp-code" spellcheck="false">String()</code> 转换后进行字符串比较，兼容数字/字符串 id</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">markDone(id)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(id) =&gt; boolean</code></p></td><td colspan="1" rowspan="1"><p>更新状态：寻物 →「已找回」，招领 →「已归还」，同时写入 <code class="tp-code" spellcheck="false">doneTime</code>；未找到返回 <code class="tp-code" spellcheck="false">false</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">search(keyword, type)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(keyword, type) =&gt; Item[]</code></p></td><td colspan="1" rowspan="1"><p>关键词匹配 <code class="tp-code" spellcheck="false">title</code>、<code class="tp-code" spellcheck="false">place</code>、<code class="tp-code" spellcheck="false">desc</code>、<code class="tp-code" spellcheck="false">tags</code>（统一转小写后的"包含"匹配），并按 <code class="tp-code" spellcheck="false">type</code> 过滤；<code class="tp-code" spellcheck="false">type</code> 支持 <code class="tp-code" spellcheck="false">all</code>、<code class="tp-code" spellcheck="false">lost</code>、<code class="tp-code" spellcheck="false">found</code> 或空值</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">initSeed(seedList)</code></p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">(seedList) =&gt; void</code></p></td><td colspan="1" rowspan="1"><p>首次访问注入种子数据：当 localStorage 中不存在 <code class="tp-code" spellcheck="false">STORE_KEY</code> 时写入 <code class="tp-code" spellcheck="false">SEED_DATA</code></p></td></tr></tbody></table></div>

页面级渲染/交互函数（各自内联在对应页面）：

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>函数</p></th><th colspan="1" rowspan="1"><p>所属页面</p></th><th colspan="1" rowspan="1"><p>语义</p></th></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">cardHtml(it)</code> / <code class="tp-code" spellcheck="false">badge(type)</code></p></td><td colspan="1" rowspan="1"><p>首页、搜索页、我的发布</p></td><td colspan="1" rowspan="1"><p>生成卡片 HTML 片段与类型徽章（寻物=橙色、招领=绿色）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">renderCards()</code> / <code class="tp-code" spellcheck="false">filterCards(btn, type)</code></p></td><td colspan="1" rowspan="1"><p>首页</p></td><td colspan="1" rowspan="1"><p>按当前分类重新渲染列表并更新"共 N 条信息"</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">render()</code> / <code class="tp-code" spellcheck="false">filterType()</code> / <code class="tp-code" spellcheck="false">useKeyword()</code> / <code class="tp-code" spellcheck="false">clearKeyword()</code> / <code class="tp-code" spellcheck="false">runSearch()</code></p></td><td colspan="1" rowspan="1"><p>搜索页</p></td><td colspan="1" rowspan="1"><p>渲染结果、类型筛选、点击热门词、清空、按钮触发搜索，并同步空状态与关键词标签</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">applyData(d)</code> / <code class="tp-code" spellcheck="false">openContact()</code> / <code class="tp-code" spellcheck="false">closeContact()</code> / <code class="tp-code" spellcheck="false">copyValue()</code> / <code class="tp-code" spellcheck="false">toggleFav()</code></p></td><td colspan="1" rowspan="1"><p>详情页</p></td><td colspan="1" rowspan="1"><p>把记录字段写入 DOM、打开/关闭联系弹窗、复制联系方式、收藏切换</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">chooseType()</code> / <code class="tp-code" spellcheck="false">chooseCat()</code> / <code class="tp-code" spellcheck="false">showError()</code> / <code class="tp-code" spellcheck="false">submitPost()</code> / <code class="tp-code" spellcheck="false">toggleUploadTip()</code></p></td><td colspan="1" rowspan="1"><p>发布页</p></td><td colspan="1" rowspan="1"><p>类型切换、类别选择、字段校验提示、提交入库并弹出成功浮层</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">renderList()</code> / <code class="tp-code" spellcheck="false">updateStats()</code> / <code class="tp-code" spellcheck="false">applyTab()</code> / <code class="tp-code" spellcheck="false">markPostDone()</code> / <code class="tp-code" spellcheck="false">showToast()</code></p></td><td colspan="1" rowspan="1"><p>我的发布</p></td><td colspan="1" rowspan="1"><p>渲染列表、刷新统计、Tab 过滤、标记完结并 Toast 提示</p></td></tr></tbody></table></div>

### 4.3 记录字段结构

一条记录（JS 对象）包含以下字段：

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>字段</p></th><th colspan="1" rowspan="1"><p>类型</p></th><th colspan="1" rowspan="1"><p>说明</p></th></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">id</code></p></td><td colspan="1" rowspan="1"><p>number</p></td><td colspan="1" rowspan="1"><p>唯一标识，种子数据为 1–6，新发布为 <code class="tp-code" spellcheck="false">Date.now()</code> 时间戳</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">no</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>业务编号，如 <code class="tp-code" spellcheck="false">LF20260926001</code></p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">type</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">lost</code> = 寻物，<code class="tp-code" spellcheck="false">found</code> = 招领</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">title</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>物品名称</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">place</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>丢失或拾取地点</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">fullTime</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>具体时间（发布页把 <code class="tp-code" spellcheck="false">datetime-local</code> 的 <code class="tp-code" spellcheck="false">T</code> 替换为空格）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">time</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>列表展示用的相对时间文案，如"今天 09:20"、"刚刚"</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">category</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>物品类别（选填，默认"其他"）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">desc</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>补充描述</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">contact</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>用户填写的联系方式（手机号或微信号）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">publisher</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>发布者名称；原型中本地发布的记录固定为「我」</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">phone</code> / <code class="tp-code" spellcheck="false">wechat</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>详情页弹窗展示的联系方式（本地发布时两者都取输入的联系方式）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">status</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>状态：<code class="tp-code" spellcheck="false">寻找中</code> / <code class="tp-code" spellcheck="false">待认领</code>（进行中），<code class="tp-code" spellcheck="false">已找回</code> / <code class="tp-code" spellcheck="false">已归还</code>（已完结）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">createTime</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>创建时间（ISO 字符串）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">doneTime</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>完结时间（ISO 字符串），仅在 <code class="tp-code" spellcheck="false">markDone()</code> 后写入</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">tags</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>搜索用关键词串（名称 + 地点 + 类别）</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">owner</code></p></td><td colspan="1" rowspan="1"><p>boolean</p></td><td colspan="1" rowspan="1"><p>是否为"我的发布"，<code class="tp-code" spellcheck="false">my-posts.html</code> 以此过滤</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">icon</code> / <code class="tp-code" spellcheck="false">iconColor</code> / <code class="tp-code" spellcheck="false">tone</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>图标名、图标色、渐变底色，用于图片兜底与卡片视觉</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">img</code> / <code class="tp-code" spellcheck="false">alt</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>图片地址与无障碍替代文本</p></td></tr><tr><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">sub</code> / <code class="tp-code" spellcheck="false">stat</code> / <code class="tp-code" spellcheck="false">meta</code> / <code class="tp-code" spellcheck="false">tip</code></p></td><td colspan="1" rowspan="1"><p>string</p></td><td colspan="1" rowspan="1"><p>卡片副标题、浏览量等展示文案、发布者元信息、详情页蓝色提示语</p></td></tr></tbody></table></div>

---

## 五、页面跳转与三条使用流程

### 5.1 跳转关系

所有跳转均为**相对路径**（不再引用任何绝对链接），可直接在本地目录内互相打开：

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>目标</p></th><th colspan="1" rowspan="1"><p>路径写法</p></th></tr><tr><td colspan="1" rowspan="1"><p>首页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">home.html</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>搜索页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">search.html</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>发布页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">publish.html</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>我的发布</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">my-posts.html</code></p></td></tr><tr><td colspan="1" rowspan="1"><p>详情页</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">detail.html?id=&lt;记录 id&gt;</code></p></td></tr></tbody></table></div>

`home.html`、`search.html`、`publish.html`、`my-posts.html` 之间通过底部四宫格导航互通（首页 / 搜索 / 发布 / 我的）；`detail.html` 通过列表卡片上的 `detail.html?id=1` 这类带参链接进入，返回按钮回到 `home.html`。

详情页读取数据的方式：

```javascript
initSeed(SEED_DATA);
var params = new URLSearchParams(window.location.search);
var d = getById(params.get('id')) || getById(1);   // 无效 id 回退到第一条
if (!d) { location.href = 'home.html'; }
else { currentId = d.id; applyData(d); }
```

### 5.2 三条典型使用流程

**流程一 · 查看信息**

1.  打开 `home.html`，浏览卡片列表，或点击「全部 / 寻物 / 招领」切换分类；
    
2.  点击任意卡片，跳转 `detail.html?id=<id>`，查看大图、类型与状态徽章、物品描述、地点与时间、发布者信息；
    
3.  点击底部「联系发布者」弹出联系方式弹窗，点击「复制」复制手机号或微信号，与对方线下当面交接。
    

**流程二 · 发布信息**

1.  从底部导航或首页进入 `publish.html`；
    
2.  选择类型（寻物 / 招领），填写物品名称、地点、时间、联系方式（均为必填，缺失时显示红色错误提示），可选类别与补充描述；
    
3.  点击「发布信息」，`submitPost()` 校验通过后调用 `addItem()` 写入 localStorage，并弹出「发布成功」浮层；
    
4.  浮层中点击「查看我的发布」进入 `my-posts.html`，新记录出现在列表最前，统计数字同步增加。
    

**流程三 · 搜索信息**

1.  从底部导航或首页搜索框进入 `search.html`；
    
2.  在搜索框输入关键词（输入即搜，或点击热门关键词），可叠加「全部类型 / 寻物 / 招领」筛选；
    
3.  结果列表实时刷新并显示"共 N 条结果"；无匹配时显示空状态；
    
4.  点击结果卡片进入 `detail.html?id=<id>` 查看并联系。
    

### 5.3 状态流转

```plaintext
发布 → 寻物：寻找中        →（我的发布页标记）→ 已找回
      招领：待认领        →（我的发布页标记）→ 已归还
```

标记完结后，`detail.html` 的状态徽章变为深色态，`home.html` / `search.html` 的卡片右下角显示"已找回 / 已归还"标签，`my-posts.html` 的按钮置灰为"信息已完结"，统计数字同步刷新。

---

## 六、本地运行与预览

本项目没有任何构建步骤，也无需安装依赖。

### 方式一：直接打开（最快）

双击 `home.html`，或在浏览器地址栏打开该文件的绝对路径（如 `file:///.../lost-and-found.html/home.html`）。

### 方式二：起一个本地静态服务（推荐）

多页面之间依赖 `localStorage` 共享数据，通过 HTTP 访问比 `file://` 更稳定（部分浏览器对 `file://` 的本地存储限制更严格）：

```bash
cd /workspace/lost-and-found.html
python3 -m http.server 8000
```

然后访问 `http://localhost:8000/home.html`。

### 预览提示

-   原型按手机尺寸设计（内容容器 `max-w-[393px] max-h-[852px]`），建议使用浏览器"设备模拟 / 响应式模式"选择 iPhone 尺寸查看，或把浏览器窗口收窄到手机宽度；
    
-   页面通过 `<script src>` 引入 Tailwind CSS 运行时与 Iconify 图标组件（指向原型平台提供的静态资源地址），**首次打开需要能访问该地址**；图片同样使用平台生成的图片地址，若图片加载失败，会自动显示"渐变底色 + 图标"的兜底样式；
    
-   若图标或样式未生效，先检查网络与该静态资源地址是否可达。
    

---

## 七、如何重置数据

原型的数据全部在浏览器本地，重置方式有两种：

**方式一：清空存储键（推荐）**

在页面按 `F12` 打开开发者工具 → 切到「Application / 应用」→「Local Storage」→ 选中当前站点 → 删除键 `campus_lost_found_items`，然后刷新页面。刷新后 `initSeed()` 会重新注入 6 条种子数据。

**方式二：控制台一条命令**

在开发者工具「Console / 控制台」执行：

```javascript
localStorage.removeItem('campus_lost_found_items');
location.reload();
```

**注意事项**

-   `localStorage` 按"协议 + 域名 + 端口"隔离。用 `file://` 打开、用 `http://localhost:8000` 打开、换用 `http://localhost:8080` 打开，都会各自持有一份互不相通的数据；
    
-   换浏览器或使用无痕窗口，等于拿到一份全新的种子数据；
    
-   修改 `SEED_DATA`（种子数据）后，**必须按上面步骤清空存储键**，否则旧数据仍在，新种子不会生效。
    

---

## 八、常见二次开发改动点

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>想做什么</p></th><th colspan="1" rowspan="1"><p>改哪里</p></th><th colspan="1" rowspan="1"><p>注意事项</p></th></tr><tr><td colspan="1" rowspan="1"><p>改预置演示数据</p></td><td colspan="1" rowspan="1"><p>各页面的 <code class="tp-code" spellcheck="false">SEED_DATA</code> 数组</p></td><td colspan="1" rowspan="1"><p>5 个页面都内联了同一份数据，需<strong>同步修改</strong>；改完必须清空 localStorage 才会生效</p></td></tr><tr><td colspan="1" rowspan="1"><p>改数据层逻辑（如编号规则、搜索范围）</p></td><td colspan="1" rowspan="1"><p>各页面 <code class="tp-code" spellcheck="false">&lt;script&gt;</code> 顶部的那 8 个函数</p></td><td colspan="1" rowspan="1"><p>同样是 5 份副本，必须逐一同步；后续建议抽成独立 <code class="tp-code" spellcheck="false">store.js</code> 统一引入</p></td></tr><tr><td colspan="1" rowspan="1"><p>加一个新字段</p></td><td colspan="1" rowspan="1"><p><code class="tp-code" spellcheck="false">publish.html</code> 表单 + <code class="tp-code" spellcheck="false">submitPost()</code> + 各页面渲染函数（<code class="tp-code" spellcheck="false">cardHtml</code> / <code class="tp-code" spellcheck="false">applyData</code>）</p></td><td colspan="1" rowspan="1"><p>字段需同时接入"写入"和"展示"两端</p></td></tr><tr><td colspan="1" rowspan="1"><p>加一个新页面</p></td><td colspan="1" rowspan="1"><p>新建 HTML 文件并复制现有页面的头部、底部导航与数据层</p></td><td colspan="1" rowspan="1"><p>底部导航在 5 处硬编码，需同步补链接</p></td></tr><tr><td colspan="1" rowspan="1"><p>改配色/尺寸</p></td><td colspan="1" rowspan="1"><p>各页面内联的 Tailwind 原子类与 <code class="tp-code" spellcheck="false">max-w-[393px] max-h-[852px]</code> 容器</p></td><td colspan="1" rowspan="1"><p>全局换肤需逐页调整，或引入统一的主题类</p></td></tr></tbody></table></div>

---

## 九、已知限制（本次原型不实现的功能）

以下能力在原型中**明确不实现**，仅保留入口或提示：

<div class="tp-table-wrapper" data-content-type="table" data-fit-width="true" data-tiptap-node-type="tp-table"><table data-fit-width="true" style="min-width: 0px; width: auto;"><colgroup><col style="min-width: 35px;"><col style="min-width: 35px;"></colgroup><tbody><tr><th colspan="1" rowspan="1"><p>未实现项</p></th><th colspan="1" rowspan="1"><p>现状</p></th></tr><tr><td colspan="1" rowspan="1"><p>后端与真实数据共享</p></td><td colspan="1" rowspan="1"><p>全部数据存于浏览器 <code class="tp-code" spellcheck="false">localStorage</code>，不同用户/设备之间不互通，无法真正交换信息</p></td></tr><tr><td colspan="1" rowspan="1"><p>后台管理</p></td><td colspan="1" rowspan="1"><p>无审核、下架、举报、数据看板等管理端能力</p></td></tr><tr><td colspan="1" rowspan="1"><p>实名认证</p></td><td colspan="1" rowspan="1"><p>无登录态、无身份校验；发布者统一显示「我」，种子数据中的"信息已核验"等文案为展示性文案</p></td></tr><tr><td colspan="1" rowspan="1"><p>即时聊天</p></td><td colspan="1" rowspan="1"><p>不提供站内消息，仅通过手机号 / 微信号复制后线下联系</p></td></tr><tr><td colspan="1" rowspan="1"><p>地图定位</p></td><td colspan="1" rowspan="1"><p>地点为纯文本输入，无地图选点与距离计算</p></td></tr><tr><td colspan="1" rowspan="1"><p>图片识别 / 上传</p></td><td colspan="1" rowspan="1"><p>发布页图片上传区为展示态，点击只弹出"正式版本开放"提示；图片使用固定占位图 + 渐变图标兜底</p></td></tr><tr><td colspan="1" rowspan="1"><p>通知与消息</p></td><td colspan="1" rowspan="1"><p>首页铃铛按钮为展示态，无未读消息逻辑</p></td></tr><tr><td colspan="1" rowspan="1"><p>分享</p></td><td colspan="1" rowspan="1"><p>详情页分享按钮为展示态，无实际分享行为</p></td></tr></tbody></table></div>

其它实现层面的注意点：

-   **搜索为简单包含匹配**：对 `title`、`place`、`desc`、`tags` 做小写化后的子串匹配，不支持分词、拼音、同义词与模糊纠错；
    
-   **编号可能重复**：`genNo()` 的 3 位序号取决于"当前条数 + 1"，若手动删改数据，序号可能重复；
    
-   **详情页容错策略**：URL 中 `id` 无效时会回退展示第一条数据（`getById(1)`），而不是给出"信息不存在"提示；
    
-   **首页统计数字为静态文案**："今日新增 12 条""待认领 38 条"等未与真实数据联动；
    
-   **无并发与校验**：数据写入无大小限制、无重复提交拦截，清除浏览器数据即永久丢失；
    
-   **数据缺少时间格式化**：时间为原样字符串（`fullTime` 为 `YYYY-MM-DD HH:mm` 格式），未做本地化或"几天前"的智能转换。
    

---

## 十、快速上手清单

- [ ] 确认目录内 5 个 HTML 文件齐全：`home.html`、`search.html`、`detail.html`、`publish.html`、`my-posts.html`

- [ ] 用浏览器打开 `home.html`，确认能看到 6 条种子数据

- [ ] 走一遍三条流程：查看详情并复制联系方式、发布一条新信息、搜索关键词

- [ ] 在「我的发布」里把一条进行中信息标记为「已找回 / 已归还」，返回首页确认状态标签已更新

- [ ] 需要回到初始状态时，删除 localStorage 键 `campus_lost_found_items` 并刷新

<p></p>