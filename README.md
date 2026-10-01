# Poker Lab · 模块化核心版

## 打开
- 新版静态入口：dist/app.html（已构建，离线可用，不需运行 Node 服务）
- 原版入口：index.html；备份：legacy.html
- 开发：npm install；npm run dev；打开 /app.html
- 检查：npm test；npm run build（包含 TypeScript 检查）

## 目录职责
- src/components/TableView.vue：牌桌与牌位
- src/components/CardPicker.vue：52 张牌选择弹层
- src/components/GameSettings.vue：金额与计算设置
- src/components/ResultPanel.vue：权益图表和行动解释展示
- src/engine/cards.ts：牌张定义、输入校验
- src/engine/evaluator.ts：最佳五张牌评估
- src/engine/equity.ts：河牌单挑精确枚举、其他情形蒙特卡洛
- src/engine/advice.ts：金额校验与条件性行动逻辑
- src/workers/equity.worker.ts：后台计算入口
- src/composables/useCalculation.ts：进度、取消、错误恢复与任务隔离
- src/types.ts：共享类型
- src/style.css：响应式样式
- src/App.vue：页面组装与输入状态协调
- tests/engine.test.ts：基础回归测试
- PLAN.md：后续范围、复盘等完整计划

## 本次验证
11 项自动化测试通过，类型检查和构建通过。
Minis 内置浏览器：真实按钮点击加载示例；精确枚举 990 组合，示例权益 78.8%；52 张选牌面板正常，已用的其他 6 张禁用；412px 无横向溢出；金额变更使旧结果失效；模拟可取消并恢复按钮。
发现并修复 Vue 响应式数组不可直接传递给 Worker 的错误。

仍需用户目标手机的软键盘/触摸人工验收；程序设置输入值不等同于确认手机键盘正常。
当前未加入对手范围、听牌分析、保存复盘、抽水、边池、ICM。无需账号，不上传牌局。构建结果的打包文件较集中是正常发布优化；源代码与算法按上述职责分文件维护。

## 2.1 更新（以上 1.0 记录为历史）
当前版本新增 RangeEditor、DrawPanel、DecisionSettings、SensitivityPanel、LibraryPanel、CardTextInput 组件；ranges/sampling/draws/cardText 引擎模块；storage 版本化备份与兼容 ID 模块；独立 sensitivity Worker。
现有 26 项测试通过，包含 2,000 组七张牌与独立五张枚举的对照。范围、抽水与本地复盘已实现。完整最新功能、验收结果与未实现项见 RELEASE.md。用户最终触摸/软键盘问题待反馈，不标为已验收。

## 自动部署与选牌浮层修复
上传 main 分支后，GitHub Actions 自动 npm ci、运行测试、类型检查与构建，只有通过才部署 Pages。可在 Actions 手动运行；不需提交更新后的 dist 才能发布。Pages source 改为 GitHub Actions，不再从 gh-pages 直接发布。main/app.html 构建后自动改为站点 index.html。
选牌弹层 Teleport 到 body，跟踪 visualViewport，在可见屏幕内居中，锁定背景滚动，牌区内部滚动，关闭按钮和清除按钮保持可见。360×800 和 360×480 预览验证弹窗边界及内部滚动；用户真实手机仍需确认。
