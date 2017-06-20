var api = require('./neo4jApi');

$(function () {
  renderGraph();
  search();

  $("#search").submit(e => {
    e.preventDefault();
    search();
  });
});

function showMovie(title) {
  api
    .getMovie(title)
    .then(movie => {
      if (!movie) return;

      $("#title").text(title);
//      $("#poster").attr("src", "http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/" + movie.title + ".jpg");
      var entityDetailTable = $("table#DetailedView tbody").empty();
      movie.cast.forEach(cast => {
    	  $("<tr><td class='movie'>" + cast.name + "</td><td>" + cast.category + "</td><td>" +movie.relationship + "</td></td>"+ movie.properties+"</td></tr>").appendTo(entityDetailTable)

          .click(function() {
            showClient($(this).find("td.movie").text());
          })
      });
    }, "json");
}

function showConnections(name,type) {
	  /*api
	    .getMovie(title)
	    .then(movie => {
	      if (!movie) return;

	      $("#title").text(movie.title);
	      $("#poster").attr("src", "http://neo4j-contrib.github.io/developer-resources/language-guides/assets/posters/" + movie.title + ".jpg");
	      var $list = $("#crew").empty();
	      movie.cast.forEach(cast => {
	        $list.append($("<li>" + cast.name + " " + cast.job + (cast.job == "acted" ? " as " + cast.role : "") + "</li>"));
	      });
	    }, "json");*/
	}

function search() {
  var query = $("#search").find("input[name=search]").val();
  api
    .searchMovies(query)
    .then(movies => {
      var t = $("table#results tbody").empty();
      var client = $("table#UserResults tbody").empty();
      //alert(movies.length);
      if (movies) {

        movies.forEach(movie => {
        	/*
        	 * Based on the key nodes that we have identfied, the search results will display the details
        	 * in the respective tables.
        	 * TODO: improve the logic to group the nodes and display instead of a bare switch-case!!!
        	 * 
        	 *  
        	 */
        	var nodeType = String(movie.type);
        	console.log("Type: " + nodeType);
        	switch(nodeType ) {
        	    case "User":
        	    	{
                    $("<tr><td class='movie'>" + movie.name + "</td><td>" + movie.established + "</td><td>" +movie.Name + "</td></tr>").appendTo(client)

                    .click(function() {
                      showClient($(this).find("td.movie").text());
                    })
        	        break;
        	    	}
        	    case "Product":           	       
        	    default:
        	    	{
                    $("<tr><td class='movie'>" + movie.name + "</td><td>" + movie.launched + "</td><td>" +movie.Name + "</td></tr>").appendTo(t)

                    .click(function() {
                      showMovie($(this).find("td.movie").text());
                    })
                    break;
        	    	}
        	}

        });

        var first = movies[0];
        if (first) {
          showMovie(first.name);
        }
      }
    });
  


}

function renderGraph() {
  var width = 800, height = 800;
  var force = d3.layout.force()
    .charge(-200).linkDistance(30).size([width, height]);

  var svg = d3.select("#graph").append("svg")
    .attr("width", "100%").attr("height", "100%")
    .attr("pointer-events", "all");

  api
    .getGraph()
    .then(graph => {
      force.nodes(graph.nodes).links(graph.links).start();

      var link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

      var node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
        .attr("class", d => {
          return "node " + d.label
        })
        .attr("r", 10)
        .call(force.drag);

      // html title attribute
      node.append("title")
        .text(d => {
          return d.title;
        });

      // force feed algo ticks
      force.on("tick", () => {
        link.attr("x1", d => {
          return d.source.x;
        }).attr("y1", d => {
          return d.source.y;
        }).attr("x2", d => {
          return d.target.x;
        }).attr("y2", d => {
          return d.target.y;
        });

        node.attr("cx", d => {
          return d.x;
        }).attr("cy", d => {
          return d.y;
        });
      });
    });
}
