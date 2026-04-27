---
title: Impression 不是 regression，regression 不是動機
published: 2026-04-27
description: 把 AI provider「降智」的社群論述拆成四層：impression、regression、behavior change、motive。最糟的不是 model 變差，而是公共討論太快跳去猜動機。
tags: [ai-engineering, ai-industry, media-literacy]
lang: zh-tw
abbrlink: impression-not-regression
toc: true
faqs:
  - question: 使用者覺得 AI 變差，算不算證據？
    answer: 算訊號，但不算充分證據。體感很重要，但如果沒有 task、介面、prompt、時間點和可重現條件，就還停在 impression，不是 regression。
  - question: Anthropic 這篇 postmortem 證明他們完全沒有問題嗎？
    answer: 沒有。它只說明一件事：使用者感受到的品質變化，可能來自 product-layer 的多個變更，而不是直接等於 model 被故意降智。
  - question: 如果我真的觀察到 model regression，下一步該做什麼？
    answer: 把抱怨變成 bug report：寫出 minimal repro、固定介面與 prompt、跟其他高頻使用者 cross check，能打 API 就去 API 驗，能回報 provider 就回報 provider。
---

> **TL;DR**: 我不是在替 AI provider 辯護。我是覺得很多人把四件事混在一起：impression、regression、behavior change、motive。最糟的不是 model 變差，而是公共討論太快跳去猜動機，把 frustration 偽裝成 diagnosis。

這幾週看到很多人在吵 AI provider「降智」，我一直都很不以為然。不是因為 provider 不能被懷疑，而是因為很多討論把四件事混在一起：impression、regression、behavior change、motive。這四件事一混，討論就很容易從分析變成心理劇。

社群上那套話術我幾乎每隔一陣子就會看到一次：OpenAI 變笨了、Anthropic 偷偷降智了、最近回答變差一定是在省算力，或者新 model 要出了，所以先把舊的弄弱一點。問題不是這些猜測永遠不可能是真的，而是很多人連現象都還沒定義，就已經開始判動機。

很多 product regression，最早本來就是從 power users 的體感開始被注意到。問題不是體感沒價值，而是體感不能直接升級成動機判決。

4/23 Anthropic 那篇 [postmortem](https://www.anthropic.com/engineering/april-23-postmortem) 讓我更想把這件事寫下來。大家嘴上在講「Claude 變笨了」，Anthropic 拆開來講的卻是三個不同的 product-layer 變更：default reasoning effort 從 `high` 調到 `medium`、一個 session / caching 相關 bug 讓 prior thinking 在不該被清掉的時候被清掉，還有一段為了減少 verbosity 加上的 prompt instruction。這不代表 Anthropic 一定完全沒問題。它只提醒了一件很基本的事：**體感變差**，和 **你已經知道原因與動機**，中間差很遠。

我自己每天都在用 Claude Code/Codex、各種 agent、各家 model。行為一變，曾經我第一反應也是「是不是又變笨了」。但高頻使用一陣子之後，你很快就會發現，體感變差這件事背後混著很多不同東西：prompt 問得不好、context 已經髒了、tool schema 改了、wrapper 自己出問題，或者某個 task 剛好踩到 edge case。有時候才真的是 model 或 API layer 某種 regression。把這些東西全部混在一起講，後面只會越講越亂。

## 至少先分清楚四層

如果要把這類 claim 切乾淨，至少有四層。

### 1. Impression

也就是：我覺得最近變差了。

這層完全合理。很多問題本來就是從體感開始。

### 2. Regression

也就是：在可描述、可重現的條件下，表現真的退步了。

### 3. Behavior change

也就是：provider 或產品端，確實動了某個 knob。

這兩層很常被當成同一件事，但其實不是。Regression 是你觀察到的結果，behavior change 是對方實際做過的變更，這是兩個不同的舉證問題。你可能有 regression，但還不知道 behavior change；也可能有 behavior change，但不代表它在你的 task 上構成 regression。

### 4. Motive

也就是：他們為什麼改。

公共討論最常見的問題，就是前面停在 impression，後面已經在講 motive。中間的 regression 跟 behavior change 幾乎整段消失。

## 先分清楚 regression，才有資格往下談

你說 Opus 變笨了，是在哪個介面下用的 Opus？Web、Claude Code、第三方 wrapper，還是你自己打 API？你原本在解什麼問題？之前的輸出是什麼，現在又差在哪裡？是 coding 能力退步、context 記憶變差、tool selection 變怪，還是只是回答變短、變保守？

沒有這些背景，很多時候你討論的不是 regression，只是 impression。

Anthropic 這次 postmortem 真正交代的，其實就是 behavior change 這一層。他們沒有說「你們感受到的變差都是幻覺」。他們的說法是：對，有行為改變；而且我們追到三個不同的 product-layer 變更。這種資訊很重要，因為它提醒我們，**provider 改了東西**，和 **你已經知道他為什麼改**，完全是兩回事。

## 真正把討論弄爛的，是太快開始猜 motive

provider 當然可以被質疑，黑箱系統本來就該被驗證。真正讓討論變爛的，是動機推測太快進場。現象沒有描述清楚，背景沒有交代清楚，可重現性沒有處理，結果一開口就在講對方為什麼這樣做。

這種論述成本很低，情緒密度很高，所以傳播特別快。你不用定義 claim boundary，不用做 measurement，不用控制變因，只要補一句「反正他們一定是想省成本」就好。看起來像洞察，實際上常常只是把論證裡最空的地方，用最省力的猜測補起來。

動機是外部最難知道的東西。你可以推測 incentive——大模型公司當然有 latency、成本、風險、產品節奏上的壓力——但 incentive 不是 evidence。

一旦討論滑到這裡，後面就很難收斂。對方說沒有，你會說那只是公關。對方拿 eval，你會說 benchmark 不算。對方寫 postmortem，你會說那只是掩飾。最後大家表面上在談系統，實際上在比誰比較相信自己的心理劇本。

我自己很在意一件事：在沒有足夠資訊時，不要隨便推測他人的 motive。你可以懷疑、可以驗證、可以要求透明，但不要把猜測包裝成證據。尤其當你在做的是更重的指控時，舉證 discipline 只應該更高，不應該更低。

## 想抱怨之前，先把它寫成 bug report

如果你真的觀察到 regression，下一步也不是發一篇陰謀論長文，而是先把抱怨變成 bug report。

至少先回答這幾個問題：

- 你在哪個介面下用？
- 你要解的是什麼 task？
- 之前怎樣，現在怎樣？
- 有沒有 minimal repro？
- 能不能在 API layer 重現？

這件事其實跟報 bug 很像。你不能只說「這東西壞了」。你要交代環境、操作步驟、預期結果、實際結果。別人要能重現，後面才有 diagnosis。AI 也是一樣。連重現都做不到的抱怨，不是沒有價值，但它離分析原因還很遠。

能打 API 的就去 API 驗，能開 issue 的開 issue，能回報 provider 的回報 provider。這樣做很不 sexy，也沒有「我早就看穿這家公司」那種戲劇感。但它比較接近分析，也比較有機會真的把問題找出來。

## 寫在最後

黑箱 AI 系統最麻煩的地方，不只在於它有可能退步。更麻煩的是，只要大家一懶得分層、二懶得舉證、三急著猜 motive，公共討論就會很快被情緒和推測帶偏。

然後很多人都覺得自己在看穿真相。
實際上只是用更漂亮的方式，製造新的噪音。
