export function goodPracticeCards(data) {
  // Get the container for good practices
  const container = document.getElementById("goodpractice-section");
  // console.log("goodPracticeCards data", data);

  // Clear the container first
  container.innerHTML = "";
  // container.className = "card size-full";
  // container.style = "position: relative";
  container.style.marginLeft = "10vw";
  container.style.marginRight = "10vw";

  // Check if data exists and has elements
  if (!data || data.length === 0) {
    return;
  }

  // Create the main heading
  const mainHeading = document.createElement("h1");
  mainHeading.id = "sources";
  mainHeading.tabIndex = -1;
  // mainHeading.style.width = "60vw";
  // mainHeading.style.textAlign = "center";
  // mainHeading.style.marginLeft = "25vw";
  // mainHeading.style.marginRight = "25vw";
  mainHeading.style.paddingTop = "50px";

  const anchor = document.createElement("h1");
  anchor.className = "observablehq-header-anchor";
  anchor.href = "#sources";
  anchor.textContent = "Sources";

  mainHeading.appendChild(anchor);
  container.appendChild(mainHeading);

  // Empty div b/c otherwise first heading looks different
  const emptyDiv = document.createElement("div");
  emptyDiv.textContent = "";
  container.appendChild(emptyDiv);

  // Create the grid container
  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-2 w-[60vw]";
  container.appendChild(gridContainer);

  // Create cards for each document
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "goodpracticecard";

    // Apply different styles based on type
    if (item.type === "Source") {
      card.style.borderWidth = "3px";
    } else if (item.type === "Analysis") {
      card.style.borderWidth = "5px";
      card.style.fontWeight = "700";
    }

    // Create a link that wraps the entire card
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.style.display = "block"; // Ensure the link wraps the entire card

    // Create the span element for the document text
    const span = document.createElement("span");
    span.textContent = item.title;

    link.appendChild(card);
    card.appendChild(span);
    gridContainer.appendChild(link);
  });
}
