import BN from 'bn.js'
import { addHours } from 'date-fns'
import { FC, PropsWithChildren } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgAlertsInformative24 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useJoystream } from '@/providers/joystream'
import { formatDateTime } from '@/utils/time'

import {
  Description,
  Divider,
  MembersList,
  RevenueBanner,
  Row,
  StyledInformation,
  StyledOutputPill,
  Title,
  WhiteListRow,
} from './AcceptTerms.styles'

import { Listing, NftFormFields } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'

type AcceptTermsProps = {
  selectedType: Listing
  formData: NftFormFields
  creatorRoyalty?: number | null
  channelTitle?: string | null
  fee: BN
  isOwnedByChannel?: boolean
}

export const AcceptTerms: FC<AcceptTermsProps> = ({
  selectedType,
  formData,
  creatorRoyalty,
  channelTitle,
  fee,
  isOwnedByChannel,
}) => {
  const {
    chainState: { nftPlatformFeePercentage },
  } = useJoystream()
  const { startDate, endDate, type } = formData

  const totalDaysAndHours = getTotalDaysAndHours(startDate, endDate)

  const isStartDateValid = startDate?.type === 'date'
  const isEndDateValid = endDate?.type === 'date'
  const isAuction = selectedType === 'Auction'

  const durationBlocks = formData.auctionDurationBlocks || 0
  const convertedEndData = !isEndDateValid
    ? addHours(isStartDateValid ? startDate.date : new Date(), endDate ? endDate.durationDays * 24 : 0)
    : undefined

  return (
    <>
      <Text as="h1" variant="h500" margin={{ bottom: 12 }}>
        Review listing terms
      </Text>
      {isOwnedByChannel && (
        <RevenueBanner
          icon={<SvgAlertsInformative24 />}
          title="Revenue from this sale will go out to your channel account"
          description={`You can withdraw tokens from your channel account by clicking on your avatar in the ${atlasConfig.general.appName} Studio in the top right corner or by visiting My Payments tab.`}
        />
      )}
      <Text as="h2" variant="h400">
        Listing terms
      </Text>
      <Row>
        <Title>
          <TitleText>Listing type</TitleText>
          <StyledInformation
            text={
              isAuction
                ? 'Put it on a timed or open auction. See the bids coming.'
                : 'Sell it for a fixed price only. No bids.'
            }
            multiline
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>
            {isAuction ? `${type === 'open' ? 'Open' : 'Timed'} auction` : selectedType}
          </DescriptionText>
        </Description>
      </Row>
      {creatorRoyalty && (
        <Row>
          <Title>
            <TitleText>Creator's royalties</TitleText>
            <StyledInformation
              text="Royalties let the video creator earn revenue from secondary NFT sales"
              multiline
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>
              <Text variant="h400" as="span" color="colorText">
                {channelTitle}:
              </Text>{' '}
              {creatorRoyalty}%
            </DescriptionText>
          </Description>
        </Row>
      )}
      <Row>
        <Title>
          <TitleText>Platform royalties</TitleText>
          <StyledInformation
            text="Platform royalties is a commission from every sale of this NFT that goes to the platform"
            multiline
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>{nftPlatformFeePercentage}%</DescriptionText>
        </Description>
      </Row>
      {formData.startingPrice && isAuction && (
        <Row>
          <Title>
            <TitleText>Minimum bid</TitleText>
            <StyledInformation text="Only bids higher than this value will be accepted" placement="top" multiline />
          </Title>
          <Description>
            <NumberFormat as="span" value={formData.startingPrice} variant="h400" withToken />
          </Description>
        </Row>
      )}
      {formData?.buyNowPrice && (
        <Row>
          <Title>
            <TitleText>{isAuction ? 'Buy now price' : 'Fixed price'}</TitleText>
            <StyledInformation
              text={
                isAuction
                  ? 'Bids matching this value will automatically end your auction'
                  : 'Price for your NFT as shown to your buyers'
              }
              multiline
              placement="top"
            />
          </Title>
          <Description>
            <NumberFormat as="span" value={formData.buyNowPrice} variant="h400" withToken />
          </Description>
        </Row>
      )}
      {selectedType !== 'Fixed price' && (
        <Row>
          <Title>
            <TitleText>Start date</TitleText>
            <StyledInformation
              text="The moment in time when your auction becomes active and bids will be accepted"
              placement="top"
              multiline
            />
          </Title>
          <Description>
            <DescriptionText>{isStartDateValid ? formatDateTime(startDate.date) : 'Now'}</DescriptionText>
          </Description>
        </Row>
      )}
      {formData.endDate && (
        <>
          <Row>
            <Title>
              <TitleText>End date</TitleText>
              <StyledInformation
                text="The moment in time when your auction ends. It cannot be finished earlier."
                placement="top"
                multiline
              />
            </Title>
            <Description>
              <DescriptionText>
                {isEndDateValid ? formatDateTime(endDate.date) : convertedEndData && formatDateTime(convertedEndData)}
              </DescriptionText>
            </Description>
          </Row>
          {durationBlocks > 0 && (
            <Row>
              <Title>
                <TitleText>Total auction duration</TitleText>
                <StyledInformation
                  text="On blockchain, duration is expressed in number of blocks"
                  placement="top"
                  multiline
                />
              </Title>
              <Description>
                <DescriptionText>{totalDaysAndHours}</DescriptionText>
                <Text as="span" variant="h400" color="colorText">
                  &nbsp; / <NumberFormat as="span" value={durationBlocks} variant="no-variant" /> blocks
                </Text>
              </Description>
            </Row>
          )}
        </>
      )}
      {(formData.whitelistedMembers || []).length > 0 && (
        <WhiteListRow>
          <Title>
            <TitleText>Whitelist</TitleText>
            <StyledInformation
              text="Only members included in the whitelist will be able to bid on this auction"
              placement="top"
              multiline
            />
          </Title>
          <MembersList>
            {formData.whitelistedMembers?.map((member) => (
              <MemberWithResolvedAvatar key={member.id} member={member} />
            ))}
          </MembersList>
        </WhiteListRow>
      )}
      <Divider />
      <Text as="h2" variant="h400">
        Transaction
      </Text>
      <Row>
        <Title>
          <TitleText>Fee</TitleText>
          <StyledInformation
            text="Fee covers cost of blockchain computation of this transaction"
            placement="top"
            multiline
          />
        </Title>
        <Description>
          <NumberFormat as="span" value={fee} format="full" withToken variant="h400" />
        </Description>
      </Row>
    </>
  )
}

export const MemberWithResolvedAvatar: FC<{ member: BasicMembershipFieldsFragment }> = ({ member }) => {
  const { isLoadingAsset, urls } = getMemberAvatar(member)
  return <StyledOutputPill avatarUrls={urls} isLoadingAvatar={isLoadingAsset} handle={member.handle} withAvatar />
}

export const TitleText: FC<PropsWithChildren> = ({ children }) => (
  <Text as="span" variant="h300" color="colorText">
    {children}
  </Text>
)

export const DescriptionText: FC<PropsWithChildren> = ({ children }) => (
  <Text as="span" variant="h400">
    {children}
  </Text>
)
