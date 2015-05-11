d3.csv("map_slider.csv", function(data) {
    drawMarkerArea(data);
  });

  function drawMarkerArea(data) {
    var groupname = "marker-area";

    var mapChart = dc.leafletMarkerChart("#map", groupname),
        categoryChart = dc.rowChart("#category", groupname),
        gameChart = dc.rowChart("#game", groupname),
        hourChart = dc.barChart("#crimesbyhour", groupname);

    var data = crossfilter(data),
        all = data.groupAll(),
        crime = data.dimension(function(d) { return d.lon + "," + d.lat; }),
        crimeGroup = crime.group().reduceCount(),
        category = data.dimension(function(d) { return d.category; }),
        categoryGroup = category.group().reduceCount(),
        game = data.dimension(function(d) { return d.game; }),
        gameGroup = game.group().reduceCount(),
        crimesbyhour = data.dimension(function(d) { return d.hour; }),
        crimesbyhourGroup = crimesbyhour.group().reduceCount();

    dc.dataCount("#dc-data-count", groupname)
      .dimension(data)
      .group(all);

    mapChart
      .dimension(crime)
      .group(crimeGroup)
      .width(600)
      .height(600)
      .center([37.7595,-122.427])
      .zoom(16)
      .renderPopup(true)
      .filterByArea(true);

    categoryChart
      .dimension(category)
      .group(categoryGroup)
      .height(500)
      .width(270)
      .elasticX(true)
      .colors(["#2ca25f"])
      .xAxis().ticks(2).tickFormat(d3.format("s"));

    gameChart
      .dimension(game)
      .group(gameGroup)
      .height(300)
      .width(270)
      .elasticX(true)
      .colors(["#2b8cbe"])
      .xAxis().ticks(2).tickFormat(d3.format("s"));

    hourChart
      .dimension(crimesbyhour)
      .group(crimesbyhourGroup)
      .width(800)
      .transitionDuration(500)
      .elasticY(true)
      .x(d3.scale.linear().domain([0, 23]))
      .yAxis().ticks(2).tickFormat(d3.format("s"));

    dc.renderAll(groupname);
  }


