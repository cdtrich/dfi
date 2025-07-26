import * as Plot from "npm:@observablehq/plot";
// import {addTooltips} from "https://observablehq.com/@mkfreeman/plot-tooltip";
// import {addTooltips} from "@mkfreeman/plot-tooltip";
// import * as d3 from "npm:d3";

// https://observablehq.com/@observablehq/plot-radar-chart

export function worldMap(data, {width, height} = {}) {
  
    // mainmap = addTooltips( // Add tooltips
    return Plot.plot({
      projection: "equal-earth", // Set the projection
      // width: 1200,
      marks: [
        Plot.geo(
          data, {
          fill: (d) => d.val, 
          stroke: "white", // Add county boundaries using the geo mark 
          // fill: (d) => data.get(d.properties.val), stroke: "white", // Add county boundaries using the geo mark 
          tip: (d) =>
              `${d.properties.NAME_ENGL} \n ${countries_status.get(d.properties.NAME_ENGL)} \n Score: ${countries_total.get(d.properties.NAME_ENGL)}`, // Custom tooltip text
            opacity: .5
        }),
        // Plot.text(countries, Plot.centroid({text: d => countries_name.get(d.properties.NAME_ENGL), fill: "black", stroke: "white"})),
      ],
      // color: {
        // range: ["#309ebe", "#df3144", "#ffde75", "#eeeeee"],
        // domain: ["Free", "Not free", "Partially free", "no data"],
        // unknown: "#ddd", // Polygons with unknown values are gray
        // type: "categorical", // Linear scale for color progression
        // legend: true, // Add the legend
        // label: "SOI country status", // Update legend label
      // },
    })
      // tooltip style
      // {opacity: 1, stroke: "#000000"}
      // )
}