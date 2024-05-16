const { STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(`${STRIPE_SECRET_KEY}`);

const fetchCustomer = async (email) =>
	await stripe.customers.list({
		email,
	});

stripe.products
	.list({
		// limit: 3,
	})
	.then((res) => console.log(res));

const fetchSubscription = async (customer) =>
	await stripe.subscriptions.list({ customer });
// fetchCustomer("frozenice929@gmail.com").then((res) => console.log(res.data[0]));
// fetchSubscription("cus_Q702hBaS6RZ3I6").then((res) => console.log(res.data[0]));
module.exports = { fetchCustomer, fetchSubscription };
