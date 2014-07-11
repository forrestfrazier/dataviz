var trafficLights = ["green", "yellow", "red"];
var classToAdd = "";

function drawChart(configuration, data) {
    $('#grid').hide();
    $("#chart").kendoChart(configuration);
    $(".k-chart").data("kendoChart").bind("seriesClick", function(e) {
        //console.log(e);
        console.log('Send data to REST server to get details for ' + e.category);

        // now show the corrisponding grid under the chart
        $('#grid').show();
        handleSelection(8);

    });
}


function drawGrid(configuration, data, fileUsed) {
    switch (fileUsed) {
        case 0:
            classToAdd = "grid-6.1-Text";
            break;
        case "1":
            classToAdd = "grid-6.1";
            break;
        case "2":
            classToAdd = "grid-6.3";
            break;
        case "3":
            classToAdd = "grid-6.5";
            break;
        case "4":
            classToAdd = "grid-6.6";
            break;
        case "5":
            classToAdd = "grid-6.7";
            break;
        case "6":
            classToAdd = "grid-6.8";
            break;
        case "8":
            classToAdd = "grid-7.1";
            break;
    }
    if (classToAdd !== "") {
        $("#grid").addClass(classToAdd);
    }
    // Add templates for columns as necessary
    $.each(configuration.columns, function(index, column) {
        switch (column.type) {
            case "popupTemplate":
                column.template = function(dataItem) {
                    var template;
                    switch (fileUsed) {
                        case "4":
                            template = ("<div class=\"popper-66\"><div>" + dataItem["name"] + "</div>" + "<p>" + "Target:    " + dataItem["target"] + "</p>" + "<p>" + "Project Owner:    " + dataItem["owner"] + "</p></div>");
                            break;
                        case "8":
                            template = ("<div class=\"popper-71\"><div class=\"popup-name-71\">" + dataItem["projectNum"] + " " + dataItem["projectName"] + "<hr></div><div class=\"popup-column-left-71\">Completed <div class=\"popup-number-71\">" +
                                dataItem["completedActual"] + "</div><br>Plan updated <div class=\"popup-number-71\">" + dataItem["completedPlanned"] + "</div><hr><div class=\"popup-results-71\">Gap to Plan <div class=\"popup-number-71\">" +
                                (dataItem["completedActual"] - dataItem["completedPlanned"]) + "</div></div></div><div class=\"popup-column-right-71\" >Execution Roadmaps<div class=\"popup-number-71\">" + dataItem["executionRoadmaps"] +
                                "</div> Roadmaps to Roadmaps <div class=\"popup-number-71\">" + dataItem["executionRoadmapsToRoadmaps"] + "</div>Target<div class=\"popup-number-71\">" + dataItem["executionTarget"] +
                                "</div><hr><div class=\"popup-results-71\">Gap to Target<div class=\"popup-number-71\">" + (dataItem["executionRoadmapsToRoadmaps"] - dataItem["executionTarget"]) + "</div></div></div></div>");
                            break;

                    }
                    return template;
                };
                break;
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
            case "textBar":
                column.template = function(dataItem) {
                    var cost = column.field + ".Cost";
                    return '<div class="text-wrapper"><span>' + dataItem[column.field] + '%</span><span class="cost">$' + dataItem[cost] + 'M</span></div><div class="bar-wrapper"><div style="width: ' + dataItem[column.field] + '%">&nbsp;</div></div>';
                };
                break;
            case "projectNameType":
                column.template = function(dataItem) {
                    return '<div class="' + dataItem["treeType"] + '-66">' + dataItem[column.field] + '</div>';
                };
                break;
            case "bulletBar":
                column.template = function(dataItem) {
                    var actual = column.field + "Actual",
                        planned = column.field + "Planned";
                    switch (fileUsed) {
                        case "5":
                            return '<div class="target-progress-67" style="width:' + dataItem[actual] + '%"></div><div class="target-67" style="left:' + dataItem[planned] + '%"></div>';
                        case "6":
                            return '<div class="target-progress-68" style="width:' + dataItem[actual] + '%"></div><div class="target-68" style="left:' + dataItem[planned] + '%"></div>';
                        case "8":
                            return '<div class="target-progress-71" style="width:' + dataItem[actual] + '%"></div><div class="target-71" style="left:' + dataItem[planned] + '%"></div>';
                    }
                };
                break;
            case "stackedGraph":
                column.template = function(dataItem) {
                    var bar1 = dataItem[(column.field + "Roadmaps")],
                        bar2 = dataItem[(column.field + "RoadmapsToRoadmaps")],
                        target = dataItem[(column.field + "Target")];
                    return '<div class="stackGraph-bar2-71" style="width:' + bar1 + '%"></div><div class="stackGraph-bar1-71" style="width:' + bar2 + '%"></div><div class="execution-target-71" style="left:' + target + '%"></div>';
                };
                break;
            case "gapBar":
                column.template = function(dataItem) {
                    var target = dataItem[(column.field + "Target")],
                        actual = dataItem[(column.field + "RoadmapsToRoadmaps")],
                        gap = Math.abs(target - actual);
                    return '<div class="gapWhite-71" style="width:' + (100 - gap) + '%"></div><div class="gapBackground-71" style="width:100%"></div>';
                };
                break;
        }
    });

    configuration.dataSource = new kendo.data.DataSource({
        data: data
    });

    // empty the grid and fire up a new one
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
    }, {
        config: "data/config4.json",
        data: "data/data4.json"
    }, {
        config: "data/config5.json",
        data: "data/data5.json"
    }, {
        config: "data/config6.json",
        data: "data/data6.json"
    }, {
        config: "data/config7.json",
        data: "data/data7.json"
    }, {
        config: "data/config7_1.json",
        data: "data/data7_1.json"
    }];


    $.getJSON(filePair[value].config)
        .done(function(configuration) {
            $.getJSON(filePair[value].data)
                .done(function(data) {

                    // determine chart or grid
                    if (configuration.chartType === "chart") {
                        // get the config and data for the chart and build it
                        drawChart(configuration, data);

                    } else {
                        drawGrid(configuration, data, value);
                        pseudoHeader(configuration);
                        if (configuration.chartType === "group") {
                            $("#grid").data("kendoGrid").dataSource.group({
                                field: "group"
                            });
                        }
                    }
                });
        });
}

