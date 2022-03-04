export const NET_WORKS_NAME = [
  '网络',
  '以太坊主网络',
  'Ropsten测试网络',
  'Rinkeby 测试网络',
  'Kovan 测试网络',
  'Localhost 8545'
];

export const NET_WORKS = [
  'network',
  'homestead',
  'ropsten',
  'rinkeby',
  'kovan',
  'localhost'
]

export const CHAINID_TO_NETWORK = {
  1:'homestead',
  3:"ropsten",
  4:"rinkeby",
  42:'kovan'
}

export const NETWORK_TO_CHAINID = {
  'homestead': 1,
  'ropsten': 3,
  'rinkeby': 4,
  'kovan': 42
}

export const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  42: 'kovan.'
}