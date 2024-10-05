export function goodPracticeCards(data) {
  // Get the container for good practices
  const container = document.getElementById("goodpractice-section");

  // Clear the container first
  container.innerHTML = "";

  // Check if data exists and has elements
  if (!data || data.length === 0) {
    return;
  }

  // Group data by 'pillar'
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.pillar]) {
      acc[item.pillar] = [];
    }
    acc[item.pillar].push(item);
    return acc;
  }, {});

  // Sort the groupedData object by pillar
  const sortedGroupedData = Object.keys(groupedData)
    .sort() // Sort the keys alphabetically
    .reduce((acc, key) => {
      acc[key] = groupedData[key]; // Add the sorted keys and their values to the new object
      return acc;
    }, {});

  // Check if there are any pillars
  if (Object.keys(sortedGroupedData).length === 0) {
    return;
  }

  // Create the main heading
  const mainHeading = document.createElement("h1");
  mainHeading.id = "goodpractice";
  mainHeading.tabIndex = -1;

  const anchor = document.createElement("a");
  anchor.className = "observablehq-header-anchor";
  anchor.href = "#goodpractice";
  anchor.textContent = "Good practices";

  mainHeading.appendChild(anchor);
  container.appendChild(mainHeading);

  // Loop through the grouped data and create DOM elements
  for (const [pillar, items] of Object.entries(sortedGroupedData)) {
    // empty div b/c otherwise first heading looks different
    const emptyDiv = document.createElement("div");
    emptyDiv.textContent = "";
    container.appendChild(emptyDiv);

    // Create the pillar heading (h2)
    const pillarHeading = document.createElement("h2");
    pillarHeading.textContent = pillar;
    container.appendChild(pillarHeading);

    // Create the grid container
    const gridContainer = document.createElement("div");
    gridContainer.className = "grid grid-cols-4";
    container.appendChild(gridContainer);

    // Create cards for each document
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "goodpracticecard";

      // Create a link that wraps the entire card
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.style.display = "block"; // Ensure the link wraps the entire card

      // Create the span element for the document text
      const span = document.createElement("span");
      span.textContent = item.document;

      link.appendChild(card);
      card.appendChild(span);
      gridContainer.appendChild(link);
    });
  }
}
