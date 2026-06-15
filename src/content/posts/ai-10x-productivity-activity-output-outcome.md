---
title: 你喊的 10x，是 activity、output，還是 outcome？
published: 2026-06-15
description: AI 生產力 10x 不是同一個 claim。任務、個人、組織三層要分開看，activity、output、outcome 也不能混成同一個數字。
tags: [ai-productivity, ai-adoption, developer-productivity]
lang: zh-tw
abbrlink: ai-10x-productivity-activity-output-outcome
toc: true
faqs:
  - question: AI 真的能讓生產力 10x 嗎？
    answer: 在單一、邊界清楚、可以快速驗證的任務上，AI 確實可能大幅加速 output。但這不等於個人整體或組織 outcome 也會 10x。
  - question: activity、output、outcome 有什麼差別？
    answer: activity 是忙了多少或產生多少工作痕跡，output 是真正交付了什麼，outcome 是交付物最後換到的結果。把三者混在一起，是 AI 生產力討論最常見的錯誤。
  - question: 判斷 AI 生產力提升時該問什麼？
    answer: 先問 10x 發生在哪一層、哪一種指標；再問如果不做這件事最壞會怎樣，以及那個最壞如果永遠不發生，你會怎麼知道。
---

> **TL;DR**: 「AI 生產力 10x」不是一個 claim，而是任務、個人、組織三層 claim 被壓成同一句話。更麻煩的是，很多人把 activity、output、outcome 混成 productivity。任務層 output 加速是真的；個人整體 10x 被流程瓶頸鎖住；組織 10x 需要流程重構，不是把 AI 塞進舊流程。

最近半年，我的 feed 被同一個數字洗版。

一堂 Stanford 的線上課，教你怎麼用 AI「把生產力放大 10 倍」。一個連續創業者在課程宣傳裡說，現在用自然語言自己寫軟體，生產力能拉到「十倍、一千倍」，不用再等工程師。一場線上講座，名字直接叫「解放工作中的十倍生產力」。「我現在的 productivity 是以前的 10x」這種貼文，我一週能滑到三四個。

但同一個 feed 裡，也有人這樣寫：「訂閱 \$200 Max 的這幾個月，是我這輩子產出最多、也最焦慮的時候。」然後他把每月訂閱從 \$200 砍回了 \$60。

同一批工具、同一個「10x」，一邊在賣，一邊在逃。差別在哪？

差在他們嘴裡的 "10x"，根本不是同一件事。

"10x productivity" 從來不是一個 claim。它是三個 claim 疊成一句：任務的 10x、個人整體的 10x、組織的 10x。三層完全不同，可信度也完全不同。喊的人通常沒分清楚自己指的是哪一層，反對的人也沒分清楚自己在打哪一層。於是這場架永遠吵不完，因為兩邊根本不在講同一件事。

但這還只是表層。底下埋著一個更深、也更要命的混淆：就算你指定了是哪一層，你嘴裡的 "productivity"，到底是 activity（你忙了多少、產了多少東西）、output（你真正交付了什麼），還是 outcome（那東西最後換到的結果）？這三個被「10x」縫成了同一個字，但它們之間差了十萬八千里。那個「產出最多、也最焦慮」的人，已經用身體撞到接縫了：activity 衝到這輩子最高，他的結論卻是想退回去。

這篇就做兩件事：先按「哪一層」把任務、個人、組織拆開驗收；再回到「哪一種」，也就是 activity、output、outcome，看「10x」到底在指什麼。最後你會看到，連業界喊得最大聲的兩個人，都在同一個字上栽了跟頭。

## 第一層：任務 10x，這層是真的，沒什麼好吵

