---
title: 當 Claude 開始道歉：主動控制 Context 邊界的四個做法
published: 2026-01-06
description: 當 Claude 說「You're absolutely right, I apologize」時，信任已經在崩塌邊緣。與其等到那一刻才被迫重開，不如主動控制 context 邊界——Handoff、Subagent、分階段執行、驗證基礎設施。
tags: [ai, claude, ai-coding, productivity]
lang: zh-tw
toc: true
---

# 當 Claude 開始道歉：主動控制 Context 邊界的四個做法

> **TL;DR**: 當 Claude 說「You're absolutely right」，代表信任即將崩塌。四個主動控制 context 的做法：(1) Handoff 切換 session (2) Subagent 隔離任務 (3) Research-Plan-Implement 分階段 (4) 驗證基礎設施擋住 AI slop。把 session 當耗材，不要等到崩塌才重開。

## 那句道歉的瞬間

你正專注 debug，突然 Claude 說：「You're absolutely right, I apologize for the confusion.」

這句話一出現，你就知道——接下來大概率會開始繞圈。

那次我在 Cursor 裡用 Sonnet debug。Sonnet 先指出一個 bug，我跟他說「你搞錯了，你把原本好的東西搞壞了」。他回我 "You're absolutely right"。

接下來我們來回了三次。第二次我說你搞錯了，他改回上一步的結論。第三次我再說你搞錯了，他又重複同樣的動作。到第三次我就知道這不行了——他已經不知道自己在講什麼了。

我重開了一個新 session，自己看 code 解掉，再讓 Cursor review。

第一次遇到這種狀況時，我還會給他幾次機會。但同樣的情況出現幾次之後，現在我看到 "You're absolutely right" 就知道該停了。

這個現象有個名字叫 Trust Thermocline——信任臨界點。海水表面是溫暖的，但過了某個深度會驟然變冷。信任也是——不是線性下降，而是在某個瞬間崩塌。

---

## 三個常見的崩塌觸發點

根據我們在公司的經驗，有三種情況特別容易觸發這個瞬間：

**Context 爆炸**：對話太長，AI 開始忘記最初的目標。剛開始用 AI agent coding 的時候，我會把一個對話無止境延續下去。做比較大的 feature 或中間遇到 bug 時，到某個時間點就會發現——他已經在做跟一開始要求的事情完全無關的部分了。

**錯誤螺旋**：修 bug A 產生 bug B，來回修改同一個不是 root cause 的問題。就像我前面講的那個 Cursor debug 的例子——AI 越改越偏，但他不知道自己在繞圈。

**品質滑坡**：看起來對但跑起來錯。最讓我印象深刻的是某次 Claude 幫我寫 TypeScript，上面一大堆 any type；或是生成的測試全是一定會過的 mock——寫了跟沒寫一樣。

這三種情況的共同點是：你不會第一次發生就放棄。你會給 AI 幾次機會。但當連續失敗超過某個點，信任會突然崩塌。

---

## 主動控制 Context 邊界

與其等到信任崩塌才被迫重開，不如主動在適當時機切換——永遠保持在臨界點之上。

### 什麼時候該切換？

我自己的閾值：

- 同一個 bug 來回 3 次還在原地（結論 flip-flop）→ 立刻 handoff
- 修 A 連續引爆第 2 個 side effect → 先停 implement，回到 root cause
- 產出「看起來合理但驗證不了」（型別、測試、CI 都支撐不住）→ 先補驗證再寫碼

### 做法一：Handoff——主動切換 Session

這個概念來自 [Amp](https://ampcode.com/) 的設計哲學：Keep threads small and focused on a single task。

我在 Claude Code 上自建了一個 `/handoff` skill。它的核心概念是：**Handoff 不是壓縮，是 clean slate + 只帶走可用的決策與事實**。

它會過濾掉 failed attempts、error messages、exploratory dead ends，只保留 signal——做了什麼決定、發現了什麼、還剩什麼沒做完。然後產出一個 structured 的 markdown，讓我可以直接貼到新 session 繼續。

我 handoff 的格式長這樣：

- **Context**：這個 session 做了什麼決定、發現了什麼
- **Git**：目前在哪個 branch、有沒有 uncommitted changes
- **Relevant Files**：哪些檔案跟接下來要做的事有關（一行說明為什麼）
- **Current State**：現在卡在哪 / 做到哪
- **Next Step**：接下來要做的一個動作

我什麼時候會用？

- 當 Claude 開始道歉時
- 階段完成時（規劃 → 實作、Phase 1 → Phase 2）
- Context 開始膨脹前，主動切換

團隊其他人比較少用這個做法。他們傾向直接開新 session，重新 build context。兩種都可以——重點是「主動切換」，而不是「被迫重開」。

### 做法二：用 Subagent 隔離任務 Context

這是另一種切分 context 的方式。Handoff 是在時間軸上切分，Subagent 是在任務空間上切分。

Claude Code 可以 spawn subagent——獨立的 agent instance，跑完把結果回傳給主 agent。實務上我會用它來做 research 或 review。比如說，當我要做一個涵蓋前端和後端的 feature 時：

- 生一個 subagent 來 explore 前端的 code
- 生一個 subagent 來 explore 後端的 code
- 或是用 subagent 做 web search、看某個 library 的 example

重點就是：只把結論丟給主 agent，不要把過程丟給他。

我不會預設把 task 拆成像人類組織架構那樣——Manager Agent 底下掛 RD Sub Agent、Front-end Sub Agent。Anthropic 自己的 [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) guide 也說：「Success isn't about building the most sophisticated system. It's about building the right system for your needs.」

某些 task 這樣拆確實有意義——比如 research 類的任務可以平行展開。但大部分 coding task 是 tightly interdependent 的，硬套組織架構式的拆法只會疊床架屋。實際上還是要看 task 的內容來決定怎麼拆。

### 做法三：Research-Plan-Implement 分階段

[Dex Horthy](https://www.youtube.com/watch?v=rmvDxxNubIg) 講過一個概念：「1 行錯誤研究會導致數千行錯誤程式碼。」投資時間在上游的 ROI 最高。

我們團隊每個人做這件事的方式不太一樣。我自己的 Research、Plan、Implement 都在 Claude Code 裡完成。其他人有時候會用 ChatGPT 做 Research，把結果再餵給 Cursor 或 Codex 做實作。

重點不是用什麼工具，而是：**每個階段開新的 session**。只要清楚每個階段要產出什麼，不管用什麼工具組合，都不太會有 context 爆炸的問題。

### 做法四：驗證基礎設施

前面三個做法都是在控制 context。這個不一樣——它是讓爛東西進不了主幹。

這個概念來自 [Factory](https://factory.ai/)：大多數組織的驗證標準只夠人類使用，不足以支撐 AI agent。

讓 AI slop 無法通過，而非靠人工審查。在我們團隊的做法：

- 設好 CI/CD
- Python 和 TypeScript 都有 linter
- 盡量寫測試，維持不錯的 test coverage

這些東西本來就該做，只是以前偷懶沒做的話還能撐。現在用 AI 寫 code，撐不住了。

---

## Takeaway

信任崩塌是一個瞬間，不是慢慢流失的。但你不需要等到那個瞬間才處理。

下次 Claude 說 "You're absolutely right" 的時候，你知道該怎麼做了：

**停下來。把目前進度整理成重點。開一個新 session 繼續。**

你只是在信任崩塌之前先跳車。

把 session 當成耗材，不要把信任當成耐久財。
