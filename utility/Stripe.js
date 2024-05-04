const { STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(`${STRIPE_SECRET_KEY}`);

const fetchCustomer = async (email) =>
	await stripe.customers.list({
		email,
	});

// stripe.products
// 	.list({
// 		// limit: 3,
// 	})
// 	.then((res) => console.log(res));

const fetchSubscription = async (customer) =>
	await stripe.subscriptions.list({ customer });

module.exports = { fetchCustomer, fetchSubscription };
