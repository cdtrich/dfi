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
  console.log(meanObject);

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

  // CALCULATE COUNT PER VALUE
  // Summarize and group data
  const summarized = filterData.reduce((acc, d) => {
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
      item.country_url = "";
    }

    // Remove the helper Set property
    delete item.uniqueNames;

    return item;
  });

  // unique commitments for icons and facet labels
  const uniqueCommitments = [];
  const seenCommitments = new Set();

  // Iterate through the data and keep the first object for each commitment_num
  filterData.forEach((d) => {
    if (!seenCommitments.has(d.commitment_num)) {
      seenCommitments.add(d.commitment_num);
      uniqueCommitments.push(d);
    }
  });

  // Convert the grouped object back to an array
  // const groupedCounts = Object.values(summarized);

  // console.log(groupedCounts);

  var colors = ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"];
  // console.log(distance);

  // chart width
  const vh = window.innerHeight;
  const dotSize = window.innerWidth * 0.002;

  return Plot.plot({
    width: width,
    height: (vh / 8) * mean.length,
    marginRight: 4,
    // marginLeft: 0,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    // x: { label: null, domain: [-10, 110], ticks: [0, 25, 50, 75, 100] },
    y: { label: null, axis: null, tickSize: 0 },
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
      Plot.axisX({
        anchor: "top",
        dy: -40,
        stroke: "#ccc",
        strokeOpacity: 0.2,
        strokeWidth: 0.5,
        domain: [-10, 110],
        ticks: [0, 25, 50, 75, 100],
        // tickLength: 5,
      }),
      // icons
      Plot.image(uniqueCommitments, {
        x: -5,
        dx: 0,
        y: 0,
        // dy: -20,
        fy: "commitment_num",
        width: 40,
        src: "icon_url",
      }),
      // // manual facet labels
      Plot.text(uniqueCommitments, {
        x: -10,
        // dx: -30,
        y: 0,
        dy: -50,
        fy: "commitment_num",
        text: "commitment_txt",
        frameAnchor: "top-left",
        textAnchor: "start",
        fontSize: "1.5em",
        // dy: 6,
      }),
      // all dots
      Plot.dot(
        groupedCounts,
        Plot.dodgeY(
          "middle",
          Plot.pointer({
            x: "value",
            fy: "commitment_num",
            // fy: "commitment_txt",
            fill: colors[pillar - 1],
            r: "n",
            opacity: 1,
            // opacity: (d) => (d.pillar === pillar ? 1 : 0.05),
          })
        )
      ),
      // all dots
      Plot.dot(
        groupedCounts,
        Plot.dodgeY("middle", {
          x: "value",
          fy: "commitment_num",
          // fy: "commitment_txt",
          stroke: colors[pillar - 1],
          fill: colors[pillar - 1],
          fillOpacity: 0,
          r: "n",
          title: (d) => `${d.NAME_ENGL}` + `  ` + `${Math.round(d.value)}`,
          tip: true,
          opacity: 0.66,
          href: (d) => `../${d.country_url}`,
          // opacity: (d) => (d.pillar === pillar ? 1 : 0.05),
        })
      ),
      // mean
      Plot.dot(meanObject, {
        x: "value",
        fy: "commitment_num",
        stroke: "#fff",
        strokeOpacity: 1,
        strokeWidth: 1,
        r: 20,
      }),
      // mean label
      Plot.text(meanObject, {
        x: "value",
        y: 0,
        dy: 30,
        fy: "commitment_num",
        text: (d) => "Mean value",
        textAnchor: "middle",
        // fontWeight: 700,
        FontFace: "italic",
        fill: "#fff",
        stroke: "#000",
        strokeOpacity: 0.1,
        strokeWidth: 5,
      }),
      // Plot.axisY({ textAnchor: "start", strokeWidth: 0, fill: null, dx: 14 }),
      // Plot.axisY({ textAnchor: "start", tickSize: 0, fill: null, dx: 14 }),
    ],
  });
}
