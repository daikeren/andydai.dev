---
title: Multi-Agent Systems Scale Closed-World Work. Product Delivery Is Different.
published: 2026-07-25
description: Cursor's Agent Swarm rebuilt SQLite in a controlled environment. Product delivery has moving acceptance criteria, shared state, and human decision gates. Before adding agents, find the scarce capacity.
tags: [ai-engineering, multi-agent, developer-productivity]
lang: en
abbrlink: multi-agent-closed-world-open-world-delivery
toc: true
faqs:
  - question: Why don't multi-agent systems always speed up software delivery?
    answer: More execution agents increase execution supply and work in progress first. Agents can also expand validation when acceptance criteria are stable, but release, scope, and priority decisions still depend on people with the context, authority, and responsibility to make them. More code, specs, or findings do not automatically become delivered outcomes.
  - question: What is the difference between a closed-world problem and open-world delivery?
    answer: In a closed-world problem, the objective, primary world state, and acceptance function remain relatively stable during execution. In open-world delivery, requirements, shared state, reviewer judgment, and human decisions can keep changing what counts as done.
  - question: When should a team add more agents?
    answer: Add execution agents when execution is the main queue, tasks can be split independently, acceptance criteria are stable, and review, CI, and decision-making still have spare capacity.
---

> **TL;DR**: Multi-agent systems work best when the objective and acceptance function stay relatively fixed and feedback loops are fast, cheap, and repeatable. Cursor's Agent Swarm showed that two systems can pass the same tests while one writes 6.5 times more code. Product engineering has a different shape: requirements, remote state, review, and human judgment can rewrite the acceptance function while work is in progress. Agents can scale execution and much of validation quickly. Release, scope, and priority decisions still belong to people. When the problem keeps moving, those decisions cannot happen only once at the beginning.

The most interesting number in Cursor's recent [Agent Swarm experiment](https://cursor.com/blog/agent-swarm-model-economics) was not 68,000 commits.

In the Fable 5 mix, both the old and new swarm eventually passed the full held-out SQL test suite. The outcome was the same. The old version used 64,305 lines of engine code; the new one used 9,908. That is a 6.5× difference. The Opus mix was even more extreme: the old system wrote more than four times as much code, 19,013 lines, and stopped at 97%. The new system passed 100% with 4,645 lines.

The same outcome can require very different amounts of output.

The 68,000-commit number came from a different deep dive. Before Cursor stopped the old Grok 4.5 run at just under two hours, it had produced 68,000 commits at roughly 70 times the pace of the new version. It also accumulated more than 70,000 merge conflicts. This was not the result of every old configuration, but it demonstrated one thing cleanly: activity can explode while the system fails to converge.

