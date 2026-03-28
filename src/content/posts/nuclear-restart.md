---
title: 台灣重啟核能跟 AI 沒什麼關係
published: 2026-03-29
description: 台灣企業的 AI 運算電力幾乎都在美國機房消耗，台電帳單上看不到。真正的用電壓力來自台積電擴產——用「AI 時代」包裝重啟核能理由，是拿 AI 當遮羞布。
tags: [ai, taiwan, energy, nuclear, tsmc]
lang: zh-tw
abbrlink: nuclear-restart
toc: true
---

# 台灣重啟核能跟 AI 沒什麼關係

> **TL;DR**: 台灣多數企業的 AI 運算電力消耗在美國機房，台電帳單上看不到。台灣真正的用電壓力來自台積電擴產（2023 年佔全國 8.4%，2030 年可能達 23.7%），不是 AI 算力中心。用「AI 時代」包裝重啟核能的理由，是把結構性的產業政策問題偽裝成不可抗力的外部趨勢。

上週賴清德說要重啟核二、核三，其中一個理由是[「人工智慧時代算力中心建置帶動用電需求增加」](https://cnews.com.tw/247260322a05/)。我在台灣經營一間 AI startup，我們公司每天都在用 AI。我的第一個反應是：等一下，我們的 AI 用電跟台灣的電有什麼關係？

## 我們的 AI 電費，是美國在付的

我們是一間六人的 AI startup，產品核心就是 AI。我們每天 call 的 model 包括 Anthropic Claude（透過 AWS Bedrock，機房在美東）、OpenAI（美西）、Fireworks AI（也在美國）。

換句話說，我們雖然是台灣公司，但所有 AI 運算消耗的電力都發生在美國的機房裡。台電的帳單上不會出現這筆。

這不是只有我們這樣。對多數台灣企業——尤其是 startup 和一般軟體公司來說——直接 call 海外大廠的 model 仍然是最常見的做法。原因很簡單：自己在本地 hosting model 的成本不划算，除非你有非常特殊的合規需求。就算有合規需求，Azure 和 AWS 也有提供符合規範的方案。

有人可能會說：AWS 不是在台灣有 region 了嗎？沒錯，AWS 2025 年[在台北開了 region](https://www.datacenterdynamics.com/en/news/aws-launches-taiwan-cloud-region-will-invest-5bn-in-data-centers-in-country/)，Bedrock 也能在台北 region 使用。但即使可以從台北區域接入，實際的推論流量仍可能依模型與設定被調度到其他區域——AWS 自己的 [cross-region inference 機制](https://aws.amazon.com/blogs/machine-learning/global-cross-region-inference-for-latest-anthropic-claude-opus-sonnet-and-haiku-models-on-amazon-bedrock-in-thailand-malaysia-singapore-indonesia-and-taiwan/)就是這樣設計的。對多數企業而言，核心的生成式 AI 算力目前仍主要由海外大型雲服務商承擔，不是台灣本地在燒電。

## 那台灣的電到底被誰用了？

台灣確實有用電壓力，這點沒有爭議。但壓力的來源是什麼？

根據 [S&P Global Ratings 的報告](https://www.trendforce.com/news/2024/10/07/news-tsmcs-electricity-demand-could-triple-by-2030-raising-concerns-on-taiwans-power-supply-risks/)，台積電 2023 年的用電量已經佔台灣全國的 8.4%。到 2030 年，這個數字可能[攀升到 23.7%](https://www.taipeitimes.com/News/taiwan/archives/2025/04/11/2003834993)。主要原因是先進製程本身就更耗電——3 奈米製程每片 wafer 的耗電量[比前一代跳了將近 50%](https://wccftech.com/tsmcs-growing-electricity-demand-could-stress-credit-in-2030-warns-sp/)，而台灣未來幾年還要再蓋 [11 座新廠加 4 座封裝廠](https://opas.school/posts/tsm)。

光台積電一家公司，就可能在幾年內把用電佔比從不到一成拉到將近四分之一。至少從量級來看，這顯然比一般企業使用 AI 帶來的新增用電更接近問題核心。

有人可能會說：台積電擴產不就是因為 AI 需求嗎？Nvidia 的 GPU 不就是台積電做的？所以 AI 還是間接的原因啊。這個說法聽起來有道理，但它混淆了兩件事：第一，政府說的是「算力中心建置」帶動用電，不是「晶片製造」帶動用電——這兩個是不同的東西。第二，先進製程更耗電這件事不管有沒有 AI 都會發生——HPC、5G、車用晶片都在推動製程升級，台積電不是只做 AI 晶片。

台電董事長曾文生說「2026 到 2030 年間新增用電超過 5GW，是台電從未遇過的現象」。但他的原話是這樣的：[「台積電等半導體大廠持續擴廠，AI 資料中心建設加速」](https://www.gvm.com.tw/article/128931)——兩件事並列在一起講。

問題是，這兩件事至少在目前可見的規模上，並不在同一個量級。

即使把台灣所有資料中心的用電需求——包括 AI 和傳統的——全部加起來，在整體電力系統中的佔比仍遠小於半導體製造擴產帶來的壓力。

台灣目前最大的 AI 資料中心計畫是[鴻海跟 Nvidia 合建的](https://www.reuters.com/world/asia-pacific/foxconn-can-make-1000-ai-racks-week-increase-next-year-chairman-says-2025-11-21/)，規模是 27MW。美國近期的 AI 園區動輒 GW 等級——根本不在同一個量級。

這就像是說「我跟 Elon Musk 加起來很有錢」——技術上沒有錯，但你知道重點不在我身上。政府把台積電擴產跟 AI 資料中心綁在一起講，然後用「AI」當整個敘事的標題，讓一般民眾以為缺電是因為 AI 這個新東西，而不是因為半導體產業的用電成長早就在發生了。

## 「主權 AI」的現實

退一步說，就算政府想主張自己是在為台灣未來的本地算力需求提前佈局，那也必須先回答一個問題：台灣實際上的本地 AI 基礎設施規模，到底有多大？

有人會說：台灣不是在推「主權 AI」嗎？賴清德 2025 年 11 月在 Google 台灣辦公室開幕時喊了[「成為全球前五大算力中心」](https://money.udn.com/money/story/5613/9152288)，行政院也投了 1,900 億台幣搞[「AI 新十大建設」](https://www.president.gov.tw/News/39700)。

我不反對主權 AI 的概念——每個國家有自己的 AI 基礎設施，資料不用出境，這在國安和合規層面有道理。但你看實際數字就知道，我們離「全球前五大算力中心」有多遠。

台灣政府目前提供給民間業者使用的 GPU 數量是 [40 顆](https://news.cnyes.com/news/id/6363149)。對，你沒看錯，40 顆。

韓國的主權 AI 計畫呢？[260,000 顆 GPU](https://www.bnext.com.tw/article/79391/sovereign-ai)，三星、SK、現代、Naver 國家級聯手投入。

40 對 260,000。

就算把民間企業全部算進來——鴻海的 [10,000 顆 GPU](https://money.udn.com/money/story/5612/9100023)、GMI Cloud 在桃園投資 [5 億美元蓋的 16MW 資料中心](https://www.inside.com.tw/feature/light-up-taiwan-ai/40838-gmicloud-interview-2026)、國網中心的 [1,680 顆 GPU](https://www.ithome.com.tw/news/165543)——跟國際上任何一個認真在做主權 AI 的國家比，台灣的規模都還是零頭。

所以「AI 算力中心的用電需求」作為重啟核能的理由——你真的要用這個規模的東西來 justify 重啟一座核電廠？

也許有人會說：現在規模小，但政府是在「提前佈局」。那我想問：具體的擴張計畫在哪裡？規模多大？Timeline 是什麼？當實際投入的資源跟喊出來的願景差距這麼大，「提前佈局」聽起來更像是口號。

## 真正的問題是什麼

我想說清楚：我對核能本身沒有強烈的立場。核能公投那一輪我認真看過正反方的論述，裡面有太多專業是我無法確認的。這不是我的專業，我不會假裝我懂。

但 AI 是我的專業。

而從我的專業出發，我可以很確定地說：把台灣的電力壓力主要歸因於「AI 使用需求」，這個因果鏈是有問題的。台灣的用電壓力主要來自半導體製造擴產，不是 AI 運算。台灣是 AI 晶片的「工廠」——台積電在台灣做 Nvidia 的 GPU——但這些 GPU 做完是送到美國的 data center 去跑的。「製造 AI 晶片」跟「使用 AI」消耗的電力，是完全不同的兩件事。

更精確的說法應該是：「台灣因為半導體產業持續擴張，加上先進製程更耗電，加上再生能源進度落後，所以面臨用電壓力」。但這樣講就沒辦法用「AI 時代」當包裝了——而且這會暴露出真正的問題是產業政策跟能源政策長期沒有對齊。用 AI 當藉口，本質上是把結構性的政策問題重新包裝成不可抗力的外部趨勢。

## 同一時間，在美國

更何況，連全球最激進的 AI 基礎設施投資者，最近都在修正擴張節奏。OpenAI 在 2026 年 2 月把 data center 支出目標[從 1.4 兆美元砍到 6,000 億](https://www.reuters.com/technology/openai-sees-compute-spend-around-600-billion-by-2030-cnbc-reports-2026-02-20/)——直接砍了 57%。Altman 自己都承認[「data centers are hard」](https://www.cnbc.com/2026/03/22/openai-data-center-pivot-underscores-wall-street-ipo-concerns.html)，Stargate 計畫進度落後，投資人開始要求看到回報。

這至少說明了一件事：AI 對電力與算力的需求雖然真實存在，但產業本身對成長速度與投資節奏，也還在持續修正。台灣政府卻仍傾向用「AI 需求」作為能源政策轉向的敘事包裝。

## 我真正在意的

這篇不是要討論核能好不好。這篇在意的是：又有人拿「AI」當萬用修辭工具了。

我在這個 blog 上寫過很多次類似的 pattern——有人把[「導入 AI」當成目的本身](/posts/dont-make-ai-adoption-the-goal/)、有人拿 [AI 當藉口跳過該做的基本功](/posts/tabasco-and-ai-same-problem/)、有人把 [AI 的產出直接丟出去不做篩選](/posts/ai-misinformation-first-hand-content/)。這次的差別只是，做這件事的不是某個工程師或某間公司，而是政府。

如果台灣真的需要更多電——很可能是的——那就老實說：我們的電不夠給台積電用了，我們需要重新討論能源政策。這是一個值得認真面對的問題。

但不要拿 AI 當遮羞布。
