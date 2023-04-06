import { AppAction, IAppAction } from '@joystream/metadata-protobuf'
import { u8aToHex, u8aToU8a } from '@polkadot/util'
import { useCallback } from 'react'

import { useGetAppActionSignatureMutation } from '@/api/queries/__generated__/admin.generated'
import { AppActionActionType } from '@/api/queries/__generated__/baseTypes.generated'
import { atlasConfig } from '@/config'
import { JoystreamLibError } from '@/joystream-lib/errors'
import { RawMetadataProcessorFn } from '@/joystream-lib/types'
import { useUser } from '@/providers/user/user.hooks'

import { useGetTotalChannelsAndTotalVideosLazyQuery } from '../queries/__generated__/channels.generated'

export const useAppActionMetadataProcessor = (
  creatorId: string,
  actionType: AppActionActionType
): RawMetadataProcessorFn => {
  const [signatureMutation] = useGetAppActionSignatureMutation()
  const { channelId, memberId } = useUser()
  const [getTotalChannelsAndTotalVideos] = useGetTotalChannelsAndTotalVideosLazyQuery()

  return useCallback(
    async (rawMetadataU8a: Uint8Array, assetsU8a: Uint8Array) => {
      if (!memberId) {
        throw Error("MemberId wasn't provided")
      }
      const { data } = await getTotalChannelsAndTotalVideos({
        variables: {
          channelId: channelId || '',
          memberId: memberId || '',
        },
        fetchPolicy: 'network-only',
      })

      // If channels length is 0 it probably means that during the video creation channel was excluded by operator
      if (actionType === AppActionActionType.CreateVideo && !data?.membershipById?.channels.length) {
        throw new JoystreamLibError({ name: 'ChannelExcludedError' })
      }

      const nonce =
        (actionType === AppActionActionType.CreateVideo
          ? data?.membershipById?.channels[0]?.totalVideosCreated
          : data?.membershipById?.totalChannelsCreated) || 0

      if (atlasConfig.general.appId) {
        const { data } = await signatureMutation({
          variables: {
            assets: u8aToHex(assetsU8a),
            actionType: actionType,
            nonce,
            rawAction: u8aToHex(rawMetadataU8a),
            creatorId,
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
    [channelId, memberId, getTotalChannelsAndTotalVideos, actionType, signatureMutation, creatorId]
  )
}
