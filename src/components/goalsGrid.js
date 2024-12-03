import * as d3 from "npm:d3";

export function goalsGrid(data, dfi, containerSelector, { width }) {
  // Define margins and tile size
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const tileSize = width / 15; // Adjust as per your grid layout

  // Get unique values for goal, commitment_txt, and pillar
  const goals = [...new Set(data.map((d) => d.goal))].sort();
  const commitments = [...new Set(data.map((d) => d.commitment_txt))].sort();
  const pillars = [...new Set(data.map((d) => d.pillar))].sort();

  // Find the goal_url for each goal from the dfi array
  const getGoalUrl = (goal) => {
    const matchedGoal = dfi.find((d) => d.goal === goal); // Find the matching goal in dfi
    return matchedGoal ? matchedGoal.goal_url : null; // Return the goal_url if found, otherwise null
  };

  // console.log(goals);
  // console.log(dfi);
  // console.log(getGoalUrl(goals[0]));
  // Calculate dimensions
  const height = 6 * tileSize + margin.top + margin.bottom; // 3 rows (goals, commitments, pillars)

  // Select the correct container and clean any previous SVGs
  const container = d3.select(containerSelector);
  if (container.empty()) {
    console.error(`No container found for selector '${containerSelector}'`);
    return;
  }
  container.select("svg").remove(); // Clear existing SVG for re-rendering

  // tiles
  // Create the SVG dynamically inside the correct container
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    // .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // console.log("SVG created", svg.node());

  // lines on hover
  // Define a function to draw the lines between tiles
  const drawLines = (related) => {
    // Remove any existing lines
    svg.selectAll(".connection-line").remove();

    related.forEach((rel) => {
      const goalTile = svg.select(`rect[data-goal='${rel.goal}']`);
      const commitmentTile = svg.select(
        `rect[data-commitment='${rel.commitment_txt}']`
      );
      const pillarTile = svg.select(`rect[data-pillar='${rel.pillar}']`);

      // Get the center positions of the goal, commitment, and pillar tiles
      const goalX = +goalTile.attr("x") + (tileSize * offsetGoals) / 2;
      const goalY = +goalTile.attr("y") + tileSize / 2;
      const commitmentX = +commitmentTile.attr("x") + tileSize / 2;
      const commitmentY = +commitmentTile.attr("y") + tileSize / 2;
      const pillarX = +pillarTile.attr("x") + (tileSize * offsetGoals) / 2;
      const pillarY = +pillarTile.attr("y") + tileSize / 2;

      // Draw line from goal to commitment
      svg
        .append("line")
        .attr("class", "connection-line")
        .attr("x1", goalX)
        .attr("y1", goalY)
        .attr("x2", commitmentX)
        .attr("y2", commitmentY)
        .attr("stroke", "#ccc")
        .attr("opacity", ".2")
        .attr("pointer-events", "none")
        .attr("stroke-width", 2);

      // Draw line from commitment to pillar
      svg
        .append("line")
        .attr("class", "connection-line")
        .attr("x1", commitmentX)
        .attr("y1", commitmentY)
        .attr("x2", pillarX)
        .attr("y2", pillarY)
        .attr("stroke", "#ccc")
        .attr("opacity", ".2")
        .attr("pointer-events", "none")
        .attr("stroke-width", 2);
    });
  };

  // Update the opacity function to draw lines on hover
  const updateOpacity = (related, reset = false) => {
    if (reset) {
      svg.selectAll("rect").attr("opacity", 1); // Reset opacity for all
      svg.selectAll(".connection-line").remove(); // Remove all lines
    } else {
      svg.selectAll("rect").attr("opacity", 0.2); // Dim all tiles
      drawLines(related); // Draw lines between related tiles
      related.forEach((rel) => {
        svg.selectAll(`rect[data-goal='${rel.goal}']`).attr("opacity", 1);
        svg
          .selectAll(`rect[data-commitment='${rel.commitment_txt}']`)
          .attr("opacity", 1);
        svg.selectAll(`rect[data-pillar='${rel.pillar}']`).attr("opacity", 1);
      });
    }
  };

  // Helper function to return related tiles based on hovered data
  const getRelatedTiles = (hovered, type) => {
    if (type === "goal") {
      return data.filter((d) => d.goal === hovered);
    } else if (type === "commitment") {
      return data.filter((d) => d.commitment_txt === hovered);
    } else if (type === "pillar") {
      return data.filter((d) => d.pillar === hovered);
    }
  };

  // // Function to set opacity based on relationships
  // const updateOpacity = (related, reset = false) => {
  //   if (reset) {
  //     svg.selectAll("rect").attr("opacity", 1); // Reset opacity for all
  //   } else {
  //     svg.selectAll("rect").attr("opacity", 0.2); // Dim all
  //     related.forEach((rel) => {
  //       svg.selectAll(`rect[data-goal='${rel.goal}']`).attr("opacity", 1);
  //       svg
  //         .selectAll(`rect[data-commitment='${rel.commitment_txt}']`)
  //         .attr("opacity", 1);
  //       svg.selectAll(`rect[data-pillar='${rel.pillar}']`).attr("opacity", 1);
  //     });
  //   }
  // };

  // Helper function to extract the last word from a string after the last space
  const getLastWord = (str) => str.split(" ").pop();

  var offsetGoals = commitments.length / goals.length;
  // console.log(offsetGoals);

  // Row 1: Goals
  svg
    .selectAll(".goal-tile")
    .data(goals)
    .enter()
    .append("a") // Append an <a> element to wrap the rect
    .attr("xlink:href", (d) => getGoalUrl(d)) // Set the href to the goal_url from dfi
    // .attr("target", "_blank") // Optional: Open the link in a new tab
    .append("rect") // Append the rect inside the <a>
    .attr("class", "goal-tile")
    .attr("x", (d, i) => i * tileSize * offsetGoals)
    .attr("y", tileSize / 2) // First row (y = 30 to leave space for header)
    .attr("width", tileSize * offsetGoals)
    .attr("height", tileSize)
    // .attr("fill", "#69b3a2")
    .attr("fill", "#fff")
    .attr("stroke", "#3c4099")
    .attr("stroke-width", "2px")
    .attr("opacity", 1)
    .attr("data-goal", (d) => d)
    .on("mouseover", function (event, d) {
      const related = getRelatedTiles(d, "goal");
      updateOpacity(related);
    })
    .on("mouseout", function () {
      updateOpacity(null, true); // Reset opacity on mouseout
    });

  // Row 2: Commitments
  svg
    .selectAll(".commitment-tile")
    .data(commitments)
    .enter()
    .append("rect")
    .attr("class", "commitment-tile")
    .attr("x", (d, i) => i * tileSize)
    .attr("y", tileSize * 2.5) // Second row (y = tileSize + 30)
    .attr("width", tileSize)
    .attr("height", tileSize)
    // .attr("fill", "#fff200")
    .attr("fill", "#ffffff00")
    .attr("stroke", "#fff")
    .attr("stroke-width", "3px")
    .attr("opacity", 1)
    .attr("data-commitment", (d) => d)
    .on("mouseover", function (event, d) {
      const related = getRelatedTiles(d, "commitment");
      updateOpacity(related);
    })
    .on("mouseout", function () {
      updateOpacity(null, true); // Reset opacity on mouseout
    });

  // Row 3: Pillars
  svg
    .selectAll(".pillar-tile")
    .data(pillars)
    .enter()
    .append("rect")
    .attr("class", "pillar-tile")
    .attr("x", (d, i) => i * tileSize * offsetGoals)
    .attr("y", tileSize * 4.5) // Third row (y = tileSize * 2 + 30)
    .attr("width", tileSize * offsetGoals)
    .attr("height", tileSize)
    // .attr("fill", "#ff6347")
    .attr("fill", "#ffffff00")
    .attr("stroke", "#fff")
    .attr("stroke-width", "3px")
    .attr("opacity", 1)
    .attr("data-pillar", (d) => d)
    .on("mouseover", function (event, d) {
      const related = getRelatedTiles(d, "pillar");
      updateOpacity(related);
    })
    .on("mouseout", function () {
      updateOpacity(null, true); // Reset opacity on mouseout
    });

  // Add row headers: 'Goals', 'Commitments', 'Pillars'
  svg
    .append("text")
    .attr("x", 0)
    .attr("y", tileSize * 0.25)
    .attr("class", "header-label")
    .text("Goals")
    .attr("fill", "#fff")
    .attr("font-weight", "bold")
    .attr("font-size", "16px");

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", tileSize * 2.25) // Position above second row
    .attr("class", "header-label")
    .text("Commitments")
    .attr("fill", "#fff")
    .attr("font-weight", "bold")
    .attr("font-size", "16px");

  svg
    .append("text")
    .attr("x", 0)
    .attr("y", tileSize * 4.25) // Position above third row
    .attr("class", "header-label")
    .text("Pillars")
    .attr("fill", "#fff")
    .attr("font-weight", "bold")
    .attr("font-size", "16px");

  // Add labels for goals, commitments, and pillars with the last word (number or capital letter)
  svg
    .selectAll(".goal-label")
    .data(goals)
    .enter()
    .append("text")
    .attr(
      "x",
      (d, i) => i * tileSize * offsetGoals + (tileSize * offsetGoals) / 2
    )
    .attr("y", tileSize * 1.1)
    .attr("fill", "#3c4099")
    .attr("font-weight", "bold")
    .attr("class", "goal-label")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text((d) => getLastWord(d));

  svg
    .selectAll(".commitment-label")
    .data(commitments)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * tileSize + tileSize / 2)
    .attr("y", tileSize * 3.1)
    // .attr("fill", "#3c4099")
    .attr("fill", "#fff")
    .attr("font-weight", "bold")
    .attr("class", "commitment-label")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text((d) => getLastWord(d));

  svg
    .selectAll(".pillar-label")
    .data(pillars)
    .enter()
    .append("text")
    .attr(
      "x",
      (d, i) => i * tileSize * offsetGoals + (tileSize * offsetGoals) / 2
    )
    .attr("y", tileSize * 5.1)
    // .attr("fill", "#3c4099")
    .attr("fill", "#fff")
    .attr("font-weight", "bold")
    .attr("class", "pillar-label")
    .attr("text-anchor", "middle")
    .attr("pointer-events", "none")
    .text((d) => getLastWord(d));
}
