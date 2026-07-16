# Mandarin Trainer Product Refresh Audit

## Product Direction

Mandarin Trainer should behave like one guided learning system. Today is the planning surface, each tool is a step in that plan or an intentional extension of it, results update the learning record, and the next useful action is always clear.

This audit is based on desktop (1440 x 900) and mobile (390 x 844) captures of every tool landing screen plus the main active-session states on 2026-07-16.

## Cross-Product Findings

| Area | Current deficiency | Refresh direction | Status |
| --- | --- | --- | --- |
| Plan continuity | Plan context stops when the learner leaves Today. | Show plan/path context on tool landing screens and a next-plan action after results. | Implemented in shared shell |
| Visual system | Tools use unrelated red, blue, purple, and teal primary actions, making them feel like separate products. | Use product green for commands and reserve category colors for small identity cues. | Implemented in shared shell |
| Configuration | Mode and Options controls remain visible during sessions and results. | Keep configuration on landing screens; remove it once an activity starts. | Implemented in shared shell |
| Heading hierarchy | Desktop repeats a generated tool title above the title inside the tool panel. | Use the tool panel as the single page heading. | Implemented in shared shell |
| Results | Every tool ends differently and several flows only offer retry/back actions. | Add a common learning-record update with the next activity from Today. | Implemented in shared shell |
| Mobile density | Stacked mode and Options panels consume too much of the first viewport. | Use a compact one-row control bar where both controls are present. | Implemented in shared shell |
| History | Browser-local records are useful but capped and presented as a dense report before the learner has meaningful data. | Improve empty/early states, filters, and migration clarity. | Pending |
| Accessibility | Visible focus and semantic controls are generally present, but active/result additions need keyboard and reduced-motion verification. | Include keyboard, narrow viewport, and reduced-motion checks in every batch. | In verification |

## Tool Findings

| Tool | Strengths to preserve | Main deficiencies | Priority refresh |
| --- | --- | --- | --- |
| Today | Strong plan, mastery, activity, and recommendation hierarchy. | The plan only represents a subset of tools and its context disappears inside activities. The mobile page is long before secondary insights. | Keep as the system model; tighten mobile secondary sections and improve return paths. |
| Vocabulary Quiz | Clear set picker, two distinct modes, useful word links, tone colors, and benchmark timing. | Landing screen is dense; the full word preview competes with starting the quiz; active desktop session devotes substantial space to the table. | Make the current set/action dominant and move the full preview into a secondary disclosure. |
| Daily Review | Adaptive queue and spaced-review states fit the plan well. | Baseline state has zero-heavy metrics and does not explain why its first session matters to later recommendations. | Improve first-run explanation and reduce empty metrics. |
| Grammar Lab | Mixed practice and focused lessons are well separated; active question layout is strong. | Landing screen is long, uses a competing blue command system, and lesson status is visually repetitive. | Group lessons by progress and emphasize the recommended next pattern. |
| Graded Readers | Story detail and comprehension flow are coherent and polished. | Shelf cards use a separate purple product language and do not connect completion to HSK path progress. | Add progress/saved state and preserve the quieter story-reading surface. |
| Mock HSK Exam | Readiness step, persistent draft, section navigation, and timer are substantial. | Landing screen is dense on mobile; premium hierarchy competes with level selection; transition/source copy can dominate the task. | Compact level comparison and keep authoritative format notes secondary. |
| Pronunciation | Session purpose is clear and feedback data supports later recommendations. | Landing screen shows static pool and pinyin values as oversized metrics; active desktop prompt is too small relative to available space. | Replace static stats with readiness/settings summary and enlarge the speaking workspace. |
| Geography of China | Offline high-fidelity map, separate region/city modes, and small-region selectors solve the core interaction. | Landing and active states share a large canvas but the setup panel competes with the map; mobile needs continued pan/zoom and prompt-density checks. | Make mode selection concise and preserve map size from setup through play. |
| Sentence Drills | Three purposeful modes, sentence library, and focused active input. | Landing screen is unusually sparse; the preview is decorative rather than informative; red commands break the product system. | Show a real sample and recent mode performance without adding another dashboard. |
| History | Consolidates all session types, recommendations, activity rhythm, mistakes, and export/restore. | Empty state is still a large analytics report; recent sessions lack quick type filtering; browser-only persistence limitations are not surfaced at the point of risk. | Add progressive disclosure, filters, and clearer backup status. |

## Verification Standard

Each refresh batch must be checked at desktop and mobile widths, with no horizontal overflow, no console errors, no hidden primary action, and a working path from Today to activity to result to the next plan step. Changes are pushed only after local interaction checks pass.

## Refresh Batches

1. **Shared learning flow:** added path context to tool landing screens, removed setup controls from active/results states, unified command colors, removed duplicate desktop headings, and added a common next-plan action to results.
2. **Core setup surfaces:** made the Vocabulary start action visible in the first mobile viewport, collapsed its word preview, replaced static Pronunciation metrics, clarified the Sentence Drill flow, and replaced Daily Review's zero metrics with baseline guidance.
3. **Guided catalog and record states:** replaced empty History analytics with the current plan, added History session filters, surfaced Grammar's recommended pattern, added Reader level progress, and marked/compacted the learner's target mock exam.
