import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Avatar } from '@/components/Avatar'
import { Information } from '@/components/Information'
import { NftCard } from '@/components/NftCard'
import { Pill } from '@/components/Pill'
import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { SvgJoystreamLogoShort } from '@/components/_illustrations'
import { TextField } from '@/components/_inputs/TextField'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useSubsribeAccountBalance } from '@/hooks/useSubsribeAccountBalance'
import { useTokenPrice } from '@/providers/joystream'
import { useNftActions } from '@/providers/nftActions'
import { cVar } from '@/styles'
import { formatDurationShort } from '@/utils/time'

import {
  ActionBarCell,
  ActiveBidWrapper,
  BidderName,
  BuyNowInfo,
  Content,
  CurrentBidAvatar,
  CurrentBidJoyToken,
  CurrentBidWrapper,
  Divider,
  EndingTime,
  FlexWrapper,
  Header,
  InnerContainer,
  Messages,
  MinimumBid,
  MinimumBidWrapper,
  NftPreview,
  PaymentSplitValues,
  PaymentSplitWrapper,
  PlaceBidWrapper,
  Row,
  Timer,
} from './NftPurchaseBottomDrawer.styles'

const DUMMY_NFT_TILE_PROPS = {
  role: 'owner' as const,
  auction: 'none' as const,
  thumbnail: { thumbnailUrl: 'https://placedog.net/360/203' },
  creator: { assetUrl: 'https://placedog.net/100/100?random=1', name: 'Jane' },
  owner: { assetUrl: 'https://placedog.net/100/100?random=2', name: 'Kate' },
  loading: false,
  fullWidth: false,
}

const TRANSACTION_FEE = 19
const FIXED_PRICE = 500
const MINIMUM_BID = 301
const END_TIME = Date.now() + 80000
const BID = {
  bidder: {
    name: 'Mike Shipa',
  },
  amount: 341,
}

