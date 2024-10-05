import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { onlyUnique } from "./onlyUnique.js";

// https://observablehq.com/@observablehq/plot-radar-chart

export function polarPlotMultiple(
  data,
  // country,
  // commitments,
  selectCountry,
  { width, height } = {}
) {
  const n = 6; // number of facet columns
  const keys = Array.from(d3.union(data.map((d) => d.NAME_ENGL)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);

  // chart width
  const vw = window.innerWidth;

  // Get filtered data based on selectCountry
  const filteredData =
    selectCountry && selectCountry.length > 0
      ? data.filter((item) => selectCountry.includes(item.NAME_ENGL))
      : data; // If no input or array is empty, use all data

  // console.log(selectCountry);
  // console.log(filteredData);
  // console.log(data);

  // var countries = data.map((d) => d.NAME_ENGL);
  // var countryUnique = countries.filter(onlyUnique);

  // var commitment = data.map((d) => d.commitment_txt);
  // var commitmentUnique = commitment.filter(onlyUnique);

  const longitude = d3
    .scalePoint(new Set(Plot.valueof(data, "commitment_txt")), [180, -180])
    .padding(0.5)
    .align(1);

  // remove facet labels
  // let fxLabel = document.querySelectorAll('[aria-label="fx-axis tick label"]');
  // fxLabel.forEach((element) => {
  //   element.style.display = "none";
  // });

  // let fyLabel = document.querySelectorAll('[aria-label="fy-axis tick label"]');
  // fyLabel.forEach((element) => {
  //   element.style.display = "none";
  // });

  // country name labels
  const countryNames = filteredData
    .filter((item) => item.commitment_txt === "commitment A") // Step 1: Filter by commitment_txt
    .reduce((acc, current) => {
      // Step 2: Ensure only one entry per NAME_ENGL
      if (!acc.find((item) => item.NAME_ENGL === current.NAME_ENGL)) {
        acc.push(current);
      }
      return acc;
    }, []);

  // console.log(countryNames);

  return Plot.plot({
    width: width,
    height: height,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    projection: {
      type: "azimuthal-equidistant",
      rotate: [0, -90],
      // Note: 0.625° corresponds to max. length (here, 0.5), plus enough room for the labels
      domain: d3.geoCircle().center([0, 90]).radius(10000.625)(),
    },
    // strokeWidth: { range: [0.1, 1] },
    r: { range: [0.2, 5] },
    x: { ticks: 0, label: null },
    y: { ticks: 0, label: null },
    fx: { padding: 0, ticks: 0, label: null }, // No labels or ticks on fx facet
    fy: { padding: 0, ticks: 0, label: null }, // No labels or ticks on fy facet
    tickLabel: "",
    facet: { label: null }, // Ensure no facet label is generated
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
      // range: ["#f9dbbd", "#ffa5ab", "#da627d", "#a53860", "#450920"],
    },
    marks: [
      // lines
      Plot.link(filteredData, {
        x1: (d) => longitude(d.commitment_txt),
        x2: (d) => longitude(d.commitment_txt),
        y1: (d) => 90,
        y2: (d) => 90 - d.value,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        stroke: (d) => d.pillar,
        strokeWidth: 1,
        // strokeWidth: (d) => d.value,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        opacity: 0.33,
        href: "country_url",
        // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
        // tip: true,
      }),
      // radial lines
      // Plot.lineX(data, {
      //   x: (d) => longitude(d.commitment_txt),
      //   y: (d) => 90 - d.value,
      //   fx: (d) => fx(d.NAME_ENGL),
      //   fy: (d) => fy(d.NAME_ENGL),
      //   stroke: (d) => d.pillar,
      //   // fill: (d) => d.pillar,
      //   strokeWidth: 2,
      //   strokeLinejoin: "round",
      //   strokeLinecap: "round",
      //   opacity: 0.5,
      //   // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
      //   // tip: true,
      // }),
      // points
      // Plot.dot(data, {
      //   x: (d) => longitude(d.commitment_txt),
      //   y: (d) => 90 - d.value,
      //   fx: (d) => fx(d.NAME_ENGL),
      //   fy: (d) => fy(d.NAME_ENGL),
      //   fill: (d) => d.pillar,
      //   r: (d) => d.value,
      //   opacity: 0.05,
      // }),
      Plot.dot(filteredData, {
        x: (d) => longitude(d.commitment_txt),
        y: (d) => 90 - d.value,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        fill: "#3C4099",
        stroke: (d) => d.pillar,
        r: (d) => d.value,
        opacity: 1,
        href: "country_url",
      }),
      Plot.dot(
        filteredData,
        Plot.pointer({
          x: (d) => longitude(d.commitment_txt),
          y: (d) => 90 - d.value,
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          fill: (d) => d.pillar,
          r: (d) => d.value,
          opacity: 1,
          // href: "country_url",
          // tip: true,
          // title: (d) => `${d.commitment_txt}: ${Math.round(d.value)}`,
        })
      ),
      // Plot.axisX(data, { label: null, lineWidth: 0 }),
      // Plot.axisY(data, { label: null, lineWidth: 0 }),
      // invisible large lines that make whole graph clickable
      Plot.link(filteredData, {
        x1: (d) => longitude(d.commitment_txt),
        x2: (d) => longitude(d.commitment_txt),
        y1: (d) => 90,
        y2: (d) => 90 - d.value,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        strokeWidth: 20,
        opacity: 0,
        href: "country_url",
        // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
        // tip: true,
      }),
      // clickable country name
      Plot.text(
        countryNames,
        Plot.pointer({
          x: (d) => longitude(d.commitment_txt),
          y: (d) => 20,
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          fontSize: "1.5em",
          // fontWeight: "bold",
          stroke: "#fff",
          strokeWidth: 0.33,
          text: "NAME_ENGL",
          textAnchor: "center",
          fill: "currentColor",
          // href: "country_url",
        })
      ),
      Plot.text(countryNames, {
        x: (d) => longitude(d.commitment_txt),
        y: (d) => 20,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        fontSize: "1.5em",
        text: "NAME_ENGL",
        textAnchor: "center",
        fill: "currentColor",
        href: "country_url",
      }),
    ],
  });
}
