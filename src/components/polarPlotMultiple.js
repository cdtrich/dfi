import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import { onlyUnique } from "./onlyUnique.js";

// https://observablehq.com/@observablehq/plot-radar-chart

export function polarPlotMultiple(data, { width, height } = {}) {
  // chart width
  const vw = window.innerWidth;
  const dotSize = window.innerWidth * 0.006;

  const n = vw > 760 ? 6 : 2; // number of facet columns
  const keys = Array.from(d3.union(data.map((d) => d.NAME_ENGL)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);

  const countryNames = data.filter(
    (d, index, self) =>
      self.findIndex((item) => item.NAME_ENGL === d.NAME_ENGL) === index
  );

  // Group data by pillar_txt
  const groupedData = Object.values(
    data.reduce((acc, curr) => {
      const {
        pillar_txt,
        pillar_num,
        commitment_num,
        commitment_txt,
        pillar_url,
      } = curr;

      if (!acc[pillar_txt]) {
        acc[pillar_txt] = {
          pillar_txt,
          pillar_num,
          x1: commitment_num,
          x2: commitment_num,
          x: commitment_num,
          commitment_txt: commitment_txt,
          pillar_url: pillar_url,
        };
      } else {
        acc[pillar_txt].x1 = Math.min(acc[pillar_txt].x1, commitment_num);
        acc[pillar_txt].x2 = Math.max(acc[pillar_txt].x2, commitment_num);
        acc[pillar_txt].x = (acc[pillar_txt].x1 + acc[pillar_txt].x2) / 2;
      }

      return acc;
    }, {})
  );

  const calculateCoordinates = (data) => {
    const increment = 360 / 23; // Angle increment in degrees
    const result = data.map((d) => {
      const angleDegrees = d.commitment_num * increment; // Determine angle
      const angleRadians = (angleDegrees * Math.PI) / 180; // Convert to radians
      const x = d.value * Math.cos(angleRadians);
      const y = d.value * Math.sin(angleRadians);
      return { ...d, x, y }; // Return the data with x and y coordinates
    });
    return result;
  };

  const points = calculateCoordinates(data);
  // const uniqueCommitmentsPoints = calculateCoordinates(uniqueCommitments);
  // console.log(uniqueCommitmentsPoints);

  const plot = Plot.plot({
    width: width,
    height: height,
    aspectRatio: 1,
    marginLeft: 0,
    x: { axis: null, domain: [-120, 120] },
    y: { axis: null, domain: [-120, 120] },
    r: { range: [1, dotSize / 2] },
    fx: { padding: 0, ticks: 0, label: null }, // No fx facet ticks or labels
    fy: { padding: 0, ticks: 0, label: null }, // No fy facet ticks or labels
    facet: { label: null }, // Ensure no facet label is generated
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    marks: [
      // density
      Plot.density(points, {
        x: "x",
        y: "y",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        bandwidth: 10,
        // opacity: 0,
        // fill: (d) => d.commitment_num,
        strokeOpacity: 0.1,
        stroke: "#fff",
        // fill: "density",
      }),
      // lines
      Plot.link(points, {
        x1: 0,
        x2: "x",
        y1: 0,
        y2: "y",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        stroke: (d) => d.pillar_num,
        strokeWidth: 2,
        strokeLinejoin: "round",
        strokeLinecap: "round",
        opacity: 0.33,
        href: "country_url",
      }),
      Plot.dot(points, {
        x: "x",
        y: "y",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        fill: (d) => d.pillar_num,
        r: (d) => d.value,
        opacity: 1,
        strokeWidth: 1,
        href: "country_url",
      }),
      Plot.dot(
        points,
        Plot.pointer({
          x: "x",
          y: "y",
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          stroke: (d) => d.pillar_num,
          strokeWidth: 3,
          r: (d) => d.value,
          opacity: 1,
        })
      ),
      // invisible large lines that make whole graph clickable
      Plot.link(points, {
        x1: 0,
        x2: "x",
        y1: 0,
        y2: "y",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        strokeWidth: 20,
        opacity: 0,
        href: "country_url",
        // title: (d) => `${d.NAME_ENGL}  ${Math.round(d.value)}`,
        // tip: true,
      }),
      // clickable country name
      // OUTLINE
      Plot.text(countryNames, {
        x: 0,
        y: 0,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        stroke: "#4B3B96",
        strokeWidth: 8,
        strokeOpacity: 0.5,
        fontSize: "1.5em",
        text: "NAME_ENGL",
        lineWidth: 8,
        textAnchor: "center",
        fill: "currentColor",
        href: "country_url",
      }),
      // NAME
      Plot.text(countryNames, {
        x: 0,
        y: 0,
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        fontSize: "1.5em",
        text: "NAME_ENGL",
        lineWidth: 8,
        textAnchor: "center",
        fill: "currentColor",
        href: "country_url",
      }),
      // HOVER
      Plot.text(
        countryNames,
        Plot.pointer({
          x: 0,
          y: 0,
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          stroke: "#4B3B96",
          strokeWidth: 8,
          strokeOpacity: 1,
          fontSize: "1.5em",
          fontWeight: 700,
          text: "NAME_ENGL",
          lineWidth: 8,
          textAnchor: "center",
          fill: "currentColor",
          // href: "country_url",
        })
      ),
    ],
  });

  return plot;
}
