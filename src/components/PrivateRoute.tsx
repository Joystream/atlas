import React from 'react'
import { Route, Navigate } from 'react-router'

type PrivateRouteProps = {
  element: React.ReactElement
  redirectTo?: string
  isAuth?: boolean
  path: string
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, redirectTo, isAuth, path, ...props }) => {
  if (!isAuth && redirectTo) {
    return <Navigate to={redirectTo} />
  }
  return <Route path={path} element={Element} {...props} />
}
