import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

// https://observablehq.com/plot/marks/rect

export function gridPlotMultiple(data, selectCountry, { width, height } = {}) {
  console.log(data);
  // chart width
  const vw = window.innerWidth;

  const n = vw > 760 ? 6 : 2; // number of facet columns
  const keys = Array.from(d3.union(data.map((d) => d.NAME_ENGL)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);

  // Get filtered data based on selectCountry
  const filteredData = data.filter((item) =>
    selectCountry.includes(item.NAME_ENGL)
  );
  // selectCountry && selectCountry.length > 0
  //   ? data.filter((item) => selectCountry.includes(item.NAME_ENGL))
  //   : data; // If no input or array is empty, use all data

  // const check = fx(filteredData, (d) => d.NAME_ENGL);

  // country name labels
  const countryNames = filteredData
    // .filter((item) => item.name === "Goal" && item.x === 3) // Step 1: Filter by commitment_txt
    .reduce((acc, current) => {
      // Step 2: Ensure only one entry per NAME_ENGL
      if (!acc.find((item) => item.NAME_ENGL === current.NAME_ENGL)) {
        acc.push(current);
      }
      return acc;
    }, []);

  // console.log(check);

  const plot = Plot.plot({
    width: width,
    height: height,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    // strokeWidth: { range: [0.1, 1] },
    // r: { range: [0.2, 5] },
    x: { ticks: 0, label: null }, // Disable x-axis ticks and label
    y: { domain: [1, 5], ticks: 0, label: null }, // Disable y-axis ticks and label
    fx: { padding: 0, ticks: 0, label: null }, // No fx facet ticks or labels
    fy: { padding: 0, ticks: 0, label: null }, // No fy facet ticks or labels
    // opacity: { range: [0, 1] },
    // tickLabel: "",
    // facet: { label: null }, // Ensure no facet label is generated
    color: {
      legend: false,
      range: ["#32baa7", "#fff200", "#e87461"],
      // range: ["#f9dbbd", "#ffa5ab", "#da627d", "#a53860", "#450920"],
    },
    marks: [
      Plot.rect(data, {
        x: "x",
        y: "y",
        interval: 1,
        inset: 2,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        fill: "name",
        opacity: "val",
        href: "country_url",
        tip: true,
      }),
      // clickable country name
      // Plot.text(
      //   countryNames,
      //   Plot.pointer({
      //     x: (d) => "x",
      //     y: (d) => 20,
      //     fx: (d) => fx(d.NAME_ENGL),
      //     fy: (d) => fy(d.NAME_ENGL),
      //     fontSize: "1.5em",
      //     // fontWeight: "bold",
      //     stroke: "#fff",
      //     strokeWidth: 0.33,
      //     text: "NAME_ENGL",
      //     textAnchor: "center",
      //     fill: "currentColor",
      //     // href: "country_url",
      //   })
      // ),
      Plot.text(countryNames, {
        x: "x",
        y: 4.5,
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

  // Remove elements with aria-label for tick labels
  d3.selectAll('g[aria-label="fy-axis tick label"]').attr("opacity", 0);
  d3.selectAll('g[aria-label="fx-axis tick label"]').attr("opacity", 0);

  return plot;
}
