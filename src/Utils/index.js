import crypto from 'crypto-es'
import { ethers, utils } from 'ethers';
import { NET_WORKS_NAME, NET_WORKS, CHAINID_TO_NETWORK, ETHERSCAN_PREFIXES, NETWORK_TO_CHAINID } from '../Constants'

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

export function getNetwordByChainId (chainId) {
  return CHAINID_TO_NETWORK[chainId];
}

export function getChainIdByNetwork (network) {
  return +NETWORK_TO_CHAINID[network];
}

export function getEtherscanLink(network, data, type){
  const prefix = `https://${ETHERSCAN_PREFIXES[network] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token':{
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function nodeToString (node) {
  let tmpNode = document.createElement("div");
  tmpNode.appendChild(node.cloneNode(true));
  let str = tmpNode.innerHTML;
  tmpNode = node = null;
  console.log(str);
  return str;
}
