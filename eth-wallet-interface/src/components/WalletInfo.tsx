// WalletInfo.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface WalletInfoProps {
  address: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ address }) => {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const walletBalance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(walletBalance));
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance ? `${balance} ETH` : "Loading..."}</p>
    </div>
  );
};

export default WalletInfo;
