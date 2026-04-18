---
title: AI 時代沒有新的工程師評價標準，只有新的 proxy 幻覺
published: 2026-04-18
description: 從 Garry Tan 講 LOC、Jensen Huang 講 token usage，到社群上炫耀 AI Agent 可以 autonomously 跑幾小時，這些看似新潮的生產力指標，本質上都在犯同一個錯：把 activity 誤當成 value。
tags: [ai-engineering, engineering-management, developer-productivity]
lang: zh-tw
abbrlink: ai-proxy-metrics
toc: true
faqs:
  - question: 為什麼 LOC、token usage、agent uptime 不是好的工程師評價標準？
    answer: 因為它們量到的大多是工作痕跡、資源消耗或流程活動，不是工程成果本身。真正重要的還是 maintainability、價值、合作品質與 judgment。
  - question: token usage 完全沒有參考價值嗎？
    answer: 不是。它可以用來看工具 adoption 或成本結構，但不能直接拿來判斷誰是好工程師，否則很容易被刷數字、被 Goodhart 化。
  - question: AI 時代的工程管理真正該看什麼？
    answer: 還是那些很老派但重要的問題：做出來的東西能不能維護、有沒有解決真問題、團隊是否更快更穩，以及工程師在不確定裡能不能做出好的 judgment。
---

