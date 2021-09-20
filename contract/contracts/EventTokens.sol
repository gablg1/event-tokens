pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract EventTokens is ERC1155, Ownable {
  mapping(uint256 => address) private _publicKeys;
  mapping(uint256 => mapping (uint256 => bool)) private _claimed;
  mapping(uint256 => uint256) private _fractionsPerSlot;
  mapping(uint256 => uint256) private _numOfSlots;
  mapping(uint256 => string) public _URIs;

  constructor(address publicKey) ERC1155("NOT_USED") {
  }

  function claimTokenFractions(uint256 tokenId, uint256 n, bytes memory signature) public virtual {
    // Require that the signer of _hash(tokenId, n) was the private key corresponding to _internalPublicKey
    require(
      SignatureChecker.isValidSignatureNow(_publicKeys[tokenId], hash(tokenId, n), signature),
      "Wrong signature"
    );
    require(_fractionsPerSlot[tokenId] > 0, "Invalid tokenId (nonexistent)");
    require(n < _numOfSlots[tokenId], "Invalid n");
    require(!_claimed[tokenId][n], "No more fractions available to claim");
    _claimed[tokenId][n] = true;

    _mint(msg.sender, tokenId, _fractionsPerSlot[tokenId], "");
  }

  function createToken(uint256 tokenId, uint256 numOfSlots, uint256 fractionsPerSlot, address publicKey, string memory
                       tokenUri) public virtual onlyOwner {
    require(_numOfSlots[tokenId] == 0, "Token was already created");
    require(publicKey != address(0), "Public Key must be non-zero");
    require(fractionsPerSlot * numOfSlots > 0, "Total supply must be > 0");

    _numOfSlots[tokenId] = numOfSlots;
    _publicKeys[tokenId] = publicKey;
    _fractionsPerSlot[tokenId] = fractionsPerSlot;
    _URIs[tokenId] = tokenUri;
  }

  function hash(uint256 tokenId, uint256 n) public pure returns (bytes32) {
    bytes32 hashedMsg = keccak256(abi.encode(tokenId, n));
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMsg));
  }

  function totalSupply(uint256 tokenId) public view returns (uint256) {
    return _numOfSlots[tokenId] * _fractionsPerSlot[tokenId];
  }
}
