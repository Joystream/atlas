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

const JOYSTREAM_CHANGENOW_TICKER = 'joystream'

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

  async getExchangeRange(currency: Currency) {
    return axiosInstance.get<ExchangeRange>(
      `https://api.changenow.io/v2/exchange/min-amount?fromCurrency=${currency.ticker}&toCurrency=${JOYSTREAM_CHANGENOW_TICKER}&fromNetwork=${currency.network}&toNetwork=eth&flow=standard`,
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async getEstimatedExchangeAmount(amount: number, currency: Currency) {
    return axiosInstance.get<ExchangeRange>(
      `https://api.changenow.io/v2/exchange/estimated-amount?fromCurrency=${currency.ticker}&toCurrency=${JOYSTREAM_CHANGENOW_TICKER}&fromAmount=${amount}&fromNetwork=${currency.network}&toNetwork=eth&flow=fixed-rate&type=direct`,
      {
        headers: {
          'x-changenow-api-key': this._apiKey,
        },
      }
    )
  }

  async createExchangeTransaction(amount: number, currency: Currency, addressToBePaid: string) {
    return axiosInstance.post('https://api.changenow.io/v2/exchange', {
      'fromCurrency': currency.ticker,
      'fromNetwork': currency.network,
      'toCurrency': JOYSTREAM_CHANGENOW_TICKER,
      'toNetwork': 'eth',
      'fromAmount': String(amount),
      // "toAmount": "",
      'address': addressToBePaid,
      'extraId': '',
      'refundAddress': '',
      'refundExtraId': '',
      'userId': '',
      'payload': '',
      'contactEmail': '',
      'flow': 'standard',
      'type': 'direct',
      'rateId': '',
    })
  }
}
