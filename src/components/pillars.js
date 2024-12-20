import * as Plot from "npm:@observablehq/plot";
// import * as d3 from "npm:d3";

// https://observablehq.com/@observablehq/plot-radar-chart

export function pillars(data, { width, height } = {}) {
  const plot = Plot.plot({
    width: width,
    // height: width / 5 * 2,
    marginLeft: 0,
    marginRight: 0,
    height: width * 0.2,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    x: { domain: [0, 100], axis: false },
    y: { domain: [0, 100], axis: false },
    color: {
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    marks: [
      // voronoi
      Plot.voronoi(data, {
        x: "x",
        y: "y",
        fill: "pillar",
        fillOpacity: 1,
        href: "url",
      }),
      // text
      Plot.text(data, {
        x: "x",
        y: "y",
        // color: "pillar",
        fill: "#643291",
        fontWeight: 900,
        text: (d) => d.pillar.split(" ").join("\n"),
        // text: "pillar",
        PointerEvents: "none",
        fontSize: "3em",
        href: "url",
      }),
      // interactive opacity on the areas
      // () =>
      //   svg`<style>
      //       g[aria-label=area] path {fill-opacity: 0.1; transition: fill-opacity .2s;}
      //       g[aria-label=area]:hover path:not(:hover) {fill-opacity: 0.05; transition: fill-opacity .2s;}
      //       g[aria-label=area] path:hover {fill-opacity: 0.3; transition: fill-opacity .2s;}
      //   `
    ],
  });

  // Select all <text> elements inside the <g> element
  const textElements = plot.querySelectorAll('g[aria-label="text"] text');

  // Loop through each <text> element and set pointer-events to none
  textElements.forEach((textElement) => {
    textElement.style.pointerEvents = "none";
  });

  return plot;
}
