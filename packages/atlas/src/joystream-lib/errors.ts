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
  InsufficientBalanceForVideoCreation = 'InsufficientBalanceForVideoCreation,', /// Cannot create the video: video creator has insufficient balance,  (budget for video state bloat bond + video data objs state bloat bonds + data objs storage fees)
  InsufficientBalanceToCoverPayment = 'InsufficientBalanceToCoverPayment', // Insufficient balance to cover MemberRemark payment
  TokenDoesNotExist = 'TokenDoesNotExist', // Requested token does not exist
  NoActiveSale = 'NoActiveSale', // The token has no active sale at the moment
  InsufficientBalanceForTokenPurchase = 'InsufficientBalanceForTokenPurchase', // Account's JOY balance is insufficient to make the token purchase
  NotEnoughTokensOnSale = 'NotEnoughTokensOnSale', // Amount of tokens to purchase on sale exceeds the quantity of tokens still available on the sale
  SaleStartingBlockInThePast = 'SaleStartingBlockInThePast', // Specified sale starting block is in the past
  SaleAccessProofRequired = 'SaleAccessProofRequired', // Only whitelisted participants are allowed to access the sale, therefore access proof is required
  PreviousSaleNotFinalized = 'PreviousSaleNotFinalized', // Previous sale was still not finalized, finalize it first.
  SaleDurationTooShort = 'SaleDurationTooShort', // Specified sale duration is shorter than MinSaleDuration
  CannotInitSaleIfAmmIsActive = 'CannotInitSaleIfAmmIsActive', // No Sale if Amm is active
  RevenueSplitDurationTooShort = 'RevenueSplitDurationTooShort', // Revenue Split duration is too short
  RevenueSplitAlreadyActiveForToken = 'RevenueSplitAlreadyActiveForToken', // Attempt to activate split with one ongoing
  RevenueSplitNotActiveForToken = 'RevenueSplitNotActiveForToken', // Attempt to make revenue split operations with token not in active split state
  RevenueSplitDidNotEnd = 'RevenueSplitDidNotEnd', // Revenue Split has not ended yet
  RevenueSplitNotOngoing = 'RevenueSplitNotOngoing', // Revenue Split for token active, but not ongoing
  UserAlreadyParticipating = 'UserAlreadyParticipating', // User already participating in the revenue split
  InsufficientBalanceForSplitParticipation = 'InsufficientBalanceForSplitParticipation', // User does not posses enough balance to participate in the revenue split
  CannotModifySupplyWhenRevenueSplitsAreActive = 'CannotModifySupplyWhenRevenueSplitsAreActive', // Attempt to modify supply when revenue split is active
  NotInAmmState = 'NotInAmmState', // There is no open market for the token
  SlippageToleranceExceeded = 'SlippageToleranceExceeded', // There is no open market for the token
  OutstandingAmmProvidedSupplyTooLarge = 'OutstandingAmmProvidedSupplyTooLarge', // Oustanding AMM-provided supply constitutes too large percentage of the token's total supply
  NotEnoughTokenMintedByAmmForThisSale = 'NotEnoughTokenMintedByAmmForThisSale', // Attempting to sell more than amm provided supply
  CurveSlopeParametersTooLow = 'CurveSlopeParametersTooLow', // Curve slope parameters below minimum allowed
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
