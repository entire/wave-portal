import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const contractABI = abi.abi;

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


        const { chainId } = await provider.getNetwork();
        console.log("your current chainId: ", chainId);

        // get the signer
        const signer = provider.getSigner();
        console.log("got signer:", signer);

        // here is the waveContract
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log("got contract");
        const gasPrice = provider.getGasPrice(); 
        const opts = { gasPrice: gasPrice, gasLimit: 85000, nonce: 45, value: 0 };
        let count = await wavePortalContract.getTotalWaves(opts);
        console.log("contract called getTotalWaves");
        console.log("Retrieved total wave count...", count.toNumber());

        // write to contract
        const waveTxn = await wavePortalContract.wave();
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
          i am july 
        </div>

        <button className="waveButton" onClick={wave}>
          wave you fool
        </button>

        { !currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App
