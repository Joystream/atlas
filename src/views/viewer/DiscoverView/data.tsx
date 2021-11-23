import React from 'react'

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

export type VideoCategoryData = { id: string; icon: React.ReactNode; color: string; coverImg: string }
export const videoCategories: Record<string, VideoCategoryData> = {
  '14': {
    id: '14',
    icon: <SvgCategoriesScienceAndTechnology />,
    color: '#D92E61',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp',
  },
  '4': {
    id: '4',
    icon: <SvgCategoriesPetsAndAnimals />,
    color: '#E7BE2D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/pets-and-animals.webp',
  },
  '1': {
    id: '1',
    icon: <SvgCategoriesFilmAndAnimation />,
    color: '#BD4BE4',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/film-and-animation.webp',
  },
  '8': {
    id: '8',
    icon: <SvgCategoriesPeopleAndBlogs />,
    color: '#BDE933',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/people-and-blogs.webp',
  },
  '10': {
    id: '10',
    icon: <SvgCategoriesEntertainment />,
    color: '#54A7F0',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/entertainment.webp',
  },
  '13': {
    id: '13',
    icon: <SvgCategoriesEducation />,
    color: '#DD379D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/education.webp',
  },
  '6': {
    id: '6',
    icon: <SvgCategoriesTravelAndEvents />,
    color: '#5A7AEE',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/travel-and-events.webp',
  },
  '5': {
    id: '5',
    icon: <SvgCategoriesSports />,
    color: '#41EE5A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/sports.webp',
  },
  '7': {
    id: '7',
    icon: <SvgCategoriesGaming />,
    color: '#9455E8',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/gaming.webp',
  },
  '9': {
    id: '9',
    icon: <SvgCategoriesComedy />,
    color: '#4FE1F2',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/comedy.webp',
  },
  '2': {
    id: '2',
    icon: <SvgCategoriesAutosAndVehicles />,
    color: '#6E5FEC',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/autos-and-vehicles.webp',
  },
  '12': {
    id: '12',
    icon: <SvgCategoriesHowtoAndStyle />,
    color: '#E57827',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/howto-and-style.webp',
  },
  '3': {
    id: '3',
    icon: <SvgCategoriesMusic />,
    color: '#6EEC3A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/music.webp',
  },
  '15': {
    id: '15',
    icon: <SvgCategoriesNonprofitsAndActivism />,
    color: '#E141D6',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/nonprofit-and-activism.webp',
  },
  '11': {
    id: '11',
    icon: <SvgCategoriesNewsAndPolitics />,
    color: '#48F0B3',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/news-and-politics.webp',
  },
} as const
