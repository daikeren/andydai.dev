---
title: 工程團隊如何用 AI 把開發時間從兩週壓到一天
published: 2025-12-13
description: 一個 6 人 startup 從傳統開發流程轉型成 AI 原生團隊的實戰經驗。核心改變是三件事：Spec 變輕、AI 先 review、Preview 環境讓 iteration 變快。
tags: [ai-engineering, startup, developer-productivity]
lang: zh-tw
toc: true
faqs:
  - question: AI coding agent 適合什麼任務？
    answer: 探索性的任務、前端 UI、third-party API 整合最適合。核心商業邏輯還是需要人審。
  - question: Junior 工程師用 AI 會有什麼問題？
    answer: 容易跟 agent 糾纏太久、不容易抓到 AI 在唬爛。需要更多 guardrail 和 review 機制。
  - question: Human review 還需要嗎？
    answer: 絕對需要。AI 提升速度，人確保品質，這個分工目前還是必要的。
  - question: Senior 工程師比較容易 adopt AI 工具嗎？
    answer: 反而不一定。Senior 一開始可能不太信任 AI，需要看到實際 demo 才會開始嘗試。
---

> **TL;DR**: 我們 6 人 startup 用三個改變把 feature 開發時間從兩週壓到一天：(1) Spec 變輕，先做再討論 (2) AI 先 review，人 focus 架構 (3) Preview 環境加速 iteration。

「你應該明天就可以把 PR 發出來了吧？」

上週我對同事說這句話的時候，突然意識到一件事：同樣的 feature，兩年前我會說「這大概要兩週」。

這不只是工具變強的問題。我們整個團隊的運作方式，從怎麼寫 spec、怎麼分工、怎麼 review code，都跟以前不一樣了。

我們是一個 6 人 startup，過去兩年從「傳統開發流程」轉型成「AI 原生團隊」。**核心改變是三件事：Spec 變輕、AI 先 review、Preview 環境讓 iteration 變快。**

## 最大的改變：Iteration 成本變低了

先講背景：我們團隊的工程師大多是 backend 和 cloud infrastructure 背景，不是傳統的前端工程師。以前要他們寫前端，code 改得動，但會蠻痛苦的。

現在不一樣了。

有了 AI Agent 的協助，他們可以快速做 iteration，把畫面做出來、debug、然後請 coding agent 依照 best practice 確認 code quality。以前可能要花一兩週慢慢摸索的前端頁面，現在一天就能有個可以 review 的版本。

這個「iteration 成本變低」帶來的連鎖反應，比我一開始想的還要深。

## 我們現在怎麼運作

### Spec-light, Explore-first

我們的 PM 不一定會寫很完整的 spec。方向有共識之後，就會讓工程師先做一個版本出來探索。

這聽起來很隨便，但邏輯是這樣的：AI Agent 最強的能力之一，就是可以很快完成各種不同版本的探索。既然修改成本變低了，我們就不需要花太多時間在討論「這個做法到底好不好」——直接做出來看。

探索會畫邊界：
- **時間上**：先給 1-2 天，做出「可以 demo 的版本」
- **範圍上**：先 cover 一條關鍵的 happy path，不碰 edge case

只要這兩個條件達成，就先用實際畫面來討論，而不是繼續在文件上拉扯。

### AI Research → AI Implementation

另一個省很多時間的地方是 research。

以前要整合一個新的 third-party API，工程師得先花時間讀文件、試 request、搞清楚 response 長什麼樣子，然後才開始寫 integration code。

現在我們會直接請 agent 先做 research。實務上就是丟官方文件連結，讓它幫你整理：支援哪些主要 endpoint、常見的錯誤碼有哪些、兩三個典型的 request/response 長什麼樣子。整理完之後，直接把這個 research 結果餵給 coding agent 做整合。

中間那個「人類讀文件」的步驟被大幅壓縮了。

### AI Code Review → Human Code Review

我們現在的 review 流程是這樣：code 寫完先讓 AI 過一輪 review，抓 bug、確認有沒有違反 best practice。AI review 的結果可以直接丟回 coding agent 修，等到人類工程師 review 的時候，code quality 已經至少 80 分了。

具體來說，我們把 AI review 當成 pre-review：先請 AI 幫忙找 bug、style 問題、漏掉的 edge case，然後把 AI 的 comment 整包丟回 agent 修完。人類 reviewer 只看最後一版，專注在「這個設計長期撐不撐得住」。

## 我們學到的事

### Senior 工程師反而比較慢 Adopt

這點有點 counter-intuitive。我們團隊都是 senior 工程師，照理說應該很快就能上手新工具。但實際上，剛開始的時候他們反而不太信任 AI coding agent 的能力，沒有很積極去探索它的邊界。

Turning point 是我在每週的 weekly meeting 不厭其煩地 demo 我用 coding agent one-shot 或 few-shot 做出的功能，然後鼓勵大家去嘗試。

現在這已經變成一種自然的文化了。大家會自然地分享「這個功能用 Cursor 的 agent 一下就做出來了」，越來越清楚哪些 task 適合讓 AI 處理。

### Senior vs Junior 的差距會變大

這是另一個 observation：在 AI-assisted 的環境下，senior 和 junior 的差距不是縮小，而是變大。

原因是 senior 比較容易判斷「什麼時候該停止讓 agent 繼續試」。如果試了兩三次還是沒結果，senior 會知道這個 task 用人比較快。Junior 可能會繼續跟 agent 糾纏。

另外，senior 也比較容易抓到 AI 在唬爛。AI 有時候會很有自信地給你錯的答案，沒有足夠經驗的話不容易發現。

### AI 提升的是 Explore 速度，不是 Quality

這點很重要：AI coding agent 帶來最大的改變是探索的速度，不是 code quality。

AI 生成的 code 不一定比人寫的好，有時候甚至更差。但它讓你可以用更低的成本嘗試不同的方向，更快發現什麼 work、什麼不 work。

這意味著 human review 還是非常關鍵。AI 讓你快，人確保你對。

## 給 Tech Lead 的一週內行動清單

如果你看完想開始動，這是我建議的順序：

1. **幫全隊把 coding agent 工具先訂起來。** Cursor、Claude Code、Codex，挑一個先用。不要讓工程師自己付錢，這是公司該出的。

2. **選一個低風險的 feature，刻意用 spec-light, explore-first 的方式做一次。** 跟 PM 約好：先給 1-2 天做 demo 版本，用實作來討論，不要先寫長 spec。

3. **把 AI review 變成必經步驟，human review 改成 focus 架構和商業邏輯。** 讓工程師習慣：AI comment 先修完，人再看。

4. **排進本季 roadmap：建 preview environment。** 這個會讓你們的 iteration 速度真正釋放出來。

## 寫在最後

回頭看這兩年，最大的 shift 不是我們用了什麼工具，而是我們對「合理的 timeline」的認知改變了。

以前說「這個要兩週」的時候，背後的假設是：工程師要讀 spec、做 research、寫 code、debug、自己 review、然後發 PR。這整個流程需要時間。

現在這個假設不成立了。很多步驟可以讓 AI 先跑一輪，人再來確認和調整。整體的 cycle time 大幅縮短。

「你應該明天就可以把 PR 發出來了吧？」

當你可以自然地說出這句話，而且真的是 reasonable expectation 的時候，你就知道你的團隊已經不一樣了。
