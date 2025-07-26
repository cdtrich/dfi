import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import colorScales from "./scales.js";

// https://observablehq.com/@observablehq/plot-radar-chart

export function polarPlotMultiple(
  data,
  countries,
  // select,
  { width, height } = {}
) {
  // chart width
  const vw = window.innerWidth;
  const dotSize = window.innerWidth * 0.006;

  // offset of spikes
  const offset = 10;
  // distance of dots from center (for tooltip)
  const distance = 25;

  const cardinalLookup = {
    1: {
      // Original pillar 1 items
      pillar_num_cardinal: 4,
      commitment_nums: {
        1: 10, // original commitment 1 -> 10
        2: 11, // original commitment 2 -> 11
        3: 12, // original commitment 3 -> 12
      },
    },
    2: {
      // Original pillar 2 items
      pillar_num_cardinal: 2,
      commitment_nums: {
        4: 4, // keep same
        5: 5,
        6: 6,
      },
    },
    3: {
      // Original pillar 3 items
      pillar_num_cardinal: 1,
      commitment_nums: {
        7: 1, // original commitment 7 -> 1
        8: 2, // original commitment 8 -> 2
        9: 3, // original commitment 9 -> 3
      },
    },
    4: {
      // Original pillar 4 items
      pillar_num_cardinal: 3,
      commitment_nums: {
        10: 7, // original commitment 10 -> 7
        11: 8, // original commitment 11 -> 8
        12: 9, // original commitment 12 -> 9
      },
    },
  };

  const dataFiltered = data.map((item) => ({
    ...item,
    pillar_num_cardinal: cardinalLookup[item.pillar_num].pillar_num_cardinal,
    commitment_num_cardinal:
      cardinalLookup[item.pillar_num].commitment_nums[item.commitment_num],
  }));
  // console.log("dataFiltered", dataFiltered);

  // get unique country names
  const countryNames = data.filter(
    (d, index, self) =>
      self.findIndex((item) => item.NAME_ENGL === d.NAME_ENGL) === index
  );

  // rotation calculation based on commitment number
  const rotateCommitment = (commitment_num) => {
    return commitment_num * (360 / 12) - (360 / 12) * 2 + 90;
  };

  // facets
  const n = 5; // number of facet columns
  const keys = Array.from(d3.union(dataFiltered.map((d) => d.NAME_ENGL)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);

  // get colorsScales()
  const fillScale = colorScales();

  const plot = Plot.plot({
    width: vw,
    height: vw * 6,
    aspectRatio: 2,
    margin: 0,
    x: { domain: [-100, 100], axis: null },
    y: { domain: [-100, 100], axis: null },
    length: { range: [0, vw / 18] },
    r: { range: [0, vw / 16] },
    color: {
      legend: true,
    },
    marks: [
      // circle
      //// outside
      Plot.dot(dataFiltered, {
        x: 0,
        y: 0,
        r: (d) => 10,
        stroke: "#ddd",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        strokeWidth: 1,
        strokeOpacity: 1,
      }),
      //// middle
      Plot.dot(dataFiltered, {
        x: 0,
        y: 0,
        r: (d) => 2.6,
        stroke: "#ddd",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        strokeWidth: 1,
        strokeOpacity: 1,
      }),
      //// inside
      Plot.dot(dataFiltered, {
        x: 0,
        y: 0,
        r: (d) => 0.25,
        stroke: "#ddd",
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        strokeWidth: 1,
        strokeOpacity: 1,
      }),
      // country name stroke
      Plot.text(
        dataFiltered,
        Plot.selectFirst({
          x: 0,
          y: 100,
          text: "NAME_ENGL",
          textAnchor: "middle",
          stroke: "#fff",
          strokeWidth: 5,
          lineWidth: 8,
          fontSize: "1.25em",
          fontWeight: "bold",
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          href: (d) => d.country_url,
        })
      ),
      // country name
      Plot.text(
        dataFiltered,
        Plot.selectFirst({
          x: 0,
          y: 100,
          text: "NAME_ENGL",
          textAnchor: "middle",
          lineWidth: 8,
          fontSize: "1.25em",
          // fontWeight: "bold",
          fx: (d) => fx(d.NAME_ENGL),
          fy: (d) => fy(d.NAME_ENGL),
          href: (d) => d.country_url,
        })
      ),
      // spikes
      Plot.spike(dataFiltered, {
        x: (d) => {
          switch (d.pillar_txt) {
            case "Human Rights":
              return 10; // E
            case "Negative Obligations":
              return 0; // S
            case "Enabling Environment":
              return -10; // W
            case "Positive Obligations":
              return 0; // N
            default:
              return 0;
          }
        },
        y: (d) => {
          switch (d.pillar_txt) {
            case "Human Rights":
              return 0; // E
            case "Negative Obligations":
              return -10; // S
            case "Enabling Environment":
              return 0; // W
            case "Positive Obligations":
              return 10; // N
            default:
              return 0;
          }
        },
        fx: (d) => fx(d.NAME_ENGL),
        fy: (d) => fy(d.NAME_ENGL),
        length: (d) => d.value,
        stroke: (d) => fillScale.getColor(d.pillar_txt, d.value),
        fillOpacity: 1,
        strokeOpacity: (d) => d.value,
        strokeWidth: (d) => (d.value / vw) * 15,
        rotate: (d) => rotateCommitment(d.commitment_num_cardinal),
      }),
      // tooltip
      Plot.tip(
        Plot.spike(
          dataFiltered,
          Plot.pointer({
            x: (d) => {
              switch (d.pillar_txt) {
                case "Human Rights":
                  return 10; // E
                case "Negative Obligations":
                  return 0; // S
                case "Enabling Environment":
                  return -10; // W
                case "Positive Obligations":
                  return 0; // N
                default:
                  return 0;
              }
            },
            y: (d) => {
              switch (d.pillar_txt) {
                case "Human Rights":
                  return 0; // E
                case "Negative Obligations":
                  return -10; // S
                case "Enabling Environment":
                  return 0; // W
                case "Positive Obligations":
                  return 10; // N
                default:
                  return 0;
              }
            },
            fx: (d) => fx(d.NAME_ENGL),
            fy: (d) => fy(d.NAME_ENGL),
            length: (d) => d.value,
            stroke: (d) => fillScale.getColor(d.pillar_txt, d.value),
            fillOpacity: 1,
            strokeOpacity: (d) => d.value,
            strokeWidth: (d) => (d.value / vw) * 15,
            rotate: (d) => rotateCommitment(d.commitment_num_cardinal),
          })
        )
      ),
      // pointer
      // Plot.spike(
      //   dataFiltered,
      //   Plot.pointer({
      //     x: (d) => {
      //       switch (d.pillar_txt) {
      //         case "Human Rights":
      //           return 10; // E
      //         case "Negative Obligations":
      //           return 0; // S
      //         case "Enabling Environment":
      //           return -10; // W
      //         case "Positive Obligations":
      //           return 0; // N
      //         default:
      //           return 0;
      //       }
      //     },
      //     y: (d) => {
      //       switch (d.pillar_txt) {
      //         case "Human Rights":
      //           return 0; // E
      //         case "Negative Obligations":
      //           return -10; // S
      //         case "Enabling Environment":
      //           return 0; // W
      //         case "Positive Obligations":
      //           return 10; // N
      //         default:
      //           return 0;
      //       }
      //     },
      //     fx: (d) => fx(d.NAME_ENGL),
      //     fy: (d) => fy(d.NAME_ENGL),
      //     length: (d) => d.value,
      //     stroke: "#000",
      //     fillOpacity: 0,
      //     strokeWidth: 2,
      //     rotate: (d) => rotateCommitment(d.commitment_num_cardinal),
      //     // tip: { frameAnchor: "middle" },
      //     tip: true,
      //     title: "pillar_txt",
      //   })
      // ),
    ],
  });

  return plot;
}
