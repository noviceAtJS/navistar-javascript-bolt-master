var _ = require('lodash');

function Product(_node, labelType) {
	_.extend(this, _node.properties);

	if (this.id) {
		this.id = this.id.toNumber();		
	}
	this.Name="Trial";
	if (this.name) {
		this.name = this.name;
	}
	if (this.launched) {
		this.launched = this.launched;
	}
	if(labelType) {
	this.type = labelType;
	}

}

module.exports = Product;
