import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { MultiFileSelect } from '@/components/_inputs/MultiFileSelect'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { cVar, media, sizes } from '@/styles'

export const StyledMultiFileSelect = styled(MultiFileSelect)`
  ${media.md} {
    position: sticky;
    top: ${sizes(12)};
  }
`

export const StyledSvgAlertsInformative24 = styled(SvgAlertsInformative24)`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`

export const FormWrapper = styled(LimitedWidthContainer)`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  padding: ${sizes(12)} ${sizes(4)};

  ${media.md} {
    max-width: 1440px;
    padding: ${sizes(12)};
    padding-bottom: 0;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }
`

export const StyledBanner = styled(Banner)`
  margin: ${sizes(8)} 0;
`

export const InputsContainer = styled.div`
  display: grid;
  align-content: start;
  gap: ${sizes(8)};
  margin-top: ${sizes(12)};

  ${media.md} {
    margin-top: 0;
  }
`

type MoreSettingsSectionProps = {
  expanded: boolean
}
export const StyledTitleArea = styled(TitleInput)`
  width: 100%;
`

export const MoreSettingsSection = styled.div<MoreSettingsSectionProps>`
  display: grid;
  gap: ${sizes(8)};
  visibility: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  max-height: ${({ expanded }) => (expanded ? '1400px' : '0px')};
  overflow: ${({ expanded }) => (expanded ? 'unset' : 'hidden')};
  opacity: ${({ expanded }) => (expanded ? 1 : 0)};
  transition: opacity 150ms ease-out, max-height 150ms ease-out 150ms;
  padding-bottom: ${sizes(10)};
`

export const Divider = styled.div`
  margin: ${sizes(2)} 0;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  height: 1px;
  width: 100%;
`

export const SwitchNftWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 4px;
  align-items: center;
  justify-content: start;
`

export const VideoLink = styled(Link)`
  color: ${cVar('colorCoreBlue300')};
  text-decoration: none;
`

export const FileValidationBanner = styled(Banner)`
  margin-bottom: ${sizes(4)};

  path {
    fill: ${cVar('colorTextError')};
  }
`
