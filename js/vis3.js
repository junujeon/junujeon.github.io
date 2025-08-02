d3.csv("data/auto-mpg.csv").then(data => {
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", 800)
    .attr("height", 500);

  const margin = { top: 40, right: 40, bottom: 70, left: 70 };
  const width  = 800 - margin.left - margin.right;
  const height = 500 - margin.top  - margin.bottom;

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // parse data
  data.forEach(d => {
    d.mpg  = +d.mpg;
    d.year = +d["model year"];
  });

  // compute average MPG by year
  const avgByYear = d3.rollups(
    data,
    v => d3.mean(v, d => d.mpg),
    d => d.year
  ).map(([year, mpg]) => ({ year, mpg }))
   .sort((a, b) => a.year - b.year);

  // scales
  const x = d3.scaleLinear()
    .domain(d3.extent(avgByYear, d => d.year))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([
      d3.min(avgByYear, d => d.mpg) - 1,
      d3.max(avgByYear, d => d.mpg) + 1
    ])
    .range([height, 0]);

  // axes
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d => "19" + d));
  g.append("g")
    .call(d3.axisLeft(y));

  // axis labels
  svg.append("text")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 40)
    .attr("text-anchor", "middle")
    .text("Model Year")
    .style("font-size", "14px");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 50)
    .attr("x", -(height/2) - margin.top)
    .attr("text-anchor", "middle")
    .text("Average MPG")
    .style("font-size", "14px");

  // line
  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.mpg));

  g.append("path")
    .datum(avgByYear)
    .attr("fill", "none")
    .attr("stroke", "#0077cc")
    .attr("stroke-width", 2)
    .attr("d", line);

  // points + tooltip
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

  g.selectAll("circle")
    .data(avgByYear)
    .enter()
    .append("circle")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.mpg))
      .attr("r", 4)
      .attr("fill", "darkorange")
    .on("mouseover", (event, d) => {
      tooltip
        .style("display", "block")
        .html(`<strong>Year:</strong> 19${d.year}<br><strong>Avg MPG:</strong> ${d.mpg.toFixed(2)}`)
        .style("left",  (event.pageX + 10) + "px")
        .style("top",   (event.pageY - 28) + "px");
    })
    .on("mousemove", event => {
      tooltip
        .style("left", (event.pageX + 10) + "px")
        .style("top",  (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  const annoData = [
    {
      note: {
        label: "Notice the MPG uptick after the 1970s oil crisis"
      },
      x: x(76),
      y: y(avgByYear.find(d => d.year === 76).mpg),
      dx: 30,
      dy: -30
    }
  ];

  const makeAnno = d3.annotation()
    .annotations(annoData);

  g.append("g")
    .attr("class", "annotation-group")
    .call(makeAnno);
});