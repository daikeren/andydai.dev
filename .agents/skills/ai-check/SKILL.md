---
name: ai-check
description: Audit an existing draft for AI-like slop without claiming to detect authorship. Use when Andy asks to make writing less AI-sounding, check AI tone, humanize a draft, or run an anti-slop pass. For new andydai.dev posts, use after write-post's drafting flow rather than replacing it.
version: 1.0.0
user-invocable: true
argument-hint: "[detect|edit] [draft or path]"
---

# AI Check — Anti-Slop, Not Authorship Detection

這個 skill 檢查文字裡會讓讀者覺得「像 AI 寫的」的表面訊號，但不宣稱能判斷文字是不是由 AI 產生。它的目標是讓文章更像一個真的人在思考、做事、承擔判斷，而不是讓文字通過某個 AI detector。

## Scope and routing

- 主要處理**已經有草稿的文字**：文章、email、Slack、技術文件、公開貼文。
- 使用者明確說「少一點 AI 味」「檢查 AI slop」「幫我 humanize」時觸發。
- 新的 andydai.dev 長文仍由 `write-post` 負責 interview、素材整理、draft 和 evidence review；`ai-check` 是完成草稿後的額外 pass，不取代那個流程。
- 如果使用者只要求檢查，使用 `detect`。如果要求「幫我改掉」，使用 `edit`。

## Non-negotiable rules

1. 不要說「這段是 AI 寫的」或給 AI 機率、分數、真假判定。最多只能說某個表面模式讓文字讀起來制式、空泛或像模板。
2. 不要維護一份無條件適用的 banned-word list。`leverage`、`robust`、`actually`、`其實`、`重要`、`核心`、`簡單來說` 都可能精確、自然，只有在這段裡變成空話、重複或不合語境時才標記。
3. 不要為了「像人」而亂加口語、錯字、個人故事、情緒、髒話或不規則句長。自然 roughness 必須來自作者，不是編輯假造的。
4. 不要刪掉有功能的反問、短句、fragment、重複、比喻、正式語氣或不確定性。先判斷它們是否在推進論點、界定 claim 或呈現作者聲音。
5. 不要補不存在的數字、來源、第一手經驗、動機或立場。缺資料時，指出需要什麼，或保留明確的不確定性。
6. 一個句型出現一次不等於問題。只回報真正影響這篇稿子可信度、節奏、責任歸屬或可讀性的模式。

## Workflow

### 1. 先理解這篇文字在做什麼

讀完整份草稿，再判斷：

- surface：blog、public short-form、Slack、email、technical documentation 或其他；
- audience：誰要讀、讀完要做什麼；
- claim：作者真正想說的主張；
- anchor：數字、日期、場景、介面、步驟、失敗案例或第一手觀察；
- boundary：哪些是 fact、哪些是 calculation、inference、incentive 或 motive。

如果是 andydai.dev 的內容，先讀 repo 裡的 `PRODUCT.md` 和 `STYLE.md`。預設使用台灣繁體中文，保留自然的 English technical terms 和 code-switching。

### 2. 做兩個 pass

先做 **meaning pass**：檢查抽象主張有沒有證據、責任歸屬是否清楚、fact 和 inference 是否混在一起。再做 **surface pass**：只找真的讓文字變得模板化的措辭、節奏和格式。

不要先掃單字再把句子硬改掉。先問：「這個地方讀者需要什麼更清楚的資訊？」通常答案是具體 anchor、責任主體、claim boundary 或一個真正的例子，不是另一個同義詞。

### 3. 依模式的實際影響排序

優先處理會延遲重點、製造沒有根據的洞察、隱藏責任、把普通事說得過大，或讓段落讀起來像批量產生的問題。重複的小問題可以合併成一個 finding；沒有 meaningful finding 時就說沒有，不要為了湊 checklist 憑空找問題。

## Patterns to inspect

這些是診斷類別，不是逐句必抓的規則。

### A. Delayed point

檢查 generic opener、throat-clearing、空泛的「在這個快速變動的時代」、`Let's dive in`、`值得注意的是`，以及沒有提供上下文的「大家都忽略了」或「真相是」。

**修法方向：** 直接進入 concrete fact、scene、date、proper noun 或 bounded claim。若開場的背景真的改變讀者對問題的理解，就保留背景。

### B. Manufactured contrast or drama

注意以下模式的**過度使用**：

- 「不是 X，而是 Y」或 `not X, but Y`；
- 「No X. No Y. Just Z」和連續三個同形短句；
- 把普通事實包成 `the surprising truth`、`one thing is clear` 或 dramatic reveal；
- 用冒號把普通句子演成 punchline；
- 用 `tapestry`、`treasure trove`、`double-edged sword`、`uncharted waters`、`blueprint` 這類現成 metaphor 代替實際描述；
- 結尾突然丟一個超過證據的 metaphor 或 mic-drop。

Andy 的反問句、短句和對比句可以保留。判準是：拿掉修辭後，論證會不會失去一個重要區分或推進？不會的話，改成直接陳述。

### C. Unsupported abstraction

檢查「提升效率」「創造價值」「關鍵里程碑」「帶來深遠影響」「扮演核心角色」這類沒有 mechanism 或 denominator 的說法；也檢查 `Studies show`、`experts agree`、`業界普遍認為` 這類沒有來源的 authority claim。

**修法方向：** 補上數字、來源、介面、步驟、比較基準或可觀察的變化；沒有證據就縮小 claim 或刪掉。

