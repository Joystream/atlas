import { Location } from 'history'

export type RoutingState = {
  overlaidLocation?: Location
  highlightVideoId?: string
} | null
