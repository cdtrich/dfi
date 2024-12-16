import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function straightPlotPillar(data, pillar, { width, height } = {}) {
  // filter data
  const filterData = data.filter((d) => d.pillar_num === pillar);
  // console.log(filterData);

  // calculate mean
  const mean = d3.flatRollup(
    filterData,
    (v) => d3.mean(v, (d) => d.value),
    (d) => d.commitment_num
  );
  // console.log(mean);

  // turn mean map into object
  const meanObject = mean.map(([commitment_num, value]) => ({
    commitment_num,
    value,
  }));
  // console.log(meanObject[0]);

  // calculate distance from mean
  const indexMean = d3.index(meanObject, (d) => d.commitment_num);
  // console.log(filterData);
  // console.log(indexMean);
  // console.log(mean.length);

  const distance = filterData.map(({ commitment_num, value: x1 }) => ({
    commitment_num,
    x1,
    ...indexMean.get(commitment_num),
  }));

  var colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];
  // console.log(distance);

  // chart width
  const vh = window.innerHeight;
  const dotSize = window.innerWidth * 0.002;

  return Plot.plot({
    width: width,
    height: (vh / 5) * mean.length,
    marginLeft: vh * 0.1,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    x: { label: null },
    y: { label: null, axis: "left", tickSize: 0 },
    color: {
      legend: false,
      // range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    ticks: false,
    facet: {
      label: null,
      // padding: 100,
      marginBottom: -101,
    },
    // fy: {},
    marks: [
      // mean
      Plot.tickX(meanObject, {
        x: "value",
        fy: "commitment_num",
        // fy: "commitment_txt",
        stroke: "#fff",
        strokeWidth: 2,
        // opacity: 0.66,
        // title: (d) => `${d.commitment_txt}` + `${d.value}`,
        // title: (d) =>
        //   `${d.commitment_txt}` + `\nMean: ` + `${Math.round(d.value)}`,
        // tip: true,
      }),
      // mean label
      Plot.text(
        meanObject,
        Plot.selectFirst({
          x: "value",
          fy: "commitment_num",
          text: ["Commitment average"],
          textAnchor: "start",
          dx: 10,
          dy: -60,
          // fy: "commitment_txt",
          // fill: colors[pillarNumber - 1],
          // r: 8,
          opacity: 1,
          // opacity: (d) => (d.pillar === pillar ? 1 : 0.05),
        })
      ),
      // all dots
      Plot.dot(
        filterData,
        Plot.dodgeY(
          "middle",
          Plot.pointer({
            x: "value",
            fy: "commitment_num",
            // fy: "commitment_txt",
            fill: colors[pillar - 1],
            r: dotSize,
            opacity: 1,
            // opacity: (d) => (d.pillar === pillar ? 1 : 0.05),
          })
        )
      ),
      // all dots
      Plot.dot(
        filterData,
        Plot.dodgeY("middle", {
          x: "value",
          fy: "commitment_num",
          // fy: "commitment_txt",
          stroke: colors[pillar - 1],
          fill: colors[pillar - 1],
          fillOpacity: 0,
          r: dotSize,
          title: (d) => `${d.NAME_ENGL}` + `  ` + `${Math.round(d.value)}`,
          tip: true,
          opacity: 0.66,
          href: (d) => `../${d.country_url}`,
          // opacity: (d) => (d.pillar === pillar ? 1 : 0.05),
        })
      ),
      // Plot.axisY({ textAnchor: "start", strokeWidth: 0, fill: null, dx: 14 }),
      // Plot.axisY({ textAnchor: "start", tickSize: 0, fill: null, dx: 14 }),
    ],
  });
}
