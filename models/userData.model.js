const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required:"Required"
	},
	email: {
		type: String,
		required:"Required"
	},
	password: {
		type: String,
		required:"Required"

	},
}, {timestamps: true});

const user_data_schema = mongoose.model("userDataCollection", userSchema);

module.exports = user_data_schema;








