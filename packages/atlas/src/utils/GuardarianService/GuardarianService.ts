import { axiosInstance } from '@/api/axios'
import { GUARDARIAN_PUBLIC_API_KEY } from '@/config/env'

import {
  GuardarianCountry,
  GuardarianCreateTransactionResponse,
  GuardarianCurrencies,
  GuardarianEstimation,
} from './GuardarianService.types'

import { formatDateGuardarian } from '../time'

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

  createTransaction({
    from,
    to,
    amount,
    extraId,
    billingInfo,
  }: {
    amount: number
    from: {
      currency: string
      network?: string
    }
    to: {
      currency: string
      network?: string
    }
    extraId?: string
    billingInfo: {
      email: string
      country: string
      region: string
      city: string
      street: string
      apartment: string
      postIndex: string
      firstName: string
      lastName: string
      dob: string
    }
  }) {
    return axiosInstance.post<GuardarianCreateTransactionResponse>(
      `${GUARDARIAN_URL}/transaction`,
      {
        from_amount: amount,
        from_currency: from.currency,
        to_currency: to.currency,
        from_network: from.network,
        to_network: to.network,
        payout_info: {
          extra_id: extraId,
        },
        customer: {
          contact_info: {
            email: billingInfo.email,
          },
          billing_info: {
            country_alpha_2: billingInfo.country,
            region: billingInfo.region,
            city: billingInfo.city,
            street_address: billingInfo.street,
            apt_number: billingInfo.apartment,
            post_index: billingInfo.postIndex,
            first_name: billingInfo.firstName,
            last_name: billingInfo.lastName,
            date_of_birthday: formatDateGuardarian(new Date(billingInfo.dob)),
          },
        },
      },
      {
        headers: {
          'x-api-key': this._apiKey,
        },
      }
    )
  }

  getTransactionStatus(id: string) {
    return axiosInstance.get<GuardarianCreateTransactionResponse>(`${GUARDARIAN_URL}/transaction/${id}`, {
      headers: {
        'x-api-key': this._apiKey,
      },
    })
  }
}

export const guardarianService = new GuardarianService(GUARDARIAN_PUBLIC_API_KEY)
