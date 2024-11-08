// TransactionList.tsx
import React from 'react';
import { ethers } from 'ethers';

interface Transaction {
  hash: string;
  value: ethers.BigNumber;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx.hash}>
          {ethers.utils.formatEther(tx.value)} ETH - {tx.hash}
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
