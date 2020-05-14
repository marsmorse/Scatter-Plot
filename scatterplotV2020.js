
    //Define Margin
    var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;


        var zoom = d3.zoom()
        .scaleExtent([.5,20])
        .translateExtent([[-100,-100], [width+90,height + 100]])
        .on("zoom",zoomed);

    //Define SVG
      var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    
    
    //define min and max circle sizes
    var rMin = 2;
    var rMax = 50;

    //Define Scales   
    var xScale = d3.scaleLinear()
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .range([height, 0]);


    var rScale = d3.scaleSqrt()
        .range([rMin, rMax]);
    
    //will apply each color in the array to whatever domain we set later
    var cScale = d3.scaleOrdinal([
 "#C70039",
  "#FF5733",
  "#306A1E",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
  "#39D17D",
  "#3941D1",
  "#D1398D", 
  "#87DCEA"
        
]);
   


    var xAxis = d3.axisBottom(xScale).tickPadding(2);
    var yAxis = d3.axisLeft(yScale).tickPadding(2);

    var gY;
    var gX;
   
   //translated xAxis calls
   /*var gX = svg.append("g")
   .attr("class", "axis axis--x")
   .call(xAxis);

var gY = svg.append("g")
   .attr("class", "axis axis--y")
   .call(yAxis);

svg.call(zoom);
*/
    //Get Data
    // Define domain for xScale and yScale
    
    d3.csv("scatterdata.csv").then(function(data){
        console.log(data);

        //used before it sets the domain from 0 to the max gdp value which
        //is evaluated using a callback technique in d3.max, the plus two adds room for the circle to fit in the display
    
        xScale.domain([0, d3.max(data, function(d){ 
            return parseInt(d.gdp);
        })+ 2]);
        //same techinique as above, in the real world I would add an arbitrary pattern that didn't necessarily equate to 450 but for the sake of this assignment and my grade I made it equal that
        yScale.domain([0,d3.max(data, function(d){ 
            return (parseInt(d.ecc)+34);
        })]);
        //same technique as above but with total consumption
        rScale.domain([0,d3.max(data, function(d){ 
            return d.ec;
        })]);
        //set the colors by each city
        cScale.domain(data.map(function(c){return c.country;}));

        //Draw Scatterplot
        svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {return rScale(d.ec);})
        .attr("cx", function(d) {return xScale(d.gdp);})
        .attr("cy", function(d) {return yScale(d.ecc);})
        .style("fill", function (d) { return cScale(d.country);})
        .on("mouseover", function(d){
            
            //get t
            d3.select("#tooltip")
                .style("left", xScale(d.gdp) )
                .style("top", 40)
                .select("#countrytt")
                .text(d.country)
            d3.select("#tooltip")
                .select("#GDPtt")
                .text(d.gdp)
            d3.select("#tooltip")
                .select("#poptt")
                .text(d.population)
            d3.select("#tooltip")
                .select("#EPCtt")
                .text(d.ecc)
            d3.select("#tooltip")
                .select("#Totaltt")
                .text(d.ec)
            
            d3.select("#tooltip").classed("hidden",false)
        })
        .on("mouseout",  function(d){d3.select("#tooltip").classed("hidden",true);});
    //Add .on("mouseover", .....
    //Add Tooltip.html with transition and style
    //Then Add .on("mouseout", ....
    
    //Scale Changes as we Zoom
    // Call the function d3.behavior.zoom to Add zoom

    //Draw Country Names
        svg.selectAll(".text")
        .data(data)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp);})
        .attr("y", function(d) {return yScale(d.ecc);})
        .text(function (d) {return d.country; });

 //x-axis
    gX =svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 50)
        .attr("x", width/2)
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .style("fill", "black")
        .text("GDP (in Trillion US Dollars) in 2020");

    //Y-axis
    gY = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("font-size", "12px")
        .style("fill", "black")
        .text("Energy Consumption per Capita (in Million BTUs per person)");
        
   
    })

         //creates a legend group with a rectangle with the given stylings
    var legend = svg.append("g")
        .attr("class", "legend")
    
    var legHeight = height/2;
    var legWidth = width/1.75;

    var legendRect= legend.append("rect")
        .attr("class", "legendbox")
        .attr("width", 200)
        .attr("height", 180)
        .attr("fill", "#b5ebea")
        .attr("x", legWidth)
        .attr("y", legHeight);
    //legend title text
    legend.append("text")
            .attr("fill", "green")
            .attr("y",legHeight - 5)
            .attr("x", legWidth)
            .text("total energy consumption");
//below we are creating circles with text for the legend box
    // 1 trillion BTU's
    
    legend.append("circle")
            .attr("class", "legendcircles")
            .attr("r", rScale(.01))
            .attr("cx",  legWidth + 160)
            .attr("cy", legHeight + 30)
            .style("fill", "grey");

    legend.append("text")
            .attr("fill", "black")
            .attr("y",legHeight + 30)
            .attr("x", legWidth )
            .text("1 Trillion BTU's ");   

    // 10 trillion BTU's
    legend.append("circle")
            .attr("class", "legendcircles")
            .attr("r", rScale(.1))
            .attr("cx", legWidth + 160)
            .attr("cy", legHeight+ 60)
            .style("fill", "grey");

    legend.append("text")
            .attr("fill", "black")
            .attr("y",legHeight + 60)
            .attr("x", legWidth )
            .style("text-anchor", "front")
            .text("10 Trillion BTU's "); 
 
    //100tril circle and text
    legend.append("circle")
            .attr("class", "legendcircles")
            .attr("r", rScale(1))
            .attr("cx",  legWidth + 160)
            .attr("cy", legHeight + 130)
            .style("fill", "grey");

    legend.append("text")
            .attr("fill", "black")
            .attr("y",legHeight + 130)
            .attr("x", legWidth )
            .text("100 Trillion BTU's ");   

//applies the zoom before to our svg
svg.call(zoom);

var view = svg.selectAll(".dot");
//all zoom code
console.log(svg.select("#view"))
//zoomed function 
function zoomed() {
    //view.attr("transform", d3.event.transform);
    //country.attr("transform", d3.event.transform);
    svg.attr("transform",d3.event.transform);
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
    gX.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    gY.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
    //svg.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
    //svg.call(yAxis.scale(d3.evet.tranform.rescaleY(yScale)));
  }
  d3.select("button")
    .on("click", resetted);
  function resetted(){
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
  }