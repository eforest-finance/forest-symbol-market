import { Button, message } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import BaseModal from 'components/Modal';
import { ApproveByContract, GetAllowanceByContract, GetBalanceByContract } from 'contract';
import { useSelector, store } from 'redux/store';

import { ReactComponent as UnionSvg } from 'assets/images/Union.svg';
import { useEffect, useMemo, useState } from 'react';
import { useRenewService } from '../hooks/useRenewService';
import { SyncOutlined } from '@ant-design/icons';
import SeedImage from 'components/SeedImage';
import TipsModal from 'pageComponents/profile/components/TipsModal';
import { useTransactionFee } from '../hooks/useRenewService';
import LoadingModal from 'components/LoadingModal';
import { cloneDeep, debounce } from 'lodash-es';
import { fixedPrice } from 'utils/calculate';
import { TransactionFailedModal } from './TransactionFailedModal';
import { ReactComponent as ErrorIcon } from 'assets/images/error-icon.svg';
import styles from './style.module.css';
import { formatErrorMsg } from 'utils/formatErrorMsg';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import symbol from 'pageComponents/profile/components/symbol';
import { useGetSymbolService } from '../hooks/useGetSymbol';
import { getSymbolInfo } from 'api/seedDetail';

interface IPayModalProps {
  seedDetailInfo?: ISeedDetailInfo;
  mainAddress: string;
}

