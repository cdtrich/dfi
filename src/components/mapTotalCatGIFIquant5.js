import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";
// import { html } from "htl";

export function mapTotalCatGIFIquant5(
  world,
  coast,
  data,
  dataCardinal,
  { width, height }
) {
  // console.log("mapTotal data", data);
  // Filter data if a pillar is selected
  const filteredData = data.filter(
    (d) => d.commitment_num === 1
    // (d) => d.commitment_num === 1 && d.value !== "NA"
    // select only one pillar
  );

  // console.log("filteredData", filteredData);

  // Merge the world data with the filtered data
  // Using a Map for O(1) lookups instead of O(n) with find()
  const dataMap = new Map(filteredData.map((item) => [item.ISO3_CODE, item]));

  const worldWithData = world
    .map((feature) => {
      const matchingData = dataMap.get(feature.properties.ISO3_CODE);

      return matchingData
        ? { ...feature, properties: { ...feature.properties, ...matchingData } }
        : feature;
      // and filter undefined groups
    })
    .filter((d) => d.properties.group !== undefined);

  // console.log("worldWithData (in mapTotal)", worldWithData);

  // scorecard objects
  // simplify dfiCardinal to contain one object per country
  const simplified = {};

  dataCardinal.forEach((entry) => {
    const {
      ISO3_CODE,
      NAME_ENGL,
      group,
      group_value,
      total,
      pillar_txt,
      value,
    } = entry;

    if (!simplified[ISO3_CODE]) {
      simplified[ISO3_CODE] = {
        ISO3_CODE,
        NAME_ENGL,
        group,
        group_value,
        total,
      };
    }

    simplified[ISO3_CODE][pillar_txt] = value;
  });

  const dataCardinalSimplified = Object.values(simplified);
  // console.log("dataCardinalSimplified", dataCardinalSimplified);
  // join to world shape for centroids

  const dataCardinalMap = new Map(
    dataCardinalSimplified.map((item) => [item.ISO3_CODE, item])
  );
  const worldWithCardinal = world.map((feature) => {
    const matchingDataCardinal = dataCardinalMap.get(
      feature.properties.ISO3_CODE
    );

    return matchingDataCardinal
      ? {
          ...feature,
          properties: { ...feature.properties, ...matchingDataCardinal },
        }
      : feature;
    // and filter undefined groups
  });
  // .filter((d) => d.properties.group !== undefined);

  // calculate centroids of largest polygon for tooltip
  function largestPolygonCentroid(feature) {
    const { type, coordinates } = feature.geometry;

    if (type === "Polygon") {
      return d3.geoCentroid(feature); // Already a single polygon
    }

    if (type === "MultiPolygon") {
      const polygons = coordinates.map((rings) => ({
        type: "Polygon",
        coordinates: rings,
      }));

      const largest = polygons.reduce((a, b) =>
        d3.geoArea(a) > d3.geoArea(b) ? a : b
      );

      return d3.geoCentroid({ type: "Feature", geometry: largest });
    }

    return null;
  }

  const worldWithCentroids = worldWithCardinal.map((f) => ({
    ...f,
    properties: {
      ...f.properties,
      centroid: largestPolygonCentroid(f),
    },
  }));
  // console.log("worldWithCardinal", worldWithCardinal);

  //   range
  const [min, max] = d3.extent(filteredData, (d) => d.total);

  // console.log("worldWithData", worldWithData);
  const labels = [...new Set(worldWithData.map((d) => d.properties.group))];

  // find undefined groups
  // const undefinedGroup = worldWithData.filter(
  //   (d) => d.properties.group === undefined
  // );

  // console.log("labels", labels);
  // console.log("worldWithData", worldWithData);
  // console.log("undefinedGroup", undefinedGroup);

  // Render the map
  const map = Plot.plot({
    projection: "equal-earth",
    width: width,
    // title: "GIFI colors-derived diverging color scale",
    // subtitle: "five equally-sized groups",
    // opacity: {
    //   legend: true,
    //   range: [0, 1],
    //   domain: [min, max],
    // },
    // caption: html`<figcaption style="text-align: right; width: 100%;">
    //   Off course = 0-49, Getting on track = 50-64, On track = 65-79, Leading =
    //   80-100
    // </figcaption>`,
    color: {
      legend: true,
      type: "ordinal",
      range: [
        // "#e6b95e", // 50% tint
        // "#fffccc",
        // "#ff4671", // 50% tint
        // "hsla(346, 100%, 83%, 1.00)",
        // "#333", // 50% tint
        // "#999",
        "#FDE74C",
        // "#aec8c0ff",
        // "#b0b0b0ff",
        "#afb6b5ff",
        "#4ed0bfff",
        "#007162ff",
        // "#6BB6C7",
        // "#3891A6",
      ],
      // domain: ["<50", "51-61", "62-67", "68-74", ">74"],
      domain: ["Off track", "Getting on track", "On track", "Leading"],
      // domain: labels,
      // interval: 20,
      // range: [fillScale.getColor("Total", 0), fillScale.getColor("Total", 100)],
      // domain: [0, 100],
    },
    marks: [
      // coast
      Plot.geo(world, {
        fill: null,
        stroke: "#ccc",
        strokeWidth: 0.5,
      }),
      // colored countries
      Plot.geo(worldWithData, {
        fill: (d) =>
          d.properties.group === "Not enough data"
            ? "#fff"
            : d.properties.group,
        stroke: "#fff",
        strokeWidth: 0.5,
        href: (d) => d.properties.country_url,
      }),
      // World outline
      Plot.geo(worldWithData, {
        stroke: (d) =>
          d.properties.group === "Not enough data" ? "#aaa" : "#fff",
        strokeWidth: 0.5,
      }),
      // black country outline
      // Plot.geo(world),
      // country labels
      // Plot.dot(
      //   worldWithCentroids,
      //   Plot.pointer({
      //     x: (d) => d.properties.centroid[0],
      //     y: (d) => d.properties.centroid[1],
      //     // stroke: null,
      //     href: (d) => d.country_url,
      //     tip: true,
      //     title: (d) => d.NAME_ENGL,
      //   })
      // ),
      Plot.tip(
        worldWithCentroids,
        Plot.pointer({
          x: (d) => d.properties.centroid[0],
          y: (d) => d.properties.centroid[1],
          title: (d) =>
            [
              // `━ ${d.properties.NAME_ENGL} ━`,
              // `Status: ${d.properties.group}`,
              `${d.properties.NAME_ENGL} ━ ${d.properties.group} (${Math.round(
                d.properties.total
              )} total)`,
              ``, // empty line
              `𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗮𝗻𝗱 𝗶𝗻𝗳𝗿𝗮𝘀𝘁𝗿𝘂𝗰𝘁𝘂𝗿𝗲: ${
                d.properties["Connectivity and infrastructure"] === "NA"
                  ? "Not enough data"
                  : Math.round(d.properties["Connectivity and infrastructure"])
              }`,
              `𝗥𝗶𝗴𝗵𝘁𝘀 𝗮𝗻𝗱 𝗳𝗿𝗲𝗲𝗱𝗼𝗺𝘀: ${
                d.properties["Rights and freedoms"] === "NA"
                  ? "Not enough data"
                  : Math.round(d.properties["Rights and freedoms"])
              }`,
              `𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗶𝗹𝗶𝘁𝘆 𝗮𝗻𝗱 𝘀𝘂𝘀𝘁𝗮𝗶𝗻𝗮𝗯𝗶𝗹𝗶𝘁𝘆: ${
                d.properties["Responsibility and sustainability"] === "NA"
                  ? "Not enough data"
                  : Math.round(
                      d.properties["Responsibility and sustainability"]
                    )
              }`,
              `𝗧𝗿𝘂𝘀𝘁 𝗮𝗻𝗱 𝗿𝗲𝘀𝗶𝗹𝗶𝗲𝗻𝗰𝗲: ${
                d.properties["Trust and resilience"] === "NA"
                  ? "Not enough data"
                  : Math.round(d.properties["Trust and resilience"])
              }`,
            ].join("\n"),
          // channels: {
          //   "": (d) => d.properties.NAME_ENGL,
          //   Status: (d) => d.properties.group,
          //   "Connectivity and infrastructure": (d) =>
          //     Math.round(d.properties["Connectivity and infrastructure"]),
          //   "Rights and freedoms": (d) =>
          //     Math.round(d.properties["Rights and freedoms"]),
          //   "Responsibility and sustainability": (d) =>
          //     Math.round(d.properties["Responsibility and sustainability"]),
          //   "Trust and resilience": (d) =>
          //     Math.round(d.properties["Trust and resilience"]),
          // },
          stroke: "#fff",
        })
      ),
      // Plot.tip(
      //   worldWithData,
      //   Plot.centroid(
      //     Plot.pointer({
      //       title: (d) =>
      //         `${
      //           isNaN(d.properties.total)
      //             ? "no data"
      //             : Math.round(d.properties.total, 1)
      //         }\n${d.properties.NAME_ENGL}`,
      //       stroke: "#fff",
      //     })
      //   )
      // ),
    ],
  });

  return map;
}
