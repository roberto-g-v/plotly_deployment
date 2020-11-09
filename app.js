// Read .json and append
d3.json("data/samples.json").then((data) => {
    var names = data.names;
    console.log(data.metadata);
    var option = d3.selectAll("#selDataset");
    Object.entries(names).forEach(([index,value]) => {
        option.append("option").text(value);
    })
})

// Create a function that plots the .json using function arrow
function Plot(nameID){
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;
        var samplesID = samples.map(row => row.id).indexOf(nameID);

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        var sampleValues = samples.map(row => row.sample_values);
        var sampleValues = sampleValues[samplesID].slice(0,10).reverse();
        var otuIds = samples.map(row => row.otu_ids);
        var otuIds = otuIds[samplesID].slice(0,10);
        var otuLabels = samples.map(row => row.otu_labels); 
        var otuLabels = otuLabels[samplesID].slice(0,10);
        var trace = {
            x: sampleValues,
            y: otuIds.map(r => `OTU ${r}`),
            text: otuLabels,
            type:"bar",
            orientation:"h"
        }
        //Plot the bar chart and tag id
        Plotly.newPlot("bar", [trace]);
  
//Create a bubble chart that displays each sample.
        var sampleValue = samples.map(row => row.sample_values);
        var sampleValue = sampleValue[samplesID];
        var otuId = samples.map(row => row.otu_ids);
        var otuId = otuId[samplesID];
        var otuLabel = samples.map(row => row.otu_labels); 
        var otuLabel = otuLabel[samplesID];
        var minId = d3.min(otuId);
        var maxId = d3.max(otuId);
        var mapNr = d3.scaleLinear().domain([minId, maxId]).range([0, 1]);
        var colors = otuId.map(val => d3.interpolateRgbBasis(["royalblue", "greenyellow", "goldenrod"])(mapNr(val)));
        var trace1 = {
            x: otuId,
            y: sampleValue,
            text: otuLabel,
            mode: "markers",
            marker: {
                color: colors,
                size: sampleValue.map(x => x*10),
                sizemode: "area"
            }
        };
        var bubbleLayout = {
            xaxis:{
                autochange: true,
                height: 600,
                width: 1000,
                title: {
                    text: "OTU ID"
                }
            },
        };
        //Plot the bubble chart and tag id
        Plotly.newPlot("bubble", [trace1], bubbleLayout);


// Make the gauge chart 
         var meta = data.metadata;
         var data1 = [
             {
                 domain: { x: [0, 1], y: [0, 1] },
                 value: meta[samplesID].wfreq,
                 title: { text: "Belly Button Washing Frequency" },
                 type: "indicator",
                 mode: "gauge+number",
                 gauge: { axis: { range: [null, 9] },
                 bar:{color: "orange"},
                    steps: [
                     { range: [0, 1], color: "rgba(248, 243, 236, 1)"},
                     { range: [1, 2], color: "rgba(244, 241, 228, 1)"},
                     { range: [2, 3], color: "rgba(233, 230, 201, 1)"},
                     { range: [3, 4], color: "rgba(229, 232, 176, 1)"},
                     { range: [4, 5], color: "rgba(213, 229, 153, 1)"},
                     { range: [5, 6], color: "rgba(183, 205, 143, 1)"},
                     { range: [6, 7], color: "rgba(138, 192, 134, 1)"},
                     { range: [7, 8], color: "rgba(136, 188, 141, 1)"},
                     { range: [8, 9], color: "rgba(132, 181, 136, 1)"}
                   ]}
             }
         ];
         
         var gaugeLayout = { width: 600, height: 500};
         //Display the gauge chart
         Plotly.newPlot("gauge", data1, gaugeLayout);

         // Make the meta info
         var metadata = d3.select("#sample-metadata");
         metadata.html('');
         Object.entries(meta[samplesID]).forEach(([k,v]) => {
             metadata.append('p').text(`${k.toUpperCase()}:\n${v}`);
         })
     })
 }
 
 // Make new plots if ID changed
function optionChanged(newId) {
    Plot(newId);
}

//Populate dropdown with names
    populateDropdown(data["names"]);
  
    //Populate the page with the first value
    x_data = data["samples"][0]["otu_ids"];
    y_data = data["samples"][0]["sample_values"];
    hoverText = data["samples"][0]["otu_labels"];
    metadata = data["metadata"][0];
  
    //Draw the chart on load
    drawChart(x_data, y_data, hoverText, metadata);

loadPage();

