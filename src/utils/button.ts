import { To } from 'history'
import { Link } from 'react-router-dom'

export const getLinkPropsFromTo = (to?: To) => {
  if (!to) {
    return {}
  }

  if (typeof to === 'string' && to.includes('http')) {
    return { as: 'a', href: to, rel: 'noopener noreferrer', target: '_blank' } as const
  }

  return { as: Link, to: to }
}
