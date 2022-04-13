import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { ethers } from "ethers";
import Image from "next/image";
import axios from "axios";

import Market from "../../utils/NFTMarket.json";
import { getTokenContract, getMarketContract } from "../../utils/contract";
import ShareNft from "../../components/ShareNft";
import ButtonPay from "../../components/ButtonPay";

function Nft() {
  /* const router = useRouter();
  const { id } = router.query;

  const [loader, setLoader] = useState(true);
  const [hasNft, setHasNft] = useState(false);
  const [nft, setNft] = useState({
    price: "",
    tokenId: "",
    seller: "",
    owner: "",
    image: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      loadNFT(id);
    }
    setLoader(false);
  }, []);

  async function loadNFT(id) {
    const tokenContract = getTokenContract();
    const marketContract = getMarketContract();
    const dataToFetch = marketContract.fetchNftById(id);
    const tokenUriToGet = tokenContract.tokenURI(id);

    const [data, tokenURI] = await Promise.all([dataToFetch, tokenUriToGet]);
    const meta = await axios.get(tokenURI);

    let price = ethers.utils.formatUnits(data.price.toString(), "ether");

    let item = {
      price,
      tokenId: data.tokenId.toNumber(),
      seller: data.seller,
      owner: data.owner,
      image: meta.data.image,
      name: meta.data.name,
      description: meta.data.description,
    };

    setNft(item);
    setHasNft(true);
    setLoader(false);
  }

  return (
    <div className="container-global-nft">
      {loader ? (
        <div>Loading...</div>
      ) : hasNft ? (
        <>
          <ShareNft classSup={"right-16"} />
          <div className="container-image-title-description">
            <Image src={nft.image} width={400} height={400} />
            <div className="container-title-description-button">
              <div className="container-title-description ml-14">
                <h2 className="weight800 font-roboto text-3xl">{nft.name}</h2>
                <p className="weight500 font-roboto text-lg mt-1">
                  {nft.description}
                </p>
              </div>

              <div className="flex ml-14">
                <ButtonPay
                  buyNft={""}
                  nft={nft}
                  price={nft.price}
                  buttonType="OWN"
                  classSup="action-buy"
                />
                <ButtonPay
                  buyNft={""}
                  nft={nft}
                  price={nft.price}
                  buttonType="SELL"
                  classSup="ml-4"
                />
              </div>
            </div>
          </div>

          <div className="container-details-nft w-96 ml-14 mt-14">
            <h2 className="weight800 font-roboto text-2xl">Details</h2>
            <div className="grid gap-4 grid-cols-2 grid-rows-4 mt-6">
              <p className="weight500 font-roboto">Contract address</p>
              <p>0xdz....dfefr</p>
              <p className="weight500 font-roboto">Token ID</p>
              <p className="text-right">3</p>
              <p className="weight500 font-roboto">Number previous seller</p>
              <p className="text-right">8</p>
            </div>
          </div>
        </>
      ) : (
        <div>No NFT found</div>
      )}
    </div> */

  return <p className="weight800 font-roboto text-2xl"> Keep Calm ;)</p>;
}

export default Nft;
