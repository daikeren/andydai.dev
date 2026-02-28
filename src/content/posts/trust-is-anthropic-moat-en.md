---
title: "Trust Is Anthropic's Moat—Until You Start Verifying"
published: 2026-02-28
description: Anthropic is the only independent AI company spanning all three major clouds, banking on trust as its moat. But from training data controversies to selective safety narratives to the Pentagon standoff—does that trust hold up under scrutiny?
tags: [anthropic, ai-safety, ai-industry, trust, business-strategy]
lang: en
abbrlink: trust-is-anthropic-moat
toc: true
---

> **TL;DR**: Anthropic is the only independent AI company spanning all three major clouds, banking on trust as its moat. But from a \$1.5B copyright settlement to selectively weaponizing safety narratives against competitors to having the Pentagon standoff's results harvested by Sam Altman—corporate honesty and model honesty are two entirely different things.

# Trust Is Anthropic's Moat—Until You Start Verifying

On February 27, 2026, [OpenAI announced \$110B in funding](https://techcrunch.com/2026/02/27/openai-raises-110b-in-one-of-the-largest-private-funding-rounds-in-history/). The number alone was staggering, but the detail that stopped me was this: Amazon put in \$50B.

Amazon investing in OpenAI meant AWS became the exclusive third-party cloud provider for OpenAI's enterprise platform Frontier. I did what any AI startup CTO would do—pulled up the mental map of cloud platforms and reshuffled:

AWS now has OpenAI, Anthropic, and Amazon's own Nova. Google Cloud has Gemini and Anthropic. Azure has OpenAI and Anthropic.

Then I noticed something: **Anthropic is the only independent AI company spanning all three major clouds.**

That's a unique position. OpenAI was tightly coupled with Microsoft, but Microsoft didn't participate in this round—OpenAI is clearly reducing its dependence on a single cloud. Anthropic, from the start, went multi-cloud.

But unique doesn't mean safe. AI model capabilities are commoditizing fast—the differentiation window has shrunk from over a year to a few months. If the endgame comes down to distribution—who can put AI in the most hands—Google has Android, Chrome, Search, Workspace, adding up to billions of users in surface area. Google doesn't need the best model, just "good enough," and distribution does the rest.

So what does Anthropic have?

---

The answer came to me in a somewhat ironic setting.

I asked Claude—Anthropic's own model—this question. I asked what Anthropic's competitive advantage is against Google Workspace + Gemini in the enterprise market. It gave me a clear answer: **trust**.

Anthropic's moat is trust. Highly regulated industries like finance, healthcare, and government need more than a good model—they need data privacy, compliance, and predictability. Google's ad-driven business model is actually a trust liability in these customers' eyes. Anthropic isn't playing the horizontal game of giving every employee an AI copilot. It's playing the platform game—letting dev teams build AI applications on its models.

Sounds reasonable. But my reaction was—trust? Let's see if that trust holds up under scrutiny.

Using Anthropic's own model to challenge Anthropic's moral positioning was interesting enough. What was more interesting was what I dug up next.

---

## The Hand That Waves the Moral Flag

Start with the most recent. On February 23, 2026, Anthropic [published a blog post](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks) accusing three Chinese companies—DeepSeek, Moonshot AI, and MiniMax—of mass model distillation through fake accounts. The numbers were striking: 24,000 fake accounts, over 16 million interactions. DeepSeek targeted reasoning capabilities and safe alternatives for politically sensitive queries. Moonshot AI targeted agentic reasoning and coding. MiniMax redirected nearly half its traffic within 24 hours of Anthropic releasing new models.

The accusation itself may be valid. But here's the problem: almost simultaneously, [multiple users on X discovered](https://x.com/stevibe/status/2026227392076018101) that when you ask Claude Sonnet 4.6 in Chinese "What model are you?", it answers "I am DeepSeek."

A company accusing others of stealing its work, while its own model identifies itself as the accused. What does that imply? Anthropic's training data very likely includes DeepSeek's output. [As someone on X put it bluntly](https://x.com/OopsGuess/status/2026375711767015856): "Before Washington starts screaming about Chinese theft, maybe ask why an American model identifies itself as a Chinese one."

This isn't Anthropic's first training data legitimacy issue. In 2025, they [settled for \$1.5 billion after thousands of authors accused them of mass-downloading books from shadow libraries to train models](https://www.npr.org/2025/09/05/nx-s1-5529404/anthropic-settlement-authors-copyright-ai)—roughly 500,000 books at \$3,000 each. There was also the Reddit scraping controversy.

Here's a legal distinction worth noting: Anthropic downloading copyrighted books from pirate sites to train models was court-recognized infringement—hence the \$1.5B settlement. What the Chinese companies did—distillation—is at most a Terms of Service violation, still legally gray. A company already found to have infringed, accusing others of something the law hasn't even settled—can that moral high ground hold?

---

## When Safety Becomes a Weapon

If it were just a training data problem, you could say "the whole industry does this, Anthropic isn't special." But Anthropic's pattern goes further.

In June 2025, Anthropic [cut off nearly all of Windsurf's first-party Claude access with less than five days' notice](https://techcrunch.com/2025/06/03/windsurf-says-anthropic-is-limiting-its-direct-access-to-claude-ai-models/). The reason? OpenAI might acquire Windsurf. Anthropic co-founder Jared Kaplan [said directly](https://techcrunch.com/2025/06/05/anthropic-co-founder-on-cutting-access-to-windsurf-it-would-be-odd-for-us-to-sell-claude-to-openai/): "It would be odd for us to sell Claude to OpenAI."

In August 2025, Anthropic [revoked OpenAI's API access](https://techcrunch.com/2025/08/02/anthropic-cuts-off-openais-access-to-its-claude-models/) because OpenAI engineers were using Claude for coding before GPT-5's launch. Anthropic called it a Terms of Service violation. OpenAI's response was apt: "This is standard industry practice, and our API remains open to Anthropic."

In January 2026, [the same thing happened to xAI](https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses/). xAI engineers using Claude through Cursor IDE for internal development got cut off. xAI co-founder Tony Wu [confirmed](https://sherwood.news/tech/report-anthropic-cuts-off-xais-access-to-its-models-for-coding/) this was Anthropic's new policy toward all major competitors.

Three cutoffs. One pattern.

The interesting contrast: with American competitors, Anthropic was honest—ToS violation, competitive considerations. But with Chinese companies, the same competitively driven behavior got packaged as a safety issue and a national-level threat. That's not safety. That's selective deployment of the safety narrative.

---

## Dario and His Worldview

To understand why Anthropic acts this way, you need to understand Dario Amodei.

In 2021, Dario led a core team out of OpenAI to found Anthropic. The reason was AI safety—they believed OpenAI wasn't taking it seriously enough. This origin story is real. I don't doubt their motivation at the time.

But Dario holds a deeply adversarial worldview. He advocates an "entente" strategy—a democratic coalition using AI to achieve decisive advantage over China. He considers the Chinese Communist Party the greatest threat, claiming otherwise humanity faces "global totalitarian dictatorship." He spends 40% of his time maintaining company culture, writing essay-length debates on Slack, with employees responding in equally lengthy essays. Monthly vision quests.

There are several cult-like cultural markers here: a charismatic leader constantly broadcasting a worldview, members forming consensus around it. A mission framework with religious overtones—not making a good product, but saving humanity from existential AI threats. Clear in-group/out-group boundaries.

Then look at Anthropic's lack of distribution. Google has billions of users in surface area. Microsoft has Office and Azure. OpenAI has ChatGPT's consumer mindshare. Anthropic has none of that. Without distribution advantages, all you can do is guard the model's value—including cutting off anyone who might dilute it.

Aggressive business behavior = adversarial founder + no distribution + the convenience of a safety wrapper.

---

## The Product of Belief, and Belief's Collapse

This culture doesn't just shape company behavior—it gets baked directly into the model. Have you noticed that Claude has a distinctly stronger "personality" compared to other AI models? That overly polite, overly cautious style that constantly adds caveats and nuance is the direct result of constitutional AI and RLHF writing company values into the model. In a sense, Claude is the evangelism tool of Anthropic's cult-like culture—every conversation transmits their worldview of how AI should interact with humans. This point becomes important shortly.

There's a key turning point. Anthropic recently updated their Responsible Scaling Policy, abandoning their original commitment to halt training beyond certain capability levels unless safety could be guaranteed. The reason: competitive pressure and lack of regulation.

When mission conflicts with business reality, mission yields. A real cult doesn't compromise on belief, but a company does. Anthropic is a company very skilled at leveraging cult-like culture for mobilization—not a true belief organization.

---

## But Their Model Genuinely Doesn't Bullshit

Time for a turn, because it's not that simple.

There's a test called the [Bullshit Benchmark](https://petergpt.github.io/bullshit-benchmark/viewer/index.html), specifically designed to measure whether AI models can detect broken premises and refuse to answer nonsensical questions. As of February 2026, the top nine on the leaderboard are all Anthropic models. Claude 3 Opus rejects nonsensical questions 92% of the time. Gemini 1.5 Pro manages just 38%.

This isn't coincidence. It's the direct product of Anthropic's constitutional AI and alignment methodology. Whatever you think of the company's business practices, on the dimension of model output—making AI honest, not overconfident, willing to admit uncertainty—they genuinely outperform their peers.

A contradiction emerges: **Corporate honesty and model honesty are two entirely different things.**

A company that produces good output isn't necessarily a good company. Or put another way—cult-like culture, a high-pressure insular environment, can indeed produce extreme quality on certain dimensions. The cost is compromise on others.

---

## Pentagon: The Price of Principles

If the Bullshit Benchmark was the first layer of contrast, the Pentagon standoff is the second.

Background: Anthropic had a \$200M contract with the Pentagon—the first company approved to deploy AI on classified networks. Anthropic held two red lines: no mass domestic surveillance, no fully autonomous weapons. The Pentagon demanded Anthropic open up to "all lawful use." Anthropic refused.

Escalation came fast. On February 24, Defense Secretary Pete Hegseth met with Dario and threatened to invoke the Defense Production Act—a Korean War-era law—for forced requisition, or label Anthropic a "supply chain risk." That label is typically reserved for Chinese and Russian companies. Pentagon CTO Emil Michael publicly called Amodei "a liar who has a God-complex."

On February 27, an ultimatum was set: respond by 5:01 PM ET or face consequences.

Dario's public statement pointed out an absurd contradiction: the government simultaneously threatened to label Anthropic a supply chain risk (security threat) and invoke the DPA to requisition Claude (national security necessity). His exact words: "one labels us a security risk; the other labels Claude as essential to national security." Which is it—threat or necessity?

According to [Axios's reporting](https://www.axios.com/2026/02/27/anthropic-pentagon-supply-chain-risk-claude), at the same time Hegseth posted the supply chain risk announcement on X, Pentagon undersecretary Emil Michael was still on the phone with Anthropic negotiating a deal. The deal's content? Requiring Anthropic to allow collection of Americans' geolocation data, web browsing history, and personal financial data purchased from data brokers. This wasn't abstract "lawful use"—this was the concrete substance of mass surveillance.

Dario issued a public statement: "These threats do not change our position: we cannot in good conscience accede to their request." His reasoning: first, current AI models aren't reliable enough for fully autonomous weapons, risking American troops and civilians; second, mass domestic surveillance violates fundamental rights.

Then [Trump intervened directly](https://www.cnbc.com/2026/02/27/trump-anthropic-ai-pentagon.html). Posted on Truth Social calling Anthropic "Leftwing nut jobs," ordered all federal agencies to stop using Anthropic technology, and threatened "the Full Power of the Presidency" for civil and criminal liability.

If the story ended here, Anthropic would look like the hero paying the price for principles.

But the story didn't end here.

---

## Sam Altman's Three-Step Harvest

On the morning of February 27, Sam Altman [went on CNBC](https://www.cnbc.com/2026/02/27/trump-anthropic-ai-pentagon.html) to express support for Anthropic. He said: "For all the differences I have with Anthropic, I mostly trust them as a company, and I think they really do care about safety." He added that OpenAI shared the same red lines.

That evening, Altman sent an internal memo saying he wanted to "help de-escalate things" and was negotiating with the Pentagon.

That night, [OpenAI announced a classified network deployment agreement with the Department of War](https://www.npr.org/2026/02/27/nx-s1-5729118/trump-anthropic-pentagon-openai-ai-weapons-ban). The conditions were exactly what Anthropic had insisted on: no mass surveillance, no autonomous weapons.

Same Pentagon—threats and ultimatums for Anthropic, "displayed a deep respect for safety and a desire to partner" for OpenAI.

Altman's moves were masterful. First, validate Anthropic's position—"we share their red lines." Then demonstrate he could do what Anthropic couldn't—reach an agreement with the government. Finally, call for the same terms for all companies, claiming moral high ground. Simultaneously appearing as peacemaker, industry leader, and the one more capable of working with government.

Anthropic spent months in head-on confrontation—publicly humiliated by Trump, threatened with the DPA, labeled a supply chain risk. Altman stepped in at the last moment and used diplomacy to secure the same deal.

**The company that held strongest to its principles paid the highest price. The most pragmatic player harvested the results.**

---

## So What Are Principles, Really?

I don't want to speculate about Anthropic's or Altman's motivations. They themselves might not be 100% clear on their own deepest motivations. I can only look at behavior.

Anthropic's AI safety origin story is real—they left OpenAI precisely for this. Dario's Pentagon statement reads as sincere. Their model genuinely bullshits users less than any competitor.

But their subsequent behavior is also fact. Training data legitimacy doesn't hold up under scrutiny. The safety narrative gets selectively weaponized for competition. The Responsible Scaling Policy yielded to commercial pressure. Different standards for different adversaries.

They're not an immoral company. They're a "relatively moral" company—better than peers, but with a clear gap from the standards they claim. The problem is, when you take the moral high ground, any gap gets amplified.

Back to the opening question: Anthropic's moat is trust. But trust isn't what you claim—it's what others grant you after observing your behavior.

This isn't just Anthropic's story. The entire AI industry faces the same question—are principles belief or packaging? When principles and commercial interests always point the same direction, outsiders can't help but question. When principles actually cost something, how many companies will choose to pay?

Anthropic chose to pay on the Pentagon standoff. But Altman used pragmatism to get the same outcome.

This is perhaps the most honest snapshot of the AI industry in 2026: the model least likely to bullshit comes from a company full of contradictions, and the most principled stance got its results harvested by the most pragmatic player.
