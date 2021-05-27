import rawCategories from './raw/categories.json'
import { VideoCategoryFieldsFragment } from '@/api/queries'

type MockCategory = VideoCategoryFieldsFragment

const mockCategories: MockCategory[] = rawCategories.map((c) => ({ ...c, __typename: 'VideoCategory' }))

export default mockCategories
