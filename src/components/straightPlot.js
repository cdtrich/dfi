import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function straightPlot(data, country, { width, height } = {}) {
  // calculate mean
  const mean = d3.flatRollup(
    data,
    (v) => d3.mean(v, (d) => d.value),
    (d) => d.commitment_txt
  );

  // turn mean map into object
  const meanObject = mean.map(([commitment_txt, value]) => ({
    commitment_txt,
    value,
  }));

  // calculate distance from mean
  const filterData = data.filter((d) => d.NAME_ENGL === country);
  const indexMean = d3.index(meanObject, (d) => d.commitment_txt);
  const distance = filterData.map(({ commitment_txt, value: x1 }) => ({
    commitment_txt,
    x1,
    ...indexMean.get(commitment_txt),
  }));

  distance.forEach((item) => {
    const difference = (item.x1 - item.value).toFixed(1); // Calculate and round the difference to one decimal
    const comparison =
      item.x1 > item.value
        ? "above"
        : item.x1 < item.value
        ? "below"
        : "equal to";
    item.comparison = `${Math.abs(difference)} ${comparison} average`;
  });

  // manual facet labels
  const n = 1; // number of facet columns
  const keys = Array.from(d3.union(data.map((d) => d.commitment_txt)));
  const index = new Map(keys.map((key, i) => [key, i]));
  const fx = (key) => index.get(key) % n;
  const fy = (key) => Math.floor(index.get(key) / n);

  // Get the extent (min and max) of the `value` property
  const [min, max] = d3.extent(data, (d) => d.value);
  const fact = 0.05; // factor to subtract/add to range

  // Round down the min and round up the max
  const roundedMinMax = [
    Math.floor(min) - min * fact,
    Math.ceil(max) + max * fact,
  ];

  // window height
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return Plot.plot({
    width: width,
    height: vh,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    axis: null,
    x: { label: null },
    y: { label: null, text: null, axis: "left", ticks: [], tickSize: 0 },
    marginRight: 4,
    aspectRatio: 0.66,
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    ticks: false,
    facet: {
      // facetAnchor: "top-empty",
      label: null,
      // anchor: "top",
    },
    marks: [
      // icons
      Plot.image(data, {
        x: min,
        y: 0,
        width: 100,
        src: "https://raw.githubusercontent.com/cdtrich/dfi/refs/heads/main/icons/1.png?token=GHSAT0AAAAAAC3B5JVUVG6UVIJD6UA4F35WZ2GEGTA",
      }),
      // manual facet labels
      Plot.text(keys, { fx, fy, frameAnchor: "top-left", dx: -100, dy: 6 }),
      // line highlight
      Plot.link(
        distance,
        Plot.pointer({
          x1: "x1",
          x2: "value",
          y1: 1.2,
          y2: 1.2,
          fy: (d) => fy(d.commitment_txt),
          stroke: "#fff",
          strokeWidth: 2,
          title: "comparison",
          tip: true,
        })
      ),
      // all dots with current country highlighted
      Plot.dot(
        data,
        Plot.dodgeY("middle", {
          x: "value",
          y: 0,
          // y: "commitment_txt",
          fy: (d) => fy(d.commitment_txt),
          // fy: d => fy(d.commitment_txt),
          href: (d) => "../" + d.country_url,
          stroke: "pillar",
          fill: "pillar",
          r: (d) => (d.NAME_ENGL === country ? 6 : 1),
          // tip: true,
          // title: "NAME_ENGL",
          // opacity: (d) => (d.NAME_ENGL === country ? 1 : 0.33),
          fillOpacity: (d) => (d.NAME_ENGL === country ? 1 : 0),
          strokeOpacity: (d) => (d.NAME_ENGL === country ? 0 : 0.33),
        })
      ),
      // mean
      Plot.tickX(
        meanObject,
        Plot.dodgeY("middle", {
          x: "value",
          // z: "value",
          y: 0,
          fy: (d) => fy(d.commitment_txt),
          stroke: "#fff",
          strokeWidth: 2,
          opacity: 0.66,
          // title: "comparison",
          // tip: true,
        })
      ),
      // average label
      // Plot.text(
      //   meanObject[0],
      //   Plot.dodgeY("middle", {
      //     x: "value",
      //     y: 0,
      //     fy: (d) => fy(d.commitment_txt),
      //     text: ["Commitment average"],
      //     // dy: 0,
      //     opacity: 1,
      //   })
      // ),
      Plot.axisX({ facetAnchor: "top", anchor: "top" }),
      // Plot.axisY({ textAnchor: "start", tickSize: 0, fill: null, dx: 14 }),
    ],
  });
}
