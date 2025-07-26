import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function polarPlot(data, selectedCountry, { width, height } = {}) {
  // params
  const vh = window.innerHeight;
  // is a country selected?
  const selected = selectedCountry.length < 2;
  // console.log(selected);

  const dotSize = window.innerWidth * 0.02;
  const iconSize = window.innerWidth * 0.03;

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

  // unique commitments
  const uniqueCommitments = [];
  const uniqueCommitmentsSpokes = [];
  const seen = new Set();

  data
    .sort((a, b) => a.commitment_num - b.commitment_num) // Sort by commitment_num
    .forEach((d) => {
      if (!seen.has(d.commitment_txt)) {
        seen.add(d.commitment_txt);
        uniqueCommitments.push({ ...d, value: 110 });
        uniqueCommitmentsSpokes.push({ ...d, value: 100 });
      }
    });

  // Calculate the final average and clean up
  const uniquePillars = groupedData.map((group) => ({
    pillar_txt: group.pillar_txt,
    pillar_num: group.pillar_num,
    commitment_txt: group.commitment_txt,
    x1: group.x1,
    x2: group.x2,
    x: (group.x1 + group.x2) / 2, // Calculate average
    pillar_url: group.pillar_url,
  }));

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

  const calculateCoordinates = (data) => {
    const increment = -360 / 23; // Angle increment in degrees
    const result = data.map((d) => {
      const angleDegrees = 107 + d.commitment_num * increment; // Determine angle
      const angleRadians = (angleDegrees * Math.PI) / 180; // Convert to radians
      const x = d.value * Math.cos(angleRadians);
      const y = d.value * Math.sin(angleRadians);
      return { ...d, x, y }; // Return the data with x and y coordinates
    });
    return result;
  };

  const points = calculateCoordinates(groupedCounts);
  const pointsUngrouped = calculateCoordinates(data);
  const uniqueCommitmentsPoints = calculateCoordinates(uniqueCommitments);
  const uniqueCommitmentsSpokesPoints = calculateCoordinates(
    uniqueCommitmentsSpokes
  );

  // highlight function
  // https://observablehq.com/@observablehq/plot-pointer-driven-marks

  let plot = Plot.plot({
    width: width * 0.8,
    height: width * 0.8,
    aspectRatio: 1,
    margin: 0,
    color: {
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    x: { axis: null },
    y: { axis: null },
    r: { range: [2, dotSize] },
    marks: [
      // spokes
      Plot.link(uniqueCommitmentsSpokesPoints, {
        x1: 0,
        x2: "x",
        y1: 0,
        y2: "y",
        opacity: 0.2,
      }),
      Plot.image(uniqueCommitmentsPoints, {
        x: "x",
        y: "y",
        width: iconSize,
        src: "icon_url",
        stroke: "#fff",
        tip: true,
        title: "commitment_txt",
      }),
      Plot.density(points, {
        x: "x",
        y: "y",
        bandwidth: 50,
        strokeOpacity: 0.08,
        stroke: "#fff",
      }),
      // // all DOTS
      Plot.dot(points, {
        x: "x",
        y: "y",
        stroke: (d) => d.pillar_num,
        strokeOpacity: selected ? 0.1 : 0.3,
        strokeWidth: 2,
        r: "n",
        href: (d) => (d.country_url === null ? null : `./${d.country_url}`),
      }),
      // highlighted dots
      Plot.dot(
        points.filter((d) => d.NAME_ENGL == selectedCountry),
        {
          x: "x",
          y: "y",
          fill: (d) => d.pillar_num,
          opacity: 1,
          strokeOpacity: 1,
          r: "n",
          strokeWidth: 5,
          href: (d) => (d.country_url === null ? null : `./${d.country_url}`),
          tip: false, // Disable automatic tooltips
        }
      ),
      Plot.link(
        points.filter((d) => d.NAME_ENGL == selectedCountry),
        {
          x1: 0,
          x2: "x",
          y1: 0,
          y2: "y",
          stroke: (d) => d.pillar_num,
          strokeWidth: 3,
          strokeLinecap: "round",
          href: (d) => (d.country_url === null ? null : `./${d.country_url}`),
        }
      ),
      // pointer dots
      Plot.dot(
        points,
        Plot.pointer({
          x: "x", // Use the new y position
          y: "y", // Use the new x position calculated by the force simulation
          fill: (d) => d.pillar_num,
          stroke: (d) => d.pillar_num,
          // opacity: 1,
          strokeWidth: 5,
          strokeOpacity: 1,
          r: "n",
          tip: false, // Disable automatic tooltips
        })
      ),
      // highlight of same country dots
      // Plot.dot(
      //   pointsUngrouped,
      //   Plot.pointer({
      //     x: "x",
      //     y: "y",
      //     fill: "pillar_num",
      //     stroke: "pillar_num",
      //     opacity: 1,
      //     strokeOpacity: 1,
      //     strokeWidth: 5,
      //     r: "n",
      //     render: (index, scales, values, dimensions, context, next) => {
      //       const i = index.length > 0 ? index[0] : 0;
      //       return next([i], scales, values, dimensions, context);
      //     },
      //   })
      // ),
      // ...first try
      // Plot.dot(
      //   pointsUngrouped,
      //   pointerCountry(
      //     {
      //       x: "x",
      //       y: "y",
      //       fill: "pillar_num",
      //       stroke: "pillar_num",
      //       opacity: 1,
      //       strokeOpacity: 1,
      //       strokeWidth: 5,
      //       r: "n",
      //     },
      //     { atrest: null, selector: (d) => d.NAME_ENGL }
      //   )
      // ),
      // tooltip, slightly offset
      Plot.tip(
        points,
        Plot.pointer({
          x: "x",
          y: "y",
          dy: -5,
          title: (d) =>
            `${d.NAME_ENGL}: ${Math.round(d.value)}\n\nCommitment: ${
              d.commitment_txt
            }`,
          tip: true,
        })
      ),
      // invisible dots at the very top for smooth href
      Plot.dot(points, {
        x: "x",
        y: "y",
        strokeWidth: 2,
        stroke: "transparent",
        fill: "transparent",
        r: "n",
        href: (d) => (d.country_url === null ? null : `./${d.country_url}`),
      }),
    ],
  });

  var hoveredCountry = [];

  plot.addEventListener("input", (event) => {
    var hoveredCountry = plot.value.NAME_ENGL;
    // console.log(hoveredCountry);
  });

  const plotElement = document.body.appendChild(plot);

  return plot; // Return the plot element
}
