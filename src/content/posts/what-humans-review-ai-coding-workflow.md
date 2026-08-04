---
title: AI Coding Workflow 裡，人類該 Review Plan 還是 Evidence？
published: 2026-08-04
description: 我不再把先寫 plan、等人 approve、再開始 implementation 當成每個 AI coding task 的預設。Routine work 可以讓 agent 做完再 review diff 與 evidence；高風險工作仍然先看 plan。
tags: [ai-engineering, coding-agent, developer-productivity]
lang: zh-tw
abbrlink: what-humans-review-ai-coding-workflow
toc: true
faqs:
  - question: 使用 AI coding agent，還需要 implementation plan 嗎？
    answer: 需要。差別是人類不一定每次都要在 implementation 前先 approve plan。Routine、可逆、驗證明確的工作，可以讓 agent 做完再 review diff 與 evidence；高風險、不可逆、architecture-heavy 或需求模糊的工作，仍適合先看 plan。
  - question: 不先 approve plan 時，task 該先定義什麼？
    answer: 至少要說清楚 outcome、相關 context、不能破壞的 constraints、success criteria，以及最後要交回哪些可重跑的 verification evidence。
  - question: 什麼情況不適合直接讓 coding agent 實作？
    answer: 當需求有多種合理解讀、變更不可逆、blast radius 大，或會改動 architecture 或 data contract 時，應先看 implementation plan。
  - question: Agent 回報 tests passed，可以當作完成證據嗎？
    answer: 不能單獨當作完成證據。Test output 是一項待查核的 claim；交付前應在同一個 revision 由 independent CI、deterministic hook 或其他獨立 pass / fail signal 重跑，驗證強度要跟 blast radius 一起升級。
---

> **TL;DR**: 我現在不再把「先寫 plan、等我 approve、再開始 implementation」當成每個 AI coding task 的預設。Routine、可逆、容易驗證的工作，我會先講清楚結果、不能破壞的東西和驗證方式，讓 agent 做完，再 review diff 與 evidence。高風險、不可逆、architecture-heavy 或需求模糊的工作，仍然先看 plan。Agent 還是要規劃；人類不一定每次都要先看。

