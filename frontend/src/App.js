import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
        await getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  // connect wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        alert("hey get metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;
      console.log("wave starting...");
      if (ethereum) {
        // get the provider
        const provider = new ethers.providers.Web3Provider(ethereum);
        console.log("got provider:", provider);

        // get chainId
        const { chainId } = await provider.getNetwork();
        console.log("your current chainId: ", chainId);

        // get the signer and contract
        const signer = provider.getSigner();
        console.log("got signer:", signer);
          const contractAddress = getContractByChainId(chainId);

        // here is the waveContract
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("got contract");
        const gasPrice = provider.getGasPrice(); 
        const opts = { gasPrice: gasPrice, gasLimit: 85000, nonce: 45, value: 0 };
        let count = await wavePortalContract.getTotalWaves(opts);
        console.log("contract called getTotalWaves");
        console.log("Retrieved total wave count...", count.toNumber());

        // write to contract
        const waveTxn = await wavePortalContract.wave("hi", { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("retrieved total wave count should have increased ... ", count.toNumber());

      } else {
        console.log("Eth obj doesn't exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
         // get chainId
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        console.log("your current chainId: ", chainId);

        // get the signer and contract
        const signer = provider.getSigner();
        console.log("got signer:", signer);
        const contractAddress = getContractByChainId(chainId);
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Call the getAllWaves method from your Smart Contract
        const waves = await wavePortalContract.getAllWaves();
        
        // We only need address, timestamp, and message in our UI so let's pick those out
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        // Store our data in React State
        setAllWaves(wavesCleaned);
        
        // listen to wave events
        wavePortalContract.on("NewWave", ( from, timestamp, message ) => {
          console.log("new wave", from, timestamp, message);

          setAllWaves(prevState => [...prevState, {
            address: from,
            timestamp: new Date(timestamp * 1000),
            messsage: message,
          }]);
        });
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          try clicking the button to wave
        </div>

        <button className="waveButton" onClick={wave}>
          ~ ~ ~ W A V E ~ ~ ~
        </button>

        { !currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

function getContractByChainId(id) {
  if (id === 4002) { // fantomTestnet
    return "0x0F54CBBbC99c1F282be66201F61A6db1d3371ebE";
  } else if (id === 4) { // rinkeby
    return "0x8b25B442e481E5D50066E4B8C201f180eCB33cfb";
  } else {
    console.log("getContractByChainId, unknownChain: ", id);
    return "Unknown chain!"
  }
}

export default App
