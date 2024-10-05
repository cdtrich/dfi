import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function dendro(data, { width } = {}) {
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  // Group data by unique goals, and map them to the corresponding commitments and pillars
  const goalMap = new Map();

  data.forEach((d) => {
    if (!goalMap.has(d.goal)) {
      goalMap.set(d.goal, { id: `Goal ${d.goal}`, children: [] });
    }
    goalMap.get(d.goal).children.push({
      id: d.commitment_txt,
      parentPillar: d.pillar,
    });
  });

  // Construct the hierarchy for the tree
  const hierarchyData = {
    id: "DFI",
    children: Array.from(
      d3.group(data, (d) => d.pillar),
      ([pillar, commitments]) => ({
        id: pillar,
        children: Array.from(
          d3.group(commitments, (d) => d.commitment_txt),
          ([commitment, goals]) => ({
            id: commitment,
            children: goals.map((g) => ({
              id: `Goal ${g.goal}`, // reference the goal node
            })),
          })
        ),
      })
    ),
  };

  // Use the hierarchical layout with deduplication of goal nodes
  const root = d3
    .hierarchy(hierarchyData)
    .sort((a, b) => d3.ascending(a.data.id, b.data.id));

  const tree = d3.tree().size([2 * Math.PI, 300])(root); // Radial layout with a fixed radius

  // Convert radial coordinates to Cartesian
  const nodes = tree.descendants().map((d) => {
    const angle = d.x - Math.PI / 2; // Adjust for the top-start position
    const radius = d.y;
    return {
      id: d.data.id,
      group:
        d.depth === 0
          ? "root"
          : d.depth === 1
          ? "pillar"
          : d.depth === 2
          ? "commitment"
          : "goal",
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    };
  });

  const links = tree.links().map((link) => {
    const source = nodes.find((n) => n.id === link.source.data.id);
    const target = nodes.find((n) => n.id === link.target.data.id);
    return {
      source: link.source.data.id,
      target: link.target.data.id,
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
    };
  });

  // Remove duplicate nodes in the outer ring (goal layer)
  const uniqueGoals = new Map();
  nodes.forEach((node) => {
    if (node.group === "goal") {
      uniqueGoals.set(node.id, node);
    }
  });

  // console.log(links);
  // console.log(nodes);

  return Plot.plot({
    width: 800,
    height: 800,
    marks: [
      // Add links between nodes
      Plot.link(links, {
        x1: "x1",
        y1: "y1",
        x2: "x2",
        y2: "y2",
        stroke: "white",
        opacity: 0.2,
      }),
      // Add nodes with labels
      // Plot.text(nodes, {
      //   x: "x",
      //   y: "y",
      //   text: "id",
      //   fill: "group",
      //   textAnchor: "middle",
      //   dy: 5,
      // }),
    ],
    x: { domain: [-350, 350], axis: null },
    y: { domain: [-350, 350], axis: null },
  });
}
