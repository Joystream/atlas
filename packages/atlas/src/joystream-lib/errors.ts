export type JoystreamLibErrorType =
  | 'ApiNotConnectedError'
  | 'UnknownError'
  | 'FailedError'
  | 'SignCancelledError'
  | 'AccountNotSelectedError'
  | 'VoucherLimitError'
  | 'MissingRequiredEventError'

type JoystreamLibErrorArgs = {
  name: JoystreamLibErrorType
  message?: string
  details?: unknown
}

export type JoystreamFailedErrorType =
  | 'NftAuctionIsAlreadyExpired' // English auction already expired
  | 'BidStepConstraintViolated' //  Somebody placed a higher bid in english auction already
  | 'IsNotOpenAuctionType' // Auction is not open, open auction winner has been picked before your bid has been processed
  | 'IsNotEnglishAuctionType' //  - Somebody already bought NFT (english auction, buy now), Somebody has settled an auction already
  | 'BidDoesNotExist' // Auction does not have bids, As an NFT owner, I want to pick open auction winner, but they have withdrawn their bid
  | 'InvalidBuyNowPriceProvided' // Buy now price is invalid, Buy now price has changed after you wanted to buy it
  | 'ActorNotAuthorized' // Actor is not authorized to perform this action, As an NFT owner, I want to cancel my open auction but somebody has used buy now on it
  | 'ActionHasBidsAlready' // Already active auction cannot be cancelled, As an NFT owner, I want to cancel my english auction but somebody has placed a bid

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
