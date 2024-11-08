// App.tsx
import React, { useState } from 'react';
import ConnectWalletButton from './components/ConnectWalletButton';
import WalletInfo from './components/WalletInfo';
import TransactionList from './components/TransactionList';
import { ethers } from 'ethers';

const App: React.FC = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<ethers.providers.TransactionResponse[]>([]);

  const handleConnect = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      setAddress(walletAddress);

      // Fetch last 5 transactions for demo purposes
      const transactionHistory = await provider.getHistory(walletAddress);
      setTransactions(transactionHistory.slice(-5));
    }
  };

  return (
    <div>
      <h1>Wallet App</h1>
      <ConnectWalletButton />
      {address && (
        <>
          <WalletInfo address={address} />
          <TransactionList transactions={transactions} />
        </>
      )}
    </div>
  );
};

export default App;
