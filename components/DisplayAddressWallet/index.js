import React from "react";

import Image from "next/image";

import polygonLogo from "../../assets/polygonlogo.png";
import ethLogo from "../../assets/ethlogo.png";

function DisplayAddressWallet({ currentAccount, network }) {
  return (
    <div className="container-global-display-address">
      <div className="container-display-address">
        <Image
          alt="Network logo"
          className="logo"
          src={network && network.includes("Polygon") ? polygonLogo : ethLogo}
        />
        {currentAccount ? (
          <p>
            {" "}
            Wallet: {currentAccount.slice(0, 6)}...
            {currentAccount.slice(-4)}{" "}
          </p>
        ) : (
          <p> NOT CONNECTED </p>
        )}
      </div>
    </div>
  );
}

export default DisplayAddressWallet;
