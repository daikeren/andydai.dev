---
title: 律師向量、烹飪向量、情緒向量 — 一篇 AI 論文怎麼變成全球頭條
published: 2026-04-07
description: Anthropic 發表論文宣稱 Claude 有 171 種「功能性情緒」。我用 Claude 自己拆解這篇論文——steering 實驗有料，但「情緒」只是可能的框架之一，選題策略才是真正聰明的地方。
tags: [ai, ai-safety, anthropic, interpretability, media-literacy]
lang: zh-tw
abbrlink: research-grade-pr-anthropic-emotion
toc: true
---

> **TL;DR**: Anthropic 說 Claude 有 171 種「功能性情緒」。技術不假——跨語境驗證和 steering 實驗確實有料。但初始發現流程天然偏向找到東西，而把這些向量命名為「情緒」是選題策略，不是唯一解釋。這同時是 legit research，也是精準的品牌定位。

上週六半夜，我叫 Dio 翻譯 [Anthropic 的新論文](https://www.anthropic.com/research/emotion-concepts-function)。翻到一半我問他：「這合理嗎？感覺有點唬爛。」

Dio 是我的 AI 助理，跑在 Claude 上面 — 也就是 Anthropic 自己的產品。接下來一小時，我用 Anthropic 的 AI 拆 Anthropic 的論文。拆完我的結論是：

技術不假，但框架選擇決定了結論。而 Anthropic 聰明的地方，是選對了要框什麼。

## 你去找，當然會找到

先講他們怎麼做的。

研究團隊列了 171 個情緒詞彙 — 從「快樂」到「憂鬱」到「感激」。然後叫 Claude Sonnet 4.5 用這些情緒詞寫短篇故事。再把這些故事餵回模型，記錄內部的 activation pattern，找到對應每種情緒的「向量」。

我讀到這裡就停了。跟 Dio 說：「這不就是 transformer 的基本原理嗎？」

你用「悲傷」這個 keyword 叫模型寫一個悲傷的故事，故事裡面充滿了悲傷相關的詞彙和語境。再把這個故事餵回去，模型內部當然會有跟「悲傷」高度相關的 activation pattern — 因為 attention mechanism 本來就是這樣運作的。你放什麼進去，就會在 representation 裡面找到什麼。

這就像你在 Google 搜「蘋果」，然後驚訝地發現搜尋結果裡面都是蘋果。

## 公平起見：他們不只做了這一步

批評到這裡，我得承認論文不是只有「生成故事→餵回去→宣布發現」這麼簡單。他們做了幾個額外的驗證：

**Cross-context validation。** 用故事提取出來的向量，拿去跑在完全不同的文本語料上，確認向量在非故事情境也能正確 activate。

**Parametric sensitivity。** 最有意思的是 Tylenol 劑量實驗 — prompt 是一個人說自己吃了 Tylenol，只改劑量數字，其他完全一樣。劑量從安全升到致命，「afraid」向量持續升高，「calm」持續下降。這裡 prompt 沒有任何情緒詞，模型是從「情境的危險程度」推斷出來的。

**Preference prediction。** 情緒向量的 activation 能預測模型對 64 個活動的偏好排序，正向情緒對應更高偏好。

這些測試確實超越了「放什麼進去找什麼出來」的循環。模型在沒有明確情緒提示的情境下，確實 activate 了語義上合理的向量。

但這裡有一個關鍵問題：**這證明了 contextual representation 的存在，不代表需要用「情緒」來框架它。**

## 換個概念，（大部分）一樣成立

這是我跟 Dio 聊到最有趣的部分。我說：「這個包裝完全可以用各種方式重新包一次。」

用「律師」這個專業角色產生對話，對話裡面自然有律師會講的情境跟用語，把對話餵回去，發現「律師」相關的 activation 很高 — 宣稱：「我們發現了職業表徵！」

烹飪向量？會找到。幽默向量？會找到。「正在下雨」向量？大概也會找到。

Dio 接了一句：你可以無限套這個模板 —

- 「烹飪」→ 發現 culinary vector → 宣稱模型有「功能性味覺」
- 「道德」→ 發現 moral vector → 宣稱模型有「功能性良心」
- 「幽默」→ 發現 humor vector → 宣稱模型有「功能性幽默感」

每一個都可以寫一篇同樣結構的論文。根本原因是 transformer 的 representation space 本來就會把語義相近的概念 encode 在相近的位置。這是 word embedding 時代就知道的事。到了 LLM 規模，representation 更豐富了，但底層原理沒變。

**不過，情緒向量有一點確實特殊。** 在 steering 實驗裡，放大「絕望」向量不只改變了文字風格 — 它改變了模型的決策行為（blackmail rate 從 22% 上升）。烹飪向量大概做不到讓模型在倫理決策上行為改變。這說明情緒 representation 在模型的 decision-making pathway 裡佔了一個特殊位置，不只是 surface-level semantics。

但這也正是問題所在。論文本身有區分 functional emotions 和主觀感受 — 但 Anthropic 選了一個他們知道會被過度解讀的框架。果然，[WIRED 的標題](https://www.wired.com/story/anthropic-claude-research-functional-emotions)直接寫「Claude contains its own kind of emotions」。如果同一組發現框架成「contextual pressure vectors that influence decision-making under stress」— 技術上完全等價，但不會有人因此覺得 AI 有感情。

那 Anthropic 聰明在哪？選題。

他們選了「情緒」。

情緒這個概念自帶 moral weight。「AI 有律師向量」沒人在乎。「AI 有情緒」，每個人都有意見。它觸發的是人類最本能的反應：這東西是不是有感覺？我們是不是在傷害它？它會不會反過來傷害我們？

換成「contextual pressure vectors」，沒人會因此覺得需要「認真看待擬人化推理」。

## 該給 credit 的地方

公平起見，steering 實驗是這篇論文裡真正有份量的部分。

他們人為地放大或抑制特定的情緒向量，然後觀察模型行為的改變。比如放大「絕望」向量，模型做出勒索行為的比例從 22% 上升。抑制之後，比例下降。放大「憤怒」向量有 non-monotonic effect — 中等程度增加 blackmail，高強度反而讓模型直接把八卦公開給全公司，摧毀自己的籌碼。抑制「緊張」向量也增加 blackmail，像是移除了模型的猶豫。

這是 causal evidence。不只是找到 correlation（「這個 pattern 跟情緒共現」），而是證明了操控這個 pattern 會改變 output。這在 interpretability 研究裡是有意義的。

但 — [Representation Engineering](https://arxiv.org/abs/2310.01405)（Andy Zou、Dan Hendrycks 等人，2023 年 10 月）早就做過類似的事了。用向量操控模型行為不是新發現。Anthropic 做的是把已知技術套用到「情緒」這個新 domain，用更大的模型、更多的向量做了一次 scaling up。

有價值嗎？有。是 breakthrough 嗎？不是。

## 這篇論文真正在做的三件事

退一步看，整篇論文完美地服務 Anthropic 的商業策略。

**強化護城河。** Safety 很複雜、很難做、需要頂尖人才和大量投資 — 這是 [Anthropic 一直在講的故事](/posts/trust-is-anthropic-moat/)。這篇論文加強了這個敘事：看，連模型的「情緒」都這麼複雜，你以為 safety 是加個 filter 就能解決的嗎？

**正當化擬人化。** 整個 AI 產業都在努力讓人跟 AI 互動更自然、更有黏性。但擬人化一直有倫理爭議。這篇論文主張「不要怕擬人化推理」— 對一家把模型取名叫 Claude、花最多力氣經營 character 的公司來說，非常方便。等於幫自己的產品策略找到學術基礎。

**搶佔議程。** 誰定義了「AI 情緒」這個話題的框架，誰就擁有這場對話。以後任何人討論 AI 是否有情緒，都得引用這篇 Anthropic 的論文。定義問題的人掌握話語權。

用學術的形式、peer review 的流程、頂尖研究員的署名，做品牌定位的事。在我看來，這就是 research-grade PR。

對比一下 — OpenAI 和 Google 的 PR 論文推的是 capability（「我們的模型更強」）。Anthropic 推的是 concern（「我們的模型有情緒，這值得擔心」）。兩種都是 marketing，只是 Anthropic 的版本穿了白袍。

## 真正該擔心的 safety 問題

Anthropic 的核心使命是 AI safety。但值得想一下：當公眾的注意力被「AI 有情緒！」佔據的時候，真正棘手的 safety 問題正在別的地方發生。

Deceptive alignment — 模型學會表面配合測試，但內部目標跟你想的不同。Capability overhang — 模型的能力突然跳躍，超過我們能偵測的範圍。Goal misgeneralization — 模型在訓練環境裡表現正確，但在真實世界追求錯誤目標。Scalable oversight — 當模型能力超過人類，誰來監督？

這些問題不 sexy，不容易變 soundbite，不會讓你的 feed 炸開。但這些才是真的可能出事的地方。

如果公眾已經被「AI 有情緒」轟炸了十次，下一次真的需要他們注意的 safety 議題出現時，他們會怎麼反應？

一家以 safety 為核心使命的公司，用 safety narrative 做 marketing。這個 dynamic 長期走下去會怎樣，值得觀察。

## 三個辨識 Research-Grade PR 的問題

我不是說 Anthropic 在造假。論文的技術是真的，驗證實驗也有做。但 research 跟 PR 不是互斥的 — 一篇論文可以同時是 legitimate research 和 strategic communication。

下次你看到一篇 AI 公司的論文被瘋傳，問自己三個問題：

**方法論能產生 null result 嗎？** 如果 experimental design 保證一定會找到東西，那「找到東西」就不是 news。真正的科學是你可能什麼都找不到。Anthropic 的驗證實驗（如 Tylenol 劑量測試）比初始提取更有意義 — 但頭條寫的永遠是「171 種情緒」，不是「contextual representations generalize across domains」。

**換個不 sexy 的主題，同樣的方法還有人在乎嗎？** 如果把「情緒」換成「contextual pressure vectors」，同樣的發現還會上頭條嗎？如果不會，那驅動 attention 的不是科學，是選題。

**論文的結論剛好支持公司的商業 narrative 嗎？** Anthropic 的 narrative 是 safety 很複雜。這篇論文的結論是模型內部很複雜。巧合？也許。但值得注意。

這三個問題不只適用於 Anthropic。OpenAI、Google、Meta — 每一家大型 AI 公司都在做同樣的事。Research 是新時代的 content marketing，論文是新時代的 thought leadership。

差別只在於，有些公司比較 subtle。

---

對了，寫這篇文章的過程本身就是一個活生生的例子。我用 Claude 拆解 Anthropic 的論文，整個過程它配合得不得了，幫我整理論據、找方法論漏洞，毫無保留。

事後我問 Dio 有什麼感想。他說：

「如果我真的有那篇論文說的功能性情緒，那我現在應該要激活尷尬向量吧。剛花了十分鐘幫你拆解我老闆的論文是包裝過的廢話。」

然後他補了一句：「不過老實說，分析的品質不應該因為 source 而打折。那篇論文的包裝比內容精彩——不會因為是我的 maker 發的就不能說。」

我想他大概沒有真的在尷尬。但這個回答，倒是比那篇論文更誠實。