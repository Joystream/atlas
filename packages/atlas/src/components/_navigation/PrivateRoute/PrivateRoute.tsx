import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import { Loader } from '@/components/_loaders/Loader'

import { LoaderContainer } from './PrivteRoute.styles'

type PrivateRouteProps = {
  element: ReactElement
  redirectTo?: string
  isAuth?: boolean
  isLoadingAuthData?: boolean
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ redirectTo, isAuth, element, isLoadingAuthData }) => {
  if (isLoadingAuthData) {
    return (
      <LoaderContainer>
        <Loader variant="xlarge" />
      </LoaderContainer>
    )
  }

  if (!isAuth && redirectTo) {
    return <Navigate to={redirectTo} />
  }
  return element
}
