---
toc: true
sidebar: false
pager: null
footer: false
theme: [ocean-floor, alt]
---

<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>

<!-- import components -->

```js
// libraries
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
// conmponents
import { straightPlot } from "./components/straightPlot.js";
import { onlyUnique } from "./components/onlyUnique.js";
import { polarPlot } from "./components/polarPlot.js";
import { polarPlotLines } from "./components/polarPlotLines.js";
import { polarPlotMultiple } from "./components/polarPlotMultiple.js";
// import { gridPlotMultiple } from "./components/gridPlotMultiple.js";
import { countryPageLink } from "./components/countryPageLink.js";
import { dendro } from "./components/dendro.js";
// import { worldMap } from "./components/worldMap.js";
import { worldMap2 } from "./components/worldMap2.js";
import { worldMapLegend } from "./components/worldMapLegend.js";
import { pillars } from "./components/pillars.js";
import { goalsGridOLD } from "./components/goalsGridOLD.js";
import { goalsGrid } from "./components/goalsGrid.js";
```

<div class="hero">
  <h1>Internet Accountability Tracker</h1>
  <!-- <h2>Navigating your way through the state of the internet</h2> -->
  <div id="hero-image"></div>
<p style="margin-top: 4em;">Over the years, governments worldwide have agreed on key principles to promote a global, open, free, safe, and secure Internet. These principles are captured in major declarations, including the Declaration on the Future of the Internet (DFI) and the Global Digital Compact.
</p>
<p>
To bridge the gap between promises and progress, the Internet Accountability Tracker (IAT) was created. This interactive platform helps governments, stakeholders, and communities track implementation, identify challenges, and explore solutions.
</p>
<p>
The Internet Accountability Tracker is your guide to understanding global commitments, measuring progress, and learning from successes. Navigate through the platform to see how different countries perform across pillars, principles, and commitments. Discover policies, best practices, and areas for improvement.</p>
</div>

<!-- import data -->

```js
const dfi = FileAttachment("./data/dfi.csv").csv({ typed: true });
const commitmentsIcons = FileAttachment("./data/commitments.csv").csv({
  typed: true,
});
```

```js
// global color palette
const colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];
// console.log(dfi);
```

<!-- ## General TO DO

- style with [custom theme](https://observablehq.com/framework/themes) and esp [custom style sheet](https://observablehq.com/framework/config#style)

- media queries for chart heights/types

#### data

&#x2611; add normalization to data loader

#### goals

&#x2611; load goals data

- [Parameterized routes](https://observablehq.com/framework/params) for countries, pillars, goals

-->

<!-- ## Key figures -->

```js
// Extract unique NAME_ENGL values
const uniqueCountries = new Set(dfi.map((d) => d.NAME_ENGL));

// Get the count of unique values
const uniqueCountriesCount = uniqueCountries.size;
```

<!-- summary cards -->

<div class="grid grid-cols-4">
  <div class="card key">
    <h2>Data points<span class="muted"></span></h2>
    <span class="big">${dfi.length.toLocaleString("en-US")}</span>
  </div>
  <div class="card key">
    <h2>Countries<span class="muted"></span></h2>
    <span class="big">${uniqueCountriesCount}</span>
  </div>
  <div class="card key">
    <h2>Commitments<span class="muted"></span></h2>
    <span class="big">23</span>
  </div>
  <div class="card key">
    <h2>Principles<span class="muted"></span></h2>
    <span class="big">5</span>
  </div>
</div>

## What Does the IAT Track?

```js
const pillarsCards = [
  {
    pillar: "Pillar 1",
    x: 10,
    y: 50,
    txt: "Human Rights",
    url: "./pillars/pillar1",
  },
  {
    pillar: "Pillar 2",
    x: 30,
    y: 50,
    txt: "Global Internet",
    url: "./pillars/pillar2",
  },
  { pillar: "Pillar 3", x: 50, y: 50, txt: "Access", url: "./pillars/pillar3" },
  { pillar: "Pillar 4", x: 70, y: 50, txt: "Trust", url: "./pillars/pillar4" },
  {
    pillar: "Pillar 5",
    x: 90,
    y: 50,
    txt: "Multi-stakeholder",
    url: "./pillars/pillar5",
  },
];
```

```js
// console.log("pillarcards", pillarsCards.pillar);
```

<!-- plot -->
<div class="grid grid-cols-2">

<div>
The IAT focuses on five key areas that define a global, free, secure, sustainable and inclusive Internet:

- Protection of Human Rights and Fundamental Freedoms

- A Global Internet

- Inclusive and Affordable Internet Access

- Trust in the Digital Ecosystem

- Multistakeholder Internet Governance

Each principle comes with specific commitments and performance indicators that you can explore.

</div>
<!-- <div class="card"> -->

<img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/pillars_2.png" alt="Example Image"></img>

</div>
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => pillars(pillarsCards, {width}))}
  </div>
</div>

## Turning Vision into Action

```js
// console.log(dfi.filter((d) => d.NAME_ENGL === "Saint Barthélemy"));
// console.log(dfi);
// display(dfi);
```

<div class="grid grid-cols-2">
To make general principles a reality, governments have made 23 specific commitments—from promoting digital literacy and skills acquisition, promoting online safety and free data flows, refraining from activities that damage the Internet to preventing Internet shutdowns.
<!-- <div class="img-container"> -->
  <img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/commitments.png" alt="Example Image"></img>
