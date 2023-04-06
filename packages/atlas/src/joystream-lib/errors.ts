export type JoystreamLibErrorType =
  | 'ApiNotConnectedError'
  | 'UnknownError'
  | 'FailedError'
  | 'SignCancelledError'
  | 'AccountNotSelectedError'
  | 'MissingRequiredEventError'
  | 'MetaprotocolTransactionError'
  | 'AccountBalanceTooLow'
  | 'ChannelExcludedError'

// ExtrinsicStatus:: 1010: Invalid Transaction: Inability to pay some fees , e.g. account balance too low,
type JoystreamLibErrorArgs = {
  name: JoystreamLibErrorType
  message?: string
  details?: unknown
}

export enum ErrorCode {
  NftAuctionIsAlreadyExpired = 'NftAuctionIsAlreadyExpired', // English auction already expired
  BidStepConstraintViolated = 'BidStepConstraintViolated', //  Somebody placed a higher bid in english auction already
  IsNotOpenAuctionType = 'IsNotOpenAuctionType', // Auction is not open, open auction winner has been picked before your bid has been processed
  IsNotEnglishAuctionType = 'IsNotEnglishAuctionType', //  - Somebody already bought NFT or somebody has settled an auction already
  BidDoesNotExist = 'BidDoesNotExist', // Auction does not have bids, as an NFT owner, I want to pick open auction winner, but they have withdrawn their bid
  InvalidBuyNowPriceProvided = 'InvalidBuyNowPriceProvided', // Buy now price is invalid, buy now price has changed after you wanted to buy it
  ActorNotAuthorized = 'ActorNotAuthorized', // Actor is not authorized to perform this action, as an NFT owner, I want to cancel my open auction but somebody has used buy now on it
  ActionHasBidsAlready = 'ActionHasBidsAlready', // Already active auction cannot be cancelled, as an NFT owner, I want to cancel my english auction but somebody has placed a bid
  NftNotInBuyNowState = 'NftNotInBuyNowState', // Somebody already bought NFT (buy now)
  LiquidityRestrictions = 'LiquidityRestrictions', // Transfer dialog('Account liquidity restrictions prevent withdrawal'). You can't transfer because you don't have enough tokens to pay fee.
  WithdrawFromChannelAmountExceedsBalanceMinusExistentialDeposit = 'WithdrawFromChannelAmountExceedsBalanceMinusExistentialDeposit', // Withdraw dialog('An attempt to withdraw funds from channel account failed, because the specified amount, exceeds the account's balance minus ExistantialDeposit'). You can't withdraw because you don't have enough tokens(this includes fee)
  DataObjectStateBloatBondChanged = 'DataObjectStateBloatBondChanged', // Data state bloat bond changed
  VideoStateBloatBondChanged = 'VideoStateBloatBondChanged', // video state bloat bond changed
  ChannelStateBloatBondChanged = 'ChannelStateBloatBondChanged', // video state bloat bond changed
  InsufficientBalance = 'InsufficientBalance', // balance to low to send tokens
  InsufficientBalanceForChannelCreation = 'InsufficientBalanceForChannelCreation', // Cannot create the channel: channel creator has insufficient balance, (budget for channel state bloat bond + channel data objs state bloat bonds + data objs storage fees))
  InsufficientBalanceForVideoCreation = ' InsufficientBalanceForVideoCreation,', /// Cannot create the video: video creator has insufficient balance,  (budget for video state bloat bond + video data objs state bloat bonds + data objs storage fees)
}

// More error codes https://github.com/Joystream/joystream/blob/master/runtime-modules/content/src/errors.rs

export class JoystreamLibError extends Error {
  name: JoystreamLibErrorType
  details: unknown
  constructor({ name, message, details }: JoystreamLibErrorArgs) {
    super(message)
    this.name = name
    this.details = details
  }
}
