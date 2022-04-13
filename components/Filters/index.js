import React from "react";

function Filters({ filter }) {
  return (
    <select
      onChange={filter}
      className="classic font-roboto weight400 border-4 rounded-lg border-black p-2 bg-transparent"
    >
      <option value="">SORT BY</option>
      <option value="listedAt__last">RECENTLY LISTED</option>
      <option value="price__low">PRICE LOW TO HIGH</option>
      <option value="price__high">PRICE HIGH TO LOW</option>
      <option value="available__true">AVAILABLE</option>
      <option value="available__false">COMING SOON</option>
      <option value="soldAt__last">RECENTLY SOLD</option>
    </select>
  );
}

export default Filters;
