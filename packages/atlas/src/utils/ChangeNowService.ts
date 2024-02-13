import { axiosInstance } from '@/api/axios'

type Currency = {
  ticker: string
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

type TransactionType = 'sell' | 'buy'

const JOYSTREAM_CHANGENOW_TICKER = 'joystream'
const JOYSTREAM_CHANGENOW_NETWORK = 'polkadot'

class ChangeNowService {
  private _apiKey

  constructor(apiKey: string) {
    this._apiKey = apiKey
  }

  async getAvailableCurrencies() {
    return axiosInstance.get<Currency[]>(
      'https://api.changenow.io/v2/exchange/currencies?active=&flow=standard&buy=&sell=',
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
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

  async getEstimatedExchangeAmount(amount: number, currency: Currency, type: TransactionType) {
    const isSellingJoy = type === 'sell'
    const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
    const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
    const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
    const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK

    return axiosInstance.get<ExchangeRange>(
      `https://api.changenow.io/v2/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${amount}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=fixed-rate&type=direct`,
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async createExchangeTransaction({
    addressToRefund,
    addressToBePaid,
    currency,
    amount,
    type,
    contactEmail,
  }: {
    amount: number
    currency: Currency
    addressToBePaid: string
    addressToRefund: string
    type: TransactionType
    contactEmail?: string
  }) {
    const isSellingJoy = type === 'sell'
    const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
    const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
    const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
    const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK

    return axiosInstance.post('https://api.changenow.io/v2/exchange', {
      fromCurrency,
      fromNetwork,
      toCurrency,
      toNetwork,
      contactEmail,
      fromAmount: String(amount),
      address: addressToBePaid,
      refundAddress: addressToRefund,
      // 'extraId': '',
      // 'refundExtraId': '',
      flow: 'standard',
      type: 'direct',
    })
  }
}
