import rawCategories from './raw/categories.json'
import { CategoryFieldsFragment } from '@/api/queries/__generated__/categories.generated'

type MockCategory = CategoryFieldsFragment

const mockCategories: MockCategory[] = rawCategories.map((c) => ({ ...c, __typename: 'Category' }))

export default mockCategories
