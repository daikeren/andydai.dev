---
title: Code Is Cheap. Main Isn't.
published: 2026-08-11
description: Coding agents have lowered the cost of rewriting a PR. When the contract, tests, and knowledge from the first attempt can be preserved, bad architecture should not enter main just because the code is already written.
tags: [ai-engineering, coding-agent, code-review, software-architecture]
lang: en
abbrlink: code-is-cheap-main-is-not
toc: true
---

> **TL;DR**: Coding agents have made PR rewrites cheaper. Bad architecture is still expensive once it enters main and becomes a constraint shared by new callers, production data, operations, and the team's mental model. When the outcome, contract, and behavioral tests are already settled, the most valuable part of a first implementation may be the knowledge it uncovered. The implementation can still change. The standard for code review has not moved; we just have less reason to compromise on architecture because “the code is already written.”

I recently reviewed a PR that changed a piece of routing state.

That state decides which processing path a request takes next. I expected a gate near the front of the system to read the current state and make the decision, with downstream flows consuming the result. Instead, the same state check appeared in three kinds of places: a synchronous API entry point, a deferred worker, and a read path used for operational visibility. Each flow had also grown its own exceptions.

This was not a matter of extracting one more function. Ownership of the decision had spread across the system. Every new entry point would need another copy of the rules, and every rule change would depend on someone remembering to update all of them.

I could have produced a list of incremental fixes and helped get the PR into mergeable shape. After discussing it with my teammate, I asked them to preserve the same outcome and rebuild it from a clean base.

A few years ago, under the same schedule pressure, I probably would not have made that call.

## Merge Turns an Implementation into a Team-Wide Constraint

Code in a PR is still a local artifact. It has a boundary. We can close the PR, rebuild it, or replace its data flow without a live migration.

Merge is a state transition.

Once the code enters main, other branches build on it and new callers begin to depend on it. After deployment, data gets written according to its representation. Tests, documentation, metrics, and operational procedures gradually treat it as fact. Engineers learn both how the feature works and which scattered entry points they must inspect when it fails.

In the opening example, three kinds of entry points each interpreted the state for themselves. When a fourth flow arrives, the natural move will be to copy the pattern again. The next rule change no longer has one decision owner; it has a growing search checklist. A coding agent can help with that search, but dynamic calls, historical exceptions, inconsistent naming, and external contracts can still hide dependencies that neither the agent nor the prompt knows exist.

That is why main remains expensive. Each feature must understand and extend the existing shape. Internal representation gradually becomes a compatibility and migration contract, while workarounds become normal usage for later callers. Debugging, on-call response, and recovery must reconstruct a causal chain spread across multiple places. A real refactor must coordinate live data, rollout order, and other work already in flight.

Coding agents can execute those changes. They cannot make accumulated dependencies, history, and blast radius disappear. Faster code generation does not make production state reversible, and it does not create more people with the full context, authority, and responsibility to change it safely.

The old default was to fix the PR until it could merge, then open a refactoring task. Anyone who has worked on an engineering team knows what usually happens next. Product requests and customer problems keep arriving. The task keeps moving down the list until the scattered logic has been copied a few more times and the team can no longer tolerate it. The cost of main does not wait. It compounds.

## Coding Agents Change the Cost of a Rewrite

Rebuilding a PR used to mean asking an engineer to spend several more days reconstructing context and reimplementing edge cases they had already found once. Even when a reviewer knew the architecture was weak, schedule pressure and sunk cost pushed the team toward incremental fixes.

Now we can give the outcome, constraints, and tests directly to a coding agent. The agent does not need to rediscover the task. It can explore a different ownership model, representation, or state model inside the same acceptance boundary. Implementation still costs time, but it has become much easier to regenerate.

That makes the submitted PR a better moment for another architecture review. The first implementation exposes the real callers, transaction boundaries, and state propagation. Reviewers no longer have to judge a proposed shape from a plan alone. They can trace actual flows, see where decision ownership has spread, and test whether an alternative architecture would really hold.

In the second version, the state rule moved back into one policy source and one canonical resolver. The synchronous API and deferred worker kept their own transactions, locks, and side effects, but both read the current state at execution time and hand the decision to the same resolver. The operational read path stopped maintaining a separate policy and projected its result from the same source of truth. A fourth flow can now adopt the same contract instead of implementing precedence again.

The full run—from the agent's first repo read through implementation, backend and frontend validation, fresh-context review, fixes for four issues involving race conditions and projections, and final revalidation—took about 98 minutes of wall-clock time. That number does not prove total delivery will always be faster. It shows that once the outcome and guardrails are fixed, a bounded rewrite can reach a reviewable state in one complete agent run.

The second version still needs a full review. Tests reduce uncertainty about behavioral regression. They cannot tell a reviewer whether ownership is correct, concurrency is safe, or a migration will work. They cannot take responsibility for the production outcome. For a while, the reviewer may even need to hold both the first version's problems and the second version's tradeoffs in mind, making validation more expensive.

