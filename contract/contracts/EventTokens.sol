pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract EventTokens is ERC1155, Ownable {
  // TODO: Everything

  constructor() ERC1155("https://game.example/api/item/{id}.json") {
  }
}
