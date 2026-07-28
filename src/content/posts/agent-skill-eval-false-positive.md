---
title: Agent Skill Eval 最危險的假陽性
published: 2026-07-28
description: Agent 把任務做完，不代表結果是 Skill 帶來的。沒有拿完整 Skill 跟一段同目標的簡短 instruction 比過，你其實不知道多出來的 complexity 值不值得。
tags: [ai-engineering, agent-skills, evaluation]
lang: zh-tw
abbrlink: agent-skill-eval-false-positive
toc: true
draft: false
faqs:
  - question: Agent Skill eval 為什麼不能只看 final outcome？
    answer: Final outcome 只能證明這次任務做完。它沒有告訴你 agent 有沒有選到 Skill、讀過完整 instructions，或成功是不是 Skill 帶來的。
  - question: 怎麼確認 Agent Skill 真的有用？
    answer: 用多個真的會遇到的 tasks，在 clean context 裡固定 model、tools、permissions 與 grader，分別跑沒有 instruction、簡短 instruction 和完整 Skill。每個 task 都要重複幾次，再比較結果跟成本。
  - question: 沒有 paired eval，是否代表 Agent Skill 沒有用？
    answer: 不代表。Skill 可能有幫助、完全沒差，也可能讓結果變糟。要知道完整 Skill 多帶來多少價值，至少要拿它跟同目標的簡短 instruction 比。
---

> **TL;DR**: Final outcome pass 只能證明這次任務做完，不能證明 agent 有選到 Skill、讀過完整 instructions，更不能證明結果是 Skill 帶來的。這篇說的假陽性，是任務明明只是做完了，我們卻把它當成 Skill 有用的證據。沒有拿完整 Skill 跟一段同目標的簡短 instruction 比過，你就不知道多出來的 complexity 到底值不值得。

我在對自己寫的 Agent Skill 跑 evaluation 的時候，用 Codex 還有 Claude Code 跑同一個 Code Review Skill。兩邊都交出了可用的 review 結果。

Codex 的 JSONL trace 很直接：它真的讀了 project-local `review-code/SKILL.md`。Claude 的 init 資訊只讓我知道這個 Skill 有出現在 available skills 清單裡；一般 prompt 的那次 run，沒有留下我看得懂的 invocation event。另一個測試裡，我直接指定 Claude / Haiku 使用這個 Skill，輸出就有遵守 severity、confidence 與 type 格式。

我沒辦法從這段 trace 判斷 Claude 到底有沒有讀到 Skill，也沒辦法拿這次結果比較 Codex 和 Claude 誰的 routing 比較好。真正讓我在意的是：**兩邊都 pass，但我能確定的事情完全不一樣。**

如果 eval dashboard 最後只留下一個綠色勾勾，這個差異就消失了。然後我們很容易替那個 pass 補上一段 eval 從未證明的故事：Skill 被找到、被選中、被讀取，最後讓答案變好。

## 一個綠色勾勾，壓扁了五個問題

Agent Skill 從出現在系統裡，到最後真的把事情做好，中間至少有五層：

| Layer | 要回答的問題 | 怎麼確認 |
|---|---|---|
| Availability / discovery | Harness 有沒有找到這個 Skill？ | Skills list、init catalog、system metadata |
| Routing / activation | 一般使用者下 prompt 時，agent 有沒有選到它？ | Skill call、activation record、selection event |
| Instruction loading | 完整的 `SKILL.md` 有沒有真的讀進 context？ | Exact file read、load event |
| Adherence / behavior | Agent 有沒有照 Skill 裡重要的 rules 做？ | Tool trace、required actions；只有 output 格式像不算 |
| Outcome | 最後有沒有把任務完成？ | Tests、human review、production result |

