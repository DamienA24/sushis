/* pages/_app.js */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import DisplayAddressWallet from "../components/DisplayAddressWallet";
import PageConnectWallet from "../components/PageConnectWallet";
import { networks } from "../utils/networks";
import { owner } from "../config";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(true);
  const [network, setNetwork] = useState("");

  const checkIfWalletIsConnected = async () => {
    // First make sure we have access to window.ethereum
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
    } else {
      const account = accounts[0];
      setCurrentAccount(account);
    }

    // This is the new part, we check the user's network chain ID
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);
    ethereum.on("accountsChanged", handleAccountsChanged);

    setLoading(false);
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
    function handleAccountsChanged(_accounts) {
      window.location.reload();
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    setCurrentPath(router.pathname);
  }, [router.pathname]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Boom! This should print out public address once we authorize Metamask.
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-global">
      {!loading ? (
        currentAccount ? (
          network === "Polygon Mumbai Testnet" ? (
            <div>
              {router.route === "/nft/[id]" ? null : (
                <nav className="p-6">
                  <div className="container-nav-first-level">
                    <div>
                      <h2 className="title text-5xl">The Sushis</h2>
                      <h2 className="title text-5xl">Marketplace</h2>
                    </div>
                    <DisplayAddressWallet
                      currentAccount={currentAccount}
                      network={network}
                    />
                  </div>

                  <div className="flex mt-4 mt-10">
                    <Link href="/">
                      <a
                        className={`mr-20 link-nav ${
                          currentPath === "/" ? "weight800" : ""
                        }`}
                      >
                        COLLECTION
                      </a>
                    </Link>
                    <Link href="/my-nfts">
                      <a
                        className={`mr-20 link-nav ${
                          currentPath === "/my-nfts" ? "weight800" : ""
                        }`}
                      >
                        MY NFT'S{" "}
                      </a>
                    </Link>
                    <Link href="/about-sushis">
                      <a
                        className={`mr-20 link-nav ${
                          currentPath === "/about-sushis" ? "weight800" : ""
                        }`}
                      >
                        ABOUT SUSHIS
                      </a>
                    </Link>

                    {currentAccount.toLocaleLowerCase() ===
                    owner.toLocaleLowerCase() ? (
                      <Link href="/create-item">
                        <a
                          className={`link-nav ${
                            currentPath === "/create-item" ? "weight800" : ""
                          }`}
                        >
                          CREATOR ITEM
                        </a>
                      </Link>
                    ) : null}
                  </div>
                </nav>
              )}

              <Component {...pageProps} currentAccount={currentAccount} />
            </div>
          ) : (
            <p className="text-center mt-40">
              Please connect to Polygon Mainnet
            </p>
          )
        ) : (
          <PageConnectWallet connectWallet={connectWallet} />
        )
      ) : (
        <div className="loader"></div>
      )}
    </div>
  );
}

export default MyApp;
