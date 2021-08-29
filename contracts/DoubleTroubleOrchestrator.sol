pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./DoubleTrouble.sol";

// SPDX-License-Identifier: MIT
contract DoubleTroubleOrchestrator {
  mapping (address => DoubleTrouble) public _troublesomeCollections;

  function makeTroublesomeCollection(address nftCollection, string memory name, string memory symbol) external {
    _ensureSupportedNftContract(nftCollection);
    require(address(_troublesomeCollections[nftCollection]) == address(0), "Collection is already Troublesome");

    // Deploy troublesome contract for nftCollection
    _troublesomeCollections[nftCollection] = new DoubleTrouble(name, symbol, nftCollection);
  }

  function troublesomeCollection(address nftCollection) external view returns (DoubleTrouble) {
    _ensureSupportedNftContract(nftCollection);
    return _troublesomeCollections[nftCollection];
  }

  function _ensureSupportedNftContract(address nftCollection) internal view {
    require(IERC721Metadata(nftCollection).supportsInterface(0x80ac58cd),  "collection must refer to an ERC721 address");
  }
}