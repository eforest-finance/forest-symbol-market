import { IContractOptions, ContractMethodType, SupportedELFChainId, IContractError } from 'types';

import { multiTokenContractRequest } from './multiTokenContract';
import { proxyContractRequest } from './proxyAccountContract';
import { symbolRegisterContractRequest } from './symbolRegisterContrack';
import { tokenAdapterContractRequest } from './tokenAdapterContract';

export interface IGetBalanceParams {
  symbol: string;
  owner: string;
}

export const GetBalanceByContract = async (
  params: IGetBalanceParams,
  options?: IContractOptions,
): Promise<{ data: { balance: string } }> => {
  const res = (await multiTokenContractRequest('GetBalance', params, {
    ...options,
    type: ContractMethodType.VIEW,
  })) as { data: { balance: string } };
  return res;
};

export const CreateByContract = async (params: any): Promise<ICallSendResponse> => {
  const res: ICallSendResponse = await multiTokenContractRequest('Create', params, {
    chain: SupportedELFChainId.MAIN_NET,
  });
  return res;
};

export const ApproveByContract = async (params: any, options?: IContractOptions): Promise<IContractError> => {
  const res = (await multiTokenContractRequest('Approve', params, {
    ...options,
  })) as IContractError;
  return res;
};

export const CreateTokenByContract = async (params: ICreateTokenParams): Promise<ICallSendResponse> => {
  const res: ICallSendResponse = await tokenAdapterContractRequest('CreateToken', params);
  return res;
};

export const GetAllowanceByContract = async (params: IGetAllowanceParams, options?: IContractOptions): Promise<any> => {
  const res = await multiTokenContractRequest('GetAllowance', params, {
    ...options,
    type: ContractMethodType.VIEW,
  });
  return res;
};

export const ForwardCallByContract = async (params: IForwardCallParams, chain?: Chain): Promise<ISendResult> => {
  const res: ISendResult = await proxyContractRequest('ForwardCall', params, {
    chain,
  });
  return res;
};

export const GetProxyAccountByContract = async (address: string, chain?: Chain): Promise<any> => {
  const res = await proxyContractRequest('GetProxyAccountByProxyAccountAddress', address, {
    chain,
    type: ContractMethodType.VIEW,
  });
  return res;
};

export const BuyByContract = async ({ symbol, issuer }: IBuyParams) => {
  const res = await symbolRegisterContractRequest('Buy', {
    symbol,
    issueTo: issuer,
  });
  return res;
};

export const RegularSeedRenewContract = async (params: any) => {
  const res = await symbolRegisterContractRequest('RegularSeedRenew', params);
  return res;
};

export const SpecialSeedRenewContract = async (params: any) => {
  const res = await symbolRegisterContractRequest('SpecialSeedRenew', params);
  return res;
};
