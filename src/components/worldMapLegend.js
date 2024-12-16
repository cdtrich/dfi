import * as Plot from "npm:@observablehq/plot";
// import {addTooltips} from "https://observablehq.com/@mkfreeman/plot-tooltip";
// import {addTooltips} from "@mkfreeman/plot-tooltip";
// import * as d3 from "npm:d3";

// CHAT GPT
// https://chatgpt.com/g/g-fAgI6VGij-frontend-developer/c/674ef1fe-4de4-8008-bc1f-c68b4a466e37

export function worldMapLegend(containerId, colors, labels) {
  const container = document.getElementById(containerId);

  labels.forEach((label, index) => {
    const tile = document.createElement("div");
    tile.textContent = label;
    tile.style.display = "inline-block";
    tile.style.margin = "5px";
    tile.style.padding = "10px 15px";
    tile.style.backgroundColor = colors[index];
    tile.style.color = "#643291";
    tile.style.fontWeight = "bold";
    tile.style.size = "16px";
    tile.style.cursor = "pointer";
    tile.style.opacity = "1"; // Default opacity

    // Add ARIA label for accessibility
    tile.setAttribute("role", "button"); // Role makes it clear this is interactive
    tile.setAttribute("aria-label", `Filter by ${label}`); // Descriptive ARIA label

    // Add click event to update selected state and emit event
    tile.addEventListener("click", () => {
      // Update the opacity of all tiles
      Array.from(container.children).forEach((child) => {
        child.style.opacity = "0.2";
      });
      tile.style.opacity = "1"; // Highlight the selected tile

      // Emit a custom event with the selected value
      const event = new CustomEvent("legendClick", { detail: label });
      container.dispatchEvent(event);
      console.log(event.detail);
    });

    container.appendChild(tile);
  });
}
