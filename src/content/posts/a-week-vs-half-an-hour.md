---
title: 一週 vs 半小時：先問目的，再選工具
published: 2026-01-18
description: 同事用 AI Agent 搭配 Browser Automation 花了一週收集不到 100 筆名單，我用 Playwright 寫個 Crawler 半小時就搞定。工具會變，但「手上有新錘子，看什麼都像釘子」這個 pattern 一直在重複。
tags: [ai-engineering, developer-productivity, ai-agent]
lang: zh-tw
toc: true
---

> **TL;DR**: 同事用 AI Agent 做網頁爬蟲花了一週，我用 Playwright 寫 Crawler 半小時搞定。選工具前先問：我要達成什麼？AI Agent 擅長需要判斷的任務，不是結構固定的爬蟲工作。

最近在 review 同事的工作時，發現他花了一個禮拜在做 Lead Generation。其中一個步驟是收集 email 名單，他用了 AI Agent 搭配 Browser Automation 來處理。

我打開他的 prompt 一看，是這樣的東西：

> **⚠️ 執行態度要求（絕對不可違反）**
> - 絕對禁止停下來詢問用戶是否要繼續處理
> - 絕對禁止因為專家數量多而詢問用戶是否真的要繼續
> - 絕對禁止在部分完成任務時詢問用戶下一步該怎麼做
> - ...（後面還有十幾條）

光是「絕對禁止」就出現了十幾次——老實說你不用看完，重點是：他已經在跟 AI Agent 的本能行為搏鬥了。Agent 一直想停下來問問題，他就一直加規則防止它問。這其實已經不是在解決問題，而是在為了一個可能選錯的工具不斷補洞。

整份 prompt 分成三個階段、六千多個 tokens、十幾個步驟，還有各種 fallback 策略、驗證機制、錯誤處理。

結果呢？花了一個禮拜的時間，燒了幾十美金的 token，收集到不到 100 筆名單。而且這份 prompt 只能用這一次，下次換個網站、換個需求，又要重新寫一份。

## 半小時的解法

我後來自己試了一下。這個任務說穿了就是：進到 list view，收集每個 detail 頁面的 URL，然後進去把需要的內容抓出來。

我花了大概半小時，寫了一個簡單的 Crawler，用 [Playwright](https://playwright.dev/) 跑一跑就搞定了：

```python
# 1. 先把 list view 抓下來存成 JSON
items = await page.query_selector_all('.expert-card')
list_data = [extract_url(item) for item in items]
save_to_json(list_data)

# 2. 再根據 JSON 裡的 URL，一個一個去抓詳細資料
for url in list_data:
    await page.goto(url)
    detail = extract_detail(page)
    results.append(detail)
```

就這樣。而且這個 Crawler 也是叫 AI 幫忙寫的。以這個 case 來說，讓 AI 寫 code，比讓 AI 當 Agent 跑任務更加有效。

## 先問目的，再選工具

這件事讓我想到一個老問題：我們太容易從「我有什麼工具」出發，而不是從「我要達成什麼」出發。

同事會用 AI Agent 來做這件事，是因為他最近剛學會 Browser Automation 跟 AI Agent 的搭配，想試試看。這個心態我完全理解——學會新東西當然想用。但問題是，他沒有先問：這個任務的目的是什麼？達成這個目的，最有效的方式是什麼？

如果先從目的出發，「收集一個網站的 email 名單」這件事，寫個 Crawler 就是最直接的路。AI Agent 不是不能用，但它擅長的是需要判斷、需要理解 context 的任務，不是這種結構固定、規則明確的爬蟲工作。

## 新錘子，舊問題

這不只是 AI Agent 的問題。每次有新技術出來都一樣：NoSQL 剛紅的時候，大家什麼都想塞 NoSQL；Kubernetes 剛出的時候，三個 container 的 side project 也要上 K8s。

工具會變，但這個 pattern 一直在重複：手上有新錘子，看什麼都像釘子。

下次開始做一件事之前，先問自己：我要達成什麼？然後再問：什麼工具最適合？這個順序反過來，很容易繞遠路，就像我同事這次一樣。
