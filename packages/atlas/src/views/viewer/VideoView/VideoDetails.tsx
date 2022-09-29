import { FC, ReactNode, useState } from 'react'

import { FullVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { SvgActionChevronB, SvgActionChevronT } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoCategoryData } from '@/config/categories'
import { absoluteRoutes } from '@/config/routes'
import knownLicenses from '@/data/knownLicenses.json'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  Category,
  CategoryWrapper,
  DescriptionBody,
  DescriptionContainer,
  DescriptionCopyWrapper,
  DescriptionLink,
  DescriptionSkeletonLoader,
  DetailsWrapper,
  ExpandButton,
  LicenceCategoryWrapper,
} from './VideoDetails.styles'

type VideoDetailsProps = {
  video?: FullVideoFieldsFragment | null
  categoryData?: VideoCategoryData[] | null
}
export const VideoDetails: FC<VideoDetailsProps> = ({ video, categoryData }) => {
  const mdMatch = useMediaMatch('md')
  const [detailsExpanded, setDetailsExpanded] = useState(false)

  const foundLicense = knownLicenses.find((license) => license.code === video?.license?.code)

  const toggleDetailsExpand = () => {
    setDetailsExpanded((prevState) => !prevState)
  }

  return (
    <DetailsWrapper>
      <DescriptionContainer>
        {video ? (
          video?.description && (
            <>
              <Text as="h2" variant="h100" margin={{ bottom: 2 }}>
                Description
              </Text>
              <DescriptionBody detailsExpanded={detailsExpanded}>
                <DescriptionCopyWrapper as="div" variant={mdMatch ? 't300' : 't200'}>
                  {replaceUrls(video.description)}
                </DescriptionCopyWrapper>
              </DescriptionBody>
            </>
          )
        ) : (
          <>
            <DescriptionSkeletonLoader width="70%" />
            <DescriptionSkeletonLoader width="40%" />
            <DescriptionSkeletonLoader width="80%" />
            <DescriptionSkeletonLoader width="30%" />
          </>
        )}
      </DescriptionContainer>
      <LicenceCategoryWrapper detailsExpanded={detailsExpanded || !video?.description}>
        <GridItem>
          {video ? (
            <>
              <Text as="h2" variant="h100" margin={{ bottom: 2 }}>
                License
              </Text>
              {foundLicense && (
                <Text as="p" variant={mdMatch ? 't300' : 't200'} color="colorText">
                  {foundLicense.name}
                </Text>
              )}
              <Text as="p" variant="t100" color="colorText" margin={{ top: 2 }}>
                {video.license?.customText}
              </Text>
            </>
          ) : (
            <SkeletonLoader height={12} width={200} />
          )}
        </GridItem>
        <CategoryWrapper>
          {video ? (
            <>
              <Text as="h2" variant="h100">
                Category
              </Text>
              {categoryData?.map((category) => (
                <Category key={category.id} to={absoluteRoutes.viewer.category(category.id)}>
                  {category.icon}
                  <Text as="p" variant="t300" color="colorText">
                    {category.name}
                  </Text>
                </Category>
              ))}
            </>
          ) : (
            <SkeletonLoader height={12} width={200} />
          )}
        </CategoryWrapper>
      </LicenceCategoryWrapper>
      {video?.description && (
        <ExpandButton
          onClick={toggleDetailsExpand}
          iconPlacement="right"
          size="medium"
          variant="tertiary"
          icon={detailsExpanded ? <SvgActionChevronT /> : <SvgActionChevronB />}
        >
          Show {!detailsExpanded ? 'more' : 'less'}
        </ExpandButton>
      )}
    </DetailsWrapper>
  )
}

const replaceUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.reduce((acc, part, idx) => {
    const node = urlRegex.test(part) ? (
      <DescriptionLink size="large" key={`description-link-${idx}`} to={part}>
        {part}
      </DescriptionLink>
    ) : (
      part
    )

    return [...acc, node]
  }, [] as ReactNode[])
}
