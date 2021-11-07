import styled from '@emotion/styled'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { TopbarBase } from '@/components/TopbarBase'
import { absoluteRoutes, relativeRoutes } from '@/config/routes'
import { SvgJoystreamLogoFull } from '@/illustrations'
import { colors, sizes } from '@/theme'

import { CopyrightPolicyView } from './CopyrightPolicyView'
import { TermsOfServiceView } from './TermsOfServiceView'

const legalRoutes = [
  { path: relativeRoutes.legal.termsOfService(), element: <TermsOfServiceView /> },
  { path: relativeRoutes.legal.copyright(), element: <CopyrightPolicyView /> },
]

export const LegalLayout: React.FC = () => {
  return (
    <div>
      <StyledTopbarBase fullLogoNode={<SvgJoystreamLogoFull />} logoLinkUrl={absoluteRoutes.viewer.index()} />
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
  background-color: ${colors.gray[800]};

  a {
    text-decoration: none;
    color: ${colors.gray[50]};
  }
`
