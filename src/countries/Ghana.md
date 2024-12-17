---
toc: false
sidebar: false
pager: null
footer: false
theme: [ocean-floor, alt]
---

<head>
<link rel="stylesheet" href="../style.css">
</head>

<!-- back to root button -->

<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>
<!-- <span class="muted">go back</span> -->

<!-- import components -->

```js
// import * as Plot from "npm:@observablehq/plot";
import { straightPlot } from "../components/straightPlot.js";
import { goodPracticeCards } from "../components/goodPracticeCards.js";
import { onlyUnique } from "../components/onlyUnique.js";
```

<!-- load countries -->

```js
// const countries = FileAttachment("countries.csv").csv({
//   typed: true,
// });
const country = "Ghana";
const dfi = FileAttachment("../data/dfi.csv").csv({
  typed: true,
});
// const commitmentIcons = FileAttachment("./data/commitments.csv").csv({
//   typed: true,
// });
const goodpracticeParse = FileAttachment("../data/goodpractice.csv").csv({
  typed: true,
});
```

```js
const goodpracticeData = goodpracticeParse.filter(
  (d) => d.NAME_ENGL === country
);
```

<div class="hero">
  <h1>${country}</h1>
</div>

```js
var commitments = dfi.map((d) => d.commitment_txt);
var commitmentUnique = commitments.filter(onlyUnique);
```

<!-- # Scores -->

  <div class="grid grid-cols-1">
  <div class="card">
      ${resize((width) => straightPlot(dfi, country, {width}))}
    </div>
  </div>

  <div id="goodpractice-section">
  </div>

```js
goodPracticeCards(goodpracticeData);
```
