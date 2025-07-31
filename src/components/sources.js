export function sources(data) {
  // Get the container for good practices
  const container = document.getElementById("sources-section");
  // console.log("goodPracticeCards data", data);

  // Clear the container first
  container.innerHTML = "";

  // Check if data exists and has elements
  if (!data || data.length === 0) {
    return;
  }

  // Create the main heading
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

  // Empty div b/c otherwise first heading looks different
  const emptyDiv = document.createElement("div");
  emptyDiv.textContent = "";
  container.appendChild(emptyDiv);

  // Create the grid container
  const gridContainer = document.createElement("div");
  gridContainer.className = "grid grid-cols-3";
  container.appendChild(gridContainer);

  // Create cards for each document
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "sourcecard";

    // Apply different styles based on type
    if (item.type === "Source") {
      card.style.borderWidth = "3px";
    } else if (item.type === "Analysis") {
      card.style.borderWidth = "5px";
      card.style.fontWeight = "700";
    }

    // Create the span element for the document text
    const span = document.createElement("span");
    span.textContent = item.title;
    card.appendChild(span);

    // Check if URL exists and is not "NA"
    if (item.url && item.url.trim() !== "NA") {
      // Create a clickable link
      const link = document.createElement("a");
      link.href = item.url;
      link.target = "_blank";
      link.style.display = "block"; // Ensure the link wraps the entire card
      link.style.textDecoration = "none"; // Remove underline
      // link.style.color = "inherit"; // Inherit text color
      // link.style.margin = "0"; // Reset margin
      // link.style.padding = "0"; // Reset padding

      link.appendChild(card);
      gridContainer.appendChild(link);
    } else {
      // Create a non-clickable wrapper (still an <a> but no href)
      const wrapper = document.createElement("a");
      wrapper.href = "../_file/data/sources/" + item.filename + ".pdf"; // Assuming the file is in the sources directory
      wrapper.style.display = "block";
      wrapper.style.textDecoration = "none";
      // wrapper.style.color = "inherit";
      // wrapper.style.cursor = "default";

      // card.style.opacity = "0.5"; // Visual indicator

      wrapper.appendChild(card);
      gridContainer.appendChild(wrapper);
    }
  });
}
