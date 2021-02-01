import rawCategories from './raw/categories.json'
import { CategoryFieldsFragment } from '@/api/queries'

type MockCategory = CategoryFieldsFragment

const mockCategories: MockCategory[] = rawCategories.map((c) => ({ ...c, __typename: 'Category' }))

export default mockCategories
