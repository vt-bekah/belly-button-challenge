const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log("data", data);
});

// Initializes the page with a default plot using d3
function init() {
  
  // Select the dropdown Menu
  let dropdownMenu = d3.select("#selDataset");
  
  d3.json(url).then(function(data) {
    
    // Store the subject IDs in a list (console log for debug)
    let dropdownList = data.names
    console.log("DD List: ", dropdownList)
    // Add the dropdown list to the menu by appending each one
    dropdownList.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id)
    })

    // // Grab the chart data
    // let sampleValues = data.samples.map(value => value.sample_values)[0]
    // console.log("bar chart data: )", sampleValues)
    // let otuIDs = data.samples.map(value => value.otu_ids)[0]
    // console.log("bar chart labels: )", otuIDs)
    // let outLabels = data.samples.map(value => value.otu_labels)[0]
    // console.log("bar chart hover: )", outLabels)
    
    // // Grab the demographic data
    // let demographicData = data.metadata[0]
    // console.log("demographic info: )", demographicData)

  })
}

// Build the horizontal bar chart
function buildHBarChart(sample) {
  
  d3.json(url).then(function(data) {
  
      // Grab the chart data

      let sampleData = data.samples[0]

      let sampleValues = sampleData.sample_values
      console.log("bar chart data: )", sampleValues)
      let otuIDs = sampleData.otu_ids
      console.log("bar chart labels: )", otuIDs)
      let otuLabels = sampleData.otu_labels
      console.log("bar chart hover: )", otuLabels)
      
      barData = [{
        x: sampleValues.slice(0,10).reverse(),
        y: otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }];
    
      Plotly.newPlot("bar", barData);
  
    })
}

// Build the bubble chart
function buildHBubbleChart(sample) {
  
  d3.json(url).then(function(data) {
  
      // Grab the chart data

      let sampleData = data.samples[0]

      let sampleValues = sampleData.sample_values
      console.log("bar chart data: )", sampleValues)
      let otuIDs = sampleData.otu_ids
      console.log("bar chart labels: )", otuIDs)
      let otuLabels = sampleData.otu_labels
      console.log("bar chart hover: )", otuLabels)
      
      bubbleData = [{
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIDs,
          colorscale: "Earth"
        }
      }];
    
      Plotly.newPlot("bubble", bubbleData);
  
  })
}

init()
buildHBarChart()
buildHBubbleChart()

