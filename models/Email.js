const { Schema, model } = require("mongoose");

const reqStr = {
	type: String,
	unique: true,
	required: true,
};

const emailSchema = new Schema({
	userId: reqStr,
	email: reqStr,
	planId: String,
	customerId: String,
	roleId: String,
});

module.exports = model("Email", emailSchema);
