<!-- import externals -->
<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<!-- <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"> -->
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
// import { polarPlotMultiple } from "./components/polarPlotMultiple.js";
import { mapPillar } from "./components/mapPillar.js";
import { mapTotal } from "./components/mapTotal.js";
import { mapTotalScorecard } from "./components/mapTotalScorecard.js";
import { mapTotalCatGIFIquant5 } from "./components/mapTotalCatGIFIquant5.js";
import { mapPillarCommitment } from "./components/mapPillarCommitment.js";
import { sidebar } from "./components/sidebar.js";
```

<!-- hero -->

<div class="hero">
  <h1>Methodology</h1>
  <!-- <div id="hero-image"></div> -->
  </div>
<div class="body-text">
  <p>The Internet Accountability Compass provides a structured, comparative view of how countries are implementing key digital policy commitments that shape the governance and experience of the Internet. It draws on selected, publicly available datasets and indices to promote transparency, support self-assessment, and enable peer learning—rather than ranking or naming and shaming.
  </p>
  <p>The authors recognise that the Compass reflects only one of several valid approaches to combining and interpreting available data. It is not intended as a categorical assessment of national performance, but rather as a tool to initiate reflection and dialogue on how Internet accountability can be assessed, understood, and strengthened over time.
</p>
<h2>Framework</h2>
  <p>The Compass is organised around four core dimensions:
</p>
<ol>
<li>Connectivity and infrastructure

</li>
<li>Rights and freedoms

</li>
<li>Responsibility and sustainability

</li>
<li>Trust and resilience

</li>
</ol>
  <p>These dimensions reflect widely recognised principles and commitments articulated in international political declarations, including the Global Digital Compact and the Declaration for the Future of the Internet. For a full mapping of commitments and their relevance to the Compass framework, see Methodological Note 1.
</p>
  <p>Given the methodological complexity and time constraints involved in producing original data, each dimension is informed by established external sources that capture legal, institutional, and practical conditions across countries.
</p>
<h2>Data Sources</h2>
  <p>The Compass draws on established global indices and datasets, selected for their transparency, methodological rigour, and regular updates. These include:
</p>
<ol>
<li>ICT Development Index, Network Readiness Index, and data on Internet shutdowns for Connectivity and infrastructure;
</li>
<li>Freedom on the Net, Freedom in the World Index, and Rule of Law Index for Rights and freedoms;
</li>
<li>Global Index on Responsible AI, Digital Trade and Integration Index, and Global E-Waste Monitor for Responsibility and sustainability;
</li>
<li>Global Cybersecurity Index, Internet Society’s Resilience Index, and Accountability Index for Trust and resilience.
</li>
</ol>
<p>Each source provides a distinct perspective, capturing dimensions such as legal guarantees, digital inclusion, environmental sustainability, and institutional trust.</p>
<p>Indicators were selected based on global coverage, thematic relevance, methodological transparency, and frequency of updates. Preference was given to sources used in international reporting or aligned with multilateral digital policy frameworks.
</p>
<p>The methodology is framed in global terms, but different regions and income levels face vastly different challenges. This might lead to perceptions of unfair comparison. Therefore, while the Compass applies a universal framework, interpretation of results should consider national contexts, including levels of development, institutional capacity, and regional policy environments.
</p>
<h2>Aggregation and Categorisation
</h2>
  <p>The Compass does not generate composite scores or global rankings. Instead, it employs a directional assessment framework, categorising countries into four levels of progress within each dimension:
</p>

<ol>
  <li>Leading (Score 100–80): Demonstrating strong leadership, innovation, or exemplary practices.
  </li>
  <li>On Track (79–65): Policies aligned with global objectives and showing steady implementation.
  </li>
  <li>Getting on Track (64–50): Early efforts visible, though progress remains limited or uneven.
  </li>
  <li>Off Course (49–0): Divergence from international norms or significant implementation gaps, reliable data might be missing.
  </li>
</ol>
  <p>These categories are derived through comparative analysis and qualitative interpretation of underlying data across multiple indicators.
</p>
  <h2>Composition and scoring
</h2>
  <p>The Compass comprises 12 secondary indicators, grouped into the four directional categories.
</p>
<ol>
<li>The Total Score is calculated as the equally weighted average of all available indicators. Countries with data for fewer than 8 of the 12 indicators are excluded from total scoring.
</li>
<li>A Directional Score reflects the average of the three indicators within a given category. At least 2 out of 3 indicators are required for a directional score to be assigned.
</li>
</ol>
  <p>As the Compass relies on secondary data, results may be influenced by variations in methodology, data quality, or temporal gaps between sources. While directional assessments offer comparative insights, they do not capture the full nuance of local implementation or informal practices.
</p>
  <p>All indicator sources, any modifications made to original datasets, and detailed scoring methodology are documented in Methodological Note 2. The data used for this edition of the Compass was collected as of 1 April 2025. The Compass might be updated annually, subject to the availability of new data, methodological refinements and resources.
</p>
  <p>Although indicators are weighted equally in score calculations, we acknowledge that overlapping variables across indices may result in implicit weighting effects. Methodological Note 3 explains these overlaps and potential biases.
</p>
<h2>Purpose and Use</h2>
<p>The Internet Accountability Compass is not an audit mechanism or compliance checklist. It serves as a reference tool for governments, researchers, and civil society to assess national progress, identify trends, and learn from comparative practice. It is intended to bridge the gap between high-level digital commitments and their implementation—contributing to a more inclusive, rights-based, and accountable digital future.
</p>
<h2>Feedback</h2>
<p>The authors welcome feedback and suggestions to improve the Compass. To contribute, please contact: gifi@eui.eu</p>
<h2>Disclaimer</h2>
<p>The Internet Accountability Compass was developed by a research team of the Global Initiative on the Future of the Internet at the European University Institute. The content reflects the views of its authors and does not represent the official position of the European Union or any of its institutions.</p>
</div>

<!-- sidebar -->

<div>
    ${sidebar()}
</div>
