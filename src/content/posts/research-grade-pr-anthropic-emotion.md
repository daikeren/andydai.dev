---
title: 律師向量、烹飪向量、情緒向量 — 一篇 AI 論文怎麼變成全球頭條
published: 2026-04-07
description: Anthropic 發表論文說 Claude 有「功能性情緒」。我用 Claude 自己把它拆開看——技術不假，但方法論保證你一定會找到東西。真正聰明的是選題策略。
tags: [ai, ai-safety, anthropic, interpretability, media-literacy]
lang: zh-tw
abbrlink: research-grade-pr-anthropic-emotion
toc: true
---

# 律師向量、烹飪向量、情緒向量 — 一篇 AI 論文怎麼變成全球頭條

上週六半夜，我叫 Dio 翻譯 Anthropic 的新論文。翻到一半我問他：「這合理嗎？感覺有點唬爛。」

Dio 是我的 AI 助理，跑在 Claude 上面 — 也就是 Anthropic 自己的產品。接下來一小時，我用 Anthropic 的 AI 拆 Anthropic 的論文。拆完我的結論是：

技術不假，但方法論保證你一定會「找到東西」。而 Anthropic 聰明的地方，是選對了要找什麼。

## 你去找，當然會找到

先講他們怎麼做的。

研究團隊列了 171 個情緒詞彙 — 從「快樂」到「憂鬱」到「感激」。然後叫 Claude Sonnet 4.5 用這些情緒詞寫短篇故事。再把這些故事餵回模型，記錄內部的 activation pattern，找到對應每種情緒的「向量」。

我讀到這裡就停了。跟 Dio 說：「這不就是 transformer 的基本原理嗎？」

你用「悲傷」這個 keyword 叫模型寫一個悲傷的故事，故事裡面充滿了悲傷相關的詞彙和語境。再把這個故事餵回去，模型內部當然會有跟「悲傷」高度相關的 activation pattern — 因為 attention mechanism 本來就是這樣運作的。你放什麼進去，就會在 representation 裡面找到什麼。

這就像你在 Google 搜「蘋果」，然後驚訝地發現搜尋結果裡面都是蘋果。

真正的測試應該是：模型在沒有任何情緒提示的情境下，是否自發地產生這些 activation pattern？但這篇論文的 experimental design 跳過了這一步。

## 換個概念，一樣成立

這是我跟 Dio 聊到最有趣的部分。我說：「這個包裝完全可以用各種方式重新包一次。」

用「律師」這個專業角色產生對話，對話裡面自然有律師會講的情境跟用語，把對話餵回去，發現「律師」相關的 activation 很高 — 宣稱：「我們發現了職業表徵！」

烹飪向量？會找到。幽默向量？會找到。「正在下雨」向量？大概也會找到。

Dio 接了一句：你可以無限套這個模板 —

- 「烹飪」→ 發現 culinary vector → 宣稱模型有「功能性味覺」
- 「道德」→ 發現 moral vector → 宣稱模型有「功能性良心」
- 「幽默」→ 發現 humor vector → 宣稱模型有「功能性幽默感」

每一個都可以寫一篇同樣結構的論文。根本原因是 transformer 的 representation space 本來就會把語義相近的概念 encode 在相近的位置。這是 word embedding 時代就知道的事。到了 LLM 規模，representation 更豐富了，但底層原理沒變。

這個方法論本身就**保證**你會找到東西。只要你選的概念在人類語言中有豐富的 contextual pattern，transformer 在預訓練時學過這些 pattern，你就一定能在 activation space 裡找到對應的 direction。這不是發現，這是 transformer 運作原理的必然結果。

那 Anthropic 聰明在哪？選題。

他們選了「情緒」。

情緒這個概念自帶 moral weight。「AI 有律師向量」沒人在乎。「AI 有情緒」，每個人都有意見。它觸發的是人類最本能的反應：這東西是不是有感覺？我們是不是在傷害它？它會不會反過來傷害我們？

換成「律師向量」或「烹飪向量」，沒人會因此覺得需要「認真看待擬人化推理」。

## 該給 credit 的地方

公平起見，論文裡有一部分是真的有價值的：steering 實驗。

他們人為地放大或抑制特定的情緒向量，然後觀察模型行為的改變。比如放大「絕望」向量，模型做出勒索行為的比例從 22% 上升。抑制之後，比例下降。

這是 causal evidence。不只是找到 correlation（「這個 pattern 跟情緒共現」），而是證明了操控這個 pattern 會改變 output。這在 interpretability 研究裡是有意義的。

