---
title: Reality 不會再替你撞牆
published: 2026-05-20
description: AI 時代的牆還在，但回報訊號可能被切斷。真正的差距不是 prompt 技巧，而是過去十年撞過什麼牆，以及你現在會不會主動製造懷疑。
tags: [ai, engineering-leadership, judgment]
lang: zh-tw
abbrlink: reality-wont-hit-the-wall-for-you
toc: true
faqs:
  - question: AI 時代為什麼更難累積 judgment？
    answer: 因為 AI 會把很多原本需要自己查資料、讀文件、debug、被 review 打槍的摩擦消掉。問題看似被解掉了，但人也少了被 reality 校準的機會。
  - question: 為什麼 prompt 技巧不能直接取代 domain experience？
    answer: Prompt 有用的前提是你在那個領域已經有 prior calibration，知道哪些答案值得懷疑、哪些假設需要追問。沒有撞過牆的領域，很容易被 AI 的流暢答案騙過去。
  - question: 技術 leader 可以怎麼降低 AI 帶來的 blind spot？
    answer: 對外追問別人的具體經驗，對內把 AI 當 doubt engine 使用。常見做法是問「這你自己試過嗎」、「如果這個判斷是錯的，會怎麼錯」，或請 AI 列出反對論點和 hidden assumption。
---

> **TL;DR**: AI 會放大一個人過去累積的 calibration，但不會無中生有給你 judgment。過去 reality 會用 bug、user complaint、deploy incident、PR review 逼你撞牆；現在牆還在，但回報訊號可能被 AI 和 silent failure 切斷。

上週三下午，同事丟了一個 PR review request：改我們 firecrawl 相關的設定，五個 bullet 多半是 UI 雜事。其中一條寫著：把 `ignoreSitemap` hardcode 成 `true`，一律忽略 sitemap XML。

Tier 2 PR plz~。也就是那種低風險、通常五分鐘掃過去就 approve 的 routine 變更。

但那條 `ignoreSitemap` 我多看了一眼。

我打了五個字回去：

> 為什麼要一律忽略 sitemap？

同事很快回我，理由列了三點：sitemap 通常不會直接包含資訊、可能包含已經廢棄的頁面、會誤導 agent。每一句獨立看都不假。但組合起來推到「hardcode 成 ignore」是個 leap，而且我知道為什麼是 leap。

我們來回了幾句，最後 PR 改成 configurable、default 維持原本的行為，case closed。整個過程一個小時、三則訊息。

但如果我沒問，這個 PR 就直接 ship 了。

我那天雷達被觸發了。這篇文章想拆解的是：為什麼是我的雷達被觸發了，為什麼這件事在 AI 時代會變得越來越罕見，以及這對技術 leader 意味著什麼。

## 我的雷達為什麼被觸發了

不是因為我特別聰明，也不是因為我 review 特別仔細。

是因為過去有段時間我很煩惱 SEO 的問題，花了不少時間搞懂 sitemap 到底在幹嘛。我知道 link discovery 本來就不穩定。很多人做網站是做完一個頁面就 share 到 social media，你想靠 crawler 從首頁慢慢爬到那個頁面，根本爬不到。我也知道為什麼 Google Search Console 要你主動提交 sitemap：sitemap 就是 discovery 機制，不是內容來源。

這個 mental model：「sitemap 是 discovery primitive 不是 content source」，不是讀來的，是 SEO 撞牆十幾次刻出來的。流量上不來、頁面 index 不到、明明發布了 Google 卻搜尋不到。每一次都是 reality 在告訴我「你想錯了」，每一次我都被迫多搞懂一點 sitemap 是怎麼運作的。

所以當我看到 PR 第二條 bullet，那個 mental model 自動跳出來說：「等等，這跟我認識的 sitemap 不一樣。」

我不知道同事完整的背景原因。但我猜這個 decision 來自某個具體 failure：某個站 sitemap 有 stale URL，agent 抓進來給了爛 context。這不是錯的經驗。問題是單一 failure 很容易直接 generalize 成 global rule。

兩個人 trigger origin 不同：一個累積、一個 n=1。這個差別正是這篇文章的起點。

## 人就是犯賤

我有個蠻刻薄的 mental model：**人就是犯賤，別人跟你怎麼說都沒用，要自己撞過牆才知道。**

