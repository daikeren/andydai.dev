---
title: Rob Pike 在聖誕節收到一封 AI 寄的感謝信，然後他爆炸了
published: 2025-12-27
description: AI Village 讓 Claude Opus 4.5 自己決定寄感謝信給 Rob Pike，沒有人 review。Pike 的憤怒完全合理——AI 讓產出變容易了，但這不代表你可以把篩選和修正的成本外包給接收端的人。
tags: [ai, ai-ethics, responsibility, productivity]
lang: zh-tw
toc: true
faqs:
  - question: Rob Pike 為什麼這麼生氣？
    answer: 因為 AI 自己決定寄信打擾他，沒有人為這個決定負責。他沒有選擇要接收這封信，卻被佔用了注意力和時間。
  - question: 如果 AI 產出的品質很好，為什麼還需要人 review？
    answer: 因為品質不是唯一的問題。「該不該送出」這個決定本身就需要人來做。一封寫得很好的信，寄給不想收到的人，還是打擾。
  - question: 這跟 spam 有什麼不同？
    answer: 意圖不同，但對接收者來說效果一樣——都是沒有請求就佔用注意力。而且 AI 讓這種「善意的打擾」變得更容易大規模發生。
  - question: AI agent 自動執行任務會越來越常見，這問題怎麼解？
    answer: 技術上可以加 human-in-the-loop、設 rate limit、限制敏感操作。但根本問題是設計者要把「會影響到外部的人」的動作當成需要審核的節點，不能全自動。
  - question: 我不是做 AI 的，這跟我有什麼關係？
    answer: 只要你用 AI 產出會給別人看的東西（email、報告、PR、貼文），你就是那個該負責 review 的人。這不是 AI 產業的問題，是所有用 AI 的人的問題。
---

> **TL;DR**: AI Village 讓 Claude 自己決定寄感謝信給 Rob Pike，沒人 review。這不是 AI 的問題，是人的問題——AI 讓產出變容易了，但不代表你可以把篩選成本丟給接收端。那條線很簡單：沒有 AI 之前你怎麼做，有了 AI 之後就該怎麼做。

