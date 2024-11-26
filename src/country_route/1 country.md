---
toc: false
sidebar: false
pager: null
footer: false
theme: [ocean-floor, alt]
---

<!-- 2. country/country.md (Dynamic country pages)
This file will handle the dynamic content generation for each country page based on the URL. Here’s how the full file would look: -->

<head>
<link rel="stylesheet" href="../style.css">
</head>

<!-- Back to root button -->
<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- Import necessary components -->

```js
import { params } from "@observablehq/params";
import { resize } from "@observablehq/resize";
import { straightPlot } from "../components/straightPlot.js";
import { goodPracticeCards } from "../components/goodPracticeCards.js";
import { onlyUnique } from "../components/onlyUnique.js";

// Capture the country name from the URL
route = params.route("/country/:countryName");
const country = route.countryName;

// Load the dataset
const dfi = FileAttachment("../data/dfi.csv").csv({ typed: true });
const goodpracticeParse = FileAttachment("../data/goodpractice.csv").csv({
  typed: true,
});

// Filter data for the selected country
const countryData = dfi.filter((d) => d.NAME_ENGL === country);
const goodpracticeData = goodpracticeParse.filter(
  (d) => d.NAME_ENGL === country
);
```

<!-- Country-Specific Content -->

<div class="hero">
  <h1>${country}</h1>
</div>

<p>
${country} has made notable strides in the Digital Futures Index (DFI), reflecting its growing role in the global digital landscape...
</p>

<!-- Plotting DFI Scores dynamically -->
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => straightPlot(countryData, country, {width}))}
  </div>
</div>

<!-- Injecting Good Practice Cards -->
<div id="goodpractice-section">
  ${goodPracticeCards(goodpracticeData)}
</div>

<!-- Handling Page Loading -->

```js
import { load } from "@observablehq/page-loaders";

// Dynamically load the page content
page = load(() => {
  if (country && countryData.length > 0) {
    return md`   <h1>${country}</h1>
    <p>Country-specific content goes here...</p>
  `;
  } else {
    return md`
Invalid country or no data available.
    `;
  }
});
```
