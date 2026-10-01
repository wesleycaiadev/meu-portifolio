**# Gustavo Sextaro — documentation UI guidance**



**## Context and goals**



**\*\*Design intent:\*\*** A quiet, dark documentation interface must help developers find, read, copy, and act on technical information quickly and accessibly.



This guidance targets a documentation site for developers and technical teams. It is an implementation specification, not an audit of the deployed site: the supplied URL could not be inspected reliably, and the audience and product-surface extraction has low confidence. The reported page inventory is **\*\*14 buttons, 2 links, and 2 navigation regions\*\***; teams must confirm these counts and the actual content hierarchy against the live page before using them as acceptance baselines. The workspace containing this document is a separate portfolio project.



Teams should prefer system consistency over local visual exceptions. New components must consume the semantic tokens below and follow the shared interaction contract.



**## Design tokens and foundations**



**### Source primitives**



\| Group | Supplied tokens |

\| --- | --- |

\| Font | \`font.family.primary: Inter\`; \`font.family.stack: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif\`; \`font.size.base: 16px\`; \`font.weight.base: 400\`; \`font.lineHeight.base: normal\` |

\| Type scale | \`xs: 10.56px\`; \`sm: 12.8px\`; \`md: 13.6px\`; \`lg: 15.2px\`; \`xl: 16px\`; \`2xl: 16.8px\`; \`3xl: 18.88px\`; \`4xl: 21.6px\` |

\| Surfaces and text | \`color.text.primary: #ffffff\`; \`color.surface.base: #000000\`; \`color.surface.raised: #050505\`; \`color.surface.strong: #08080a\` |

\| Supplied borders | \`color.border.muted: rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0.22) rgba(255, 255, 255, 0.22)\`; \`color.border.strong: rgba(255, 255, 255, 0.1) rgb(255, 255, 255) rgb(255, 255, 255)\` |

\| Space | \`space.1: 8px\`; \`space.2: 9.6px\`; \`space.3: 14.4px\`; \`space.4: 18.4px\`; \`space.5: 23.2px\`; \`space.6: 25.6px\`; \`space.7: 28.8px\`; \`space.8: 36.8px\` |

\| Radius and motion | \`radius.xs: 999px\`; \`motion.duration.instant: 300ms\`; \`fast: 350ms\`; \`normal: 400ms\`; \`slow: 600ms\`; \`slower: 900ms\` |



The three-color border values are CSS \`border-color\` shorthand samples, not single usable color tokens. Implementations must split them by purpose. The 10% and 22% white values may mark decorative separation; they must not be the only visible boundary of an interactive control. The supplied \`normal\` line height remains a source primitive; documentation prose must use the reading role below.



**### Semantic roles**



\| Token | Value or primitive alias | Required use |

\| --- | --- | --- |

\| \`surface.page\` | \`color.surface.base\` | Main page |

\| \`surface.panel\` | \`color.surface.raised\` | Sidebar, search panel, code panel |

\| \`surface.emphasis\` | \`color.surface.strong\` | Selected or pressed surface |

\| \`text.primary\` | \`color.text.primary\` | Main content and control labels |

\| \`text.secondary\` | \`rgba(255, 255, 255, 0.76)\` | Supporting text after contrast verification on each surface |

\| \`text.disabled\` | \`rgba(255, 255, 255, 0.50)\` | Disabled labels only; never instructions or errors |

\| \`border.decorative\` | \`rgba(255, 255, 255, 0.22)\` | Nonessential dividers |

\| \`border.control\` | \`rgba(255, 255, 255, 0.50)\` | Control edges and active-state cues |

\| \`border.focus\` | \`color.text.primary\` | Visible keyboard focus outline |

\| \`border.error\` | \`color.text.primary\` | Error boundary, paired with text and icon; no color-only meaning |

\| \`type.body\` | \`font.size.xl\` / 400 / line-height \`1.5\` | Documentation prose |

\| \`type.ui\` | \`font.size.lg\` / 400 / line-height \`1.4\` | Buttons, navigation, search |

\| \`type.meta\` | \`font.size.sm\` / 400 / line-height \`1.4\` | Metadata and helper text |

\| \`type.heading.1\` | \`font.size.4xl\` / line-height \`1.25\` | Page title |

\| \`type.heading.2\` | \`font.size.3xl\` / line-height \`1.3\` | Section heading |

\| \`type.heading.3\` | \`font.size.2xl\` / line-height \`1.35\` | Subsection heading |

\| \`space.control.x\` / \`space.control.y\` | \`space.4\` / \`space.2\` | Standard control padding |

\| \`space.stack\` / \`space.section\` | \`space.5\` / \`space.8\` | Related items / major sections |

\| \`radius.pill\` | \`radius.xs\` | Pill buttons and small status labels |

\| \`motion.feedback\` | \`motion.duration.instant\` | Hover and press feedback |

\| \`motion.panel\` | \`motion.duration.fast\` | Menu and panel entry |



Token values are defaults, not an assertion that every composite passes contrast. Teams must measure rendered foreground and background pairs, including alpha compositing. If a semantic role fails, the role must be adjusted centrally. \`font.size.xs\` should be reserved for nonessential visual metadata; essential instructions must use \`type.meta\` or larger. Numeric token values may be converted to \`rem\` from a 16px root so browser font settings remain effective.



**### Page structure**



The page must expose a skip link, one primary \`nav\`, one article \`main\`, and a secondary navigation region only when it contains a distinct purpose such as an on-page table of contents. Both navigation regions must have distinct accessible labels. Headings must follow the content hierarchy. On narrow screens, the article must remain first in reading priority and navigation must be reachable through a labeled disclosure. Sticky chrome must leave the focused item visible. Prose should use a readable line length and the \`type.body\` role; code blocks may scroll horizontally within their own region.



**## Component-level rules**



**### Shared interaction contract**



Every component below must define all seven states in its implementation or explicitly use the specified non-applicable behavior. For combined states, **\*\*disabled wins over hover/active\*\***, **\*\*error remains visible during focus\*\***, and **\*\*focus-visible remains visible during loading\*\***. Hover must never be the sole means of revealing an action. Pointer and touch activation must happen on release within the target, with no duplicate action from synthesized clicks. Targets must be at least 24 × 24 CSS pixels; 44 × 44 CSS pixels should be the design target. All interactive labels must name the destination or action.



\| State | Shared requirement |

\| --- | --- |

\| Default | Must show a discoverable affordance and a \`text.primary\` label. |

\| Hover | Must change surface, underline, or boundary using semantic roles; preserve contrast. |

\| Focus-visible | Must draw a solid \`border.focus\` outline with a visible offset; do not remove it for custom styling. |

\| Active | Must show a pressed or current cue that is distinguishable without color alone. |

\| Disabled | Must remove from activation; keep essential explanation outside the disabled control. |

\| Loading | Must keep the name and dimensions stable; prevent repeated activation and expose status text. |

\| Error | Must keep the control available when recovery is possible; show specific text next to it and link the text programmatically. |



**### Button**



**\*\*Anatomy and variants.\*\*** A button must use native \`\<button>\` markup with a text label, optional decorative icon, and optional status text. Variants may be primary (filled), secondary (outlined), or quiet (text); all must use \`type.ui\`, \`space.control.x\`, and \`space.control.y\`. Icon-only buttons must have an accessible name. The supplied 14-button count should trigger an action audit: duplicate actions should be consolidated, and a page should have one visually primary action per local task area.



\| State | Button rule |

\| --- | --- |

\| Default | Must use \`text.primary\` on \`surface.emphasis\`; outlined variants must use \`border.control\`. |

\| Hover | Must increase surface or border emphasis with \`motion.feedback\`; label must remain unchanged. |

\| Focus-visible | Must add \`border.focus\` outline outside the hit area. |

\| Active | Must show a pressed surface and retain the label; toggle buttons must expose \`aria-pressed\`. |

\| Disabled | Must use native \`disabled\`; show \`text.disabled\`; do not attach a click handler. |

\| Loading | Must keep the button width, show a visible status such as “Copying…”, set \`aria-disabled="true"\`, and announce completion or failure. |

\| Error | Must restore operability, show a nearby recovery message, and retain a task-specific label such as “Try copying again”. |



**\*\*Input and edges.\*\*** Enter and Space must activate; pointer click and touch tap must activate once. At narrow widths, buttons must wrap or expand to available width. Long labels must wrap without clipping. An action without available data must show an explanatory empty state instead of a dead button. A request in progress must not produce duplicate submissions.



**### Link**



**\*\*Anatomy and variants.\*\*** Links must use native \`\<a href>\` markup. Inline and standalone links must have visible text, a persistent underline or equivalent non-color cue, \`type.body\` or \`type.ui\` as context requires, and tokenized spacing around any icon. The reported count of two links should be verified against the rendered DOM; it must not cap legitimate documentation cross references.



\| State | Link rule |

\| --- | --- |

\| Default | Must use \`text.primary\` and a visible underline; the accessible name must describe the destination. |

\| Hover | Must strengthen the underline or add a tokenized surface cue. |

\| Focus-visible | Must add \`border.focus\` outline while retaining the underline. |

\| Active | Must show a pressed cue; current-page links must expose \`aria-current="page"\`. |

\| Disabled | Must not render a nonfunctional anchor; render labeled static text if a destination is unavailable. |

\| Loading | Must preserve the link and indicate navigation progress only when client navigation is measurably delayed; announce status without replacing its name. |

\| Error | Must keep the URL recoverable, show a clear failure message, and offer a retry or stable alternate destination. |



**\*\*Input and edges.\*\*** Enter must follow the link; Space must retain normal page scrolling. Pointer and touch must follow the same destination. External links should disclose a new tab when one is forced. Long URLs must wrap in prose. At narrow widths, link text must reflow without horizontal page scrolling. Empty collections must omit the link list and present an informative empty state.



**### Navigation**



**\*\*Anatomy and variants.\*\*** Primary and on-page navigation must use separate labeled \`\<nav>\` landmarks with lists of links. Each item must use \`type.ui\`, \`space.3\` or larger separation, and a visible current marker. A collapsible mobile navigation must use a labeled native button with \`aria-expanded\` and \`aria-controls\`.



\| State | Navigation rule |

\| --- | --- |

\| Default | Must show item names and hierarchy; expose current location when known. |

\| Hover | Must show a tokenized surface or underline cue without shifting layout. |

\| Focus-visible | Must outline the focused item and keep it clear of sticky headers. |

\| Active | Must mark the current page with \`aria-current="page"\`; mark the current article heading with \`aria-current="location"\` only when reliably tracked. |

\| Disabled | Must omit unavailable destinations or show them as static explanatory text; never leave focusable dead links. |

\| Loading | Must keep the selected item visible while content loads and announce the page loading state. |

\| Error | Must keep navigation usable; show a route-specific failure message in the content region. |



**\*\*Input and edges.\*\*** Tab must move through links in DOM order; Enter must navigate. The mobile disclosure must open with Enter or Space and close with Escape, an explicit Close button, or selection. Pointer and touch must use the same menu items. Long titles must wrap; deep trees should use disclosure groups only where the hierarchy is real. On small screens, the menu must fit the viewport and scroll internally if needed. Empty navigation groups must be omitted.



**### Search**



**\*\*Anatomy and variants.\*\*** If search exists, it must use a labeled search field, submit or clear button, results list, status text, and an empty-results message. It must use \`type.ui\`, \`space.control.x\`, \`space.control.y\`, \`surface.panel\`, and \`border.control\`. A compact trigger may open a search dialog; that dialog must have a visible title and close action.



\| State | Search rule |

\| --- | --- |

\| Default | Must show a persistent label such as “Search documentation”; placeholder text may give an example. |

\| Hover | Must emphasize the field boundary without relying on a placeholder change. |

\| Focus-visible | Must outline the field or trigger with \`border.focus\`; the caret must remain visible. |

\| Active | Must show the query and results; mark a selected result visibly and programmatically. |

\| Disabled | Must explain why search is unavailable in adjacent text; do not leave a dead trigger. |

\| Loading | Must preserve the query, show “Searching…”, and announce result updates without moving focus. |

\| Error | Must show “Search could not load. Try again.” and a working retry action. |



**\*\*Input and edges.\*\*** Typing must update the query; Enter must submit or open the selected result; Escape must close a dialog or clear an explicit selection. Pointer and touch must be able to select every result. Search must work with no results, slow responses, very long queries, and network errors. Results must wrap or truncate with an accessible full name; the page must not overflow horizontally.



**### Code example and copy action**



**\*\*Anatomy and variants.\*\*** A code example must include a language label where useful, a \`\<pre>\<code>\` region, and an optional labeled Copy button. The code region must use \`surface.panel\`, \`type.meta\` or larger for code text, \`space.4\` padding, and a decorative border only if the panel remains visually identifiable. Copy behavior follows the Button rules.



\| State | Code example rule |

\| --- | --- |

\| Default | Must render selectable code and a visible “Copy code” action when copying is supported. |

\| Hover | Must emphasize the Copy action; never hide it from keyboard users. |

\| Focus-visible | Must outline the Copy button and any focusable code scroll region. |

\| Active | After a successful copy, the component must show “Copied” and announce the status. |

\| Disabled | When copying is unavailable, the component must omit the action and keep code selectable. |

\| Loading | During async clipboard work, the component must keep code and button dimensions stable. |

\| Error | Must show “Could not copy. Select the code to copy it.” without removing the code. |



**\*\*Input and edges.\*\*** The Copy button must respond to Enter, Space, pointer click, and touch tap. Long lines may scroll inside the code region; the whole page must not scroll horizontally. Empty code examples must be removed or replaced with an explicit “Example unavailable” message. Code must not be clipped at 200% text size.



**## Accessibility requirements and testable acceptance criteria**



The target is **\*\*WCAG 2.2 AA\*\***. The following are release checks, not visual preferences. W3C defines the [4.5:1 normal-text and 3:1 large-text thresholds]\(https\://www\.w3.org/WAI/WCAG21/Understanding/contrast-minimum), the [3:1 non-text threshold]\(https\://www\.w3.org/WAI/WCAG22/Understanding/non-text-contrast), the [24 × 24 CSS pixel target-size criterion]\(https\://www\.w3.org/WAI/WCAG22/Understanding/target-size-minimum), [keyboard operation]\(https\://www\.w3.org/WAI/WCAG21/Understanding/keyboard), [focus not obscured]\(https\://www\.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum), and [320 CSS pixel reflow]\(https\://www\.w3.org/WAI/WCAG21/Understanding/reflow).



\| Check | Pass | Fail |

\| --- | --- | --- |

\| Text contrast | Measured normal text is at least 4.5:1; qualifying large text is at least 3:1 on every rendered surface and state. | Any required text falls below its threshold. |

\| Control and state contrast | Required boundaries, icons, current markers, and focus cues are at least 3:1 against adjacent colors. | A low-opacity decorative border is the only control or state cue. |

\| Keyboard | Every action is reachable in logical Tab order and works with its specified keys; no keyboard trap occurs. | Any action requires pointer or touch, or focus is lost on content updates. |

\| Focus visibility | A focus indicator is visible on every focused control and the focused control is not fully hidden behind sticky UI. | An outline is suppressed or focused content is entirely covered. |

\| Target size | Every pointer target contains a 24 × 24 CSS pixel area or meets a documented WCAG exception; 44 × 44 should be the design target. | A small target has no valid exception or adequate spacing. |

\| Zoom and reflow | At 200% text resize and a 320 CSS pixel viewport equivalent, content and controls remain available without page-level two-dimensional scrolling; code regions may scroll internally. | Text, actions, or messages are clipped or require horizontal page scrolling. |

\| Names and errors | Every control has a programmatic name; error text identifies the problem and recovery path and is associated with its control. | An icon alone has no accessible name or an error is conveyed only by color. |

\| Motion | With \`prefers-reduced-motion: reduce\`, nonessential transitions stop and state changes remain understandable. | Motion is required to understand the state or cannot be reduced. |



Manual review must include keyboard-only navigation, screen-reader names and status announcements, pointer and touch activation, 320px width, 200% text resize, 400% zoom, and slow or failed network responses. Automated checks should supplement these checks, not replace them.



**## Content and tone standards**



Copy must be concise, direct, and task specific. Navigation labels must describe destinations. Buttons must describe actions. Errors must state what failed and what to do next. Loading text must describe the pending operation.



\| Use | Avoid |

\| --- | --- |

\| “Copy install command” | “Click here” |

\| “Search documentation” | “Search” when several scopes exist |

\| “Could not load examples. Try again.” | “Something went wrong” |

\| “No results for ‘tokens’. Try another term.” | “No data” |



Documentation should lead with the outcome, then show the command or example, then explain constraints and recovery. Terminology must remain consistent between headings, navigation, search results, and actions.



**## Anti-patterns, migration notes, and edge cases**



\- Teams must not use \`border.decorative\` to identify a button, field, active route, or focus state.

\- Teams must not hide focus, use a \`div\` as a button, or make a hover-only control.

\- Teams must not add local pixel spacing or typography overrides; missing roles must be added to the token layer and reviewed centrally.

\- Teams must not use “Learn more”, “Here”, or icon-only controls without a specific accessible name.

\- Teams must not rely on color alone for errors, selected states, or links in prose.

\- Existing three-value border declarations should be migrated to \`border.decorative\`, \`border.control\`, or \`border.focus\` according to function. Contrast must be rechecked after migration.

\- Existing \`font.lineHeight.base: normal\` prose should migrate to \`type.body\`. Existing tiny essential labels should migrate to \`type.meta\` or larger.

\- When content is empty, the page must present a named empty state or omit the section. When content is long, text must wrap and code must scroll locally. When data or navigation fails, the last usable context must remain available with a retry path.



**## QA checklist**



\- [ ] Verify the deployed site’s brand, audience, documentation purpose, and the reported 14 buttons / 2 links / 2 navigation regions.

\- [ ] Check every component against all seven state rules, including loading and error.

\- [ ] Confirm semantic tokens, typography roles, and spacing roles are used without one-off values.

\- [ ] Test keyboard, pointer, and touch behavior for each interactive component.

\- [ ] Measure text, control, state, and focus contrast on every surface.

\- [ ] Confirm names, landmarks, heading order, current-page cues, errors, and status announcements.

\- [ ] Test narrow viewports, zoom, long strings, empty content, slow responses, and failures.

\- [ ] Confirm reduced-motion behavior and stable layout during loading.
