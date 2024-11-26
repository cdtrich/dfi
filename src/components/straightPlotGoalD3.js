import * as d3 from "npm:d3";
// THIS DOESN'T WORK
// was a work-around intended to enable linked highlights by switching from ohq plot to d3js
export function straightPlotGoal(
  dfi,
  goals,
  goal,
  { width = 928, height = 160 } = {}
) {
  // Filter data for the selected goal
  const data = dfi.filter((d) => d.goal === goal);

  // Get unique `commitment_txt` values for later use
  const uniqueCommitments = Array.from(
    new Set(data.map((d) => d.commitment_txt))
  );

  // Define margins and plot dimensions
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;
  const radius = 7;
  const padding = 1.5;

  // Create the x scale based on data values
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.value))
    .range([marginLeft, width - marginRight]);

  // Create a color scale for `commitment_txt`
  const colorScale = d3
    .scaleOrdinal()
    .domain(uniqueCommitments)
    .range(["#32baa7", "#ceeae4", "#fff200", "#e6b95e", "#e87461"]);

  // Create an SVG element
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  // Add x-axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0));

  // Create the dodge layout function for beeswarm
  function dodge(data, { radius = 1, x = (d) => d } = {}) {
    const radius2 = radius ** 2;
    const circles = data
      .map((d, i, data) => ({ x: +x(d, i, data), data: d }))
      .sort((a, b) => a.x - b.x);
    const epsilon = 1e-3;
    let head = null,
      tail = null;

    function intersects(x, y) {
      let a = head;
      while (a) {
        if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
          return true;
        }
        a = a.next;
      }
      return false;
    }

    for (const b of circles) {
      while (head && head.x < b.x - radius2) head = head.next;

      if (intersects(b.x, (b.y = 0))) {
        let a = head;
        b.y = Infinity;
        do {
          let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
          if (y < b.y && !intersects(b.x, y)) b.y = y;
          a = a.next;
        } while (a);
      }

      b.next = null;
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }

    return circles;
  }

  // Apply the dodge function to the data for the beeswarm layout
  const circlesData = dodge(data, {
    radius: radius * 2 + padding,
    x: (d) => xScale(d.value),
  });

  // Create the tooltip group (hidden by default)
  const tooltip = svg
    .append("g")
    .attr("pointer-events", "none")
    .attr("style", "visibility: hidden;");

  const tooltipRect = tooltip
    .append("rect")
    .attr("fill", "var(--plot-background)")
    .attr("stroke", "currentColor")
    .attr("rx", 4) // Rounded corners
    .attr("filter", "drop-shadow(0 3px 4px rgba(0,0,0,0.2))");

  const tooltipText = tooltip
    .append("text")
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .attr("dy", "1.2em") // Adjust text position
    .attr("x", 6)
    .attr("y", 4);

  // Create circles in the SVG using the calculated dodge layout
  const circles = svg
    .append("g")
    .selectAll("circle")
    .data(circlesData)
    .join("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => height - marginBottom - radius - padding - d.y)
    .attr("r", radius)
    .attr("fill", (d) => colorScale(d.data.commitment_txt))
    .attr("stroke", "#3c4099")
    .attr("stroke-width", 2)
    .attr("opacity", 1)
    .attr("data-commitment-txt", (d) => d.data.commitment_txt)
    .on("mouseover", function (event, d) {
      const commitmentTxt = d3.select(this).attr("data-commitment-txt");

      // Highlight all circles with the same `commitment_txt`
      circles
        .filter(function () {
          return d3.select(this).attr("data-commitment-txt") === commitmentTxt;
        })
        .attr("opacity", 1); // Set opacity to 1 for relevant circles

      // De-emphasize other circles
      circles
        .filter(function () {
          return d3.select(this).attr("data-commitment-txt") !== commitmentTxt;
        })
        .attr("opacity", 0.2); // Reduce opacity for non-relevant circles

      // Show the tooltip with data
      tooltip
        .style("visibility", "visible")
        .attr("transform", `translate(${d.x},${d.y})`);

      tooltipText.text(
        `${d.data.NAME_ENGL}: ${Math.round(d.data.value)} (${
          d.data.commitment_txt
        })`
      );

      const bbox = tooltipText.node().getBBox();
      tooltipRect
        .attr("width", bbox.width + 12)
        .attr("height", bbox.height + 8);
    })
    .on("mousemove", function (event) {
      // Move tooltip with the mouse
      const [x, y] = d3.pointer(event);
      tooltip.attr("transform", `translate(${x + 10}, ${y - 10})`);
    })
    .on("mouseout", function () {
      // Reset all circles to full opacity
      circles.attr("opacity", 1);

      // Hide the tooltip
      tooltip.style("visibility", "hidden");
    });

  return svg.node();
}
