// migrations/1_deploy_loyalty_token.js
const LoyaltyToken = artifacts.require("LoyaltyToken");

module.exports = async function (deployer) {
	await deployer.deploy(LoyaltyToken);
};
