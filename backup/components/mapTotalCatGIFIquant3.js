import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
import colorScales from "./scales.js";

export function mapTotalCatGIFIquant3(world, data, { width, height }) {
  // console.log("mapTotal data", data);
  // Filter data if a pillar is selected
  const filteredData = data.filter(
    (d) => d.pillar_txt === "Enabling Environment" // select only one pillar
  );

  // Merge the world data with the filtered data
  // Using a Map for O(1) lookups instead of O(n) with find()
  const dataMap = new Map(filteredData.map((item) => [item.ISO3_CODE, item]));

  const worldWithData = world.map((feature) => {
    const matchingData = dataMap.get(feature.properties.ISO3_CODE);

    return matchingData
      ? { ...feature, properties: { ...feature.properties, ...matchingData } }
      : feature;
  });
  // console.log("worldWithData (in mapTotal)", worldWithData);

  const worldWithDataBins = worldWithData.map((d) => {
    d.properties = {
      ...d.properties, // include all other existing properties
      bin:
        d.properties.total < 57
          ? "<57"
          : d.properties.total < 69
          ? "57-68"
          : ">68",
    };
    return d;
  });
  // console.log("worldWithDataBins (in mapTotal)", worldWithDataBins);

  //   range
  const [min, max] = d3.extent(filteredData, (d) => d.total);

  // Render the map
  const map = Plot.plot({
    projection: "equal-earth",
    width: width,
    title: "GIFI colors-derived diverging color scale",
    subtitle: "three equally-sized groups",
    // opacity: {
    //   legend: true,
    //   range: [0, 1],
    //   domain: [min, max],
    // },
    color: {
      legend: true,
      type: "ordinal",
      range: ["#962c8c", "#fffccc", "#32baa8"],
      domain: ["<57", "57-68", ">68"],
      // interval: 20,
      // range: [fillScale.getColor("Total", 0), fillScale.getColor("Total", 100)],
      // domain: [0, 100],
    },
    marks: [
      // colored countries
      Plot.geo(worldWithDataBins, {
        fill: (d) => (isNaN(d.properties.value) ? "#fff" : d.properties.bin),
        stroke: "#fff",
        strokeWidth: 0.5,
        href: (d) => d.properties.country_url,
      }),
      // World outline
      Plot.geo(worldWithData, {
        stroke: (d) => (isNaN(d.properties.value) ? "#aaa" : "#fff"),
        strokeWidth: 0.5,
      }),
      // country labels
      Plot.dot(
        worldWithData,
        Plot.centroid({
          stroke: null,
          href: (d) => d.properties.country_url,
          // tip: true,
          // title: (d) =>
          //   `${
          //     isNaN(d.properties.total)
          //       ? "no data"
          //       : Math.round(d.properties.total, 1)
          //   }\n${d.properties.NAME_ENGL}`,
        })
      ),
      // tooltip
      // Plot.dot(
      //   worldWithDataBins,
      //   Plot.centroid({
      //     // fill: (d) => (isNaN(d.properties.value) ? "#fff" : d.bin),
      //     // stroke: "#fff",
      //     // strokeWidth: 0.5,
      //     // href: (d) => d.properties.country_url,
      //     opacity: 0,
      //     tip: true,
      //     channels: {
      //       name: "name",
      //       nationality: {
      //         value: "nationality",
      //         label: "country",
      //       },
      //       sport: "sport",
      //     },
      //     tip: {
      //       format: {
      //         name: true,
      //         sport: true,
      //         nationality: true,
      //         y: (d) => `${d}m`,
      //         x: (d) => `${d}kg`,
      //         stroke: false,
      //       },
      //     },
      //   })
      // ),
      Plot.tip(
        worldWithDataBins,
        Plot.centroid(
          Plot.pointer({
            title: (d) =>
              `${
                isNaN(d.properties.total)
                  ? "no data"
                  : Math.round(d.properties.total, 1)
              }\n${d.properties.NAME_ENGL}`,
            stroke: "#fff",
          })
        )
      ),
    ],
  });

  return map;
}
