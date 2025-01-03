import { store } from 'redux/store';
import { SupportedELFChainId, IContractOptions, ContractMethodType, ISendResult, IContractError } from 'types';
import { sleep } from 'utils/common';
import { getTxResult } from 'utils/getTxResult';

import { GetContractServiceMethod } from './baseContract';
import { formatErrorMsg } from './util';

export const proxyContractRequest = async <T, R>(
  methodName: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().elfInfo.elfInfo;
  const contractAddressMap = {
    main: info?.proxyMainAddress || '',
    side: info?.proxySideAddress || '',
  };
  const contractAddress = (options?.chain === SupportedELFChainId.MAIN_NET
    ? contractAddressMap.main
    : contractAddressMap.side) as unknown as string;

  const curChain: Chain = options?.chain || (info?.curChain as Chain);

  console.log(
    '=====proxyContractRequest methodName, type, contractAddress, curChain, params: ',
    methodName,
    options?.type,
    contractAddress,
    curChain,
    params,
  );

  const CallContractMethod = GetContractServiceMethod(curChain, options?.type);

  try {
    const res: R = await CallContractMethod({
      chainId: curChain,
      contractAddress,
      methodName,
      args: params,
    });
    console.log('=====proxyContractRequest res: ', methodName, res);
    const result = res as IContractError;

    if (result?.error || result?.code || result?.Error) {
      throw formatErrorMsg(result);
    }

    if (options?.type === ContractMethodType.VIEW) {
      return res;
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    await sleep(1000);
    const transaction = await getTxResult(resTransactionId!, curChain as Chain);

    console.log('=====proxyContractRequest transaction: ', methodName, transaction);
    return { TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult };
  } catch (error) {
    console.error('=====multiTokenContractRequest error:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    throw formatErrorMsg(resError);
  }
};
