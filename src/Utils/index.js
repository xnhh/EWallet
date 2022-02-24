import crypto from 'crypto-browserify'
import { utils } from 'ethers';

export function aesEncrypt (data, key) {
  let cipher = crypto.createCipher('aes192', key);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function aesDecrypt(encrypted, key) {
  let decipher = crypto.createDecipher('aes192', key);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function shortenAddress(address, digits = 4) {
  return `${address.substring(0, digits + 2)}...${address.substring(42 - digits)}`;
}

export function convertToEth (_bigNumber) {
  let eth_string = utils.formatEther(_bigNumber);
  return +eth_string; //turn string into number
}