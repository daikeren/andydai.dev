---
title: Coding agent 最先改變的，是那些以前不值得做的軟體
published: 2026-07-22
description: 我用不熟的 Swift 和一台 PreSonus ATOM，讓 Codex 幫我做出每天都在用的實體控制器。這個 side project 證明了 personal software 的門檻正在下降，也提醒我 production engineering 沒有因此消失。
tags: [ai-engineering, developer-productivity, coding-agent, side-project]
lang: zh-tw
abbrlink: coding-agent-personal-software
toc: true
draft: true
---

> **TL;DR**: 我原本只是想知道，家裡那台 PreSonus ATOM 能不能拿來控制 Codex。Swift 我只看得懂一點，macOS app 也沒什麼經驗，實作幾乎都是 Codex 做，我比較像 PO + QA。現在這台東西我在家還是每天用，但我只確定它在我的電腦上能跑。這是 personal software，不是 production-ready product。

第一次看到 ATOM 的 pad 跟著 Codex task 閃爍時，我正在用 Codex 開發這個 controller。螢幕上的 task 正在 build 控制器；桌上的控制器又把同一個 task 的狀態顯示回來。那一刻我第一個想法就是：Codex 真的很厲害。

但我一開始對 RGB 能不能控制其實心裡沒底。ATOM 是 MIDI controller，Studio One 和 Ableton 可以控制它的燈，不代表我知道一般程式該送什麼 bytes，也不代表 Codex Desktop 願意把 task state 給外部程式。

如果是在 pre-LLM 時代，我大概會先翻硬體 spec、找 community discussion、讀別人的 driver，再研究 CoreMIDI 和 Codex local state。光確認方向可能就會花掉一整天。對一個只給自己用的 side project，這個成本就足以讓我想想算了。

Personal software 只需要對自己負責，stakes 最低。Coding agent 會最早讓這類軟體變得值得做。

這次 survey、Swift implementation、tests 和 diagnosis 幾乎都是 Codex 做；我主要負責按硬體、看畫面、貼 log，然後告訴它有沒有真的 work。

## 我其實不會寫這個 app

