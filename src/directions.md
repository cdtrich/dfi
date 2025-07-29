<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> -->
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
// import { mapTotal } from "./components/mapTotal.js";
// import { mapTotalScorecard } from "./components/mapTotalScorecard.js";
import { mapTotalCatGIFIquant5 } from "./components/mapTotalCatGIFIquant5.js";
import { mapPillarCommitment } from "./components/mapPillarCommitment.js";
import { customLegend, viewofCustomLegend } from "./components/customLegend.js";
// import { renderMapWithLegend } from "./components/renderMapWithLegend.js";
import { sidebar } from "./components/sidebar.js";
import { renderPillarContent } from "./components/pillarRenderer.js";
```

<!-- hero -->

<div class="hero">
  <h1>Directions</h1>
  <h2>Helping countries stay on course.</h2>
  <!-- <div id="hero-image"></div> -->
</div>
<div class="body-text">
  <p>The Internet Accountability Compass offers more than a snapshot—it provides a sense of direction. Designed for governments and the wider multistakeholder community, the Compass supports accountability by increasing transparency around national policies and actions that shape the digital space. It is both a tool for assessment and a catalyst for progress.
  </p>
  <p>By illuminating where countries stand and how far they have come, the Compass seeks to inspire ambition, encourage peer learning, and foster collective progress toward a digital future that is open, inclusive, secure, and rights-respecting. The Compass is not prescriptive—it does not claim to be the only path forward. Instead, it offers one possible constellation of indicators and data points that reflect shared aspirations.
  </p>
  <p>Rather than claiming to be definitive, the Compass presents one of many possible constellations of indicators and data points. Its purpose is to spark dialogue—about what matters, how progress should be measured, and how countries can hold themselves and each other accountable across four core dimensions: Connectivity and infrastructure, Rights and freedoms, Responsibility and sustainability, and Trust and resilience.
  </p>
    <p>To interpret this progress, the Compass uses four categories to describe each country’s current trajectory:
    </p>
      <ol>
        <li><b>Off Course:</b> The country’s current efforts diverge from international principles and commitments. A strategic shift is needed to align with shared goals.</li>
        <li><b>Getting on Track:</b> The country has taken steps to align with global objectives; foundations are forming, but progress is still limited or uneven.
        </li>
        <li><b>On Track:</b> The country’s policies and actions are aligned with global objectives, showing steady and measurable advancement.
        </li>
        <li><b>Leading:</b> The country is not only on track but is setting a positive example—showing innovation, good practices, or leadership that others can learn from.
        </li>
      </ol>
</div>

<!-- data -->

```js
const dfiFullParse = FileAttachment("./data/dfiFull.csv").csv({ typed: true });
const dfiCardinalParse = FileAttachment("./data/dfiCardinal.csv").csv({
  typed: true,
});
```

<!-- world map and data -->

```js
var worldLoad = FileAttachment("./data/CNTR_RG_60M_2024_4326.json").json();
```

```js
var world = topojson
  .feature(worldLoad, worldLoad.objects.CNTR_RG_60M_2024_4326)
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
```

  <!-- 1. input data -->

```js
const uniquePillars = [
  ...new Set(dfiCardinalParse.map((item) => item.pillar_txt)),
];
// console.log("dfiCardinalParse", dfiCardinalParse);
```

  <!-- 2. input  -->

```js
const filterLegend = (domain, range) => {
  const value = new Map(domain.map((d) => [d, true]));
  const _set = () =>
    Set(
      node,
      [...value].filter((d) => d[1]).map((d) => d[0])
    );
  const oninput = (e) => (value.set(e.target.id, e.target.checked), _set());
  const node = htl.html`<div style="font-family: var(--sans-serif); font-size: 13px; display: flex; gap: 1em;">
    ${domain.map(
      (d, i) => htl.html`<div style="display: flex;">
      <input type="checkbox" id="${d}" name="${d}" checked style="accent-color: ${range[i]}" oninput=${oninput}>
      <label for="${d}">${d}</label>
    </div>`
    )}
  </div>`;
  _set();
  return node;
};
```

```js
console.log("uniquePillars", uniquePillars);
const selectedPillar = view(
  viewofCustomLegend(uniquePillars, "Rights and freedoms", "pillar")
);
```

```js
const dfiFullFiltered = dfiFullParse.filter(
  (d) => d.pillar_txt === selectedPillar
);
```

```js
const commitments = [
  ...new Set(dfiFullFiltered.map((d) => d.commitment_txt_cardinal)),
];
```

<div class="figure-w-full">
    ${resize((width) =>
      mapPillar(
        world,
        dfiCardinalParse,
        "value",
        uniquePillars,
        selectedPillar,
        { width }
      )
    )}
</div>

<!-- CONDITIONAL BODY TEXT PER PILLAR -->

```js
renderPillarContent(selectedPillar);
```

<div id="pillar-content"></div>

<!-- CONDITIONAL COMMITMENT MAPS PER PILLAR -->

```js
// pass selected pillar for coloring
const commitmentLegend = view(
  viewofCustomLegend(commitments, commitments[0], "commitment", selectedPillar)
);
// console.log("commitments", commitments);
// console.log("dfiFullFiltered", dfiFullFiltered);
```

<div class="figure-w-full">
    ${resize((width) =>
      mapPillarCommitment(
        world,
        dfiFullFiltered,
        selectedPillar,
        commitmentLegend,
        { width }
      )
    )}
</div>

```js
// console.log("commitmentLegend", commitmentLegend);
```

<!-- sidebar -->

<div>
    ${sidebar()}
</div>
