d3.csv("data/auto-mpg.csv").then(data => {
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", 800)
    .attr("height", 500);

  const margin = { top: 40, right: 40, bottom: 70, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  data.forEach(d => {
    d.weight = +d.weight;
    d.mpg = +d.mpg;
    d.car_name = d["car name"]; // tooltip
  });

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.weight))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.mpg))
    .range([height, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y));

  // X axis label
  svg.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + 40)
    .attr("text-anchor", "middle")
    .text("Car Weight (lbs)")
    .style("font-size", "14px");

  // Y axis label
  svg.append("text")
    .attr("transform", `rotate(-90)`)
    .attr("y", margin.left - 50)
    .attr("x", -(height / 2) - margin.top)
    .attr("text-anchor", "middle")
    .text("Fuel Efficiency (MPG)")
    .style("font-size", "14px");

  // Tooltip
  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("font-size", "13px")
    .style("display", "none");

  // points
  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.weight))
    .attr("cy", d => y(d.mpg))
    .attr("r", 4)
    .attr("fill", "#0077cc")
    .attr("opacity", 0.7)
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(`<strong>${d.car_name}</strong><br>MPG: ${d.mpg}<br>Weight: ${d.weight} lbs`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", event => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  // annotation
  const annotations = [
    {
      note: { label: "Heavier cars tend to have lower MPG" },
      x: x(4732), y: y(9), dy: -200, dx: -100
    }
  ];

  const makeAnnotations = d3.annotation().annotations(annotations);
  g.append("g").call(makeAnnotations);
});