我看到 Work Louder 做的 [Codex Micro](https://worklouder.cc/codex-micro)，想到家裡已經有一台 PreSonus ATOM，就問 Codex：

> 我有一台 MPC（ATOM PreSonus），可以取代 Work Louder 做的 Codex Micro 嗎？

我過去開發 macOS app 的經驗很少，Swift 只是大概看得懂，不算會寫。我對 ATOM 的整合其實也不算有底，只知道可以做得到，不過沒什麼方向。

而且這是 side project，不是要上 production 給其他真實客戶用的東西。只要確定我可以用就好。

所以一開始先分兩階段。第一階段做 MIDI controls：切換 task、建立 task、送出 prompt、dictation 和 scroll。第二階段再讀 task state，讓 pads 顯示 running、complete、needs input 和 error。

## 我的角色比較像 PO + QA

實作開始後，我照 Codex 的指示，從左上角開始按完 16 顆 pads，再按 buttons、轉四顆 knobs。它在 terminal 監聽 raw MIDI，把實體位置對到 MIDI note 和 CC value。

它連 layout 都不是一次猜對。我拿實機照片糾正它：

> Preset +/- Focus 是同一個按鈕。

後來又確認 `Shift` 和右側小圓形 `Setup` 雖然看得到，卻不送一般 MIDI message。最後還是要以實機 capture 為準。

它負責查 protocol、寫 Swift、跑 tests。我負責按硬體、看畫面，然後回「有改善」或「沒改善」。我的角色比較像 PO + QA。

後面真正花時間的，都是 Codex 說做完後，我一用才出現的問題。有些在硬體、有些在 app，還有一個根本不算 bug。

## Tests 都過了，實機還是會壞

RGB 完成時，67 個 automated tests 全部通過，release build 成功，Codex state 和 ATOM 也都顯示 connected。但我一按 pad，task 完全沒有切換：

> hmm... 切 task 好像不能 work？Pad 1～6 沒切到對應的 pinned thread，Nav Up／Down 倒是可以。

掛上 raw MIDI monitor 才發現，ATOM 進入 Native RGB mode 後，pads 的 MIDI channel 也跟著從 10 改成 1。原本的 hardware map 只接受 channel 10，所以 RGB 一開，pad input 就全部被 filter 丟掉。Navigation buttons 原本就是 channel-1 CC，才會正常。

另一個例子是 Knob 2。Terminal 一直印：

```text
knob2 -> content.scrollDown trigger dispatched
knob2 -> content.scrollUp trigger dispatched
```

但畫面完全沒有動。

> 看 log 有 scroll up／down event，但是 content 沒有捲動。

後來才確認，`CGEvent.postToPid` 成功不代表 Electron 真的消費了 scroll event。最後 scroll 必須在 Codex 位於 foreground 時，將 system scroll event 定位到 transcript 或 sidebar；Codex 在背景時就直接不做，免得捲到別的 app。

`dispatched` 只能證明程式走過 dispatch path。這兩次如果沒有實機，我們都會以為已經做完了。

## 有些功能就是做不到

Push-to-talk 是整個過程裡試最多次的功能。ATOM 的 Record button 在按下和放開時都有即時送出 MIDI event，controller log 也會顯示 `holdEnd dispatched`，但放開後 dictation 就是不會像實體鍵盤一樣立即停止。

Codex 改一次，我就測一次。它試過 modifier lifecycle、兩次 toggle、完整 keyboard chord、重新啟動 Codex，再叫我用鍵盤做 A/B。好幾輪我的回答都一樣：

> 沒改善。

> 鍵盤是即時的。

> Toggle 鍵盤是即時的。

> 目前的現象看起來是按一下 toggle 可以，但是 push-to-talk 好像不行。

最後才確認，原生 Codex Micro 不是模擬 keyboard shortcut，而是使用 Codex Desktop 內部的 start／stop events。外部程式沒有穩定 API 可以走同一條路。

所以目前沒有真正的 push-to-talk。Record 最後做成 press-only dictation toggle：按一次開始，再按一次停止。Release、focus loss、disconnect 和 shutdown 都不補送 toggle。

## 綠燈 30 秒，產品語意還是不對

Task 完成後很快就會從 `active` 回到 `idle`。第一版為了避免綠燈只閃一下，加了 30 秒 latch。行為很穩定，tests 也都有過，但我看著燈號還是覺得不合理：

> 完成後綠色維持 30 秒這件事情是合理的設計嗎？感覺應該要一直維持綠色？Codex Micro 是怎樣？

如果綠色表示「task 完成，正在等我看」，我還沒看，它為什麼 30 秒後就不再提醒？

回頭查 Codex Micro 才發現，綠色代表的是 `unread`，不是 `recently completed`。Task 完成但還沒查看時就一直維持綠色；我真的打開那個 task，才回到 idle。後來 Codex 找到 Desktop 保存的 unread state，把 30 秒 timer 換掉。

這也是我說自己比較像 PO 的原因。Code 沒壞，產品行為還是可能不對。

這幾個問題有個共同點：只看 code 和 tests 看不到。你得真的接上硬體、看 Codex 畫面，再判斷燈號對使用者代表什麼。Production engineering 很大一部分就在守這條線。

## Personal software 跟 production-ready product 是兩回事

Coding agent 最大的幫助，應該會是讓大家更容易 build 出「自己使用的 application」。Codex ATOM 就是這種東西：使用者是我，電腦環境是我的，壞掉時我知道怎麼繞，重開 process 也可以接受。

不過我肯定不會認為這是 production ready 的東西。因為目前這版我只確定在我的電腦上面能跑，也許換到其他人的電腦，環境不同就不能跑了。不同的 Accessibility permission、Codex Desktop version 或 MIDI firmware，都可能讓它壞掉。

真實客戶不會陪你在 terminal 裡看 raw MIDI，也不會接受功能壞掉後由作者本人重開 process 就算修復。所以我的判斷還是：coding agent 能幫助大家建立自己用的東西，但是 production-ready app 還是需要專門的 developer 介入。

這就是我對「因為 coding agent 的關係，SaaS is dead，公司都會自建」這種說法嗤之以鼻的原因。這個說法把「在自己的電腦上能跑」當成「可以交給陌生客戶長期使用」，前面這幾個問題就是中間被省略的 production engineering。

## 它現在還在我的桌上

這個 side project 實際上對我還真的蠻有幫助的。最常用的就是 pinned task 切換。因為現在我會把每天主要要工作的 threads 都 pin 起來，所以 task 切換、看燈號對我來說很有意義。以前要看左手邊的 sidebar，不過畢竟比較小，有時候很難注意到；燈號就很明確，可以看到 task 正在 running，或是 complete 等我看。

其他功能偶爾才用，但基本上沒有什麼完全沒用。差別只在 task switching 和燈號真的變成每天 workflow 的一部分。

下面是最後拿去參加 OpenAI Build Week 的 demo：

<lite-youtube videoid="gg00seXWAPE" playlabel="播放 Codex ATOM demo"></lite-youtube>

[在 YouTube 觀看 Codex ATOM demo](https://www.youtube.com/watch?v=gg00seXWAPE)

Codex ATOM 本來就不需要變成一個 product，我也沒打算把它賣給別人。以前碰到這種需求，我大概想一想就算了；現在我真的把它做出來。

以前這種軟體不值得做。現在做了，而且我真的在用。光是這樣，我就覺得很有價值了。
