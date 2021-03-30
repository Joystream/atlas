import rawLicenses from './raw/licenses.json'
import { LicenseFieldsFragment } from '@/api/queries'

export type MockLicense = LicenseFieldsFragment

const mockLicenses: MockLicense[] = rawLicenses.map((rawLicense) => ({
  __typename: 'License',
  ...rawLicense,
}))
export default mockLicenses
