import Copy from 'components/Copy';
import { useSelector } from 'react-redux';
import { OmittedType, getOmittedStr } from 'utils/addressFormatting';
import { getStatusTileOrDesc } from './SeedStatus';
import { explorerURL } from 'utils/getExplorerUrl';
//import

interface ISeedTitleProps {
  seedName?: string;
  chainId?: string;
  owner?: string;
  status?: number;
}
const { NEXT_PUBLIC_APP_ENV } = process.env;

function OwnerDescription({ owner, chainId }: Pick<ISeedTitleProps, 'owner' | 'chainId'>) {
  const info = useSelector((store: any) => store.elfInfo.elfInfo);
  if (!owner) return null;
  const fullAddress = `ELF_${owner}_${chainId || (info.curChain as Chain)}`;

  const url = explorerURL[NEXT_PUBLIC_APP_ENV || 'AELF'];
  const jumpBrowser = () => {
    if (chainId === 'AELF') {
      window.open(`${url}/${info.curChain}/address/${fullAddress}`);
    } else {
      window.open(`${url}/${info.curChain}/address/${fullAddress}`);
    }
  };
  return (
    <span className="flex items-center text-[16px] font-medium">
      <span className="text-[#796F94]"> Owned by </span>
      <span className="text-dark-link mx-1 cursor-pointer" onClick={jumpBrowser}>
        {getOmittedStr(fullAddress, OmittedType.CUSTOM)}
      </span>
      <Copy value={fullAddress} />
    </span>
  );
}

function SeedTitle({ seedDetailInfo }: { seedDetailInfo: ISeedDetailInfo }) {
  const { seedName, owner, chainId } = seedDetailInfo || {};
  const { statusTitle } = getStatusTileOrDesc(seedDetailInfo || {});
  console.log('seed title', statusTitle);
  return (
    <div className="flex flex-col">
      <span className="text-[36px] leading-[46px] pcMin:text-[48px] pcMin:leading-[64px] font-bold break-all">
        <span className="text-primary-color">SEED-</span>
        <span className="text-white">{String(seedName || '').substring(5)}</span>
      </span>
      {statusTitle === 'Not Supported' || owner ? null : (
        <span className="text-[14px] text-[#796F94]">This is the symbol for token your create</span>
      )}
      {statusTitle !== 'Not Supported' ? <OwnerDescription owner={owner} chainId={chainId} /> : null}
    </div>
  );
}

export { SeedTitle };
