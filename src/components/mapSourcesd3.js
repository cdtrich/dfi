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
    .attr("stroke", (d) =>
      data.includes(d.properties.ISO3_CODE) ? "#32baa8" : "#eee"
    )
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
      .attr("stroke", (d) =>
        data.includes(d.properties.ISO3_CODE) ? "#32baa8" : "#eee"
      )
      .attr("stroke-opacity", 1);
  }

  // External selection (from input)
  window.addEventListener("map-country-selected", (e) => {
    selectedCountry = e.detail;
    updateStyles();
  });

  return svg.node();
}
