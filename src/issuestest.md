<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<!-- sidebar -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
<link rel="stylesheet" href="./sidebar.css" />
<link rel="stylesheet" href="./custom-legend.css" />
</head>

<!-- back to root button -->

<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- import components -->

```js
import { colorScales } from "./components/scales.js";
import { onlyUnique } from "./components/onlyUnique.js";
// import { polarPlotMultiple } from "./components/polarPlotMultiple.js";
import { mapPillar } from "./components/mapPillar.js";
import { mapTotal } from "./components/mapTotal.js";
import { mapTotalScorecard } from "./components/mapTotalScorecard.js";
import { mapTotalCatGIFIquant5 } from "./components/mapTotalCatGIFIquant5.js";
import { mapPillarCommitment } from "./components/mapPillarCommitment.js";
import { customLegend, viewofCustomLegend } from "./components/customLegend.js";
```

<!-- hero -->

<div class="hero">
  <h1>Issues</h1>
  <div id="hero-image"></div>
<p style="margin-top: 4em;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. 
</p>

</div>

<!-- data -->

```js
const dfiFullParse = FileAttachment("./data/dfiFull.csv").csv({ typed: true });
const dfiCardinalParse = FileAttachment("./data/dfiCardinal.csv").csv({
  typed: true,
});
```

<!-- world map and data -->

<!-- 0. data -->

```js
var worldLoad = FileAttachment("./data/map.json").json();
```

```js
var world = topojson
  .feature(worldLoad, worldLoad.objects.CNTR_RG_60M_2020_4326)
  .features.filter((d) => d.properties.NAME_ENGL !== "Antarctica") // drop Antarctica directly
  .filter((d) => d.properties.SVRG_UN === "UN Member State") // only UN member states
  .map((d) => {
    // only keep these properties
    d.properties = {
      CNTR_ID: d.properties.CNTR_ID,
      ISO3_CODE: d.properties.ISO3_CODE,
      NAME_ENGL: d.properties.NAME_ENGL,
    };
    return d;
  });
// console.log("world (in index", world);
```

  <!-- 1. input data -->

```js
const uniquePillars = [
  ...new Set(dfiCardinalParse.map((item) => item.pillar_txt)),
];
// console.log("uniqueCommitments:", uniqueCommitments);
// console.log("uniquePillars", uniquePillars);
```

  <!-- 2. input  -->

```js
// const selectPillar = view(viewofCustomLegend(uniquePillars, uniquePillars[0]));
// const selectPillar = view(
//   Inputs.radio(uniquePillars, {
//     datalist: uniquePillars,
//     value: uniquePillars[0],
//   })
// );
```

```js
console.log("uniquePillars", uniquePillars);
console.log("selectPillar", selectPillar);
```

<!-- small maps -->

<h1>
<p>Indicators</p>
</h1>

<div class="grid grid-cols-3">

<div class="card grid-colspan-1">
<!-- commitment selection -->

```js
const dfiFullFiltered = dfiFullParse.filter(
  (d) => d.pillar_txt === selectPillar
);
const uniqueCommitments = [
  ...new Set(dfiFullFiltered.map((item) => item.commitment_txt_cardinal)),
];

// console.log("uniqueCommitments", uniqueCommitments);
```

<!-- Add this to your imports -->

```js
import { styleRadioButtons } from "./components/customLegendtest.js";
```

<!-- Replace the pillar selection -->

```js
// Create radio buttons with custom styling
viewof selectPillar = html`<form ${styleRadioButtons(uniquePillars, "pillar-radio")}>
  ${uniquePillars.map((value, i) => html`
    <input type="radio" id="pillar-${i}" name="pillar" value="${value}"
      ${i === 0 ? "checked" : ""}>
    <label for="pillar-${i}">${value}</label>
  `)}
</form>`;
```

<!-- Replace the commitment selection -->

```js
// Filter data based on selected pillar
const dfiFullFiltered = dfiFullParse.filter(
  (d) => d.pillar_txt === selectPillar
);
const uniqueCommitments = [
  ...new Set(dfiFullFiltered.map((item) => item.commitment_txt_cardinal)),
];

<!-- 3. map  -->

<div class="grid grid-cols-1">
<div class="card">
    ${resize((width) => mapPillar(world, dfiCardinalParse, "pillar_txt", uniquePillars, selectPillar, {width}))}
  </div>
</div>


// Create radio buttons with custom styling
viewof selectCommitment = html`<form ${styleRadioButtons(uniqueCommitments, "commitment-radio")}>
  ${uniqueCommitments.map((value, i) => html`
    <input type="radio" id="commitment-${i}" name="commitment" value="${value}"
      ${i === 0 ? "checked" : ""}>
    <label for="commitment-${i}">${value}</label>
  `)}
</form>`;
```

</div>

<!-- maps -->

  <div class="card grid-colspan-2">
      ${resize((width) => mapPillarCommitment(world, dfiFullFiltered, selectPillar, selectCommitment,  {width}))}
    </div>
</div>

<!-- sidebar -->

<div class="sidebar" id="sidebar">
  <div class="sidebar-content">
    <button class="toggle-btn" id="toggleBtn">
      <!-- <i class="fas fa-chevron-left"></i> -->
    </button>
    <ul class="sidebar-menu">
      <li>
        <a href="/index">
          <i class="fas fa-globe"></i>
          <span>Map</span>
        </a>
      </li>
      <li>
        <a href="/countries">
          <i class="fas fa-flag"></i>
          <span>Country overview</span>
        </a>
      </li>
      <li>
        <a href="/issues">
          <i class="fas fa-rainbow"></i>
          <span>Issues</span>
        </a>
      </li>
      <li>
        <a href="/perspectives">
          <i class="fas fa-comments"></i>
          <span>Perspectives</span>
        </a>
      </li>
    </ul>
  </div>
</div>

<script src="./components/sidebar.js"></script>
