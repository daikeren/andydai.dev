---
title: 我砍過一個 AIOps 產品，五年後 AI 五分鐘就做到之前做不到的事
published: 2026-04-06
description: 舊 AIOps 只能看數字找 pattern，找到了也沒用。LLM + tool use 讓 AI 終於能自己翻 log、讀 code、串 context，五分鐘從 Sentry alert 追到 root cause。
tags: [ai, aiops, devops, llm, tool-use]
lang: zh-tw
abbrlink: aiops-root-cause-in-five-minutes
toc: true
faqs:
  - question: AIOps 跟傳統監控工具有什麼不同？
    answer: 傳統監控工具（Grafana、CloudWatch）做的是 detection — 告訴你哪裡異常。AIOps 加上 LLM 和 tool use 後，能進一步做 investigation — 自己查 log、讀 code、串 context，把 root cause 的範圍縮到能處理。
  - question: AI 做 incident response 需要什麼前置準備？
    answer: 三件事：(1) 寫好 structured logs，帶上 timestamp、request ID、user ID 等 context；(2) 替你的 infrastructure 做 agent skills，讓 AI 能查 CloudWatch、讀 codebase；(3) 養成把 incident context 集中記錄的習慣。
  - question: LLM 做 root cause analysis 的準確度夠嗎？
    answer: 不是每個 case 都能五分鐘解完。跨多個 service 的 cascading failure、message queue ordering 問題仍然困難。但即使 AI 只完成第一輪調查，on-call 工程師的起點就從零開始翻 log，變成從整理好的線索開始。
  - question: Tool use 對 AIOps 為什麼這麼關鍵？
    answer: Tool use 讓 LLM 從「只能分析你餵的資料」變成「自己去拿需要的資料」。它能主動 query CloudWatch、讀 codebase、串接 Sentry alert，完成從告警到 root cause 的完整調查迴路。
---

# 我砍過一個 AIOps 產品，五年後 AI 五分鐘就做到之前做不到的事

> **TL;DR**: 2021 年的 AIOps 只會做 anomaly detection，發現異常後你還是得自己翻 log 追 code。2026 年 LLM + tool use 讓 AI 能自己跑完調查迴路 — 讀 alert、查 log、翻 code、串 context — 五分鐘從 Sentry alert 追到 root cause。

2021 年，我在前公司做了一個 AIOps 產品。

概念很漂亮：收集 Kubernetes 上所有的 metrics — CPU、memory、network、HTTP status code — 丟進 machine learning model 做 anomaly detection 跟 time series prediction。讓 AI 在問題發生之前就抓到異常 pattern。

Model 不是沒用，它真的學會了異常長什麼樣子。問題是它只會指著圖表說：「這裡怪怪的。」然後就沒了。

你盯著那個 alert，心裡想：好，memory 不正常，所以是哪段 code 的問題？哪個 service？什麼時候開始的？結果你還是得自己去翻 log、自己追 code，跟沒有這個工具的時候做一樣的事。

那個產品後來直接砍了。當時覺得時代還沒到，的確沒辦法做到真正有意義的產品。加上我們主產品線有更重要的事情要做，就沒有多餘的心力放上面。

## 舊 AIOps 的根本問題

Incident response 其實就兩件事：**發現異常**跟**調查定因**。

舊 AIOps 做的全是第一件事。Anomaly detection、predictive alerting，都在回答 "what happened"。做到極致，頂多讓你早幾分鐘知道要出事。

但真正燒時間的從來不是發現問題。你的 Grafana 本來就會叫。真正昂貴的是接下來那段：打開 log，翻 code，在不同 service 之間拼湊線索，搞清楚 why did it happen。

回頭看，單獨做 anomaly detection，解的是最容易被誤以為重要、其實最不稀缺的那一段。它像一個被綁在監控螢幕前的實習生 — 看到紅燈會大叫，但你問它為什麼紅的，只能搖頭。

調查定因這件事，以前 AI 做不了，因為它沒有手。你餵它 metrics，它就只能在 metrics 裡找東西。它不會自己查 log、讀 code，更不會把一個 API endpoint 的 error 跟某段前端邏輯連在一起。

## 2026：同一個問題，不同的結果

