import * as d3 from "npm:d3";

const colorScales = () => {
  // Discrete (Categorical) Color Scale
  const colorScale = d3
    .scaleOrdinal()
    .domain([
      "Connectivity and infrastructure",
      "Rights and freedoms",
      "Responsibility and sustainability",
      "Trust and resilience",
      "Total",
    ])
    .range(["#962c8c", "#643291", "#034ea2", "#3c4099", "#000"]);

  // Function to get the sequential scale
  const getSequentialScale = (category) => {
    const colorMap = {
      "Connectivity and infrastructure": "#962c8c",
      "Rights and freedoms": "#643291",
      "Responsibility and sustainability": "#034ea2",
      "Trust and resilience": "#3c4099",
      Total: "#000",
    };
    const lowestMap = {
      "Connectivity and infrastructure": "#f3e6f1", // 20% tint https://chatgpt.com/share/e/680d362f-646c-800a-962a-29844656f32b
      "Rights and freedoms": "#f1eaf7",
      "Responsibility and sustainability": "#e6eef7",
      "Trust and resilience": "#e7e8f5",
      Total: "#cccccc",
    };
    return d3.scaleSequential(
      d3.interpolateRgb(lowestMap[category], colorMap[category])
    );
  };

  // Function to get ordinal category-based scale
  const getOrdinalCategoryScale = (category) => {
    const baseColorMap = {
      "Connectivity and infrastructure": "#962c8c",
      "Rights and freedoms": "#643291",
      "Responsibility and sustainability": "#034ea2",
      "Trust and resilience": "#3c4099",
      Total: "#000000",
    };

    const baseHex = baseColorMap[category];
    const baseColor = d3.color(baseHex);
    const tintColor = baseColor
      ? d3.interpolateRgb("#ffffff", baseHex)(0.5)
      : "#cccccc";

    return d3
      .scaleOrdinal()
      .domain(["Off course", "Getting on track", "On track", "Leading"])
      .range(["#e6b95e", "#fffccc", tintColor, baseHex]);
  };

  // Function to get the correct color
  const getColor = (category, value) => {
    if (value !== undefined) {
      return getSequentialScale(category)(value / 100); // Normalize 0-100
    }
    return colorScale(category);
  };

  return {
    getColor,
    getSequentialScale,
    getOrdinalCategoryScale,
  };
};

// Export the component
export default colorScales;
