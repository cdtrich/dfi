import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import colorScales from "./scales.js";

export function mapPillar(
  world,
  data,
  property,
  uniqueValues,
  select,
  { width, height }
) {
  // console.log("select mapPillar", select);
  // Filter data if a pillar is selected
  const filteredData = data.filter((d) => d.pillar_txt === select);
  // console.log("data mapPillar filtered", filteredData);

  // Merge the world data with the filtered data
  // Using a Map for O(1) lookups instead of O(n) with find()
  const dataMap = new Map(filteredData.map((item) => [item.ISO3_CODE, item]));

  const worldWithData = world.map((feature) => {
    const matchingData = dataMap.get(feature.properties.ISO3_CODE);

    return matchingData
      ? { ...feature, properties: { ...feature.properties, ...matchingData } }
      : feature;
  });

  // console.log("worldWithData", worldWithData);
  // const labels = [
  //   ...new Set(worldWithData.map((d) => d.properties.group_value)),
  // ];
  // console.log("labels", labels);

  // get colorsScales()
  const fillScale = colorScales();
  // console.log("test", fillScale.getColor("Rights and freedoms", 0));

  // Render the map
  const map = Plot.plot({
    projection: "equal-earth",
    width: width,
    opacity: {
      legend: false,
      range: [0, 1],
      domain: [0, 100],
    },
    color: {
      legend: true,
      type: "ordinal",
      range: [
        fillScale.getOrdinalCategoryScale(select)("Off track"),
        fillScale.getOrdinalCategoryScale(select)("Catching up"),
        fillScale.getOrdinalCategoryScale(select)("On track"),
        fillScale.getOrdinalCategoryScale(select)("Leading"),
      ],
      domain: ["Off track", "Catching up", "On track", "Leading"],
    },
    marks: [
      // colored countries
      Plot.geo(worldWithData, {
        // fill: (d) =>
        //   isNaN(d.properties.value) ? "#fff" : d.properties.group_value,
        fill: (d) =>
          isNaN(d.properties.value)
            ? "#fff"
            : fillScale.getOrdinalCategoryScale(d.properties.pillar_txt)(
                d.properties.group_value
              ),
        stroke: "#fff",
        strokeWidth: 0.5,
        href: (d) => d.properties.country_url,
      }),
      // Hashing overlay - only for partial data
      Plot.geo(
        worldWithData.filter((d) => d.properties.note === " (partial data)"),
        {
          fill: "url(#white-diagonal-lines)",
          stroke: "none",
          pointerEvents: "none",
        }
      ),
      // World outline
      Plot.geo(worldWithData, {
        stroke: (d) => (isNaN(d.properties.value) ? "#aaa" : "#fff"),
        strokeWidth: 0.5,
      }),
      // country labels
      Plot.tip(
        worldWithData,
        Plot.centroid(
          Plot.pointer({
            title: (d) =>
              `${
                d.properties.note === " (partial data)"
                  ? Math.round(d.properties.value, 1) + d.properties.note
                  : Math.round(d.properties.value, 1)
              }\n${d.properties.NAME_ENGL}`,
            stroke: "#fff",
          })
        )
      ),
    ],
  });

  // Add the pattern definition after creating the plot
  const svg = d3.select(map).select("svg");
  svg.insert("defs", ":first-child").html(`
  <pattern id="white-diagonal-lines" patternUnits="userSpaceOnUse" width="4.2425" height="4.2425" patternTransform="rotate(45)">
    <rect x="0" y="0" width="1.5" height="4.2425" fill="white"/>
  </pattern>
`);

  return map;
}
