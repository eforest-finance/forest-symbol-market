interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request?: (...args: any[]) => void;
    chainId?: number;
  };
  web3?: {};
  plus?: any;
  NightElf?: {};
  dataLayer: [];
}

interface HTMLAttributes<T> {
  scrollTop?: number;
}

declare interface ICallSendResponse {
  TransactionId: string;
}

declare interface File extends Blob {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/lastModified) */
  readonly lastModified: number;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/name) */
  readonly name: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/File/webkitRelativePath) */
  readonly webkitRelativePath: string;
  readonly originFileObj: any;
}

declare type Chain = 'AELF' | 'tDVV' | 'tDVW';

declare module 'aelf-sdk';

declare namespace AElf {
  function ajax(url: string, settings?: any): void;
}
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare interface IListParams {
  skipCount?: number;
  maxResultCount?: number;
}
