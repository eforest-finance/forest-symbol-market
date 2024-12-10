import { message } from 'antd';
import {
  ApproveByContract,
  BuyByContract,
  GetAllowanceByContract,
  RegularSeedRenewContract,
  SpecialSeedRenewContract,
} from 'contract';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, store } from 'redux/store';
import { SupportedELFChainId } from 'types';
import { timesDecimals } from 'utils/calculate';
import BigNumber from 'bignumber.js';
import { useMount } from 'react-use';
import { fetchTransactionFee } from 'api/seedDetail';
import { useRequest } from 'ahooks';
import { getSeedRenew } from 'api/request';

export function useRenewService() {
  const walletInfo = useSelector((store) => store.userInfo.walletInfo);
  const Renew = useCallback(
    async (seedDetailInfo: ISeedDetailInfo, address: string) => {
      const { symbol, tokenPrice, seedType, topBidPrice } = seedDetailInfo;
      const info = store.getState().elfInfo.elfInfo;

      const allowance = await GetAllowanceByContract(
        {
          spender: info?.symbolRegisterMainAddress || '',
          symbol: 'ELF',
          owner: walletInfo.aelfChainAddress || address,
        },
        {
          chain: SupportedELFChainId.MAIN_NET,
        },
      );
      console.log('allowance res', allowance);

      if (allowance.error) {
        message.error(allowance.errorMessage?.message || 'unknown error');
      }

      const bigA = timesDecimals(seedType == 3 ? topBidPrice?.amount : tokenPrice?.amount || 0, 8);
      const allowanceBN = new BigNumber(allowance?.data.allowance);
      console.log(bigA, 'bigA');
      if (allowanceBN.lt(bigA)) {
        const approveRes = await ApproveByContract(
          {
            spender: info?.symbolRegisterMainAddress,
            symbol: tokenPrice?.symbol || 'ELF',
            amount: Number(timesDecimals(seedType == 3 ? topBidPrice?.amount : tokenPrice?.amount || 0, 8)),
          },
          {
            chain: SupportedELFChainId.MAIN_NET,
          },
        );
        console.log('token approve finish', approveRes);
      }
      if (seedType == 3) {
        const data = await getSeedRenew({
          BuyerAddress: walletInfo.aelfChainAddress || address,
          SeedSymbol: seedDetailInfo.seedSymbol,
        });

        const params = {
          buyer: data.buyer,
          seedSymbol: data.seedSymbol,
          price: { priceAmount: data.priceAmount, priceSymbol: data.priceSymbol },
          opTime: data.opTime,
          requestHash: data.requestHash,
        };
        const res = await SpecialSeedRenewContract(params);
        return res;
      }

      const res = await RegularSeedRenewContract({
        seedSymbol: seedDetailInfo.seedSymbol,
        price: {
          symbol: tokenPrice.symbol,
          amount: tokenPrice.amount * 10 ** 8,
        },
      });
      return res;
    },
    [walletInfo],
  );

  return { Renew };
}

// api/app/seed/transaction-fee
export function useTransactionFee() {
  const [transactionFee, setTransactionFee] = useState<ITransactionFeeRes>({
    transactionFee: 0,
    transactionFeeOfUsd: 0,
  });
  const { data, run } = useRequest(fetchTransactionFee, { manual: true, pollingInterval: 5000 });
  useMount(() => {
    run();
  });

  useEffect(() => {
    if (!data) return;
    setTransactionFee(data);
  }, [data]);

  return {
    tokenPrice: transactionFee.transactionFee,
    usdPrice: transactionFee.transactionFeeOfUsd,
  };
}