> **TL;DR**: 從 [Garry Tan 講 LOC](https://x.com/garrytan/status/2045404377226285538)、[Jensen Huang 講 token usage](https://www.bnext.com.tw/article/90400/jensen-haung-engineer-token)，到 [Meta 內部追 token 排行榜](https://fc.bnext.com.tw/articles/view/4563)，再到社群上炫耀 AI Agent 可以 autonomously 跑幾小時，這些看似新潮的生產力指標，本質上都在犯同一個錯：把 activity 誤當成 value。AI 改變了速度，但沒有改變什麼叫好工程師。

這幾個月我一直看到一些很像未來的東西。

有人在算自己寫了多少 LOC。有人在講高薪工程師一年應該燒掉多少 token。也有人很興奮地展示一群 AI Agent 可以自己開會、自己 review、自己 loop 八個小時。

我每次看到都只有同一個反應：**所以最後做出了什麼？**

表面上，這些是不同話題。

但如果退一步看，它們其實只是同一個壞習慣換了三種單位：**把 activity 當成 productivity，把工作痕跡當成工作價值。**

我說的 **proxy 幻覺**，其實就是這件事：把那些容易量、看起來很客觀的代理指標，錯當成真正有價值的工程成果。

這種事其實一點都不新。以前大家迷信 LOC、工時、story point、commit 數。現在只是把單位換成 token、agent run、autonomous duration。包裝變新了，錯誤沒變。

## 先從 LOC 開始：爛 proxy 不會因為算得更精緻就突然變有意義

這波裡面最典型的例子，還是 [Garry Tan 那篇講 LOC 的文章](https://x.com/garrytan/status/2045404377226285538)。

那篇最怪的地方，不是他數字有沒有算錯，而是他前面已經承認 LOC 是爛 metric，後面卻還花很大篇幅幫它做各種 deflation，試著把它救回來。

對我來說，這整段最卡的地方很簡單：**很爛的 proxy，不會因為你算得更精緻就突然變得有意義。**

這有點像拿敲鍵盤的次數來衡量一個人有沒有認真上班，然後說：我知道這個指標很粗，但我現在敲鍵盤比五年前快十倍，所以這個 order of magnitude 還是不能忽略。

問題不是誤差大不大。問題是你量的東西，跟你想討論的價值，本來就沒有穩定關係。

同樣 1000 LOC，可能是：

- 一個關鍵功能
- 一堆 boilerplate
- 多餘的 defensive code
- agent 很熱心地展開了一堆本來不該存在的中間層

如果這些東西都可能長得一樣，那 LOC 再怎麼打折，也很難扛起「生產力真的提升了多少」這麼大的結論。

所以我不是覺得 LOC 不夠精準。我是覺得它常常根本在量錯東西。

## token usage 也是同一種錯，只是單位看起來比較新

前陣子看到 [Jensen Huang 在講](https://www.bnext.com.tw/article/90400/jensen-haung-engineer-token)，高薪工程師如果一年沒有花到足夠多的 AI token，會讓人擔心。

如果把這句話理解成「不要讓昂貴的人才缺工具」，我其實可以理解。這比較像 resource allocation 的直覺：你都已經花很多錢請人了，就不要在 compute 跟工具預算上摳到影響產出。

但從「不要讓工程師缺工具」跳到「token 燒越多的人越好」，那就是另一回事了。

而我覺得真正開始荒謬化的，是 [Meta 內部有人把 token usage 做成排行榜](https://fc.bnext.com.tw/articles/view/4563)：誰燒得多、誰是 legend，甚至還傳出有人為了刷數字讓 bot 在那邊無限 loop。

我看到這些新聞的感覺其實很一致：**你們到底是在量生產力，還是在量一種看起來很忙的東西？**

token usage 也許可以拿來看工具有沒有真的被導入 workflow。這有管理意義。

但從「有沒有在用工具」跳到「誰是好工程師」，中間差了十萬八千里。

這不是同一句話的自然延伸，而是換了一個問題。

因為 token 燒得多，可能代表很多事。可能代表他真的用 AI 放大了槓桿。也可能代表他 workflow 很亂、一直重跑、一直 loop、一直讓 model 展開低價值的中間步驟。

這些差別，不會因為 dashboard 上那串數字很大就自動消失。

更糟的是，一旦這種數字開始被排行、被獎勵、被拿來暗示誰比較進取，它就會迅速變成一種遊戲。大家開始優化那個數字，而不是優化真正的工作成果。

這不是什麼 AI 新問題，這就是很標準的 Goodhart。只是這次大家拿來拜的東西叫 token。

## Agent 可以跑多久，很多時候量到的只是 theatricality

我一直很受不了另一種 AI demo。

有人很興奮地說，他做了一個 PM Agent、一個 junior Agent、一個 QA Agent、一個 manager Agent，再加一個 senior Agent。然後這群人可以自己討論八個小時。也有人會強調他的 agent 可以 autonomously 工作整晚、工作十小時、工作二十小時，中間都不用人管。

我的第一個問題永遠都是：**所以最後做出了什麼？**

不是跑了多久。不是開了幾個 agent。不是它們互相 review 幾輪。是最後到底產出了什麼 artifact？那個東西能不能 merge？能不能 deploy？幾週後還能不能維護？是幫團隊省時間，還是只是把複雜度搬到另一個地方？

很多這類展示，最後展示的其實不是 production，而是 **theatricality**。

它們很有畫面。很像一間公司正在運作。很像一個完整的組織在忙碌。可是「很像組織在運作」跟「真的把重要事情做完」是兩件不同的事。

而且這類 demo 最後常見的失敗模式其實也很固定：角色越多，handoff 越多；handoff 越多，context drift 越嚴重。最後你會看到 spec 跟 implementation 沒對齊、QA 在 review 一個根本不會 merge 的東西、manager agent 在幫一堆不存在的進度寫摘要。看起來很熱鬧，但 artifact 是碎的，責任也是碎的。

真實世界裡，組織能力從來不在於角色齊不齊，而在於最後的 decision quality 跟 artifact quality 好不好。五個 agent 互相講幹話八個小時，不會自動變成一個好團隊。

能 autonomously 跑很久，不等於有產出。能模擬組織，不等於真的有組織能力。

## 真正煩人的不是這些 metrics 爛，而是大家又在逃避 judgment

我對這整波討論最不耐煩的地方，其實不是因為 LOC 爛、token usage 爛、agent uptime 爛。

而是很多人好像覺得：AI 時代來了，所以我們也需要一套新的工程師評價標準。

對我來說，這整個前提就錯了。

**AI 沒有改變什麼叫好工程師。**

不管有沒有 AI，我在乎的事情其實都一樣：

- 你做出來的東西穩不穩？
- 好不好維護？
- 有沒有真的產生價值？
- 你跟同事合作起來，是讓事情更順，還是讓事情更亂？
- 你在不確定裡能不能做出好的 judgment？

這些問題以前重要，現在還是重要。

AI 當然有改變很多事。速度變快了，prototype 變便宜了，展開方案也更快了。這些都是真的。

但這跟「什麼叫好工程師」其實是兩回事。

最後你還是得對 maintainability 負責，對 product value 負責，對團隊合作品質負責，對那些 tradeoff 負責。AI 只是讓你更快，不是讓你不用負責。

## 問題從來不是缺新的 metrics

組織不是不知道真正該看什麼。

大家其實都知道，評估工程師真正重要的是 judgment、maintainability、value、collaboration。問題只是這些東西太難、太慢、太需要品味，也太不能被便宜地 dashboard 化。

所以大家才會一直反覆發明 proxy，試圖把 judgment 外包給一個比較好數字化、比較像客觀、比較適合拿來做簡報的東西。

以前是 LOC。現在是 token。再來是 agent 可以跑多久。

如果你真的想知道一個 AI workflow 有沒有提高生產力，我覺得問題反而應該問得更老派一點：最後有沒有更快做出有用的東西？那個東西的品質怎麼樣？人類需要補多少洞？幾週後還能不能維護？它有沒有真的讓團隊更快、更穩、更接近目標？

我自己在 Codeer 看的也差不多就是這些，只是更具體一點。我不太在乎某個工程師今天叫了幾次 agent、燒了多少 token、讓 workflow 自己跑了多久。我比較在乎的是：這個 PR 到底能不能 merge？merge 之後會不會害別人更難接手？review 的時間是在抓真正的設計問題，還是在幫 AI 收爛尾？這次 iteration 有沒有讓我們更接近可上線的東西，而不是只多了一堆看起來很忙的中間產物？

這些問題一點都不新，也不酷，沒有 dashboard 味，也不適合拿來做社群炫耀。但它們比較接近現實。

AI 改變了速度，但沒有改變 accountability。如果一個組織最後還是靠 LOC、token、agent uptime 來判斷工程價值，那它只是把舊時代的懶惰管理換了個新名字。

而真正困難的，從來不是找到新的 metrics。

是承擔那些不能被 metrics 便宜外包的 judgment。
