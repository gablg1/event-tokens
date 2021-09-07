pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./DoubleTrouble.sol";

// SPDX-License-Identifier: MIT
contract DoubleTroubleOrchestrator {
  mapping (address => DoubleTrouble) public _troublesomeCollections;
  address _feeWallet;
  address[] _registeredCollections;

  constructor(address feeWallet) {
    _feeWallet = feeWallet;
  }

  function makeTroublesomeCollection(address nftCollection, string memory name, string memory symbol) external {
    _ensureSupportedNftContract(nftCollection);
    require(address(_troublesomeCollections[nftCollection]) == address(0), "Collection is already Troublesome");

    // Deploy troublesome contract for nftCollection
    _troublesomeCollections[nftCollection] = new DoubleTrouble(name, symbol, nftCollection, _feeWallet);
    _registeredCollections.push(nftCollection);
  }

  function troublesomeCollection(address nftCollection) external view returns (DoubleTrouble) {
    _ensureSupportedNftContract(nftCollection);
    return _troublesomeCollections[nftCollection];
  }

  function registeredCollections() external view returns (address[] memory, address[] memory) {
    address[] memory mappedCollections = new address[](_registeredCollections.length);
    for (uint i = 0; i < _registeredCollections.length; i++) {
      mappedCollections[i] = address(_troublesomeCollections[_registeredCollections[i]]);
    }

    return (_registeredCollections, mappedCollections);
  }

  function _ensureSupportedNftContract(address nftCollection) internal view {
    require(IERC721Metadata(nftCollection).supportsInterface(0x80ac58cd),  "collection must refer to an ERC721 address");
  }
}