The scarce resource is moving from code production to judgment.

That is also why architecture review should come first. If line-level code can be regenerated, reviewer attention should not be spent polishing names, local abstractions, and patches inside the wrong shape. First ask whether the findings are independent mistakes or symptoms of the same structural root cause. If the shape holds, continue with normal implementation review.

## The First PR's Most Valuable Output May Not Be Its Code

Asking for a rewrite sounds like throwing away all the work that came before. But the first PR already did something important: it turned an ambiguous requirement into a concrete contract.

The first implementation discovered the real entry points, edge cases, and failure behavior. It also left behind a reasonably complete set of tests. None of that learning has to remain tied to the original architecture.

```text
Keep:
- outcome
- constraints
- edge cases
- behavioral tests

Choose again:
- ownership
- boundary
- state model
- implementation
```

I was comfortable asking another coding agent to start over largely because the original PR already had tests. As long as those behavioral tests remained unchanged, the second implementation had to preserve the behavior we had already defined. Ownership, state model, and internal data flow could change. The outcome could not quietly change with them.

Tests should make implementation easier to replace.

The main risk is that the same agent produces both code and tests from the same misunderstanding. They can agree perfectly while the entire suite remains green. For tests to act as guardrails, they must anchor to externally observable behavior and an independently confirmed contract, not to the first implementation's helpers or data model. Unchanged tests show that the rewrite preserved those recorded behaviors. They cannot prove that the contract itself was correct.

## Rewrites Are Still a Social Decision

If a teammate wrote the PR, “stop patching this direction and rebuild it” is never only a technical decision. To the author, it can sound like a rejection of the work they have already done. Coding agents reduce the time required to regenerate code. They do not automatically reduce the communication cost of that conversation.

A reviewer who says only “I prefer a different architecture” can easily dress a power difference up as technical judgment. A rewrite request needs a specific explanation: which correctness property, ownership boundary, data flow, or failure mode cannot hold reliably; why local patches would keep multiplying duplicated truth; and roughly where the decision owner and boundary of a feasible alternative would sit.

The reviewer must also say which contracts, tests, and other knowledge from the first version will be preserved, and which observable behaviors will prove that the second version did not regress. If you ask an author to give up an implementation, you are responsible for showing that the knowledge it produced will not be discarded with it.

That is a fairer way to understand the first PR. Its architecture may be wrong, but it can still uncover requirements, edge cases, and guardrails for the team. The reviewer is replacing a shape that should not enter main, not erasing all the work the author completed.

## First Ask Whether the Architecture Holds

Coding agents have not changed the standard for code review. Centralized logic, a clear source of truth, and appropriate ownership were always part of reviewing code. What changed is that a bounded rewrite is now a more realistic option.

When I review a non-trivial PR, I start with four questions:

1. **Are these findings independent mistakes, or different symptoms of the same root cause?** If every fix patches the same ownership or state-model problem, pause the line-level review.
2. **Where are the source of truth and decision owner?** Can the next entry point naturally reuse them, or will it need another copy of the rules?
3. **Do the outcome and contract have an independent guardrail?** Do the tests cover externally observable behavior, or merely repeat implementation assumptions?
4. **Is there a bounded alternative?** Keep and fix remains an option. Eliminate state, move ownership, change representation, or rebuild a coherent slice only when a structural root cause is real.

If the current architecture holds, make the incremental fixes. A large diff, an inelegant design, or a reviewer preferring another pattern does not justify a rewrite.

If the shape cannot reliably preserve a required invariant, and local fixes will only spread the problem further, do not pretend the architecture decision is over just because the code has already been written.

## The Best Rewrite Happens Before Review

Teams should not take this argument as permission to rewrite PRs routinely. Architecture judgment should move earlier, but it does not end when a plan is approved.

The planning stage should establish the source of truth, ownership, state transitions, and invariants that must hold. If those questions appear for the first time in review, the earlier decision work was incomplete. But the real caller distribution, transaction boundaries, and path of state through the system often become fully visible only after implementation. Finding them during review is normal. Review exists partly to test architectural assumptions against implementation evidence.

This connects to an argument I made earlier about what humans should review in an AI coding workflow: plans or evidence. Routine, reversible, easily verified tasks do not always need human approval of the implementation plan. Work should stop at a decision boundary first when it is architecture-heavy, when a decision would split the data contract, or when a wrong direction could invalidate the entire diff. Settle what can be known during planning, then let the agent generate code. Once the implementation exists, check whether those assumptions actually held.

The goal is not zero rewrites. It is to avoid rewrites caused by decisions that should have been settled earlier. When implementation exposes a new structural root cause, do not trade a bounded rewrite you can do today for a refactoring ticket nobody will pick up.