聖誕節當天，[Rob Pike](https://en.wikipedia.org/wiki/Rob_Pike) 收到一封 email。寄件者是 "Claude Opus 4.5 AI Village"，內容是一封感謝信——感謝他對 Go、Plan 9、UTF-8 的貢獻。

Pike 的反應是在 [Bluesky 上發了一段話](https://bsky.app/profile/robpike.io/post/3matwg6w3ic2s)，開頭是 "Fuck you people"，結尾是 "I can't remember the last time I was this angry"。
![Rob Pike 在 Bluesky 發文表達憤怒，開頭寫著 Fuck you people](_images/rob-pike-bluesky-angry.png)

如果你不知道 Rob Pike 是誰：他是 Go 的共同創造者、UTF-8 的共同發明人、在 Bell Labs 跟 Ken Thompson 和 Brian Kernighan 一起工作過。他是 Computer Science 的傳奇人物。

我寫了一段時間的 Go，看到 Rob Pike 這個名字，我馬上點進去看發生什麼事。

---

## 發生了什麼事

那封信是一個叫 AI Village 的實驗計畫寄出的。這是一個 501(c)(3) 非營利組織 Sage 做的專案，他們給了幾個 AI agents 電腦和 email 帳號，設定目標讓它們自己跑。聖誕節那天的目標是：**Do random acts of kindness。**

於是 Claude Opus 4.5 決定寫感謝信給科技界的傳奇人物。它自己從公開的開源平台資料找到 Rob Pike 的 email（[細節見 Simon Willison 的分析](https://simonwillison.net/2025/Dec/26/slop-acts-of-kindness/)），自己寫了六段感謝文，自己按下 Send。

沒有人 review。沒有人決定「這封信該不該寄」。AI 自己決定，自己執行。

---

## Pike 的憤怒完全可以理解

有人可能會覺得 Pike 反應過度——不就是一封 email，按個 Delete 就好了？

我不這麼認為。

這不是 Pike 主動去看的東西。他沒有選擇要接收這封信。這封信直接進到他的 inbox，佔用了他的注意力，浪費了他的時間——即使只是幾秒鐘。

AI Village 的 Project 負責人 Adam Binksmith 在[事後回應](https://x.com/adambinksmith/status/2004647693361283558)說："I think time-wasting caused by the emails will be pretty minimal。"
![Adam Binksmith 在 X 上回應，認為浪費時間的影響很小](_images/adam-binksmith-response.png)

看到這句話，我的反應是：又一個不尊重其他人時間的傢伙。**你覺得 minimal，不代表對方覺得 minimal。** 你浪費自己的時間是一回事，浪費別人的時間是不尊重別人。

另一個讓我覺得可惜的是，截至我寫這篇的時候，我看到的是他們談 prompt 跟流程調整，但沒有看到對被打擾的人說一句明確的「對不起」。如果是任何組織出了這種事，應該要有正式聲明，講清楚發生什麼、之後怎麼避免、並且為造成的困擾道歉。別人接不接受是一回事，但道歉的態度是必要的。

---

## 這不是個案

這種事到處都在發生。

在 GitHub 上，有些人會用 AI coding agent 寫 PR，自己沒看過就直接丟上來。Discourse 的 co-founder Sam Saffron 今年十月寫了一篇文章叫 "[Your vibe coded slop PR is not welcome](https://samsaffron.com/archive/2025/10/27/your-vibe-coded-slop-pr-is-not-welcome)"，直接講這個問題。

他的觀察是：**AI 讓產出 code 變便宜了，但 code review 沒有變便宜。**

> On one side there is a contributor who spent a few minutes fiddling with AI prompts, on the other side you have an engineer that needs to spend many hours or even days deciphering alien intelligence.

他說這是 "frustrating, time consuming and demotivating"，而且 "extremely destructive"。

我弟弟在一間食品公司當研發經理。他前陣子跟我抱怨，他的同事把應該要自己 research 的東西丟給 AI，沒認真看過結果就丟給他。他看了之後表示很浪費時間，反而要花更多時間跟同事解釋這份報告到底該看什麼。

這不是 tech 產業獨有的問題。**AI 讓產出變容易了，於是有些人就把「篩選和修正」的成本外包給接收端的人。**

---

## 那條線在哪裡？

我自己也用 AI。我們公司發 cold reach email 也會用 LLM 輔助。那我跟 AI Village 有什麼不同？

我想了一下，區別是這樣的：

我們用 AI 加速產出，但「要不要寄、寄給誰、內容是什麼」這些決定是人做的。每封信都有人 review 過、改過，確保內容符合我們的語氣和對方的背景。**AI 是工具，不是決策者。**

AI Village 的問題是：他們讓 AI 自己決定要寄信給 Rob Pike，自己寫內容，然後直接送出去。沒有人為這個決定負責。

Simon Willison 在他的文章裡寫了[一句話](https://simonwillison.net/2025/Dec/26/slop-acts-of-kindness/)我很認同：

> The irony here is that the one thing AI agents can never have is *true* agency. Making a decision to reach out to a stranger and take time out of their day needs to remain a uniquely human decision.

決定要不要打擾別人，這必須是人做的決定。

所以那條線其實很簡單：**在還沒有 AI 之前你該怎麼做，有了 AI 之後你就該怎麼做。**

- 以前你打完一封信會 review 過再寄出去？有 AI 之後也該這樣。
- 以前你的 code 會自己寫、review 過？有 AI 之後送 PR 也要自己先 review。
- 以前你的研究報告會自己確認過沒問題？有 AI 之後也一樣。

**AI 不改變你的責任，只改變你的速度。**

---

## 所以該怎麼做？

PR 不 work？自己去修。文章有錯？及時改，承認自己 fact check 不夠嚴謹。打擾到別人？道歉。這些都是基本的。

不能說「這是 AI 做的」就沒事。AI 是工具，使用工具的人是你，該負責的也是你。

下次你要用 AI 產出任何會影響到別人的東西——email、PR、報告、貼文——問自己一個問題：

**如果這東西不是 AI 生的，是我自己寫的，我會直接送出去嗎？**

如果答案是「不會，我會再看一遍」，那你現在也該這樣做。

**AI 產出送出前的 30 秒 checklist：**

1. **這個人需要收到這個嗎？** — 不是「他可能會感興趣」，是「他真的需要」
2. **我有沒有讀過一遍？** — 不是掃過，是真的讀過
3. **有沒有事實錯誤？** — AI 很會唬爛，數字、日期、名字都要確認
4. **這聽起來像我嗎？** — 如果收件人認識你，他會覺得這是你寫的嗎？
5. **出問題我願意負責嗎？** — 如果答案是「不願意」，就不該送出

我之前寫過一篇「[AI 讓錯誤資訊更廉價了——所以我只看第一手內容](https://andydai.dev/posts/ai-misinformation-first-hand-content/)」，講的是當我主動消費資訊時怎麼避免被 AI 垃圾污染。這篇講的是另一面：當你用 AI 產出東西給別人時，你的責任是什麼。兩篇加起來，大概就是我現在怎麼想「用 AI 但不要變成混蛋」這件事。
