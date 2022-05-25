export type JoystreamLibErrorType =
  | 'ApiNotConnectedError'
  | 'UnknownError'
  | 'FailedError'
  | 'SignCancelledError'
  | 'AccountNotSelectedError'
  | 'MissingRequiredEventError'
  | 'MetaprotocolTransactionError'

type JoystreamLibErrorArgs = {
  name: JoystreamLibErrorType
  message?: string
  details?: unknown
}

export enum ErrorCode {
  VoucherSizeLimitExceeded = 'VoucherSizeLimitExceeded',
  NftAuctionIsAlreadyExpired = 'NftAuctionIsAlreadyExpired', // English auction already expired
  BidStepConstraintViolated = 'BidStepConstraintViolated', //  Somebody placed a higher bid in english auction already
  IsNotOpenAuctionType = 'IsNotOpenAuctionType', // Auction is not open, open auction winner has been picked before your bid has been processed
  IsNotEnglishAuctionType = 'IsNotEnglishAuctionType', //  - Somebody already bought NFT or somebody has settled an auction already
  BidDoesNotExist = 'BidDoesNotExist', // Auction does not have bids, as an NFT owner, I want to pick open auction winner, but they have withdrawn their bid
  InvalidBuyNowPriceProvided = 'InvalidBuyNowPriceProvided', // Buy now price is invalid, buy now price has changed after you wanted to buy it
  ActorNotAuthorized = 'ActorNotAuthorized', // Actor is not authorized to perform this action, as an NFT owner, I want to cancel my open auction but somebody has used buy now on it
  ActionHasBidsAlready = 'ActionHasBidsAlready', // Already active auction cannot be cancelled, as an NFT owner, I want to cancel my english auction but somebody has placed a bid
  NftNotInBuyNowState = 'NftNotInBuyNowState', // Somebody already bought NFT (buy now)
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
