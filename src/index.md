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
    <link rel="stylesheet" href="sidebar.css" />
</head>

<!-- import components -->

```js
import { colorScales } from "./components/scales.js";
// import { onlyUnique } from "./components/onlyUnique.js";
// import { polarPlotMultiple } from "./components/polarPlotMultiple.js";
// import { mapPillar } from "./components/mapPillar.js";
// import { mapTotal } from "./components/mapTotal.js";
// import { mapTotalScorecard } from "./components/mapTotalScorecard.js";
import { mapTotalCatGIFIquant5 } from "./components/mapTotalCatGIFIquant5.js";
// import { mapPillarCommitment } from "./components/mapPillarCommitment.js";
import { sidebar } from "./components/sidebar.js";
```

<!-- hero -->

<div class="hero">
  <h1>Internet <br>Accountability <br>Compass</h1>
  <h2 style="text-align: left !important;">Monitoring progress. Guiding policy. Strengthening accountability.</h2>
  <!-- <div id="hero-image"></div> -->
</div>

<!-- # Total score -->
<div class="figure-w-full">
      ${resize((width) => mapTotalCatGIFIquant5(world, coast, dfiFull, dfiCardinal, {width}))}
</div>

<!-- sidebar -->

<div class="body-text">

The Internet is a cornerstone of modern life—shaping how states govern, businesses operate, organisations function, and individuals connect. Recognising its transformative power, the international community has rallied around shared principles to foster a global, open, free, secure, and trustworthy Internet. These principles are enshrined in key political declarations, including the Global Digital Compact and the Declaration on the Future of the Internet.

Yet, despite widespread consensus on these goals, progress toward their realisation remains uneven and often untracked.

The Internet Accountability Compass is designed to fill this gap. It serves as a reference point to assess how countries are advancing from high-level commitments to tangible implementation. By charting national performance across four cardinal dimensions—Connectivity and infrastructure, Rights and freedoms, Responsibility and sustainability, and Trust and resilience—the Compass contributed to bringing clarity to the state of Internet governance worldwide.

Through rigorous, country-specific data and comparative indicators, the Internet Accountability Compass promotes greater transparency, strengthens public accountability, and empowers policymakers, businesses, and civil society to align action with aspiration.

<p style="font-weight: 700;"><a href="./countries.html">Go to country overview →</a></p>

<div class="grid grid-cols-3">
  <div class="card key">
    <h2>Datapoints</h2>
    <span class="big">${dfiFull.length.toLocaleString("en-US")}</span>
  </div>
  <div class="card key">
    <h2>Countries</h2>
    <span class="big">${dfiFull.filter((d) => d.commitment_num === 1).length.toLocaleString("en-US")}</span>
  </div>
  <div class="card key">
    <h2>Indicators</h2>
    <span class="big">12</span>
  </div>
</div>

</div>

<!-- data -->

```js
const dfiFullParse = FileAttachment("./data/dfiFull.csv").csv({ typed: true });
const dfiCardinalParse = FileAttachment("./data/dfiCardinal.csv").csv({
  typed: true,
});
// global color palette
// const colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];
// const colors = ["#32baa7", "#63d8a2", "#b9f27b", "#fff200"];
const colors = ["#32baa7", "#0e4876", "#643291", "#962c8c"];
// lookup
const lookup = {
  3: {
    pillar_txt: "Rights and freedoms",
    commitments: {
      7: { commitment_txt: "Freedom on the Net" },
      8: { commitment_txt: "Global index on Responsible Al" },
      9: { commitment_txt: "Global Cyberlaw Tracker" },
    },
  },
  2: {
    pillar_txt: "Stability and resilience",
    commitments: {
      4: { commitment_txt: "Global Internet Shutdowns" },
      5: { commitment_txt: "Global E-Waste Monitor" },
      6: { commitment_txt: "Overall Resilience" },
    },
  },
  4: {
    pillar_txt: "Connectivity and infrastructure",
    commitments: {
      10: { commitment_txt: "Rule of Law Index" },
      11: { commitment_txt: "Freedom of Expression Index" },
      12: { commitment_txt: "Accountability Index" },
    },
  },
  1: {
    pillar_txt: "Responsibility and sustainability",
    commitments: {
      1: { commitment_txt: "ICT Development Index" },
      2: { commitment_txt: "Global Cybersecurity Index" },
      3: { commitment_txt: "Network Readiness Index" },
    },
  },
};
```

```js
// console.log("dfiCardinalParse", dfiCardinalParse);
// console.log("dfiFullParse", dfiFullParse);
const dfiFull = dfiFullParse.map((item) => {
  const pillar = lookup[item.pillar_num];
  const commitment = pillar?.commitments[item.commitment_num];

  return {
    ...item,
    pillar_txt: pillar?.pillar_txt || item.pillar_txt,
    commitment_txt: commitment?.commitment_txt || item.commitment_txt,
  };
});
const dfiCardinal = dfiCardinalParse.map((item) => {
  const pillar = lookup[item.pillar_num];
  // const commitment = pillar?.commitments[item.commitment_num];

  return {
    ...item,
    pillar_txt: pillar?.pillar_txt || item.pillar_txt,
    // commitment_txt: commitment?.commitment_txt || item.commitment_txt,
  };
});
```

```js
// console.log("dfiFull", dfiFull);
// console.log("dfiCardinal", dfiCardinal);
```

<!-- world map and data -->

<!-- 0. data -->

```js
var worldLoad = FileAttachment("./data/CNTR_RG_60M_2024_4326.json").json();
var coastLoad = FileAttachment("./data/COAS_RG_60M_2016_4326.json").json();
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
var coast = topojson.feature(
  coastLoad,
  coastLoad.objects.COAS_RG_60M_2016_4326
);

// console.log("world (in index", world);
```

  <!-- 1. input data -->

```js
const uniqueCommitments = [
  ...new Set(dfiFull.map((item) => item.commitment_txt)),
];
const uniquePillars = [...new Set(dfiCardinal.map((item) => item.pillar_txt))];
// console.log("uniqueCommitments:", uniqueCommitments);
// console.log("uniquePillars", uniquePillars);
// console.log("dfiCardinal", dfiCardinal);
```

<div>
    ${sidebar()}
</div>
