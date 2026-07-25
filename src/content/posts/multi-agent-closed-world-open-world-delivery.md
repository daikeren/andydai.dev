---
title: 為什麼 Multi-Agent 能解封閉問題，卻不一定能加速團隊交付
published: 2026-07-25
description: Cursor 的 Agent Swarm 能在受控環境裡重建 SQLite，但產品團隊的 acceptance function 會被需求、shared state、review 與人的決策持續改寫。增加 agents 前，先找出真正稀缺的 capacity。
tags: [ai-engineering, multi-agent, developer-productivity]
lang: zh-tw
abbrlink: multi-agent-closed-world-open-world-delivery
toc: true
faqs:
  - question: Multi-Agent 為什麼不一定能加速軟體交付？
    answer: 把更多 agents 配成 execution workers，會先增加 execution supply 與 work in progress；validation 雖然也能用 agents 擴張，release、scope 與 priority decision 仍錨定在人身上。更多 code、spec 或 findings，不會自動變成 delivered outcome。
  - question: 什麼是 closed-world 與 open-world problem？
    answer: Closed-world problem 的 objective、主要 world state 與 acceptance function 在執行期間相對固定；open-world delivery 的 acceptance function 可能被需求、shared state、reviewer judgment 與人的決策持續改寫。
  - question: 什麼情況適合增加更多 agents？
    answer: 當 execution 是主要 queue、任務可獨立切分、驗收標準穩定，而且 review、CI 與決策仍有餘裕時，增加 agents 才比較可能提高 delivered throughput。
---

> **TL;DR**: Multi-Agent 最適合 objective 與 acceptance function 相對固定、feedback 可以快速重複的問題。Cursor 的 Agent Swarm 顯示，即使最後通過同一套 tests，舊版也可能需要新版 6.5 倍的 code；但日常 product engineering 的 acceptance function 會在執行途中被需求、remote state、review 與人的決策改寫。Execution 與大部分 validation 可以用 agents 快速擴張，最後的 release、scope 與 priority decision 仍然錨定在人身上。題目一直動，這些決定就沒辦法只在開頭做一次。

