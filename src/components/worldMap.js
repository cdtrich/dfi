import * as Plot from "npm:@observablehq/plot";
// import {addTooltips} from "https://observablehq.com/@mkfreeman/plot-tooltip";
// import {addTooltips} from "@mkfreeman/plot-tooltip";
// import * as d3 from "npm:d3";

// https://observablehq.com/@observablehq/plot-radar-chart

export function worldMap(world, filtered, { width, height } = {}) {
  // console.log(filtered);

  const colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];

  return Plot.plot({
    projection: "equal-earth", // Set the projection
    width: width,
    // width: 1920,
    color: {
      // label: "DFI commitment score", // Update legend label
      // type: "linear", // Linear scale for color progression
      range: ["#f9dbbd", "#ffa5ab", "#da627d", "#a53860", "#450920"],
      // range: ["#034ea2ff", "#32baa7ff", "#fff200ff"],
      // legend: true, // Add the legend
    },
    marks: [
      // Plot.sphere(),
      // world outline
      Plot.geo(world, {
        stroke: "white", // Add county boundaries using the geo mark
        strokeWidth: 0.5,
        strokeOpacity: 0.5,
        // title: (d) => `${d.properties.NAME_ENGL}`,
        // tip: true
      }),
      // colored countries
      Plot.geo(filtered, {
        // fill: "#fff",
        fill: (d) =>
          colors[parseInt(d.properties.pillar.replace("Pillar ", ""), 10) - 1], // Color based on the pillar property
        href: (d) => d.properties.country_url,
      }),
      // country labels
      Plot.dot(
        filtered,
        Plot.centroid({
          // fill: "red",
          stroke: null,
          // tip: true,
          href: "./" + "country_url",
          tip: true,
          title: (d) => d.properties.NAME_ENGL,
          // title: (d) => `${d.properties.NAME_ENGL}  ${d.properties.type}`, // Custom tooltip text
        })
      ),
    ],
  });
}
