var _ = require('lodash');

function Movie(_node) {
  _.extend(this, _node.properties);

  if (this.id) {
    this.id = this.id.toNumber();
  }
  if (this.duration) {
    this.duration = this.duration.toNumber();
  }
  if (this.name) {
	    this.name = this.name;
	  }
}

module.exports = Movie;
