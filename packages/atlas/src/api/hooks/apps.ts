import { AppAction, IAppAction } from '@joystream/metadata-protobuf'
import { u8aToHex, u8aToU8a } from '@polkadot/util'
import { useCallback } from 'react'

import { useGetAppActionSignatureMutation } from '@/api/queries/__generated__/admin.generated'
import { AppActionActionType } from '@/api/queries/__generated__/baseTypes.generated'
import { atlasConfig } from '@/config'

export const useAppActionMetadataProcessor = (creatorId: string, actionType: AppActionActionType, nonce: number) => {
  const [signatureMutation] = useGetAppActionSignatureMutation()

  return useCallback(
    async (rawMetadataU8a: Uint8Array, assetsU8a: Uint8Array) => {
      if (atlasConfig.general.appId) {
        const { data } = await signatureMutation({
          variables: {
            assets: u8aToHex(assetsU8a),
            nonce,
            rawAction: u8aToHex(rawMetadataU8a),
            creatorId,
            actionType: actionType,
          },
        })
        if (data?.signAppActionCommitment) {
          const appVideoInput: IAppAction = {
            appId: atlasConfig.general.appId,
            rawAction: rawMetadataU8a,
            signature: u8aToU8a(data.signAppActionCommitment.signature),
          }
          return AppAction.encode(appVideoInput).finish()
        }
      }
      return rawMetadataU8a
    },
    [creatorId, nonce, actionType, signatureMutation]
  )
}