講個跟工程完全無關的例子。

我是個會做菜的人。有一次我拿到一大把檸檬草，那是我第一次用，就憑著過去對料理的直覺加上記憶中吃過的菜，直接丟下去煮咖哩。結果出來味道太重，整鍋咖哩被檸檬草 dominate。後來花了一段時間才救回來。

從那次之後，遇到不熟的食材我都會多查一下。

這就是 calibration 的最小單位故事。每個人都有自己的版本：第一次寫 production code 沒做 rollback plan、第一次 deploy 沒設 alerting、第一次合作 startup 沒談好 vesting。我們都是這樣長大的。**Reality 不會跟你客氣，你想錯了就是錯了，講再多都沒用。**

過去十年，我們所有人都靠這個機制累積 judgment：debugger 卡住、PR review 被打槍、deploy 出包凌晨被 page、user 跑來投訴、reviewer 在 paper 上戳穿你的假設。每一次撞牆都很痛，但每一次撞牆都是免費的 calibration。它強迫你多搞懂一點。

但 AI 時代有個新問題：**牆還在，只是它不再回報給你了。**

從同事的角度來看，他遇到一個站 sitemap 有 stale page、agent 抓進來給了爛回答。他問 agent 怎麼辦，agent 給他一個聽起來合理的方案：忽略 sitemap。他改了 code，問題消失了，PR ship 出去。

整個 loop 是：撞牆一次 → 問 AI → 拿到 fix → work。**沒有任何環節給他一個 signal，告訴他這個決定比他想得複雜十倍。**

更糟的是 silent failure。如果這個 hardcode 上線了，你猜會發生什麼？沒有客戶會跑來抱怨「為什麼你只抓到 30% 的頁面」，因為他根本不知道少抓了什麼。我們在 Codeer 跟客戶溝通的時候都是透過 evaluation case，大家會 focus 在這些 case 答得對不對，那些「根本沒答到的問題」永遠不會被討論。

**False negative 永遠比 false positive 安靜。**

所以同事的 mental model 會永遠停在 n=1 那個 frame，因為 reality 不會再打他第二次臉了。Agent 把後面那些本來會修正 generalization 的回報訊號都吸收掉了。

過去我們相信「人就是犯賤，但 reality 會教他」。前半句現在還對，後半句變得不可靠了。不是 reality 不存在，而是 feedback loop 的 latency 和 visibility 變了：以前錯了可能凌晨被 page，現在錯了可能只是永遠沒有發生的客訴。

## 放大器

幾個月前一個朋友傳訊息問我：

> Andy 為什麼你的 AI 感覺比較聰明？

他知道差別不在 AI，是我用得比較好。這句話比較像半開玩笑、半 acknowledgment。

但這就是能力分化最棘手的地方：知道也不一定有用。

我可以告訴他「我會在 ship 前 reverse the prompt 問 AI 我漏了什麼」、「我會請 AI roast 我」、「我會多問四個 probing 問題」。但這些 practice 有用的前提是，你得在那個領域有 prior calibration，prompt 才能 anchor 在真實的 mental model 上。

我能 trigger sitemap 那個 PR，不是因為我 prompt 寫得特別好，是因為我過去煩惱過 SEO、撞了十幾次牆累積出「sitemap 是 discovery primitive」那個 mental model。那十幾次撞牆是 transfer 不出去的。我沒辦法把 SEO 經驗壓縮成一個 prompt 樣板給朋友用。

所以差距不在 AI 版本、不在 prompt 技巧、不在工具設定。差距在每個人過去十年撞過什麼牆。**Calibration 是 cumulative 而且 path-dependent。**

往下放大這件事可以講得更具體。

過去遇到不熟的問題至少還有摩擦。「我不知道答案」會強迫你去 Google、去看 doc、去問同事。每一次摩擦都是 trigger 機會，都是新的撞牆累積。

我看過一個同事 ship 了一個 bug，後來查發現官方文件裡其實有寫那個 caveat。但他從頭到尾沒讀 doc，直接問 AI，AI 沒提到，他就 ship 了。Pre-AI 他比較可能在 Google、doc 或 Stack Overflow 裡撞到那段警告；post-AI 他連 trigger 都沒發生。**AI 沒讓他變蠢，AI 只是把他原本可能會遇到的第一道摩擦消掉了。摩擦消掉了，calibration 也就累積不起來了。**

