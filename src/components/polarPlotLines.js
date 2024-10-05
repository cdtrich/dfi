import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

// https://observablehq.com/@observablehq/plot-radar-chart

export function polarPlotLines(
  data,
  country,
  commitments,
  { width, height } = {}
) {
  const longitude = d3
    .scalePoint(new Set(Plot.valueof(data, "commitment_txt")), [180, -180])
    .padding(0.5)
    .align(1);

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
    r: { range: [1, 6] },
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
      // range: ["#f9dbbd", "#ffa5ab", "#da627d", "#a53860", "#450920"],
    },
    marks: [
      // lines
      Plot.link(
        data.filter((d) => d.NAME_ENGL === country),
        {
          x1: (d) => longitude(d.commitment_txt),
          x2: (d) => longitude(d.commitment_txt),
          y1: (d) => 90,
          y2: (d) => 90 - d.value,
          stroke: (d) => d.pillar,
          strokeWidth: 2,
          opacity: 0.25,
          // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
          // tip: true,
        }
      ),
      // radial lines
      Plot.lineX(
        data.filter((d) => d.NAME_ENGL === country),
        {
          x: (d) => longitude(d.commitment_txt),
          y: (d) => 90 - d.value,
          stroke: (d) => d.pillar,
          // fill: (d) => d.pillar,
          strokeWidth: 2,
          opacity: 0.25,
          // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
          // tip: true,
        }
      ),
      // points
      Plot.dot(data, {
        x: (d) => longitude(d.commitment_txt),
        y: (d) => 90 - d.value,
        fill: (d) => d.pillar,
        r: (d) => d.value,
        opacity: 0.05,
      }),
      Plot.dot(
        data.filter((d) => d.NAME_ENGL === country),
        {
          x: (d) => longitude(d.commitment_txt),
          y: (d) => 90 - d.value,
          fill: (d) => d.pillar,
          r: (d) => d.value,
          opacity: 1,
          href: "country_url",
        }
      ),
      Plot.text(commitments, {
        x: (d, i) => longitude(commitments[i]),
        y: 20,
        // fontSize: "2em",
        fontFace: "bold",
        // fill: (d) => d.group,
        text: (d, i) => `${commitments[i]}`,
      }),
      // clicable country name
      // Plot.text(
      //   data,
      //   Plot.pointer({
      //     x: ({ key }) => longitude(key),
      //     y: ({ value }) => 90 - value,
      //     text: (d) => `${(100 * d.value).toFixed(0)}%`,
      //     textAnchor: "start",
      //     dx: 4,
      //     fill: "currentColor",
      //     stroke: "white",
      //     maxRadius: 10,
      //   })
      // ),
    ],
  });
}
