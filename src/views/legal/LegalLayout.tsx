import React from 'react'
import { Route, Routes } from 'react-router-dom'
import styled from '@emotion/styled'
import { relativeRoutes } from '@/config/routes'
import TermsOfServiceView from './TermsOfServiceView'
import CopyrightPolicyView from './CopyrightPolicyView'
import { TopbarBase } from '@/components'
import { colors, sizes } from '@/shared/theme'

const legalRoutes = [
  { path: relativeRoutes.legal.termsOfService(), element: <TermsOfServiceView /> },
  { path: relativeRoutes.legal.copyright(), element: <CopyrightPolicyView /> },
]

const LegalLayout: React.FC = () => {
  return (
    <div>
      <StyledTopbarBase />
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

export default LegalLayout
