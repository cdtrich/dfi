---
theme: dashboard
title: State of the internet dashboard
toc: false
---

# State of the internet

<!-- import components -->
```js
// import * as Plot from "npm:@observablehq/plot";
import {straightPlot} from "./components/straightPlot.js";
import {barPlot} from "./components/barPlot.js";
import {onlyUnique} from "./components/onlyUnique.js";
import {polarPlot} from "./components/polarPlot.js";
import {worldMap} from "./components/worldMap.js";
```

<!-- style -->
<style>
[aria-label=dot] {
  {opacity: 1; transition: opacity .2s;}
}

[aria-label=dot]:hover cricle:not(:hover) {
  opacity: 0.2; 
  transition: opacity .2s;
  }

[aria-label=dot] circle:hover {
  opacity: 1; 
  transition: opacity .2s;
  }
</style>

<!-- parameters -->
```js
// const width = 1200;
// const height = width;
// const margin = 0;
// const innerRadius = width / 5;
// const outerRadius = width / 2 - margin;
```

<!-- import data -->
```js 
// const dfiAll = FileAttachment("data/dataAll.csv").csv({typed: true});
const dfi = FileAttachment("dataAll.csv").csv({typed: true});
```

<!-- import maps -->
<!-- DO WE NEED THIS? -->
```js
const countriesLoad = FileAttachment("data/CNTR_RG_60M_2020_4326.json").json() 
const countries = topojson.feature(countriesLoad, countriesLoad.objects.CNTR_RG_60M_2020_4326).features
const countriesJoin = new Map(data.map(({Country, Total}) => [Country, Total]))
```

## Key figures

<!-- summary cards -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Entries<span class="muted"> / datapoints</span></h2>
    <span class="big">${dfi.length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Countries<span class="muted"> / territories</span></h2>
    <span class="big">${dfi.filter((d) => d.indNum === 1).length.toLocaleString("en-US")}</span>
  </div>
  <div class="card">
    <h2>Indicators<span class="muted"> / principles</span></h2>
    <span class="big">15</span>
  </div>
  <div class="card">
    <h2>Groups<span class="muted"> / columns</span></h2>
    <span class="big">5</span>
  </div>
</div>

## Good practice map

```js
var worldLoad = FileAttachment("worldMap.json").json()
// display(worldLoad)
// console.log(worldLoad)
var world = topojson.feature(worldLoad, worldLoad.objects.CNTR_RG_60M_2020_4326).features
```


<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => worldMap(dfi, {width}))}
  </div>
</div>

## The data in full

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => straightPlot(dfi, {width}))}
  </div>
</div>

## The data per country

<!-- country names and filtering -->
```js
var countries = dfi.map(d => d.NAME_ENGL)
var countryUnique = countries.filter(onlyUnique);
// display(countryUnique);
// DROPDOWN
var country = view(Inputs.select(countryUnique, {value: "Select a country", label: "Country"}));
// display(country);
```
```js
var dfiCountry = dfi.filter(d => d.NAME_ENGL === country)
// var dfiLongitude = d3.scalePoint(new Set(Plot.valueof(dfiCountry, "indicator")), [180, -180]).padding(0.5).align(1)
// display(dfiCountry);
```
<!-- plot -->
<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => barPlot(dfiCountry, {width}))}
  </div>
  <div class="card">
    ${resize((width) => polarPlot(dfiCountry, {width}))}
  </div>
</div>

## \<forNerds\>
<!-- table -->
```js
// display(uniqueCount);
display(Inputs.table(dfi, {width: 1200}));
// polarPlot(dfi);
// straightPlot(dfi, {width: 1200, height: 600});
// straightPlot(dfi, {width: 1200});
```
