import React, { createContext, useContext, useState } from "react";
import { NFTStorage, File } from "nft.storage";


const IPFSContext = createContext({});

export function IPFSContextProvider(props) {
  const [IPFSuploading, setIPFSuploading] = useState(false);
  const [IPFSerror, setIPFSerror] = useState(null); 
  const [metadataURL, setMetadata]=useState(null)

  async function IPFSupload(data, file) {     
   
    try {
      setIPFSerror(null);
      setIPFSuploading(true);
      setMetadata(null);
      const client = new NFTStorage({token: process.env.REACT_APP_NEW_TOKEN_KEY});   
      
      const metadata = await client.store({
        name: data.name,
        description: data.description,
        price:data.price,
        image: new File([file], file.name, { type: file.type })
      });
      console.log('IPFS URL for the metadata:', metadata.url)
      console.log('metadata.json contents:\n', metadata.data)
      console.log('metadata.json with IPFS gateway URLs:\n', metadata.embed())
      const obj = metadata.url;               
      setMetadata(obj); 
      console.log("=================print here================", metadataURL)
    }
    catch (error) {
      alert(error);
      setIPFSerror(error);
    } finally {
      setIPFSuploading(false);
    }
  }

  return (
    <IPFSContext.Provider value={{ IPFSuploading, IPFSerror, metadataURL, IPFSupload }}>
      {props.children}
    </IPFSContext.Provider>
  );
}

export function useIPFS() {
  return useContext(IPFSContext);
}
