
function makeResponsive(){

  const svgArea = d3.select('body').select('svg');

  if(!svgArea.empty()){
    svgArea.remove();
  }
  
  Height = 600;
  Width = 800;

  const svg = d3.select('#scattersvg')
  .append('svg')
  .attr('height', Height)
  .attr('width', Width);

 const margin ={left:100, top:100, right:50, bottom:300};
 const chartWidth = Height - margin.left - margin.right;
 const chartHeight = Width - margin.top - margin.bottom;
 const circleRadius = 8;
 const xAxisLabel='Household income($)';
 const yAxisLabel ='Healthcare(%)';
 const title = 'Household income vs Healthcare Access';


 const group = svg.append('g')
 .attr('transform', `translate(${margin.left},${margin.top})`);

//Load Data in
 d3.json('/census_data').then(censusData =>{
  censusData.forEach(d => {
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
    d.income = +d.income;
    d.obesity = +d.obesity;
  });
  console.log(censusData);

  //Set x and y linear scales 
  const xValue = d => d.income;
  const yValue = d => d.healthcare;

 
  
const yScale = d3.scaleLinear()
.domain(d3.extent(censusData, yValue))
.range([chartHeight, 0]);

const yAxis = d3.axisLeft(yScale)
//.tickSize(-innerWidth);

const xScale = d3.scaleLinear()
.domain(d3.extent(censusData, xValue))
.range([0, chartWidth + 200 ] );

const xAxis = d3.axisBottom(xScale)
.tickFormat(d3.format('.2s'))
//.tickSize(-innerHeight);

  const xAxisGroup= group.append('g')
  .call(xAxis)
  .attr('transform', `translate(0,${chartHeight})`);

 const yAxisGroup = group.append('g')
  .call(yAxis)

  xAxisGroup.append('text')
  .attr('class','axis-label')
  .attr('x', chartWidth / 2 +margin.top )
  .attr('y', 50)
  .attr('fill','black')
  .text(xAxisLabel);

  yAxisGroup.append('text')
  .attr('x', -chartHeight / 2 )
  .attr('y', -53)
  .attr('text-anchor','middle')
  .attr('class','axis-label')
  .attr('fill', 'black')
  .attr('transform', `rotate(-90)`)
  .text(yAxisLabel);

  group.append('text')
  .attr('class', 'title')
  .attr('y',-10)
  .text(title);
  
  let circlesGroup = group.selectAll('circle')
  .data(censusData)
  .enter()
  .append('circle')
  .attr('class', 'circleG')
  .attr('fill', 'steelblue')
  .attr('cy', d=> yScale(yValue(d)))
  .attr('cx', d=> xScale(xValue(d)))
  .attr('r', circleRadius);
  
  var circletext = group.selectAll('.stateText')
  .data(censusData)
  .enter()
  .append('text')
  .attr('x', d => xScale(xValue(d)))
  .attr('y', d => yScale(yValue(d)))
  .attr('text-anchor', 'middle')
  .text(function (d) { return d.abbr })
  .classed('stateText', true)
  .attr('font-size', '8px');

/* Initialize tooltip */
var tip = d3.tip()
.attr('class', 'd3-tip')
.html(function (d) { return `${d.state} <br> Income: $${d.income} <br> Lacks Healthcare: ${d.healthcare}%`});

/* Invoke the tip in the context of your visualization */
circlesGroup.call(tip)
.on("mouseover", tip.show)
.on("mouseout", tip.hide);

});

}

makeResponsive();

// Event listener for window resize.
d3.select(window).on("resize", makeResponsive);