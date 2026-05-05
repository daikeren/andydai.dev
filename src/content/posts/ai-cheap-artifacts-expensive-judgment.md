---
title: AI 讓產出變便宜，但讓判斷變更貴
published: 2026-05-05
description: AI 讓 code、文件、摘要和 proposal 變得更容易產生，但公司真正稀缺的不是 artifact，而是 review、判斷、協調與責任。很多 AI productivity 敘事少算了 review cost 這筆帳。
tags: [ai-engineering, engineering-management, developer-productivity]
lang: zh-tw
abbrlink: ai-cheap-artifacts-expensive-judgment
toc: true
faqs:
  - question: 為什麼 AI 讓產出變便宜，不一定等於公司生產力提升？
    answer: 因為公司真正慢的地方常常不是 artifact 產出，而是 review、判斷、協調、決策與責任。產出變多後，如果 review cost、rework 和 decision bottleneck 也上升，整體 productivity gain 可能被吃掉。
  - question: 評估 AI productivity 時，除了速度還應該看什麼？
    answer: 至少要看品質是否維持、review cost 是否上升、rework 和 defect rate 是否增加、decision cycle 是否縮短，以及最後是否更快產生 customer value。
  - question: 為什麼 Klarna 的 AI 客服案例不能直接推論到所有公司工作？
    answer: Klarna 客服 workflow 有相對清楚的 input、output、quality bar、resolution time 和 repeat inquiry 指標；但很多 corporate work 卡在決策、協調、排序與風險判斷，較難用同一套 metric 評估。
---

最近我每週都要整理一次 high priority PR，告訴同事：哪些 PR 是我希望這週 release 的時候可以進去的，大家要特別切時間 review。

這件事有點諷刺。

AI coding tools 的確讓 code 產出變快了。很多 implementation 初版、測試、重構、boilerplate，都比以前快。以前要查文件、翻範例、來回試錯的東西，現在可以很快拿到一版還算可以看的 output。

但 PR 變多之後，真正卡住的地方不是「有沒有人寫」。

真正卡住的是：**有沒有人有足夠 context 和 attention 去判斷這個東西該不該進 release。**

Code 變快產生之後，並不會自動變成 production value。它還是要被 review、要被理解、要被整合、要被測試。還是要有人判斷這個方向是不是對的，這個 abstraction 會不會害下一個人更難維護，這個 PR 到底該不該現在 merge。

所以 bottleneck 沒有消失。

它只是從「誰來寫」移到「誰來判斷這東西能不能進去」。

這是我最近對 AI productivity 最真實的感覺：

**AI 讓 artifact 變便宜，但沒有讓 judgment 變便宜。**

更進一步說，我越來越覺得這篇要講的有三層：AI 加速 artifact production；bottleneck 從 production 移到 judgment；最後，AI 放大的不是每家公司，而是組織原本的品質。好的組織被放大，爛的組織也被放大。

## 很多 AI productivity 討論跳太快了

