import rawLicenses from './raw/licenses.json'
import {
  LicenseFields,
  LicenseFields_type_KnownLicense,
  LicenseFields_type_UserDefinedLicense,
} from '@/api/queries/__generated__/LicenseFields'

export type MockLicense = LicenseFields

export type WhichLicense<T> = T extends Pick<LicenseFields_type_KnownLicense, 'code'>
  ? LicenseFields_type_KnownLicense
  : LicenseFields_type_UserDefinedLicense

const mockLicenses: MockLicense[] = rawLicenses.map((rawLicense) => ({
  __typename: 'LicenseEntity',
  ...rawLicense,
  type: {
    ...(rawLicense.type as WhichLicense<typeof rawLicense.type>),
  },
}))
export default mockLicenses
