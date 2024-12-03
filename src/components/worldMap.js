import * as Plot from "npm:@observablehq/plot";
// import {addTooltips} from "https://observablehq.com/@mkfreeman/plot-tooltip";
// import {addTooltips} from "@mkfreeman/plot-tooltip";
// import * as d3 from "npm:d3";

export function worldMap(world, filtered, { width, height } = {}) {
  const colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];

  const plot = Plot.plot({
    projection: "equal-earth", // Set the projection
    width: width,
    // width: 1920,
    color: {
      range: ["#f9dbbd", "#ffa5ab", "#da627d", "#a53860", "#450920"],
    },
    marks: [
      // world outline
      Plot.geo(world, {
        stroke: "white", // Add county boundaries using the geo mark
        strokeWidth: 0.5,
        strokeOpacity: 0.5,
      }),
      // colored countries
      Plot.geo(filtered, {
        fill: (d) =>
          colors[parseInt(d.properties.pillar.replace("Pillar ", ""), 10) - 1], // Color based on the pillar property
        href: (d) => d.properties.country_url,
      }),
      // country labels
      Plot.dot(
        filtered,
        Plot.centroid({
          stroke: null,
          href: "./" + "country_url",
          tip: true,
          title: (d) => d.properties.NAME_ENGL,
        })
      ),
    ],
  });

  return plot;
}
