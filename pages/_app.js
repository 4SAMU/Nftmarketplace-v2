/**
 * /* pages/_app.js
 *
 * @format
 */

import "../styles/globals.css";
import Link from "next/link";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
   const [currAddress, updateCurrAddress] = useState();
  const walletConnet = async() => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateCurrAddress(String(accounts[0].substring(0, 5)+"..."+String(accounts[0].substring(38))));
    
  }
  
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NftMarketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">Home</a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-blue-500">Sell NFT</a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-blue-500">My NFTs</a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-blue-500">Dashboard</a>
          </Link>
          <div>
            {currAddress ? (
              <button className="mr-6 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded">
                connected to : {currAddress}
              </button>
            ) : (
              <button
                className="mr-6 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded place-items-end"
                onClick={walletConnet}
              >
                connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
