// Randomly turns a pixel to a variety of colors 
function pickPixel(colors, probabilities) {

    var randomNumber = Math.random();
    var i;
    for (i = 0; i < probabilities.length && randomNumber > probabilities[i]; i++);
    return colors[i];
}

// Calculates the probability for each color 
function decimalProbabilities(probabilities) {
    var decimalProbValues = [];
    var sum = 0;
    for (var i = 0; i < probabilities.length; i++) {
        sum += probabilities[i] / 100.0;
        decimalProbValues[i] = sum;
    }
    return decimalProbValues;
}


//Width and height of the visualization
var w = 500;
var h = 300;
var padding = 30;

var dataset = [
    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88],
    [600, 150]
];

// Scaling functions for the x height and the y height of each bar. 
var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
        return d[0];
    })])
    .range([padding, w - padding * 2]);

var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
        return d[1];
    })])
    .range([h - padding, padding]);

//Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

//Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);



//Create parent SVG for the entire vis 
var svg = d3.select("body")
    .append("svg")
    .attr("class", "container")
    .attr("width", w)
    .attr("height", h);

// Number of rows of pixels for each bar 
var groups = 4;

for (var i = 0; i < groups; i++) {

    var rectangleWidth = (xScale.range()[1] - xScale.range()[0]) / groups;
    var rectangleX = i * rectangleWidth + xScale.range()[0];
    var rectangleHeight = yScale(yScale.domain()[0]) - yScale(yScale.domain()[1])
    var rectangleY = yScale(yScale.domain()[0]) - rectangleHeight;

    //var rectangleWidth = xScale(rectangleWidth) - xScale(xScale.domain()[0]);
    var rectangle = svg.append("foreignObject")
        .attr("x", rectangleX)
        .attr("y", rectangleY)
        .attr("width", rectangleWidth)
        .attr("height", rectangleHeight)
        .html("<canvas style='display:block;border:1px solid black;' class='bar" + i + "' height='" + rectangleHeight / 4 + " px' width='" + rectangleWidth + "px'> </canvas><canvas style='display:block;border:1px solid black;' class='bar" + i + "' height='" + rectangleHeight / 2 + " px' width='" + rectangleWidth + "px'> </canvas><canvas style='display:block;border:1px solid black;' class='bar" + i + "' height='" + rectangleHeight / 4 + " px' width='" + rectangleWidth + "px'> </canvas>");
}

// Red/Blue/Green Color Choices
var colors = [{
    red: 255,
    green: 0,
    blue: 0,
    alpha: 255
}, {
    red: 0,
    green: 255,
    blue: 0,
    alpha: 255
}, {
    red: 0,
    green: 0,
    blue: 255,
    alpha: 255
}];

// % Probabilities, indices map to the colors array 
var probabilities = [40, 50, 10];
var decProbabilities = decimalProbabilities(probabilities);
for (var i = 0; i < groups; i++) {
    var cusid_ele = document.getElementsByClassName('bar' + i);
    //Iterate over every bar in the group 
    var array = [];
    for (var t = 0; t < cusid_ele.length; ++t) {
        var item = cusid_ele[t];
        var ctx = item.getContext("2d");

        var imgData = ctx.createImageData(rectangleWidth, rectangleHeight);

        var canvasWidth = imgData.width;
        var canvasHeight = imgData.height;

        var pixelCount = imgData.data.length / 4;
        var pixelWidth = 3;
        var pixelHeight = 4;

        for (var row = 0; row < canvasHeight; row += pixelHeight) {

            var height = pixelHeight;

            if ((canvasHeight - row) + 1 < pixelHeight) {
                height = (canvasHeight - row) + 1;
            }

            for (var pixel = 0; pixel <= ((row + 1) * canvasWidth * 4); pixel += (pixelWidth * 4)) {

                var width = pixelWidth;
                var currentPixel = ((row * (canvasWidth - 1) * 4) + (row - 1) * 4) + pixel;
                var currentRowMax = (row + 1) * canvasWidth * 4;

                if (pixelWidth * 4 > currentRowMax - currentPixel) {
                    width = currentRowMax - currentPixel;
                }

                colorPicked = pickPixel(colors, decProbabilities);

                for (var speckleAdjustHeight = 0; speckleAdjustHeight < height; speckleAdjustHeight++) {

                    var adjustedHeightPixel = currentPixel + 4 * canvasWidth * speckleAdjustHeight;

                    // Draws the pixels along the width
                    for (var speckleAdjustWidth = 0; speckleAdjustWidth < width; speckleAdjustWidth++) {

                        
                        var pixelToAdjust = adjustedHeightPixel + (speckleAdjustWidth * 4);

                        imgData.data[pixelToAdjust + 0] = colorPicked.red;
                        imgData.data[pixelToAdjust + 1] = colorPicked.green;
                        imgData.data[pixelToAdjust + 2] = colorPicked.blue;
                        imgData.data[pixelToAdjust + 3] = colorPicked.alpha;
                    }
                }
            }
        }


        // Draw the speckled pixels
        ctx.putImageData(imgData, 0, 0, 0, 0, rectangleWidth, rectangleHeight);
    }
}

//Create X axis
var axisX = svg.append("g");

axisX.attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);


var axisY = svg.append("g");

//Create Y axis
axisY.attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);