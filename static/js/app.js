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

    // Grab data for charts
    let sampleValues = data.samples.map(value => value.sample_values)[0]
    console.log("bar chart data: )", sampleValues)
    let otuIDs = data.samples.map(value => value.otu_ids)[0]
    console.log("bar chart labels: )", otuIDs)
    let outLabels = data.samples.map(value => value.otu_labels)[0]
    console.log("bar chart hover: )", outLabels)
    
    // Grab the demographic data
    let demographicData = data.metadata[0]
    console.log("demographic info: )", demographicData)

  })
}

init()

