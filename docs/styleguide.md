# Atlas Style document

Almost all style conventions we use in Atlas are taken care by ESLint and Prettier, this document is meant to fill in the gap between the unspoken conventions and the ones enforced by tooling.

## Styling

We do all the styling using the `emotion` library, mostly using the `styled` syntax. (Check [here](overview.md#Styling) for more details on `cVar`) Quick example:

```tsx
import styled from '@emotion/styled'

import { cVar } from '@/styles'

export const StyledContainer = styled.div`
  background-color: ${cVar('colorBackground')};
`
```

### Spacing

When defining spacing (padding/margin), we use `sizes` helper imported from `@/styles`. You provide a multiplier of base spacing (4px) and get back string with pixels value. For example `sizes(2)` will produce `"8px"`.

### Reusability

If a given piece of CSS is repeated multiple times inside a single file, it may make sense to extract that into a separate `css` block to be reused by different components:

```tsx
import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

type Props = {
  pressed: boolean
}

const blueIfPressed = ({ pressed }: Props) => css`
  background-color: ${pressed ? cVar('colorBackgroundPrimary') : 'initial'};
`

const Container = styled.div<Props>`
  display: flex;
  ${blueIfPressed};
`

const Button = styled.button<Props>`
  padding: ${sizes(4)};
  ${blueIfPressed};
`
```

### Conditional styles

In a lot of cases, styles need to be based on some condition, for example different colors based on component variant, etc. In those cases we use props provided by the `emotion` library. One important aspect to keep an eye on is to avoid keeping conditional styles inside raw string - this will make our tooling not properly understand the style, disabling benefits of linters, IDE features, etc. Example:

```tsx
import { css } from '@emotion/react'
import styled from '@emotion/styled'

type Props = {
  enabled: boolean
}

// don't do this:
const BadExample = styled.div<Props>`
  // in this example opacity is passed in a raw string and will not be properly interpreted by tooling
  ${({ enabled }) => (!enabled ? 'opacity: 0.5;' : '')};
`

// do this:
const disabledCss = css`
  opacity: 0.5;
`

const GoodExample = styled.div<Props>`
  // in this example conditional style is defined in a separate css block and will be properly parsed by tooling
  ${({ enabled }) => !enabled && disabledCss};
`
```

## Components

### Directory structure

Every reusable component should be placed inside `src/components`. If any of the component categories (directories starting with underscore, e.g. `_buttons`) is a good fit, the component should be placed there. Every component should have its own directory named the same as the component. The directory should contain the following files:

- `Component/`
  - `index.ts` - re-exporting anything needed
  - `Component.tsx` - component code
  - _(optional)_ `Component.styles.ts` - any styles needed for the component
  - _(optional)_ `Component.stories.tsx` - Storybook stories exploring different use cases/variants of the component

## Component structure

In the main component file, we try to preserve a following structure:

1. Hook calls
2. Derived state
3. Event handlers
4. Conditional returns

Here is an example of a nicely written component:

```tsx
// Component.tsx
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { someSideEffect } from '@/utils'

type ComponentProps = {
  hidden?: boolean
  otherProp?: number
}

// all components should use named exports
export const Component: React.FC<ComponentProps> = ({ hidden, otherProp, ...rest }) => {
  // hooks first
  const [pressed, setPressed] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    someSideEffect(count)
  }, [count])

  // derived state
  const countedAndPressed = count > 0 && pressed

  // event handlers
  const handleClick = () => {
    setCount((count) => count + 1)
    setPressed(true)
  }

  // conditional return
  if (hidden) {
    return null
  }

  return (
    <div>
      <Button pressed={pressed} onClick={handleClick}>
        Count: {count}
      </Button>
      {countedAndPressed && <span>Great job!</span>}
    </div>
  )
}
```

## Naming

In terms of naming, `PascalCase` should be used for component names and Typescript types. Constants should be named using `UPPER_CASE`. Everything else should use `camelCase`.

Also, to stay consistent, all event handlers used in components should be named with `handle` prefix followed by the name of the event handled. So for example:

```tsx
const handleClick = () => console.log('Clicked!')

return <Button onClick={handleClick} />
```
