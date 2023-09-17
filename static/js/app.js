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

    // Grab the initialization chart data
    let sampleZero = data.metadata[0].id
    console.log("sample zero", sampleZero)

    // Build initial charts using defined functions
    buildHBarChart(sampleZero)
    buildHBubbleChart(sampleZero)
    buildDemographics(sampleZero)

  })
}

// Captures a change in dropdown and updates charts and tables
d3.selectAll("#selDataset").on("change", updateChartsTable);

// Update the restyled plot's values
function updateChartsTable() {
  // Use D3 to select the dropdown menu
  let ddMenu = d3.select("#selDataset")
  // Assign the value of the dropdown menu option to a variable
  let newSample = ddMenu.property("value")
  console.log("new sample", newSample)

  // Update charts 
  // Plotly.restyle("bar", "values", [newSample])
  // Plotly.restyle("bubble", "values", [newSample])
  buildHBarChart(newSample)
  buildHBubbleChart(newSample)

  // Delete old demographics info and populate new
  let demoBody = d3.select('#sample-metadata')
  demoBody.selectAll("p").remove()
  buildDemographics(newSample)
}

// Build the horizontal bar chart
function buildHBarChart(sample) {
  
  d3.json(url).then(function(data) {
  
      // Grab all the chart data
      let sampleDataAll = data.samples
      // Grab the chart data
      let sampleData = sampleDataAll.filter(dData => dData.id == sample)[0]

      let sampleValues = sampleData.sample_values
      console.log("bar chart data: )", sampleValues)
      let otuIDs = sampleData.otu_ids
      console.log("bar chart labels: )", otuIDs)
      let otuLabels = sampleData.otu_labels
      console.log("bar chart hover: )", otuLabels)
      
      // set the chart trace data
      barData = [{
        x: sampleValues.slice(0,10).reverse(),
        y: otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse(),
        text: otuLabels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }];
      
      // plot in the designated spot in index.html
      Plotly.newPlot("bar", barData);
  
    })
}

// Build the bubble chart
function buildHBubbleChart(sample) {
  
  d3.json(url).then(function(data) {

      // Grab all the chart data
      let sampleDataAll = data.samples
      // Grab the chart data
      let sampleData = sampleDataAll.filter(dData => dData.id == sample)[0]

      let sampleValues = sampleData.sample_values
      console.log("bubble chart data: )", sampleValues)
      let otuIDs = sampleData.otu_ids
      console.log("bubble chart labels: )", otuIDs)
      let otuLabels = sampleData.otu_labels
      console.log("bubble chart hover: )", otuLabels)
      
      // set the chart trace data
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
    
      // plot in the designated spot in index.html
      Plotly.newPlot("bubble", bubbleData);
  
  })
}

// Build the demographic info box
function buildDemographics(sample) {
  
  d3.json(url).then(function(data) {
    
      // Grab the demographic info data
      let demoDataAll = data.metadata
      // filter the data for the specific sample
      let demographicData = demoDataAll.filter(dData => dData.id == sample)[0]

      console.log("demographic info: )", demographicData)
      let demoLabels = Object.keys(demographicData)
      let demoData = Object.values(demographicData)
      console.log("demo labels", demoLabels)
      console.log("demo data", demoData)

      // add data under Demographic info h3
      let demoBody = d3.select('#sample-metadata')
      
      for (i=0; i < demoLabels.length; i++){
          // Append one itemper label and data combo
          // I chose paragraph to have spacing between each (vs. body) without idention (vs. list)
          demoBody.append("p").text(`${demoLabels[i]}: ${demoData[i]}`)
      }
  
  })
}

init()