另外分開：觀察到什麼、可以推出什麼、誰有什麼 incentive、誰可能有什麼 motive。不要把產品行為寫成它「想要」或「證明」了某個意圖。

### D. Mechanical prose

檢查：

- 為了避免重複而把同一個東西輪流叫 `agent`、`assistant`、`tool`；
- 每個段落都同樣長、每個小點都有 heading、每個 bullet 都是粗體標籤加冒號；
- 連續使用同一個句型、同一個三段節奏或同一種 participial phrase；
- em dash、`Moreover`、`Furthermore`、`Ultimately` 等成為固定節拍；
- formatting 代替了真正的 reasoning。

**修法方向：** 只在節奏真的暴露模板時調整。不要為了「自然」而把句長隨機化；讓 paragraph、bullet、heading 的形式服從資訊形狀。

### E. Canned tone and corporate filler

檢查 canned enthusiasm（`Great question!`、`Absolutely!`、`I'd be happy to help`）、marketing scaffolding、hype、空泛 corporate buzzwords，以及每篇都用的 `In conclusion`、`總結來說`、`希望這篇對你有幫助`。

**修法方向：** 刪掉沒有資訊的客套，換成實際回應、限制、決定或下一步。技術文件可以正式；正式不等於 AI 味。

也要注意用 `Generally speaking`、`to some extent`、`it depends`、`有些人認為` 這類 hedge 把一個其實可以界定的 claim 弄模糊。真正重要的不確定性要保留，並說清楚它限制了哪一個結論。

### F. Blurred responsibility and evidence

檢查 agentless passive voice（誰決定、誰改了、誰失敗、誰要 follow up 被藏起來）、nominalized action（「進行確認」「做出決定」），以及「我們發現」但沒有說明怎麼發現。

**修法方向：** 在責任重要的地方寫出 actor 和 action；如果 actor 確實未知、無關或刻意不強調，保留被動語態。把「分析」「改善」「優化」接回實際做了什麼。

### G. Recap ending

檢查結尾是否只是重複前文、列出「本文談了 A、B、C」，或用沒有新內容的總結句收尾。

**修法方向：** 以一個 decision、implication、usable test、checklist、next action 或由前文自然推出的短句結尾。不要硬塞金句。

## Andy-specific calibration

當文字是 Andy 的 public writing 或 technical writing，額外保留這些訊號：

- 具體先於抽象：數字、介面、步驟、失敗和 firsthand detail 比漂亮形容詞重要。
- 用 layering 把不同 evidence standard 的 claim 拆開，例如 `impression / regression / behavior change / motive`、`activity / output / outcome`。
- 立場可以直接，但要交代證據、限制和自己的 incentive；不要把「敢下判斷」改成無條件確定。
- 「不是 X，而是 Y」只在需要切開一個容易被誤讀的重要 distinction 時使用；大多數地方直接說 Y 更好，一篇通常不超過一兩次。
- 反問句要推進下一個問題，短句要承接前面的 reasoning；兩者都不需要被機械刪除。
- 中文敘事裡的 `agent`、`model`、`output`、`outcome`、`claim`、`regression`、`scope` 等技術詞可以保留，不要為了去 AI 味硬翻。
- 結論優先交付一個讀者能帶走的判準或工具，不要把文章洗成 generic framework。

## Modes and output

### `detect`

只回報有證據的 finding，按照它們在文件中出現的順序。每個 finding 用最小必要 excerpt，並包含 pattern、why 和 fix direction；不要直接重寫整段。

```text
ANTI-SLOP CHECKLIST:
(in document order)

□ Paragraph 1 — Throat-clearing opener
  Excerpt: 「在這個快速變動的時代……」
  Why: 這句沒有提供會改變後文的背景，延後了第一個可驗證的 claim。
  Fix: 直接從日期、事件或具體觀察開始。

□ Paragraph 4 — Unsupported abstraction
  Excerpt: 「大幅提升團隊整體生產力」
  Why: 沒有 metric、task boundary 或 comparison，讀者無法知道提升了什麼。
  Fix: 補上可觀察的 output、條件和分母；否則縮小 claim。
```

如果沒有 meaningful findings，明確寫：「沒有需要處理的 AI-like pattern；不要為了完成檢查再做額外潤飾。」

不要輸出 AI score、confidence、作者真偽判定、完整 cleaned draft 或與文件無關的寫作教學。

### `edit`

先完整讀稿，再做最小有效修改。輸出：

1. 修改後的文字；
2. 只有在有幫助時，附一小段 `Edit notes`，說明移除了哪些實際存在的模式。

保留原本的 claim、事實、語氣、粗糙度、code-switching、幽默、不確定性和段落 progression。若缺少 first-person anchor、數字或來源，不要自行補；用 `[需要補充：...]` 標出缺口，或先問一個真正會改變結果的問題。

如果草稿本身沒有 AI-like 問題，就做 no-op，不要為了讓 diff 看起來有內容而改寫。

## Final check

在輸出前快速確認：

- 第一個 sentence 是否太晚才到 point；
- 抽象 claim 是否有 anchor、mechanism 或 explicit uncertainty；
- fact、inference、incentive、motive 是否分開；
- 是否把自然詞彙誤當成 banned word；
- 是否保留了作者真正有功能的短句、反問和不完美；
- 是否新增了任何未提供的個人細節或確定性；
- 結尾是否留下 decision、implication、test 或 action，而不是 recap。

目標不是把文字磨成「不像 AI」的另一種模板，而是讓它更準確、更有責任歸屬，也更像這個作者真的會說的話。
