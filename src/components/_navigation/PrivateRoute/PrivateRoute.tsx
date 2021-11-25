import React from 'react'
import { Navigate } from 'react-router-dom'

type PrivateRouteProps = {
  element: React.ReactElement
  redirectTo?: string
  isAuth?: boolean
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo, isAuth, element }) => {
  if (!isAuth && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }
  return element
}
