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
      note,
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
    simplified[ISO3_CODE][`${pillar_txt}_note`] = note;
  });

  const dataCardinalSimplified = Object.values(simplified);

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
  });

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

  // Render the map
  const map = Plot.plot({
    projection: "equal-earth",
    width: width,
    color: {
      legend: true,
      type: "ordinal",
      range: ["#FDE74C", "#afb6b5ff", "#4ed0bfff", "#007162ff"],
      domain: ["Off track", "Catching up", "On track", "Leading"],
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
          d.properties.note === " (partial data)" ? "#aaa" : "#fff",
        strokeWidth: 0.5,
      }),
      // black country outline
      Plot.tip(
        worldWithCentroids,
        Plot.pointer({
          x: (d) => d.properties.centroid[0],
          y: (d) => d.properties.centroid[1],
          title: (d) =>
            [
              `${d.properties.NAME_ENGL} ━ ${d.properties.group} (${Math.round(
                d.properties.total
              )} total)`,
              ``, // empty line
              `𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝘃𝗶𝘁𝘆 𝗮𝗻𝗱 𝗶𝗻𝗳𝗿𝗮𝘀𝘁𝗿𝘂𝗰𝘁𝘂𝗿𝗲: ${
                d.properties["Connectivity and infrastructure_note"] === "NA"
                  ? Math.round(d.properties["Connectivity and infrastructure"])
                  : Math.round(
                      d.properties["Connectivity and infrastructure"]
                    ) + d.properties["Connectivity and infrastructure_note"]
              }`,
              `𝗥𝗶𝗴𝗵𝘁𝘀 𝗮𝗻𝗱 𝗳𝗿𝗲𝗲𝗱𝗼𝗺𝘀: ${
                d.properties["Rights and freedoms_note"] === "NA"
                  ? Math.round(d.properties["Rights and freedoms"])
                  : Math.round(d.properties["Rights and freedoms"]) +
                    d.properties["Rights and freedoms_note"]
              }`,
              `𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗶𝗯𝗶𝗹𝗶𝘁𝘆 𝗮𝗻𝗱 𝘀𝘂𝘀𝘁𝗮𝗶𝗻𝗮𝗯𝗶𝗹𝗶𝘁𝘆: ${
                d.properties["Responsibility and sustainability"] === "NA"
                  ? Math.round(
                      d.properties["Responsibility and sustainability"]
                    )
                  : Math.round(
                      d.properties["Responsibility and sustainability"]
                    ) + d.properties["Responsibility and sustainability_note"]
              }`,
              `𝗧𝗿𝘂𝘀𝘁 𝗮𝗻𝗱 𝗿𝗲𝘀𝗶𝗹𝗶𝗲𝗻𝗰𝗲: ${
                d.properties["Trust and resilience"] === "NA"
                  ? Math.round(d.properties["Trust and resilience"])
                  : Math.round(d.properties["Trust and resilience"]) +
                    d.properties["Trust and resilience_note"]
              }`,
            ].join("\n"),
          stroke: "#fff",
        })
      ),
    ],
  });

  return map;
}
