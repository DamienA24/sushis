import React from "react";

import ButtonPay from "../ButtonPay";
import Image from "next/image";

function NftCard({ buyNft, nft }) {
  return (
    <li className={`container-nft-card ${!nft.available ? "opacity-50" : ""}`}>
      <Image src={nft.image} width={240} height={240} />
      <div className="">
        <p className="text-2xl text-center font-roboto weight600">
          {nft.name.toUpperCase()}
        </p>
        <div>
          <p className="text-center font-roboto weight400">{nft.description}</p>
        </div>
      </div>
      <div className="container-button-action-pay">
        {nft.available ? (
          <>
            {" "}
            <ButtonPay
              buyNft={buyNft}
              nft={nft}
              price={nft.price}
              buttonType="OWN"
              classSup="action-buy"
            />
            <ButtonPay
              buyNft={buyNft}
              nft={nft}
              price={nft.price}
              buttonType="SELL"
            />{" "}
          </>
        ) : (
          <p className="text-center font-roboto  font-bold">COMING SOON</p>
        )}
      </div>
    </li>
  );
}

export default NftCard;