最近我在一個公開的 [Agent Skill eval PR](https://github.com/daikeren/skills/pull/8) 裡，要求建立一套可重現、可稽核，而且只有 evidence 足夠時才能 claim-ready 的比較流程。

第一版改了 27 個檔案，兩個 GitHub checks 都是綠的，本機 `npm run validate` 也通過。表面上已經可以交付。

Fresh-context review 後，我們才發現，manifest 雖然記錄了 `reasoning_effort`，實際執行 Codex 時根本沒有套用；`independent-review.json` 也沒有綁定最後用來形成結論的 `benchmark.json`。Artifact 寫的是一種執行方式，command 跑的卻是另一種。Independent review 看完之後如果 benchmark 被換掉，verifier 也看不出來。

先 review 一份 implementation plan，抓不到這個錯。Plan 可以寫「config 會被套用」「review 會綁定 benchmark」，但只有實際 command、artifact binding 和 regression tests 能證明它真的發生。

這件事讓我把兩個問題分開：agent 要不要先規劃？人類要不要在 implementation 前先看那份 plan？

Non-trivial task 當然需要規劃。但如果主要風險藏在實際執行結果裡，先看一份寫得很合理的 plan，不一定能幫你抓到它。

## 為什麼以前習慣先看 plan

2024–2025 年，兩個有代表性的 AI coding 產品，都把 implementation plan 放在人類開始 review 的位置。

[GitHub 在 2024 年介紹 Copilot Workspace](https://github.blog/news-insights/product-news/github-copilot-workspace/)時，Workspace 會從 task 產生可編輯的 step-by-step plan；使用者確認後，才執行 code。[Cline 的 Plan / Act](https://cline.bot/blog/plan-smarter-code-faster-clines-plan-act-is-the-paradigm-for-agentic-coding)也是先在 Plan Mode 對齊 strategy，再切到 Act Mode 執行。直到現在，[Cline 的文件](https://docs.cline.bot/core-workflows/plan-and-act)仍建議 medium tasks 先 Plan 再 Act，large tasks 使用 `/deep-planning`；只有 typo、missing import、config value 這類小改動，才建議直接 Act。

這個 workflow 很合理。人類可以在 code 出現以前，先抓需求誤解、漏掉的檔案和錯的 architecture direction。對 migration、權限、billing、資料刪除這類工作，十行 plan 走錯，比八百行 diff 走錯便宜很多。

但 agent 在實作時會繼續讀 repo、跑 tests、根據結果改做法。開始前那份 plan，有時只是它還沒真正完整探索 repo 以前的猜測。你把每一步都先定死，可能只是在 review 一份很快就過期的文件。

## 新 guidance 開始把重點放在結果

截至 2026 年 8 月，[OpenAI 的 GPT-5.6 model guidance](https://developers.openai.com/api/docs/guides/latest-model)建議把 underlying goal、相關 context、hard constraints、success criteria 和 required evidence 說清楚。模型已經更能從 context 推斷目標，使用者通常不需要把每一步都指定好。

[Anthropic 對 Claude Opus 5 的 prompting guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5)也建議先給完整的 task specification，再讓 model 跑完整個 task。對範圍清楚的工作，model 可以自己做 routine judgment；只有不同解讀會導致明顯不同的結果時，才需要回來確認。

這些 guidance 沒有把 plan-first 拿掉。[Claude Code best practices](https://code.claude.com/docs/en/best-practices)至今仍保留 `explore → plan → implement → commit`，也建議用 Plan Mode 編輯 implementation plan。兩種 workflow 正在同一批產品裡並存。

我的使用方式也在往同一個方向變：我越來越少指定 implementation steps，越來越常指定完成後要成立的結果。

## 我現在怎麼下 routine coding task

我現在下 routine coding task，會先講清楚五件事：

1. **Outcome**：完成後，使用者或 system 要看見什麼變化。
2. **Context**：相關 repo、caller、既有 pattern 或 decision。
3. **Constraints**：哪些 invariant 不能破壞、哪些檔案或 layer 不要碰、scope 大到什麼程度要停，以及哪些條件不成立就不能進入 claim-ready、merge 或 deploy。
4. **Success criteria**：哪些條件成立才算完成。
5. **Evidence**：最後要交回哪些 command、結果、screenshots 和 remaining unknowns，以及別人要怎麼重跑。

然後讓 agent 自己選 implementation path。

這跟「你自己看著辦」差很多。我沒有少給資訊，只是把注意力從「每一步要怎麼寫」移到「最後什麼必須成立」。

可以直接從這個 template 開始：

```text
Outcome:
- [完成後可觀察到的行為]

Context:
- [repo / caller / existing pattern / relevant decision]

Constraints:
- Preserve: [invariants / compatibility]
- Do not touch: [out-of-scope surfaces]
- Stop if: [unexpected scope / diff threshold / material ambiguity]
- Block until: [conditions required before claim-ready / merge / deploy]

Success criteria:
- [deterministic checks or acceptance conditions]

Return evidence:
- [diff scope, commands and results, screenshots, remaining unknowns]
- Reproducible by: [CI / hook / exact command anyone can rerun]
- Not yet verified: [checks that still depend on agent-run output]
```

## Plan 沒有過時，只是不必每次先看

Routine、可逆、容易驗證的工作，我會讓 agent 做完，再 review final diff 和 evidence。例如小範圍 refactor、明確的 bug fix、補 tests，通常不需要先開一個 plan review round。

需求有多種合理解讀、會改 architecture 或 data contract、變更不可逆，或走錯方向會讓大量 code 作廢時，我還是先看 plan。有時不需要完整 implementation plan，只要先停在那個會改變方向的 decision。

差別不是少 review。差別是把 review 放在最容易抓到主要風險的地方。

這個選擇也會把一部分成本往後移。如果 agent 寫到八百行才發現需求理解錯了，整份 diff 都可能作廢。

Plan review 擅長提早抓錯方向。Diff review 擅長看 implementation 有沒有越界。Tests、CI 和其他 evidence 擅長確認結果有沒有成立。沒有哪一種可以代替另外兩種。

## Agent 說 tests passed，還不算完成

Agent 回報 tests passed，只代表它說自己跑過 tests。Tests 可能被改弱，command 可能沒有套到你以為的 config，artifact 也可能沒有綁到最後的結果。

這跟我在[〈Agent Skill Eval 最危險的假陽性〉](/posts/agent-skill-eval-false-positive/)講的是同一種錯：一個綠色勾勾只證明某一層通過，不能替其他層補故事。

Routine、可逆的工作，我可以先把 agent-run output 當成低成本訊號。但要交付，至少讓 CI、deterministic hook 或任何人都能執行的 exact command，在同一個 revision 重跑。涉及 user behavior、security、migration 或 production state，就再加 browser check、fresh-context review 或真實環境驗證。

開場那個 PR 最後補了兩條規則：宣告的 model config 沒有真的生效，就不得 claim-ready；independent review 必須用 SHA-256 綁定它看過的 benchmark artifact。這兩條都有 regression tests。

這些問題，plan 寫得再漂亮也不會自己消失。

## 下一個 task，先問三個問題

1. **做錯了，能不能很快回復？** 不能，就先看 plan。
2. **做對了，有沒有獨立的 pass / fail signal？** 沒有，就先建立 test、fixture 或其他驗證方式；做不到，就把 human diff review 當成必要成本。
3. **不同解讀，會不會導向不同的 architecture、data contract 或 user behavior？** 會，就先對齊 decision，必要時再展開 plan。

三個答案都指向低風險，就讓 agent 做完再看結果。

下一次不必先問 agent 要不要 plan。它多半需要。

真正要問的是：你需不需要在它開始以前先看那份 plan？
