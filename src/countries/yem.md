---
toc: false
sidebar: false
pager: null
footer: false
theme: air
---

<head>
<link rel="stylesheet" href="../style.css">
<!-- sidebar -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link rel="stylesheet" href="../sidebar.css" />
</head>

<!-- back to root button -->

<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- import components -->

```js
import { straightPlot } from "../components/straightPlot.js";
import { polarCountry } from "../components/polarCountry.js";
import { goodPracticeCards } from "../components/goodPracticeCards.js";
import { onlyUnique } from "../components/onlyUnique.js";
import { sidebar } from "../components/sidebar.js";
```

<!-- load countries -->

```js
const country = "Yemen";
const dfi = FileAttachment("../data/dfiFull.csv").csv({
  typed: true,
});
const goodpracticeParse = FileAttachment("../data/sources.csv").csv({
  typed: true,
});
```

<!-- calculate country specific data for intro -->

```js
const dfiCountry = dfi.filter((d) => d.NAME_ENGL == country)[0];
```

```js
const total = Math.round(dfiCountry.total);
const group = dfiCountry.group;
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

<!-- text and polar -->

<div class="grid grid-cols-4">

<div class="card grid-col-1"></div>
<div class="card grid-col-2">
${country} scores a total of ${total} points (<i>${group}</i>). 
  </div>
  
<div class="card grid-col-3">
      ${resize((width) => polarCountry(dfi, country, {width}))}
  </div>

<div class="card grid-col-4"></div>

</div>

<!-- # Scores -->

  <div class="card size-full">
      ${resize((width) => straightPlot(dfi, country, {width}))}
    </div>

  <div id="goodpractice-section">
  </div>

```js
goodPracticeCards(goodpracticeData);
```

<!-- sidebar -->

<div>
    ${sidebar()}
</div>
