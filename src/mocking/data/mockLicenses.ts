import rawLicenses from './raw/licenses.json'
import { LicenseFieldsFragment } from '@/api/queries/videos'
import { KnownLicense, UserDefinedLicense } from '@/api/queries/baseTypes'

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