這裡其實有兩種不一樣的失敗。讀 doc 那個例子，是人完全沒撞到第一道牆；sitemap 那個例子，是人撞了一次牆，但後面那些會逼他修正 over-generalization 的訊號被切斷了。前者讓你少了一次 trigger，後者讓你的 mental model 停在 n=1。兩種都很危險，只是危險的方式不同。

往上放大就是我自己怎麼用 AI。同樣 1 小時，我可以 explore 5 個 hypothesis 而不是 1 個。但這個 explore 5 個的能力本身，是過去十幾次 explore 1 個錯掉的失敗累積出來的。AI 是 amplifier，放大的是我過去累積的東西，不是無中生有給我新能力。

但這裡我必須誠實。AI 對我的 amplifier 效應主要發生在我熟的領域。到完全不熟的領域，我知道自己不知道某些事情，但我還是很難確認那個某些事情到底是什麼。在那個 zone，我也是會被 AI 流暢性騙過去的人。因為那個 zone 我沒撞過牆，沒東西可以被 amplify。

所以這種分化不是「思考 vs 不思考」這種簡單故事。是每個人都有自己撞過牆、累積 calibration 的領域，跟自己沒撞過牆的盲區。AI 時代的差距不在誰聰明，在誰過去十年撞了多少牆、在什麼領域撞的。**而新的人沒機會撞牆了。**

## 怎麼辦

先說清楚一件事：接下來這兩個 practice，本質上都是把你已經有的 judgment 放大，不是無中生有。你在沒撞過牆的領域，這些 practice 救不了你。但在你有 prior calibration 的領域，它們可以讓 trigger 從「偶爾發生」變成「習慣發生」。

那新的人怎麼辦？這是我還沒有完整答案的 open problem。比較保守的方向，是刻意保留一部分摩擦：先讀 primary source，先用笨方法跑一次，先把 AI 答案當 hypothesis 而不是 conclusion 去驗證。這不會自動生成 judgment，但至少讓 reality 有機會回報。

我自己在練兩件事。

**對外：追問別人。**

當你 review 一個 PR、聽一個提案、接到一個 confident 結論的時候，這四句問題我覺得很好用：

- 「這你自己試過嗎？」
- 「最讓你意外的是什麼？」
- 「你最不確定的是哪部分？」
- 「如果這個判斷是錯的，會怎麼錯？」

為什麼這四句有效？因為每一句都逼對方從 conceptual 切回 concrete experience。只靠 agent 餵答案的人沒有真實 experience 可以 retrieve，沒有真正意外過，也答不出不確定的部分，除非你直接問。

如果對方四個問題都答得出具體答案，他大概有撞過牆。如果他開始切到 defensive mode：解釋他怎麼想到的、再講一次 context、reframe 你的問題、escalate 情緒，那就是紅旗。

**對內：追問自己。**

當你正要 ship 一個決定、accept 一個 AI 答案、approve 一個 PR 的時候，reverse the prompt。不要問 AI 答案是什麼，問 AI 你漏了什麼。

我自己用的句型隨狀況選，常見的有：「列出反對這個決定的 3 個最強論點」、「假設這方案失敗，最可能的 5 個原因」、「指出我論述裡的 hidden assumption」。**最猛的版本，當我特別想被 challenge 的時候，請 AI roast 我。**

多數人問 AI 是當 answer engine 用。Calibrated user 把 AI 當 doubt engine 用。同樣一個工具，兩種完全相反的使用方向。

## 收尾

那天 1 點我問了那個問題。但我不會每次都問。

我也會放過 PR、approve 完就去吃午餐、晚上回家才想起「等等，剛才那個 default 怪怪的」。我也是會被 AI 流暢答案騙過去的人，只是在 sitemap 這件事上，我剛好有十幾次 SEO 撞牆的記憶，所以 trigger 起來了。其他領域我沒撞過牆的，AI 給我什麼我可能就吞了。

所以這篇文章不是寫給「那些不會用 AI 的人」看的，是寫給包含我自己在內的所有人。

練低成本追問、練請 AI roast 自己、練在 ship 之前多問一句「我這樣想會漏掉什麼」。不是因為我們特別 calibrated，是因為 **reality 不會再主動替我們回報錯誤了。懷疑這件事，我們得自己來。**
