var trafficLights = ["green", "yellow", "red"];

function drawGrid(configuration, data) {
    var count = 0;
    var temp = 0;
    var names = [];
    // Add templates for columns as necessary
    $.each(configuration.columns, function(index, column) {
        switch (column.type) {
            case "trafficLightToolTip":
                {
                    column.template = function(dataItem) {
                        return '<div class="' + trafficLights[dataItem[column.field]] + ' tooltip">&nbsp;</div>';
                    };
                }
                break;
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
            case "projectNameType":
                column.template = function(dataItem) {
                    return '<div class="' + dataItem["treeType"] + '-66">' + dataItem[column.field] + '</div>';
                };
                break;
            case "bulletBar":
                column.template = function(dataItem) {
                    return '<div class="target-progress-67" style="width:' + dataItem[column.field] + '%"></div><div class="target-67" style="left:' + dataItem["target"] + '%"></div>';
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
    }, ];

    $.getJSON(filePair[value].config)
        .done(function(configuration) {
            $.getJSON(filePair[value].data)
                .done(function(data) {
                    drawGrid(configuration, data);
                    pseudoHeader(configuration);
                });
        });
}

// create a fake header for column group lables above the existing kendo header
function pseudoHeader(configuration) {
    //console.log('build fake header ' + configuration.pseudoHeader);
    console.log(JSON.parse(JSON.stringify(configuration)));
    // look at json for fake header info
    if (configuration.pseudoHeader) {
        console.log('add header');
        // replicate, rename and place
        $('.k-grid-header-wrap').clone().addClass('label-grid').removeClass('k-grid-header-wrap').prependTo('.k-grid-header');
        // remove existing content
        $('.label-grid th').empty();
        // iterate through all columns and replace content
        $().each(function() {
            // match data-field to pseudoHeader.replaces and add label as text
            if ($('label-grid th').find("[data-field='" + current + "']")) {
                $(this).text(configuration.pseudoHeader.label);
            }
        });
    }

}


$(document).ready(function() {

    $(".use-case-selector").on("change", function(event) {
        var el = event.target;
        handleSelection(el.options[el.selectedIndex].value);
    });

    handleSelection(0);

});