這幾天看到 Brian Armstrong 說 [Coinbase 要裁掉約 14% 的人](https://x.com/brian_armstrong/status/2051616759145185723)。

他在給員工的信裡說，這次調整背後有兩個 forces：一個是 crypto market 的波動與下行，另一個是 AI 正在改變他們工作的方式。[Business Insider](https://www.businessinsider.com/coinbase-layoffs-ai-brian-armstrong-job-cuts-letter-2026-5) 引了信裡比較關鍵的說法：工程師用 AI 在幾天內 ship 以前一個 team 要花幾週的東西；非技術團隊也開始 ship production code；許多 workflow 正在被自動化。

這些例子我相信有一部分是真的。

我自己也每天在用 AI，不需要假裝 AI 沒有讓很多事情變快。工程師用 AI 幾天 ship 以前一個 team 要花幾週的東西，非技術團隊開始寫 production code，workflow 被自動化——這些都不是科幻。

但我看到這類說法時，第一個問題還是：

**你們到底量到了哪一段？**

是量到同樣品質下，team 真的用更少時間做出同樣甚至更好的結果？

還是只是量到大家產生了更多 code、更多文件、更多 meeting summary、更多 proposal、更多看起來很有進度的 artifact？

這兩件事差很多。

我之前寫過一篇 [AI 時代沒有新的工程師評價標準，只有新的 proxy 幻覺](https://andydai.dev/posts/ai-proxy-metrics/)，裡面講 LOC、token usage、agent uptime 這些東西為什麼危險。它們看起來像 productivity metric，但很多時候只是 activity metric。

這次問題可以再往上一層看。

很多公司現在談 AI productivity，其實也在犯類似的錯：把 artifact 產出速度，誤當成整個組織的生產力。

## AI 加速的是 artifact，不是 judgment

如果誠實一點看，目前 AI 最穩定的能力，大多集中在 artifact production。

它可以更快產出 code draft、PRD 初稿、research summary、meeting notes、sales email、customer support response、internal FAQ、dashboard interpretation、簡報大綱、proposal 版本。

這些都是真的。

以前一個人可能要花半天整理的資料，現在二十分鐘可以有一版。以前要等工程師有空才做的 prototype，現在 PM 可能自己就能先拉出一個可以看的版本。以前 meeting 結束後沒人寫 follow-up，現在至少會有一份 summary。

但公司不是靠 artifact 自動運作的。

公司真正慢的地方，常常不是「沒有人寫文件」。真正慢的地方是大家其實沒有同意要解哪個問題；沒有人願意做最後決定；Sales 承諾了 Product 做不到的東西；Legal 或 compliance 卡住，但沒有人知道怎麼解；PM、Engineering、Design 對同一件事的理解不同；老闆沒有想清楚，但整個 team 已經開始執行。

還有更常見的情況：客戶嘴上說要 A，實際願意付錢的是 B；senior reviewer 的時間被一堆低品質輸出吃掉；每個部門都在產生自己的版本，最後沒有人知道哪個才是真的。

這些不是 ChatGPT 幫你寫快一點文件就會消失的問題。

很多時候，AI 甚至會讓它們更明顯。

當產出變便宜，第一個結果不一定是「公司自動變有效率」。第一個結果通常是：需要被 review、被理解、被判斷的東西變多了。

更多 PR 要看。更多 spec 要讀。更多 proposal 要比較。更多 meeting summary 要確認。更多 AI-generated analysis 看起來都很合理，但沒有人知道哪個是真的。更多「其實沒想清楚」的 idea，被包裝成很完整的文件。

以前一個爛想法可能因為懶得寫 proposal，所以死在腦中。

現在它可以在五分鐘內變成一份格式完整、語氣專業、附上 table 和 action items 的文件。

這不是小事。

因為組織裡真正稀缺的，不是能產出文字的人。真正稀缺的是能判斷哪些東西不值得繼續的人。

以前爛東西一眼看得出來。

現在爛東西會長得很像一份 McKinsey deck。

## Code review 是很好的例子

回到 PR review。

AI coding tools 對工程團隊的幫助很明顯。它可以加速很多局部工作：查 API、補測試、寫 migration、重構小段程式、產生 boilerplate、快速探索 implementation path。

但一個 PR 能不能 merge，不只是在看 code 有沒有寫出來。

Reviewer 看的其實是方向是不是對的，abstraction 有沒有過度設計，這段 code 之後誰會維護，有沒有破壞既有 mental model，edge case 有沒有被考慮，test 是真的 cover 到風險，還是只是讓 CI 變綠。

更重要的是，這個 change 跟 product priority 是否一致？merge 之後會不會讓下一個人更難工作？這個 PR 是不是應該進這週 release？

這些都不是單純的 syntax check。

它們是 judgment。

我自己這幾個月看 PR 的時間明顯變多。不是因為 PR 數量突然爆炸，而是每個 PR 表面上看起來都更完整。它有測試、有說明、有拆好的 commit，有時候還有 AI 幫忙補上的文件。問題是，我還是要花時間判斷它是真的想清楚了，還是只是被 AI 包裝得很完整。

所以如果 AI 省下的是 junior 寫 code 的時間，卻吃掉 senior 做 judgment 的時間，這筆帳不一定划算。

更精準地說，它不一定不划算，但你不能假裝那個成本不存在。

很多 AI productivity dashboard 只看前半段：產出變多、速度變快、PR 數增加、cycle time 某些環節下降。

但如果後半段 review queue 變長、reviewer 更累、rework 更多、merge 後 maintainability 變差，那整體 productivity gain 就沒有 dashboard 上看起來那麼漂亮。

你只是把成本從 production 移到 judgment。

## Productivity mirage

這也是為什麼我不太相信那種簡單的「AI 讓大家生產力提升 50%」敘事。

我懷疑很多公司未來會遇到一種 productivity mirage。

表面上，每個人 output 變多，文件變多，ticket 變多，PR 變多，dashboard 變多，meeting summary 變多，AI usage dashboard 很漂亮。

但實際上，decision 沒有變快，customer value 沒有變多，review queue 更塞，senior 更累，alignment 更難，大家花更多時間處理別人丟出來的半成品。

這種情況下，AI 不是 productivity multiplier。

AI 是 organization spam generator。

特別是那些本來就很官僚的公司。

如果一家公司本來就靠簡報證明自己有 strategy，靠文件證明自己有 alignment，靠 meeting 證明自己有在推進，靠 dashboard 證明自己 data-driven，那 AI 只會讓這些東西變得更便宜。

結果不是更有效率，而是更多看起來像工作的東西。

更多 polished confusion。  
更多 well-formatted indecision。  
更多 beautifully summarized non-decisions。

## AI 會放大組織本來的品質

Daniel Miessler 那篇 [Most Companies Aren't Anywhere Near Ready for AI](https://danielmiessler.com/blog/most-companies-arent-ready-for-ai) 講到一個很重要的點：很多公司不是還沒買對 AI 工具，而是根本還沒有清楚到可以被 AI 幫忙。

在這種狀態下，高層說「我們要導入 AI」，其實很像對著一團混亂說：請幫我加速。

但你加速一團混亂，得到的不是更快的組織。

得到的是更快擴散的混亂。

所以 AI 不會平均提高所有公司的生產力。它比較可能提高 productivity dispersion。

對好的組織來說，AI 讓小 team 可以做以前需要大 team 的事。Prototype 更快、research 更快、iteration 更快，decision loop 變短。這種公司會得到真的 leverage。

對爛的組織來說，AI 讓大家更容易製造文件、更容易逃避決策、更容易把模糊想法包裝成完整計畫。這種公司會得到更多 noise。

所以問題不是「AI 有沒有用」。

這個問題太粗了。

比較好的問題是：

**你的公司有沒有清楚到值得被 AI 放大？**

如果答案是否定的，導入 AI 不會自動讓公司變聰明。它只會讓原本的混亂變得更有效率。

## Klarna 有數字，但那是特定 workflow

當然，不是所有 AI productivity 敘事都只是口號。

Klarna 是少數有拿出比較接近 operating metrics 的例子。他們在[官方 press release](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/) 裡說，AI customer service assistant 第一個月處理了 2.3 million conversations，約等於三分之二客服聊天量，相當於 700 full-time agents 的工作量；repeat inquiries 下降 25%，resolution time 從 11 分鐘降到 2 分鐘以下，並預估 2024 帶來 $40M USD profit improvement。

這至少是有東西可以討論。

但注意，這是一個相對清楚的客服 workflow。它有比較明確的 input、output、quality bar、resolution time、repeat inquiry、CSAT。你可以比較直接地問：AI 有沒有解決問題？客戶有沒有更快拿到答案？重複詢問有沒有下降？真人 escalation 有沒有增加？

這跟大部分 corporate work 不一樣。

很多公司裡最耗時間的事情，不是回覆一張 ticket，而是決策、協調、排序、風險判斷、跨部門 alignment。這些工作比較難切成乾淨的 input / output，也比較難用單一 metric 評估。

所以 Klarna 的案例很有價值，但不能直接推論成：

> 既然客服 workflow 可以被 AI 放大，所以所有 corporate headcount 都可以照比例下降。

這中間跳太遠了。

如果公司真的要說 AI 讓 headcount 變得不合理，那至少應該回答幾個問題。哪些 workflow 被 AI 改掉了？AI 加速的是原本的 bottleneck，還是非 bottleneck？Cycle time 降了多少？品質有沒有維持？Review cost 有沒有上升？Escalation、rework、defect rate 有沒有變？Decision cycle 有沒有變短？最後有沒有更快產生 customer value？被裁掉的職位，跟這些 workflow improvement 之間的關係是什麼？

我現在還不敢說自己有一套完整的 AI productivity evaluation framework。Cycle time、quality、review cost、business outcome 這些指標聽起來都合理，但真的放進公司運作裡，會遇到很多麻煩。不同 workflow 的品質門檻不同。短期 cycle time 下降不代表長期 maintainability 變好。Business outcome 又常常受太多因素影響。

所以我現在比較確定的，不是「該怎麼完整衡量 AI productivity」。

我比較確定的是：**如果你的 evaluation 沒有把 review cost、rework 和 decision bottleneck 放進去，那它一定不夠。**

但大部分公開說法沒有這些。

比較常見的是：

> 我們導入 AI。  
> AI 很強。  
> 所以我們可以更 lean。

中間少了一整段。

以前裁員要承認：我們招太多人、成長不如預期、管理層判斷錯了。

現在可以說：AI 改變了工作方式，我們要成為更 lean、更 high-agency 的組織。

這聽起來像 strategy，不像失誤。

## 產出變便宜之後，判斷會變成真正的瓶頸

以前很多工作卡在 production。

誰能寫？誰能整理？誰能做一版？誰能把資料變成文件？

現在這些東西變便宜了。

但便宜的 output 會帶來新的問題：誰來判斷？誰來決定不做？誰來負責？誰能看出這份很漂亮的 analysis 其實建立在錯的假設上？

這些能力沒有因為 AI 出現就變便宜。

反而因為 noise 變多，變得更貴。

AI 當然會改變 headcount。某些 workflow 真的會被自動化，某些角色也真的會被重組。這不是假議題。


公司真正耗時間的地方，往往不是打字。

是決策、協調、信任、風險和責任。

AI 可以幫你更快產生一份文件。  
但它不能替一個組織承擔 judgment。

而在 artifact 變得無限便宜的世界裡，最貴的東西會變得更清楚：

**誰有能力判斷什麼值得做，什麼應該停下來。**
