import colorScales from "./scales.js"; // 👈 Import the color scale

export function sources(data) {
  const container = document.getElementById("sources-section");
  container.innerHTML = "";

  if (!data || data.length === 0) return;

  const fillScale = colorScales(); // 👈 Initialize the scale

  const mainHeading = document.createElement("h1");
  mainHeading.id = "sources";
  mainHeading.tabIndex = -1;
  mainHeading.style.paddingTop = "50px";

  const anchor = document.createElement("h1");
  anchor.className = "observablehq-header-anchor";
  anchor.href = "#sources";
  anchor.textContent = "Sources";

  mainHeading.appendChild(anchor);
  container.appendChild(mainHeading);

  const emptyDiv = document.createElement("div");
  emptyDiv.textContent = "";
  container.appendChild(emptyDiv);

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-3";
  container.appendChild(gridContainer);

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "sourcecard";

    // Style type
    if (item.type === "Source") {
      card.style.borderWidth = "3px";
    } else if (item.type === "Analysis") {
      card.style.borderWidth = "5px";
      card.style.fontWeight = "700";
    }

    // 👉 Apply border color using pillar_txt and colorScales
    const borderColor = fillScale.getColor(item.pillar_txt);
    card.style.borderStyle = "solid";
    // card.style.borderColor = borderColor;
    card.style.backgroundColor = borderColor;

    const span = document.createElement("span");
    span.textContent = item.title;
    card.appendChild(span);

    const isValidURL = item.url && item.url.trim() !== "NA";

    const wrapper = document.createElement("a");
    wrapper.href = isValidURL
      ? item.url
      : `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
          "https://raw.githubusercontent.com/cdtrich/dfi/46978462ce4d3bc30f6305b4e03ce11104e3cc00/src/data/sources/" +
            item.filename +
            ".pdf"
        )}`;
    wrapper.target = "_blank";
    wrapper.style.display = "block";
    wrapper.style.textDecoration = "none";

    wrapper.appendChild(card);
    gridContainer.appendChild(wrapper);
  });
}
