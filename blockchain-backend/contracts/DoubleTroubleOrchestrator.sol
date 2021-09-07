pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./DoubleTrouble.sol";

// SPDX-License-Identifier: MIT
contract DoubleTroubleOrchestrator is ERC721URIStorage {
  mapping (address => DoubleTrouble) public _troublesomeCollections;
  DoubleTroubleFactory _dtFactory;
  address _feeWallet;
  address[] _registeredCollections;

  constructor(DoubleTroubleFactory dtFactory, address feeWallet) ERC721("Double Trouble", "TRBL") {
    _feeWallet = feeWallet;
    _dtFactory = dtFactory;
  }

  function makeTroublesomeCollection(address nftCollection, string memory name, string memory symbol) external {
    require(address(_troublesomeCollections[nftCollection]) == address(0), "Collection is already Troublesome");

    // Deploy troublesome contract for nftCollection
    _troublesomeCollections[nftCollection] = _dtFactory.makeNew(name, symbol, nftCollection, _feeWallet);
    _mint(msg.sender, _registeredCollections.length);
    _registeredCollections.push(nftCollection);
  }

  function troublesomeCollection(address nftCollection) external view returns (DoubleTrouble) {
    return _troublesomeCollections[nftCollection];
  }

  function registeredCollections() external view returns (address[] memory, address[] memory) {
    address[] memory mappedCollections = new address[](_registeredCollections.length);
    for (uint i = 0; i < _registeredCollections.length; i++) {
      mappedCollections[i] = address(_troublesomeCollections[_registeredCollections[i]]);
    }

    return (_registeredCollections, mappedCollections);
  }

  function registeredCollection(uint256 tokenId) external view returns (address, address) {
    require(tokenId < _registeredCollections.length, "tokenId not present");
    address original = _registeredCollections[tokenId];
    return (original, address(_troublesomeCollections[original]));
  }

  function tokenURI(uint256) public view virtual override returns (string memory) {
    revert("TODO");
  }
}

/*
* We need a Factory contract here because otherwise
* DoubleTroubleOrchestrator's code would have to include all of
* DoubleTrouble's code, and this would make DTO go above the 24KB Ethereum contract size limit.
*
* See more on this here: https://ethereum.stackexchange.com/questions/41501/contract-code-size-and-how-to-work-around-it
*/
contract DoubleTroubleFactory {
  function makeNew(string memory name, string memory symbol, address nftCollection, address feeWallet)
        external returns (DoubleTrouble) {
    return new DoubleTrouble(name, symbol, nftCollection, feeWallet);
  }
}
