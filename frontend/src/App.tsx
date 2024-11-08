import React, { useState } from "react";
import { Hexagon } from 'lucide-react';
import Web3 from "web3";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp?: string;
}

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
        fetchBalanceAndTransactions(web3, accounts[0]);
      } else {
        setError("MetaMask is not installed. Please install it to use this feature.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet.");
    }
  };

  const fetchBalanceAndTransactions = async (web3: Web3, address: string) => {
    try {
      // Fetch Balance
      const balanceInWei = await web3.eth.getBalance(address);
      setBalance(web3.utils.fromWei(balanceInWei, "ether"));

      // Fetch last 10 transactions using Etherscan API
      const apiKey = process.env.ETHERSCAN_API_KEY;
      if (!apiKey) {
        throw new Error("Etherscan API key is missing");
      }
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data');
      }

      const data = await response.json();
      if (data.status === "1") {
        const last10Transactions = data.result.slice(0, 10).map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: web3.utils.fromWei(tx.value, "ether"),
          timestamp: new Date(Number(tx.timeStamp) * 1000).toLocaleString(),
        }));
        setTransactions(last10Transactions);
      } else {
        setError("Could not fetch transactions.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 font-mono text-gray-300">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 opacity-50 blur-xl"></div>
        <div className="relative bg-gray-900 rounded-xl shadow-xl p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            {[...Array(20)].map((_, i) => (
              <Hexagon key={i} className="absolute text-gray-400" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 40 + 10}px`
              }} />
            ))}
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Ethereum Wallet
          </h1>

          {walletAddress ? (
            <div>
              <div className="bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-sm mb-2">
                  <span className="text-gray-500">Address:</span> {walletAddress}
                </p>
                <p className="text-lg font-bold">
                  <span className="text-gray-500">Balance:</span> {balance} ETH
                </p>
              </div>

              <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.map((tx, index) => (
                  <div key={index} className="bg-gray-800 p-2 rounded text-xs">
                    <p className="truncate"><span className="text-gray-500">Hash:</span> {tx.hash}</p>
                    <p className="truncate"><span className="text-gray-500">From:</span> {tx.from}</p>
                    <p className="truncate"><span className="text-gray-500">To:</span> {tx.to}</p>
                    <p><span className="text-gray-500">Value:</span> {tx.value} ETH</p>
                    <p className="text-right text-gray-500">{tx.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Connect Wallet
            </button>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
