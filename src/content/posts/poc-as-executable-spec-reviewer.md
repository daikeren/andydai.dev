---
title: POC 不是 Demo，而是會執行的 Spec Reviewer
published: 2026-08-25
description: 好的 End-to-End POC 會把 partial success、stale state 等模糊問題跑成可檢查的 product contracts，再分成 disposable limitation、production contract 與 unresolved question。
tags: [ai-engineering, product-development, startup]
lang: zh-tw
abbrlink: poc-as-executable-spec-reviewer
toc: true
faqs:
  - question: POC 和 Demo 的差別是什麼？
    answer: Demo 主要讓人看見 happy path；好的 End-to-End POC 還會實際穿過關鍵 system boundaries，把 findings 分成 disposable limitation、production contract 與 unresolved question，再決定哪些必須回到 spec。
  - question: 什麼情況值得做 End-to-End POC？
    answer: 當主要不確定性藏在多個 layer 的交界，例如 LLM 與 deterministic code、非同步 request、外部服務、權限或持久化狀態時，End-to-End POC 特別有價值。
  - question: POC 可以取代完整的 Spec Review 嗎？
    answer: 不行。POC 擅長暴露執行時才看得見的問題；權限、migration、rollback、rate limit、成本與其他不適合放進 disposable slice 的風險，仍需要文件 review、threat modeling 與正式驗證。
---

> **TL;DR**: 好的 End-to-End POC 會把文件裡可以含糊帶過的句子，變成 system 執行時一定要有答案的 contract，也就是產品在各種狀態下必須遵守的行為約定。跑完後，我會把 findings 分成三類：disposable POC limitation、production contract、unresolved question。畫面跑通只證明 happy path 做得出來；真正的學習，是知道哪些粗糙可以丟、哪些行為必須決定、哪些問題需要 owner 帶回 spec。

那天畫面其實已經成功了。

我給 coding agent 的要求很直接：先把一個用 Template 建立 AI agent 的 flow 做到 end-to-end；spec 沒寫清楚的地方先採合理版本，但要把問題記下來，最後 summarize 給我看。目的不是直接 ship，是讓我可以在 UI 裡感受這套設計。

POC 在本機一路跑到最後的 Editor：選 Template，填目標、語言和 tone，綁定參考素材資料夾，再按 Generate Draft。結果回來後，名稱、description、system prompt、model 和 tools 都已經填好，Create 按鈕也進入可用狀態。我們沒有真的建立 Agent，因為驗證這條資料流已經足夠。

最後最有價值的產出，出現在那個成功畫面之外。

是同一輪實作和 review 逼出來的問題：參考素材資料夾建立成功、檔案上傳失敗，這算成功還是失敗？LLM 產生的文字和系統決定的 tools 混在同一份 draft 裡，之後怎麼知道誰寫了什麼？使用者切換語言後，舊語言的 request 比較晚回來，能不能蓋掉現在的畫面？一個已經被 UI 隱藏的欄位，還能不能在背後打開 capability？

文件可以先跳過這些問題。執行中的 system 不行。

## 畫面跑通，Spec 反而變得更難寫

我以前寫過我們會用 [spec-light, explore-first](/posts/ai-native-engineering-team/) 的方式做產品：先用一兩天跑一條 happy path，把東西做出來再討論。AI coding agent 讓這種探索便宜很多。

但「做出來再討論」有一個很重要的前提：團隊要把撞到的 contract 帶回 spec。否則 POC 只會讓模糊的設計看起來比較具體，不會真的讓它比較完整。

這裡要先分清楚三種東西。

第一種是 disposable POC 自己的 limitation。例如資料先放在 static files、介面很粗、沒有完整 rollout control。正式產品可以整段重做，這些不一定值得寫成 product contract。

第二種是 production 無論怎麼實作都得回答的問題。部分成功怎麼表示、哪個 state 才是 authoritative、舊結果能不能覆寫新狀態。換一套 framework，問題還是在。

第三種是 POC 已經把問題照出來，但團隊還沒做的決定。這些 unresolved questions 要有去處和 owner，不能被「POC 跑通了」吃掉。

從那次 POC 開始，我會把這三類東西分開記。

## 「建立成功」和「整件事成功」是兩回事

其中一段 flow 允許使用者在設定 Agent 時，直接建立一個參考素材資料夾，再上傳檔案。

這其實是兩個 operation：先建立資料夾，再上傳檔案。第一步可能成功，第二步可能失敗。最早的 POC 會在資料夾建立後立刻把它選給 Agent；如果上傳失敗，畫面看起來像有選到資料，下一步卻一定拿不到任何檔案。

這裡有一個 POC bug：空的資料夾不該被自動選取。修掉就好。

