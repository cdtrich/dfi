import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function straightPlot(
  data,
  country,
  // commitmentIcons,
  { width, height } = {}
) {
  // calculate mean
  const mean = d3.flatRollup(
    data,
    (v) => d3.mean(v, (d) => d.value),
    (d) => d.commitment_num
  );

  // turn mean map into object
  const meanObject = mean.map(([commitment_num, value]) => ({
    commitment_num,
    value,
  }));
  console.log(meanObject);

  // calculate distance from mean
  const filterData = data.filter((d) => d.NAME_ENGL === country);
  const indexMean = d3.index(meanObject, (d) => d.commitment_num);
  const distance = filterData.map(({ commitment_num, value: x1 }) => ({
    commitment_num,
    x1,
    ...indexMean.get(commitment_num),
  }));

  distance.forEach((item) => {
    const difference = (item.x1 - item.value).toFixed(1); // Calculate and round the difference to one decimal
    const comparison =
      item.x1 > item.value
        ? "points above"
        : item.x1 < item.value
        ? "points below"
        : "equal to";
    item.comparison = `${Math.abs(difference)} ${comparison} average`;
  });

  // manual facet labels
  const n = 1; // number of facet columns
  const keys = Array.from(d3.union(data.map((d) => d.commitment_num)));
  // const index = new Map(keys.map((key, i) => [key, i]));
  // const fx = (key) => index.get(key) % n;
  // const fy = (key) => Math.floor(index.get(key) / n);

  // Get the extent (min and max) of the `value` property
  const [min, max] = d3.extent(data, (d) => d.value);
  const fact = 0.05; // factor to subtract/add to range

  // Round down the min and round up the max
  const roundedMinMax = [
    Math.floor(min) - min * fact,
    Math.ceil(max) + max * fact,
  ];

  // Use a Set to track unique commitment_num values
  const uniqueCommitments = new Set();
  const filteredData = data.filter((item) => {
    if (!uniqueCommitments.has(item.commitment_num)) {
      uniqueCommitments.add(item.commitment_num);
      return true;
    }
    return false;
  });

  // console.log(filteredData);

  // CALCULATE COUNT PER VALUE
  // Summarize and group data
  const summarized = data.reduce((acc, d) => {
    // Define the group key for summarization based on selected properties
    const key = `${d.commitment_num}-${d.pillar_num}-${d.value}`;

    // If the group doesn't exist, initialize it with relevant properties
    if (!acc[key]) {
      acc[key] = {
        ...d, // Copy all properties initially
        n: 0, // Initialize count
        uniqueNames: new Set(), // Track unique NAME_ENGL values
      };
    }

    // Increment count
    acc[key].n += 1;

    // Track NAME_ENGL for this group
    acc[key].uniqueNames.add(d.NAME_ENGL);

    return acc;
  }, {});

  // Finalize and clean up results
  const groupedCounts = Object.values(summarized).map((item) => {
    // Replace NAME_ENGL with a dynamic string if there are multiple unique values
    if (item.uniqueNames.size > 1) {
      item.NAME_ENGL = `${item.n} countries`;
      item.country_url = null;
    }

    // Remove the helper Set property
    delete item.uniqueNames;

    return item;
  });

  // window height
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return Plot.plot({
    width: width,
    height: (vh / 8) * mean.length,
    marginRight: 4,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    // axis: null,
    // x: { label: null, domain: [-10, 110], ticks: [0, 25, 50, 75, 100] },
    y: { label: null, axis: null, tickSize: 0 },
    // aspectRatio: 0.66,
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
    // fy: { frameAnchor: "top-left", textAnchor: "start" },
    fy: { padding: 1 },
    marks: [
      // TOP AXIS
      Plot.axisX({
        anchor: "top",
        dy: -40,
        stroke: "#ccc",
        strokeOpacity: 0.2,
        strokeWidth: 0.5,
        domain: [-10, 110],
        ticks: [0, 25, 50, 75, 100],
        label: "Score",
        // tickLength: 5,
      }),
      // MEAN MARKER
      Plot.dot(meanObject, {
        x: "value",
        fy: "commitment_num",
        stroke: "#fff",
        strokeOpacity: 1,
        strokeWidth: 1,
        r: 5,
      }),
      // label
      Plot.text(
        meanObject.filter((d) => d.commitment_num === 1),
        {
          x: "value",
          y: 0,
          dy: 20,
          fy: "commitment_num",
          text: (d) => "Mean value",
          textAnchor: "middle",
          // fontWeight: 700,
          FontFace: "italic",
        }
      ),
      // DISTANCE FROM MEAN
      Plot.link(distance, {
        x1: "x1",
        x2: "value",
        y1: 0,
        y2: 0,
        // dy: 7,
        fy: "commitment_num",
        stroke: "#fff",
        strokeWidth: 1,
        strokeOpacity: 0.5,
      }),
      // ALL DOTS
      Plot.dot(
        groupedCounts,
        Plot.dodgeY("middle", {
          x: "value",
          y: 0,
          fy: "commitment_num",
          // stroke: "pillar_num",
          fill: "pillar_num",
          r: "n",
          fillOpacity: 0.5,
          // strokeOpacity: 0.33,
          href: (d) => (d.country_url === null ? null : `../${d.country_url}`),
        })
      ),
      // pointer
      Plot.dot(
        groupedCounts,
        Plot.pointer(
          Plot.dodgeY("middle", {
            x: "value",
            y: 0,
            fy: "commitment_num",
            fill: "pillar_num",
            r: "n",
            fillOpacity: 1,
            strokeOpacity: 0.5,
            // tip: true,
            // title: "NAME_ENGL",
          })
        )
      ),
      // HIGHLIGHTED COUNTRY
      Plot.dot(filterData, {
        x: "value",
        y: 0,
        fy: "commitment_num",
        stroke: "#fff",
        fill: "pillar_num",
        r: 10,
        fillOpacity: 0,
        strokeOpacity: 5,
      }),
      // label
      Plot.text(
        filterData,
        Plot.selectFirst({
          x: "value",
          y: 0,
          dy: -20,
          fy: "commitment_num",
          text: "NAME_ENGL",
          textAnchor: "middle",
          fontWeight: 700,
        })
      ),
      // ICONS
      Plot.image(filteredData, {
        x: 0,
        dx: -30,
        y: 0,
        // dy: -20,
        fy: "commitment_num",
        width: 40,
        src: "icon_url",
      }),
      // FACET LABELS
      Plot.text(filteredData, {
        x: min,
        // dx: -30,
        y: 0,
        dy: -40,
        fy: "commitment_num",
        text: "commitment_txt",
        frameAnchor: "top-left",
        textAnchor: "start",
        fontSize: "1.5em",
        fill: "#fff",
        stroke: "#000",
        strokeOpacity: 0.2,
        strokeWidth: 5,
        // dy: 6,
      }),
      // tip for DISTANCE FROM MEAN
      Plot.tip(
        distance,
        Plot.pointer({
          x: (d) => (d.x1 + d.value) / 2,
          y: 0,
          dy: 5,
          fy: "commitment_num",
          stroke: "#fff",
          anchor: "top",
          title: "comparison",
          tip: true,
        })
      ),
      // tip for ALL DOTS
      Plot.tip(
        groupedCounts,
        Plot.pointer(
          Plot.dodgeY("middle", {
            x: "value",
            y: 0,
            dy: -5,
            fy: "commitment_num",
            stroke: "#fff",
            anchor: "bottom",
            tip: true,
            title: "NAME_ENGL",
          })
        )
      ),
    ],
  });
}
