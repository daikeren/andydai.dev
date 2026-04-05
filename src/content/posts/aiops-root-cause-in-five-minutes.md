---
title: 2021 年我做 AIOps 做到產品被砍，2026 年 AI 五分鐘就找到 root cause
published: 2026-04-06
description: 舊 AIOps 只能看數字找 pattern，找到了也沒用。LLM + tool use 讓 AI 終於能自己翻 log、讀 code、串 context，五分鐘從 Sentry alert 追到 root cause。
tags: [ai, aiops, devops, llm, tool-use]
lang: zh-tw
abbrlink: aiops-root-cause-in-five-minutes
toc: true
---

# 2021 年我做 AIOps 做到產品被砍，2026 年 AI 五分鐘就找到 root cause

2021 年，我在前公司做了一個 AIOps 產品。

概念很漂亮：收集 Kubernetes 上所有的 metrics — CPU、memory、network、HTTP status code — 丟進 machine learning model 做 anomaly detection 跟 time series prediction。讓 AI 在問題發生之前就抓到異常 pattern。

Model 不是沒用，它真的學會了異常長什麼樣子。問題是它只會指著圖表說：「這裡怪怪的。」然後就沒了。

你盯著那個 alert，心裡想：好，memory 不正常，所以是哪段 code 的問題？哪個 service？什麼時候開始的？結果你還是得自己去翻 log、自己追 code，跟沒有這個工具的時候做一樣的事。

那個產品後來直接砍了。當時覺得時代還沒到，的確沒辦法做到真正有意義的產品。

## 舊 AIOps 的根本問題

重新想一下，incident response 其實分兩件事：**發現異常**跟**調查定因**。

舊 AIOps 做的全是第一件事。Anomaly detection、predictive alerting，都在回答 "what happened"。就算做到極致，頂多讓你早幾分鐘知道要出事了。

但真正燒時間的從來不是「發現問題」。你的 Grafana 本來就會叫。真正昂貴的是接下來那段：打開 log，翻 code，在不同 service 之間拼湊線索，搞清楚 why did it happen。

單獨做 anomaly detection，能交付的價值其實比我們當年想像的小很多。它像一個被綁在監控螢幕前的實習生 — 看到紅燈會大叫，但你問它為什麼紅的，只能搖頭。

那調查定因這件事，以前為什麼 AI 做不了？因為它沒有手。你餵它 metrics，它就只能在 metrics 裡找東西。它不會自己去查 log、讀 code，更不會把一個 API endpoint 的 error 跟某段前端邏輯連在一起。

## 2026：同一個問題，不同的結果

快轉到 2026 年。我在 Codeer 遇到一次 database connection pool 不夠用的問題。Sentry 跳了 alert。

這個案例之所以有代表性，是因為 root cause 不在表面。DB connection 不夠用可以是 N 種原因 — 你光看 metrics 根本猜不到方向。

五年前的我會怎麼做？打開 CloudWatch，手動 query 那個時間區間的 log，一條一條看前後發生什麼事，猜哪個 service 有問題，再去翻 code。運氣好半小時，運氣不好半天。

這次我丟給 Codex（OpenAI 的 coding agent）處理。

Codex 拿到 Sentry alert 裡的 timestamp 跟 API endpoint，自己去 CloudWatch 查那段時間的 structured logs，定位出前後的 API request 狀況，連是哪個 user 觸發的都找出來了。Root cause：前端有一段 code 會不斷打同一個 API，等於自己 DDoS 自己，後端又沒做 rate limit，connection pool 直接被打爆。

從 alert 到 root cause，前後大概五分鐘。Codex 還給了 fix 建議。我有沒有直接用？沒有。跟用任何 coding agent 一樣，還是要自己看過。

## 真正的轉折點

真正的差別，不只是模型更強，而是 AI 終於能自己去拿資料、做調查。

三個能力加在一起才跨過門檻：

**理解非結構化訊號。** Log 不用再靠人眼掃，AI 直接看得懂 log 裡在講什麼。error message、stack trace、request context，它都能讀。

**主動呼叫工具。** LLM 能自己去 query CloudWatch、自己讀 codebase。它有「手」了，不是只能坐在那邊等你餵資料。我們在 Codeer 自己寫了一個 agent skill，讓 Codex 可以查 AWS CloudWatch Logs。技術上不算神奇，本質上就是把查詢 CloudWatch 的能力接成 agent skill。真正重要的不是 skill 本身，而是 AI 終於能自己補齊調查需要的上下文。

**多來源推理。** 把 Sentry alert、CloudWatch logs、codebase 的資訊串在一起，推論出「前端在 DDoS 自己」這種跨層的結論。這是以前只看 metrics 的 model 根本做不到的事。

## AIOps 的定義變了

換個角度講：AIOps 的定義已經不一樣了。

過去的 observability 工具在回答 **what happened** — dashboard、alert、anomaly detection，都在這個範圍。

現在的 AI agent 開始能幫你逼近 **why did it happen** — investigate incidents、assemble evidence、propose root causes、甚至 assist remediation。

從 detect anomalies 到 investigate incidents，這才是真正的跳躍。

## 但不是每個 case 都這麼順

講白了，不是每個 incident 都能五分鐘解完。

跨多個 service 的 cascading failure、message queue 的 ordering 問題、data corruption — 這些還是可能很麻煩，AI 也不一定能直接定位。

但關鍵是：AI 已經能把第一輪調查從人手上接過去。就算最後還是需要人介入，你拿到的起點已經不一樣了。不是從零開始翻 log，而是從 AI 整理好的線索開始。

## 想走到這一步，三件事現在就可以做

**第一，把 log 寫好。** Structured logs，帶上夠多 context — timestamp、request ID、user ID、API endpoint。AI 能分析的上限取決於你 log 裡有多少資訊。垃圾進垃圾出，ML 時代是這樣，LLM 時代還是這樣。

**第二，根據你的 infrastructure 做對應的 agent skills。** Sentry 不會幫你接 AWS，CloudWatch 也不會幫你讀 codebase。你得自己串。寫一個讓 AI agent 查 log 的 skill 沒想像中難，但你得動手。

**第三，養成把 incident context 記在同一個地方的習慣。** 我們現在的做法是 incident 發生時，所有相關事件都丟進同一個 Slack thread — 誰發現的、什麼 alert、做了什麼處置、root cause 是什麼。事後拿 AI 生 postmortem 快非常多，關鍵 context 也不會漏。

下一次 incident 發生時，先問自己：你的 AI 能不能自己查 log、讀 code、接上 incident context？如果不能，你做的還只是監控，不是 AI Ops。
