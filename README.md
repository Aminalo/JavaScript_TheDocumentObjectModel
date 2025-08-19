### Reaction Dash 🎮

## Description

Reaction Dash is a fun, fast-paced game designed to test the player’s reaction speed. A box changes color at a random time, and the player must click it as quickly as possible to score points. The faster the reaction, the higher the score.

This project was created as part of my SBA on the Document Object Model (DOM), demonstrating my ability to manipulate elements, handle events, and provide an interactive user experience.

Reaction Dash — Simple DOM/BOM Game

Click the target as soon as it appears. Your reaction time (in milliseconds) is recorded for each round. Do multiple rounds and check your best and average times.

## What this demonstrates

DOM: selectors, create/append, classList/style, attribute updates, text updates

Templating: <template> + cloneNode(true) + DocumentFragment

Events: submit, click, delegated/multiple target handling

BOM: setTimeout, alert, confirm

Validation: HTML attributes (required, minlength, maxlength, pattern, number min/max) + JS setCustomValidity

Parent/Child/Sibling: uses nextElementSibling to pulse the board after Start

## How to play

Enter a player name (3–20 chars).

Choose rounds (3–10) and arena size.

Click Start. Wait for a circle to appear, then click it fast.

Check your results log on the left (best + average shown on top).


## Structure
index.html
styles /
   └── style.css
script.js
README.md
images/
   └── background.jpg

✅ Requirements mapping

# Cached elements with getElementById and querySelector/All
# Parent/child/sibling nav: panel.nextElementSibling
# Iterate over .card to tweak styles
# createElement + appendChild to place targets
# Template + cloneNode + DocumentFragment for the log list
# Modify textContent, classList, style, and attributes
# Register multiple event listeners
# Use BOM methods (setTimeout, alert, confirm)
# HTML validation + event-based JS validation
# Single page, runs without errors, clean and beginner-friendly


## Ideas to extend

Save best score to localStorage

Add a countdown before each round

Add sounds for hit/miss

## Reflection Notes 📝
What could I have done differently during planning?

During the planning stage, I could have created a simple wireframe and a list of features mapped to requirements before starting to code. This would have helped me stay more organized and avoid confusion about whether a feature covered a specific requirement.

Were there any requirements that were difficult to implement?

Yes, the DocumentFragment/cloneNode requirement was tricky at first because I wasn’t sure how to use it in a meaningful way. I solved it by creating a reusable element template for scores.

Form validation with both HTML attributes and JavaScript was also slightly challenging because I had to remember that they work together but serve different roles.

What would make them easier to implement in future projects?

More practice with smaller DOM exercises would make these easier. Also, planning my DOM structure ahead of time would reduce trial and error when implementing event listeners or content updates.

What would you add or change with more time?

If I had more time, I would:

Add levels of difficulty (faster color changes each level).

Include a leaderboard to save best scores.

Add animations and sound effects to make the game more fun.

Allow the player to choose different themes or backgrounds for personalization.


## Notes for My Future Self

Always break requirements down into smaller tasks and commit after each feature.

Don’t be afraid to keep the design simple; functionality is more important.

Use console.log() often during debugging.

Start with minimum requirements first, then make it fun with extra features.