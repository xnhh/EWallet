import React, { createContext, useCallback, useContext, useEffect, useReducer, useMemo } from "react";
import { safeAccess } from "../../Utils";
import { useGlobal } from "../GlobalProvider";

const UPDATE = 'UPDATE';
const BalancesProvider = createContext();

function useBalancesContext () {
  return useContext(BalancesProvider);
}

function reducer (state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { address, network, value } = payload;
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          [network]: {
            value
          }
        }
      }
    }
    default: {
      throw Error(`Unexpected action type in BalancesContext reducer: '${type}'.`);
    }
  }
}

export default function Provider ({ children }) {
  const [state, dispatch] = useReducer(reducer, {});
  const { wallet, network, provider } = useGlobal();

  const update = useCallback((address, network, value) => {
    dispatch({ type: UPDATE, payload: { address, network, value } });
  }, []);

  useEffect(() => {
    if (wallet) {
      const { address } = wallet;
      let stale = false;
      provider.getBalance(address).then((value) => {
        if (!stale) {
          update(address, network, value);
        }
      }).catch(err => {
        console.log(err);
      })
      provider.on(address, (value) => {
        if (!stale) {
          update(address, network, value);
        }
      });

      return () => {
        stale = true;
        provider.removeAllListeners(address);
      };
    }
  }, [wallet, network, provider, update]);

  return (
    <BalancesProvider.Provider value={useMemo(() => [state, { update }], [state, update])}>
      {children}
    </BalancesProvider.Provider>
  )
}

export function useBalance (address, network) {
  const [state,] = useBalancesContext();
  const { value } = safeAccess(state, [address, network]) || {};
  return value;
}

