---
title: Personal Software Is Where Coding Agents Will Matter First
published: 2026-07-22
description: I used Codex to build a PreSonus ATOM controller in Swift, a language I barely know. The project showed me why coding agents lower the barrier to personal software without removing production engineering.
tags: [ai-engineering, developer-productivity, coding-agent, side-project]
lang: en
abbrlink: coding-agent-personal-software
toc: true
---

> **TL;DR**: I wanted to know whether the PreSonus ATOM sitting at home could control Codex. I can barely read Swift and had little experience building macOS apps. Codex did almost all of the implementation; I acted more like the product owner and QA. I still use the controller every day, but I only know that it works on my machine. This is personal software, not a production-ready product.

The first time I saw the ATOM's pads blink with the state of my Codex tasks, I was using Codex to build the controller itself. The task on screen was building the controller. The controller on my desk was reflecting the state of that same task back at me.

My first thought was: Codex is really good.

I had no idea whether the RGB part would work. The ATOM is a MIDI controller. Studio One and Ableton can control its lights, but that did not mean I knew which bytes a regular app should send. It also did not mean Codex Desktop would expose task state to an external program.

Before LLMs, I would have started by digging through hardware specs, community discussions, other people's drivers, CoreMIDI, and Codex's local state. Just proving the direction could have taken a full day. For a side project with one user, that was enough cost for me to think, "Maybe never mind."

Personal software only has to answer to its owner. The stakes are lower. That is why I think coding agents will make this category worth building first.

Codex did almost all of the survey work, Swift implementation, tests, and diagnosis. I pressed the hardware controls, watched the screen, pasted logs, and told it whether things actually worked.

## I Don't Really Know How to Build This App

