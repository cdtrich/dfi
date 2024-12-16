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
import { goalsGrid } from "./components/goalsGrid.js";
```

<div class="hero">
  <h1>Internet Accountability Tracker</h1>
  <!-- <h2>Navigating your way through the state of the internet</h2> -->
  <div id="hero-image"></div>
<p style="margin-top: 4em;">The Declaration on the Freedom of the Internet is a formal statement advocating for the protection and promotion of an open, accessible, and free internet. It recognizes the internet as a fundamental tool for expression, communication, and innovation, essential to the advancement of democratic principles and human rights. The declaration emphasizes that everyone should have the right to access information online without censorship, surveillance, or discrimination. It calls on governments, organizations, and individuals to commit to upholding these freedoms and to resist efforts that would undermine the internet’s open nature or restrict users’ rights.
</p>
</div>

<!-- parameters -->

```js

```

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

<!-- summary cards -->

<!-- <div class="grid grid-cols-4">
  <div class="card key">
    <h2>Entries<span class="muted"> / datapoints</span></h2>
    <span class="big">${dfi.length.toLocaleString("en-US")}</span>
  </div>
  <div class="card key">
    <h2>Countries<span class="muted"> / territories</span></h2>
    <span class="big">${dfi.filter((d) => d.commitment_num === 1).length.toLocaleString("en-US")}</span>
  </div>
  <div class="card key">
    <h2>Commitments<span class="muted"> / principles</span></h2>
    <span class="big">15</span>
  </div>
  <div class="card key">
    <h2>Groups<span class="muted"> / columns</span></h2>
    <span class="big">5</span>
  </div>
</div> -->

## Commitments

```js
// console.log(dfi.filter((d) => d.NAME_ENGL === "Saint Barthélemy"));
console.log(dfi);
display(dfi);
```

<!-- <div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => straightPlot(dfi, {width}))}
  </div>
</div> -->

<div class="grid grid-cols-2">
The commitments of internet freedom outline the concrete actions and responsibilities that governments, organizations, and individuals should undertake to preserve and promote an open and free internet. These commitments include actively protecting the rights of users to access and share information without censorship or undue restrictions. Stakeholders are also committed to ensuring the privacy and security of online communications by adopting robust data protection measures and resisting mass surveillance. Furthermore, there is a commitment to fostering inclusivity by bridging the digital divide, ensuring that all people, regardless of their socioeconomic status or location, can benefit from internet access. Additionally, these commitments involve promoting transparency in internet governance and policy-making processes, encouraging the participation of a broad range of voices to shape the future of the internet. Ultimately, these commitments seek to maintain the internet as a global public resource, free from undue control and open to innovation and expression.
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

```js
// // Construct the markdown text with the country name as a link
// const findSelectCountryRadial = dfi.find(
//   (d) => d.NAME_ENGL === selectCountryRadial
// );

// const urlSelectCountryRadial = findSelectCountryRadial
//   ? findSelectCountryRadial.country_url
//   : "#"; // Default to '#' if not found

// console.log(urlSelectCountryRadial);

// // Generate markdown as a string
// const countryMarkdown = `Got to country page of [${selectCountryRadial}](${urlSelectCountryRadial})`;

// // Display the markdown in the div as a link
// document.getElementById("country-link").innerHTML = marked(countryMarkdown); // Use a markdown parser like marked.js if available
```

<!-- <p>Go to country page of <a href=`${urlSelectCountryRadial}`>${selectCountryRadial}</a></p>
<p>test</p>

Go to other country page of [${selectCountryRadial}](${urlSelectCountryRadial}) -->

  <div class="grid grid-cols-1">
  <div class="card">
      ${resize((width) => polarPlot(dfi, selectCountryRadial, {width}))}
    </div>
  </div>

<!-- ### to do

&#x2611; add connecting line

- country page: dot above avg = filled, below = stroke only -->

## Pillars

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
  The pillars of internet freedom serve as the foundational principles that guide the protection and promotion of an open and free internet. These pillars typically include access to information, freedom of expression, privacy, and security. Access to information ensures that all individuals can seek, receive, and impart information freely over the internet. Freedom of expression safeguards the right to express opinions and ideas without censorship. Privacy guarantees that individuals can use the internet without unwarranted surveillance or the violation of their personal data. Security ensures that the internet remains a safe space for users to interact, free from threats like cyber-attacks or malicious activities.
<!-- <div class="card"> -->  
<img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/pillars_2.png" alt="Example Image"></img>

</div>
<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => pillars(pillarsCards, {width}))}
  </div>
</div>

<!-- ### to do

- remove faceting numeric labels -->

## Countries

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

```js
// DROPDOWN
// var country = view(
//   Inputs.select(countryUnique, { value: "Select a country", label: "Country" })
// );
// var dfiCountry = dfi.filter((d) => d.NAME_ENGL === country);
```

```js
// Remove spaces from the country name
// var sanitizedCountry = country.replace(/\s+/g, ""); // This removes all spaces
// var countryPage = "./countries/" + sanitizedCountry;
// console.log(countryPage);
```

<!-- plot -->
<div class="grid grid-cols-2">
    Countries play a pivotal role in the Declaration on the Freedom of the Internet (DFI) by implementing and upholding its principles within their borders. They are responsible for creating laws and policies that ensure unrestricted internet access, protect freedom of expression, and safeguard user privacy. Countries must resist censorship, combat control over information flow, and work to reduce the digital divide to ensure equitable internet access. Additionally, they are expected to collaborate internationally to support global internet governance that aligns with the DFI’s goals, ensuring a free, open, and secure internet for all.
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

## Goals

```js
const goals = FileAttachment("./data/goals.csv").csv({ typed: true });
```

```js
// display(goals);
```

  <div class="grid grid-cols-2">
The Declaration on the Future of the Internet (DFI) sets out key goals aimed at promoting a free, open, and secure internet globally. Its objectives include safeguarding human rights online, ensuring that digital spaces remain accessible and inclusive, and fostering innovation while maintaining privacy and security. The DFI focuses on upholding democratic values by preventing the misuse of technology for censorship, surveillance, or the suppression of free speech. By setting a global standard for the governance and development of the internet, the DFI encourages collaboration between nations to create an equitable, safe, and resilient digital environment for all.
  <img class="img-col" src="https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/img/goals.png" alt="Example Image"></img>

</div>

  <div class="card" id="goalsGrid">
    ${resize((width) => goalsGrid(goals, dfi, "#goalsGrid", {width}))}
  </div>

```js
// display(goals);
// console.log(goals); // Log to verify the data structure
```

## DFI implementation

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
This world map highlights exemplary practices by countries in upholding the principles of the Declaration on the Freedom of the Internet (DFI). Each country showcased here has made significant strides in promoting and protecting internet freedom, setting a global standard for digital rights and access.

This map serves as a resource for understanding how different countries contribute to the global effort of maintaining a secure, accessible, and open internet for all.

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
