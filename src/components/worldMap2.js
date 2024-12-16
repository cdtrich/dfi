import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function worldMap2(
  world,
  goodpractice,
  containerId,
  colors,
  { width, height }
) {
  const mapContainer = document.getElementById(containerId);

  // Step 1: Create a lookup object based on both ISO3_CODE and pillar
  const goodpracticeLookup = goodpractice.reduce((acc, item) => {
    const key = `${item.ISO3_CODE}_${item.pillar_txt}`;
    acc[key] = item;
    return acc;
  }, {});

  // Step 2: Filter, merge, and keep unique features
  const uniqueFeatures = new Set();

  const filteredWorld = world
    .filter((feature) => {
      const isoCode = feature.properties.ISO3_CODE;
      return goodpractice.some((gp) => gp.ISO3_CODE === isoCode);
    })
    .flatMap((feature) => {
      const isoCode = feature.properties.ISO3_CODE;

      const matchingItems = goodpractice.filter(
        (gp) => gp.ISO3_CODE === isoCode
      );

      return matchingItems
        .map((additionalInfo) => {
          const currentPillar = additionalInfo.pillar_txt;
          const uniqueKey = `${isoCode}_${currentPillar}`;

          if (!uniqueFeatures.has(uniqueKey)) {
            uniqueFeatures.add(uniqueKey);

            return {
              ...feature,
              properties: {
                ...feature.properties,
                ...additionalInfo,
              },
              group: uniqueKey,
            };
          }
          return null;
        })
        .filter((f) => f !== null);
    });

  // Dynamic filtering based on the selected pillar
  function drawMap(selectedPillar = null) {
    // Clear the existing map
    mapContainer.innerHTML = "";

    // console.log(filteredWorld);

    // Filter data if a pillar is selected
    const filteredData = selectedPillar
      ? filteredWorld.filter((d) => d.properties.pillar === selectedPillar)
      : filteredWorld;

    // console.log(filteredData);

    // Render the map
    const map = Plot.plot({
      projection: "equal-earth",
      width: width,
      // height: 600,
      marks: [
        // World outline
        Plot.geo(world, {
          stroke: "white",
          strokeWidth: 0.5,
          strokeOpacity: 0.5,
        }),
        // colored countries
        Plot.geo(filteredData, {
          fill: (d) =>
            colors[
              parseInt(d.properties.pillar.replace("Pillar ", ""), 10) - 1
            ], // Color based on the pillar property
          href: (d) => d.properties.country_url,
        }),
        // country labels
        Plot.dot(
          filteredData,
          Plot.centroid({
            stroke: null,
            href: "./" + "country_url",
            tip: true,
            title: (d) => d.properties.NAME_ENGL,
          })
        ),
      ],
    });

    mapContainer.appendChild(map);
  }

  // Initial rendering with all data
  drawMap();

  // Listen for legend clicks to filter data and update the map
  const legendContainer = document.getElementById("legend-container");
  legendContainer.addEventListener("legendClick", (event) => {
    const selectedPillar = event.detail; // Get the selected pillar from the legend
    drawMap(selectedPillar); // Redraw the map with the filtered data
  });
}
