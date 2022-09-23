/** @format */

import React, { useEffect, useRef, useState } from "react";
import Marketplace from "./../Marketplace.json";
import { ethers } from "ethers";
import { NFTStorage, File } from "nft.storage";
const NEW_TOKEN_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDViOTg4Q0U4NjZBMkQxNTZmNDI5QTcwZDQ5OWExNDM3NmIwNERBOGMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjczNDAxMDk1MSwibmFtZSI6ImNvaW5iYXNlbmZ0In0._E1KnvPg0cJ44QtGx8LN-ZwoZ6CaxkCWybUiOFknVkw";

const CreateNft = () => {
  const [IPFSuploading, setIPFSuploading] = useState(false);
  const [IPFSerror, setIPFSerror] = useState(null);
  const [metadataURL, setMetadata] = useState(null);
  const [formParams, updateFormParams] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const inputFileRef = useRef(null);

  function inputFileHandler() {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      inputFileRef.current.click();
    }
  }

  async function IPFSupload(data, file) {
    try {
      setIPFSerror(null);
      setIPFSuploading(true);
      setMetadata(null);
      const client = new NFTStorage({
        token: NEW_TOKEN_KEY,
      });

      const metadata = await client.store({
        name: data.name,
        description: data.description,
        price: data.price,
        image: new File([file], file.name, { type: file.type }),
      });
      console.log("IPFS URL for the metadata:", metadata.url);
      console.log("metadata.json contents:\n", metadata.data);
      console.log("metadata.json with IPFS gateway URLs:\n", metadata.embed());
      const obj = metadata.url;
      setMetadata(obj);
      console.log("=================print here================", metadataURL);
    } catch (error) {
      alert(error);
      setIPFSerror(error);
    } finally {
      setIPFSuploading(false);
    }
  }

  async function mintNFThandler() {
    const { name, description, price } = formParams;

    if (!name) {
      return alert("NFT Name should not be empty");
    } else if (!description) {
      return alert("NFT Description should not be empty");
    } else if (!selectedFile) {
      return alert("Select a file to upload");
    } else if (!price) {
      return alert("price should be included");
    }

    try {
      if (formParams.price < 0.01) {
        alert("minimum price is 0.01");
      } else {
        await IPFSupload(
          {
            name,
            description,
            price,
          },
          selectedFile
        );
      }
    } catch (error) {
      if (error) {
        alert("failed " + error.message);
      }
    }
  }

  const MintNfts = async () => {
    await mintNFThandler();
    try {
      if (!metadataURL) {
        alert("lease click listNft again");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(
          Marketplace.address,
          Marketplace.abi,
          signer
        );

        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        let transaction = await contract.createToken(
          metadataURL,
          ethers.utils.parseEther(formParams.price.toString()),
          {
            value: listingPrice,
          }
        );
        alert(
          "Please wait.. minting may take upto 5 mins for complete transaction"
        );
        await transaction.wait();
        updateFormParams({ name: "", description: "", price: "" });
        alert("Mint Successfull !");
      }
    } catch (error) {
      if (error) {
        alert("failed " + error.message);
      }
    }
  };

  useEffect(() => {
    if (IPFSuploading) {
      alert("Uploading NFT data To IPFS");
    }
  }, [IPFSuploading]);

  useEffect(() => {
    if (IPFSerror) {
      alert(IPFSerror.message);
    }
  }, [IPFSerror]);

  return (
    <section id="createnft">
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <div className="name">NFT Name </div>
          <input
            type="text"
            placeholder="your NFT name"
            className="mt-8 border rounded p-4"
            value={formParams.name}
            id={formParams.name}
            onChange={(e) =>
              updateFormParams({ ...formParams, name: e.target.value })
            }
          ></input>

          <div className="description">NFT Description</div>
          <textarea
            minLength="10"
            required
            cols="10"
            rows="5"
            type="text"
            placeholder="your NFT details"
            className="mt-2 border rounded p-4"
            id={formParams.description}
            value={formParams.description}
            onChange={(e) =>
              updateFormParams({ ...formParams, description: e.target.value })
            }
          ></textarea>

          <div className="price">price (In ETH)</div>
          <input
            type="number"
            placeholder="min 0.01 ETH"
            className="mt-2 border rounded p-4"
            pattern="^\d*(\.\d{0,4})?$"
            step=".01"
            id={formParams.price}
            value={formParams.price}
            onChange={(e) =>
              updateFormParams({ ...formParams, price: e.target.value })
            }
          ></input>

          <div className="selectfile">
            upload NFT <br />
            <input
              ref={inputFileRef}
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              onClick={inputFileHandler}
            ></input>
          </div>
          <button
            className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg"
            onClick={MintNfts}
          >
            ListNFT
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateNft;
