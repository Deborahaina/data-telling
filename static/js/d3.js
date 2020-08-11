

function makeResponsive(){

  const svgArea = d3.select('body').select('svg');

  if(!svgArea.empty()){
    svgArea.remove();
  }
  
  Height = 500;
  Width = 800;

  const svg = d3.select('#scatter')
  .append('svg')
  .attr('height', Height)
  .attr('width', Width);

 const margin ={
   left:50,
   top:30,
   right:50,
   bottom:400
 }
 const chartWidth = Height - margin.left - margin.right;
 const chartHeight = Width - margin.top - margin.bottom;
 const textPaddingL = 40;
 const textPaddingB = 40;

 const group = svg.append('g')
 .attr('transform', `translate(${margin.left},${margin.top})`);

//Load Data in
 d3.csv('assets/data/data.csv').then(censusData =>{
  censusData.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });
  console.log(censusData);

  //Set x and y linear scales 
  const xValue = d => d.poverty;
  const yValue = d => d.healthcare;
 
  const xScale = d3.scaleLinear()
  .domain([8, d3.max(censusData, xValue )])
  .range([0, chartWidth]);
 
  const yScale = d3.scaleLinear()
  .domain([2, d3.max(censusData, yValue)])
  .range([chartHeight, 0]);
  console.log(yScale.domain());


  const xAxis = d3.axisBottom(xScale)
  .tickSize(-innerHeight);
  const yAxis = d3.axisLeft(yScale)
  .tickSize(-chartWidth);

  group.append('g')
  .call(xAxis)
  .attr('transform', `translate(0,${chartHeight})`);

  group.append('g')
  .call(yAxis)


  const circlesGroup = group.selectAll('circle')
  .data(censusData)
  .enter()
  .append('circle')
  .attr('r', 9)
  .attr('cx', d => xScale(xValue(d)))
  .attr('cy', d=> yScale(yValue(d)))
  .attr('fill', 'steelblue')
  .classed('stateCircle', true)
  .attr('opacity', 0.8);

  var circletext = group
  .selectAll('.stateText')
  .data(censusData)
  .enter()
  .append('text')
  .attr('x', d => xScale(xValue(d)))
  .attr('y', d => yScale(yValue(d)))
  .attr('text-anchor', 'middle')
  .text(function (d) { return d.abbr })
  .attr('fill','white')
  .classed('stateText', true)
  .attr('font-size', '8px');

  // Text for x-axis
group.append("text")
.attr("transform", "translate(" + (chartWidth/2) + ", " + (chartHeight + margin.top + 20) + ")")
.attr("class", "aText")
.style("text-anchor", "middle")
.text("People Living In Poverty (%)")
.attr("fill", "black");


});

}





makeResponsive();