/* pages/index.js */
import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

import { nftaddress, nftmarketaddress } from "../../config";
import NftCard from "../../components/NftCard";

import Market from "../../utils/NFTMarket.json";
import { getTokenContract, getMarketContract } from "../../utils/contract";

export default function NftByAccount() {
  const router = useRouter();
  const { account } = router.query;

  const [loadingState, setLoadingState] = useState("not-loaded");
  const [wrongAddress, setWrongAddress] = useState(false);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (account) {
      if (ethers.utils.isAddress(account)) {
        loadNFTs();
        return;
      }
      setWrongAddress(true);
    }
    setLoadingState("loaded");
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const { ethereum } = window;
    if (ethereum) {
      const tokenContract = getTokenContract(ethereum);
      const marketContract = getMarketContract(ethereum);
      const data = await marketContract.fetchNFTsByAddress(account);
      //const provider = new ethers.providers.getDefaultProvider("rinkeby");

      /*
       *  map over items returned from smart contract and format
       *  them as well as fetch their token metadata
       */
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            available: i.available,
            createdAt: i.createdAt.toNumber(),
            soldAt: i.soldAt.toNumber(),
            listedAt: i.listedAt.toNumber(),
          };
          return item;
        })
      );
      setNfts(items);
    }

    setLoadingState("loaded");
  }
  async function buyNft(nft, typeAction) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(
      (typeAction === "OWN" ? 2 * nft.price : nft.price).toString(),
      "ether"
    );

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      typeAction === "OWN" ? true : false,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded") {
    if (wrongAddress) {
      return (
        <h1 className="px-6 py-10 text-3xl font-roboto weight400 blackColorDisabled">
          Wrong address
        </h1>
      );
    }
    if (!nfts.length) {
      return (
        <h1 className="px-6 py-10 text-3xl font-roboto weight400">
          No items available
        </h1>
      );
    }
  }
  return (
    <div className="flex justify-center">
      <div className="px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <NftCard nft={nft} key={i} buyNft={buyNft} />
          ))}
        </div>
      </div>
    </div>
  );
}
