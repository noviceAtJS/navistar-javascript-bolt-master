var _ = require('lodash');

function EntityNodeRelationshipDetail(title, cast) {
  _.extend(this, {
    title: title,
    cast: cast.map(function (c) {
      return {
        client: c[0],
        established: c[1],
        usingSince: c[2]
      }
    })
  });
}

module.exports = ProductUserDetail;