但修完還留著一個 production contract：使用者現在擁有一個建立成功、檔案上傳失敗的資料夾。UI 要不要顯示它？重試是補上傳，還是整段重來？使用者再按一次，會不會建立第二個空資料夾？檔案還在 processing、已經 ready，或最後 failed 時，哪些狀態可以繼續 Generate Draft？

Error message 的 copy 只是表面。真正要決定的是 system 怎麼表示 partial success，以及使用者能不能安全 recovery。

Happy path 不會問你這些。只有真的把兩個 operation 串起來，問題才會出現。

## 一個欄位是誰寫的，決定它能不能被信任

這個 POC 同時用了 deterministic code 和 LLM。Template 先產生一份 baseline draft，LLM 再把 description、system prompt、suggested questions 和測試清單寫得更完整。

最初的 spec 很容易寫成「用 LLM 產生 Create Agent request」。真的做下去後，這句話太寬了。

Model、tools、權限、參考素材 IDs 和 capability availability 不能讓 LLM 自由決定。它們指向真實的 runtime state，也有權限和可用性限制。最後的邊界收斂成：LLM 只能修改幾個 flexible text fields；其餘欄位由 deterministic code 決定，merge 時也不能被模型輸出覆寫。

這解掉了 field ownership，卻又打開 provenance 的問題。

如果 LLM timeout，產品可以退回 deterministic draft。那最後只記一個 `generation_model` 夠不夠？不夠。它至少應該分得出「LLM 成功產生」「嘗試過但 fallback」「完全沒有呼叫」。否則 analytics、debug 和之後的重現都會把三種不同結果算成同一件事。

這輪 POC 沒有把 provenance schema 定案。下一輪 spec 至少要決定四個 candidate fields：`generation_status` 如何區分成功、fallback 與未呼叫，`generation_model` 記 attempted model 還是成功產出結果的 model，以及是否保存 `template_version` 和 `prompt_version` 或 hash。至於 draft ID 或 signed generation token，這輪已經明確延後，不算 unresolved question；只有當產品真的需要更強的重現或 provenance trust，才值得重新納入 scope。

## Locale 同時也是 State Ownership 問題

這個 flow 有多語 UI。原本很自然地把 locale 當成翻譯層：換語言，換一組 label。

實際跑起來，使用者可能在 Generate Draft 還沒完成時切換語言。這時舊 locale 的 response 如果比較晚回來，就可能把新畫面蓋掉。Request 本身完全成功，response schema 也完全正確，但套用到現在的 state，就是錯的。

最後的修正是：locale、workspace、Template 等 context 一旦改變，舊 request 的結果就失效。Response 回來時，frontend 不能只問「這是不是成功 response」，還要問「這是不是目前這個 state 等待的 response」。

POC 還順手逼出另一個沒有答案的問題：Template UI 的語言、LLM instruction 的語言，以及最後 Agent 回覆使用者的語言，是三個不同 contract。把它們都塞進一個 `locale`，早晚會出事。

這種問題靠多讀一次 spec 很難抓。文件裡沒有時間；in-flight request 有。

## 看不見的 State，仍然會改變產品行為

Template 表單裡有 conditional fields。使用者選了某個答案，才顯示下一組設定。

我們讓另一個沒有前文脈絡的 coding agent 重看一次。它找到一個問題：一個已經隱藏的 conditional value，仍可能留在 state 裡，進而打開使用者現在看不到的 tool。畫面告訴使用者 capability 沒有開，送到 backend 的資料卻是另一個故事。

最小修正是拒絕 hidden field 對 runtime capability 產生效果。但正式 contract 要再往前一步：欄位被隱藏時，它的值要清掉、保留但忽略，還是留著讓使用者切回來？誰負責 invalidation？

這裡的 invariant 只有一個：使用者在 Create 前看到的 capability，必須等於 backend 收到的有效 state。任何偏差都是 bug，也必須讓 operator 能觀察到，並定位是哪個欄位沒有被 invalidate。

同一輪還遇到一個比較像 POC 實作限制的問題：從 Editor 按「調整設定」回去時，整張表單會重新 mount，先前填的答案全部消失。問題不深奧，卻讓 recovery contract 變得很具體：返回上一步到底是回到原狀、重開一份 draft，還是重新開始？

POC 可以先用最便宜的方式處理。產品不能讓答案停在 component lifecycle 的偶然行為。

## 把 Findings 分對類

把四個案例攤開，這輪 POC 的 review 會變成這樣：

