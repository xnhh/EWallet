import React, { useState, createContext, useContext, useMemo } from "react";

const NetworkContext = createContext();

function useNetworkContext () {
  return useContext(NetworkContext);
}

export default function Provider ({ children }) { 
  const [network, setNetwork] = useState("homestead");

  return (
    <NetworkContext.Provider value={useMemo(() => [network, setNetwork], [network, setNetwork])}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useUpdateNetwork () {
  const [, setNetwork] = useNetworkContext();
  return setNetwork;
}

export function useNetwork () {
  const [network,] = useNetworkContext();
  return network;
}