I saw the [Codex Micro](https://worklouder.cc/codex-micro) from Work Louder, remembered that I already had a PreSonus ATOM at home, and asked Codex:

> I have a PreSonus ATOM. Can it replace the Codex Micro from Work Louder?

I have very little macOS app development experience. I can roughly read Swift, but I would not say I know how to write it. I knew an ATOM integration should be possible. I just did not know where to start.

This was also a side project, not something I planned to ship to real customers. It only needed to work for me.

So we split it into two phases. Phase one covered MIDI controls: switching tasks, creating tasks, submitting prompts, dictation, and scrolling. Phase two would read task state and show running, complete, needs input, and error states on the pads.

## My Role Was More Product Owner and QA

Once implementation started, I followed Codex's instructions. I pressed all 16 pads from the top left, then the buttons, then turned all four knobs. It monitored raw MIDI in the terminal and mapped physical positions to MIDI notes and CC values.

It did not even get the physical layout right on the first try. I corrected it with a photo of the device:

> Preset +/- / Focus is one button.

We later confirmed that `Shift` and the small round `Setup` button on the right were physically there but did not send ordinary MIDI messages. The hardware capture had to be the source of truth.

Codex researched the protocol, wrote Swift, and ran the tests. I pressed the hardware, watched the screen, and replied with "better" or "no improvement." My role was much closer to product owner and QA.

The work that took the most time came after Codex said it was done and I tried using it. One problem lived in the hardware, another in the app, and a third was not technically a bug at all.

## All the Tests Passed. The Hardware Still Broke.

When RGB support was finished, all 67 automated tests passed. The release build succeeded. Both Codex state and the ATOM reported that they were connected. Then I pressed a pad and nothing switched:

> Hmm... task switching doesn't seem to work? Pads 1–6 don't switch to their pinned threads. Nav Up/Down works, though.

The raw MIDI monitor revealed the problem. When the ATOM entered Native RGB mode, its pads moved from MIDI channel 10 to channel 1. The hardware map only accepted channel 10, so enabling RGB caused every pad input to be filtered out. The navigation buttons were already channel-1 CC messages, which is why they kept working.

Knob 2 produced a different failure. The terminal kept printing:

```text
knob2 -> content.scrollDown trigger dispatched
knob2 -> content.scrollUp trigger dispatched
```

The screen did not move.

> The log shows scroll up and scroll down events, but the content isn't scrolling.

It turned out that a successful `CGEvent.postToPid` call did not mean Electron had consumed the scroll event. The final implementation sends a system scroll event to either the transcript or sidebar while Codex is in the foreground. If Codex is in the background, it does nothing rather than risk scrolling another app.

`Dispatched` only proved that the program reached the dispatch path. Without the physical setup, we would have called both features done.

## Some Features Just Couldn't Be Done

Push-to-talk took more attempts than any other feature. The ATOM's Record button sent MIDI events immediately on both press and release. The controller log also showed `holdEnd dispatched`. But releasing the button did not stop dictation immediately the way a physical keyboard did.

Codex changed the implementation. I tested it. It tried modifier lifecycles, two toggle events, a complete keyboard chord, restarting Codex, and finally asked me to run A/B tests with the keyboard. My answers stayed roughly the same:

> No improvement.

> The keyboard stops immediately.

> The toggle is immediate from the keyboard.

> It looks like a simple toggle works, but push-to-talk is still weird.

We eventually confirmed that the native Codex Micro does not simulate a keyboard shortcut. It uses internal start and stop events in Codex Desktop. External apps do not have a stable API for the same path.

So the controller does not have true push-to-talk. Record became a press-only dictation toggle: press once to start, press again to stop. Release, focus loss, disconnect, and shutdown do not send an extra toggle.

## The Green Light Lasted 30 Seconds. The Product Meaning Was Still Wrong.

After a task completes, it quickly moves from `active` back to `idle`. The first version added a 30-second latch so the green light would not disappear immediately. The behavior was stable and the tests passed, but the light still felt wrong:

> Does keeping it green for 30 seconds actually make sense? It feels like it should stay green. What does Codex Micro do?

If green means "this task is done and waiting for me," why should it stop reminding me after 30 seconds when I still have not looked at it?

Checking Codex Micro's behavior clarified the product semantics. Green means `unread`, not `recently completed`. A completed task stays green until I actually open it. Codex later found the unread state stored by Desktop and replaced the timer.

This is also why I describe my role as product owner. The code can be working while the product behavior is still wrong.

These failures share one property: code and tests alone could not expose them. Someone had to connect the hardware, watch the Codex UI, and decide what a light meant to the person using it. A large part of production engineering is defending that line.

## Personal Software and Production-Ready Products Are Different Things

The biggest opportunity I see in coding agents is making software for yourself easier to build. Codex ATOM is exactly that. I am the user. The environment is my computer. When something breaks, I know the workaround. Restarting a process is acceptable.

I would never call this production ready. I only know that this version works on my machine. A different Accessibility permission setup, Codex Desktop version, or MIDI firmware could break it on someone else's computer.

Real customers will not inspect raw MIDI in a terminal with you. They will not accept "the author restarted the process" as a recovery plan. Coding agents can help more people build software for themselves. Production-ready apps still need developers who know how to cross the rest of that gap.

This is why I roll my eyes at claims that coding agents mean "SaaS is dead" because every company will build its own software. That argument collapses "it runs on my machine" into "you can hand it to strangers and expect it to keep working." The failures above are the production engineering hidden between those two statements.

## It Is Still on My Desk

This side project is genuinely useful to me. The feature I use most is pinned-task switching. I keep my main work threads pinned, so switching tasks and seeing their status in hardware matters. The sidebar is small and easy to miss. The pads make it obvious when a task is running or complete and waiting for me.

I use the other functions less often, but none of them are entirely useless. Task switching and status lights are simply the two that became part of my daily workflow.

Here is the demo I submitted to OpenAI Build Week:

<lite-youtube videoid="gg00seXWAPE" playlabel="Play the Codex ATOM demo"></lite-youtube>

[Watch the Codex ATOM demo on YouTube](https://www.youtube.com/watch?v=gg00seXWAPE)

Codex ATOM never needed to become a product. I do not plan to sell it. Before coding agents, I probably would have thought about this need and dropped it. This time, I built it.

Software like this used to be too expensive to justify. Now it exists, and I actually use it. That alone makes it valuable to me.
