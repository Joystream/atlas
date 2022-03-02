import { differenceInMilliseconds, format, isValid } from 'date-fns'
import React from 'react'

import { Banner } from '@/components/Banner'
import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'

import { Description, Divider, Header, Row, StyledSvgActionArrowRight, TermsBox, Title } from './AcceptTerms.styles'

import { StyledSvgWarning, YellowText } from '../../VideoWorkspace.style'
import { useNftForm } from '../NftForm.hooks'
import { AuctionDurationTooltipFooter } from '../NftForm.styles'
import { RoyaltiesTooltipFooter } from '../RoyaltiesTooltipFooter'
import { Listing, NftFormData } from '../types'

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
  const { getTotalDaysAndHoursText } = useNftForm()
  const { convertDurationToBlocks } = useBlockTimeEstimation()

  const startDate = formData.startDate as Date
  const endDate = formData.endDate as Date

  const validDate = isValid(formData.startDate) && isValid(formData.endDate)

  const numberOfBlocks = validDate ? convertDurationToBlocks(differenceInMilliseconds(endDate, startDate)) : null

  const daysAndHours = validDate && getTotalDaysAndHoursText(startDate as Date, endDate)

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
          <Information
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
            <Information
              text="Its the starting price of your auction. No lower bids will be accepted"
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{formData.startingPrice}</DescriptionText>
          </Description>
        </Row>
      )}
      {formData?.buyNowPrice && (
        <Row>
          <Title>
            <TitleText>Fixed price</TitleText>
            <Information
              text="Sell your NFT for a predefined price. When this price is reached it automatically ends auction"
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{formData.buyNowPrice}</DescriptionText>
          </Description>
        </Row>
      )}
      {validDate && (
        <>
          <Row>
            <Title>
              <TitleText>Starting date</TitleText>
              <Information
                text="It’s the time when your auction will become active and buyer will be able to make an offer"
                placement="top"
              />
            </Title>
            <Description>
              <DescriptionText>{format(startDate, DATE_FORMAT)}</DescriptionText>
            </Description>
          </Row>
          <Row>
            <Title>
              <TitleText>Expiration date</TitleText>
              <Information
                text="It’s the time when your auction ends. You cannot finish it earlier. Highest bidder wins."
                placement="top"
              />
            </Title>
            <Description>
              <DescriptionText>{format(endDate, DATE_FORMAT)}</DescriptionText>
            </Description>
          </Row>
        </>
      )}
      {validDate && (
        <Row>
          <Title>
            <TitleText>Total auction duration</TitleText>
            <Information
              text="Auctions are run and settled on-chain and use tJoy’s blocks, rather than clock time."
              footer={
                <AuctionDurationTooltipFooter>
                  <Text variant="t100">
                    {daysAndHours} = {numberOfBlocks}
                  </Text>
                </AuctionDurationTooltipFooter>
              }
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{daysAndHours}</DescriptionText>
            <Text variant="h400" secondary>
              &nbsp;/ {numberOfBlocks}
            </Text>
          </Description>
        </Row>
      )}
      {formData.royalty && (
        <Row>
          <Title>
            <TitleText>Royalties</TitleText>
            <Information
              text="By setting royalties you will be entitled to a percentage share in revenue from any future secondary market sale. So if someone sells your work you will get paid."
              footer={<RoyaltiesTooltipFooter />}
              placement="top"
            />
          </Title>
          <Description>
            <DescriptionText>{formData.royalty}</DescriptionText>
          </Description>
        </Row>
      )}
      <Divider />
      <Text variant="h400">Transaction</Text>
      <Row>
        <Title>
          <TitleText>Fee</TitleText>
          <Information
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
