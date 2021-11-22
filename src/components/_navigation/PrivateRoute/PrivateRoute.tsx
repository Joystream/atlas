import React from 'react'
import { Navigate, Route } from 'react-router'

type PrivateRouteProps = {
  element: React.ReactElement
  redirectTo?: string
  isAuth?: boolean
  path: string
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ element: Element, redirectTo, isAuth, path, ...props }) => {
  if (!isAuth && redirectTo) {
    return <Navigate to={redirectTo} replace />
  }
  return <Route path={path} element={Element} {...props} />
}
