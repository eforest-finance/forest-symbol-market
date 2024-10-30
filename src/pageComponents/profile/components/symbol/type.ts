import { SEED_STATUS } from 'constants/seedDtail';
import { SupportedELFChainId } from 'types';
import { getChainPrefix } from 'utils/common';
import { ChainId } from '@portkey/types';

export enum SeedStatusEnum {
  Used = SEED_STATUS.REGISTERED,
  Available = SEED_STATUS.UNREGISTERED,
}

export enum TokenType {
  FT,
  NFT,
}

export type ChainType = 'aelf MainChain' | 'aelf dAppChain';

export enum FilterTypeEnum {
  Type = 'Type',
  Available = 'Availability',
  Chain = 'Blockchain',
}

export const getFilterList = (isMobile: boolean, ChainId: string) => {
  return [
    {
      label: FilterTypeEnum.Type,
      className: 'w-[128px] !mr-6',
      defaultValue: -1,
      options: [
        {
          label: isMobile ? 'All Types' : 'All',
          value: -1,
        },
        {
          label: 'Token',
          value: TokenType.FT,
        },
        {
          label: 'NFT',
          value: TokenType.NFT,
        },
      ],
    },
    {
      label: FilterTypeEnum.Available,
      className: 'w-[128px] !mr-6',
      defaultValue: -1,
      options: [
        {
          label: isMobile ? 'All Statuses' : 'All',
          value: -1,
        },
        {
          label: 'Used',
          value: SEED_STATUS.REGISTERED,
        },
        // {
        //   label: 'Expired',
        //   value: 'Expired',
        // },
        {
          label: 'Available',
          value: SEED_STATUS.UNREGISTERED,
        },
      ],
    },
    {
      label: FilterTypeEnum.Chain,
      className: 'w-[128px]',
      defaultValue: isMobile ? 'All Chains' : 'All',
      options: [
        {
          label: isMobile ? 'All Chains' : 'All',
          value: 'All',
        },
        {
          label: 'aelf MainChain',
          value: 'AELF',
        },
        {
          label: 'aelf dAppChain',
          value: ChainId,
        },
      ],
    },
  ];
};
