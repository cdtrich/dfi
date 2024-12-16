import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function polarPlot(data, selectedCountry, { width, height } = {}) {
  // params
  const vh = window.innerHeight;

  // is a country selected?
  const selected = selectedCountry.length < 2;
  // console.log(selected);

  // dot position
  const longitude = d3
    .scalePoint(new Set(Plot.valueof(data, "commitment_num")), [205, -155])
    .padding(0.5)
    .align(1);

  const dotSize = window.innerWidth * 0.006;

  // dodging with force simulation
  const simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX((d) => longitude(d.commitment_num)).strength(0.05))
    // .force("y", d3.forceY((d) => 90 - d.value).strength(0.00001))
    .force("collide", d3.forceCollide(dotSize)) // Prevent overlap by setting the radius
    .stop(); // Stop the simulation

  // Run the simulation for a few iterations to stabilize
  for (let i = 0; i < 120; ++i) simulation.tick();

  const pillars = [
    {
      pillar: "Pillar 1",
      x1: "commitment A",
      x: "commitment B",
      x2: "commitment C",
      angle: 0,
      url: "./pillars/Pillar1",
    },
    {
      pillar: "Pillar 2",
      x1: "commitment D",
      x: "commitment E",
      x2: "commitment F",
      angle: 72,
      url: "./pillars/Pillar2",
    },
    {
      pillar: "Pillar 3",
      x1: "commitment G",
      x: "commitment H",
      x2: "commitment I",
      angle: 144,
      url: "./pillars/Pillar3",
    },
    {
      pillar: "Pillar 4",
      x1: "commitment J",
      x: "commitment K",
      x2: "commitment L",
      angle: 216,
      url: "./pillars/Pillar4",
    },
    {
      pillar: "Pillar 5",
      x1: "commitment M",
      x: "commitment N",
      x2: "commitment O",
      angle: 288,
      url: "./pillars/Pillar5",
    },
  ];

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
        // acc[pillar_txt].commitment_txt_min = Math.min(
        //   acc[pillar_txt].x1,
        //   commitment_num
        // );
        // acc[pillar_txt].commitment_txt_max = Math.max(
        //   acc[pillar_txt].x2,
        //   commitment_num
        // );
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

  // console.log(uniquePillars);

  let plot = Plot.plot({
    width: width,
    height: vh * 0.85,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    projection: {
      type: "azimuthal-equidistant",
      rotate: [0, -90],
      domain: d3.geoCircle().center([0, 90]).radius(99990)(), // before: 10000.625
    },
    r: { range: [dotSize / 3, dotSize] },
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    marks: [
      // PILLARS
      Plot.link(uniquePillars, {
        x1: (d) => longitude(d.x1),
        x2: (d) => longitude(d.x2),
        y1: 0,
        y2: 0,
        stroke: (d) => d.pillar_num,
        strokeOpacity: 0.25,
        strokeWidth: 5,
        ariaLabel: (d) => `link-${d.pillar_txt}`, // Add an accessible label for targeting
        // href: "url",
      }),
      Plot.text(uniquePillars, {
        x: (d) => (longitude(d.x1) + longitude(d.x2)) / 2, // mean
        y: (d, i) =>
          i === 0
            ? 10
            : i === 1
            ? 10
            : i === 2
            ? 10
            : i === 3
            ? 10
            : i === 4
            ? 10
            : 0,
        // y: 5,
        rotate: (d, i) =>
          i === 1 ? 65 : i === 2 ? -60 : i === 3 ? 35 : i === 4 ? -50 : 0,
        fill: (d) => d.pillar_num,
        lineWidth: 17,
        // fill: "#ffffff",
        text: "pillar_txt",
        // text: (d, i) => [d.pillar_txt, ""].join("\n"), // shift baseline
        fontSize: "1.2em",
        textAnchor: "middle",
        lineAnchor: "middle",
        frameAnchor: "middle",
        // href: "url",
      }),
      // ICONS
      Plot.image(uniqueCommitments, {
        x: (d) => longitude(d.commitment_num),
        y: 0,
        width: 50,
        src: "icon_url",
        stroke: "#fff",
        tip: true,
        title: "commitment_txt",
      }),
      // DOTS
      // FALSE DOTS for ohq plot tooltip
      Plot.dot(data, {
        x: (d) => longitude(d.commitment_num), // Use the new x position calculated by the force simulation
        y: (d) => 105 - d.value, // Use the new y position
        r: (d) => d.value,
        opacity: 0,
        strokeOpacity: 0,
        title: (d) =>
          `${d.NAME_ENGL}: ${Math.round(d.value)}\n\nCommitment: ${
            d.commitment_txt
          }`,
        frameAnchor: "bottom-right",
        tip: true,
      }),
      // ACTUAL DOTS
      Plot.dot(data, {
        x: (d) => longitude(d.commitment_num), // Use the new x position calculated by the force simulation
        y: (d) => 105 - d.value, // Use the new y position
        stroke: (d) => d.pillar_num,
        r: (d) => d.value,
        opacity: selected ? 0.1 : 0.2,
        href: "country_url",
        title: "NAME_ENGL",
        tip: false, // Disable automatic tooltips
      }),
      // highlighted dots
      Plot.dot(
        data.filter((d) => d.NAME_ENGL == selectedCountry),
        {
          x: (d) => longitude(d.commitment_num), // Use the new x position calculated by the force simulation
          y: (d) => 105 - d.value, // Use the new y position
          // stroke: (d) => d.pillar,
          fill: (d) => d.pillar,
          r: (d) => d.value,
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

  // const areaPath = svg
  //   .append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 1.5)
  //   .attr("visibility", "hidden");

  // const linkPath = svg
  //   .append("path") // ???
  //   .attr("fill", "none")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", 1.5)
  //   .attr("visibility", "hidden");

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
