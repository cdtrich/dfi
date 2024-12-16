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
<!-- <span class="muted">go back</span> -->

<!-- import components -->

```js
// import * as Plot from "npm:@observablehq/plot";
import { straightPlotPillar } from "../components/straightPlotPillar.js";
// import { onlyUnique } from "../components/onlyUnique.js";
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
const pillar_txt = "Multi-stakeholder Internet Governance";
const pillar_num = 5;
```

<div class="hero">
  <h1>${pillar_txt}</h1>
</div>

<p>
The pillars of internet freedom serve as the foundational principles that guide the protection and promotion of an open and free internet. These pillars typically include access to information, freedom of expression, privacy, and security. Access to information ensures that all individuals can seek, receive, and impart information freely over the internet. Freedom of expression safeguards the right to express opinions and ideas without censorship. Privacy guarantees that individuals can use the internet without unwarranted surveillance or the violation of their personal data. Security ensures that the internet remains a safe space for users to interact, free from threats like cyber-attacks or malicious activities.
</p>
  
  <div class="card">
      ${resize((width, height) => straightPlotPillar(dfi, pillar_num, {width}))}
  </div>
