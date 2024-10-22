// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LoyaltyToken is ERC20, Ownable(msg.sender) {
    constructor() ERC20("LoyaltyToken", "LTY") {
        _mint(msg.sender, 1000000 * (10 ** decimals()));
    }

    function reward(address customer, uint256 amount) external onlyOwner {
        _mint(customer, amount);
    }

    function redeem(address customer, uint256 amount) external onlyOwner {
        _burn(customer, amount);
    }
}
