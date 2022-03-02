import crypto from 'crypto-es'
import { ethers, utils } from 'ethers';
import { NET_WORKS_NAME, NET_WORKS } from '../Constants'

const PROJECT_ID = 'd0d11770a8ad40f8b27c83175036482f';

export function aesEncrypt (data, key) {
  return crypto.AES.encrypt(data, key);
}

export function aesDecrypt(encrypted, key) {
  return crypto.AES.decrypt(encrypted, key).toString(crypto.enc.Utf8);
}

export function shortenAddress(address, digits = 4) {
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`;
}

export function convertToEth (_bigNumber) {
  if (_bigNumber) {
    let eth_string = utils.formatEther(_bigNumber);
    return +eth_string; //turn string into number
  } else {
    return 0;
  }
}

export function safeAccess (object, path) {
  return object ? path.reduce((currentObject, currentValue) => {
    return (currentObject && currentObject[currentValue] ? currentObject[currentValue] : null)
  }, object) : null;
}

export function getInfuraProviderByNetwork (network) {
  return new ethers.providers.InfuraProvider(network, PROJECT_ID);
}

export function isAddress (_address) {
  let address = null;
  try {
    address = utils.getAddress(_address);
  } catch {}
  return address;
}

export function getNetworkName (network) {
  const index = NET_WORKS.indexOf(network);
  return NET_WORKS_NAME[index];
}