export const NftPurchaseBottomDrawer: React.FC = () => {
  const [type, setType] = useState<'english_auction' | 'open_auction' | 'buy_now'>('english_auction')
  const [showBuyNowInfo, setBuyNowInfo] = useState(false)
  const { currentAction, closeNftAction } = useNftActions()
  const mdMatch = useMediaMatch('md')
  const { convertToUSD } = useTokenPrice()
  const accountBalance = useSubsribeAccountBalance()
  const timestamp = useMsTimestamp()
  const { convertDurationToBlocks } = useBlockTimeEstimation()
  const timeLeftSeconds = Math.trunc((END_TIME - timestamp) / 1000)
  const {
    watch,
    setValue,
    handleSubmit: createSubmitHandler,
    getValues,
    register,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' })

  // check if input value isn't bigger than fixed price
  useEffect(() => {
    if (type === 'buy_now') {
      return
    }
    const subscription = watch(({ bid }) => {
      if (bid >= FIXED_PRICE) {
        setBuyNowInfo(true)
      } else {
        setBuyNowInfo(false)
      }
      if (bid > FIXED_PRICE) {
        setValue('bid', FIXED_PRICE.toString())
      }
    })

    return () => subscription.unsubscribe()
  }, [setValue, type, watch])

  const handleSubmit = useCallback(() => {
    return createSubmitHandler((_) => null)
  }, [createSubmitHandler])

  const placedBid = getValues().bid
  const timeLeftUnderMinute = timeLeftSeconds && timeLeftSeconds < 60
  const insufficientFoundsError = errors.bid && errors.bid.type === 'bidTooHigh'
  const primaryButtonText = type === 'buy_now' || placedBid >= FIXED_PRICE ? 'Buy NFT' : 'Place bid'
  const blocksLeft = convertDurationToBlocks(END_TIME - timestamp)

  const isOpen = currentAction === 'purchase'

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={closeNftAction}
      coverTopbar
      actionBar={{
        primaryButton: {
          text: primaryButtonText,
          disabled: placedBid ? !placedBid.length : true,
          onClick: handleSubmit(),
        },
      }}
    >
      <Content>
        <NftPreview>
          <NftCard title="title" {...DUMMY_NFT_TILE_PROPS} fullWidth={!mdMatch} />
        </NftPreview>
        <PlaceBidWrapper>
          <InnerContainer>
            <Header>
              <Text variant="h600">{type !== 'buy_now' ? 'Place a bid' : 'Buy NFT'}</Text>
              {type !== 'open_auction' && (
                <FlexWrapper>
                  <EndingTime>
                    <Text variant="h300" secondary>
                      Ending in:
                    </Text>
                    <Timer
                      variant="h200"
                      margin={{ left: 4, right: 2 }}
                      color={timeLeftUnderMinute ? cVar('colorTextError', true) : undefined}
                    >
                      {!timeLeftUnderMinute ? formatDurationShort(timeLeftSeconds, true) : 'Under 1 min'}
                    </Timer>
                  </EndingTime>
                  <FlexWrapper>
                    <Text variant="t100" secondary margin={{ left: 2, right: 1 }}>
                      {blocksLeft > 0 ? blocksLeft : 0} {blocksLeft === 1 ? 'block' : 'blocks'}
                    </Text>
                    <Information
                      text="Auctions are run and settled on-chain and use blocks of operations rather than clock time."
                      footer={<Text variant="t100">Auctions closing block: 123115234</Text>}
                      placement="top"
                    />
                  </FlexWrapper>
                </FlexWrapper>
              )}
            </Header>
            {type !== 'buy_now' ? (
              <>
                <CurrentBidWrapper>
                  {BID ? (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Current bid
                        </Text>
                        <FlexWrapper>
                          <CurrentBidAvatar size="bid" />
                          <BidderName variant="h400">{BID.bidder.name}</BidderName>
                        </FlexWrapper>
                      </ActionBarCell>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Bid amount
                        </Text>
                        <FlexWrapper>
                          <CurrentBidJoyToken size={24} variant="silver" />
                          <Text variant="h400">{BID.amount}</Text>
                        </FlexWrapper>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  ) : (
                    <ActiveBidWrapper>
                      <ActionBarCell>
                        <Text variant="h300" secondary margin={{ bottom: 2 }}>
                          Current bid
                        </Text>
                        <Text variant="h400">Nobody has bid yet</Text>
                      </ActionBarCell>
                    </ActiveBidWrapper>
                  )}
                </CurrentBidWrapper>
                <MinimumBidWrapper>
                  <MinimumBid>
                    <Text variant="h300" secondary>
                      Minimum bid:
                    </Text>
                    <JoyTokenIcon variant="silver" size={24} /> <Text variant="h400">{MINIMUM_BID}</Text>
                  </MinimumBid>
                  <div>
                    <Text variant="t100" secondary>
                      Buy now: {FIXED_PRICE} tJOY
                    </Text>
                  </div>
                </MinimumBidWrapper>
                <TextField
                  {...register('bid', {
                    required: true,
                    validate: {
                      bidTooLow: (value) =>
                        Number(value) >= MINIMUM_BID ? true : 'Your bid must be higher than minimum bid',
                      bidTooHigh: (value) =>
                        accountBalance
                          ? Number(value) + TRANSACTION_FEE > accountBalance
                            ? 'Insufficient funds.'
                            : true
                          : true,
                    },
                  })}
                  placeholder={`Min. ${MINIMUM_BID} tJOY`}
                  nodeStart={<JoyTokenIcon variant="silver" size={24} />}
                  nodeEnd={!!placedBid && <Pill variant="overlay" label={`${convertToUSD(placedBid)}`} />}
                  type="number"
                  error={!!errors.bid}
                  helperText={errors.bid && errors.bid.message}
                />
                {showBuyNowInfo && (
                  <BuyNowInfo variant="t100" margin={{ top: 2 }}>
                    Max bid cannot be more than buy now price. Bidding for amount higher than Buy now will automatically
                    end the auction and make you an owner of that NFT.
                  </BuyNowInfo>
                )}
              </>
            ) : (
              <MinimumBidWrapper>
                <MinimumBid>
                  <Text variant="h300" secondary>
                    Price:
                  </Text>
                  <JoyTokenIcon variant="silver" size={24} /> <Text variant="h400">{FIXED_PRICE}</Text>
                </MinimumBid>
              </MinimumBidWrapper>
            )}
            <Divider />
            <FlexWrapper>
              <Text variant="h400">Payment split</Text>
              <Information
                placement="top"
                text="Payment split shows royalties that will go to each party after next sale of this NFT"
              />
            </FlexWrapper>
            <PaymentSplitWrapper>
              <div>
                <Text variant="h300" secondary>
                  Owner
                </Text>
                <PaymentSplitValues>
                  <Avatar size="bid" />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    88%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text variant="h300" secondary>
                  Creator
                </Text>
                <PaymentSplitValues>
                  <Avatar size="bid" />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    10%
                  </Text>
                </PaymentSplitValues>
              </div>
              <div>
                <Text variant="h300" secondary>
                  Platform
                </Text>
                <PaymentSplitValues>
                  <SvgJoystreamLogoShort />
                  <Text variant="h400" secondary margin={{ left: 2 }}>
                    2%
                  </Text>
                </PaymentSplitValues>
              </div>
            </PaymentSplitWrapper>
            <Divider />
            <Text variant="h400" margin={{ bottom: 4 }}>
              Price breakdown
            </Text>
            <Row>
              <Text variant="t100" secondary color={insufficientFoundsError ? cVar('colorTextError') : undefined}>
                Your balance
              </Text>
              {accountBalance ? (
                <Text variant="t100" secondary>
                  {accountBalance} tJOY
                </Text>
              ) : (
                <SkeletonLoader width={82} height={16} />
              )}
            </Row>
            <Row>
              <Text variant="t100" secondary>
                {!placedBid && type !== 'buy_now' ? 'You need to fill out the amount first' : 'Your bid'}
              </Text>
              {placedBid && (
                <Text variant="t100" secondary>
                  {type !== 'buy_now' ? placedBid : FIXED_PRICE} tJOY
                </Text>
              )}
            </Row>
            {(placedBid || type === 'buy_now') && (
              <>
                <Row>
                  <Text variant="t100" secondary>
                    Transaction fee
                  </Text>
                  <Text variant="t100" secondary>
                    {TRANSACTION_FEE} tJOY
                  </Text>
                </Row>
                <Row>
                  <Text variant="h500" secondary>
                    You will pay
                  </Text>
                  <Text variant="h500">
                    {(type === 'buy_now' ? FIXED_PRICE : Number(placedBid) || 0) + TRANSACTION_FEE} tJOY
                  </Text>
                </Row>
              </>
            )}
            {type !== 'buy_now' && (
              <Messages>
                <SvgAlertsWarning24 />
                <Text variant="t200" secondary margin={{ left: 2 }}>
                  if your bid was not successful, it can be withdrawn in {'{X}'} hours
                </Text>
              </Messages>
            )}
          </InnerContainer>
        </PlaceBidWrapper>
      </Content>
    </BottomDrawer>
  )
}