[OpenAI 的 Skills 文件](https://learn.chatgpt.com/docs/build-skills)把「直接指定 Skill」和「讓 agent 自己選」分開。ChatGPT 與 Codex 會先看到 Skill 的 name、description，決定要用之後才載入完整 `SKILL.md`。[Agent Skills 的 description eval 指南](https://agentskills.io/skill-creation/optimizing-descriptions)也建議拿真的會觸發、差一點會誤觸發的 prompts 重複跑，直接看 `SKILL.md` 有沒有被載入。

Skill 出現在清單裡，只代表 harness 找得到它。Agent 看到一般 prompt 後有沒有選它，是 routing。兩件事混在一起，就會把「找得到」誤會成「真的有用到」。

不是每個 harness 都會把這五層寫進 log。有些會把 routing 跟 load 合成一個 event，有些只給你最後的 output。看不到就只能寫 `unknown`。Output 長得像 Skill 要求的格式，只能說行為很像；它不能證明 `SKILL.md` 有被讀到，也不足以把 `adhered` 記成 true。只有 tool trace 顯示 agent 做了指定動作，或你有檢查 Skill 要求的必要步驟，這一格才算有 evidence。

這跟我之前寫的 [proxy 幻覺](/posts/ai-proxy-metrics/)是同一種錯：一個數字明明只回答了 A，我們卻拿它去證明 B。Outcome 告訴你任務有沒有完成，沒有告訴你中間到底用了什麼。

## 沒有對照組，你就不知道是不是 Skill 的功勞

假設 agent 裝了 Skill，最後通過所有 tests。這個結果至少有三種解釋：

1. Skill 被正確選中、載入並改善了行為。
2. Skill 有載入，但 base model 本來就能完成，結果沒有變好。
3. Skill 根本沒有參與，agent 靠 model、repo context、其他 rules 或 tools 完成任務。

也就是說，如果你只是把 Skill 放進 harness 裡跑，然後只看最後的結果，你其實不知道這個 Skill 到底有沒有用。

[Agent Skills 的官方 output eval 指南](https://agentskills.io/skill-creation/evaluating-skills)寫得很直接：同一個 test case 要分別跑有 Skill 和沒有 Skill，兩邊都從 clean context 開始，再比較 pass rate、tokens 與 duration。[Claude Code 的官方文件](https://code.claude.com/docs/en/skills#evaluate-and-iterate-on-a-skill)也是同一個做法：Skill 有沒有被叫到，跟最後答案對不對，要分開看。

這不是方法論潔癖。有沒有對照組，真的會讓結論完全不同。

[SkillsBench](https://arxiv.org/abs/2602.12670)目前的 v1.1 用 87 個 tasks、18 組 model–harness 設定，比較沒有 Skills 和研究者準備的 Skills。平均 pass rate 從 33.9% 升到 50.5%，增加 16.6 個百分點。至少在這套測試裡，Skill 確實可能帶來明顯改善。

SkillsBench 的 Appendix K 更接近我開場遇到的問題。論文把 invocation 定義成 trace 裡有讀取或叫用該 task 的 Skill。在這個定義下，Codex / GPT-5.5 的 invocation rate 是 99.2%，Claude Code / Opus 4.7 是 68.2%，OpenHands / Gemini 3.1 Flash Lite 則是 46.4%。同一張表還把 invocation rate、最後的 resolution rate，以及「有 invoke 時的 resolution rate」分開列。

Codex / GPT-5.5 跟 Claude Code / Opus 4.7 的 invocation rate 差了 31 個百分點，resolution rate 卻只差 5.3 個百分點：66.5% 對 61.2%。Invocation rate 高，不代表 outcome 會按同樣幅度變好。只看前者或只看後者，都會漏掉一部分系統行為。

不過 SkillsBench 是先替每個 task 準備好對應的 Skill，再看 agent 會不會用；它沒有測一個塞了幾十、幾百個 Skills 的 library 裡，agent 能不能穩定選對。這兩種 routing 問題不能混在一起。

[SWE-Skills-Bench](https://arxiv.org/abs/2603.15401)得到另一種結果：49 個 SWE Skills 裡，39 個沒有讓 pass rate 變好，論文 abstract 寫的平均提升是 1.2%。其中 7 個比較專門的 Skills 有明顯改善，最多提升 30%；另外 3 個卻因為 guidance 過時，跟現在的 project 打架，最多讓表現下降 10%。這份研究至少打破了一個直覺：任務有通過，不代表功勞一定在 Skill。

[More Skills, Worse Agents?](https://arxiv.org/abs/2605.24050)測的是另一個問題：Skill 太多會怎樣？研究先挑出確定有幫助的 Skills，再比較小 library 和 52、102、202 個 Skills 的完整 library。在兩個 Claude models 上，擴到 202 個 Skills 後，論文原文寫的是 pass rate 最多下降 21%。這不是「沒有 Skill」對「202 個 Skills」，而是原本已知有用的小 library 對更大的 library。

最主要的原因不是 context 變長，而是相似的 Skill 把 agent 引到錯的地方。作者把這個現象叫做 skill shadowing。在論文 §4 的 Table 1，202-Skill condition 裡 shadowing 的 point estimate 是 0.14，總下降是 0.21，也就是大約 67%。這不是理論上的 upper bound，而是那組實驗的估計值；單純增加 context 的影響則小到跟零分不出來。這是全篇最直接的 routing evidence：Skill 越多，選錯 Skill 真的可能把原本的好處吃掉。

三份研究放在一起，沒有一個整齊的「Skill 好」或「Skill 壞」。Skill 可能很有幫助、完全沒差，也可能讓結果變糟。要知道整包 Skill 值不值得，最後還是得拿它跟同目標的簡短 instruction 比。

## 完全沒有 eval，複雜度可以安靜地留下來

上面說的不完整 eval，至少還可以確認在那些 cases 裡，Skill 沒有把最後結果弄壞。完全沒有 eval 時，團隊根本不知道這個 Skill 的效果是正、是零，還是負。

這種問題通常不會讓你一眼就看到。SWE-Skills-Bench 裡那三個讓結果變差的 Skills 就是很具體的例子：agent 沒有 crash，也不是完全不工作，只是 Skill 給了不合版本的做法，讓它在錯的方向上更努力。Agent 還是會回答，結果看起來也不一定離譜。

複雜度就這樣藏在其他地方：Skill 載入後，每一行 instructions 都會占 context；過時的 instructions 可能跟現在的 project 打架；Skill library 變大後，description 之間也會開始搶 routing。SWE-Skills-Bench 甚至量到有些 Skill 讓 token 用量增加 451%，pass rate 卻沒有變。這也是為什麼官方 eval 指南要求一起記 tokens 與 time。

更多 tool calls、維護成本、跨 harness 差異和錯誤安全感，也都要實際量才知道。在沒有確實 measurement 的情況下，你根本搞不清楚現在是哪一種狀況，只能自我感覺良好地說：「我弄了一個 Skill 幫我解決問題。」

真的壞掉會逼你修。「結果看起來還可以」反而會讓這些複雜度一直留在系統裡。

## 熱門公開 Skills，很少讓你看到這種比較

我在 2026-07-27 用 [skills.sh all-time leaderboard](https://www.skills.sh/)看了一次熱門公開 Skills。

我先看當時的 Top 10 Skills，再按 GitHub repository 去重，往下取前 20 個不同 repos 各自排名最高的 Skill。我刻意用了比這篇主張更寬鬆的標準：只要同一個問題有跑過有 Skill 和沒有 Skill，並且比較結果，就算通過；不要求一定要有 terse instruction baseline。只有 trigger tests、unit tests、example prompts、expected outputs，或 README 裡一句「tested」，都不算。

結果是：

| Sample | 有比較有／無 Skill | 有 eval，但沒有對照組 | 沒有相關比較 |
|---|---:|---:|---:|
| 當時的 Top 10 Skills | 0/10 | 1/10 | 9/10 |
| 前 20 個不同 GitHub repos | 1/20 | 3/20 | 16/20 |

這兩組不是 30 個互不重複的 samples。Top 10 裡的 repos 也包含在第二組，而且高度集中在 5 個 repos：`mattpocock/skills` 占 5 席，`vercel-labs/agent-skills` 占 2 席，其餘 3 個 repos 各 1 席。這也是為什麼第二組要把 repo 去重，再看 20 個不同 repos。即使用前面那個比較寬鬆的標準，也只有 1/20 通過。

### Appendix：Top 10 Skills 的抽查清單

這裡的 `Partial` 跟下面 20 個 repos 的定義相同：有 eval cases 或行為測試，但沒有同題的 outcome 對照組。Top 10 裡唯一的 `Partial` 是 agent-browser。

| 排名 / Skill | 判定 |
|---|---|
| [1. find-skills — vercel-labs/skills](https://github.com/vercel-labs/skills/tree/e173b8c88f2581cfdaa1b6767c6519a08155790e) | 沒有相關比較 |
| [2. frontend-design — anthropics/skills](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb) | 沒有相關比較 |
| [3. grill-me — mattpocock/skills](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |
| [4. agent-browser — vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser/tree/6dcea79b4b567a5671f1e1164807204f69542a5c) | Partial |
| [5. vercel-react-best-practices — vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/7c180d9044c9ae2b442b567aad4e42a28dd5ed62) | 沒有相關比較 |
| [6. grill-with-docs — mattpocock/skills](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |
| [7. improve-codebase-architecture — mattpocock/skills](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |
| [8. tdd — mattpocock/skills](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |
| [9. web-design-guidelines — vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/tree/7c180d9044c9ae2b442b567aad4e42a28dd5ed62) | 沒有相關比較 |
| [10. setup-matt-pocock-skills — mattpocock/skills](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |

### Appendix：20 個 repos 的抽查清單

排名是在 2026-07-27 抓的。我在 2026-07-28 用下面連結的 commits 再確認一次。`Partial` 代表有 eval cases 或行為測試，但沒有同題的 outcome 對照組。

| Repo / 取樣 Skill | 判定 |
|---|---|
| [vercel-labs/skills — find-skills](https://github.com/vercel-labs/skills/tree/e173b8c88f2581cfdaa1b6767c6519a08155790e) | 沒有相關比較 |
| [anthropics/skills — frontend-design](https://github.com/anthropics/skills/tree/b29e7cf65e5cb78a5ac33d582270551bc74a14eb) | 沒有相關比較 |
| [mattpocock/skills — grill-me](https://github.com/mattpocock/skills/tree/ed37663cc5fbef691ddfecd080dff42f7e7e350d) | 沒有相關比較 |
| [vercel-labs/agent-browser — agent-browser](https://github.com/vercel-labs/agent-browser/tree/6dcea79b4b567a5671f1e1164807204f69542a5c) | Partial |
| [vercel-labs/agent-skills — vercel-react-best-practices](https://github.com/vercel-labs/agent-skills/tree/7c180d9044c9ae2b442b567aad4e42a28dd5ed62) | 沒有相關比較 |
| [microsoft/azure-skills — microsoft-foundry](https://github.com/microsoft/azure-skills/tree/013b97d8aab03ce8cd88944976e9988f8c829746) | 沒有相關比較 |
| [larksuite/cli — lark-doc](https://github.com/larksuite/cli/tree/1b173e1953c0b73c53bdf3e44329fcbbf5a7236a) | 沒有相關比較 |
| [inference-sh/skills — ai-video-generation](https://github.com/inference-sh/skills/tree/a82f5eb2d521f265484da47a61776fbd636b9676) | 沒有相關比較 |
| [JuliusBrussee/caveman — caveman](https://github.com/JuliusBrussee/caveman/tree/0d95a81d35a9f2d123a5e9430d1cfc43d55f1bb0) | Paired outcome comparison |
| [remotion-dev/skills — remotion-best-practices](https://github.com/remotion-dev/skills/tree/0e444efe46a8eb606acefd54d70ae64e8f908e36) | 沒有相關比較 |
| [supabase/agent-skills — supabase-postgres-best-practices](https://github.com/supabase/agent-skills/tree/1ad9aaeb49caafd9e95c0a91116f71890eebbc53) | 沒有相關比較 |
| [obra/superpowers — brainstorming](https://github.com/obra/superpowers/tree/3dcbd5c4b48e02263fbf4a3c01e3fe4f81d584d9) | 沒有相關比較 |
| [Leonxlnx/taste-skill — design-taste-frontend](https://github.com/Leonxlnx/taste-skill/tree/e988add20dab0fa97d7a76781c48961c8184288e) | 沒有相關比較 |
| [heygen-com/hyperframes — hyperframes-cli](https://github.com/heygen-com/hyperframes/tree/dbdc940833c5a8278f56227bfaca775a4413b1ca) | 沒有相關比較 |
| [shadcn-ui/ui — shadcn](https://github.com/shadcn-ui/ui/tree/3150ac35a62e767eba39cc90730e9daeaa5be76f) | Partial |
| [getpaperclipai/paperclip — design-guide](https://github.com/getpaperclipai/paperclip/tree/da47bd284ffd2b7e30c9c371188d4a7a31649283) | 沒有相關比較 |
| [pbakaus/impeccable — impeccable](https://github.com/pbakaus/impeccable/tree/1cf7d7ab0f1ac0bb3319fd20be389a3009f4037d) | 沒有相關比較 |
| [coreyhaines31/marketingskills — seo-audit](https://github.com/coreyhaines31/marketingskills/tree/7868cb9251fad80a73d26e488a5ad5f6c4a9f335) | Partial |
| [firebase/agent-skills — firebase-basics](https://github.com/firebase/agent-skills/tree/651e804995a766dce2c54ba3be6e479d145230bf) | 沒有相關比較 |
| [get-convex/agent-skills — convex-quickstart](https://github.com/get-convex/agent-skills/tree/ec1e6baae7d86c7843c22938c75979c016f5c6e9) | 沒有相關比較 |

這不代表作者私下都沒有測。它代表的是：**使用者通常看不到足以證明 Skill 真的有幫助的公開資料。**

唯一清楚做了這種比較的熱門 repo 是 [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman/blob/0d95a81d35a9f2d123a5e9430d1cfc43d55f1bb0/evals/README.md)。它讓同一組 prompts 跑三組：沒有 system prompt、只有 `Answer concisely.`、以及 terse instruction 加 `SKILL.md`。作者還特別指出，真正該比的是 Skill 對 terse control，不是 Skill 對一片空白。

這份 eval 也沒有把自己說得太滿：只跑一次，只量 output tokens，沒有量答案品質，也沒把讀 Skill 花掉的 input tokens 算進去。但至少你知道那些數字怎麼來的。

[NVIDIA/skills](https://github.com/NVIDIA/skills)則把 eval 直接變成發布規則。要發布的 Skill 必須附 evaluation dataset，產生的 `BENCHMARK.md` 也會跟 Skill 一起公開。當時抽查的 [cuDF benchmark](https://github.com/NVIDIA/skills/blob/f3300c5d7baa605549fb2a82e24a6a3f267b91ad/skills/accelerated-computing-cudf/BENCHMARK.md)就有把使用 Skill 和沒有 Skill 的結果分開。

這至少證明公開比較做得到，差別只在你有沒有把它當成發布 Skill 的必要條件。

## 「只要 outcome 變好，routing 重要嗎？」

這是最強的反駁，而且有一半完全正確。

如果產品只在乎「使用者的任務能不能穩定完成」，而你已經在 clean context 裡重複比較過完整 Skill 和簡短 instruction，確定整套系統真的變好，那你不一定要知道每一次 routing 的細節。結果有變好就夠了。

如果簡短 instruction 跟完整 Skill 的 outcome 一樣好，成本還更低，routing 也不重要。比較合理的動作通常不是硬留整包 Skill，而是把它縮成那段簡短 instruction。

但如果你宣稱一般使用者不需要知道 Skill 名稱也能自然觸發，或 Skill 裡放的是安全、privacy、compliance 這種不能漏掉的規則，那 routing 就很重要。你也只有把 routing 記下來，才知道 Skill library 變大後到底是在哪裡壞掉。

Outcome 告訴你任務有沒有完成。Routing 告訴你 Skill 有沒有被用到。你可以只在乎 outcome，但不能說自己已經證明了 routing。

## 說一個 Skill 有用前，先跑這個最小比較

我現在會把 Agent Skill 的最小 eval 寫成五步：

1. **先準備多個真的會遇到的 tasks。** 每個 task 都要先定義什麼叫完成。能用 tests 或程式判斷，就不要只靠「看起來不錯」。
2. **每組條件要一樣。** 固定 model、tools、permissions、repo fixture 與 grader；每次都從 clean context 開始。
3. **至少跑三個對照條件。** 第一個不給額外 instruction，第二個只給一段簡短但目標相同的 instruction，第三個才放完整 `SKILL.md`。第一個告訴你 base model 本來會不會，第二個才是判斷完整 Skill 多帶來多少價值的 baseline。如果 Skill 很長，還可以再加一個等長、但不含 Skill 方法的內容，確認問題是不是單純來自 context 變長。
4. **比較的是 tasks × trials。** 不要只拿同一個 task 重跑。先準備多個 tasks，每個 task 跑 3–5 次當起點，再看整體結果。這個規模只能先看變異；重要的 Skill 要跑更多。Binary pass/fail 每個條件至少直接報 `k/n` 和 95% Wilson interval，不要只丟一個百分比。要說完整 Skill 有 uplift，還得報「完整 Skill − 簡短 instruction」這個 paired delta 的 uncertainty，例如用 task-level paired bootstrap。差異還落在不確定範圍內，就先寫 `unknown`。
5. **把過程跟成本一起記。** `available → routed → loaded → adhered → outcome_pass`，再加上 tokens、time 和 tool calls。只有 output 長得很像，不算 `adhered`；沒有 tool trace 或必要動作的檢查就寫 `unknown`。

[Counterfactual Trace Auditing of LLM Agent Skills](https://arxiv.org/abs/2605.11946)做的事情，正是比較同一個 task 有 Skill 和沒有 Skill 的 paired traces，找出行為到底在哪裡分岔，而不是只看最後有沒有 pass。這篇研究也剛好示範了 tasks 和 trials 的取捨：作者原本打算用 17 個 tasks、每個跑 3 次，最後為了涵蓋全部 49 個 tasks，改成每個只跑 1 次。他們也直接承認，這樣就沒辦法估同一個 task 反覆執行時的變異。Task 的範圍跟每題重複次數都重要，不能只挑一個數字交差。

你可以先直接指定 Skill，確認它被載入後能不能正常工作。接著再用一般 prompt，測 agent 自己會不會選到它。這是兩個不同問題，不要混成同一個分數。

## 沒有 200 次 run 的預算，先測哪裡？

上面三、四個對照條件，乘上多個 tasks，每個再跑 3–5 次，很快就會變貴。10 個 tasks、4 個條件、每個跑 5 次，就是 200 次 agent run。小團隊不可能每個 Skill 都直接跑完整套。

我會先挑最值得花錢測的那一個：裡面放了 safety、compliance 或固定 workflow 的 Skill，或是你準備叫其他人一起安裝的 Skill。第一輪只跑「簡短 instruction」和「完整 Skill」兩個條件。5 個 tasks、每個條件跑 3 次，一共 30 runs，先看有沒有值得繼續追的 signal。這只是 screening，不是可以拿去宣傳的 benchmark。

30 runs 跑出 null，只代表這個規模看不出差異，完整 Skill 的價值仍然是 `unknown`。如果它不承載 safety 或 compliance 規則，我還是會把簡短 instruction 當成成本上的預設值：在證據不足時，先選維護負擔比較低的那個。這是一個 decision rule，不是完整 Skill 已經被證明沒用。

如果完整 Skill 出現明顯 signal，再補沒有 instruction、等長對照、更多 tasks 和更多 trials。Eval 的成本應該跟你要做的決定一起放大。

最後只需要問一個問題：

**把這個 Skill 換成一段簡短 instruction，結果真的會變差嗎？**

如果答案是「不會」，你就還沒有證明完整 Skill 比簡短 instruction 更有價值。先把它縮短；真的需要完整 workflow、references 或 scripts 的部分，再留在 Skill 裡。
