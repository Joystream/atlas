import React from 'react'

import {
  SvgVideoCategoriesAutosAndVehicles,
  SvgVideoCategoriesComedy,
  SvgVideoCategoriesEducation,
  SvgVideoCategoriesEntertainment,
  SvgVideoCategoriesFilmAndAnimation,
  SvgVideoCategoriesGaming,
  SvgVideoCategoriesHowtoAndStyle,
  SvgVideoCategoriesMusic,
  SvgVideoCategoriesNewsAndPolitics,
  SvgVideoCategoriesNonprofitsAndActivism,
  SvgVideoCategoriesPeopleAndBlogs,
  SvgVideoCategoriesPetsAndAnimals,
  SvgVideoCategoriesScienceAndTechnology,
  SvgVideoCategoriesSports,
  SvgVideoCategoriesTravelAndEvents,
} from '@/shared/icons'

export type VideoCategoryData = { name: string; id: string; icon: React.ReactNode; color: string; coverImg: string }
export const videoCategories: Record<string, VideoCategoryData> = {
  '14': {
    id: '14',
    name: 'Science & Technology',
    icon: <SvgVideoCategoriesScienceAndTechnology />,
    color: '#D92E61',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp',
  },
  '4': {
    id: '4',
    name: 'Pets & Animals',
    icon: <SvgVideoCategoriesPetsAndAnimals />,
    color: '#E7BE2D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/pets-and-animals.webp',
  },
  '1': {
    id: '1',
    name: 'Film & Animation',
    icon: <SvgVideoCategoriesFilmAndAnimation />,
    color: '#BD4BE4',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/film-and-animation.webp',
  },
  '8': {
    id: '8',
    name: 'People & Blogs',
    icon: <SvgVideoCategoriesPeopleAndBlogs />,
    color: '#BDE933',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/people-and-blogs.webp',
  },
  '10': {
    id: '10',
    name: 'Entertainment',
    icon: <SvgVideoCategoriesEntertainment />,
    color: '#54A7F0',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/entertainment.webp',
  },
  '13': {
    id: '13',
    name: 'Education',
    icon: <SvgVideoCategoriesEducation />,
    color: '#DD379D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/education.webp',
  },
  '6': {
    id: '6',
    name: 'Travel & Events',
    icon: <SvgVideoCategoriesTravelAndEvents />,
    color: '#5A7AEE',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/travel-and-events.webp',
  },
  '5': {
    id: '5',
    name: 'Sports',
    icon: <SvgVideoCategoriesSports />,
    color: '#41EE5A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/sports.webp',
  },
  '7': {
    id: '7',
    name: 'Gaming',
    icon: <SvgVideoCategoriesGaming />,
    color: '#9455E8',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/gaming.webp',
  },
  '9': {
    id: '9',
    name: 'Comedy',
    icon: <SvgVideoCategoriesComedy />,
    color: '#4FE1F2',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/comedy.webp',
  },
  '2': {
    id: '2',
    name: 'Autos & Vehicles',
    icon: <SvgVideoCategoriesAutosAndVehicles />,
    color: '#6E5FEC',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/autos-and-vehicles.webp',
  },
  '12': {
    id: '12',
    name: 'Howto & Style',
    icon: <SvgVideoCategoriesHowtoAndStyle />,
    color: '#E57827',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/howto-and-style.webp',
  },
  '3': {
    id: '3',
    name: 'Music',
    icon: <SvgVideoCategoriesMusic />,
    color: '#6EEC3A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/music.webp',
  },
  '15': {
    id: '15',
    name: 'Nonprofits & Activism',
    icon: <SvgVideoCategoriesNonprofitsAndActivism />,
    color: '#E141D6',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/nonprofit-and-activism.webp',
  },
  '11': {
    id: '11',
    name: 'News & Politics',
    icon: <SvgVideoCategoriesNewsAndPolitics />,
    color: '#48F0B3',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/news-and-politics.webp',
  },
} as const
export const selectedFeaturedVideoCategories: Array<VideoCategoryData> = [
  {
    ...videoCategories['2'],
  },
  {
    ...videoCategories['13'],
  },
  {
    ...videoCategories['1'],
  },
]
