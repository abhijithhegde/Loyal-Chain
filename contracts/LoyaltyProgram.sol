// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./LoyaltyToken.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyProgram is Ownable {
    IERC20 public loyaltyToken;

    mapping(address => bool) public merchants;

    uint256 public constant POINTS_MULTIPLIER = 100;

    uint256 public minimumPurchase;

    event MerchantAdded(address merchant);
    event MerchantRemoved(address merchant);
    event PointsEarned(
        address customer,
        uint256 purchaseAmount,
        uint256 pointsEarned
    );
    event PointsRedeemed(address customer, uint256 points, uint256 tokens);

    constructor(address _loyaltyToken, uint256 _minimumPurchase) {
        loyaltyToken = IERC20(_loyaltyToken);
        minimumPurchase = _minimumPurchase;
    }

    // Add a merchant to the program
    function addMerchant(address merchant) external onlyOwner {
        require(!merchants[merchant], "Merchant already exists");
        merchants[merchant] = true;
        emit MerchantAdded(merchant);
    }

    // Remove a merchant from the program
    function removeMerchant(address merchant) external onlyOwner {
        require(merchants[merchant], "Merchant does not exist");
        merchants[merchant] = false;
        emit MerchantRemoved(merchant);
    }

    // Award points for a purchase
    function awardPoints(address customer, uint256 purchaseAmount) external {
        require(merchants[msg.sender], "Only merchants can award points");
        require(purchaseAmount >= minimumPurchase, "Purchase amount too low");

        // Calculate points (1% of purchase amount)
        uint256 points = (purchaseAmount * POINTS_MULTIPLIER) / 10000;

        // Convert points to tokens and mint them to the customer
        uint256 tokens = points * (10 ** 18); // Convert to token decimals
        LoyaltyToken(address(loyaltyToken)).reward(customer, tokens);

        emit PointsEarned(customer, purchaseAmount, points);
    }

    // Redeem points for rewards
    function redeemPoints(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        uint256 tokens = amount * (10 ** 18); // Convert to token decimals

        require(
            loyaltyToken.balanceOf(msg.sender) >= tokens,
            "Insufficient points balance"
        );

        // Burn the tokens
        LoyaltyToken(address(loyaltyToken)).redeem(msg.sender, tokens);

        emit PointsRedeemed(msg.sender, amount, tokens);
    }

    // Update minimum purchase amount
    function setMinimumPurchase(uint256 _minimumPurchase) external onlyOwner {
        minimumPurchase = _minimumPurchase;
    }

    // Emergency token recovery in case tokens are accidentally sent to the contract
    function recoverTokens(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
