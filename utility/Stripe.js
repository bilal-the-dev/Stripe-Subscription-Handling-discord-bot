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
fetchCustomer("contact.asahikyou@gmail.com").then((res) =>
	console.log(res.data[0]),
);
fetchSubscription("cus_Q7kgttyHagOeiX").then((res) => console.log(res.data[0]));

const addRolesToMember = async (member, rolesToAdd) => {
	await member.roles.set([...member.roles.cache.keys(), ...rolesToAdd]);
};
module.exports = { fetchCustomer, fetchSubscription, addRolesToMember };
