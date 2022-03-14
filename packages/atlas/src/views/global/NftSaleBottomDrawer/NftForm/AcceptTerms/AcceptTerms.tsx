import { format as formatDate } from 'date-fns'
import React from 'react'

import { Banner } from '@/components/Banner'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'

import {
  Description,
  Divider,
  Header,
  Row,
  StyledInformation,
  StyledSvgActionArrowRight,
  StyledSvgWarning,
  TermsBox,
  Title,
  YellowText,
} from './AcceptTerms.styles'

import { useNftForm } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { Listing, NftFormData } from '../NftForm.types'
import { RoyaltiesTooltipFooter } from '../RoyaltiesTooltipFooter'

type AcceptTermsProps = {
  selectedType: Listing
  formData: NftFormData
  termsAccepted: boolean
  toggleTermsAccept: () => void
}

const DATE_FORMAT = 'dd MMM yyyy, HH:mm OOOO'

export const AcceptTerms: React.FC<AcceptTermsProps> = ({
  selectedType,
  formData,
  termsAccepted,
  toggleTermsAccept,
}) => {
  const { getNumberOfBlocksAndDaysLeft } = useNftForm()

  const { startDate, endDate } = formData

  const isStartDateValid = startDate instanceof Date
  const isEndDateValid = endDate instanceof Date

  const numberOfBlocksAndDaysLeft = getNumberOfBlocksAndDaysLeft(startDate, endDate)

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
      {formData.startingPrice && (
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
          <DescriptionText>
            {isStartDateValid ? formatDate(startDate, DATE_FORMAT) : 'Right after listing'}
          </DescriptionText>
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
            {isEndDateValid ? formatDate(endDate, DATE_FORMAT) : numberOfBlocksAndDaysLeft?.daysAndHoursText}
          </DescriptionText>
        </Description>
      </Row>
      {numberOfBlocksAndDaysLeft && numberOfBlocksAndDaysLeft.blocks !== 0 && (
        <Row>
          <Title>
            <TitleText>Total auction duration</TitleText>
            <StyledInformation
              text="Auctions are run and settled on-chain and use tJoy’s blocks, rather than clock time."
              footer={
                <AuctionDurationTooltipFooter>
                  <Text variant="t100">
                    {numberOfBlocksAndDaysLeft.daysAndHoursText} = {numberOfBlocksAndDaysLeft.blocks}
                  </Text>
                </AuctionDurationTooltipFooter>
              }
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{numberOfBlocksAndDaysLeft.daysAndHoursText}</DescriptionText>
            <Text variant="h400" secondary>
              &nbsp;/ {numberOfBlocksAndDaysLeft.blocks} Blocks
            </Text>
          </Description>
        </Row>
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

export const TitleText: React.FC = ({ children }) => (
  <Text variant="h300" secondary>
    {children}
  </Text>
)

export const DescriptionText: React.FC = ({ children }) => <Text variant="h400">{children}</Text>
