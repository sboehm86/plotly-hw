//bring in data  
function buildMetaData(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata; //stores the metadata library
        var resultsRaw = metadata.filter(sampleObj => sampleObj.id == sample); //filter for desired
        var results = resultsRaw[0];
        var PANEL = d3.select("#sample-metadata");

        //clear existing data if it exits
        PANEL.html("");

        //add key and value pairs using object.entries
        Object.entries(results).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}:${value}`);
        });
    });
}
//console.log("data retrieved");

//horizontal bar chart with dropdown of top ten
function buildChart(sample) {
            d3.json("samples.json").then((data) => {
                var samples = data.samples;
                var resultsRaw = samples.filter(sampleObj => sampleObj.id == sample); //filter for desired
                var results = resultsRaw[0];
                //variables from readme...
                var sample_values = results.sample_values;
                var otu_ids = results.otu_ids;
                var otu_labels = results.otu_labels;

                ////bubble chart for each sample
                var bubLayout = {
                    title: "Bacteria Cultures per Sample",
                    margin:{t:0},
                    hovermode: "closest",
                    xaxis: { title: "OTU IDs" },
                    margin: { t: 30 }
                };
                var bubData = [{
                    x: otu_ids,
                    y: sample_values,
                    mode: "markers",
                    marker: {
                        size: sample_values,
                        color: otu_ids,
                        colorscale: "Earth"
                    }
                }];
                Plotly.newPlot("bubble", bubData, bubLayout);

                //barchart...
                var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
                var barData = [{
                    y: yticks,
                    x: sample_values.slice(0, 10).reverse(),
                    text: otu_labels.slice(0, 10).reverse(),
                    type: "bar",
                    orientation: "h",
                }];

                var barLayout = {
                    title: "Top 10 Bacterial Cultures Found",
                    margin: { t: 30, l: 50 }
                };
                Plotly.newPlot("bar", barData, barLayout);
            });
        }

function init() {
            var selector = d3.select("#selDataSet");   //tried to renamed this variable dropdown and it was causing issues
            //populate the dropdown options...
            d3.json("samples.json").then((data) => {
                var sampleNames = data.names;
                sampleNames.forEach((sample) => {
                    selector
                        .append("option")
                        .text(sample)
                        .property("value", sample);
                });

                //populate objects with a starting sample...
                var initSample = sampleNames[0];
                buildChart(initSample);
                buildMetaData(initSample);
            });
        }

function changeSample(newSample) {
            buildChart(newSample);
            buildMetaData(newSample);
        }

init();
//display sample metadata
//display each key-value pair
//update plots when new sample is selected