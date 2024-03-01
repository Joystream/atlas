import { axiosInstance } from '@/api/axios'

export type Currency = {
  ticker: string
  legacyTicker: string
  name: string
  image: string
  isStable: string
  buy: boolean // Indicates if a currency is available to buy
  sell: boolean
  network: string
}

type ExchangeRange = {
  flow: 'standard' | 'fixed'
  fromCurrency: string
  fromNetwork: string
  maxAmount: number | null
  minAmount: number | null
  toCurrency: string
  toNetwork: string
}

type ExchangeRate = {
  flow: 'standard' | 'fixed'
  fromCurrency: string
  fromNetwork: string
  toCurrency: string
  toNetwork: string
  rateId: string | null
  validUntil: string | null
  transactionSpeedForecast: string | null
  warningMessage: string | null
  fromAmount: number
  toAmount: number
}

type ExchangeTransaction = {
  id: string
  fromAmount: number
  toAmount: number
  flow: string
  type: string
  payingAddress: string
  payoutAddress: string
  fromCurrency: string
  toCurrency: string
  refundAddress: string
  rateId: string
}

type ExchangeTransactionStatus = {
  id: string
  status: 'new' | 'waiting' | 'confirming' | 'exchanging' | 'sending' | 'finished' | 'failed' | 'refunded' | 'verifying'
  payinAddress: string
  createdAt: string
  updatedAt: string
  depositReceivedAt: string | null
  payinHash: string | null
  amountTo: number
  amountFrom: number
  fromCurrency: string
}

type TransactionType = 'sell' | 'buy'

const JOYSTREAM_CHANGENOW_TICKER = 'joystream'
export const JOYSTREAM_CHANGENOW_LEGACY_TICKER = 'joy'
const JOYSTREAM_CHANGENOW_NETWORK = 'polkadot'

class ChangeNowService {
  private _apiKey
  private _currencies: Currency[] = []

  constructor(apiKey: string) {
    this._apiKey = apiKey
  }

  async getAvailableCurrencies() {
    if (this._currencies.length) {
      return this._currencies
    }

    const res = await axiosInstance.get<Currency[]>(
      'https://api.changenow.io/v2/exchange/currencies?active=&flow=standard&buy=&sell='
    )

    if (res.data) {
      this._currencies = res.data
    }

    return res.data
  }

  sanitizeApiErrorMessage(message: string) {
    return message.replace('', '')
  }

  async getExchangeRange(currency: Currency, type: TransactionType) {
    const isSellingJoy = type === 'sell'
    const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
    const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
    const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
    const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK

    return axiosInstance.get<ExchangeRange>(
      `https://api.changenow.io/v2/exchange/min-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=standard`,
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async getEstimatedExchangeAmount(
    amount: number,
    currency: Currency,
    type: TransactionType,
    direction: 'direct' | 'reverse' = 'direct'
  ) {
    const isSellingJoy = type === 'sell'
    const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
    const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
    const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
    const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK

    return axiosInstance.get<ExchangeRate>(
      `https://api.changenow.io/v2/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&${
        direction === 'direct' ? 'fromAmount' : 'toAmount'
      }=${amount}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=fixed-rate&type=${direction}`,
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async createExchangeTransaction({
    refundAddress,
    addressToBePaid,
    currency,
    amount,
    type,
    contactEmail,
    rateId,
    userId,
  }: {
    amount: number
    currency: Currency
    addressToBePaid: string
    refundAddress?: string
    type: TransactionType
    contactEmail?: string
    rateId: string
    userId?: string
  }) {
    const isSellingJoy = type === 'sell'
    const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
    const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
    const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
    const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK

    return axiosInstance.post<ExchangeTransaction>(
      'https://api.changenow.io/v2/exchange',
      {
        fromCurrency,
        fromNetwork,
        toCurrency,
        toNetwork,
        contactEmail,
        fromAmount: String(amount),
        address: addressToBePaid,
        refundAddress,
        flow: 'standard',
        type: 'direct',
        rateId,
        userId,
      },
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async getTransactionStatus(id: string) {
    return axiosInstance.get<ExchangeTransactionStatus>(`https://api.changenow.io/v2/exchange/by-id?id=${id}`, {
      headers: {
        'x-changenow-api-key': this._apiKey,
      },
    })
  }
}

export const changeNowService = new ChangeNowService('')
