<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="./sidebar.css" />
</head>

<!-- back to root button -->
<a href="../" class="back-to-root">
  <span class="arrow"></span>
</a>

<!-- import components -->

```js
import { colorScales } from "./components/scales.js";
import { onlyUnique } from "./components/onlyUnique.js";
import { sources } from "./components/sources.js";
import { sidebar } from "./components/sidebar.js";
```

<!-- data -->

```js
const sourcesData = FileAttachment("./data/sources.csv").csv({
  typed: true,
});
```

<!-- hero -->
<div class="hero">
  <h1>Perspectives</h1>
  <h2>Sharing knowledge to accelerate progress.</h2>
  <!-- <div id="hero-image"></div> -->
</div>

<div class="body-text">
<p>Accountability in the digital realm is not a new concept—extensive research, advocacy, and policy innovation have shaped the global understanding of what it means to build a safe, inclusive, and rights-respecting Internet. Around the world, governments, civil society, international organisations, and research institutions have developed tools, frameworks, and initiatives to uphold commitments to connectivity, human rights, sustainability, and resilience.</p>

<p>Yet this valuable knowledge often remains fragmented, siloed by region, sector, or theme. This section brings together a curated collection of complementary sources, analysis, and projects that highlight good practices, policy innovations, and real-world applications of the principles captured in the Internet Accountability Compass.</p>

<p>Whether it's a successful regulatory reform, an inclusive AI policy, a transparent approach to digital trade, or a strong national cybersecurity framework—these examples demonstrate that progress is possible. They also offer insights into how shared digital principles, such as those in the Global Digital Compact, can be translated into meaningful action.</p>

<p>Together, these resources help build a clearer picture of what digital accountability looks like in practice—and how it can be strengthened globally.</p>
</div>

<!-- data processing -->

```js
const sourceTypeUnique = [...new Set(sourcesData.map((d) => d.type))];
const sourceCountryUnique = [...new Set(sourcesData.map((d) => d.NAME_ENGL))];
```

<!-- input controls -->

```js
const selectSourceType = view(
  Inputs.checkbox(sourceTypeUnique, {
    label: "Source type",
    format: (x) =>
      html`<span style="font-weight: [400, 700, 200];">${x}</span>`,
  })
);
const selectSourceCountry = view(
  Inputs.search(sourceCountryUnique, {
    value: "",
    datalist: sourceCountryUnique,
    placeholder: "Search countries",
  })
);
```

<!-- filtered data -->

```js
const sourcesDataFiltered = sourcesData.filter((d) => {
  const typeMatch =
    !selectSourceType ||
    selectSourceType.length === 0 ||
    selectSourceType.includes(d.type);
  const countryMatch =
    !selectSourceCountry ||
    selectSourceCountry.length === 0 ||
    selectSourceCountry.includes(d.NAME_ENGL);
  return typeMatch && countryMatch;
});
```

<!-- output -->

```js
sources(sourcesDataFiltered);
```

<!-- debug tables (optional) -->

```js
Inputs.table(sourcesDataFiltered);
```

```js
Inputs.table(sourcesData);
```

<!-- sources section -->
<div id="sources-section"></div>

<!-- sidebar -->
<div>
    ${sidebar()}
</div>
