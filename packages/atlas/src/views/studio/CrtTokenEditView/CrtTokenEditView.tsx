import styled from '@emotion/styled'
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
import { useUser } from '@/providers/user/user.hooks'
import { zIndex } from '@/styles'

type CrtPageForm = {
  videoId: string
  benefits: Benefit[]
  about: string
}

export const CrtTokenEditView = () => {
  const { activeChannel } = useUser()
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
        secondaryButton={{
          text: mode === 'edit' ? 'Preview' : 'Edit',
          onClick: () => setMode((prev) => (prev === 'edit' ? 'preview' : 'edit')),
        }}
        primaryButton={{ text: 'Publish', onClick: form.handleSubmit((data) => console.log(data)) }}
        isNoneCrypto
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
