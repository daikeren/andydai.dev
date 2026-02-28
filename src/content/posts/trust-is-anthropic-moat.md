---
title: Trust 是 Anthropic 的 Moat——直到你開始驗證
published: 2026-02-28
description: Anthropic 橫跨三大雲、主打 trust 作為護城河，但從訓練資料爭議、選擇性的 safety narrative、到 Pentagon 對峙事件，這個 trust 經得起檢驗嗎？
tags: [anthropic, ai-safety, ai-industry, trust, business-strategy]
lang: zh-tw
abbrlink: trust-is-anthropic-moat
toc: true
---

> **TL;DR**: Anthropic 是唯一橫跨三大雲的獨立 AI 公司，靠 trust 當護城河。但從訓練資料侵權和解、選擇性使用 safety narrative 打擊競爭對手、到 Pentagon 對峙事件被 Sam Altman 收割成果——公司層面的 honesty 和模型層面的 honesty 是兩件完全不同的事。

# Trust 是 Anthropic 的 Moat——直到你開始驗證

2026 年 2 月 27 號， [OpenAI 宣布了 \$110B 的融資](https://techcrunch.com/2026/02/27/openai-raises-110b-in-one-of-the-largest-private-funding-rounds-in-history/)。這個數字本身已經夠誇張了，但真正讓我停下來的是其中一個細節：Amazon 出了 \$50B。

Amazon 投 OpenAI，意味著 AWS 成為 OpenAI enterprise 平台 Frontier 的 exclusive third-party cloud provider。我做了一下 AI startup 的 CTO 會做的事——打開腦中的雲平台版圖，重新排一次：

AWS 上現在有 OpenAI、Anthropic、還有 Amazon 自家的 Nova。Google Cloud 有 Gemini 和 Anthropic。Azure 有 OpenAI 和 Anthropic。

然後我注意到一件事：**Anthropic 是唯一一家同時橫跨三大雲的獨立 AI 公司。**

這個位置很獨特。OpenAI 過去跟 Microsoft 綁得很深，但這輪融資 Microsoft 沒有參與——OpenAI 顯然在降低對單一雲的依賴。而 Anthropic 從一開始就走了多雲策略。

但獨特不代表安全。AI model 的能力正在快速 commoditize，差異化的窗口從一年多縮短到幾個月。如果最後決定勝負的是 distribution——誰能把 AI 塞到最多人手上——那 Google 有 Android、Chrome、Search、Workspace，加起來是幾十億用戶的 surface area。Google 不需要最好的 model，只需要「夠好」，distribution 就能碾壓。

那 Anthropic 靠什麼？

---

這個問題的答案，是我在一個有點 ironic 的場景下得到的。

我用 Claude——Anthropic 自己的模型——問了這個問題。我問它 Anthropic 在 enterprise 市場靠什麼跟 Google Workspace + Gemini 競爭。它給了我一個很明確的答案：**trust**。

Anthropic 的 moat 是信任。金融、醫療、政府這些高監管行業，需要的不只是好的 model，還需要 data privacy、compliance、predictability。Google 的廣告商業模式在這些客戶眼裡反而是 trust 的減分項。Anthropic 打的不是每個員工都有 AI copilot 的 horizontal play，而是開發團隊用它的 model 建構 AI 應用的 platform play。

聽起來很合理。但我當時的反應是——trust？那我們來看看這個 trust 經不經得起檢驗。

用 Anthropic 自己的模型來 challenge Anthropic 的道德定位，這件事本身就夠有趣了。更有趣的是，接下來我挖出來的東西。

---

## 高舉道德大旗的那隻手

先從最近的事開始。2026 年 2 月 23 號，Anthropic [發了一篇 blog post](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks)，指控三家中國公司——DeepSeek、Moonshot AI、MiniMax——透過大量假帳號對 Claude 進行 model distillation。數字很驚人：24,000 個假帳號，超過 1,600 萬次交互。DeepSeek 針對推理能力和政治敏感查詢的安全替代方案，Moonshot AI 針對 agentic reasoning 和 coding，MiniMax 在 Anthropic 發布新模型後 24 小時內就轉移了近半流量。

這個指控本身可能是成立的。但問題是，幾乎同一時間，[X 上多人發現一件事](https://x.com/stevibe/status/2026227392076018101)：用中文問 Claude Sonnet 4.6「你是什麼模型？」，它會回答「我是 DeepSeek」。

一個指控別人偷自己東西的公司，它自己的模型卻把自己認成對方。這暗示了什麼？Anthropic 的訓練資料裡很可能包含了 DeepSeek 的 output。[X 上有人說得很直接](https://x.com/OopsGuess/status/2026375711767015856)：「在華盛頓開始大喊中國偷竊之前，也許先問問為什麼一個美國模型會把自己認成中國模型。」

這不是 Anthropic 第一次在訓練資料的正當性上出問題。2025 年，他們[被數千名作者指控從 shadow library 大量下載書籍來訓練模型，最終以 \$15 億和解](https://www.npr.org/2025/09/05/nx-s1-5529404/anthropic-settlement-authors-copyright-ai)——大約 50 萬本書，每本 \$3,000。還有 scraping Reddit 內容的爭議。

這裡有個值得注意的法律層次差異：Anthropic 從盜版網站下載受版權保護的書籍來訓練模型，這是法院認定的侵權行為——所以才有 \$15 億的和解。而中國公司做的 distillation，充其量是違反 Terms of Service，法律上仍在灰色地帶。一個已經被判定違法的公司，指控別人做的事情法律上還沒定論——這個道德高地站得住嗎？

---

## 當 Safety 變成武器

如果只是訓練資料的問題，你可以說「整個產業都這樣，Anthropic 不是特例」。但 Anthropic 的行為模式不止於此。

2025 年 6 月，Anthropic [在不到五天通知的情況下，切斷了 Windsurf 幾乎所有 Claude 的 first-party access](https://techcrunch.com/2025/06/03/windsurf-says-anthropic-is-limiting-its-direct-access-to-claude-ai-models/)。原因？OpenAI 可能要收購 Windsurf。Anthropic 共同創辦人 Jared Kaplan [直接說](https://techcrunch.com/2025/06/05/anthropic-co-founder-on-cutting-access-to-windsurf-it-would-be-odd-for-us-to-sell-claude-to-openai/)：「把 Claude 賣給 OpenAI 很奇怪。」

2025 年 8 月，Anthropic [撤銷了 OpenAI 的 API 存取權限](https://techcrunch.com/2025/08/02/anthropic-cuts-off-openais-access-to-its-claude-models/)，因為 OpenAI 的工程師在 GPT-5 發布前使用 Claude 做 coding。Anthropic 說這違反 Terms of Service。OpenAI 的回應很到位：「這是業界標準做法，我們的 API 仍然對 Anthropic 開放。」

2026 年 1 月，[同樣的事發生在 xAI 身上](https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses/)。xAI 的工程師透過 Cursor IDE 使用 Claude 加速內部開發，被 Anthropic 切斷。xAI 共同創辦人 Tony Wu [確認](https://sherwood.news/tech/report-anthropic-cuts-off-xais-access-to-its-models-for-coding/)，這是 Anthropic 對所有主要競爭對手實施的新政策。

三次切斷，一個 pattern。

有趣的是對比：對美國競爭對手，Anthropic 很誠實——就是說 ToS violation、競爭考量。但對中國公司，同樣是競爭驅動的行為，卻被包裝成安全議題和國家級威脅。這不是 safety，這是 safety narrative 的選擇性使用。

---

## Dario 和他的世界觀

要理解 Anthropic 為什麼會這樣，你需要理解 Dario Amodei。

2021 年，Dario 帶著核心團隊從 OpenAI 出走，創立 Anthropic。出走的原因就是 AI safety——他們認為 OpenAI 不夠認真對待這件事。這個 origin story 是真的，我不懷疑他們當時的動機。

但 Dario 本人有一套非常強烈的對抗性世界觀。他主張「entente」策略——民主國家聯盟用 AI 對中國取得決定性優勢。他認為中國共產黨是最大威脅，否則人類將面臨「全球極權獨裁」。他花 40% 的時間在維護公司文化，在 Slack 上寫長篇論文式辯論，員工也用同樣長篇的文章回覆。每月有 vision quest。

這裡面有幾個邪教式文化的特徵：charismatic leader 不斷輸出世界觀，成員圍繞形成共識。Mission 框架有宗教性——不是做好產品，是拯救人類免於 AI 存亡威脅。清晰的 in-group / out-group 劃分。

然後你回頭看 Anthropic 缺乏 distribution 這件事。Google 有幾十億用戶的 surface area，Microsoft 有 Office 和 Azure，OpenAI 有 ChatGPT 的消費者心智。Anthropic 什麼都沒有。沒有分發優勢的時候，你唯一能做的就是死守 model 本身的價值——包括切斷任何可能削弱這個價值的人。

激進的商業行為 = adversarial 的 founder + 缺乏 distribution + safety 包裝的便利性。

---

## 信仰的產物和信仰的崩塌

而且這個文化不只影響公司行為——它直接灌進了模型裡。你有沒有注意到 Claude 跟其他 AI 模型相比，有一種特別明顯的「人格」？那種過度禮貌、過度謹慎、動不動就加 caveat 和 nuance 的風格，就是 constitutional AI 和 RLHF 把公司價值觀寫進模型的結果。某種程度上，Claude 就是 Anthropic 邪教文化的布道工具——每一次對話都在傳遞他們認為 AI 應該怎麼跟人類互動的世界觀。這一點，等下會變得很重要。

還有一個關鍵轉折。Anthropic 最近更新了他們的 Responsible Scaling Policy，放棄了原本「達到一定能力水平後除非能保證安全否則不繼續訓練」的承諾。原因是競爭壓力和缺乏監管。

當 mission 跟商業現實衝突的時候，mission 讓步了。真正的邪教不會在信仰上妥協，但公司會。Anthropic 是一家非常善於利用邪教式文化動員的商業公司，而不是真正的信仰組織。

---

## 但是，他們的模型確實不 bullshit

這裡要轉一個彎，因為事情沒有那麼簡單。

有個叫 [Bullshit Benchmark](https://petergpt.github.io/bullshit-benchmark/viewer/index.html) 的測試，專門測 AI 模型能不能偵測 broken premises、能不能拒絕回答無意義的問題。截至 2026 年 2 月，排行榜前八名全部是 Anthropic 的模型。第一名 Claude Sonnet 4.6 對無意義問題的拒絕率 95%，而 Gemini 3 Pro 只有 31%。

這不是偶然。這是 Anthropic 的 constitutional AI 和 alignment 方法論的直接產物。不管你怎麼看這家公司的商業行為，他們在「模型產出」這個維度上——讓 AI 誠實、不過度自信、願意承認不確定性——確實做得比同行好。

一個矛盾浮現了：**公司層面的 honesty 和模型層面的 honesty 是兩件完全不同的事。**

產出好的公司不一定是好的公司。或者換個說法——邪教式的文化、高壓封閉的環境，確實能在某些維度上產出極致的品質。代價是在其他維度上的妥協。

---

## Pentagon：原則的代價

如果 Bullshit Benchmark 是第一層反差，Pentagon 事件就是第二層。

背景：Anthropic 跟 Pentagon 有一份 \$200M 的合約，是第一家被批准在 classified networks 上部署 AI 的公司。Anthropic 堅持兩條紅線——不用於大規模國內監控、不用於全自主武器。Pentagon 要求 Anthropic 開放「all lawful use」，Anthropic 拒絕了。

接下來的升級很快。2 月 24 號，Defense Secretary Pete Hegseth 跟 Dario 會面，威脅動用 Defense Production Act——一個韓戰時代的法律——強制徵用，或者把 Anthropic 列為「supply chain risk」。這個標籤通常是保留給中俄公司的。Pentagon CTO Emil Michael 公開罵 Amodei 是「liar and has a God-complex」。

2 月 27 號，設下最後通牒：下午 5:01 PM ET 前回應，否則後果自負。

Dario 在公開聲明裡指出了一個荒謬的矛盾：政府同時威脅把 Anthropic 列為 supply chain risk（安全威脅），又要動用 DPA 強制徵用 Claude（國安必需品）。他的原話是：「one labels us a security risk; the other labels Claude as essential to national security.」——你到底覺得我是威脅還是必需品？

而且根據 [Axios 的報導](https://www.axios.com/2026/02/27/anthropic-pentagon-supply-chain-risk-claude)，Hegseth 在 X 上發文宣布 supply chain risk 的同一時間，Pentagon 的 undersecretary Emil Michael 還在電話上跟 Anthropic 談 deal。那個 deal 的內容是什麼？要求 Anthropic 允許收集美國人的 geolocation、網頁瀏覽紀錄、從 data broker 購買的個人金融資料。這不是抽象的「lawful use」——這就是 mass surveillance 的具體內容。

Dario 發了公開聲明：「These threats do not change our position: we cannot in good conscience accede to their request.」他的理由是：第一，目前 AI 模型不夠可靠，用於全自主武器會危及美軍和平民；第二，大規模國內監控違反基本權利。

然後 [Trump 直接介入](https://www.cnbc.com/2026/02/27/trump-anthropic-ai-pentagon.html)。在 Truth Social 發文痛罵 Anthropic 是「Leftwing nut jobs」，下令所有聯邦機構停用 Anthropic 技術，威脅動用「Full Power of the Presidency」追究民事和刑事責任。

如果故事在這裡結束，Anthropic 看起來像是為原則付出代價的英雄。

但故事沒有在這裡結束。

---

## Sam Altman 的三步收割

2 月 27 號早上，Sam Altman [上 CNBC](https://www.cnbc.com/2026/02/27/trump-anthropic-ai-pentagon.html)，對 Anthropic 表示支持。他說：「For all the differences I have with Anthropic, I mostly trust them as a company, and I think they really do care about safety.」他還說 OpenAI 跟 Anthropic 分享同樣的紅線。

2 月 27 號傍晚，Altman 發了內部備忘錄，說想「help de-escalate things」，正在跟 Pentagon 談判。

2 月 27 號晚間，[OpenAI 宣布跟 Department of War 達成 classified network 部署協議](https://www.npr.org/2026/02/27/nx-s1-5729118/trump-anthropic-pentagon-openai-ai-weapons-ban)。拿到的條件跟 Anthropic 堅持的完全一樣：禁止 mass surveillance、禁止 autonomous weapons。

同一個 Pentagon——對 Anthropic 是威脅和最後通牒，對 OpenAI 是「displayed a deep respect for safety and a desire to partner」。

Altman 的操作很漂亮。先 validate Anthropic 的立場——「we share their red lines」。再展示自己能做到 Anthropic 做不到的——跟政府達成協議。最後呼籲把同樣條件給所有公司，站上 moral high ground。同時看起來像 peacemaker、industry leader、比 Anthropic 更有能力跟政府合作的人。

Anthropic 花了數月硬碰硬，被 Trump 公開羞辱、被威脅 DPA、被列 supply chain risk。Altman 在最後一刻進場，用外交手段拿到了同樣的 deal。

**最堅持原則的公司付出了最大代價。最 pragmatic 的公司收割了成果。**

---

## 所以 Principles 到底是什麼？

我不想揣測 Anthropic 或 Altman 的動機。連他們自己可能都未必 100% 清楚內心深處的動機。我只能從行為來看。

Anthropic 在 AI safety 上的 origin story 是真的——他們從 OpenAI 出走就是為了這個。Dario 的 Pentagon 聲明讀起來是真誠的。他們的模型確實是最不會 bullshit 用戶的。

但他們後續的行為也是事實。訓練資料的正當性經不起檢驗。Safety narrative 被選擇性地用作競爭武器。Responsible Scaling Policy 在商業壓力下讓步。對不同對手用不同標準。

他們不是不道德的公司。他們是「相對道德」的公司——比同行做得好，但離他們自己宣稱的標準有明顯差距。問題在於，當你站上了道德制高點，任何落差都會被放大。

回到開頭的問題：Anthropic 的 moat 是 trust。但 trust 不是你宣稱的，是別人觀察你的行為後給你的。

這不只是 Anthropic 的故事。整個 AI 產業都在面對同一個問題——principles 到底是信仰還是 packaging？當原則跟商業利益永遠指向同一個方向的時候，外界很難不質疑。當原則真的要付出代價的時候，有多少公司會選擇付？

Anthropic 在 Pentagon 事件上選擇了付代價。但 Altman 用 pragmatism 拿到了同樣的結果。

這大概就是 2026 年 AI 產業最誠實的一張快照：最不會 bullshit 的模型來自一家充滿矛盾的公司，而最堅持原則的立場被最 pragmatic 的人收割了成果。
