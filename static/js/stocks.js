
//Build the data tables
$(document).ready(function () {
  d3.json("/stocks_data").then((stock_data)=>{
    $('#summary-table').DataTable( {
      data: stock_data,
      columns: [
          { data: 'Ticker' },
          { data: 'Company' },
          { data: 'Closing_Price' },
          { data: 'Daily_Change' },
          { data: 'Percent_Change' },
          { data: 'Trade_Volume' },

      ] 
    })
  });
});

function handleSubmit(){
// Prevent the page from refreshing
d3.event.preventDefault();

// Select the input value from the form
var inputValue = d3.select("#stock-input").node().value;
console.log(inputValue);

// clear the input value
d3.select("#stock-input").node().value = "";

buildPlots(inputValue);
};

function buildPlots(n){
  d3.json("/stocks_data").then((stock_data) =>{
  console.log(stock_data);


  // Build the plot with the new stock
  let  name = stock_data.Company;
  let ticker = stock_data.Ticker;
  let closingPrices = stock_data.Closing_Price;
  var change = stock_data.Daily_Change;
  let volume = stock_data.Trade_Volume;
  var dates =  stock_data.fullDate;

  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: closingPrices,
    x: dates,
    y: closingPrices,
    line: {
      color: "#17BECF"
    }
  };

  var trace2 = {
    type: "scatter",
    mode: "lines",
    name: change,
    x: dates,
    y: change,
    line: {
      color: "#17BECF"
    }
  };

  var data = [trace1, trace2];

  var layout = {
    title: `Trending stock closing prices`,
    xaxis: {
      range: ['2020-07-29', '2020-09-29'],
      type: "date"
    },
    yaxis: {
      autorange: true,
      range: [0 , 2000],
      type: "linear"
    }
  };

  Plotly.newPlot("plot", data, layout);

  });

}

 

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
