import { viewofCustomLegend } from "./customLegend.js";
import { mapPillar } from "./mapPillar.js";
import { mapPillarCommitment } from "./mapPillarCommitment.js";

export function renderDualMap(world, data, pillars, size) {
  const container = document.createElement("div");
  container.className = "dual-map-wrapper grid"; // Tailwind/Custom grid styling

  // --- First card: Pillar selector and first map ---
  const pillarCard = document.createElement("div");
  pillarCard.className = "card grid-colspan-1";

  const pillarLegend = viewofCustomLegend(pillars, pillars[0]);
  const firstMapWrapper = document.createElement("div");

  // --- Second card: Commitment selector and second map ---
  const commitmentCard = document.createElement("div");
  commitmentCard.className = "card grid-colspan-2";

  const secondMapWrapper = document.createElement("div");
  const commitmentLegendWrapper = document.createElement("div");

  // --- Internal draw logic ---
  function drawMaps(selectedPillar) {
    // Filter data for selected pillar
    const pillarFilteredData = data.filter(
      (d) => d.pillar_txt === selectedPillar
    );

    // Extract commitment labels from filtered data
    const uniqueCommitments = [
      ...new Set(pillarFilteredData.map((d) => d.commitment_txt_cardinal)),
    ];

    const selectedCommitment = uniqueCommitments[0];

    // Draw first map
    const firstMap = mapPillar(
      world,
      data,
      "value",
      pillars,
      selectedPillar,
      size
    );
    firstMapWrapper.innerHTML = "";
    firstMapWrapper.appendChild(firstMap);

    // Create and wire commitment legend
    const commitmentLegend = viewofCustomLegend(
      uniqueCommitments,
      selectedCommitment
    );

    // Initial second map
    drawSecondMap(commitmentLegend.value);

    // Redraw second map on commitment change
    commitmentLegend.addEventListener("input", () => {
      drawSecondMap(commitmentLegend.value);
    });

    // Inject updated commitment legend
    commitmentLegendWrapper.innerHTML = "";
    commitmentLegendWrapper.appendChild(commitmentLegend);

    function drawSecondMap(selectedCommitment) {
      const secondMap = mapPillarCommitment(
        world,
        pillarFilteredData,
        selectedPillar,
        selectedCommitment,
        size
      );
      secondMapWrapper.innerHTML = "";
      secondMapWrapper.appendChild(secondMap);
    }
  }

  // Initial draw
  drawMaps(pillars[0]);

  // Redraw maps on pillar change
  pillarLegend.addEventListener("input", () => {
    drawMaps(pillarLegend.value);
  });

  // Assemble DOM
  pillarCard.appendChild(pillarLegend);
  pillarCard.appendChild(firstMapWrapper);

  commitmentCard.appendChild(commitmentLegendWrapper);
  commitmentCard.appendChild(secondMapWrapper);

  container.appendChild(pillarCard);
  container.appendChild(commitmentCard);

  return container;
}
