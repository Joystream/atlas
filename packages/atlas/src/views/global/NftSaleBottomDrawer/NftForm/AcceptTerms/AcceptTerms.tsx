import React from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries'
import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { useMemberAvatar } from '@/providers/assets'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

import {
  Description,
  Divider,
  Header,
  MembersList,
  Row,
  StyledInformation,
  StyledMemberBadge,
  StyledSvgActionArrowRight,
  StyledSvgWarning,
  TermsBox,
  Title,
  WhiteListRow,
  YellowText,
} from './AcceptTerms.styles'

import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { Listing, NftFormFields } from '../NftForm.types'
import { getTotalDaysAndHours } from '../NftForm.utils'
import { RoyaltiesTooltipFooter } from '../RoyaltiesTooltipFooter'

type AcceptTermsProps = {
  selectedType: Listing
  formData: NftFormFields
  termsAccepted: boolean
  toggleTermsAccept: () => void
}

export const AcceptTerms: React.FC<AcceptTermsProps> = ({
  selectedType,
  formData,
  termsAccepted,
  toggleTermsAccept,
}) => {
  const { startDate, endDate } = formData

  const totalDaysAndHours = getTotalDaysAndHours(startDate, endDate)

  const isStartDateValid = startDate?.type === 'date'
  const isEndDateValid = endDate?.type === 'date'

  const durationBlocks = formData.auctionDurationBlocks || 0

  return (
    <>
      <Header variant="h500">Accept listing terms</Header>
      <Banner
        id="issuing-nft"
        dismissable={false}
        icon={<StyledSvgWarning width={24} height={24} />}
        description={
          <>
            <Text variant="t200">After issuing this as an NFT </Text>
            <YellowText variant="t200">editing options of this video will be disabled</YellowText>
          </>
        }
      />
      <Divider />
      <Text variant="h400">Listing settings</Text>
      <Row>
        <Title>
          <TitleText>Listing type</TitleText>
          <StyledInformation
            text="Offers can be received. You can accept any bid at any time unless auction duration is set (then the highest offer wins)"
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>{selectedType}</DescriptionText>
        </Description>
      </Row>
      {formData.startingPrice && selectedType === 'Auction' && (
        <Row>
          <Title>
            <TitleText>Minimum bid</TitleText>
            <StyledInformation
              text="Its the starting price of your auction. No lower bids will be accepted"
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>
              {Number(formData.startingPrice).toLocaleString('no', { maximumFractionDigits: 1 })} tJoy
            </DescriptionText>
          </Description>
        </Row>
      )}
      {formData?.buyNowPrice && (
        <Row>
          <Title>
            <TitleText>Fixed price</TitleText>
            <StyledInformation
              text="Sell your NFT for a predefined price. When this price is reached it automatically ends auction"
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>
              {Number(formData.buyNowPrice).toLocaleString('no', { maximumFractionDigits: 1 })} tJoy
            </DescriptionText>
          </Description>
        </Row>
      )}
      <Row>
        <Title>
          <TitleText>Starting date</TitleText>
          <StyledInformation
            text="It’s the time when your auction will become active and buyer will be able to make an offer"
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>{isStartDateValid ? formatDateTime(startDate.date) : 'Right after listing'}</DescriptionText>
        </Description>
      </Row>
      <Row>
        <Title>
          <TitleText>Expiration date</TitleText>
          <StyledInformation
            text="It’s the time when your auction ends. You cannot finish it earlier. Highest bidder wins."
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>
            {isEndDateValid ? formatDateTime(endDate.date) : totalDaysAndHours || 'No expiration date'}
          </DescriptionText>
        </Description>
      </Row>
      {durationBlocks > 0 && (
        <Row>
          <Title>
            <TitleText>Total auction duration</TitleText>
            <StyledInformation
              text="Auctions are run and settled on-chain and use tJoy’s blocks, rather than clock time."
              footer={
                <AuctionDurationTooltipFooter>
                  <Text variant="t100">
                    {totalDaysAndHours} = {formData.auctionDurationBlocks}
                  </Text>
                </AuctionDurationTooltipFooter>
              }
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{totalDaysAndHours}</DescriptionText>
            <Text variant="h400" secondary>
              &nbsp;/ {formatNumber(durationBlocks)} Blocks
            </Text>
          </Description>
        </Row>
      )}
      {(formData.whitelistedMembers || []).length > 0 && (
        <WhiteListRow>
          <Title>
            <TitleText>WhiteList</TitleText>
            <StyledInformation
              text="Only people on your whitelist will be able to bid/buy this particular NFT."
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
          <StyledInformation
            text="By setting royalties you will be entitled to a percentage share in revenue from any future secondary market sale. So if someone sells your work you will get paid."
            footer={<RoyaltiesTooltipFooter />}
            placement="top"
          />
        </Title>
        <Description>
          <DescriptionText>0 tJoy</DescriptionText>
        </Description>
      </Row>
      <TermsBox>
        <StyledSvgActionArrowRight />
        <Checkbox
          label="I accept the terms and want to list my video as NFT"
          value={termsAccepted}
          onChange={toggleTermsAccept}
        />
      </TermsBox>
    </>
  )
}

export const MemberWithResolvedAvatar: React.FC<{ member: BasicMembershipFieldsFragment }> = ({ member }) => {
  const { isLoadingAsset, url } = useMemberAvatar(member)
  return <StyledMemberBadge avatarUri={url} isLoadingAvatar={isLoadingAsset} handle={member.handle} />
}

export const TitleText: React.FC = ({ children }) => (
  <Text variant="h300" secondary>
    {children}
  </Text>
)

export const DescriptionText: React.FC = ({ children }) => <Text variant="h400">{children}</Text>
