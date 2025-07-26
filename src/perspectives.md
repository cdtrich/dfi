<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="./sidebar.css" />
</head>

<!-- import components -->

```js
import { colorScales } from "./components/scales.js";
import { onlyUnique } from "./components/onlyUnique.js";
import { goodPracticeCards } from "./components/goodPracticeCards.js";
import { sidebar } from "./components/sidebar.js";
```

<!-- data -->

```js
const sources = FileAttachment("./data/sources.csv").csv({
  typed: true,
});
```

<!-- hero -->

<div class="hero">
  <h1>Perspectives</h1>
  <h2>Sharing knowledge to accelerate progress.</h2>
  <div id="hero-image"></div>
<p style="margin-top: 4em;">Accountability in the digital realm is not a new concept—extensive research, advocacy, and policy innovation have shaped the global understanding of what it means to build a safe, inclusive, and rights-respecting Internet. Around the world, governments, civil society, international organisations, and research institutions have developed tools, frameworks, and initiatives to uphold commitments to connectivity, human rights, sustainability, and resilience.

</p>
<p>Yet this valuable knowledge often remains fragmented, siloed by region, sector, or theme. This section brings together a curated collection of complementary sources, analysis, and projects that highlight good practices, policy innovations, and real-world applications of the principles captured in the Internet Accountability Compass.
</p>
<p>Whether it’s a successful regulatory reform, an inclusive AI policy, a transparent approach to digital trade, or a strong national cybersecurity framework—these examples demonstrate that progress is possible. They also offer insights into how shared digital principles, such as those in the Global Digital Compact, can be translated into meaningful action.
</p>
<p>Together, these resources help build a clearer picture of what digital accountability looks like in practice—and how it can be strengthened globally.
</p>

</div>

<!-- sources -->
  <div id="goodpractice-section">
  </div>

```js
goodPracticeCards(sources);
```

<!-- sidebar -->

<div>
    ${sidebar()}
</div>
