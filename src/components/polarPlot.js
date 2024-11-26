import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function polarPlot(
  data,
  commitments,
  selectedCountry,
  { width, height } = {}
) {
  // params
  const vh = window.innerHeight;

  // is a country selected?
  const selected = selectedCountry.length < 2;
  // console.log(selected);

  // dot position
  const longitude = d3
    .scalePoint(new Set(Plot.valueof(data, "commitment_txt")), [205, -155])
    .padding(0.5)
    .align(1);

  const dotSize = window.innerWidth * 0.005;

  // dodging with force simulation
  const simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX((d) => longitude(d.commitment_txt)).strength(0.05))
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

  let plot = Plot.plot({
    width: width,
    height: vh * 0.85,
    // title: "The state of the internet",
    // subtitle: "As expressed in thousands of dots",
    projection: {
      type: "azimuthal-equidistant",
      rotate: [0, -90],
      domain: d3.geoCircle().center([0, 90]).radius(10000.625)(),
    },
    r: { range: [dotSize, dotSize] },
    color: {
      legend: false,
      range: ["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"],
    },
    marks: [
      // PILLARS
      Plot.link(pillars, {
        x1: (d) => longitude(d.x1),
        x2: (d) => longitude(d.x2),
        y1: 12,
        y2: 12,
        stroke: (d) => d.pillar,
        strokeWidth: 2,
        // href: "url",
      }),
      Plot.text(pillars, {
        x: (d) => longitude(d.x),
        y: (d, i) => ((i === 2) | (i === 3) ? 6.5 : 11.5),
        rotate: (d, i) => ((i === 2) | (i === 3) ? 72 * i + 180 : 72 * i),
        fill: "pillar",
        // fill: "#ffffff",
        text: (d, i) => [d.pillar, ""].join("\n"), // shift baseline
        fontSize: "2em",
        textAnchor: "center",
        href: "url",
      }),
      // DOTS
      Plot.text(commitments, {
        x: (d, i) => longitude(commitments[i]),
        y: 20,
        fontFace: "bold",
        text: (d, i) => `${commitments[i]}`.replace(/ /g, "\n"),
        // text: (d, i) => `${commitments[i]}`,
      }),
      Plot.dot(data, {
        x: (d) => longitude(d.commitment_txt), // Use the new x position calculated by the force simulation
        y: (d) => 90 - d.value, // Use the new y position
        stroke: (d) => d.pillar,
        r: (d) => d.value,
        opacity: selected ? 0.1 : 0.2,
        href: "country_url",
        title: (d) => d.NAME_ENGL,
        tip: false, // Disable automatic tooltips
      }),
      // Plot.dot(data, {
      //   x: (d) => longitude(d.commitment_txt), // Use the new x position calculated by the force simulation
      //   y: (d) => 90 - d.value, // Use the new y position
      //   stroke: (d) => d.pillar,
      //   r: (d) => d.value,
      //   opacity: 0.2,
      //   href: "country_url",
      //   title: (d) => d.NAME_ENGL,
      //   tip: false, // Disable automatic tooltips
      // }),
      Plot.dot(
        data.filter((d) => d.NAME_ENGL == selectedCountry),
        {
          x: (d) => longitude(d.commitment_txt), // Use the new x position calculated by the force simulation
          y: (d) => 90 - d.value, // Use the new y position
          // stroke: (d) => d.pillar,
          fill: (d) => d.pillar,
          r: (d) => d.value,
          opacity: 1,
          href: "country_url",
          title: (d) => d.NAME_ENGL,
          tip: false, // Disable automatic tooltips
        }
      ),
      // Plot.dot(
      //   data,
      //   Plot.pointer({
      //     x: (d) => longitude(d.commitment_txt),
      //     y: (d) => 90 - d.value,
      //     fill: (d) => d.pillar,
      //     // stroke: (d) => d.pillar,
      //     r: (d) => d.value,
      //     // opacity: 0.15,
      //     href: "country_url",
      //     // "data-name": (d) => d.NAME_ENGL,
      //     // "data-value": (d) => Math.round(d.value),
      //     title: (d) => d.NAME_ENGL,
      //     tip: false, // Disable automatic tooltips
      //   })
      // ),
    ],
  });

  const plotElement = document.body.appendChild(plot);

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
  document.body.appendChild(tooltip);

  // Create a path element that will contain the area
  const svg = d3.select(plotElement).select("svg");

  const areaPath = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("visibility", "hidden");

  const linkPath = svg
    .append("path") // ???
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5)
    .attr("visibility", "hidden");

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
    linkPath.attr("visibility", "hidden"); // Hide the area
  });

  return plotElement; // Return the plot element
}
