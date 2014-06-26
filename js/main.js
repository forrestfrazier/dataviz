var trafficLights = ["green", "yellow", "red"];

function drawGrid(configuration, data) {

    // Add templates for columns as necessary
    $.each(configuration.columns, function(index, column) {
        switch (column.type) {
            case "trafficLight":
                column.template = function(dataItem) {
                    return '<div class="' + trafficLights[dataItem[column.field]] + '">&nbsp;</div>';
                };
                break;
            case "barChart":
                column.template = function(dataItem) {
                    return '<div class="blue-vlight" style="width: ' + dataItem[column.field] + '%">&nbsp;</div>';
                };
                break;
            case "completedTextBar":
                column.template = function(dataItem) {
                    return '<div class="text-wrapper"><span>' + dataItem[column.field] + '%</span><span class="cost">$' + dataItem["completedCost"] + 'M</span></div><div class="bar-wrapper"><div style="width: ' + dataItem[column.field] + '%">&nbsp;</div></div>';
                };
                break;
            case "onTrackTextBar":
                column.template = function(dataItem) {
                    return '<div class="text-wrapper"><span>' + dataItem[column.field] + '%</span><span class="cost">$' + dataItem["onTrackCost"] + 'M</span></div><div class="bar-wrapper"><div style="width: ' + dataItem[column.field] + '%">&nbsp;</div></div>';
                };
                break;
            case "atRiskTextBar":
                column.template = function(dataItem) {
                    return '<div class="text-wrapper"><span>' + dataItem[column.field] + '%</span><span class="cost">$' + dataItem["atRiskCost"] + 'M</span></div><div class="bar-wrapper"><div style="width: ' + dataItem[column.field] + '%">&nbsp;</div></div>';
                };
                break;
            case "offTrackTextBar":
                column.template = function(dataItem) {
                    return '<div class="text-wrapper"><span>' + dataItem[column.field] + '%</span><span class="cost">$' + dataItem["offTrackCost"] + 'M</span></div><div class="bar-wrapper"><div style="width: ' + dataItem[column.field] + '%">&nbsp;</div></div>';
                };
                break;
        }
    });

    configuration.dataSource = new kendo.data.DataSource({
        data: data
    });

    $("#grid").empty().kendoGrid(configuration);
}

// show the display based on dropdown
function handleSelection(value) {
    var filePair = [{
        config: "data/config1-text.json",
        data: "data/data1.json"
    }, {
        config: "data/config1-dataviz.json",
        data: "data/data1.json"
    }, {
        config: "data/config2.json",
        data: "data/data2.json"
    }, {
        config: "data/config3.json",
        data: "data/data3.json"
    }, ];

    $.getJSON(filePair[value].config)
        .done(function(configuration) {
            $.getJSON(filePair[value].data)
                .done(function(data) {
                    drawGrid(configuration, data);
                });
        });
}

$(document).ready(function() {

    $(".use-case-selector").on("change", function(event) {
        var el = event.target;
        handleSelection(el.options[el.selectedIndex].value);
    });

    handleSelection(0);
});