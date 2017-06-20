require('file?name=[name].[ext]!../node_modules/neo4j-driver/lib/browser/neo4j-web.min.js');
var Product = require('./models/Product');
//var ProductUserDetail = require('./models/ProductUserDetail');
var EntityNodeRelationshipDetail = require('./models/EntityNodeRelationshipDetail');
var _ = require('lodash');

var neo4j = window.neo4j.v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "Login@neo4j"));

function searchMovies(queryString) {
	//alert(queryString);
  var session = driver.session();
  return session
    .run(
//      'MATCH (product:Product) \
//      WHERE product.name =~ {name} \
//      RETURN product',
    		'match( n) \
    	      where n.name =~ {name} \
    	      return distinct n, labels(n) as labelType',
      {name: '(?i).*' + queryString + '.*'}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
//    	  alert(record.get('Name'));
    	  /*var prod = record.get('product');
    	  console.log(prod );*/
//        	console.log("record" + record.get('n').labels);
    	  return new Product(record.get('n'),record.get('labelType'));
//        return new Movie(record.get('product.name'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}

function searchEntities(queryString) {
	//alert(queryString);
  var session = driver.session();
  return session
    .run(      
      'match( n)-[r]-() \
      where n.name =~ {name} \
      return n',
      {name: '(?i).*' + queryString + '.*'}
    )
    .then(result => {
      session.close();
      return result.records.map(record => {
//    	  alert(record.get('Name'));
    	  /*var prod = record.get('product');
    	  console.log(prod );*/

    	  return new Product(record.get('product'));
//        return new Movie(record.get('product.name'));
      });
    })
    .catch(error => {
      session.close();
      throw error;
    });
}


function getMovie(title) {
  var session = driver.session();
//  return session
//    .run(
//    		"MATCH (product:Product {name:{title}})\
//    	      OPTIONAL MATCH (product)<-[uses]-(user:User) \
//    	      RETURN product.name AS title, \
//    	      collect([user.name,user.established,uses.since]) AS cast",{title})
//
//    .then(result => {
//      session.close();
//
//      if (_.isEmpty(result.records))
//        return null;
//
//      var record = result.records[0];
//      return new ProductUserDetail(record.get('title'), record.get('cast'));
//    })
//    .catch(error => {
//      session.close();
//      throw error;
//    });
//  return null;
  /*
   * Query based on the name:
   * MATCH p=(n { name:"PQSR" })-[r]-()
UNWIND FILTER(x IN NODES(p) WHERE x <> n) AS node
RETURN DISTINCT node.name,labels(node),type(r),r order by labels(node);
   */
  return session
  .run(
  		"MATCH p=(n { name:{title} })-[r]-() \
UNWIND FILTER(x IN NODES(p) WHERE x <> n) AS node \
RETURN DISTINCT node.name as title,node.name as name,labels(node) as label,type(r) as relType ,properties(r) as relDetail",{title})
    .then(result => {
      session.close();

      return result.records.map(record => {
          var mapV = record.get('relDetail');
          var relationshipDetail ="";
          Object.keys(mapV).forEach(key => {

              relationshipDetail += relationshipDetail +key + ": " +mapV[key];
              
          });
          console.log("The Key1: " + relationshipDetail);
          return new EntityNodeRelationshipDetail(record.get('title'), record.get('name'), 
    	    		record.get('label'),record.get('relType'),relationshipDetail);
      });

    	  
    })

  .catch(error => {
    session.close();
    throw error;
  });
return null;
}

function getGraph() {
	
 var session = driver.session();
  return session.run(
//		  'MATCH p=(n { name:"PQSR" })-[r]-() \
//		  UNWIND FILTER(x IN NODES(p) WHERE x <> n) AS node \
//		  RETURN DISTINCT node,labels(node),r,n'
//    , {limit: 100})
    
      'MATCH (m:Movie)<-[:ACTED_IN]-(a:Person) \
    RETURN m.title AS movie, collect(a.name) AS cast \
    LIMIT {limit}', {limit: 100})
     
    .then(results => {
      session.close();
      var nodes = [], rels = [], i = 0;
      results.records.forEach(res => {
        nodes.push({title: res.get('node'), label: 'node'});
        var target = i;
        i++;

        res.get('cast').forEach(name => {
          var actor = {title: name, label: 'actor'};
          var source = _.findIndex(nodes, actor);
          if (source == -1) {
            nodes.push(actor);
            source = i;
            i++;
          }
          rels.push({source, target})
        })
      });

      return {nodes, links: rels};
    });
    
}

exports.searchMovies = searchMovies;
exports.getMovie = getMovie;
exports.getGraph = getGraph;

