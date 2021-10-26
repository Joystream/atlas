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

export type VideoCategoryData = { title: string; id: string; icon: React.ReactNode; color: string; coverImg: string }
export const videoCategories = {
  'science-and-Technology': {
    id: '14',
    title: 'Science & Technology',
    icon: <SvgVideoCategoriesScienceAndTechnology />,
    color: '#D92E61',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp',
  },
  'pets-and-animals': {
    id: '4',
    title: 'Pets & Animals',
    icon: <SvgVideoCategoriesPetsAndAnimals />,
    color: '#E7BE2D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/pets-and-animals.webp',
  },
  'film-and-animation': {
    id: '1',
    title: 'Film & Animation',
    icon: <SvgVideoCategoriesFilmAndAnimation />,
    color: '#BD4BE4',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/film-and-animation.webp',
  },
  'people-and-blogs': {
    id: '8',
    title: 'People & Blogs',
    icon: <SvgVideoCategoriesPeopleAndBlogs />,
    color: '#BDE933',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/people-and-blogs.webp',
  },
  'entertainment': {
    id: '10',
    title: 'Entertainment',
    icon: <SvgVideoCategoriesEntertainment />,
    color: '#54A7F0',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/entertainment.webp',
  },
  'education': {
    id: '13',
    title: 'Education',
    icon: <SvgVideoCategoriesEducation />,
    color: '#DD379D',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/education.webp',
  },
  'travel-and-events': {
    id: '6',
    title: 'Travel & Events',
    icon: <SvgVideoCategoriesTravelAndEvents />,
    color: '#5A7AEE',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/travel-and-events.webp',
  },
  'sports': {
    id: '5',
    title: 'Sports',
    icon: <SvgVideoCategoriesSports />,
    color: '#41EE5A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/sports.webp',
  },
  'gaming': {
    id: '7',
    title: 'Gaming',
    icon: <SvgVideoCategoriesGaming />,
    color: '#9455E8',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/gaming.webp',
  },
  'comedy': {
    id: '9',
    title: 'Comedy',
    icon: <SvgVideoCategoriesComedy />,
    color: '#4FE1F2',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/comedy.webp',
  },
  'autos-and-vehicles': {
    id: '2',
    title: 'Autos & Vehicles',
    icon: <SvgVideoCategoriesAutosAndVehicles />,
    color: '#6E5FEC',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/autos-and-vehicles.webp',
  },
  'howto-and-style': {
    id: '12',
    title: 'Howto & Style',
    icon: <SvgVideoCategoriesHowtoAndStyle />,
    color: '#E57827',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/howto-and-style.webp',
  },
  'music': {
    id: '3',
    title: 'Music',
    icon: <SvgVideoCategoriesMusic />,
    color: '#6EEC3A',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/music.webp',
  },
  'nonprofits-and-activism': {
    id: '15',
    title: 'Nonprofits & Activism',
    icon: <SvgVideoCategoriesNonprofitsAndActivism />,
    color: '#E141D6',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/nonprofit-and-activism.webp',
  },
  'news-and-politics': {
    id: '11',
    title: 'News & Politics',
    icon: <SvgVideoCategoriesNewsAndPolitics />,
    color: '#48F0B3',
    coverImg: 'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/news-and-politics.webp',
  },
} as const
export const selectedFeaturedVideoCategories: Array<VideoCategoryData> = [
  {
    ...videoCategories['autos-and-vehicles'],
  },
  {
    ...videoCategories['education'],
  },
  {
    ...videoCategories['film-and-animation'],
  },
]
