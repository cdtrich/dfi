import * as Plot from "../../_npm/@observablehq/plot@0.6.15/_esm.js";
import * as d3 from "../../_npm/d3@7.9.0/_esm.js";
import colorScales from "./scales.bcdc1154.js";
// https://observablehq.com/@observablehq/plot-radar-chart

export function polarCountry(data, country) {
  // chart width
  const vw = window.innerWidth;
  const dotSize = window.innerWidth * 0.006;
  // console.log("dotSize", dotSize);

  const dataFiltered = data.filter((d) => d.NAME_ENGL === country);

  // get colorsScales()
  const fillScale = colorScales();
  const longitude = d3
    .scalePoint(
      new Set(Plot.valueof(dataFiltered, "commitment_num_cardinal")),
      [180, -180]
    )
    .padding(0.5)
    .align(1);

  // console.log("dataFiltered", dataFiltered);
  const legend = [...new Set(dataFiltered.map((item) => item.pillar_txt))];
  // console.log("legend", legend);
  // console.log(fillScale.getColor(legend[1]));

  // PLOT //////////////////////////
  const plot = Plot.plot({
    width: vw / 3,
    marginTop: -60,
    // x: { axis: "top", label: null },
    // y: { label: null },
    projection: {
      type: "azimuthal-equidistant",
      rotate: [-60, -90],
      // Note: 1.22° corresponds to max. percentage (1.0), plus some room for the labels
      domain: d3.geoCircle().center([0, 90]).radius(1.22)(),
    },
    color: {
      domain: legend,
      range: [
        fillScale.getColor(legend[0]),
        fillScale.getColor(legend[1]),
        fillScale.getColor(legend[2]),
        fillScale.getColor(legend[3]),
      ],
      legend: false,
    },
    r: {
      range: [1, dotSize / 2],
    },
    marks: [
      // grey discs
      Plot.geo([1.0, 0.8, 0.6, 0.4, 0.2], {
        geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
        stroke: "black",
        fill: "black",
        strokeOpacity: 0.3,
        fillOpacity: 0.01,
        strokeWidth: 0.5,
      }),

      // grey areas
      Plot.area(dataFiltered, {
        x1: (d) => longitude(d.commitment_num_cardinal),
        y1: (d) => (isNaN(d.value) ? 90 : 90 - d.value / 100),
        x2: 0,
        y2: 90,
        z: "ISO3_CODE",
        stroke: "#ccc",
        fill: (d) => fillScale.getColor("Total", d.total),
        fillOpacity: 0.1,
        curve: "cardinal-closed",
      }),

      // cardinal lines
      Plot.link(dataFiltered, {
        x1: ({ commitment_num_cardinal }) => longitude(commitment_num_cardinal),
        y1: ({ value }) => 90 - value / 100,
        x2: ({ commitment_num_cardinal }) => longitude(commitment_num_cardinal),
        y2: 90,
        stroke: (d) => fillScale.getColor(d.pillar_txt),
        // stroke: (d) =>
        //   fillScale.getOrdinalCategoryScale(d.pillar_txt)(d.group_value),
        strokeWidth: dotSize * 0.66,
        // strokeWidth: (d) => d.value / dotSize / 4,
      }),

      // multiple cardinal lines (for V-shaped width)
      Plot.link(dataFiltered, {
        x1: (d) => longitude(d.commitment_num_cardinal) - 2,
        y1: ({ value }) => 90 - value / 100,
        x2: (d) => longitude(d.commitment_num_cardinal),
        y2: 90,
        stroke: (d) => fillScale.getColor(d.pillar_txt, d.value),
        // stroke: (d) =>
        //   fillScale.getOrdinalCategoryScale(d.pillar_txt)(d.group_value),
        strokeWidth: dotSize,
        opacity: 0.5,
      }),
      Plot.link(dataFiltered, {
        x1: (d) => longitude(d.commitment_num_cardinal) + 2,
        y1: ({ value }) => 90 - value / 100,
        x2: (d) => longitude(d.commitment_num_cardinal),
        y2: 90,
        stroke: (d) => fillScale.getColor(d.pillar_txt),
        // stroke: (d) =>
        //   fillScale.getOrdinalCategoryScale(d.pillar_txt)(d.group_value),
        strokeWidth: dotSize,
        opacity: 0.5,
      }),

      // white dot in center
      Plot.geo([0.03], {
        geometry: (r) => d3.geoCircle().center([0, 90]).radius(r)(),
        stroke: null,
        fill: "#fff",
        fillOpacity: 1,
      }),

      // cardinal points
      Plot.dot(dataFiltered, {
        x: ({ commitment_num_cardinal }) => longitude(commitment_num_cardinal),
        y: ({ value }) => 90 - value / 100,
        fill: (d) => fillScale.getColor(d.pillar_txt),
        stroke: "#fff",
        strokeWidth: dotSize / 2,
        r: dotSize,
      }),

      // cardinal point labels
      // Plot.text(dataFiltered, {
      //   x: (d) => longitude(d.commitment_num_cardinal),
      //   y: (d) => 90 - d.value / 100,
      //   fill: (d) => fillScale.getColor(d.pillar_txt),
      //   text: (d) => Math.round(d.value),
      //   stroke: "#fff",
      //   strokeWidth: 5,
      //   fontSize: 20,
      // }),

      // interactive labels
      Plot.tip(
        dataFiltered,
        Plot.pointer({
          x: ({ commitment_num_cardinal }) =>
            longitude(commitment_num_cardinal),
          y: ({ value }) => 90 - value / 100,
          title: (d) =>
            `${Math.round(d.value)}` + "\n" + `${d.commitment_txt_cardinal}`,
          dx: 4,
          stroke: "white",
          anchor: "bottom",
          fontSize: 100,
        })
      ),
    ],
  });
  return plot;
}
