import { concat, intersection } from 'lodash-es'

import { CategoryId } from '@/joystream-lib/types'
import { createLookup } from '@/utils/data'

export type DisplayCategory = {
  id: string
  iconUrl: string
  color: string
  coverImgUrl: string
  name: string
  videoCategories: CategoryId[]
}

export const displayCategories: DisplayCategory[] = [
  {
    id: '0',
    name: 'First category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/zsnpkq0uyjz4s49/categories-science-and-technology.svg?dl=0',
    color: '#D92E61',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp',
    videoCategories: ['63-2', '65-2'],
  },
  {
    id: '1',
    name: 'Second category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/1hbsuxd6vyih3a8/categories-pets-and-animals.svg?dl=0',
    color: '#E7BE2D',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/pets-and-animals.webp',
    videoCategories: ['59-2', '61-2'],
  },
  {
    id: '2',
    name: 'Third category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/im0zskxa7j521mc/categories-film-and-animation.svg?dl=0',
    color: '#BD4BE4',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/film-and-animation.webp',
    videoCategories: ['63-2'],
  },
  {
    id: '3',
    name: 'Fourth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/zun22j7yflojeob/categories-people-and-blogs.svg?dl=0',
    color: '#BDE933',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/people-and-blogs.webp',
    videoCategories: ['65-2'],
  },
  {
    id: '4',
    name: 'Fifth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/8adiw8q6rtne3jx/categories-entertainment.svg?dl=0',
    color: '#54A7F0',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/entertainment.webp',
    videoCategories: ['59-2'],
  },
  {
    id: '5',
    name: 'Sixth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/2hn29lnrc8qg3fy/categories-education.svg?dl=0',
    color: '#DD379D',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/education.webp',
    videoCategories: ['61-2'],
  },
  {
    id: '6',
    name: 'Seventh category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/ryfqz9r6kbilzkn/categories-travel-and-events.svg?dl=0',
    color: '#5A7AEE',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/travel-and-events.webp',
    videoCategories: ['65-2', '59-2'],
  },
  {
    id: '7',
    name: 'Eighth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/n5r4mhvmo1famlx/categories-sports.svg?dl=0',
    color: '#41EE5A',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/sports.webp',
    videoCategories: ['59-2', '61-2'],
  },
  {
    id: '8',
    name: 'Nineth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/0anu82zwbaq1mpj/categories-gaming.svg?dl=0',
    color: '#9455E8',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/gaming.webp',
    videoCategories: ['61-2'],
  },
  {
    id: '9',
    name: 'Tenth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/aphxdmb7bqz3fsl/categories-comedy.svg?dl=0',
    color: '#4FE1F2',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/comedy.webp',
    videoCategories: ['59-2'],
  },
  {
    id: '10',
    name: 'Eleventh category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/q6jwehpxwido4q2/categories-autos-and-vehicles.svg?dl=0',
    color: '#6E5FEC',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/autos-and-vehicles.webp',
    videoCategories: ['61-2', '59-2', '63-2'],
  },
  {
    id: '11',
    name: 'Twelfth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/6no58hs9o9l9n18/categories-howto-and-style.svg?dl=0',
    color: '#E57827',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/howto-and-style.webp',
    videoCategories: ['61-2', '63-2'],
  },
  {
    id: '12',
    name: 'Thirteenth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/07058sh62h9wsf8/categories-music.svg?dl=0',
    color: '#6EEC3A',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/music.webp',
    videoCategories: ['59-2', '65-2'],
  },
  {
    id: '13',
    name: 'Fourteenth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/mgs2h2657plqc74/categories-nonprofits-and-activism.svg?dl=0',
    color: '#E141D6',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/nonprofit-and-activism.webp',
    videoCategories: ['63-2', '65-2', '59-2', '61-2'],
  },
  {
    id: '14',
    name: 'Fifteenth category',
    iconUrl: 'https://dl.dropboxusercontent.com/s/amjwibevfqav8n4/categories-news-and-politics.svg?dl=0',
    color: '#48F0B3',
    coverImgUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/news-and-politics.webp',
    videoCategories: ['63-2'],
  },
]

export const findDisplayCategory = (id?: string | null) => {
  const displayCategoriesLookup = createLookup(displayCategories)
  if (!id) return null
  return displayCategoriesLookup[id]
}

export const allUniqueVideoCategories = intersection(
  concat(...displayCategories.map((category) => category.videoCategories))
)