<!-- </div> -->
</div>

```js
const selectCountryRadial = view(
  Inputs.search(countryUnique, {
    datalist: countryUnique,
    placeholder: "Search countries",
  })
);
// display(dfi);
```

  <div class="grid grid-cols-1">
  <div class="card">
      ${resize((width) => polarPlot(dfi, selectCountryRadial, {width}))}
    </div>
  </div>

## How Countries Are Performing

<!-- country names and filtering -->

```js
var countries = dfi.map((d) => d.NAME_ENGL);
var countryUnique = countries.filter(onlyUnique);
```

<!-- // Generating clickable links for each country -->

<!-- ### Available Countries: -->

```js
countryUnique
  .map((country) => html`<a href="/country/${country}">${country}</a>`)
  .join(", ");
// display(countryUnique);
```

<!-- plot -->
<div class="grid grid-cols-2">
<div>
The IAT brings together data from nearly all UN member states, including the 70+ signatories of the Declaration on the Future of the Internet. While not all data is available for every country, the interactive tool provides valuable insights into:

- Performance across principles and commitments
- Case studies and implementation examples
- Sources of data for transparency and learning

Click on a country to explore progress, challenges, and good practices!

</div>

<img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/countries.png" alt="Example Image"></img>

  </div>

```js
const dfiGrid = FileAttachment("./data/dfi_grid.csv").csv({
  typed: true,
});
```

```js
// display(dfiGrid);
```

<!-- <div class="card">
  ${resize((width) => gridPlotMultiple(dfiGrid,  selectCountry, {width}))}
</div> -->

<div class="card">
  ${resize((width) => polarPlotMultiple(dfi, {width}))}
</div>

## Connecting Actions to Goals

```js
const goalsOLD = FileAttachment("./data/goalsOLD.csv").csv({ typed: true });
const goals = FileAttachment("./data/goals.csv").csv({ typed: true });
```

```js
// display(goals);
```

  <div class="grid grid-cols-2">

  <div>
The commitments under each principle align with six overarching goals to build a sustainable, rights-respecting digital society:

- **Human Rights:** Protect and promote fundamental freedoms and individual well-being.
- **Connectivity:** Ensure affordable, inclusive, and universal Internet access.
- **Trust:** Build confidence in the safety, privacy, and security of digital technologies.
- **Growth:** Enable fair competition and innovation for businesses of all sizes.
- **Infrastructure:** Foster secure, reliable, and sustainable digital infrastructure.
- **Technology:** Use technology to promote freedom of expression, inclusivity, and sustainability while addressing climate change.

Learn how these goals translate into real-world actions and commitments.

</div>

<img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/goals.png" alt="Example Image"></img>

</div>

  <div class="card" id="goalsGrid">
    ${resize((width) => goalsGridOLD(goalsOLD, dfi, "#goalsGrid", {width}))}
  </div>

```js
// display(goals);
// console.log(goals); // Log to verify the data structure
```

## Country Practices

### Lessons and Success Stories

```js
// DROPDOWN
var commitments = dfi.map((d) => d.commitment_txt);
var commitmentUnique = commitments.filter(onlyUnique);
// var commitment = view(
//   Inputs.select(commitmentUnique, {
//     value: "Select a commitment",
//     label: "Commitment",
//   })
// );
```

  <div class="grid grid-cols-2">
  <div>
  
Sharing knowledge is key to progress. The IAT highlights good practices, case studies, and lessons learned from countries advancing toward an open, free, and secure Internet.

Discover inspiring examples of policies, programs, and frameworks that are making a difference.

  </div>

<img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/implementation.png" alt="Example Image"></img>

</div>
<!-- dropdown -->

```js
var pillarsAll = goodpractice.map((d) => d.pillar);
var pillarUnique = pillarsAll.filter(onlyUnique).sort();
```

<!-- world map and data -->

```js
var worldLoad = FileAttachment("./data/map.json").json();
```

```js
var world = topojson
  .feature(worldLoad, worldLoad.objects.CNTR_RG_60M_2020_4326)
  .features.filter((d) => d.properties.NAME_ENGL !== "Antarctica"); // drop Antarctica directly
const goodpractice = FileAttachment("./data/goodpractice.csv").csv({
  typed: true,
});
```

<!-- join -->

```js
// console.log("world", world);
// console.log("filteredCountry", filteredCountry);
```

<!-- clickable legend -->

<div id="legend-container" class="world-map-legend"></div>

```js
worldMapLegend("legend-container", colors, pillarUnique);
```

<div class="grid grid-cols-1">
  <div class="card">
    <div id="map-container"></div>
  </div>
</div>

```js
worldMap2(world, goodpractice, "map-container", colors, { width });
```

<!--
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => worldMap2(world, filteredCountry, {width}))}
  </div>
</div> -->

<!-- ### to do

&#x2611; remove antartica -->

## How did we do it?

  <div class="grid grid-cols-2">
  <div>

Developed by the Global Initiative on the Future of the Internet (GIFI) at the European University Institute, the IAT monitors how well national policies align with the commitments made by over 70 countries under the Declaration on the Future of the Internet. The process for selection of specific indicators is described in the methodology paper.

  </div>
  </div>
