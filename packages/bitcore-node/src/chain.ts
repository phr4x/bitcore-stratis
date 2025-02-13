module.exports = {
  BTC: {
    lib: require('bitcore-lib'),
    p2p: require('bitcore-p2p')
  },
  BCH: {
    lib: require('bitcore-lib-cash'),
    p2p: require('bitcore-p2p-cash')
  },
  STRAX: {
    lib: require('bitcore-lib-stratis'),
    p2p: require('bitcore-p2p')
  },
  CRS: {
    lib: require('bitcore-lib-cirrus'),
    p2p: require('bitcore-p2p')
  }
};