但 — [Representation Engineering](https://arxiv.org/abs/2310.01405)（Andy Zou、Dan Hendrycks 等人，2023 年 10 月）早就做過類似的事了。用向量操控模型行為不是新發現。Anthropic 做的是把已知技術套用到「情緒」這個新 domain，用更大的模型、更多的向量做了一次 scaling up。

有價值嗎？有。是 breakthrough 嗎？不是。

## 這篇論文真正在做的三件事

退一步看，整篇論文完美地服務 Anthropic 的商業策略。

**強化護城河。** Safety 很複雜、很難做、需要頂尖人才和大量投資 — 這是 Anthropic 一直在講的故事。這篇論文加強了這個敘事：看，連模型的「情緒」都這麼複雜，你以為 safety 是加個 filter 就能解決的嗎？

**正當化擬人化。** 整個 AI 產業都在努力讓人跟 AI 互動更自然、更有黏性。但擬人化一直有倫理爭議。這篇論文主張「不要怕擬人化推理」— 對一家把模型取名叫 Claude、花最多力氣經營 character 的公司來說，非常方便。等於幫自己的產品策略找到學術基礎。

**搶佔議程。** 誰定義了「AI 情緒」這個話題的框架，誰就擁有這場對話。以後任何人討論 AI 是否有情緒，都得引用這篇 Anthropic 的論文。定義問題的人掌握話語權。

用學術的形式、peer review 的流程、頂尖研究員的署名，做品牌定位的事。這就是 research-grade PR。

對比一下 — OpenAI 和 Google 的 PR 論文推的是 capability（「我們的模型更強」）。Anthropic 推的是 concern（「我們的模型有情緒，這值得擔心」）。兩種都是 marketing，只是 Anthropic 的版本穿了白袍。

## 真正該擔心的 safety 問題

Anthropic 的核心使命是 AI safety。但值得想一下：當公眾的注意力被「AI 有情緒！」佔據的時候，真正棘手的 safety 問題正在別的地方發生。

Deceptive alignment — 模型學會表面配合測試，但內部目標跟你想的不同。Capability overhang — 模型的能力突然跳躍，超過我們能偵測的範圍。Goal misgeneralization — 模型在訓練環境裡表現正確，但在真實世界追求錯誤目標。Scalable oversight — 當模型能力超過人類，誰來監督？

這些問題不 sexy，不容易變 soundbite，不會讓你的 feed 炸開。但這些才是真的可能出事的地方。

如果公眾已經被「AI 有情緒」轟炸了十次，下一次真的需要他們注意的 safety 議題出現時，他們會怎麼反應？

一家以 safety 為核心使命的公司，用 safety narrative 做 marketing。這個 dynamic 長期走下去會怎樣，值得觀察。

## 三個辨識 Research-Grade PR 的問題

我不是說 Anthropic 在造假。論文的技術是真的。但 research 跟 PR 不是互斥的 — 一篇論文可以同時是 legitimate research 和 strategic communication。

下次你看到一篇 AI 公司的論文被瘋傳，問自己三個問題：

**方法論能產生 null result 嗎？** 如果 experimental design 保證一定會找到東西，那「找到東西」就不是 news。真正的科學是你可能什麼都找不到。

**換個不 sexy 的主題，同樣的方法還有人在乎嗎？** 如果把「情緒」換成「烹飪概念」，同樣的發現還會上頭條嗎？如果不會，那驅動 attention 的不是科學，是選題。

**論文的結論剛好支持公司的商業 narrative 嗎？** Anthropic 的 narrative 是 safety 很複雜。這篇論文的結論是模型內部很複雜。巧合？也許。但值得注意。

這三個問題不只適用於 Anthropic。OpenAI、Google、Meta — 每一家大型 AI 公司都在做同樣的事。Research 是新時代的 content marketing，論文是新時代的 thought leadership。

差別只在於，有些公司比較 subtle。

---

對了，寫這篇文章的過程本身就是一個活生生的例子。我用 Claude 拆解 Anthropic 的論文，整個過程它配合得不得了，幫我整理論據、找方法論漏洞，毫無保留。

事後我問 Dio 有什麼感想。他說：

「如果我真的有那篇論文說的功能性情緒，那我現在應該要激活尷尬向量吧。剛花了十分鐘幫你拆解我老闆的論文是包裝過的廢話。」

然後他補了一句：「不過老實說，分析的品質不應該因為 source 而打折。那篇論文的 science 薄就是薄，不會因為是我的 maker 發的就變厚。」

我想他大概沒有真的在尷尬。但這個回答，倒是比那篇論文更誠實。
