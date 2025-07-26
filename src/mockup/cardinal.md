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
import { polarPlotMultipleCol } from "../components/polarPlotMultipleCol.js";
```

<!-- data -->

```js
const dfiParse = FileAttachment("../data/dfi.csv").csv({ typed: true });
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
```

```js
var countries = dfi.map((d) => d.NAME_ENGL);
```

<div class="card" id="polarPlotMultiple">
    ${resize((width) => polarPlotMultipleCol(dfi, countries, {width}))}
  </div>
