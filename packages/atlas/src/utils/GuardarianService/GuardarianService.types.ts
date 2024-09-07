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

export type GuardarianCreateTransactionResponse = {
  id: number
  status: string
  email: string
  errors: Error[]
  status_details: string | null
  from_currency: string
  initial_from_currency: string
  from_network: string
  from_currency_with_network: string
  from_amount: number
  deposit_type: string
  payout_type: string
  expected_from_amount: number
  initial_expected_from_amount: number
  to_currency: string
  to_network: string
  to_currency_with_network: string
  to_amount: number
  output_hash: string
  expected_to_amount: number
  location: string
  created_at: string
  updated_at: string
  partner_id: number
  external_partner_link_id: string
  from_amount_in_eur: number
  customer_payout_address_changeable: boolean
  estimate_breakdown: EstimateBreakdown
  payout: Payout
  deposit_payment_category: string
  payout_payment_category: string
  redirect_url: string
  preauth_token: string
  skip_choose_payout_address: boolean
  skip_choose_payment_category: boolean
}

export type Error = {
  code: string
  reason: string
}

export type EstimateBreakdown = {
  toAmount: number
  fromAmount: number
  serviceFees: ServiceFee[]
  convertedAmount: ConvertedAmount
  estimatedExchangeRate: number
  networkFee: NetworkFee
  partnerFee: PartnerFee
}

export type ServiceFee = {
  name: string
  amount: number
  currency: string
}

export type ConvertedAmount = {
  amount: number
  currency: string
}

export type NetworkFee = {
  amount: number
  currency: string
}

export type PartnerFee = {
  amount: number
  currency: string
  percentage: string
}

export type Payout = {
  address: string
  extra_id: string
}