Cursor 最近公開的 [Agent Swarm 實驗](https://cursor.com/blog/agent-swarm-model-economics)裡，最值得看的數字不是 68,000 個 commits。

在 Fable 5 mix 裡，新舊兩版 swarm 最後都通過了完整的 held-out SQL test suite。Outcome 一樣，但舊版用了 64,305 行 engine code，新版只用了 9,908 行，差了 6.5 倍。Opus mix 更極端：舊版用了超過四倍的 code，19,013 行，還停在 97%；新版用 4,645 行通過 100%。

同一個 outcome，需要的 output 可以差這麼多。

68,000 commits 那組數字則來自另一個 deep dive：舊版 Grok 4.5 run 在未滿兩小時就被停止前，已經產生 68,000 個 commits，速度約是新版 70 倍，同時累積超過 70,000 次 merge conflicts。那不是所有舊版 config 的共同結果，但它很乾脆地示範了一件事：activity 暴增，系統不一定在收斂。

在 [Cursor 自己的 retrospective](https://cursor.com/blog/agent-swarm-model-economics) 裡，他們沒有把新版進步歸因於更多 parallelism，而是重新處理 task decomposition、shared decisions、version control、merge reconciliation 與 stacked review。Cursor 甚至認為，swarm 能 scale 的主要原因可能是 context efficiency，而非 parallelism 本身。

這個實驗很強。但它解的問題，跟產品團隊每天面對的交付問題，形狀不一樣。

## 外部 acceptance signal，跟內部 correction loop 要分開看

Cursor 給 Agent Swarm 的任務很難：只靠 835 頁文件，用 Rust 從頭實作 SQLite。Source code、SQLite binary、test suite 與 internet 都被拿掉。它不是 toy benchmark。

不過這個世界有清楚的邊界：objective 相對固定，repository 是主要 world state，量化的外部 evaluation 是一套包含數百萬筆 query、答案已知的 SQL tests。Agents 不只看不到 test suite，Cursor 明確說它們連這套 suite 存在都不知道。Held-out tests 是 run 外部穩定、machine-verifiable 的 acceptance signal，並不是 agents 執行中的 feedback。

Cursor 也沒有只看 test score。每次 run 後，他們會人工檢查 code 與 execution record，確認沒有 cheating、shortcuts，也不是只實作 tests 剛好覆蓋的區域。這裡一樣有人類判斷；但這些 audits 檢查的仍是 swarm 有沒有忠實完成原本任務，Cursor 沒有描述 execution 中途因為 priority 或 live state 改寫 objective。

執行中的 correction loop 來自另一組機制：compiler 把 intentional breakage 傳到相依 code，VCS 顯示 collisions，shared docs 保存 design decisions，reconciler 處理 planners 的矛盾，review agents 從不同 lenses 找出累積中的錯誤。

外部 acceptance signal，跟內部 correction loop 要分開看。

我把這種情況叫做 **closed-world problem**。Closed 不代表簡單，也不代表沒有 coordination cost。它指的是 objective、主要 world state 與 acceptance function 在執行期間相對穩定。當內部 feedback 又便宜、快速、可以重複，系統就能讓 agents 大量平行探索，再持續淘汰錯路。

這個前提還有成本上限。新版 swarm 的不同 model mixes 交出相近品質，成本卻從 \$1,339 到 \$10,565，差了將近八倍。Compute budget 當然可能成為實際 gate。這篇先不展開 model selection；我要處理的是另一個問題：即使你付得起更多 execution，團隊能不能把它變成交付？

我後面會把這條 delivery path 拆成執行、驗證、決策三種 capacity。Cursor 顯示 execution，以及 acceptance criteria 固定時的 validation，都能用 agents 擴張；open-world delivery 真正難補的是反覆被觸發、而且必須有人負責的 decision capacity。

## Cursor 說 spec 最稀缺；真正的差別是 spec 會不會動

Cursor 在最後一節其實已經站到這個問題旁邊了。他們說 swarm 讓工作的單位從 file 或 feature 上升到 spec，未來稀缺的是「對 intent 的正確描述」。Planner 把 goal 拆成 task tree，再逐層 lower 成可執行工作。

我同意。Decision capacity 本來就包含描述 intent、切 scope 與決定 trade-off 的能力。

但 Cursor 實驗裡的 835 頁 spec 在 run 開始後相對固定。Product delivery 的 spec 會動。

一個 coding task 本身可能很 bounded：修一個 bug、補一組 tests、把既有設計實作出來。可是「把它交付」還包含 repository 以外的 state：客戶的 priority 動了、同事剛好在同一個 module 上做 hot-fix、另一支 PR 改了前提、需求變更、reviewer 對 severity 有不同判斷，或實際操作後發現 spec 裡的完成定義不對。

TDD、Spec-driven Development（SDD）與更明確的 acceptance criteria，可以把 coding 邊界裡的 feedback loop 關得更好；它們無法把邊界外的世界 freeze。測試還是綠的，正在解的問題卻可能已經不是團隊現在最需要交付的問題。

這是 **open-world delivery**。Review 不只檢查「agent 有沒有照題目作答」；它可能判定某個看似完成的 change 不能 release，也可能把多個 findings 收斂成一個真正的 blocker。Live-state verification 不只確認 patch 能不能套用；它可能發現題目的前提已經變了。Human acceptance 也不只是在最後按 approve；人看到 spec 或 UI 後，可能重新定義 scope。

Closed-world 裡，acceptance function 主要負責評分。Open-world 裡，驗證不只淘汰錯答案，它會改寫題目。

而且目前我還沒看到一個通用的好解。Live-state checks、短一點的 execution batch、頻繁 rebase 與 human checkpoints 都能降低 stale work，卻不能自動裁決「客戶 priority 跟原 spec 衝突時該選哪個」，也不能保證 agent 動手後世界不再變。Monitoring 可以更快發現邊界被撞破，不能替團隊做完那個決定。

## 最能說明問題的一次 agent run，什麼都沒留下

我回頭盤點自己同一天兩批 parallel workstreams 時，最能說明這個問題的不是某個漂亮的 implementation，而是一個 `no change`。

那個 automation 原本要處理幾個仍在進行中的 changes。它先檢查 live remote state，發現相關修正已經存在，於是停止，沒有 diff、沒有 commit、沒有 push。

如果量 activity，它幾乎是零。如果目標是避免重複修改與覆寫別人的工作，它交出了正確 outcome。

這兩批工作合計有 7 個 root workstreams、15 個 child agents，混合 implementation、review、QA、spec 與 automation。這個規模只用來交代 illustration 的量級，不是受控實驗。

它在這篇裡的角色是 illustration：parallelism 讓 execution supply 與 work in progress 先變多；真正被接受的結果仍反覆經過 `execution → review → fix / re-review → CI / live state → human accept`。

另一條 review-heavy workstream 更直接。我沒有繼續增加 implementation output，而是把五個 agents 配到不同 review lenses。多輪 severity calibration 後，真正需要擋 release 的問題只有一個；修正後 re-review 沒有 P0–P2，CI 也通過。增加 agent 有用，但那次增加的是 validation capacity。

我之前用過 [activity、output、outcome](/posts/ai-10x-productivity-activity-output-outcome/) 拆 productivity claim。這裡只需要記住一句：commit、thread 與 finding 是工作痕跡；團隊真正要的，是通過 acceptance path 的 outcome。

## Agent-scalable capacity，最後仍匯進 human decision

「throughput 受最稀缺的環節約束」不是新理論。Theory of Constraints 與 queueing theory 早就在處理這件事：上游工作站再快，只要下游 queue 沒有消化，整體 throughput 就不會跟著上升。

所以我現在把 delivery path 拆成三種 capacity：

- **執行（execution）**：把已知方向變成可驗收的 code、tests、文件與修正。
- **驗證（validation）**：透過 review、CI、security check、browser QA 與 live-state check，判斷 output 是否可靠。
- **決策（decision）**：決定哪個方向值得做、哪個風險可以接受，以及現在怎樣才算 done。

Execution 最直接；acceptance criteria 固定時，validation 也能用 review agents、reconciler 與 stacked lenses 擴張，我自己的 review-heavy workstream 也是同一個例子。

但 validation 能擴張到什麼程度，取決於 acceptance criteria 有多固定。標準固定時，review 是驗證；標準會動時，review 的一部分其實在決定標準。前面那次 severity calibration 就是例子：找出 findings 是 validation，決定哪個風險必須擋 release，則是 decision capacity。團隊容易低估後者，因為它常穿著 review 的外衣出現。

執行與驗證最後都匯進同一個終點：有人要決定這個 change 能不能 release、scope 要不要改、哪個 priority 先做，而且要對結果負責。在 closed-world 裡，這些決定有一大部分可以 front-load 到 spec 與 acceptance criteria；open-world 的題目持續被現實改寫，同一批 decisions 會在 execution 中反覆出現。

這才是不對稱的地方。Spawn 十個 workers 或 reviewers 幾乎立刻，不會同時長出十個擁有完整 context、權限與責任的 decision owners。增加一個資深工程師很慢；他真正稀缺的也不只是 execution，而是願意、能夠、也有權責做最後判斷的部分。

這不只是模型能力問題。Agent 可以提出 release recommendation，責任卻不會隨著 agent 一起 spawn；組織裡仍要有一個主體承擔線上事故、客戶影響與 trade-off 的後果。

如果 PR 已經堆在 review、CI feedback 很慢、spec 還在變，或所有 release decisions 都等同一個人，更多 execution agents 只會讓 gate 前面的 WIP 變厚。

你會看到更多 output。Delivered throughput 不一定動。

## 「這些本來就是正常的 software delivery」

對。Review、CI、scope change 與 human approval 本來就存在。我的盤點沒有證明 parallel agents 製造了 serial gates，也沒有證明那些工作如果 sequential 執行就會更快。Cursor 的 SQLite workload 更不能直接拿來預測一般產品團隊的 conflict rate。

這篇支持的 claim 窄很多：Multi-Agent 不會消除既有 constraints。Execution 與 validation 可以比 human decision 更快擴張；acceptance function 又會在 open-world 裡持續變動，原本錨定在人身上的 constraint 只會更早露出來。

Multi-Agent 沒有創造這些 gate。它讓你更快撞上它們。

## 加 agent 前，先找 queue 在哪裡

下次想把一個 agent 變成五個之前，我會先問：

1. **現在等待最久的是執行、驗證，還是決策？** 看 queue，不看哪個工具最熱門。
2. **Acceptance function 在 execution 期間會不會被改寫？** Test suite 能反覆判分的工作，比需求與 shared state 持續變動的工作更適合大幅平行化。
3. **Shared state 會不會在 execution 途中被別人改動？** 如果同事的 hot-fix、另一支 PR 或 live environment 會改掉工作的前提，就要縮短 batch、提高同步頻率，而不是只增加 workers。
4. **新增的 agent 要放在哪一種 capacity？** Execution 已經跑在 review 前面，下一個 agent 就應該負責 validation，而不是再生成一份 output。
5. **什麼情況下 `no change` 才是正確 outcome？** 只獎勵 commits 的系統，會把避免重複工作、停止錯誤方向與 scope 收斂全部算成失敗。

如果 execution 是最長的 queue，增加 execution agents。Output 已經堆在 review，就先增加 validation capacity。所有人都在等需求與 release judgment，則有三個選擇：把 release 權限分給更多有足夠 context、也願意負責的人；預先講定 severity rubric 與 release criteria，把重複決策 front-load；或縮小 scope 與 batch，減少每次需要判斷的決策面。

不要用 agent 數量管理 throughput。管理那個最稀缺的 gate。
