import React, { useState } from "react";

import Image from "next/image";

import DisplayAddressWallet from "../DisplayAddressWallet";
import ButtonConnectWallet from "../ButtonConnectWallet";
import sushiPres from "../../assets/sushi-pres.png";

function PageConnectWallet({ connectWallet }) {
  return (
    <div className="container-global-page-connect-wallet">
      <div className="container-global-description-connect-wallet">
        <div className="container-global-description">
          <h2 className="title text-6xl text-center">The Sushis </h2>
          <h2 className="title margin-negative text-6xl text-center">
            Marketplace
          </h2>
          <p className="text-presentation">
            Earn 20% when you become seller <br />
            or buy your own sushi
          </p>
        </div>
        <ButtonConnectWallet connectWallet={connectWallet} />
      </div>
      <div className="container-global-image-address">
        <DisplayAddressWallet />
        <div className="container-display-image-home">
          <Image
            alt="Sushi logo"
            className="sushiPres"
            src={sushiPres}
            layout="responsive"
          />
        </div>
      </div>
    </div>
  );
}

export default PageConnectWallet;
