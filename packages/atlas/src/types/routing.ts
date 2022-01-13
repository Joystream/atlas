import { Location } from 'history'

export type RoutingState = {
  overlaidLocation?: Location
  highlightFailed?: boolean
} | null
