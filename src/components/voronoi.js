import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function voronoi(data, { width } = {}) {
  // from https://observablehq.com/@aaronbrezel/firers-network-simplified
  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));

  //Tooltip format lifted (which much thanks) from https://observablehq.com/@muqeet/artsed-bubble
  const toolTip = d3
    .select("body")
    .selectAll("div.tool-tip")
    .data([1])
    .join("div")
    .attr("class", "tool-tip")
    .style("opacity", 0);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .distance(forceVariables.nodeDistance)
        .id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(forceVariables.chargeStr))
    .force(
      "collide",
      d3.forceCollide((d) => getRadius(d.group))
    ) //sets the collision points of the various nodes
    .force("center", d3.forceCenter(width / 2, height / 2)) //centers the diagram in the middle of the svg
    .force(
      "x",
      d3.forceX(width / forceVariables.xDenom).strength(forceVariables.xStr)
    )
    .force(
      "y",
      d3.forceY(height * forceVariables.yDenom).strength(forceVariables.yStr)
    );

  const svg = d3.select(DOM.svg(width, height)); //creates the svg canvas that all groups, nodes and links will sit on

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 4);

  const g = svg.append("g");

  const defs = svg
    .append("defs")
    .selectAll("clipPath")
    .data(groupData)
    .join("clipPath")
    .attr("id", (d) => d.name + "-clip")
    .append("circle")
    .attr("r", (d) => forceVariables.nodeRadius * d.radius - 2);

  const node = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("data-name", function (d) {
      let id = d.id;
      if (id == "G & G Property Investments") {
        id = id.split("&").join("");
      }
      id = id.split(" ").join("");
      return id;
    })
    .attr("fill", "none")
    .on("mouseover", function (d) {
      toolTip.style("opacity", 1);

      if (d.level == 3 || d.level == 2) {
        //Make ever node finger point except oleg since he's not interactable
        d3.select(this).style("cursor", "pointer");
      }
    })
    .on("mouseout", function (d) {
      toolTip.transition().duration(500).style("opacity", 0);

      webIt(d, "out", nodes, link); //add css to illustrate all the connections
      d3.select(this)
        .style("stroke", "") //#72798C this is one of the Net Element Colors if we want to use it
        .style("stroke-opacity", "")
        .style("stroke-width", "");
    })
    .on("touchmove mousemove", function (d) {
      buildToolTip(d, "node", toolTip);

      webIt(d, "in", node, link);

      // d3.select(this)
      //   .style('stroke', "#18aef9") //#72798C this is one of the Net Element Colors if we want to use it
      //   .style("stroke-opacity", 1)
      //   .style("stroke-width", 6);
    })
    .on("click", function (d) {
      d.fx = null;
      d.fy = null;
    })
    .call(drag(simulation));

  const cir = node
    .append("circle")
    .attr("id", (d) => idCompress(d.id))
    .attr("r", (d) => getRadius(d.group))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("fill", "#999");

  const img = node
    .append("image")
    .attr("xlink:href", function (d) {
      let img;
      if (d.group == "criminal") {
        img =
          "https://media.miamiherald.com/static/media/projects/2019/yang-interactive/GenderlessIcon.74c2fa61.jpg";
      }
      if (d.group == "Firer") {
        img =
          "https://upload.wikimedia.org/wikipedia/commons/3/3f/Oleg_Firer_2017.jpg";
      }
      return img;
    })
    .attr("clip-path", (d) => `url(#${d.group}-clip)`)
    .attr("width", (d) => getRadius(d.group) * 2)
    .attr("height", (d) => getRadius(d.group) * 2)
    .attr("x", (d) => getRadius(d.group) * -1)
    .attr("y", (d) => getRadius(d.group) * -1)
    .on("mouseover", function (d) {
      let id = "#" + idCompress(d.id);
      console.log(id);
      d3.select(id)
        .style("stroke", "#18aef9")
        .style("stroke-width", 6)
        .style("stroke-opacity", 1);
    })
    .on("mouseout", function (d) {
      let id = "#" + idCompress(d.id);

      d3.select(id)
        .style("stroke", "#fff")
        .style("stroke-width", 1.5)
        .style("stroke-opacity", 1);
    });

  //   //add the mouseover functionality for the links: make tooltips and highlight links and nodes
  link
    .on("mouseover", function (d) {
      toolTip.style("opacity", 1);
    })
    .on("mouseout", function (d) {
      toolTip.transition().duration(500).style("opacity", 0);

      d3.select(this)
        .style("stroke", "#999")
        .style("stroke-width", 4)
        .style("stroke-opacity", 0.6);

      let source_id = idCompress(d.source.id);
      let target_id = idCompress(d.target.id);

      d3.select(`#${source_id}`)
        .style("stroke", "#fff")
        .style("stroke-width", "1.5");

      d3.select(`#${target_id}`)
        .style("stroke", "#fff")
        .style("stroke-width", "1.5");
    })
    .on("mousemove", function (d) {
      buildToolTip(d, "link", toolTip); //runs the function to create the tooltip every time the mouse moves, this allows the tooltip to follow the mouse as it moves

      d3.select(this)
        .style("stroke", "#18aef9") //#72798C this is one of the Net Element Colors if we want to use it
        .style("stroke-opacity", 1)
        .style("stroke-width", 6);

      let source_id = idCompress(d.source.id);
      let target_id = idCompress(d.target.id);

      d3.select(`#${source_id}`)
        .style("stroke", "#18aef9")
        .style("stroke-width", 6);

      d3.select(`#${target_id}`)
        .style("stroke", "#18aef9")
        .style("stroke-width", 6);
    });

  let firer = node.filter((d) => d.group == "Firer").datum();
  //   let bgirls = node.filter(d => d.id == "Bar Girls scam").datum()
  //   let office = node.filter(d => d.id == "Firer Office").datum()
  //   let grenada = node.filter(d => d.id == "Grenada").datum()
  //   let house = node.filter(d => d.id == "Wolf House").datum()

  simulation.on("tick", () => {
    // let radius = 10
    // node.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
    //     .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
    node.attr("transform", function (d) {
      d.x = Math.max(
        getRadius(d.group),
        Math.min(width - getRadius(d.group), d.x)
      );
      d.y = Math.max(
        getRadius(d.group),
        Math.min(height - getRadius(d.group), d.y)
      );
      return `translate(${d.x},${d.y})`;
    });

    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    firer.fy = height / 2;
    firer.fx = width / 2;
  });

  invalidation.then(() => simulation.stop());

  return svg.node();
}