In [Cursor's own retrospective](https://cursor.com/blog/agent-swarm-model-economics), the improvement did not come from adding more parallelism. The team redesigned task decomposition, shared decisions, version control, merge reconciliation, and stacked review. Cursor even argues that the main reason swarms can scale may be context efficiency, not parallelism itself.

It is a strong experiment. It also solves a problem with a different shape from the delivery problems product teams face every day.

## Separate the External Acceptance Signal From the Internal Correction Loop

Cursor gave Agent Swarm a hard task: implement SQLite from scratch in Rust using only an 835-page manual. The agents had no source code, SQLite binary, test suite, or internet access. This was not a toy benchmark.

The world still had clear boundaries. The objective was relatively stable. The repository was the primary world state. External evaluation came from millions of SQL queries with known answers. The agents could not see the held-out test suite. Cursor says they did not even know it existed. Those tests were a stable, machine-verifiable acceptance signal outside the run, not feedback available to the agents during execution.

Cursor did more than check the score. After each run, people inspected the code and execution record for cheating, shortcuts, or implementations that happened to cover only the tested areas. Human judgment was still involved. But those audits asked whether the swarm had faithfully completed the original task. Cursor did not describe priorities or live state rewriting the objective halfway through a run.

The internal correction loop came from a different set of mechanisms. The compiler propagated intentional breakage into dependent code. Version control exposed collisions. Shared documents preserved design decisions. A reconciler resolved conflicts between planners. Review agents looked for accumulating errors through different lenses.

The external acceptance signal and the internal correction loop are different things.

I call this a **closed-world problem**. Closed does not mean easy, and it does not mean coordination is free. It means the objective, primary world state, and acceptance function stay relatively stable during execution. When internal feedback is also cheap, fast, and repeatable, agents can explore many paths in parallel and keep eliminating the wrong ones.

This still has a cost ceiling. Different model mixes in the new swarm produced similar quality at costs ranging from $1,339 to $10,565, almost an eightfold difference. Compute budget can become the practical gate. Model selection is not the issue I want to unpack here. The question is what happens after you can afford more execution: can the team turn it into delivery?

I think of that delivery path as three capacities: execution, validation, and decision. Cursor shows that agents can expand execution, and validation when acceptance criteria stay fixed. Open-world delivery is harder because decision capacity keeps getting triggered and someone must remain accountable for it.

## Cursor Says the Spec Becomes Scarce. The Difference Is Whether It Moves.

Cursor gets close to this issue in the final section of its post. The team argues that swarms move the unit of work from a file or feature to a spec, making an accurate description of intent the scarce input. A planner turns the goal into a task tree, then lowers each layer into executable work.

I agree. Decision capacity includes describing intent, setting scope, and choosing trade-offs.

But Cursor's 835-page spec remained relatively fixed after the run began. Product specs move.

A coding task may be bounded: fix one bug, add a set of tests, or implement an existing design. Delivering it also depends on state outside the repository. A customer priority changes. A teammate ships a hotfix in the same module. Another PR invalidates an assumption. Requirements move. Reviewers disagree about severity. Or someone uses the product and realizes the written definition of done was wrong.

TDD, spec-driven development, and explicit acceptance criteria can close the feedback loop inside the coding boundary. They cannot freeze the world outside it. The tests may still pass after the problem has stopped being the problem the team most needs to solve.

That is **open-world delivery**. Review does more than check whether an agent answered the question correctly. It may decide that an apparently complete change cannot ship, or collapse several findings into one actual blocker. Live-state verification does more than confirm whether a patch applies. It may show that the premise is stale. Human acceptance is not just a final approval click. Seeing the spec or UI can cause people to redefine the scope.

In a closed world, the acceptance function mainly scores the answer. In an open world, validation can rewrite the question.

I have not seen a general solution to this. Live-state checks, shorter execution batches, frequent rebases, and human checkpoints all reduce stale work. They cannot automatically decide what to do when a customer priority conflicts with the original spec. They also cannot guarantee that the world will stop moving once an agent starts. Monitoring can show sooner that the assumptions no longer hold. It cannot make that decision for the team.

## The Agent Run That Explained the Problem Best Left No Diff

I reviewed two batches of parallel workstreams I had run on the same day. The clearest example was not a polished implementation. It was a `no change` result.

An automation was supposed to handle several changes that were still in progress. It first checked the live remote state, discovered that the relevant fixes already existed, and stopped. No diff. No commit. No push.

Its activity was almost zero. If the goal was to avoid duplicating work or overwriting someone else's changes, it delivered the right outcome.

Across the two batches, I had seven root workstreams and 15 child agents covering implementation, review, QA, specs, and automation. Those numbers establish the scale of the illustration. This was not a controlled experiment.

What it showed me was simple: parallelism increased execution supply and work in progress first. Accepted results still moved repeatedly through `execution → review → fix / re-review → CI / live state → human accept`.

Another review-heavy workstream made the distinction even clearer. Instead of generating more implementation output, I assigned five agents to different review lenses. After several rounds of severity calibration, only one issue needed to block the release. We fixed it, the re-review found no P0–P2 issues, and CI passed. The extra agents helped because they increased validation capacity.

I have used the activity, output, and outcome distinction before when examining productivity claims. Here, the point is narrower: commits, threads, and findings are traces of work. A team needs outcomes that make it through the acceptance path.

## Agent-Scalable Capacity Still Converges on Human Decisions

The idea that throughput is constrained by the scarcest stage is not new. Theory of Constraints and queueing theory have dealt with this for decades. When a downstream queue cannot absorb the work, speeding up an upstream station does not increase system throughput. It creates more inventory in front of the bottleneck.

Multi-agent systems bring the same picture into software delivery. The inventory is code, specs, and findings that have not been reviewed or accepted, and may already rest on stale assumptions.

AI does not remove the constraint. It moves it.

I now split the delivery path into three capacities:

- **Execution** turns a known direction into code, tests, documentation, and fixes that can be evaluated.
- **Validation** uses review, CI, security checks, browser QA, and live-state checks to decide whether the output is reliable.
- **Decision** determines which direction is worth pursuing, which risks are acceptable, and what counts as done now.

Execution is the easiest to scale. When acceptance criteria are stable, review agents, reconcilers, and stacked lenses can also expand validation. My review-heavy workstream was one example.

How far validation can scale depends on how fixed the acceptance criteria are. With stable criteria, review verifies. When the criteria move, part of review is deciding what the criteria should be. Severity calibration showed the difference: finding issues was validation; deciding which risk had to block the release consumed decision capacity. Teams underestimate this because it often arrives wearing the clothes of review.

Execution and validation eventually converge on the same endpoint. Someone must decide whether a change can ship, whether the scope should move, and which priority comes first. That person must also be accountable for the result. In a closed world, much of this can be front-loaded into the spec and acceptance criteria. In an open world, reality keeps rewriting the problem, so the same decisions return throughout execution.

That is the asymmetry. Spawning ten workers or reviewers takes moments. It does not create ten decision owners with the context, authority, and responsibility to make the final call. Adding a senior engineer is slow. Their scarce contribution is not only execution. It is the part where they can, will, and are allowed to decide.

This is not only a model-capability problem. An agent can recommend a release. Accountability does not spawn with it. Someone in the organization still owns the consequences of an incident, customer impact, and the trade-off.

If PRs already wait for review, CI feedback is slow, specs keep moving, or every release decision waits for one person, more execution agents will only add to the WIP in front of the gate.

You will see more output. Delivered throughput may not move.

## “This Is Just Normal Software Delivery”

Yes. Review, CI, scope changes, and human approval already existed. My workstream review does not prove that parallel agents created serial gates, or that the same work would have moved faster sequentially. Cursor's SQLite workload cannot predict conflict rates in ordinary product teams either.

The claim here is much narrower. Multi-agent systems do not remove existing constraints. Execution and validation can scale faster than human decision capacity. In an open world, the acceptance function also keeps moving, so the constraint anchored in people appears sooner.

Multi-agent systems did not create these gates. They make you reach them faster.

## Find the Queue Before You Add Agents

Before turning one agent into five, I now ask:

1. **Where is the longest wait: execution, validation, or decision?** Look at the queue, not the tool getting the most attention.
2. **Can the acceptance function change during execution?** Work that can be scored repeatedly by a test suite is safer to parallelize than work whose requirements and shared state keep moving.
3. **Can someone else change the shared state while the work runs?** If a teammate's hotfix, another PR, or the live environment can invalidate the premise, shorten the batch and synchronize more often. More workers alone will not help.
4. **Which capacity will the next agent expand?** If execution is already outrunning review, assign the next agent to validation instead of producing another output.
5. **When is `no change` the correct outcome?** A system that rewards only commits treats avoided duplication, stopped work, and narrowed scope as failures.

If execution is the longest queue, add execution agents. If output is already piling up in review, add validation capacity. If everyone is waiting for requirements or release judgment, you have three options: distribute release authority to more people who have enough context and will own the result; front-load repeated decisions into severity rubrics and release criteria; or reduce scope and batch size so each change requires fewer decisions.

Do not manage throughput by counting agents. Manage the scarcest gate.
