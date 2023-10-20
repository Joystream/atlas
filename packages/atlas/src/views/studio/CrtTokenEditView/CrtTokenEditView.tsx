import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { createType } from '@joystream/types'
import Long from 'long'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { ActionBar } from '@/components/ActionBar'
import { CrtPreviewLayout } from '@/components/CrtPreviewLayout'
import { FlexBox } from '@/components/FlexBox'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'
import { VideoPicker } from '@/components/_crt/VideoPicker'
import { Benefit } from '@/components/_inputs/BenefitInput'
import { BenefitsInput } from '@/components/_inputs/BenefitsInput'
import { FormField } from '@/components/_inputs/FormField'
import { MarkdownEditor } from '@/components/_inputs/MarkdownEditor/MarkdownEditor'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { zIndex } from '@/styles'

type CrtPageForm = {
  videoId: string
  benefits: Benefit[]
  about: string
}

export const CrtTokenEditView = () => {
  const { activeChannel, channelId, memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: activeChannel?.creatorToken?.token.id ?? '',
    },
  })

  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const form = useForm<CrtPageForm>({
    defaultValues: {
      videoId: data?.creatorTokenById?.trailerVideo?.id,
      benefits: data?.creatorTokenById?.benefits,
      about: data?.creatorTokenById?.description ?? '',
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!joystream || !memberId || !channelId) {
      return
    }

    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).creatorTokenIssuerRemark(
          memberId,
          channelId,
          {
            updateTokenMetadata: {
              newMetadata: {
                ...(data.about ? { description: data.about } : {}),
                ...(data.benefits
                  ? { benefits: data.benefits.map((benefit, idx) => ({ ...benefit, displayOrder: idx })) }
                  : {}),
                ...(data.videoId ? { trailerVideoId: createType('Long', +data.videoId) as Long } : {}),
              },
            },
          },
          proxyCallback(updateStatus)
        ),
      onTxSync: async () => {
        displaySnackbar({
          title: 'Success',
          iconType: 'success',
        })
        client.refetchQueries({ include: 'active' })
        // onClose()
      },
      onError: () => {
        displaySnackbar({
          title: 'Something went wrong',
        })
        // onClose()
      },
    })
  })

  if (!data?.creatorTokenById) return null

  return (
    <Wrapper>
      <CrtPreviewLayout
        mode="preview"
        token={data.creatorTokenById}
        tokenDetails={
          mode === 'edit' ? (
            <FlexBox gap={12} flow="column">
              <Controller
                name="videoId"
                control={form.control}
                render={({ field }) => <VideoPicker selectedVideo={field.value} setSelectedVideo={field.onChange} />}
              />
              <FormField label="Benefits" description="Add benefits and utilities for holders of your token.">
                <BenefitsInput name="benefits" control={form.control} />
              </FormField>
              <Controller
                name="about"
                control={form.control}
                render={({ field }) => (
                  <FormField
                    label="About"
                    description="Tell the story of your token, share all important details. Use markdown to add headings, images and embed your JOYstream videos. "
                  >
                    <MarkdownEditor value={field.value} onChange={field.onChange} />
                  </FormField>
                )}
              />
            </FlexBox>
          ) : (
            <TokenDetails
              videoId={form.getValues('videoId')}
              about={form.getValues('about')}
              benefits={form.getValues('benefits')}
            />
          )
        }
      />
      <StyledActionBar
        tertiaryButton={
          mode === 'edit'
            ? {
                text: 'Preview',
                onClick: () => setMode('preview'),
              }
            : undefined
        }
        secondaryButton={
          mode === 'edit'
            ? {
                text: 'Cancel',
                onClick: () => form.reset(),
              }
            : undefined
        }
        isNoneCrypto
        primaryButton={
          mode === 'edit'
            ? { text: 'Publish', onClick: handleSubmit }
            : {
                text: 'Edit',
                onClick: () => setMode('edit'),
              }
        }
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding-bottom: 80px;
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  bottom: 0;
  z-index: ${zIndex.sideNav - 1};
`
