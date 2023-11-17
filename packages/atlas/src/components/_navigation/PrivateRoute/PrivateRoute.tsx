import { FC, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Loader } from '@/components/_loaders/Loader'

import { LoaderContainer } from './PrivteRoute.styles'

type PrivateRouteProps = {
  element: ReactElement
  redirectTo?: string
  showWhen?: boolean
  isLoadingAuthData?: boolean
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ redirectTo, showWhen, element, isLoadingAuthData }) => {
  const location = useLocation()

  if (isLoadingAuthData) {
    return (
      <LoaderContainer>
        <Loader variant="xlarge" />
      </LoaderContainer>
    )
  }

  if (showWhen === false && redirectTo) {
    console.log('redirectTo', redirectTo, 'and then', location.pathname)
    return <Navigate to={redirectTo} state={{ redirectTo: location.pathname }} />
  }
  return element
}
