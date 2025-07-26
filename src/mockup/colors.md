---
toc: false
sidebar: false
pager: null
footer: false
theme: air
---

<!-- back to root button -->

<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
</head>

<!-- import components -->

```js
import { colorScales } from "../components/scales.js";
import { onlyUnique } from "../components/onlyUnique.js";
import { mapTotalCatVir } from "../components/mapTotalCatVir.js";
import { mapTotalCatBrew } from "../components/mapTotalCatBrew.js";
import { mapTotalCatGIFI } from "../components/mapTotalCatGIFI.js";
import { mapTotalCatGIFIquant5 } from "../components/mapTotalCatGIFIquant5.js";
import { mapTotalCatGIFIquant3 } from "../components/mapTotalCatGIFIquant3.js";
```

<!-- data -->

```js
const dfiParse = FileAttachment("../data/dfi.csv").csv({ typed: true });
const dfiCompassParse = FileAttachment("../data/dfi-compass.csv").csv({
  typed: true,
});
// global color palette
// const colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];
// const colors = ["#32baa7", "#63d8a2", "#b9f27b", "#fff200"];
const colors = ["#32baa7", "#0e4876", "#643291", "#962c8c"];
// lookup
const lookup = {
  3: {
    pillar_txt: "Human Rights",
    commitments: {
      7: { commitment_txt: "Freedom on the Net" },
      8: { commitment_txt: "Global index on Responsible Al" },
      9: { commitment_txt: "Global Cyberlaw Tracker" },
    },
  },
  2: {
    pillar_txt: "Negative Obligations",
    commitments: {
      4: { commitment_txt: "Global Internet Shutdowns" },
      5: { commitment_txt: "Global E-Waste Monitor" },
      6: { commitment_txt: "Overall Resilience" },
    },
  },
  4: {
    pillar_txt: "Enabling Environment",
    commitments: {
      10: { commitment_txt: "Rule of Law Index" },
      11: { commitment_txt: "Freedom of Expression Index" },
      12: { commitment_txt: "Accountability Index" },
    },
  },
  1: {
    pillar_txt: "Positive Obligations",
    commitments: {
      1: { commitment_txt: "ICT Development Index" },
      2: { commitment_txt: "Global Cybersecurity Index" },
      3: { commitment_txt: "Network Readiness Index" },
    },
  },
};
```

```js
const dfi = dfiParse.map((item) => {
  const pillar = lookup[item.pillar_num];
  const commitment = pillar?.commitments[item.commitment_num];

  return {
    ...item,
    pillar_txt: pillar?.pillar_txt || item.pillar_txt,
    commitment_txt: commitment?.commitment_txt || item.commitment_txt,
  };
});
const dfiCompass = dfiCompassParse.map((item) => {
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
// console.log("dfi", dfi);
// console.log("dfiCompass", dfiCompass);
```

<!-- world map and data -->

<!-- 0. data -->

```js
var worldLoad = FileAttachment("../data/map.json").json();
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
const uniqueCommitments = [...new Set(dfi.map((item) => item.commitment_txt))];
const uniquePillars = [...new Set(dfiCompass.map((item) => item.pillar_txt))];
// console.log("uniqueCommitments:", uniqueCommitments);
// console.log("uniquePillars", uniquePillars);
```

  <!-- 2. input  -->

# Total score

<div class="card">
    ${resize((width) => mapTotalCatVir(world, dfiCompass, {width}))}
</div>

<div class="card">
    ${resize((width) => mapTotalCatBrew(world, dfiCompass, {width}))}
</div>

<div class="card">
    ${resize((width) => mapTotalCatGIFI(world, dfiCompass, {width}))}
</div>

<div class="card">
    ${resize((width) => mapTotalCatGIFIquant5(world, dfiCompass, {width}))}
</div>

<div class="card">
    ${resize((width) => mapTotalCatGIFIquant3(world, dfiCompass, {width}))}
</div>
