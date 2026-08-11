---
title: Code 變便宜了，Main 沒有
published: 2026-08-11
description: Coding agent 讓重做 PR 的成本下降。當 contract、tests 與第一版累積的 knowledge 可以保留，就不該只因 code 已經寫完，讓不好的 architecture 進入 main。
tags: [ai-engineering, coding-agent, code-review, software-architecture]
lang: zh-tw
abbrlink: code-is-cheap-main-is-not
toc: true
---

> **TL;DR**: Coding agent 讓重做 PR 的成本下降，但錯誤架構一旦進入 main，就會變成新的 caller、data、operations 和團隊認知共同依賴的 constraint。當 outcome、contract 和 behavioral tests 已經確定，第一版最值得保留的往往是它找出的 knowledge，implementation 可以重新選擇。Code review 的標準沒有改；我們只是更不需要因為「code 都寫完了」而對不好的 architecture 妥協。

最近我 review 一支改動 routing state 的 PR。

這個 state 決定一個 request 接下來要走哪一條處理路徑。我原本以為，最前面應該有一個 gate 讀取目前 state、做出 decision，後面的流程只要接受結果。打開 PR 後，我卻看到相同的 state checking 出現在三類地方：即時 API 入口會判斷一次，延後執行的 worker 會再判斷一次，提供 operational view 的 read path 又有自己的版本。每條 flow 還各自長了一點例外。

這不是「哪個 function 還能再抽乾淨一點」的問題。Decision 的 ownership 已經散掉了。之後每增加一條入口，都得記得把同一套規則再複製過去；規則改變時，也得相信每個地方都有人一起改到。

我可以沿著現有 shape 列出一串 incremental fixes，把這支 PR 修到能 merge。跟同事討論過後，我請他保留相同 outcome，從乾淨的 base 重做。

這個決定放在幾年前、同樣有時程壓力的情況下，大概不會發生。

## Merge 會把 Implementation 變成全團隊的 Constraint

PR 裡的 code 還是局部 artifact。它有明確邊界，可以整支關掉、重做，或在沒有 live migration 的情況下換掉 data flow。

Merge 是一次 state transition。

進入 main 後，其他 branch 會從它往前開發，新的 caller 會依賴它。等這個版本部署，資料開始按它的 representation 被寫入，tests、文件、metrics 和 operational procedure 也會逐漸把它當成既定事實。工程師學到的不只是「功能怎麼用」，還包含出問題時要去哪幾個入口找那份散落的判斷。

以開場的例子來說，今天有三類入口各自解讀 state，明天新增第四條 flow 時，最自然的做法就是照著前三個地方再加一次。等規則改變，團隊要修改的已經不是一個 decision owner，而是一份持續增長的搜尋清單。即使交給 coding agent 搜尋，它也可能遇到動態呼叫、歷史例外、命名不一致，或根本不知道某個外部 contract 也依賴同一個語意。

這就是 Main 仍然昂貴的地方。每個新功能都得理解並延續現有 shape，internal representation 逐漸變成 compatibility 與 migration contract，workaround 也會被後來的 caller 當成正常用法。Debugging、on-call 與 recovery 必須重建散落在多處的 causal chain；真的要 refactor 時，還得協調 live data、rollout 順序和其他正在進行的工作。

Coding agent 可以幫忙執行這些修改，無法讓已經形成的依賴、歷史與 blast radius 自動消失。Code generation 變快，不會讓 production state 變得可逆，也不會同時生出更多擁有完整 context、權限與責任的人。

當時更常見的做法，是先把 PR 修到能 merge，再開一張 refactoring task。只要待過工程團隊，大概都知道那張 task 後來會怎樣：產品需求和客戶問題持續進來，它就一直往後排，直到散落的邏輯又被複製幾次、大家真的受不了才處理。Main 的成本不只沒有消失，還會在等待期間繼續長大。

## Coding Agent 改變了 Rewrite 的成本

以前要求重做一支 PR，可能代表工程師再花幾天重新建立 context、實作已經踩過一次的 edge cases。即使 reviewer 知道 architecture 不理想，也很容易被時程和 sunk cost 推向 incremental fixes。

現在 outcome、constraints 和 tests 都可以直接交給 coding agent。它不必重新猜題，可以在同一個 acceptance boundary 裡探索另一種 ownership、representation 或 state model。Implementation 仍然有成本，只是相對容易重新產生。

Coding agent 時代，PR 發出來之後，我們反而更有條件重新做一次 architecture review。第一版 implementation 把真正的 caller、transaction boundary 和 state propagation 攤開，reviewer 不必只根據 plan 猜哪個 shape 比較乾淨；可以沿著實際 flow 驗證 decision ownership 散在哪裡，也能判斷另一個 architecture 是否真的成立。

第二版把 state rule 收回單一的 policy source 和 canonical resolver。即時 API 和延後執行的 worker 仍然保留各自的 transaction、lock 與 side effects，但都在真正要執行時讀取 current state，交給同一個 resolver 做 decision；operational read path 不再維護另一份 policy，只從相同 source of truth 投影結果。之後新增第四條 flow，要接的是同一份 contract，而不是再實作一次 precedence。

這次從 agent 開始讀 repo，到完成 implementation、backend / frontend validation、fresh-context review、修正 4 個 race condition 與 projection 相關問題，再跑完 revalidation，總 wall-clock 約 98 分鐘。這個數字不能證明總交付時間一定更短；它證明的是，當 outcome 和 guardrails 已經固定，bounded rewrite 可以在一次完整的 agent run 裡做到可 review 的狀態。

第二版一樣要做 full review。Tests 可以縮小「行為是否退步」的 uncertainty，不能替 reviewer 判斷新的 ownership 是否正確、concurrency 是否安全、migration 是否成立，也不能幫團隊承擔 production outcome。有一段時間，reviewer 甚至得同時理解第一版的問題與第二版的取捨，validation cost 可能更高。