| 案例 | POC limitation | Production contract | Unresolved question |
| --- | --- | --- | --- |
| 參考素材上傳 | 空資料夾被自動選取 | Partial success 有明確狀態，也能安全 recovery | UI 怎麼呈現、retry 從哪一步開始、重試是否 idempotent |
| LLM draft | 無獨立 limitation | Deterministic code 與 LLM 的 field ownership；記錄實際 generation path | Provenance fields 的最小集合與語意 |
| Locale 與 async request | 無獨立 limitation | Context 改變後，舊 response 必須失效 | UI locale、generation language、Agent response language 要拆成哪些欄位，由誰決定 |
| Hidden state 與 recovery | 重新 mount 讓答案消失 | Hidden value 不能打開使用者看不到的 tool；UI capability 等於 backend 有效 state；返回上一步有明確 semantics | 隱藏時要清除、忽略或保留值；operator 要保留哪些診斷資訊 |

不是每個案例都必須填滿三欄。「無獨立 limitation」本身就是分類結果。這裡刻意沒有把漏掉 stale-response guard 算成 disposable limitation，因為它直接違反 production contract，是一個 bug；draft ID 和 signed token 則是已經明確延後的 scope，不是還沒人決定的 unresolved question。

## Findings 還要有回程

這趟回程後來留下了可檢查的痕跡。我把 POC findings 整理成一份產品化 checklist，分成已確認方向、待決問題、明確延後，以及對既有 implementation tickets 的影響。後續討論確認了 rollout scope：第一階段只開放一個 generic Template，其他 specialized Templates 先延後；flow 仍是先產生 editable draft，再讓使用者建立 Agent。Deterministic code 和 LLM 的責任邊界也進了 checklist，但 schema 實際要改哪裡、誰負責、怎麼驗收，當時仍沒有完整記下來。

所以我不能說 feedback loop 已經關了。比較準確的說法是：POC 把問題送進了下一輪產品討論，也證明「最後 summarize 給我看」還不夠。Production contract 要寫進 spec 或 decision record，再由正式 tests 守住；unresolved question 要進 ticket，並且有人負責關掉。

## POC 不能代替 Spec Review

End-to-End POC 有適用邊界；文件 review 仍然有它抓得比較早、比較便宜的問題。

POC 特別適合主要不確定性藏在 layer 交界的產品：deterministic runtime 加 LLM、非同步 request 加可變 UI state、外部服務加本地持久化、權限檢查加動態 capability。單看任何一層都合理，接起來才開始出現 contract。

如果問題是一個邊界清楚的演算法、一段既有 pattern 的 CRUD，或主要風險在 migration、billing、permission、rollback，做一個漂亮 prototype 未必是最便宜的驗證方式。後面這些高風險工作，往往更需要先把 invariant 寫清楚，再做 threat modeling、tests 和 rollout plan。

POC 也不會自動告訴你答案。它只會讓錯誤狀態變得可觀察，逼團隊承認這裡有一個 decision。最後還是要有人決定 product behavior，更新 spec，再把關鍵 contract 留進正式 tests。

這跟我前一篇談 [AI coding workflow 該 review plan 還是 evidence](/posts/what-humans-review-ai-coding-workflow/) 是同一個分工：文件擅長提早對齊方向，執行 evidence 擅長抓實際 state transition。兩個都要，只是不要期待其中一個替另一個做完工作。

它也接到 [Code 變便宜了，Main 沒有](/posts/code-is-cheap-main-is-not/) 裡的同一組問題。那篇談為什麼 ownership、boundary 和 state model 值得在進 main 前重選；這篇補的是，End-to-End POC 往往是這些選擇第一次變得具體的地方。

## 我現在怎麼 Review 一個 POC

POC 跑完後，我會先用前五個問題挖 finding，再把第六個問題套回每一個挖出來的東西：

1. **Happy path 以外，哪一步可能 partial success？** 前一步已經落地、後一步失敗時，system 怎麼表示？
2. **每個重要欄位由誰決定？** 使用者、deterministic code、LLM 或外部 system，哪一個才是 authoritative？
3. **這次結果是怎麼產生的？** LLM 成功、fallback 或根本未呼叫，system 分得出來嗎？要留下哪些 provenance？
4. **時間順序改變時會怎樣？** 舊 response、retry 或切換 context 後的結果，能不能覆寫較新的 state？
5. **真實 state 看得見，也救得回來嗎？** 使用者和 operator 能不能知道發生什麼事，並且不靠重建全部資料來 recovery？
6. **這是 POC limitation、production contract，還是 unresolved question？** 三種東西分開記，不要把 disposable code 的粗糙誤升級成 architecture，也不要把正式產品必須回答的問題降級成「之後再說」。

一個 POC 跑完，spec 應該會變得更難寫一點，但也更誠實。

如果最後唯一留下的是一支順暢的 demo video，你證明的是這條路可能走得通。反過來，當每個 finding 都分對類，production contract 回到 spec，unresolved question 有去處和 owner，這個 POC 才真的 review 過產品。
