const LoyaltyToken = artifacts.require("LoyaltyToken");
const LoyaltyProgram = artifacts.require("LoyaltyProgram");

module.exports = async function (deployer, network, accounts) {
	const loyaltyToken = await LoyaltyToken.deployed();

	const minimumPurchase = web3.utils.toWei("0.01", "ether");

	await deployer.deploy(
		LoyaltyProgram,
		loyaltyToken.address,
		minimumPurchase
	);

	const loyaltyProgram = await LoyaltyProgram.deployed();

	await loyaltyToken.transferOwnership(loyaltyProgram.address);

	console.log("LoyaltyToken deployed at:", loyaltyToken.address);
	console.log("LoyaltyProgram deployed at:", loyaltyProgram.address);
};
