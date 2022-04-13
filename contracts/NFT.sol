//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    address public owner;

    constructor(address marketplaceAddress) ERC721("SUSHI", "SSH") {
        contractAddress = marketplaceAddress;
        owner = msg.sender;
    }
    function createToken(string memory tokenURI) public onlyOwner returns(uint) {
       _tokenIds.increment();
       uint newItemId = _tokenIds.current();
       _mint(msg.sender, newItemId);
       _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
}
