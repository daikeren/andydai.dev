---
title: "One Week vs Half an Hour: Start With the Goal, Then Choose the Tool"
published: 2026-01-18
description: A colleague spent a week using an AI Agent with Browser Automation to collect fewer than 100 leads. I wrote a Playwright crawler and finished in half an hour. Tools change, but the pattern of "when you have a new hammer, everything looks like a nail" keeps repeating.
tags: [ai-engineering, developer-productivity, ai-agent]
lang: en
abbrlink: a-week-vs-half-an-hour
toc: true
---

> **TL;DR**: A colleague spent a week using an AI Agent for web scraping. I wrote a Playwright crawler and finished in half an hour. Before choosing tools, ask: what am I trying to achieve? AI Agents excel at tasks requiring judgment, not structured scraping work.

Recently while reviewing a colleague's work, I found he spent a week on lead generation. One step was collecting email lists, and he used an AI Agent with Browser Automation to handle it.

I opened his prompt and saw this kind of thing:

> **⚠️ Execution Requirements (Absolutely Must Not Violate)**
> - Absolutely prohibited from stopping to ask the user if they want to continue
> - Absolutely prohibited from asking the user if they really want to continue due to high expert count
> - Absolutely prohibited from asking the user what to do next when partially completing a task
> - ...(ten more rules followed)

Just "absolutely prohibited" appeared over a dozen times—honestly, you don't need to read it all. The point is: he was already fighting the AI Agent's natural behavior. The agent kept wanting to stop and ask questions, so he kept adding rules to prevent it. This wasn't really solving the problem anymore, but constantly patching holes for a potentially wrong tool choice.

The entire prompt had three phases, over 6,000 tokens, a dozen steps, plus various fallback strategies, validation mechanisms, and error handling.

The result? A week of time, tens of dollars in tokens, fewer than 100 leads collected. And this prompt was single-use—next website, next requirement, he'd need to write a new one.

## The Half-Hour Solution

I tried it myself later. The task boils down to: enter list view, collect each detail page's URL, then go in and extract needed content.

I spent about half an hour writing a simple Crawler using [Playwright](https://playwright.dev/):

```python
# 1. First grab the list view and save as JSON
items = await page.query_selector_all('.expert-card')
list_data = [extract_url(item) for item in items]
save_to_json(list_data)

# 2. Then visit each URL from the JSON to grab details
for url in list_data:
    await page.goto(url)
    detail = extract_detail(page)
    results.append(detail)
```

That's it. And this Crawler was also AI-assisted. For this case, having AI write code was more effective than having AI run as an Agent.

## Start With the Goal, Then Choose the Tool

This reminded me of an old problem: we too easily start from "what tools do I have" rather than "what am I trying to achieve."

My colleague used an AI Agent for this because he'd just learned Browser Automation + AI Agent combinations and wanted to try them. I completely understand that mindset—of course you want to use new things you've learned. But the problem is, he didn't first ask: what's this task's goal? What's the most effective way to achieve it?

Starting from the goal, "collect email lists from a website" is most directly solved by writing a Crawler. AI Agents aren't unusable, but they excel at tasks requiring judgment and context understanding, not this kind of fixed-structure, clear-rules scraping work.

## New Hammer, Old Problem

This isn't just about AI Agents. It happens with every new technology: when NoSQL was hot, everyone wanted to shove everything into NoSQL; when Kubernetes emerged, side projects with three containers had to run on K8s.

Tools change, but this pattern keeps repeating: when you have a new hammer, everything looks like a nail.

Next time before starting something, ask yourself: what am I trying to achieve? Then ask: what tool is most suitable? Reverse this order, and you'll easily take the long way around—just like my colleague this time.
