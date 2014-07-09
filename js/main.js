var trafficLights = ["green", "yellow", "red"];

function drawGrid(configuration, data) {
    // Add templates for columns as necessary
    $.each(configuration.columns, function(index, column) {
        switch (column.type) {
            case "popupTemplate":
                column.template = function(dataItem) {
                    var template = ("<div class=\"popper-66\"><div>" + dataItem["name"] + "</div>" + "<p>" + "Target:    " + dataItem["target"] + "</p>" + "<p>" + "Project Owner:    " + dataItem["owner"] + "</p></div>");
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
                    var actual = column.field + ".Actual",
                        planned = column.field + ".Planned";
                    return '<div class="target-progress-67" style="width:' + dataItem[actual] + '%"></div><div class="target-67" style="left:' + dataItem[planned] + '%"></div>';
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
    }, {
        config: "data/config4.json",
        data: "data/data4.json"
    }, {
        config: "data/config5.json",
        data: "data/data5.json"
    }, {
        config: "data/config6.json",
        data: "data/data6.json"
    }, ];

    $.getJSON(filePair[value].config)
        .done(function(configuration) {
            $.getJSON(filePair[value].data)
                .done(function(data) {
                    drawGrid(configuration, data);
                    pseudoHeader(configuration);
                    if (configuration.chartType === "group") {
                        $("#grid").data("kendoGrid").dataSource.group({
                            field: "group"
                        });
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
        var el = event.target;
        handleSelection(el.options[el.selectedIndex].value);
    });

    handleSelection(0);
});