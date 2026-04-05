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

Model 確實學會了。它會告訴你：「這個 memory 用量不正常。」

然後呢？

你盯著那個 alert，心裡想：好，memory 不正常，所以是哪段 code 的問題？哪個 service？什麼時候開始的？結果你還是得自己去翻 log、自己追 code，跟沒有這個工具的時候做一樣的事。

找到 pattern 又怎樣？找不到 root cause，都是白搭。

那個產品後來直接砍了。當時覺得時代還沒到，的確沒辦法做到真正有意義的產品。

---

快轉到 2026 年。

我在 Codeer 遇到一次 database connection pool 不夠用的問題。Sentry 跳了 alert。

五年前的我會怎麼做？打開 CloudWatch，手動 query 那個時間區間的 log，一條一條看前後發生什麼事，猜哪個 service 有問題，再去翻 code。運氣好半小時，運氣不好半天。

這次我丟給 Codex（OpenAI 的 coding agent）處理。

Codex 拿到 Sentry alert 裡的 timestamp 跟 API endpoint，自己去 CloudWatch 查那段時間的 structured logs，定位出前後的 API request 狀況，連是哪個 user 觸發的都找出來了。Root cause：前端有一段 code 會不斷打同一個 API，等於自己 DDoS 自己，後端又沒做 rate limit，connection pool 直接被打爆。

五分鐘。從 alert 到 root cause，五分鐘。

Codex 還給了 fix 建議。我有沒有直接用？沒有。跟用任何 coding agent 一樣，還是要自己看過。這點後面再說。

---

## 為什麼同樣叫 AIOps，2021 年做不到，2026 年可以？

不是 AI「變聰明了」。

重新想一下 2021 年做的 anomaly detection，其實比當初以為的更沒用。就算 model 能在異常發生前提早預警好了 — 然後呢？異常終究會發生，你還是得花大把時間 debug、找 root cause。預測問題跟解決問題是兩回事。anomaly detection 頂多讓你早幾分鐘知道要出事，但接下來該做的事完全沒變：開 log，翻 code，一條一條追。

ML model 抓 pattern 其實抓得很準，那不是問題。問題是它只能看你餵它的東西。你餵 metrics，它就只能在 metrics 裡找異常。它不會自己去查 log、讀 code，更不會把一個 API endpoint 的 error 跟某段前端邏輯連在一起。

就像一個被綁在監控螢幕前的實習生 — 看到紅燈會大叫，但你問它為什麼紅的，只能搖頭。

LLM 改變的是兩件事：

**第一，它能讀 natural language。** Log 不用再靠人眼掃，AI 直接看得懂 log 在講什麼。

**第二，更關鍵的：tool use。** LLM 能自己去 query CloudWatch、自己讀 codebase、自己把不同來源的資訊串起來。它有「手」了，不是只能坐在那邊等你餵資料。

我們在 Codeer 自己寫了一個 agent skill，讓 Codex 可以查 AWS CloudWatch Logs。沒什麼火箭科學，就是讓 AI 能拿到它需要的資料。但就這一步，從「只會看 metrics」變成「能自己翻 log 再對照 code」，直接跨過 2021 年那個怎麼都跨不過去的門檻。

---

## 所以 AI Ops 現在萬能了嗎？

當然不是。

Codex 給的 fix 我有沒有直接 merge？沒有，還是自己看過。跟用任何 coding agent 一樣 — AI 能幫你把範圍縮到很小、方向抓到很準，但最後的判斷還是你的事。

不過「五分鐘內從 Sentry alert 追到 root cause」這件事，已經從「做不到」變成「每天在用」了。

想走到這一步，三件事現在就可以開始做：

**第一，把 log 寫好。** Structured logs，帶上夠多 context — timestamp、request ID、user ID、API endpoint。AI 能分析的上限取決於你 log 裡有多少資訊。垃圾進垃圾出，ML 時代是這樣，LLM 時代還是這樣。

**第二，根據你的 infrastructure 做對應的 agent skills。** Sentry 不會幫你接 AWS，CloudWatch 也不會幫你讀 codebase。你得自己串。寫一個讓 AI agent 查 log 的 skill 沒想像中難，但你得動手。

**第三，養成把 incident context 記在同一個地方的習慣。** 我們現在的做法是 incident 發生時，所有相關事件都丟進同一個 Slack thread — 誰發現的、什麼 alert、做了什麼處置、root cause 是什麼。事後拿 AI 生 postmortem 快非常多，關鍵 context 也不會漏。

馬上動手試看看，當 incident 發生的時候別再傻傻的去查 log 了。
