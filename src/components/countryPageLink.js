export function countryPageLink(country) {
  // Get the target div element by its ID
  var container = document.getElementById("country-link-container");

  // Clear any existing content in the container
  container.innerHTML = "";

  // Check if a valid country is selected
  if (country && country !== "Select a country") {
    var sanitizedCountry = country.replace(/\s+/g, ""); // This removes all spaces
    var countryPage = "countries/" + sanitizedCountry;

    // Create a new anchor element
    var link = document.createElement("a");

    // Set the text content of the link
    link.textContent = "Go to country page";

    // Set the href attribute of the link
    link.href = countryPage;

    // Append the link to the target div
    container.appendChild(link);
  }
}
