import { ethers } from "ethers";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "./NFT.json";
import Market from "./NFTMarket.json";

export function recoverProvider(ethereum) {
  //const provider = new ethers.providers.JsonRpcProvider();
  //const provider = new ethers.providers.getDefaultProvider("rinkeby");
  const provider = new ethers.providers.Web3Provider(ethereum);
  return provider;
}

export function getTokenContract(ethereum) {
  const provider = recoverProvider(ethereum);
  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

  return tokenContract;
}

export function getMarketContract(ethereum) {
  const provider = recoverProvider(ethereum);
  const marketContract = new ethers.Contract(
    nftmarketaddress,
    Market.abi,
    provider
  );

  return marketContract;
}

export function getProviderSigner(connection) {
  const provider = new ethers.providers.Web3Provider(connection);
  return provider.getSigner();
}
