import React from "react";

function ButtonConnectWallet({ connectWallet }) {
  return (
    <div className="connect-wallet-container">
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        CONNECT WALLET
      </button>
    </div>
  );
}

export default ButtonConnectWallet;
