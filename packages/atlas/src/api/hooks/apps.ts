import { AppAction, IAppAction } from '@joystream/metadata-protobuf'
import { Bytes, Option } from '@polkadot/types'
import { PalletContentStorageAssetsRecord } from '@polkadot/types/lookup'
import { stringToU8a } from '@polkadot/util'
import { useCallback } from 'react'

import { useGetAppActionSignatureMutation } from '@/api/queries/__generated__/admin.generated'
import { atlasConfig } from '@/config'
import { wrapMetadata } from '@/joystream-lib/metadata'

export const useAppActionMetadataProcessor = (creatorId: string, nonce?: number) => {
  const [signatureMutation] = useGetAppActionSignatureMutation()

  return useCallback(
    async (rawBytes: Option<Bytes>, assets: Option<PalletContentStorageAssetsRecord>) => {
      if (nonce && atlasConfig.general.appId) {
        const { data } = await signatureMutation({
          variables: {
            assets: assets.toHex(),
            nonce,
            rawAction: rawBytes.toHex(),
            creatorId,
          },
        })
        if (data?.signAppActionCommitment) {
          const appVideoInput: IAppAction = {
            appId: atlasConfig.general.appId,
            rawAction: rawBytes.toU8a(),
            signature: stringToU8a(data.signAppActionCommitment.signature),
            nonce,
          }
          return wrapMetadata(AppAction.encode(appVideoInput).finish())
        }
      }
      return rawBytes
    },
    [creatorId, nonce, signatureMutation]
  )
}
