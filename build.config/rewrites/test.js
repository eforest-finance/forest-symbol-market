function getBasePath() {
  return '/symbolmarket';
}

module.exports = [
  { source: `${getBasePath()}/api/:path*`, destination: 'https://test.eforest.finance/api/:path*', basePath: false },
  { source: `${getBasePath()}/cms/:path*`, destination: 'https://test.eforest.finance/cms/:path*', basePath: false },
  {
    source: `${getBasePath()}/connect/:path*`,
    destination: 'https://test.eforest.finance/connect/:path*',
    basePath: false,
  },
  {
    source: `/AElfIndexer_DApp/:path*`,
    destination: 'https://dapp-portkey-test.portkey.financeAElfIndexer_DApp/:path*',
    basePath: false,
  },
  {
    source: `/AElfIndexer_Inscription/:path*`,
    destination: 'http://192.168.67.216:8103/AElfIndexer_Inscription/:path*',
    basePath: false,
  },
];
