import { axiosInstance } from '@/api/axios'
import { GUARDARIAN_PUBLIC_API_KEY } from '@/config/env'

import { GuardarianCountry, GuardarianCurrencies, GuardarianEstimation } from './GuardarianService.types'

type TransactionType = 'sell' | 'buy'

// export const JOYSTREAM_CHANGENOW_TICKER = 'joystream'
// export const JOYSTREAM_CHANGENOW_LEGACY_TICKER = 'joy'
// const JOYSTREAM_CHANGENOW_NETWORK = 'joy'
const GUARDARIAN_URL = 'https://api-payments.guardarian.com/v1'

class GuardarianService {
  private _apiKey
  private _currencies: GuardarianCurrencies | null = null
  private _countries: GuardarianCountry[] = []

  constructor(apiKey: string) {
    this._apiKey = apiKey
  }

  async getSupportedCountries() {
    if (this._countries.length) {
      return this._countries
    }

    const response = await axiosInstance.get<GuardarianCountry[]>(`${GUARDARIAN_URL}/countries`)

    if (response.data) {
      this._countries = response.data
    }

    return response.data
  }

  async getAvailableCurrencies() {
    if (this._currencies) {
      return this._currencies
    }

    const response = await axiosInstance.get<GuardarianCurrencies>(`${GUARDARIAN_URL}/currencies?available=true`)

    if (response.data) {
      this._currencies = response.data
    }

    return response.data
  }

  sanitizeApiErrorMessage(message: string) {
    return message.replace('amountTo', 'Amount').replace('amountFrom', 'Amount')
  }

  // getExchangeRange(currency: Currency, type: TransactionType) {
  //   const isSellingJoy = type === 'sell'
  //   const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
  //   const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
  //   const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
  //   const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK
  //
  //   return axiosInstance.get<ExchangeRange>(
  //     `https://api.changenow.io/v2/exchange/range?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromNetwork=${fromNetwork}&toNetwork=${toNetwork}&flow=fixed-rate`,
  //     {
  //       headers: {
  //         'x-changenow-api-key': this._apiKey,
  //       },
  //     }
  //   )
  // }

  // validateCurrencyAddress(currency: string, address: string) {
  //   return axiosInstance.get<{ result: boolean; message: string | null }>(
  //     `https://api.changenow.io/v2/validate/address?currency=${currency}&address=${address}`,
  //     {
  //       headers: {
  //         'x-changenow-api-key': this._apiKey,
  //       },
  //     }
  //   )
  // }

  getEstimatedExchangeAmount(
    amount: number,
    from: {
      currency: string
      network?: string
    },
    to: {
      currency: string
      network?: string
    },
    direction: 'direct' | 'reverse' = 'direct'
  ) {
    const toCurrency = to.currency
    const fromCurrency = from.currency
    const fromNetwork = from.network
    const toNetwork = to.network
    return axiosInstance.get<GuardarianEstimation>(
      `${GUARDARIAN_URL}/estimate?from_currency=${fromCurrency}&to_currency=${toCurrency}&${
        direction === 'direct' ? 'from_amount' : 'to_amount'
      }=${amount}&type=${direction}${toNetwork ? `&to_network=${toNetwork}` : ''}${
        fromNetwork ? `&from_network=${fromNetwork}` : ''
      }`,
      {
        headers: {
          'x-api-key': this._apiKey,
        },
      }
    )
  }

  // createExchangeTransaction({
  //   refundAddress,
  //   addressToBePaid,
  //   currency,
  //   amount,
  //   type,
  //   contactEmail,
  //   rateId,
  //   userId,
  // }: {
  //   amount: number
  //   currency: Currency
  //   addressToBePaid: string
  //   refundAddress?: string
  //   type: TransactionType
  //   contactEmail?: string
  //   rateId: string
  //   userId?: string
  // }) {
  //   const isSellingJoy = type === 'sell'
  //   const fromCurrency = isSellingJoy ? JOYSTREAM_CHANGENOW_TICKER : currency.ticker
  //   const toCurrency = isSellingJoy ? currency.ticker : JOYSTREAM_CHANGENOW_TICKER
  //   const fromNetwork = isSellingJoy ? JOYSTREAM_CHANGENOW_NETWORK : currency.network
  //   const toNetwork = isSellingJoy ? currency.network : JOYSTREAM_CHANGENOW_NETWORK
  //
  //   return axiosInstance.post<ExchangeTransaction>(
  //     'https://api.changenow.io/v2/exchange',
  //     {
  //       fromCurrency,
  //       fromNetwork,
  //       toCurrency,
  //       toNetwork,
  //       contactEmail,
  //       fromAmount: String(amount),
  //       address: addressToBePaid,
  //       refundAddress,
  //       flow: 'fixed-rate',
  //       type: 'direct',
  //       rateId,
  //       userId,
  //     },
  //     {
  //       headers: {
  //         'x-changenow-api-key': this._apiKey,
  //       },
  //     }
  //   )
  // }

  // getTransactionStatus(id: string) {
  //   return axiosInstance.get<ExchangeTransactionStatus>(`https://api.changenow.io/v2/exchange/by-id?id=${id}`, {
  //     headers: {
  //       'x-changenow-api-key': this._apiKey,
  //     },
  //   })
  // }
}

export const guardarianService = new GuardarianService(GUARDARIAN_PUBLIC_API_KEY)
