interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: Array<any> }) => Promise<any>;
      on?: (eventName: string, callback: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }
  