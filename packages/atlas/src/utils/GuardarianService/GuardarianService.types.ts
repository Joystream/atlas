export type GuardarianCryptoCurrency = {
  id: number
  currency_type: string
  ticker: string
  name: string
  enabled: boolean
  enabled_subscription: boolean
  has_external_id: boolean
  is_featured: boolean
  is_stable: boolean
  is_available: boolean
  logo_url: string
  payment_methods: GuardarianPaymentMethod[]
  block_explorer_url_mask: string
  default_exchange_value: number
  networks: GuardarianNetwork[]
}

export type GuardarianFiatCurrency = {
  id: string
  currency_type: string
  ticker: string
  name: string
  enabled: boolean
  enabled_subscription: boolean
  has_external_id: boolean
  is_featured: boolean
  is_stable: boolean
  is_available: boolean
  logo_url: string
  payment_methods: GuardarianPaymentMethod[]
  block_explorer_url_mask: string
  default_exchange_value: number
  networks: GuardarianNetwork[]
}

export type GuardarianPaymentMethod = {
  type: string
  payment_category: string
  deposit_enabled: boolean
  withdrawal_enabled: boolean
}

export type GuardarianNetwork = {
  name: string
  network: string
  block_explorer_url_mask: string
  token_contract: string
  enabled_subscription: boolean
  payment_methods: GuardarianPaymentMethod
  network_fee: number
}

export type GuardarianCountry = {
  id: number
  country_name: string
  code_iso_alpha_2: string
  code_iso_alpha_3: string
  code_iso_numeric: string
  supported: boolean
}

export type GuardarianCurrencies = {
  crypto_currencies: GuardarianCryptoCurrency[]
  fiat_currencies: GuardarianCryptoCurrency[]
}

export type GuardarianEstimation = {
  to_currency: string
  from_currency: string
  to_network: string | null
  from_network: string | null
  value: string
  estimated_exchange_rate: string
}
