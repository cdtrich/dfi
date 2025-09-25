import * as d3 from "npm:d3";

export function mapSourcesd3(
  worldGeoJson,
  coastGeoJson,
  data,
  { width, height = 400 }
) {
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("width", "100%")
    // .style("margin-top", "100px")
    .style("height", "auto");

  const projection = d3.geoEqualEarth().fitSize([width, height], {
    type: "FeatureCollection",
    features: worldGeoJson,
  });

  const path = d3.geoPath(projection);

  let selectedCountry = null;

  // Coastlines
  svg
    .append("g")
    .selectAll("path")
    .data(coastGeoJson.features)
    .join("path")
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 0.5);

  // Country paths
  const countryPaths = svg
    .append("g")
    .selectAll("path")
    .data(worldGeoJson)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) =>
      data.includes(d.properties.ISO3_CODE) ? "#32baa8" : "#eee"
    )
    .attr("stroke", "#eee")
    .attr("stroke-width", 0.5)
    .attr("cursor", "pointer")
    .attr("opacity", 1)
    .on("click", (event, d) => {
      selectedCountry = d.properties.NAME_ENGL;
      updateStyles();
      window.dispatchEvent(
        new CustomEvent("map-country-selected", { detail: selectedCountry })
      );
    });

  // Highlighting logic
  function updateStyles() {
    countryPaths
      .transition()
      .duration(200)
      .attr("opacity", (d) =>
        !selectedCountry || d.properties.NAME_ENGL === selectedCountry ? 1 : 0.2
      )
      .attr("stroke", "#eee")
      .attr("stroke-opacity", 1);
  }

  // External selection (from input)
  window.addEventListener("map-country-selected", (e) => {
    selectedCountry = e.detail;
    updateStyles();
  });

  // Tooltip group
  const tooltipGroup = svg
    .append("g")
    .attr("class", "custom-tooltip")
    .style("pointer-events", "none")
    .style("visibility", "hidden");

  const tooltipBox = tooltipGroup
    .append("rect")
    .attr("fill", "#fff")
    .attr("stroke", "var(--vp-c-border)")
    .attr("filter", "drop-shadow(0 3px 4px rgba(0,0,0,0.2))")
    .attr("rx", 4) // rounded corners
    .attr("ry", 4);
  // .append("path")
  // .attr("fill", "#fff")
  // .attr("stroke", "#3c3f44")
  // .attr("fill", "#f5f5f5") // for text
  // .attr("d", "M0,0l6,-6h90v-60h-192v60h90z");

  const tooltipText = tooltipGroup
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-family", "Inter, sans-serif")
    .attr("fill", "var(--vp-c-text-1)")
    .style("dominant-baseline", "hanging");

  // Utility: wrap text every ~15 characters
  function wrapText(text, lineLength = 25) {
    const words = text.split(" ");
    const lines = [];
    let current = "";

    for (const word of words) {
      if ((current + " " + word).length > lineLength) {
        lines.push(current.trim());
        current = word;
      } else {
        current += " " + word;
      }
    }
    if (current.trim()) lines.push(current.trim());
    return lines;
  }

  // Tooltip events
  countryPaths
    .on("mouseover", function (event, d) {
      const name = d.properties.NAME_ENGL;
      const [lon, lat] = d3.geoCentroid(d);
      const [x, y] = projection([lon, lat]);

      // Clear previous tspans
      tooltipText.selectAll("tspan").remove();

      const lines = wrapText(name, 25);

      lines.forEach((line, i) => {
        tooltipText
          .append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? "0em" : "1.2em")
          .text(line);
      });

      // Get dimensions of the full text block
      const bbox = tooltipText.node().getBBox();
      const padding = 6;

      tooltipBox
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + padding * 2)
        .attr("height", bbox.height + padding * 2);

      tooltipGroup.attr(
        "transform",
        `translate(${x}, ${y - bbox.height - padding + 20})`
      );
      tooltipGroup.style("visibility", "visible");
    })
    .on("mouseout", () => {
      tooltipGroup.style("visibility", "hidden");
    });

  return svg.node();
}
