import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import colorScales from "./scales.js";

// https://observablehq.com/@observablehq/plot-radar-chart

export function heatmap(data, { width, height } = {}) {
  // chart width
  const vw = window.innerWidth;
  const dotSize = window.innerWidth * 0.006;
  // console.log("heatmap data", data);

  // get colorsScales()
  const fillScale = colorScales();

  // unique country names for clickable country names
  const countryNames = data.filter(
    (d, index, self) =>
      self.findIndex((item) => item.NAME_ENGL === d.NAME_ENGL) === index
  );

  const dataDropNA = data.filter((d) => d.group_value !== "NA");

  const plot = Plot.plot({
    width: width,
    // height: vw * 3,
    // height: vw * 2,
    aspectRatio: 15,
    marginLeft: width / 5,
    marginRight: width / 5,
    // margin: 0,
    // x: { axis: "top", label: null, lineWidth: 10 },
    x: {
      padding: "",
      domain: [
        "Connectivity and infrastructure",
        "Rights and freedoms",
        "Responsibility and sustainability",
        "Trust and resilience",
      ],
    },
    // y: { label: null },
    // y: { domain: [-100, 100], axis: null },
    // length: { range: [0, vw / 18] },
    // r: { range: [0, vw / 16] },
    color: {
      legend: true,
      type: "ordinal",
      range: [
        fillScale.getOrdinalCategoryScale("Rights and freedomds")("Off course"),
        fillScale.getOrdinalCategoryScale("Rights and freedomds")(
          "Getting on track"
        ),
        "#00000080",
        "#000",
      ],
      domain: ["Off course", "Getting on track", "On track", "Leading"],
    },
    marks: [
      Plot.axisX({
        anchor: "top",
        lineWidth: 10,
        label: null,
        tickSize: 0,
      }),
      Plot.axisY({
        // anchor: "top",
        // lineWidth: 15,
        label: null,
        tickSize: 0,
      }),
      Plot.rect(dataDropNA, {
        x: "pillar_txt",
        y: "NAME_ENGL",
        fill: (d) =>
          fillScale.getOrdinalCategoryScale(d.pillar_txt)(d.group_value),
        // tip: true,
        // title: (d) => `${d.NAME_ENGL}\n${d.pillar_txt}\n${Math.round(d.value)}`,
      }),
      // value labels
      Plot.text(data, {
        x: "pillar_txt",
        y: "NAME_ENGL",
        text: (d) => (isNaN(d.value) ? "" : Math.round(d.value)),
        fill: (d) => (d.value > 65 ? "#fff" : "#000"),
        fontSize: 10,
        textAnchor: "middle",
        // dy: -5,
      }),
      // tooltip
      Plot.tip(
        data,
        Plot.pointer({
          x: "pillar_txt",
          y: "NAME_ENGL",
          fill: (d) => fillScale.getColor(d.pillar_txt, d.value),
          textAnchor: "center",
          stroke: "white",
          // tip: true,
          title: (d) =>
            `${d.NAME_ENGL}\n${d.pillar_txt}\n${Math.round(d.value)}`,
        }),
        // clickable invisible country names
        Plot.text(countryNames, {
          x: (d) => "Connectivity and infrastructure",
          y: "NAME_ENGL",
          text: "ISO3_CODE",
          fill: "#000",
          href: "country_url",
          color: "#000",
          // fontSize: 10,
          textAnchor: "middle",
          // dy: -5,
        })
      ),
    ],
  });

  return plot;
}
