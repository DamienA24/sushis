import React from "react";

function About() {
  return (
    <div className="ml-6">
      <p className="font-roboto font-bold text-2xl">Description : </p>
      <p className="font-roboto mt-2 text-lg">
        Sushi is a decentralized marketplace for crypto assets on Polygon. The
        sushi contract is a smart contract that allows users to buy and sell
        nft's. It's a ERC721 smart contract.
      </p>

      <p className="font-roboto font-bold mt-2 text-2xl">Principle : </p>
      <p className="font-roboto mt-2 text-lg">You have two choices :</p>
      <p className="font-roboto text-lg">
        You can become a "seller" for the price indicate in the card and
        automatically the price increase 25%, after that if someone become
        "owner" or "seller" you earn ;) <br />
        or
      </p>
      <p className="font-roboto text-lg">
        You can become a "owner" for the price indicate in the card and after
        that the nft will belong to you
      </p>
    </div>
  );
}

export default About;
