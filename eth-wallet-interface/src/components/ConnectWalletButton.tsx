// ConnectWalletButton.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';

const ConnectWalletButton: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const walletAddress = await signer.getAddress();
        setAddress(walletAddress);
        console.log("Connected wallet:", walletAddress);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  return (
    <button onClick={connectWallet}>
      {address ? `Connected: ${address.substring(0, 6)}...${address.slice(-4)}` : "Connect Wallet"}
    </button>
  );
};

export default ConnectWalletButton;
