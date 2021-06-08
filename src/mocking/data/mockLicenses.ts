import { LicenseFieldsFragment } from '@/api/queries'

import rawLicenses from './raw/licenses.json'

export type MockLicense = LicenseFieldsFragment

const mockLicenses: MockLicense[] = rawLicenses.map((rawLicense) => ({
  __typename: 'License',
  ...rawLicense,
}))
export default mockLicenses
