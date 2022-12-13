import { Modifier } from 'react-popper'

import { zIndex } from '@/styles'

export const sameWidthModifier: Partial<Modifier<string, object>> = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite' as Modifier<string, object>['phase'],
  requires: ['computeStyles'],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect: ({ state }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.elements.popper.style.width = `${(state.elements.reference as any).offsetWidth}px`
  },
}

export const popperIndexModifier: Partial<Modifier<string, object>> = {
  name: 'popperIndex',
  enabled: true,
  phase: 'beforeWrite' as Modifier<string, object>['phase'],
  requires: ['computeStyles'],
  fn: ({ state }) => {
    state.styles.popper.zIndex = String(zIndex.snackbars)
  },
  effect: ({ state }) => {
    state.elements.popper.style.zIndex = String(zIndex.snackbars)
  },
}

export const flipModifier = {
  name: 'flip',
  options: {
    fallbackPlacements: ['top', 'right'],
  },
}

export const offsetModifier = {
  name: 'offset',
  enabled: true,
  options: {
    offset: ({ placement }: { placement: 'top' | 'bottom' }) => (placement === 'top' ? [0, -15] : [0, 0]),
  },
}

export const dropdownModifiers = [sameWidthModifier, flipModifier, popperIndexModifier, offsetModifier]
