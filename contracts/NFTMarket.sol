// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
  using SafeMath for uint;
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;
  Counters.Counter private _itemsAvailable;
  Counters.Counter private _itemsUnAvailable;

  address payable public owner;
  uint256 listingPrice = 0.025 ether;

  constructor() {
    owner = payable(msg.sender);
  }

  struct MarketItem {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller;
    address owner;
    uint256 price;
    bool sold;
    bool available;
    uint256 createdAt;
    uint256 soldAt;
    uint256 listedAt;
  }

  mapping(uint256 => MarketItem) private idToMarketItem;

  event MarketItemCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold,
    bool available,
    uint256 createdAt,
    uint256 soldAt,
    uint256 listedAt
  );

  /* Returns the listing price of the contract */
  function getListingPrice() public view returns (uint256) {
    return listingPrice;
  }

  function setListingPrice(uint256 _listingPrice) public onlyOwner {
    listingPrice = _listingPrice;
  }

  /* Places an item for sale on the marketplace */
  function createMarketItem(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    bool _available
  ) public onlyOwner payable nonReentrant {
    require(price >= listingPrice, "Price must be equal or superior to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    uint256 createdAt =  block.timestamp;
    uint256 soldAt = 0;
    uint256 listedAT = block.timestamp;

  if(_available) {
    _itemsAvailable.increment();
  } else { 
    listedAT = 0;
    _itemsUnAvailable.increment();
  }

    idToMarketItem[itemId] =  MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(owner),
      address(this),
      price,
      false,
      _available,
      createdAt,
      soldAt,
      listedAT
    );

    IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);

    emit MarketItemCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(this),
      price,
      false,
      _available,
      createdAt,
      soldAt,
      listedAT
    );
  }

 function onERC721Received(
    address, 
    address, 
    uint256, 
    bytes calldata
)   external pure returns(bytes4) {
    return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
} 

  /* Creates the sale of a marketplace item */
  /* Transfers ownership of the item, as well as funds between parties */
  function createMarketSale(
    address nftContract,
    uint256 itemId,
    bool sellToAddress
    ) public payable nonReentrant {
    uint price = sellToAddress ? SafeMath.mul(idToMarketItem[itemId].price, 2) : idToMarketItem[itemId].price;
    uint tokenId = idToMarketItem[itemId].tokenId;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    bool hasAvailableItem = idToMarketItem[itemId].available;
    require(hasAvailableItem, "This item is not available for sale");
    
    //uint valueToSeller = SafeMath.sub(price, valueToMarketplace);
    uint valueToSeller = SafeMath.div(SafeMath.mul(idToMarketItem[itemId].price, 95), 100);
    uint valueToMarketplace = SafeMath.sub(price, valueToSeller);

    (bool sent, bytes memory data) = idToMarketItem[itemId].seller.call{value: valueToSeller}("");
    require(sent, "Failed to send Ether to seller");

    if(sellToAddress) {
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
      idToMarketItem[itemId].owner = msg.sender;
      idToMarketItem[itemId].seller = payable(address(0));
      idToMarketItem[itemId].sold = true;
      _itemsSold.increment();
    } else {
      idToMarketItem[itemId].seller = payable(msg.sender);
      idToMarketItem[itemId].soldAt = block.timestamp;
      uint newPrice = calculateNewPrice(price);
      idToMarketItem[itemId].price = newPrice;
    }
  }

  /* Returns all unsold market items */
  function fetchMarketItems() public view returns (MarketItem[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = itemCount - _itemsSold.current();
    uint currentIndex = 0;
    MarketItem[] memory items = new MarketItem[](unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(this) && idToMarketItem[i + 1].sold == false) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items soon available */
  function fetchMarketItemsUnAvailable() public view returns (uint256[] memory) {
    uint itemCount = _itemIds.current();
    uint unAvailableItemsCount = _itemsUnAvailable.current();
    uint currentIndex = 0;
    
    uint256[] memory items = new uint256[](unAvailableItemsCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToMarketItem[i + 1].available == false) {
        uint currentId = i + 1;
        items[currentIndex] = currentId;
        currentIndex += 1;
      }
    }
    return (items);
  }

  function makeAvailableMarketItem(
    uint256[] memory itemsId,
    bool _available
  ) public onlyOwner nonReentrant {
    for (uint i = 0; i < itemsId.length; i++) {
      uint256 itemId = itemsId[i];
      idToMarketItem[itemId].available = _available;
      idToMarketItem[itemId].listedAt = block.timestamp;
      if(_available) {
        _itemsAvailable.increment();
        _itemsUnAvailable.decrement();
      } else {
        _itemsAvailable.decrement();
        _itemsUnAvailable.increment();
      }
    }
  }

  /* Returns only items that a user has purchased */
  function fetchNFTsOwner() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory ownerItems = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        ownerItems[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return ownerItems;
  }

   function fetchNFTsSeller() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory sellerItems = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        sellerItems[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return sellerItems;
  }

    function fetchNFTsByAddress(address account) public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == account) {
        itemCount += 1;
      }
    }

    MarketItem[] memory accountItems = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == account) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        accountItems[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return accountItems;
  }

  function fetchNftById(uint256 itemId) public view returns (MarketItem memory) {
    return idToMarketItem[itemId];
  }

  /* Returns only items a user has created */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function airDrop(address nftContract, address _to, uint256 _tokenId) public onlyOwner {
    require(idToMarketItem[_tokenId].available == true, "Item is not available");
    require(idToMarketItem[_tokenId].owner != msg.sender, "You can't air drop your own item");
    require(idToMarketItem[_tokenId].owner != _to, "You can't air drop to yourself");

    IERC721(nftContract).transferFrom(address(this), _to, _tokenId);
    idToMarketItem[_tokenId].seller = payable(_to);        
  }


  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can do this");
    _;
  }

  function changeOwner(address _newOwner) public onlyOwner {
    owner = payable(_newOwner);
  } 

  function withdraw() public onlyOwner {
	  uint amount = address(this).balance;
	
	  (bool success, ) = msg.sender.call{value: amount}("");
	  require(success, "Failed to withdraw Ethers");
  } 

  function calculateNewPrice(uint256 priceToIncrease) public pure returns (uint256) {
    return SafeMath.div(SafeMath.mul(priceToIncrease, 125), 100);
  }

  /*Ideas : 
  - Create card to share with others for sell our NFTs


  */
}