import { ModifierArguments, ModifierPhases } from '@popperjs/core'

import { zIndex } from '@/styles'

export const sameWidthModifier = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite' as ModifierPhases,
  requires: ['computeStyles'],
  fn: ({ state }: ModifierArguments<Record<string, unknown>>) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect: ({ state }: ModifierArguments<Record<string, unknown>>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state.elements.popper.style.width = `${(state.elements.reference as any).offsetWidth}px`
  },
}

export const popperIndexModifier = {
  name: 'popperIndex',
  enabled: true,
  phase: 'beforeWrite' as ModifierPhases,
  requires: ['computeStyles'],
  fn: ({ state }: ModifierArguments<Record<string, unknown>>) => {
    state.styles.popper.zIndex = String(zIndex.snackbars)
  },
  effect: ({ state }: ModifierArguments<Record<string, unknown>>) => {
    state.elements.popper.style.zIndex = String(zIndex.snackbars)
  },
}

export const flipModifier = {
  name: 'flip',
  options: {
    fallbackPlacements: ['top', 'right'],
  },
}