快轉到 2026 年。我在 [Codeer](https://www.codeer.ai) 遇到一次 database connection pool 不夠用的問題。Sentry 跳了 alert。

這個案例有代表性，因為 root cause 不在表面。DB connection 不夠用可以是 N 種原因 — 光看 metrics 根本猜不到方向。

五年前遇到這種事，我大概就是打開 CloudWatch，手動 query 那個時間區間的 log，一條一條看前後發生什麼事，猜哪個 service 有問題，再去翻 code。運氣好半小時，運氣不好半天。

這次我丟給 [Codex](https://openai.com/codex/)（OpenAI 的 coding agent）處理。

Codex 拿到 Sentry alert 裡的 timestamp 跟 API endpoint，自己去 CloudWatch 查那段時間的 structured logs，定位出前後的 API request 狀況，連是哪個 user 觸發的都找出來了。Root cause：前端有一段 code 會不斷打同一個 API，等於自己 DDoS 自己，後端又沒做 rate limit，connection pool 直接被打爆。

從 alert 到 root cause，前後大概五分鐘。Codex 還給了 fix 建議。我有沒有直接用？沒有。跟用任何 coding agent 一樣，還是要自己看過。

## 真正的轉折點

真正的差別，不只是模型更強，而是 AI 第一次能自己完成調查迴路：讀告警、查 log、翻 code、補 context、提出假設。

三個能力加在一起才跨過門檻：

**理解非結構化訊號。** AI 不只是在 log 裡做 keyword match，而是真的能把 error message、stack trace、request context 當成線索讀。

**主動呼叫工具。** LLM 能自己去 query CloudWatch、自己讀 codebase。它有「手」了，不是只能坐在那邊等你餵資料。我們在 Codeer 自己寫了一個 agent skill，讓 Codex 可以查 AWS CloudWatch Logs。技術上不算神奇，就是把查詢 CloudWatch 的能力接成 agent skill。真正重要的不是 skill 本身，而是 AI 終於能自己補齊調查需要的上下文。這也是我們在[打造 AI 原生工程團隊](/posts/ai-native-engineering-team/)時學到的核心觀念 — 不是把 AI 當輔助工具，而是從流程設計就讓 AI 能參與。

**多來源推理。** 它不是只看單一訊號，而是把 Sentry alert、CloudWatch logs、codebase 串起來，才推得出「前端其實在 DDoS 自己」這種跨層結論。以前只看 metrics 的 model 根本做不到。

## AIOps 的定義變了

AIOps 過去一直停在 detection。現在第一次開始碰 investigation。

前者是告訴你哪裡怪，後者是幫你把 root cause 的範圍縮到能處理。

這才是真正的跳躍。

## 但不是每個 case 都這麼順

講白了，不是每個 incident 都能五分鐘解完。

跨多個 service 的 cascading failure、message queue 的 ordering 問題、data corruption、使用者的網路、web client — 這些還是可能很麻煩，AI 也不一定能直接定位。

但就算 AI 只做到把第一輪調查自動化，價值也已經很大了，因為 on-call 最耗的本來就不是修，而是先把問題縮到能修。就算最後還是需要人介入，你拿到的起點不一樣了。不是從零開始翻 log，而是從 AI 整理好的線索開始。

## 想走到這一步，三件事現在就可以做

**第一，把 log 寫好。** Structured logs，帶上夠多 context — timestamp、request ID、user ID、API endpoint。AI 能分析的上限取決於你 log 裡有多少資訊。垃圾進垃圾出，ML 時代是這樣，LLM 時代還是這樣。

**第二，根據你的 infrastructure 做對應的 agent skills。** Sentry 不會幫你接 AWS，CloudWatch 也不會幫你讀 codebase。你得自己串。寫一個讓 AI agent 查 log 的 skill 沒想像中難，但[你得動手](/posts/a-week-vs-half-an-hour/)。

**第三，養成把 incident context 記在同一個地方的習慣。** 我們現在的做法是 incident 發生時，所有相關事件都丟進同一個 Slack thread — 誰發現的、什麼 alert、做了什麼處置、root cause 是什麼。事後拿 AI 生 postmortem 快非常多，關鍵 context 也不會漏。

更大的改變不是少看幾分鐘 log，而是 incident handling 開始從 debug 高手手工藝，變成可以被系統化、被複用的流程。

下一次 incident 發生時，先不要只想著把 dashboard 上面加上更多的 log、metrics。先問自己：你的 AI 能不能自己查 log、讀 code、接上 incident context，先替你做完第一輪調查？

如果不能，你優化的還是監控；如果可以，才開始接近真正有用的 AIOps。[別讓「導入 AI」變成目的本身](/posts/dont-make-ai-adoption-the-goal/) — 重點永遠是解決問題，不是用了什麼工具。