受控實驗的數字都擺在那。客服任務有 [AI 輔助後每小時解決問題數增加 15%](https://arxiv.org/abs/2304.11771) 的 field evidence；寫作類任務在 [Science 的實驗](https://www.science.org/doi/10.1126/science.adh2586) 裡顯著縮短完成時間；軟體開發的 GitHub Copilot controlled experiment 裡，受試者完成指定 coding task [快了 55.8%](https://arxiv.org/abs/2302.06590)。這些不是 marketing，是可以被檢查的方法與數據。

在「單一、邊界清楚、可立刻驗證」的任務上，AI 的加速是真的，而且常常很猛。

但記住這層量的是什麼：**output**。你單位時間產出的 code、草稿、清單變多了。而且這是你一個人就數得出來的東西。先把這點記著，後面要用。

任務快 10x，不等於你快 10x。它證明的範圍，比喊的人以為的小很多。這層講完就走，停太久就變成幫 hype 背書。

## 第二層：個人整體的 10x，結構上不可能

而且這不是工具的問題。

把任務層的 output 加速加總起來，為什麼個人整體不會跟著 10x？

Amdahl's law：一個流程的加速上限，被你「沒有加速的那部分」鎖死。AI 能猛加速的是生成，也就是 output。但一件事從開始到真正交付，生成從來不是瓶頸。

舉我自己天天遇到的兩個。

**Code review。** AI 生 code 快了好幾倍。然後呢？review 沒變快。看懂這段在幹嘛、判斷它有沒有踩到別的東西、決定要不要 merge，這些 cost 不但沒降，反而因為「要 review 的量變多了」而上升。output 端省下的時間，一部分直接被驗證端吃回去。

**Outreach。** survey 名單、整理 prospect list，AI 快到誇張。但從名單到真的 convert 成 sale 呢？中間卡著開會、確認需求、來回對齊、簽約。這些 AI 動不了，因為本質是「人要做決定、人要被說服、人要扛後果」。

關鍵在這：就算生成變成完全免費、零延遲，這已經是物理上限了，整體速度還是被那些 AI 碰不到的環節卡住。**這層的天花板是結構性的（structural），不是能力性的（capability）。所以模型再強，也鬆動不了它。** 記住這個區分，等一下兩個 CEO 就是在這裡押錯了邊。

## 第三層：組織的 10x，可能，但還沒發生

而且不會是均勻的。

歷史上看過一模一樣的劇本。工廠電氣化時，工人把電動馬達裝上蒸汽時代的舊機器，生產力幾乎沒動。真正的躍升等了幾十年，等到有人重畫工廠的物理佈局，讓產線繞著「電」這個新前提重組，提升才出現。提升從不來自換馬達，來自重畫佈局。

組織的 10x 也一樣：條件是重構流程，不是把 AI 塞進舊流程的縫隙。

這就解釋了那些難看的總體數字：NBER 相關調查被多家媒體整理成同一個結論，企業 AI 使用率不低，但 [89% 企業說過去三年 productivity 沒有明顯提升、90% 說 employment 沒有變化](https://www.techradar.com/pro/is-ai-at-work-actually-helping-major-survey-claims-many-firms-see-no-obvious-benefit-despite-billions-in-investment)，高層對未來三年的平均預期也只是 productivity +1.4%、output +0.8%。讀成「看吧 AI 沒用」就讀反了。**這不是「AI 沒用」的證據，是「大部分組織還在塞縫隙」的證據。**

我得誠實交代自己在哪。Codeer，六個人，做 AI agent。產品開發這條，我們的 shipping 速度比幾年前快了好幾倍，任務層加上一部分流程重構的成果。但這不是 10x，其他環節（像前面那個 outreach）還卡著。我是個正在賭第三層的人，很清楚自己還在半路。

但這裡有個更尖的問題，你大概已經想到了：**就算組織真的重構成功、productivity 漲了，為什麼營收沒有跟著漲？** 因為 productivity 跟營收之間，隔著一整層市場：需求夠不夠大、對手是不是也 10x（大家一起 10x = 東西變便宜，不是你賺 10x）、定價權在不在你手上。農業生產力漲了幾十倍，農民收入沒漲幾十倍，因為糧價崩了。

產能 10x 不等於賣得掉 10x，不等於賺到 10x。而這，正好把我們帶到那個最深的混淆。

## 你說的 productivity，是 output 還是 outcome？

退一步。「哪一層」還不是最深的問題。最深的是：你嘴裡的 "productivity"，指的是 **output**（你做出來的東西）還是 **outcome**（那東西真正換到的結果：問題解決了、錢賺到了、用戶被滿足）？

這兩個被「productivity」這個字偷偷縫成了一個。但它們之間，隔著前面整篇講的所有東西：判斷、決定、說服、市場、定價、責任。

而且這裡有個結構性的不對稱：output 量得到，outcome 量不到。我今天寫了多少 code、survey 了多少名單，自己就數得出來；這些 code 有沒有解決對的問題、這些名單最後換到多少錢，要等、要靠別人、不歸我一個人管。

但真正難看的是再下面一層：**多數人喊的「10x」，連 output 都稱不上，是 activity。**

回頭看 developer 到底在幹嘛。他真正的 output 從來不是「寫了多少 code」，是把功能 ship 到 production、變成客戶手上真的在用的東西。code 寫了一卡車，卡在沒 deploy、進不了 production，那個產出是零，而十倍的零還是零。outreach 也一樣：你用 AI 把名單收集速度拉了十倍，但名單躺在 sheet 裡沒寄出去、沒真的更早碰到客戶，一樣是零。收名單是 activity，碰到客戶才是 output。

所以很多人喊的 10x，是最上游、最好灌水的那個 activity 數字（行數、名單筆數），離他自己真正的 end-to-end output 都還有一段他沒提的路，更別說 outcome 了。

我本來想把這寫成「被逼的 proxy」：outcome 量不到，只好退而求其次量 output。但這太客氣了。實情更可能是，他們挑的根本不是退而求其次的 output，是最好灌水的 activity。而且不少人心裡未必不知道：「我 10x」好發、吸睛、講起來爽；outcome 難講、會打臉、沒人想聽。與其說被逼，不如說是挑了那個最爽的數字來喊。

現在來看業界喊得最大聲的兩個人。

2025 年，Sam Altman 跟 Dario Amodei 賭的是 **outcome**。Amodei 在 Axios 講得最白：AI 五年內可能消滅一半的 entry-level 白領工作，失業率衝到 10-20%，金融、法律、顧問、科技首當其衝。這個說法後來被 [Axios](https://www.axios.com/2025/05/30/ai-jobs-replace-humans-ceos-amodei)、[Business Insider](https://www.businessinsider.com/anthropic-ceo-warning-ai-could-eliminate-jobs-2025-5) 反覆整理。Altman 那幾年也反覆 warning entry-level 要完。注意這是什麼 claim：outcome 的、未來式的、賭出來的。跟工程師「我 output 10x 了」根本是兩種東西。

然後 2026 年 5 月，Altman 改口。

Altman 在 Commonwealth Bank of Australia 的對談裡承認自己對 AI 的社會與經濟衝擊判斷錯得不輕，還說自己 ["delighted to be wrong"](https://www.businessinsider.com/sam-altman-ai-jobs-prediction-wrong-white-collar-openai-australia-2026-5)。Amodei 的語氣也開始出現另一條路線：從「工作消失」轉向「工作轉變、放大既有 worker」，同時仍保留對大規模 displacement 的警告。

看清楚這裡發生了什麼：**敘事從 outcome claim（工作會消失），退回 output claim（productivity 會上升）。** 中間那個「10x」，就是退路。outcome 賭輸了，至少還沒贏，於是縮回 output。而 output 永遠是安全的，因為它本來就量得到、本來就在漲。

所以「10x productivity」這個詞最深的問題，被兩個最該講清楚的人，在 12 個月內、當著全世界的面，現場表演了一次：先把 output 的加速講成 outcome 的革命，等 outcome 沒兌現，再縮回 output 那個一直都成立的版本。

## 但別急著走到反面結論

拆到這裡你又會想：「看吧，工作根本沒消失，所以根本沒事、AI 根本沒效。」

這結論一樣太快，而且一樣有毒。

量測本身就是問題。aggregate 的就業數字穩，不代表底下沒事：white-collar professional sector 從 2023 年 4 月高點後 [累計就業已經下降約 2%](https://www.axios.com/2026/06/09/white-collar-jobs-labor-market)，而其他部門還在成長；2026 年到五月，Layoffs.fyi 被媒體引用的科技業裁員數也已經 [接近十萬](https://www.techradar.com/pro/freshworks-and-coinbase-announce-more-than-1-in-10-jobs-to-go-as-companies-replace-workforce-with-ai-technologies-tech-company-layoffs-near-100k-in-2026-alone)。「總就業穩定」這個儀表板數字，蓋住了底下可能正在發生的位移。總體看不到，不代表沒發生，只代表那張表抓不到。

但這裡得對自己誠實一次：這些 layoff 是不是 AI 造成的，沒人真的知道。公司確實愛說是 AI，可是「是 AI」對一家公司來說剛好是最方便的故事：顯得自己站在未來，又能蓋掉過度招聘、利率、景氣這些不性感的真因。**「公司說是 AI」跟「工程師說我 10x」是同一種 proxy，都挑了最好講、最吸睛的故事，不是最準的那個。** 所以紀律是雙向的：別因為總體沒動就說 AI 沒效，也別因為公司喊 AI 就信 AI 在砍人。兩個方向的便宜故事，都別照單全收。

而且 outcome 裡還有一整塊報表天生抓不到：AI 幫你擋掉的一場事故、讓一個原本不值得做的長尾需求第一次變得可做、把一份東西做到原本請不起那種人才做得到的水準。事故沒發生、需求被滿足、品質默默上升，共同點是，它們都不會在 GDP 或財報上長出一個正數。

這正是我上一篇講 [proxy 幻覺](/posts/ai-proxy-metrics/) 那個坑的鏡像版。上一篇講 "activity 不等於 value"，別把忙碌當成果、別信假訊號。這篇要補它沒講完的另一半：**value 有時候剛好量不到。只信你量得到的（output、aggregate 就業數字），跟只信你看起來很忙，是同一種病的兩面，都是抓著一個方便的 proxy，當成你真正在乎的東西。**

最後一刀，回到那個 capability vs structural。outcome 還能再切一刀。認知型的 outcome（想清楚、做判斷），也許 capability 真的追得上，Altman 跟 Amodei 賭的就是這塊。但責任型的 outcome（出事誰扛、誰被告、誰上證人席）可能跟 capability 一點關係都沒有。**你沒辦法把一個 model 拉上證人席。** 所以就算最強的 AI 情境成真，精確的版本也不是「工作消失」，而是認知那塊被自動化、責任那塊濃縮到更少人手上。那不是大家一起 10x，是分化，接回第三層。

## 給實際要做事的人的判準

不收大道理。給一個你今天就能用的。

下次有人，或你自己，宣稱 10x，問三個問題：

1. 你 10x 的是哪一層、哪一種？（任務 / 個人 / 組織；activity / output / outcome）
2. 這個提升如果不做，最壞會怎樣？
3. 那個最壞如果永遠不發生，你會怎麼知道？

答得出來，那是真的提升，你只是還沒學會怎麼描述它。答不出來，那是 proxy，一個讓你感覺很爽、但指不到任何具體東西的數字。

賣課的人說 10x，燒了半年想退回 \$60 的人也說 10x，Amodei 改口時還是說 10x。同一個字，四個完全不同的東西。連最該講清楚的那兩個人都花了一年，才把 "10x" 裡的 activity、output、outcome 分清楚。你不用花一年。
