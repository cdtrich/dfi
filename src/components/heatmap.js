import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import colorScales from "./scales.js";

// https://observablehq.com/@observablehq/plot-radar-chart

export function heatmap(data, isMobile, { width } = {}) {
  // chart width
  const vw = window.innerWidth;
  const height = data.length * 5;
  const dotSize = window.innerWidth * 0.006;
  // console.log("heatmap data", data);
  // console.log(
  //   "heatmap data",
  //   data.filter((d) => d.NAME_ENGL === "Ireland")
  // );

  // get colorsScales()
  const fillScale = colorScales();

  // unique country names for clickable country names
  const countryNames = data.filter(
    (d, index, self) =>
      self.findIndex((item) => item.NAME_ENGL === d.NAME_ENGL) === index
  );

  const dataDropNA = data.filter((d) => d.group_value !== "NA");
  // console.log("dataDropNA", dataDropNA);

  // filter dataDropNA to total score
  const yDomainOrder = dataDropNA
    // .sort((a, b) => b.total - a.total)
    .filter((d) => d.pillar_txt === "Total score");
  // console.log("yDomainOrder", yDomainOrder);

  // Create an array of the values in d.NAME_ENGL
  const yDomain = yDomainOrder.map((d) =>
    isMobile ? d.ISO3_CODE : d.NAME_ENGL
  );

  const plot = Plot.plot({
    width: width,
    height: height < 3000 ? 3000 : height,
    // height: vw * 3,
    // height: vw * 2,
    aspectRatio: 15,
    marginLeft: isMobile ? width / 2 : width / 4,
    marginRight: isMobile ? 0 : width / 4,
    marginTop: isMobile ? width / 2 : width / 20,
    // marginTop: height < 32000 ? width / 20 : width / 10,
    // margin: 0,
    // x: { axis: "top", label: null, lineWidth: 10 },
    x: {
      padding: "",
      domain: [
        "Connectivity and infrastructure",
        "Rights and freedoms",
        "Responsibility and sustainability",
        "Trust and resilience",
        "Total score",
      ],
      anchor: "bottom",
      // tickRotate: -45,
    },
    y: { padding: "", domain: yDomain },
    // y: { domain: [-100, 100], axis: null },
    // length: { range: [0, vw / 18] },
    // r: { range: [0, vw / 16] },
    color: {
      legend: false,
      type: "ordinal",
      // dummy for legend only
      range: [
        fillScale.getOrdinalCategoryScale("Rights and freedomds")("Off course"),
        fillScale.getOrdinalCategoryScale("Rights and freedomds")(
          "Catching up"
        ),
        "#00000080",
        "#000",
      ],
      domain: ["Off course", "Catching up", "On track", "Leading"],
    },
    marks: [
      Plot.axisX({
        anchor: "top",
        lineWidth: 10,
        label: null,
        tickSize: 0,
        tickRotate: isMobile ? -90 : 0,
      }),
      Plot.axisY({
        // anchor: "top",
        // lineWidth: 15,
        label: null,
        tickSize: 0,
      }),
      Plot.rect(dataDropNA, {
        x: "pillar_txt",
        y: (d) => (isMobile ? d.ISO3_CODE : d.NAME_ENGL),
        stroke: "#fff",
        strokeWidth: 2,
        fill: (d) =>
          fillScale.getOrdinalCategoryScale(d.pillar_txt)(d.group_value),
        href: (d) => d.country_url,
        // tip: true,
        // title: (d) => `${d.NAME_ENGL}\n${d.pillar_txt}\n${Math.floor(d.value)}`,
      }),
      // value labels
      Plot.text(data, {
        x: "pillar_txt",
        y: (d) => (isMobile ? d.ISO3_CODE : d.NAME_ENGL),
        text: (d) => (isNaN(d.value) ? "" : Math.floor(d.value)),
        fill: (d) => (d.value > 79 ? "#fff" : "#000"),
        fontSize: 10,
        textAnchor: "middle",
        // dy: -5,
      }),
      // tooltip
      Plot.tip(
        data,
        Plot.pointer({
          x: "pillar_txt",
          y: (d) => (isMobile ? d.ISO3_CODE : d.NAME_ENGL),
          fill: (d) => fillScale.getColor(d.pillar_txt, d.value),
          textAnchor: "center",
          stroke: "white",
          // tip: true,
          title: (d) =>
            `${d.NAME_ENGL}\n${d.pillar_txt}\n${Math.floor(d.value)}\n(${
              d.group_value
            })`,
        })
        // clickable invisible country names
        // Plot.text(data, {
        //   x: "pillar_txt",
        //   y: "NAME_ENGL",
        //   text: (d) => d.NAME_ENGL,
        //   fill: "#871236",
        //   fontSize: 10,
        //   textAnchor: "middle",
        // })
      ),
    ],
  });

  return plot;
}
