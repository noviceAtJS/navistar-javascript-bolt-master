var _ = require('lodash');

function EntityNodeRelationshipDetail(title, cast) {
  _.extend(this, {
    title: title,
    cast: cast.map(function (c) {
      return {
        name: c[0],
        category: c[1],
        relationship: c[2],
        properties: c[3],
      }
    })
  });
}

module.exports = EntityNodeRelationshipDetail;
