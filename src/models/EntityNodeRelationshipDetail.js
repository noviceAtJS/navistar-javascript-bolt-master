var _ = require('lodash');

function EntityNodeRelationshipDetail(title, name,label,relType,relationshipDetail) {
	/*
	 * [
	 * ["Jet",["User"],"Uses",{"since":[2000]}],
	 * ["Operations",["SupportLevel"],"Handles",{"features":["Reservation"]}],
	 * ["IA",["User"],"Uses",{"since":[2010]}]
	 * ]

	name: cast[0],
    category: cast[1],
    relationship: cast[2],
    properties: cast[3]
    record.get('title'), record.get('name'), 
    	    		record.get('label')[0],record.get('relType')[0], record.get('relDetails')[0]
	*/

  _.extend(this, {
    title: title,
    name: name,
    category: label,
    relationship: relType,
    properties: relationshipDetail

  });
}

module.exports = EntityNodeRelationshipDetail;
