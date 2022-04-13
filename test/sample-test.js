const { expect } = require("chai");
const { ethers } = require("hardhat");

async function connector() {
  /* deploy the marketplace */
  const Market = await ethers.getContractFactory("NFTMarket");
  const market = await Market.deploy();
  await market.deployed();
  const marketAddress = market.address;
  /* deploy the NFT contract */
  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(marketAddress);
  await nft.deployed();
  const nftContractAddress = nft.address;

  return { marketAddress, nftContractAddress, market, nft };
}
/* test/sample-test.js */
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const { marketAddress, nftContractAddress, market, nft } =
      await connector();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    const auctionPriceV2 = ethers.utils.parseUnits("2", "ether");
    /* create three tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    await nft.createToken("https://www.mytokenlocation3.com");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, false);

    const [owner, buyerAddress] = await ethers.getSigners();
    /* execute sale of token to another user */
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, false, { value: auctionPrice });

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 2, true, {
        value: auctionPriceV2,
      });

    let contractBalance = await ethers.provider.getBalance(marketAddress);
    console.log("owner: ", owner.address);

    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    console.log(
      "Balance of owner before withdrawal:",
      hre.ethers.utils.formatEther(ownerBalance)
    );
    console.log(
      "Contract balance before withdrawal:",
      hre.ethers.utils.formatEther(contractBalance)
    );
    await market.connect(owner).withdraw();

    ownerBalance = await hre.ethers.provider.getBalance(owner.address);
    contractBalance = await ethers.provider.getBalance(marketAddress);

    console.log(
      "Contract balance after withdrawal:",
      hre.ethers.utils.formatEther(contractBalance)
    );
    console.log(
      "Balance of owner after withdrawal:",
      hre.ethers.utils.formatEther(ownerBalance)
    );
  });

  it("Should display list item by address", async function () {
    const { nftContractAddress, market, nft } = await connector();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    const auctionPriceV2 = ethers.utils.parseUnits("2", "ether");
    /* create three tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    await nft.createToken("https://www.mytokenlocation3.com");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, true);

    const [owner, buyerAddress] = await ethers.getSigners();
    /* execute sale of token to another user */
    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, false, { value: auctionPrice });

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 2, true, {
        value: auctionPriceV2,
      });
    let items = await market.fetchNFTsByAddress(buyerAddress.address);
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items Possessed by account ", items);
  });

  it("Should display item by id", async function () {
    const { marketAddress, nftContractAddress, market, nft } =
      await connector();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    const auctionPriceV2 = ethers.utils.parseUnits("2", "ether");
    /* create three tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    await nft.createToken("https://www.mytokenlocation3.com");

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, true);

    /* execute sale of token to another user */

    let itemOne = market.fetchNftById(1);
    let itemTwo = market.fetchNftById(2);
    let itemThree = market.fetchNftById(3);

    const [itemOneOwner, itemTwoOwner, itemThreeOwner] = await Promise.all([
      itemOne,
      itemTwo,
      itemThree,
    ]);
    console.log("itemOneOwner: ", itemOneOwner);
    console.log("itemTwoOwner: ", itemTwoOwner);
    console.log("itemThreeOwner: ", itemThreeOwner);
  });

  it("Should list items", async function () {
    const { nftContractAddress, market, nft } = await connector();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    /* create three tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    await nft.createToken("https://www.mytokenlocation3.com");
    await nft.createToken("https://www.mytokenlocation4.com");
    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, false);
    await market.createMarketItem(nftContractAddress, 4, auctionPrice, false);

    /* query for and return the unsold items */
    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          available: i.available,
          listedAt: i.listedAt.toNumber(),
          createdAt: i.createdAt.toNumber(),
          soldAt: i.soldAt.toNumber(),
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
    const itemsUnAvailable = await market.fetchMarketItemsUnAvailable();

    console.log("itemsUnAvailable: ", itemsUnAvailable);

    await market.makeAvailableMarketItem([3], true);

    items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          available: i.available,
          listedAt: i.listedAt.toNumber(),
          createdAt: i.createdAt.toNumber(),
          soldAt: i.soldAt.toNumber(),
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: V2 ", items);
  });

  it("Should air drop items", async function () {
    const { nftContractAddress, market, nft } = await connector();
    const auctionPrice = ethers.utils.parseUnits("1", "ether");
    /* create three tokens */
    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");
    await nft.createToken("https://www.mytokenlocation3.com");
    await nft.createToken("https://www.mytokenlocation4.com");
    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, true);
    await market.createMarketItem(nftContractAddress, 3, auctionPrice, false);
    await market.createMarketItem(nftContractAddress, 4, auctionPrice, false);

    const [owner, addressToGive] = await ethers.getSigners();
    /* query for and return the unsold items */
    let items = await market.fetchNFTsByAddress(addressToGive.address);
    console.log("items before airdrop: ", items);
    await market.airDrop(nftContractAddress, addressToGive.address, 2);

    items = await market.fetchNFTsByAddress(addressToGive.address);
    console.log("items after airdrop: ", items);
  });
});
