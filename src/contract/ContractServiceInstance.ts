import { SupportedELFChainId } from 'constants/chain';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { ICallContractParams } from '@aelf-web-login/wallet-adapter-base';

export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

type MethodType = <T, R>(params: ICallContractParams<T>) => Promise<R>;

export default class WebLoginInstance {
  public contract: any;
  public address: string | undefined;
  public chainId: string | undefined;
  private sendMethod?: MethodType = undefined;
  private viewMethod?: MethodType = undefined;

  private static instance: WebLoginInstance | null = null;
  private context: any = null;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!WebLoginInstance.instance) {
      WebLoginInstance.instance = new WebLoginInstance();
    }
    return WebLoginInstance.instance;
  }

  setWebLoginContext(context: WebLoginInterface) {
    this.context = context;
  }

  setMethod({ chain, sendMethod, viewMethod }: { chain: Chain; sendMethod: MethodType; viewMethod: MethodType }) {
    this.sendMethod = sendMethod;
    this.viewMethod = viewMethod;
  }

  setContractMethod(
    contractMethod: {
      chain: Chain;
      sendMethod: MethodType;
      viewMethod: MethodType;
    }[],
  ) {
    contractMethod.forEach((item) => {
      this.setMethod(item);
    });
  }

  getWebLoginContext() {
    return this.context; // wallet, login, loginState
  }

  contractSendMethod<T, R>(chain: Chain, params: ICallContractParams<T>): Promise<R> {
    const contractMethod = this.sendMethod;
    if (!contractMethod) {
      throw new Error('Error: Invalid chain ID');
    }
    return contractMethod(params);
  }

  contractViewMethod<T, R>(chain: Chain, params: ICallContractParams<T>): Promise<R> {
    const contractMethod = this.viewMethod;
    if (!contractMethod) {
      throw new Error('Error: Invalid chain ID');
    }
    return contractMethod(params);
  }

  callContract<T>(params: ICallContractParams<T>) {
    return this.context?.callContract(params);
  }
}

export const webLoginInstance = WebLoginInstance.get();