稀缺資源正在從 code production 移到 judgment。

這也是先做 architecture review 的理由。既然 line-level code 可以重新產生，就不要把最有限的 reviewer attention 全花在錯誤 shape 裡的 naming、local abstraction 和補洞。先判斷多個 findings 是獨立 mistakes，還是同一個 structural root cause 的症狀；shape 成立，再進入一般 implementation review。

## 第一版 PR 最值得保留的，可能不是 Code

要求重做一支 PR，聽起來像把前面的工作全部丟掉。但這支 PR 已經完成一件很重要的事：它把模糊需求變成具體 contract。

第一版 implementation 找出了真正會經過哪些入口、有哪些 edge cases、失敗時應該發生什麼，也留下了相對完整的 tests。這些 learning 不需要跟原本的 architecture 綁在一起。

```text
保留：
- outcome
- constraints
- edge cases
- behavioral tests

重新選擇：
- ownership
- boundary
- state model
- implementation
```

這次我敢讓另一個 coding agent 從頭重做，很大的原因是原本 PR 已經有 tests。只要這組 behavioral tests 不修改，第二版就必須維持已經定義好的行為。Ownership、state model 和 internal data flow 可以換，outcome 不能偷偷跟著換。

Tests 應該讓 implementation 更容易被替換。

最需要防的是 code 和 tests 都由同一個 agent 從同一份誤解產生。兩邊完全一致，整套 suite 仍然可能很綠。Tests 要形成 guardrail，就得錨在 externally observable behavior 和獨立確認過的 contract，而不是第一版的 internal helper 或資料模型。Unchanged tests 能證明第二版沒有偏離這些已記錄的 behavior，不能單獨證明 contract 本身正確。

## 要求別人重做，仍然是一個社交決定

如果 PR 是同事寫的，「這個方向不要再補，請重做」從來不只是一個技術決定。對作者來說，那可能像是否定已經投入的工作。Coding agent 降低了重新生 code 的時間，沒有自動降低這段對話的溝通成本。

Reviewer 如果只說「我比較喜歡另一個架構」，很容易把權力差異包裝成 technical judgment。提出 rewrite 時，必須說清楚哪個 correctness、ownership、data flow 或 failure mode 無法可靠成立，為什麼 local patches 會繼續增加 duplicated truth，以及 feasible alternative 的 decision owner 和 boundary 大致在哪。

同時也要講明第一版已經釐清的 contract、tests 和其他工作會如何保留，第二版又要用什麼 observable behavior 證明沒有退步。要求作者放棄 implementation，reviewer 就有責任證明那些已經完成的 knowledge 不會一起被丟掉。

這樣才把第一版 PR 放回比較公平的位置。它可能選錯 architecture，仍然替團隊找出了需求、edge cases 和 guardrails。Reviewer 要替換的是不適合進入 main 的 shape，不是抹掉作者已經完成的所有工作。

## 先判斷 Architecture 是否成立

Code review 的標準沒有因為 coding agent 出現而改變。邏輯是否集中、source of truth 是否清楚、ownership 是否恰當，本來就是 review code 的內容。變的是，bounded rewrite 現在更常是一個現實選項。

Review 一支非瑣碎 PR 時，我會先問：

1. **這些 findings 是獨立 mistakes，還是同一個 root cause 的不同症狀？** 如果每個修正都在替相同的 ownership 或 state model 補洞，先停下 line-level review。
2. **目前的 source of truth 和 decision owner 在哪？** 新增下一條入口時，能自然共用它，還是必須再複製一份規則？
3. **Outcome 與 contract 是否有獨立 guardrail？** Tests 有沒有測 externally observable behavior，而不只是重複 implementation 的假設？
4. **有沒有 bounded alternative？** Keep and fix 仍然是一個選項；只有 structural root cause 真的成立，才需要 eliminate state、move ownership、change representation 或重做 coherent slice。

如果現有 architecture 成立，就做 incremental fixes。Diff 很大、設計不漂亮、reviewer 想到另一種 pattern，都不是重做的理由。

如果 shape 無法可靠維持必要 invariant，而且 local fixes 只會讓問題繼續 propagate，就不要因為 code 已經寫完了而假裝 architecture decision 已經結束。

## 最好的 Rewrite，是不要等到 Review 才發生

這個結論不代表團隊應該常常重寫 PR。Architecture judgment 應該往前移，但不會在 plan approval 時結束。

Plan 階段先定 source of truth、ownership、state transition 和不能破壞的 invariant。這些問題到 review 才第一次被釐清，是前期 decision 沒做好。真實 caller 分布、transaction boundary，以及 state 實際怎麼穿過不同 flow，往往要等 implementation 才會完整攤開；它們在 review 才浮現很正常，review 本來就應該拿 implementation evidence 再驗一次 architecture。

這也接回我在[〈AI Coding Workflow 裡，人類該 Review Plan 還是 Evidence？〉](/posts/what-humans-review-ai-coding-workflow/)的主張：routine、可逆、容易驗證的 task，不一定要先讓人類 approve implementation plan；但 architecture-heavy、data contract 會分岔，或走錯方向會讓整份 diff 作廢的工作，正是應該先停在 decision boundary 的類型。先把 plan 階段能確定的 decision 講清楚，再讓 agent 大量生 code；等 implementation 出來，再檢查那些 assumptions 是否真的成立。

目標不是零 rewrite，而是不要為了本來就該事先想清楚的事情 rewrite。真的到 review 才看出新的 structural root cause，也不要把今天做得到的 bounded rewrite，換成一張永遠不會被撿回來的 refactoring task。
