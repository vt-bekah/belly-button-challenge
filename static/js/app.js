const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Console log promise for debug purposes
const dataPromise = d3.json(url)
console.log("Data Promise: ", dataPromise)

// Fetch the JSON data and console log it for debug purposes
d3.json(url).then(function(data) {
  console.log("data", data)
})

// Store the drop down menu location for future use across functions
let dropdownMenu = d3.select("#selDataset")

// ## Function to initialize the page with a default plot
function init() {

  d3.json(url).then(function(data) {

    // Update the dropdown menu based on the data
    // Store the subject IDs in a list (console log for debug)
    let dropdownList = data.names
    console.log("DD List: ", dropdownList)
    // Add the dropdown list to the menu by appending each one
    dropdownList.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id)
    })

    // Read the current dropdown value in
    let startSample = dropdownMenu.property("value")
    console.log("starting sample", startSample)

    // Grab all the chart data
    let sampleDataAll = data.samples
    // Filter the data based on the sample input
    let sampleData = sampleDataAll.filter(dData => dData.id == startSample)[0]
    // Set variables to contain the arrays required to create the chart information (console log for debug)
    let sampleValues = sampleData.sample_values
    console.log("starting chart data:", sampleValues)
    let otuIDs = sampleData.otu_ids
    console.log("starting chart IDs:", otuIDs)
    let otuLabels = sampleData.otu_labels
    console.log("starting chart labels:", otuLabels)

    // Build initial charts using defined functions
    buildHBarChart(sampleValues, otuIDs, otuLabels)
    buildBubbleChart(sampleValues, otuIDs, otuLabels)

    // Grab the initialization chart data (console log for debug)
    let sampleZero = data.metadata[0].id
    console.log("sample zero", sampleZero)

    buildDemographics(sampleZero)
  })
}

// Captures a change in dropdown and updates charts and tables
d3.selectAll("#selDataset").on("change", updateChartsTable)

// ## Function to update the charts based on value change in dropdown menu
function updateChartsTable() {

  // Assign the value of the dropdown menu option to a variable
  let newSample = dropdownMenu.property("value")
  console.log("new sample", newSample)

  // Get the new sample data & update the charts
  d3.json(url).then(function(data) {
    // Grab all the new chart data
    let sampleDataAll = data.samples
    // Filter the data based on the new sample input
    let sampleData = sampleDataAll.filter(dData => dData.id == newSample)[0]
    // Set variables to contain the arrays required to create the chart information (console log for debug)
    let sampleValues = sampleData.sample_values
    console.log("new chart data:", sampleValues)
    let otuIDs = sampleData.otu_ids
    console.log("new chart IDs:", otuIDs)
    let otuLabels = sampleData.otu_labels
    console.log("new chart labels:", otuLabels)

    // Update bar chart with new data using restyle
    Plotly.restyle("bar", "x", [sampleValues.slice(0,10).reverse()])
    Plotly.restyle("bar", "y", [otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse()])
    Plotly.restyle("bar", "text", [otuLabels.slice(0,10).reverse()])
    // Update bubble chart with new data using restyle
    Plotly.restyle("bubble", "x", [otuIDs])
    Plotly.restyle("bubble", "y", [sampleValues])
    Plotly.restyle("bubble", "text", [otuLabels])
  })

  // Delete old demographics info and populate new
  let demoBody = d3.select("#sample-metadata")
  demoBody.selectAll("p").remove()
  buildDemographics(newSample)
}

// ## Function to build the horizontal bar chart
function buildHBarChart(sampleValues, otuIDs, otuLabels) {
  
  // set the chart trace data
  barData = [{
    x: sampleValues.slice(0,10).reverse(),
    y: otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse(),
    text: otuLabels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
  }]
  
  // set layout for bubble chart
  let layout = {
    title: "Top Ten Bacteria",
    xaxis:{title: "Count of Bacteria"}
  }
  
  // plot in the designated spot in index.html
  Plotly.newPlot("bar", barData, layout)
}

// ## Function to build the bubble chart
function buildBubbleChart(sampleValues, otuIDs, otuLabels) {
  
  d3.json(url).then(function(data) {
    
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
    }]
    
    // set layout for bubble chart
    let layout = {
      title: "All Bacteria by ID",
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Count of Bacteria"}
    }

    // plot in the designated spot in index.html
    Plotly.newPlot("bubble", bubbleData, layout)
  })
}

// ## Function to build the demographic info box
function buildDemographics(sample) {
  
  d3.json(url).then(function(data) {
    
    // Grab the demographic info data
    let demoDataAll = data.metadata
    // filter the data for the specific sample (console log for debug)
    let demographicData = demoDataAll.filter(dData => dData.id == sample)[0]
    console.log("demographic info:", demographicData)
    // Create an array of the keys and values (console log for debug)
    let demoLabels = Object.keys(demographicData)
    let demoData = Object.values(demographicData)
    console.log("demo labels:", demoLabels)
    console.log("demo data:", demoData)

    // add data under Demographic info h3
    let demoBody = d3.select("#sample-metadata")
    
    for (i=0; i < demoLabels.length; i++){
        // Append one item per label and data combo
        // I chose paragraph to have spacing between each (vs. body) without idention (vs. unordered list)
        demoBody.append("p").text(`${demoLabels[i]}: ${demoData[i]}`)
    }

  })
}

init()

