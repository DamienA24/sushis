/* pages/index.js */
import React, { useEffect, useState } from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

import { nftaddress, nftmarketaddress } from "../config";
import Filters from "../components/Filters";
import NftCard from "../components/NftCard";
import Footer from "../components/Footer";

import Market from "../utils/NFTMarket.json";
import {
  getMarketContract,
  getProviderSigner,
  getTokenContract,
} from "../utils/contract";

export default function Home() {
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "success",
  });
  const [dataInitial, setDataInitial] = useState([]);
  const [openModal, setOpen] = useState(false);
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */

    const { ethereum } = window;
    if (ethereum) {
      const tokenContract = getTokenContract(ethereum);
      const marketContract = getMarketContract(ethereum);
      const data = await marketContract.fetchMarketItems();
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

      setNfts([...items]);
      setDataInitial(items);
    }
    setLoadingState("loaded");
  }
  async function buyNft(nft, typeAction) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const signer = getProviderSigner(connection);
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

    const receipt = await transaction.wait();
    if (receipt.status === 1) {
      setSnackbar({
        message: `successful`,
        severity: "success",
      });
      setOpen(true);
      loadNFTs();
    } else {
      setSnackbar({
        message: `Transaction failed! Please try again`,
        severity: "error",
      });
      setOpen(true);
    }
  }

  function filter(e) {
    const keyword = e.target.value;
    const [key, filterBy] = keyword.split("__");
    console.log(key, filterBy);
    switch (key) {
      case "available":
        if (filterBy === "true") {
          setNfts(dataInitial.filter((nft) => nft.available === true));
        } else {
          setNfts(dataInitial.filter((nft) => nft.available === false));
        }
        break;
      case "price":
        if (filterBy === "low") {
          const dataFiltered = dataInitial.sort(
            (nft1, nft2) => nft1.price - nft2.price
          );
          setNfts([...dataFiltered]);
        } else {
          const dataFiltered = dataInitial.sort(
            (nft1, nft2) => nft2.price - nft1.price
          );
          setNfts([...dataFiltered]);
        }
        break;
      case "soldAt":
        const dataFilteredBySold = dataInitial.sort(
          (nft1, nft2) => nft2.soldAt - nft1.soldAt
        );
        setNfts([...dataFilteredBySold]);
        break;
      case "listedAt":
        const dataFilteredByList = dataInitial.sort(
          (nft1, nft2) => nft2.listedAt - nft1.listedAt
        );
        console.log(dataFilteredByList);
        setNfts([...dataFilteredByList]);
        break;
      default:
        setNfts(dataInitial);
        break;
    }
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  if (loadingState === "loaded") {
    return (
      <>
        <div className="flex justify-center container-global-items">
          <div className="px-4">
            <div className="flex justify-end pr-6">
              <Filters filter={filter} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {!nfts.length ? (
                <h1 className="px-20 py-10 text-3xl">
                  No items in marketplace
                </h1>
              ) : (
                nfts.map((nft, i) => (
                  <NftCard buyNft={buyNft} nft={nft} key={i} />
                ))
              )}
            </div>
          </div>
          <Snackbar
            open={openModal}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Fade}
            onClose={handleClose}
          >
            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
        <Footer />
      </>
    );
  }
  return null;
}
