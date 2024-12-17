import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function polarPlot(data, selectedCountry, { width, height } = {}) {
  // params
  const vh = window.innerHeight;

  // is a country selected?
  const selected = selectedCountry.length < 2;
  // console.log(selected);

  const dotSize = window.innerWidth * 10;

  // Use a Set to track unique commitment_num values
  const commitments = new Set();
  const uniqueCommitments = data.filter((item) => {
    if (!commitments.has(item.commitment_num)) {
      commitments.add(item.commitment_num);
      return true;
    }
    return false;
  });
  // console.log(uniqueCommitments);

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
  // console.log(points);

  // console.log(uniquePillars);

  let plot = Plot.plot({
    width: width,
    height: vh * 0.75,
    marginLeft: 0,
    length: { range: [0, dotSize / 25] },
    color: {
      range: ["#fff"],
      // legend: false,
      // range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    marks: [
      // ACTUAL DOTS
      Plot.hull(points, {
        x: "x",
        y: "y",
        stroke: "NAME_ENGL",
        strokeOpacity: 0.1,
        // fill: "NAME_ENGL",
        // opacity: 0.01,
        strokeWidth: 1,
      }),
      // Plot.vector(
      //   data,
      //   {
      //     x: 0,
      //     y: 0,
      //     stroke: (d) => d.pillar_num,
      //     length: (d) => d.value,
      //     shape: null,
      //     opacity: 1,
      //     strokeWidth: 0.5,
      //     rotate: (d, i) =>
      //       (360 / 23) * (d.commitment_num - 1) + (360 / 200) * i,
      //   }
      // ),
      // // FALSE DOTS for ohq plot tooltip
      Plot.dot(points, {
        x: "x",
        y: "y",
        stroke: (d) => d.pillar_num,
        r: "value",
        opacity: 0,
        strokeOpacity: 0,
        title: (d) =>
          `${d.NAME_ENGL}: ${Math.round(d.value)}\n\nCommitment: ${
            d.commitment_txt
          }`,
        frameAnchor: "bottom-right",
        tip: true,
      }),
      // highlighted dots
      Plot.dot(
        data.filter((d) => d.NAME_ENGL == selectedCountry),
        {
          x: "value", // Use the new y position
          y: "commitment_num", // Use the new x position calculated by the force simulation
          fill: (d) => d.pillar_num,
          r: "value",
          opacity: 1,
          href: "country_url",
          title: (d) => d.NAME_ENGL,
          tip: false, // Disable automatic tooltips
        }
      ),
    ],
  });

  const plotElement = document.body.appendChild(plot);
  const svg = d3.select(plotElement).select("svg"); // Access the rendered SVG

  // TOOLTIPS AND HIGHLIGHTED CIRCLES
  const circles = plotElement.querySelectorAll("circle");

  // Create tooltip element
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.pointerEvents = "none";
  tooltip.style.padding = "5px 10px";
  tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  tooltip.style.color = "white";
  tooltip.style.borderRadius = "5px";
  tooltip.style.fontSize = "12px";
  tooltip.style.visibility = "hidden";
  // document.body.appendChild(tooltip);

  // Create a path element that will contain the area
  // const svg = d3.select(plotElement).select("svg");

  // Add hover effect
  plotElement.addEventListener("mouseover", function (event) {
    const hoveredDot = event.target.closest("circle");

    if (hoveredDot) {
      const titleElement = hoveredDot.querySelector("title");

      if (titleElement) {
        const hoveredName = titleElement.textContent;
        // console.log(hoveredName);
        tooltip.textContent = `${hoveredName}`;
        tooltip.style.visibility = "visible";

        const positions = [];

        circles.forEach((circle) => {
          const circleTitleElement = circle.querySelector("title");
          if (circleTitleElement) {
            const circleName = circleTitleElement.textContent;
            if (circleName === hoveredName) {
              circle.style.opacity = 1;
              const circleStroke = circle.getAttribute("stroke"); // Get the stroke of this specific dot
              circle.style.fill = circleStroke; // Set fill to match its own stroke

              const angle = parseFloat(circle.getAttribute("cx")); // use cx as angle
              const radius = parseFloat(circle.getAttribute("cy")); // use cy as radius

              const x = parseFloat(circle.getAttribute("cx"));
              const y = parseFloat(circle.getAttribute("cy"));
              const commitment_txt = parseFloat(circle.getAttribute("cy"));

              if (!isNaN(x) && !isNaN(y)) {
                positions.push({ x, y });
              }
            } else {
              circle.style.opacity = 0.2;
              circle.style.fill = null;
            }
          }
        });

        // Sort positions by x-coordinate to ensure correct area drawing order
        positions.sort((a, b) => a.x - b.y);
        // console.log(positions);

        const pathData = positions.map((p) => `${p.x},${p.y}`).join(" L ");

        if (positions.length >= 2) {
          // areaPath.attr("d", `M ${pathData} Z`).attr("visibility", "visible");
          // const pathData = positions.map((p) => `${p.x},${p.y}`).join(" L ");
          // const link = d3
          //   .link()
          //   .x((d) => d[0])
          //   .y((d) => d[1]);
          // linkPath.attr("d", `M ${pathData}`).attr("visibility", "visible");
          // linkPath.attr("d", link(positions)).attr("visibility", "visible");
          // linkPath.attr("x", (d) => d.x).attr("visibility", "visible");
          // areaPath.attr("x", (d) => d.x).attr("visibility", "visible");
        }
      }
    }
  });

  plotElement.addEventListener("mousemove", function (event) {
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.left = `${event.pageX + 10}px`;
  });

  plotElement.addEventListener("mouseout", function () {
    tooltip.style.visibility = "hidden";
    circles.forEach((circle) => {
      circle.style.opacity = 0.2; // Reset to original opacity
      circle.style.fill = null;
    });
    // linkPath.attr("visibility", "hidden"); // Hide the area
  });

  // PILLAR LABELS
  // https://chatgpt.com/g/g-fAgI6VGij-frontend-developer/c/6746ddf4-2b40-8008-bbf3-c0c197e3c130
  // Select paths created by Plot.link() and add textPath
  // svg
  //   .selectAll('path[aria-label^="link"]') // Select all paths with aria-label starting with "link"
  //   .each(function (d, i) {
  //     const path = d3.select(this); // Select the current path
  //     const pillar = uniquePillars[i]; // Match the corresponding pillar data

  //     // Add a <text> element with a <textPath> to follow this path
  //     svg
  //       .append("text")
  //       .append("textPath")
  //       .attr("href", `#${path.attr("id") || `path-${i}`}`) // Use existing path ID or generate one
  //       .attr("startOffset", "50%") // Center the text along the path
  //       .attr("text-anchor", "middle")
  //       .style("fill", pillar.pillar_txt) // Match text color to the pillar color
  //       .style("font-size", "14px")
  //       .text(pillar.pillar_txt); // Add the pillar text
  //   });

  // OR WITH THIS???
  // const svgElement = document.querySelector("svg.plot-d6a7b5");
  // const newTextElement = document.createElementNS(
  //   "http://www.w3.org/2000/svg",
  //   "text"
  // );
  // newTextElement.textContent = "New Text";
  // newTextElement.setAttribute("x", "10"); // Set the x-coordinate
  // newTextElement.setAttribute("y", "20"); // Set the y-coordinate
  // svgElement.appendChild(newTextElement);

  return plotElement; // Return the plot element
}
