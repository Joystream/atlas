import rawLicenses from './raw/licenses.json'
import { LicenseFieldsFragment, KnownLicense, UserDefinedLicense } from '@/api/queries'

export type MockLicense = LicenseFieldsFragment

export type WhichLicense<T> = T extends Pick<KnownLicense, 'code'> ? KnownLicense : UserDefinedLicense

const mockLicenses: MockLicense[] = rawLicenses.map((rawLicense) => ({
  __typename: 'LicenseEntity',
  ...rawLicense,
  type: {
    ...(rawLicense.type as WhichLicense<typeof rawLicense.type>),
  },
}))
export default mockLicenses
