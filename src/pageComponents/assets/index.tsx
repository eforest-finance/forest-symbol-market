'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { WalletType, useWebLogin, useComponentFlex } from 'aelf-web-login';
import { LeftOutlined } from '@ant-design/icons';

import styles from './style.module.css';
import { useWalletService } from 'hooks/useWallet';
import { useSelector } from 'redux/store';

export default function MyAsset() {
  const router = useRouter();
  const { wallet, walletType, login } = useWebLogin();
  const { isLogin } = useWalletService();

  const info = useSelector((store) => store.elfInfo.elfInfo);

  const { isShowRampBuy, isShowRampSell } = info;

  const { PortkeyAssetProvider, Asset } = useComponentFlex();

  useEffect(() => {
    if (!isLogin) {
      login();
    } else if (walletType !== WalletType.portkey) {
      router.push('/');
    }
  }, [isLogin, router, walletType]);

  return (
    <div className={styles.asset}>
      <PortkeyAssetProvider
        originChainId={wallet?.portkeyInfo?.chainId as Chain}
        pin={wallet?.portkeyInfo?.pin}
        caHash={wallet?.portkeyInfo?.caInfo?.caHash}
        didStorageKeyName={'TSM'}>
        <Asset
          isShowRamp={isShowRampBuy || isShowRampSell}
          isShowRampBuy={isShowRampBuy}
          isShowRampSell={isShowRampSell}
          // faucet={{
          //   faucetContractAddress: configInfo?.faucetContractAddress,
          // }}
          backIcon={<LeftOutlined />}
          onOverviewBack={() => router.back()}
          onLifeCycleChange={(lifeCycle) => {
            console.log(lifeCycle, 'onLifeCycleChange');
          }}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
