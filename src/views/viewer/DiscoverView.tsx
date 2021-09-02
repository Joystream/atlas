import styled from '@emotion/styled'
import React from 'react'

import { useVideosConnection } from '@/api/hooks'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/shared/components/VideoCategoryCard'
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
import { colors, media, sizes } from '@/shared/theme'

type VideoCategoryData = { title: string; icon: React.ReactNode; color: string; coverImg: string }
const videoCategories = {
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
const featuredVideoCategories: Array<{ videoUrl: string; videoTitle: string } & VideoCategoryData> = [
  {
    ...videoCategories['travel-and-events'],
    videoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/featured-videos/5778.mp4',
    videoTitle: 'Wreck Diving. Philippines, Boracay.',
  },
  {
    ...videoCategories['education'],
    videoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/featured-videos/3941.mp4',
    videoTitle: 'ФИЛОСОФИЯ СТОИЦИЗМА',
  },
  {
    ...videoCategories['film-and-animation'],
    videoUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/featured-videos/5984.mp4',
    videoTitle: 'taxi driver edit',
  },
]

export const DiscoverView: React.FC = () => {
  const { videosConnection } = useVideosConnection({
    first: 0,
  })
  const isMdBreakpoint = useMediaMatch('md')
  return (
    <StyledLimitedWidthContainer big>
      <Text variant="h2">Discover</Text>
      <FeaturedCategoriesContainer>
        {featuredVideoCategories.map((category, i) => (
          <GridItem key={i} colSpan={{ sm: i === 0 ? 2 : 1, xl: 1 }}>
            <FeaturedVideoCategoryCard
              variant={isMdBreakpoint ? 'default' : 'compact'}
              title={category.title}
              videoTitle={category.videoTitle}
              videoUrl={category.videoUrl}
              color={category.color}
              icon={category.icon}
            />
          </GridItem>
        ))}
      </FeaturedCategoriesContainer>
      <BorderTextContainer>
        <Text variant="h4">All categories</Text>
      </BorderTextContainer>
      <CategoriesContainer>
        {Object.values(videoCategories).map((category, i) => (
          <VideoCategoryCard
            key={i}
            title={category.title}
            coverImg={category.coverImg}
            categoryId={category.id}
            color={category.color}
            icon={category.icon}
            videosTotalCount={videosConnection?.totalCount}
            variant={isMdBreakpoint ? 'default' : 'compact'}
          />
        ))}
      </CategoriesContainer>
    </StyledLimitedWidthContainer>
  )
}

const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: ${sizes(16)} auto;
`

const FeaturedCategoriesContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin: ${sizes(16)} 0;

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }

  ${media.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${sizes(6)};
  margin: ${sizes(12)} 0 ${sizes(16)} 0;

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const BorderTextContainer = styled.div`
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${colors.gray[700]};
`
