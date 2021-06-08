import { VideoCategoryFieldsFragment } from '@/api/queries'

import rawCategories from './raw/categories.json'

type MockCategory = VideoCategoryFieldsFragment

const mockCategories: MockCategory[] = rawCategories.map((c) => ({ ...c, __typename: 'VideoCategory' }))

export default mockCategories
