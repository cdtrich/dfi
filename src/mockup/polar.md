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
import { polar } from "../components/polar.js";
```

<!-- data -->

```js
const dfi = FileAttachment("../data/dfi_polar.csv").csv({ typed: true });
const colors = ["#32baa7", "#0e4876", "#643291", "#962c8c"];
```

<!-- world map and data -->

<!-- 0. data -->

```js
const uniqueCommitments = [...new Set(dfi.map((item) => item.commitment_txt))];
```

  <!-- 2. input  -->

# Total score

<div class="card">
    ${resize((width) => polar(dfi, {width}))}
</div>
