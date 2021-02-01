import rawLicenses from './raw/licenses.json'
import { LicenseFieldsFragment } from '@/api/queries/__generated__/videos.generated'
import { KnownLicense, UserDefinedLicense } from '@/api/queries/__generated__/baseTypes.generated'

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
