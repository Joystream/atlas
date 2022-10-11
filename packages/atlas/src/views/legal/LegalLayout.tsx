import styled from '@emotion/styled'
import { FC } from 'react'
import { Route, Routes } from 'react-router-dom'

import { SvgAppLogoFull } from '@/assets/logos'
import { TopbarBase } from '@/components/_navigation/TopbarBase'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { cVar, sizes } from '@/styles'

import { CopyrightPolicyView } from './CopyrightPolicyView'
import { TermsOfServiceView } from './TermsOfServiceView'

const legalRoutes = [
  { path: relativeRoutes.legal.termsOfService(), element: <TermsOfServiceView /> },
  { path: relativeRoutes.legal.copyright(), element: <CopyrightPolicyView /> },
]

export const LegalLayout: FC = () => {
  return (
    <div>
      <StyledTopbarBase fullLogoNode={<SvgAppLogoFull />} logoLinkUrl={absoluteRoutes.viewer.index()} />
      <Container>
        <Routes>
          {legalRoutes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </Container>
    </div>
  )
}

const StyledTopbarBase = styled(TopbarBase)`
  left: 0;
`

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 120px auto;
  padding: ${sizes(8)} ${sizes(9)};
  background-color: ${cVar('colorCoreNeutral800')};

  a {
    text-decoration: none;
    color: ${cVar('colorCoreNeutral50')};
  }
`
