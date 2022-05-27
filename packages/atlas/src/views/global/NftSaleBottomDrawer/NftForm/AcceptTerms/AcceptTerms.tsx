import { addHours } from 'date-fns'
import { FC, PropsWithChildren } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { Text } from '@/components/Text'
import { useMemberAvatar } from '@/providers/assets'
import { formatNumber, formatTokens } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import {
  Description,
  Divider,
  Header,
  MembersList,
  Row,
  StyledInformation,
  StyledMemberBadge,
  Title,
  WhiteListRow,
} from './AcceptTerms.styles'

import { Listing, NftFormFields } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'

type AcceptTermsProps = {
  selectedType: Listing
  formData: NftFormFields
}

export const AcceptTerms: FC<AcceptTermsProps> = ({ selectedType, formData }) => {
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
      <Header variant="h500">Review listing terms</Header>
      <Divider />
      <Text variant="h400">Listing terms</Text>
      <Row>
        <Title>
          <TitleText>Listing type</TitleText>
          <StyledInformation
            text={
              isAuction
                ? 'Put it on a timed or open auction. See the bids coming.'
                : 'Sell it for a fixed price only. No bids.'
            }
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>
            {isAuction ? `${type === 'open' ? 'Open' : 'Timed'} auction` : selectedType}
          </DescriptionText>
        </Description>
      </Row>
      {formData.startingPrice && isAuction && (
        <Row>
          <Title>
            <TitleText>Minimum bid</TitleText>
            <StyledInformation text="Only bids higher than this value will be accepted" placement="top" />
          </Title>
          <Description>
            <DescriptionText>{formatTokens(formData.startingPrice, true)}</DescriptionText>
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
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{formatTokens(formData.buyNowPrice, true)}</DescriptionText>
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
                <StyledInformation text="On blockchain, duration is expressed in number of blocks" placement="top" />
              </Title>
              <Description>
                <DescriptionText>{totalDaysAndHours}</DescriptionText>
                <Text variant="h400" secondary>
                  &nbsp;/ {formatNumber(durationBlocks)} blocks
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
      <Text variant="h400">Transaction</Text>
      <Row>
        <Title>
          <TitleText>Fee</TitleText>
          <StyledInformation text="Fee covers cost of blockchain computation of this transaction" placement="top" />
        </Title>
        <Description>
          <DescriptionText>{formatTokens(0)}</DescriptionText>
        </Description>
      </Row>
    </>
  )
}

export const MemberWithResolvedAvatar: FC<{ member: BasicMembershipFieldsFragment }> = ({ member }) => {
  const { isLoadingAsset, url } = useMemberAvatar(member)
  return <StyledMemberBadge avatarUri={url} isLoadingAvatar={isLoadingAsset} handle={member.handle} />
}

export const TitleText: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <Text variant="h300" secondary>
    {children}
  </Text>
)

export const DescriptionText: FC<PropsWithChildren<unknown>> = ({ children }) => <Text variant="h400">{children}</Text>
