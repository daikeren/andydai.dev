---
title: My Dad Can't Find Baby Food and You Using AI to Code Are the Same Problem
published: 2026-02-16
description: Whether you rely on experience or AI, if you skip the step of understanding the problem first, you end up searching in the wrong place. When you can't find the answer, you conclude "it doesn't exist" instead of "maybe I'm looking in the wrong spot."
tags: [ai-engineering, developer-productivity, problem-solving]
lang: en
abbrlink: fruit-puree-and-ai-same-problem
toc: true
---

> **TL;DR**: Whether you rely on experience or AI, if you skip the step of understanding the problem first, you end up searching in the wrong place. It's not about which approach is smarter—it's about getting things done.

## The Dumb Way: Scanning Every Aisle

Last weekend I went to the store to buy fruit puree for my baby. My dad had been there several times before and couldn't find it. He told me they were probably sold out.

When I got there, I used the dumbest method possible—scanning every single aisle. No skipping, no guessing, no relying on intuition about "which section it should be in." Around 70% through, I started wondering if they were really sold out. But since I'd committed to a sequential search, I had to scan everything before drawing a conclusion.

Five minutes later, I found it. My dad was surprised: "Why would they put it there?"

Exactly—it was somewhere outside what his experience predicted. He wasn't careless. He was too confident he knew where things would be, so his search space was narrowed from the start. When he didn't find it, his conclusion was "they're sold out," not "maybe I looked in the wrong place."

His problem wasn't that his method wasn't smart enough. It was that he didn't first look at the problem itself—this store might not be organized the way he assumed.

## Using AI Falls Into the Same Pattern

I think a lot of people using AI fall into the exact same pattern. And the root cause is identical: jumping straight to a solution without first understanding the problem.

We care too much about whether the solution looks smart or efficient, and lose sight of the actual point—solving the problem. The means becomes the end.

A few things I've seen at work:

Something that would take five minutes to copy-paste manually, but someone insists on using an AI agent with browser automation, spending twenty minutes plus a pile of tokens. I wrote about [an even more extreme case](/en/posts/a-week-vs-half-an-hour/)—a colleague spent a week using an AI Agent for web scraping while I wrote a Playwright crawler and finished in half an hour. An answer that's five minutes of reading documentation away, but someone spends an hour wrestling with an LLM, only to discover it was hallucinating. A two-line change in a known file, but the coding agent still thinks for a minute and then asks if you want to proceed.

The last example happened on my team. An engineer got stuck on a library's API and went back and forth with an LLM for over an hour—nothing worked. I later found the official docs through Google and solved it in five minutes.

These aren't AI problems. We're skipping a step—figuring out "what problem am I actually solving, and what level of tooling does it need?"

## Experienced People Are More Prone to This

Here's the irony: experienced people are actually more likely to make this mistake.

Beginners don't know any better, so they dutifully use the dumb methods—reading docs, trying things step by step, Googling error messages. Not always fast, but guaranteed to get somewhere.

Experienced people are different. We have intuition, pattern recognition, and a whole arsenal of tools, so we habitually skip the "slow" steps. My dad has been to that store hundreds of times—of course he thinks he knows where things are. Engineers who are fluent with LLMs naturally default to throwing problems at them.

The thing is, whether you're relying on experience or AI, if you skip the step of understanding the problem itself, you might be searching in the wrong space. When you can't find the answer, you'll conclude "it doesn't exist" or "this problem is hard," not "maybe I'm looking in the wrong place."

## Deliberate Exploration vs. Lazy Defaults

Does this mean you should always use the dumb method? Of course not.

I spend a lot of time exploring AI's capability boundaries myself. When Claude Code first came out, I deliberately stopped using Cursor and did everything through Claude Code—it was uncomfortable at first, but it was a conscious choice. I also tell my team that for certain tasks, I want everyone to deliberately use AI, to figure out exactly what coding agents can and can't do.

But that's completely different from "can't be bothered to think, just throw it at AI."

One is deliberate exploration—you know you're investing time, and the goal is to map the tool's boundaries. The other is default behavior—you skip the thinking and go straight to whatever looks smartest, which ends up being slower.

The way to tell them apart is simple: did you first consider what the stakes are?

Back to the store example. Fruit puree is something my baby needs to eat—high stakes—so I chose the most thorough approach to guarantee a definitive answer. If I were looking for some junk food snack, nice to have but not essential, I'd probably use the "smart" approach too—follow my gut for one quick pass, and if it's not there, move on.

Work is the same. Estimate how long each task should take. If you've been going at it with AI for a while and still can't get it done, accept it and use the dumb method. It's not about which approach is smarter. It's about getting things done.

## The Point Is Getting Things Done

If you need to find information, the point is finding the information—not "using an AI agent to find it." If you need to learn a library's API, any means will do—read the docs, ask someone, Google it, use an LLM—the point is understanding the API.

Don't fixate on the smart approach, look down on the dumb method, spend more time as a result, and then let "AI couldn't handle it" become your excuse for not finishing.

AI is great. But before you start, use your experience to consider what approaches are available. Don't treat AI as the only option.
