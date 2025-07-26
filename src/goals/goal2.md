---
toc: false
sidebar: false
pager: null
footer: false
theme: [ocean-floor, alt]
---

<head>
<link rel="stylesheet" href="../style.css">
<style>
  html {
  background: rgb(60, 64, 153)
  };
</style>
</head>

<!-- back to root button -->

<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- import components -->

```js
import { straightPlotGoal } from "../components/straightPlotGoal.js";
```

<!-- set height -->

```js
// Select all elements with the class 'card'
const cards = document.querySelectorAll(".card");

// Set the height of each card to window.innerWidth * 0.5
cards.forEach((card) => {
  card.style.height = `${window.innerHeight * 0.5}px`;
});
```

<!-- load countries -->

```js
const goal_txt = "Connect";
const goal_num = 2;
```

```js
const dfi = FileAttachment("../data/dfi.csv").csv({
  typed: true,
});
const goals = FileAttachment("../data/goals.csv").csv({ typed: true });
```

<div class="hero">
  <h1>${goal_txt}</h1>
</div>

  <div class="card">
      ${resize((width, height) => straightPlotGoal(dfi, goals, goal_num, {width}))}
  </div>