export const RenewalModal = NiceModal.create(({ seedDetailInfo: detailInfo, mainAddress }: IPayModalProps) => {
  const info = store.getState().elfInfo.elfInfo;

  const [seedDetailInfo, setSeedDetailInfo] = useState<ISeedDetailInfo>();

  const getSeedDetailInfo = async () => {
    const res: ISeedDetailInfo = await getSymbolInfo({
      symbol: String(detailInfo?.symbol).toUpperCase(),
      tokenType: String(detailInfo?.tokenType).toUpperCase(),
    });
    setSeedDetailInfo(res);
  };

  useEffect(() => {
    getSeedDetailInfo();
  }, [detailInfo]);

  const modal = useModal();
  const tipModal = useModal(TipsModal);
  const transactionFailedModal = useModal(TransactionFailedModal);
  const loadingModal = useModal(LoadingModal);
  const { walletInfo } = useSelector((store) => store.userInfo);
  const [balance, setBalance] = useState<Number>(0);
  const [loadingBalance, setLoadingBalance] = useState<Boolean>(true);

  // const [estTransFee] = useState<{ tokenPrice: number; usdPrice: number }>({
  //   tokenPrice: 0.0035,
  //   usdPrice: 0.03,
  // });

  const { Renew } = useRenewService();
  const transactionFee = useTransactionFee();

  const allPrice = useMemo(() => {
    const { tokenPrice: tokenPriceBase, usdPrice: usdPriceBase } = seedDetailInfo || {};
    const tokenPriceTotal = fixedPrice(Number((tokenPriceBase?.amount || 0) + transactionFee.tokenPrice));
    const usdPriceTotal = fixedPrice(Number((usdPriceBase?.amount || 0) + transactionFee.usdPrice), 2);
    const tokenPriceEst = fixedPrice(Number(transactionFee.tokenPrice));
    const usdPriceEst = fixedPrice(Number(transactionFee.usdPrice), 2);
    const tokenPrice = fixedPrice(Number(tokenPriceBase?.amount || 0));
    const usdPrice = fixedPrice(Number(usdPriceBase?.amount || 0), 2);
    return {
      tokenPriceTotal,
      usdPriceTotal,
      tokenPriceEst,
      usdPriceEst,
      tokenPrice,
      usdPrice,
    };
  }, [seedDetailInfo, transactionFee]);

  const onRenewal = async () => {
    if (!seedDetailInfo?.symbol) return;

    // if (Number(balance) <= Number(allPrice.tokenPriceTotal)) {
    //   tipModal.show({
    //     content: 'Insufficient Balance.',
    //   });
    //   return;
    // }
    loadingModal.show();

    Renew(seedDetailInfo, mainAddress)
      .then(() => {
        setTimeout(() => {
          modal.resolve({
            status: 'ok',
          });
          modal.hide();
          loadingModal.hide();
        }, 5000);
      })
      .catch((error) => {
        // message.error(formatErrorMsg(error?.errorMessage?.message));
        transactionFailedModal.show({
          errorMsg: formatErrorMsg(error?.errorMessage?.message),
        });
        loadingModal.hide();
      });
  };

  const { loginOnChainStatus } = useConnectWallet();

  useEffect(() => {
    async function getBalance() {
      setLoadingBalance(true);

      try {
        const Balance = await GetBalanceByContract(
          {
            owner: walletInfo?.aelfChainAddress || mainAddress,
            symbol: 'ELF',
          },
          { chain: 'AELF' },
        );

        setBalance(Number(Balance?.data.balance) / 10 ** 8);
        setLoadingBalance(false);
      } catch (error) {
        setLoadingBalance(false);
        setBalance(0);
      }
    }

    getBalance();
  }, [walletInfo?.aelfChainAddress, mainAddress, walletInfo, loginOnChainStatus]);
  const disabled = useMemo(() => {
    return Number(balance) <= Number(allPrice.tokenPriceTotal);
  }, [balance, allPrice]);
  const footer = (
    <div className="flex flex-col flex-1">
      {!loadingBalance && disabled && (
        <div className="error-box flex items-center text-left mb-3">
          <ErrorIcon className="w-[14px] h-[14px]" />
          <span className="error-message ml-2 text-sm text-error-color">Insufficient balance</span>
        </div>
      )}
      <Button
        block
        className="!h-[52px]"
        type="primary"
        disabled={disabled}
        onClick={debounce(onRenewal, 1000, { leading: true, trailing: false })}>
        Renewal
      </Button>
    </div>
  );
  return (
    <BaseModal
      width={680}
      open={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      className={styles.buy__modal}
      centered
      footer={footer}
      maskClosable
      title="Confirm Renewal">
      <div className="flex flex-row my-[32px] items-center font-medium">
        {seedDetailInfo && <SeedImage className="shrink-0" seedInfo={seedDetailInfo} />}
        <div className="ml-[16px] text-[14px]">
          <span className="text-primary-color">SEED-</span>
          <span className="text-white break-all">{seedDetailInfo?.symbol || ''}</span>
        </div>
      </div>
      <div className="flex rounded-md justify-between items-center p-4 bg-[#100D1B] border border-solid border-[#231F30] text-[16px] font-medium text-white">
        <span className="flex items-center">
          <UnionSvg className="w-[20px] h-[15px] mr-2" />
          <span>Balance</span>
        </span>
        {loadingBalance ? <SyncOutlined spin /> : <span>{fixedPrice(Number(balance))} ELF</span>}
      </div>
      <div className="mt-6 text-[14px] font-medium">
        <div className="flex justify-between text-[#796F94] mb-3">
          <span>Price</span>
          <span>
            {`${allPrice?.tokenPrice} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{` $ ${allPrice?.usdPrice}`}</span>
          </span>
        </div>
        <div className="flex justify-between text-[#796F94] mb-3">
          <span>Estimated Transaction Fee</span>
          <span>
            {`${allPrice?.tokenPriceEst} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{`$ ${allPrice?.usdPriceEst}`}</span>
          </span>
        </div>
        <div className="flex justify-between text-white">
          <span>Total</span>
          <span>
            {`${allPrice?.tokenPriceTotal} ELF `}
            <span className="text-[12px] ml-1 max-pcMin:flex max-pcMin:justify-end">{` $ ${allPrice?.usdPriceTotal}`}</span>
          </span>
        </div>
      </div>
    </BaseModal>
  );
});
