---
title: "Redesign One Process Around AI: What We Handed Over to Agents"
published: 2026-11-27
description: Bolting AI onto an old process mostly burns more tokens. Redesigning a process around AI means changing who judges, what agents can see, and what they can touch. Here is how we did it for software development at Codeer, plus the two questions managers ask most.
tags: [ai-adoption, engineering-management, ai-engineering]
lang: en
abbrlink: redesign-one-process-around-ai
toc: true
faqs:
  - question: What is the difference between adding AI to a process and redesigning a process around AI?
    answer: Adding AI keeps the old division of work, reviews and permissions, and swaps a few steps for AI. Redesigning assumes agents take part in the whole job, then decides again which judgments people make, which move to automated checks, and what agents can see and touch.
  - question: Can a company start with AI before its data is ready?
    answer: Yes. We build a quick first version for the customer to try while preparing the data together with them. You usually can't see where the data gaps are until something works.
  - question: How should a manager think about the risk of AI giving wrong answers?
    answer: Compare it with today. The people doing the job now make mistakes too. The difference is that every AI answer is logged, so you can find errors and fix them. Start with a low-risk scope and agree on an internal testing process.
---

> **TL;DR**: Most company processes grew up in a world without AI. Bolt AI onto them, keep the same roles, reviews and permissions, and you mostly burn more tokens. Redesigning a process changes three things: which judgments move from people to checks, what agents can see, and what agents can touch. The first process we redesigned at Codeer was software development. Code that passes behavior tests and AI review can merge, and agents can read production logs and access a restricted production database. You can't rebuild a whole company at once. One process is enough to start.

## Bolting on vs. redesigning

Electrification is the classic example. Factories first swapped steam engines for electric motors and kept the old floor layout. Productivity barely moved. The gains came decades later, once factories were redesigned around electricity.

AI adoption has the same shape. Most companies weren't designed for AI. How teams split work, how processes flow, who makes the call—all of it assumes no AI.

So separate two things:

- **Bolting on**: keep the roles, reviews and permissions, and swap a few steps for AI. Engineers write code with AI, but every line still gets reviewed the old way. Support drafts replies with AI, but a person still checks each one.
- **Redesigning**: assume agents take part in the whole job, then decide again who does each step, who judges, and what each step needs to see.

Bolting on gives you more output at the same cost of judgment. The bottleneck just moves to review. Redesigning means changing trust and permissions. That's harder, which is why fewer teams do it.

Nobody redesigns a whole company at once. We only did one process.

## The process we redesigned: software development

Full disclosure: Codeer is a six-person team building an AI agent platform. Redesigning is much cheaper for us than for a company of hundreds. Being small also makes it easier to see what changed.

We started with software development for a simple reason. Agents keep getting better at coding and debugging. If the process stays "humans write, humans review every line, only humans touch production," the process caps what the agent can do.

We handed over permissions in three layers.

**Layer 1: write and merge.** We trust agent-written code more. If it passes behavior tests and AI review, it can merge. People no longer read every line of every PR. They check whether the behavior was tested and whether risky changes got flagged.

**Layer 2: see production.** Agents can read production logs. Most debugging time goes into gathering context: reading logs, matching them to code, piecing together what happened in what order. Agents do that part. A person gets a connected explanation and decides whether it's right.

**Layer 3: touch data, with limits.** Agents can access a restricted production database. This is the sensitive layer, so "restricted" is the point: what they can see and do is designed up front. It's the third layer from ["Will Our Data Leak?" Is Only the First Layer of AI Agent Security](/en/posts/data-leak-is-only-layer-one/): what an agent can access and do deserves more design time than the model itself.

Put the three layers together and the redesign comes down to two changes:

1. **Which judgments move from people to checks.** "Can this code merge?" used to be a person reading every line. Now behavior tests and AI review handle most of it, and people handle the risky part.
2. **What the agent can see and touch.** An agent that can't read logs can only do small, pre-sliced tasks. Give it logs and limited data access, and it can finish a whole job.

## The org changes too

Once a process is redesigned, the org gets pushed along with it. If I started a company from scratch today, I'd build in three things from day one.

**Hire people who can finish work end to end.** An engineer should be able to plan product, build frontend and backend, and talk to customers. Once agents do most of the middle steps, handoffs become the expensive part. Every handoff loses context.

**Assume agents will access all infrastructure and software.** When you pick tools, set permissions or write docs, ask whether an agent can use them. If only humans can read it, agents can't help.

**Build tools for agents.** Interfaces built for people are often clumsy for agents. We spend time building tools just for agents, so fetching data, running checks and reporting results each have a fixed path.

Most established companies can't do all three right away. But they point the direction: fewer handoffs, more visibility for agents, clear paths for them to act.

## Two questions managers ask most

When we talk with enterprise customers, redesign usually stalls on two questions.

### Shouldn't we clean up our data first?

Many managers assume data has to be ready before AI work can start.

Dun & Bradstreet's Q4 AI momentum index for Taiwan found that only about 9% of companies had fully ready data. Among those, 77% reported broad or significant returns from AI. Among companies with partly ready data, 13% did.

People read this as "get your data ready first." But it's a correlation, not a sequence. Companies with fully ready data may simply be more mature organizations to begin with.

We do both at once. We ship a quick first version for the customer to try, and prepare the data together with them. You usually can't see where the data gaps are until something works. Spend a year cleaning data first, and you may clean the parts nobody needs.

### What if the AI gets it wrong?

A lot of the worry is imagined: "Will the AI company steal our secrets?" "What if the AI gives a wrong answer?" These aren't unreasonable, but they need to be compared with what happens today.

I usually answer in three ways:

1. **Scope a lower-risk area first.** Don't pick a first process where one mistake is a disaster.
2. **Agree on an internal testing process.** Test with real questions before launch, and rerun after every change.
3. **Compare the worry with the status quo.** Say someone worries an AI support agent will answer wrong. If support is handled by junior staff today, they answer wrong sometimes too. When a junior colleague gets it wrong, usually nobody knows. When the AI gets it wrong, every case is logged, so you can find it and fix it.

The third one changes minds most often. Managers tend to compare AI with an ideal that never makes mistakes. Today has never been that good.

## Don't swing too far the other way

It's tempting to conclude "so just hand agents more power." That's too fast.

Every permission we handed over comes with a condition. Merging requires behavior tests and AI review. Production access is limited to logs. Data access is restricted. People still review high-risk changes. As I wrote in ["AI Wrote It" Is Not an Excuse for Bad Work](/en/posts/same-bar-for-ai-output/), the cost of being wrong decides how much human judgment you need.

And the reverse: just because a company can't redesign everything doesn't mean AI adoption is pointless. Redesign one process. Once it works, the next one has a template.

## Four questions before you redesign a process

1. Which judgments in this process do people make today that could become automated checks?
2. What does an agent need to see to finish the whole job, not just a pre-sliced piece?
3. Which permissions can be view-only, which need limits, and which should wait?
4. When something goes wrong, is there a record you can trace and fix?

If you can answer all four, the process is ready to redesign. The one you can't answer is where to start.
