# DeepSeek-office v0.1 设计规格

## 核心隐喻

- 一个 Session = 一个固定工位。
- 一个 Agent = 一名牛 / 马 / 羊员工。
- 工位承担高频工作：思考、读文件、改文件、项目内搜索。
- 公共区只承载值得「演出来」的行为。

## 公共区域

1. **Search Station**：联网搜索与网页读取。
2. **Terminal**：一整块黑板，对应命令、测试、构建等 Shell 行为。
3. **Collaboration**：Subagent、fork、spawn、delegation。
4. **Break Zone**：idle 时低概率随机触发。
5. **Boss / Approval**：需要人类回答 / 审批时，员工移动到画面下方并正面朝用户。

## 员工系统

员工不具备角色属性。新增 Agent 时：

1. 根据 Session ID 稳定散列到 cow / horse / sheep；
2. 从主题色池稳定选择一个 accent；
3. 同一 Session 重启 UI 后仍保持相同物种与配色。

共同视觉：圆滚滚身体、短手短脚、黑色描边、少量色彩填充、彩色围巾、空白工牌。

## 第一版动作

- idle：轻呼吸；30 秒窗口内有约 20% 概率去 Break Zone。
- thinking：工位轻微敲键盘节奏。
- walking：公共区域移动 + 小幅走路 bob。
- error：抱头姿态 + 抖动 + 红色感叹号。
- completed：举手姿态 + confetti。
- approval：走到 Boss 区，正面看向屏幕外用户并弹出提示气泡。

## 工作流摘要

每个工位固定显示：

- Session 名称
- 状态
- 当前任务（最近用户 / steering 消息）
- Reading（最近 read/grep/glob/lsp 等文件参数）
- Editing（最近 edit/write/patch 等文件参数）
- Tool（当前 running call；没有则显示最近 tool）

卡片永远留在工位上，即使员工本人暂时跑去公共区。
