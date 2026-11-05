---
title: '"Will Our Data Leak?" Is Only the First Layer of AI Agent Security'
published: 2026-11-05
description: The first question executives ask about AI agents is whether their data will leak. It's a fair question, but it's only the first of three layers. The risk that actually bites is what the agent can access and do, and that's controlled by permissions, not prompts.
tags: [ai-adoption, ai-security, ai-agent]
lang: en
abbrlink: data-leak-is-only-layer-one
toc: true
faqs:
  - question: Where should a company start when evaluating AI agent security?
    answer: Split the risk into three layers. Does the vendor train on or leak your data? Does the agent say wrong things? What can the agent access and do? The first layer gets asked the most and is usually the easiest. The third gets asked the least and is often already live before anyone notices.
  - question: Why can't a system prompt just tell the agent not to leak data?
    answer: A prompt is a request, not a constraint. If the content the agent processes contains hidden instructions, it may follow them. Real limits belong in the tool and permission layer, for example by having the system inject the user's identity so the agent can't decide whose data to look up.
  - question: Which AI agent actions need human approval?
    answer: Sort them by whether a mistake can be undone. Reversible actions (two-way doors) can run directly. Refunds, deletions, and outbound emails can't be taken back, so a human should approve them before they go out.
---

> **TL;DR**: "Will our data leak?" is the first thing executives ask about AI agents. It's only the first of three risk layers, and usually the easiest one to close. The layer that actually bites is the third: what the agent can access and what it can do. That layer is controlled by permission design. A prompt telling the agent to "be careful" doesn't control it.

## Executives ask about layer one

When I talk to executives about deploying AI agents, the first question is almost always the same: "Will our data leak?"

It's a fair question. But if the evaluation stops there, it misses the things that are far more likely to go wrong.

I split AI agent security into three layers. Each one needs different controls and different questions.

## Layer 1: Does the vendor train on or leak your data?

This is the most-asked layer, and usually the easiest. Enterprise plans from the major vendors spell out in the contract that they don't train on your data, where it's stored, and how long it's kept. Read the terms, confirm those points, and this layer is mostly handled.

When this layer does fail, it's usually not the vendor. It's employees doing work tasks in personal accounts because the company never gave them an approved tool. That's a separate post.

## Layer 2: Does it say the wrong thing?

A support agent quotes the wrong refund policy. It promises a delivery date nobody agreed to. This happens far more often than a data leak.

Two things control it. First, where answers are allowed to come from: only approved SOPs, policies, and FAQs, with "I don't know" or a human handoff when the answer isn't there. Second, testing: run real customer questions before launch, and rerun the same set every time you change the config or swap a document.

Layer 2 risk is saying something wrong. It costs trust and support tickets. Annoying, but it stays inside the conversation.

## Layer 3: What can it access, and what can it do?

This layer gets asked the least, because most people still picture "a chatbot that talks."

But the moment your support bot can answer "where's my order?", it's querying your order system and reading customer records. It's not just talking. It's accessing data. Let it issue refunds, change addresses, or send notification emails, and now it's acting.

That's where the real leak often happens. Not the model vendor training on your data. Customer A asks a question, and the bot pulls up customer B's order.

### A real example

In April, Capsule Security disclosed two flaws, one in Microsoft Copilot Studio and one in Salesforce Agentforce ([CSO Online](https://www.csoonline.com/article/4159079/copilot-and-agentforce-fall-to-form-based-prompt-injection-tricks.html)).

The attack was simple. In the Copilot Studio case, an attacker hid instructions in an ordinary SharePoint form field, like a comments box. When the agent processed the form, it treated that text as instructions and emailed customer names, addresses, and phone numbers from connected SharePoint lists to an outside party. Agentforce was similar: instructions hidden in a public lead form ran when an employee asked the agent to process the lead, and CRM records got pulled and sent out.

Microsoft patched it and issued a CVE. Salesforce's response is worth reading: it called the exfiltration "configuration-specific" and tied it to optional human-in-the-loop controls.

These are two of the biggest vendors, running top-tier models. Nobody trained on anyone's data. Layer 1 held fine. Layer 3 failed: the agent could read customer data and send email on its own, with no checkpoint in between.

So when an executive sees a headline like this and asks me whether AI is unsafe, my answer is that the permissions weren't designed.

## How to control layer 3

At Codeer we build a platform for putting AI agents in front of customers, so this layer is our daily work. Here are two things we actually do.

### The system injects identity. The agent doesn't fill it in.

Say looking up an order requires the customer's email. The obvious approach is to let the agent figure out who it's talking to from the conversation and pass that email into the query.

We don't do that. When a tool is configured, the email field is a variable like `{{user.email}}`, and the system injects the signed-in user's identity at the tool-call layer. The agent never gets to decide whose order to look up, so it can't get it wrong, and it can't be tricked into faking it.

That's what "put the limits in the permission layer" means in practice. You can write "only look up this customer's own orders" in the prompt a hundred times. A prompt is a request, not a constraint. The example above already showed it: if the content the agent reads contains hidden instructions, it may follow them.

### Decide approvals by whether a mistake can be undone

The second is approval. Which tools can the agent run on its own, and which wait for a human to confirm?

We sort them into two-way doors and one-way doors. Looking up an order, checking stock, answering a policy question: if it's wrong, you just look again. Those can run directly. Refunds, deleting data, emailing someone outside the company: once done, they can't be taken back. Those need a human to approve before they go out.

There's no universal answer here. Every tool needs its own discussion: what happens if this goes wrong, who gets hurt, can we reverse it? Some cases genuinely don't matter if they're wrong. Some absolutely can't be wrong. Talk it through per tool, instead of flipping everything on or off right before launch.

Require approval for everything and the agent is useless; customers wait forever. Require approval for nothing and, like the example above, that checkpoint is missing.

## Don't swing to the other extreme

It's tempting to conclude that AI agents are too risky to touch for now.

That's too quick. Layer 3 risk is the same kind of problem as giving a new part-time hire a system account: what can they see, what can they do, what needs a manager's sign-off? Companies already know how to manage permissions for people. They just haven't realized agents need the same design.

And the reverse: a clean vendor contract doesn't mean security is done. Passing layer 1 means you passed layer 1.

## Four more questions for your next evaluation

Whichever vendor you pick, or if you build it yourself, ask four more questions besides "will our data leak?":

1. Whose identity does it use when it queries data? Is that identity set by the system, or decided by the agent? How far can it see?
2. Can its answers come only from documents we approved?
3. After a config change, can we rerun the same set of real questions?
4. Which actions stop and wait for human approval before they go out? Who decided that list?

If you can answer all four, you've actually got the risk under control.
