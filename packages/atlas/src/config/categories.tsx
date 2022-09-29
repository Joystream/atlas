import { concat, intersection } from 'lodash-es'
import { ReactNode } from 'react'

import {
  SvgCategoriesAutosAndVehicles,
  SvgCategoriesComedy,
  SvgCategoriesEducation,
  SvgCategoriesEntertainment,
  SvgCategoriesFilmAndAnimation,
  SvgCategoriesGaming,
  SvgCategoriesHowtoAndStyle,
  SvgCategoriesMusic,
  SvgCategoriesNewsAndPolitics,
  SvgCategoriesNonprofitsAndActivism,
  SvgCategoriesPeopleAndBlogs,
  SvgCategoriesPetsAndAnimals,
  SvgCategoriesScienceAndTechnology,
  SvgCategoriesSports,
  SvgCategoriesTravelAndEvents,
} from '@/components/_icons'
import { VideoId } from '@/joystream-lib/types'

export type VideoCategoryData = {
  id: string
  icon: ReactNode
  color: string
  coverImg: string
  name: string
  videoCategories: VideoId[]
}

export const displayCategories: VideoCategoryData[] = [
  {
    id: '0',
    name: 'First category',
    icon: <SvgCategoriesScienceAndTechnology />,
    color: '#D92E61',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp',
    videoCategories: ['63-2', '65-2'],
  },
  {
    id: '1',
    name: 'Second category',
    icon: <SvgCategoriesPetsAndAnimals />,
    color: '#E7BE2D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/pets-and-animals.webp',
    videoCategories: ['59-2', '61-2'],
  },
  {
    id: '2',
    name: 'Third category',
    icon: <SvgCategoriesFilmAndAnimation />,
    color: '#BD4BE4',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/film-and-animation.webp',
    videoCategories: ['63-2'],
  },
  {
    id: '3',
    name: 'Fourth category',
    icon: <SvgCategoriesPeopleAndBlogs />,
    color: '#BDE933',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/people-and-blogs.webp',
    videoCategories: ['65-2'],
  },
  {
    id: '4',
    name: 'Fifth category',
    icon: <SvgCategoriesEntertainment />,
    color: '#54A7F0',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/entertainment.webp',
    videoCategories: ['59-2'],
  },
  {
    id: '5',
    name: 'Sixth category',
    icon: <SvgCategoriesEducation />,
    color: '#DD379D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/education.webp',
    videoCategories: ['61-2'],
  },
  {
    id: '6',
    name: 'Seventh category',
    icon: <SvgCategoriesTravelAndEvents />,
    color: '#5A7AEE',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/travel-and-events.webp',
    videoCategories: ['65-2', '59-2'],
  },
  {
    id: '7',
    name: 'Eighth category',
    icon: <SvgCategoriesSports />,
    color: '#41EE5A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/sports.webp',
    videoCategories: ['59-2', '61-2'],
  },
  {
    id: '8',
    name: 'Nineth category',
    icon: <SvgCategoriesGaming />,
    color: '#9455E8',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/gaming.webp',
    videoCategories: ['61-2'],
  },
  {
    id: '9',
    name: 'Tenth category',
    icon: <SvgCategoriesComedy />,
    color: '#4FE1F2',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/comedy.webp',
    videoCategories: ['59-2'],
  },
  {
    id: '10',
    name: 'Eleventh category',
    icon: <SvgCategoriesAutosAndVehicles />,
    color: '#6E5FEC',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/autos-and-vehicles.webp',
    videoCategories: ['61-2', '59-2', '63-2'],
  },
  {
    id: '11',
    name: 'Twelfth category',
    icon: <SvgCategoriesHowtoAndStyle />,
    color: '#E57827',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/howto-and-style.webp',
    videoCategories: ['61-2', '63-2'],
  },
  {
    id: '12',
    name: 'Thirteenth category',
    icon: <SvgCategoriesMusic />,
    color: '#6EEC3A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/music.webp',
    videoCategories: ['59-2', '65-2'],
  },
  {
    id: '13',
    name: 'Fourteenth category',
    icon: <SvgCategoriesNonprofitsAndActivism />,
    color: '#E141D6',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/nonprofit-and-activism.webp',
    videoCategories: ['63-2', '65-2', '59-2', '61-2'],
  },
  {
    id: '14',
    name: 'Fifteenth category',
    icon: <SvgCategoriesNewsAndPolitics />,
    color: '#48F0B3',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/news-and-politics.webp',
    videoCategories: ['63-2'],
  },
]

export const findDisplayCategory = (id?: string | null) => displayCategories.find((category) => category.id === id)
export const allUniqueVideoCategories = intersection(
  concat(...displayCategories.map((category) => category.videoCategories))
)
