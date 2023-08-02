import { formatDuration } from 'date-fns'
import { FC, PropsWithChildren } from 'react'

import { SvgActionCheck, SvgActionClose } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { atlasConfig } from '@/config'
import { pluralizeNoun } from '@/utils/misc'

import { CategoriesText, ListItem, Paragraph, StyledList, TickWrapper } from './YppAuthorizationRequirementsStep.styles'
import { useGetYppChannelRequirements } from './useGetYppChannelRequirements'

import { YppAuthorizationErrorCode, YppRequirementsErrorCode } from '../../YppAuthorizationModal.types'

type YppAuthorizationRequirementsStepProps = {
  requirmentsErrorCodes: YppRequirementsErrorCode[]
}

const convertHoursRequirementTime = (hours: number) => {
  if (hours > 24 * 30) {
    return formatDuration({ months: Math.round(hours / (24 * 30)) })
  }
  if (hours > 24) {
    return formatDuration({ days: Math.round(hours / 24) })
  }
  return formatDuration({ hours: hours })
}

export const YppAuthorizationRequirementsStep: FC<YppAuthorizationRequirementsStepProps> = ({
  requirmentsErrorCodes,
}) => {
  const requirements = useGetYppChannelRequirements()
  const checkRequirmentError = (errorCode: YppAuthorizationErrorCode) =>
    !requirmentsErrorCodes.some((error) => error === errorCode)
  const hasAtLeastOneError = !!requirmentsErrorCodes.length
  return (
    <>
      <StyledList>
        {atlasConfig.general.appContentFocus && (
          <SingleRequirement fulfilled important>
            <span>
              The main topic of your videos is {atlasConfig.general.appContentFocus}
              <CategoriesText variant="t100" as="span" color="colorTextMuted">
                {atlasConfig.general.appName} video categories:{' '}
                {atlasConfig.content.categories.map((category) => category.name).join(', ')}
              </CategoriesText>
            </span>
          </SingleRequirement>
        )}
        <SingleRequirement
          fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_CREATION_DATE)}
        >
          Your YouTube channel is at least {convertHoursRequirementTime(requirements?.MINIMUM_CHANNEL_AGE_HOURS || 0)}{' '}
          old
        </SingleRequirement>
        <SingleRequirement fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_VIDEOS)}>
          Your YouTube channel has at least {pluralizeNoun(requirements?.MINIMUM_VIDEO_COUNT ?? 0, 'video', true)}, all
          published at least {convertHoursRequirementTime(requirements?.MINIMUM_VIDEO_AGE_HOURS || 0)} ago
        </SingleRequirement>
        <SingleRequirement
          fulfilled={checkRequirmentError(YppAuthorizationErrorCode.CHANNEL_CRITERIA_UNMET_SUBSCRIBERS)}
        >
          Your YouTube channel has at least{' '}
          {pluralizeNoun(requirements?.MINIMUM_SUBSCRIBERS_COUNT ?? 0, 'subscriber', true)} and subscriptions are made{' '}
          public.
        </SingleRequirement>
      </StyledList>
      {!hasAtLeastOneError && (
        <Banner
          description={`${atlasConfig.general.appName} uses Google OAuth to get access to your public profile and account email address as part of sign up flow, and integrates with YouTube API to obtain details about your YouTube channel data, such as followers and video statistics.`}
        />
      )}
    </>
  )
}

type SingleRequirmentProps = PropsWithChildren<{
  fulfilled: boolean
  important?: boolean
}>

export const SingleRequirement: FC<SingleRequirmentProps> = ({ fulfilled, important, children }) => {
  return (
    <ListItem as="li" variant="t200" color="colorText">
      <TickWrapper fulfilled={fulfilled}>{fulfilled ? <SvgActionCheck /> : <SvgActionClose />}</TickWrapper>
      <Paragraph important={important}>{children}</Paragraph>
    </ListItem>
  )
}
