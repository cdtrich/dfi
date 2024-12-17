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
import { straightPlotPillar } from "../components/straightPlotPillar.js";
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

<!-- load data -->

```js
const dfi = FileAttachment("../data/dfi.csv").csv({
  typed: true,
});
```

<!-- params -->

```js
const pillar_txt = "Inclusive and Affordable Access to the Interne";
const pillar_num = 3;
const principles = FileAttachment("../components/principles.json").json();
```

<div class="hero">
  <h1>${principles.principles[pillar_num - 1].title}</h1>
</div>

<p>
${principles.principles[pillar_num - 1].description}</p>
  
  <div class="card">
      ${resize((width, height) => straightPlotPillar(dfi, pillar_num, {width}))}
  </div>
