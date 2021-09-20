pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract EventTokens is ERC1155, Ownable {
  address private _internalPublicKey;

  constructor(address publicKey) ERC1155("https://game.example/api/item/{id}.json") {
    _internalPublicKey = publicKey;
  }

  function claimToken(uint256 tokenId, uint256 n, bytes memory signature) public virtual {
    // Require that the signer of _hash(tokenId, n) was the private key corresponding to _internalPublicKey
    require(
      SignatureChecker.isValidSignatureNow(_internalPublicKey, hash(tokenId, n), signature),
      "Wrong signature"
    );

    _mint(msg.sender, tokenId, 1, "");
  }

  function hash(uint256 tokenId, uint256 n) public pure returns (bytes32) {
    bytes32 hashedMsg = keccak256(abi.encode(tokenId, n));
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashedMsg));
  }

  function testRecover(uint256 tokenId, uint256 n, bytes memory signature) public pure returns (address) {
    return ECDSA.recover(hash(tokenId, n), signature);
  }

  function rawRecover(bytes32 myHash, bytes memory signature) public pure returns (address) {
    return ECDSA.recover(myHash, signature);
  }
}
