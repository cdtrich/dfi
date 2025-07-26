import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function mapCommitment(
  world,
  data,
  selectPillarCommitment,
  selectCommitment,
  colors,
  { width, height }
) {
  // console.log("data", data);
  // Filter data if a pillar is selected
  const filteredData = data.filter(
    (item) => item.commitment_txt === selectCommitment
  );
  // console.log("filteredData", filteredData);

  const selectData = filteredData.filter((item) =>
    selectCommitment.includes(item.commitment_txt)
  );
  // Merge the world data with the filtered data
  const worldWithData = world.map((feature) => {
    const matchingData = filteredData.find(
      (item) => item.ISO3_CODE === feature.properties.ISO3_CODE
    );

    return matchingData
      ? { ...feature, properties: { ...feature.properties, ...matchingData } }
      : feature;
  });

  // get the index of the selected item to match with color
  const pillar_num =
    selectCommitment === null ? 1 : parseInt(selectCommitment[10], 10);
  const colorZero = `${colors[pillar_num]}00`;
  const color = colors[pillar_num];

  // Render the map
  const map = Plot.plot({
    projection: "equal-earth",
    width: width,
    opacity: {
      legend: true,
      fill: colors[pillar_num],
      range: [0, 1],
      domain: [0, 100],
    },
    fill: {
      legend: true,
      range: [colorZero, colors[pillar_num]],
      domain: [0, 100],
    },
    marks: [
      // World outline
      Plot.geo(world, {
        stroke: "white",
        strokeWidth: 0.5,
        strokeOpacity: 0.5,
      }),
      // colored countries
      Plot.geo(worldWithData, {
        fill: colors[pillar_num],
        opacity: (d) => d.properties.value,
        // stroke: "#fff",
        href: (d) => d.properties.country_url,
      }),
      // country labels
      Plot.dot(
        worldWithData,
        Plot.centroid({
          stroke: null,
          href: (d) => d.properties.country_url,
          tip: true,
          title: (d) =>
            `${
              isNaN(d.properties.value)
                ? "no data"
                : Math.round(d.properties.value, 1)
            }\n${d.properties.NAME_ENGL}`,
        })
      ),
    ],
  });

  return map;
}
