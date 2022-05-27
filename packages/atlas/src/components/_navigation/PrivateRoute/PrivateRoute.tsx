import { FC, ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

type PrivateRouteProps = {
  element: ReactElement
  redirectTo?: string
  isAuth?: boolean
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ redirectTo, isAuth, element }) => {
  if (!isAuth && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }
  return element
}
