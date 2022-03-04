import { useMemo } from "react";
import Jazzicon from 'jazzicon'

export function useAddressIcon (address, size) {
  return useMemo(() => {
    return Jazzicon(size, parseInt(address.slice(2, 8)) * 100);
  }, [address, size]);
}