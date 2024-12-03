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
const country = "Armenia";
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

<p>
${country} has made notable strides in the Digital Futures Index (DFI), reflecting its growing role in the global digital landscape. The DFI measures a nation’s progress in digital infrastructure, governance, and innovation, assessing its preparedness for the future of the internet. ${country} has demonstrated significant improvements in internet accessibility and speed, boosting its digital economy and enhancing connectivity for both individuals and businesses. With government-backed initiatives to promote digital literacy and cybersecurity, the nation has become a regional leader in fostering digital innovation. However, challenges remain, particularly in closing the digital divide and ensuring equal access to technology across rural and underserved areas. Moving forward, ${country} aims to further integrate emerging technologies such as AI and blockchain into its public and private sectors, seeking to strengthen its position in the global digital ecosystem. The DFI ranking highlights ${country}’s potential for future growth, while underscoring areas for continued development.
</p>

```js
var commitments = dfi.map((d) => d.commitment_txt);
var commitmentUnique = commitments.filter(onlyUnique);
```

# DFI Scores

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
