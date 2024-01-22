// Create a function to initialize the dashboard - init()
function init() {
    //Use D3 to select the dropdown menu (Test Subject ID No.: - "#selDataset")
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector - Fetch the JSON data
    d3.json("samples.json").then((data) => {
        console.log(data);
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdownMenu
                .append("option")
                .text(id)
                .property("value", id);        
            });
        //Set the first sample from the list
        let sample_one = names[0];

        // Build initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);
    });
};    

// Use the just created function init() to initialize the dashboard
init();

//Function that populates metadata info (Demographic Info - "#sample-metadata" )

function buildMetadata(sample) {

    //Use D3 to retrieve all of the data
    d3.json("samples.json").then((data) => {

        // store the data in a variable
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array metadata after filtered
        console.log(value)

        // Get the 1st index from the array
        let valueData = value[0];

        //Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key, value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);

        });

    }); 
};


// Function to build the bar chart
function buildBarChart(sample) {
    
    //Use D3 to get the data
    d3.json("samples.json").then((data) => {

         // store the data in a variable
         let sampleInfo = data.samples;

         // Filter based on the value of the sample
         let value = sampleInfo.filter(result => result.id == sample);
 
         // Get the 1st index from the array
         let valueData = value[0];

         // Get the otu_ids, lables, and sample values
         let otu_ids = valueData.otu_ids;
         let otu_labels = valueData.otu_labels;
         let sample_values = valueData.sample_values;

         // Log the data to the console
         console.log(otu_ids,otu_labels,sample_values);

         // Set top 10 items to display in descending order
         let ythicks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
         let xthicks = sample_values.slice(0,10).reverse();
         let labels = otu_labels.slice(0,10).reverse();

         //Set up the trace for the bar chart
        let trace = {
            x: xthicks,
            y: ythicks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        //Set up the layout

        let layout ={
            title: "Top 10 OTUs Found"
        };

        //Use Plotly to plot the chart
        Plotly.newPlot('bar', [trace], layout);

    });
};



// Function to build the bubble chart

function buildBubbleChart(sample) {

     //Use D3 to get the data
    d3.json("samples.json").then((data) => {

        // store the data in a variable
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the 1st index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        //Set up the trace for the bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        //Set up the layout

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        //Use Plotly to plot the chart
        Plotly.newPlot('bubble', [trace1], layout);

        console.log(layout);
    });
};


// Create the function "optionChanged" that updates dashboard when sample is changed - 
// This is the same function used in the index.html (line 25) 

function optionChanged(value) {
    console.log(value);

    // Call all the functions
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);

};
