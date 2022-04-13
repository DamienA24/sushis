import React from "react";

import Image from "next/image";

import polygonLogo from "../../assets/polygonlogo.png";

function ButtonPay({ buyNft, nft, price, buttonType, classSup = "" }) {
  const multiplication = buttonType === "OWN" ? 2 : 1;
  return (
    <button
      className={`font-bold  button-action-pay font-roboto ${classSup}`}
      onClick={() => buyNft(nft, buttonType)}
    >
      {buttonType}{" "}
      <div className="container-logo-price">
        {(price * multiplication).toFixed(3)}
        <Image
          alt="Network logo"
          className="logo-icon"
          src={polygonLogo}
          height={15}
          width={15}
        />
      </div>
    </button>
  );
}

export default ButtonPay;