// create a fake header for column group lables above the existing kendo header
function pseudoHeader(configuration) {
    //console.log(JSON.parse(JSON.stringify(configuration)));
    // look at json for fake header info
    if (configuration.pseudoHeader) {
        console.log('add header');
        // replicate, rename and place
        $('.k-grid-header-wrap').clone().addClass('label-grid').removeClass('k-grid-header-wrap').prependTo('.k-grid-header');
        // array of all headers
        var headers = $('.label-grid tr').children();
        // clears text for each header
        for (var i = 0; i < headers.length; i++) {
            headers[i].textContent = "";
        }
        // replaces text with appropriate headers
        for (var i = 0; i < configuration.pseudoHeader.length; i++) {
            for (var k = 0; k < headers.length; k++) {
                if (headers[k].dataset.field === configuration.pseudoHeader[i].replaces) {
                    headers[k].textContent = configuration.pseudoHeader[i].label;
                }
            }
        }
        // resize grid content to allow for new label header height
        $('.k-grid-content').height($('.k-grid-content').height() - $('.label-grid').height());
    }
}

$(document).ready(function() {
    $(".use-case-selector").on("change", function(event) {
        // empty out all charts and grids
        $('#chart, #grid').empty();
        // identify the grid
        if (classToAdd !== "") {
            $("#grid").removeClass(classToAdd);
            classToAdd = "";
        }
        var el = event.target;
        handleSelection(el.options[el.selectedIndex].value);
    });

    handleSelection(0);
});