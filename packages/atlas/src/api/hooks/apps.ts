import { AppAction, IAppAction } from '@joystream/metadata-protobuf'
import { stringToU8a } from '@polkadot/util'
import { useCallback } from 'react'

import { useGetAppActionSignatureMutation } from '@/api/queries/__generated__/admin.generated'
import { atlasConfig } from '@/config'
import { wrapMetadata } from '@/joystream-lib/metadata'
import { RawMetadataProcessorFn } from '@/joystream-lib/types'

export const useAppActionMetadataProcessor = (creatorId: string, nonce?: number): RawMetadataProcessorFn => {
  const [signatureMutation] = useGetAppActionSignatureMutation()

  return useCallback(
    async (rawBytes, assets, actionType) => {
      if (nonce && atlasConfig.general.appId) {
        const { data } = await signatureMutation({
          variables: {
            actionType,
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
