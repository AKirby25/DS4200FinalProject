// Load the data
d3.csv('https://raw.githubusercontent.com/AKirby25/project/main/nfldata/Game_Logs_Quarterback.csv').then(function(data) {
    data.forEach(function(d) {
        d["Yards Per Carry"] = +d["Yards Per Carry"];
    });

    // Aggregate data by "Outcome", T, W, or L and compute average "Yards Per Carry" for each
    aggregatedData = d3.rollups(data, 
                                v => d3.mean(v, d => d["Yards Per Carry"]), 
                                d => d["Outcome"])
                        .map(([key, value]) => ({ "Outcome": key, "Average Yards Per Carry": value }));

    // Define the dimensions and margins for the SVG
    margin = {top: 40, right: 30, bottom: 50, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    // x-axis
    x = d3.scaleBand()
            .range([0, width])
            .domain(aggregatedData.map(d => d["Outcome"]))
            .padding(0.2);
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x))
       .append("text")
       .attr("class", "axis-label")
       .attr("x", width / 2)
       .attr("y", margin.bottom - 5)
       .style("text-anchor", "middle")
       .text("Outcome");

    // y-axis
    y = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d["Average Yards Per Carry"])])
            .range([height, 0]);
    svg.append("g")
       .call(d3.axisLeft(y))
       .append("text")
       .attr("class", "axis-label")
       .attr("transform", "rotate(-90)")
       .attr("y", -margin.left + 20)
       .attr("x", -height / 2)
       .attr("dy", "1em")
       .style("text-anchor", "middle")
       .text("Average Yards Per Carry");

    // Graph title
    svg.append("text")
       .attr("class", "chart-title")
       .attr("x", width / 2)
       .attr("y", -margin.top / 2)
       .attr("text-anchor", "middle")
       .style("font-size", "16px")
       .style("font-weight", "bold")
       .text("Average QB Yards Per Carry by Game Outcome");

    // Bars with conditional color
    svg.selectAll(".bar")
       .data(aggregatedData)
       .join("rect")
       .attr("class", "bar")
       .attr("x", d => x(d["Outcome"]))
       .attr("y", d => y(d["Average Yards Per Carry"]))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d["Average Yards Per Carry"]))
       .attr("fill", d => {
           switch(d["Outcome"]) {
               case "W": return "#4CAF50";
               case "L": return "#F44336";
               case "T": return "#FFC107"; 
           }
       });

    // x-axis label
    svg.append('text')
        .attr('transform', 'translate(' + (width / 2) + ' ,' + (height + margin.top + 10) + ')')
        .style('text-anchor', 'middle')
        .text('Game Outcome');


    // y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('dy', '1em')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .style('text-anchor', 'middle')
        .text('Average QB Yards Per Carry');
});
