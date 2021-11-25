# Atlas Style document
Almost all style conventions we use in Atlas are taken care by ESLint and Prettier,  this document is meant to fill in the gap between the unspoken conventions the ones enforced by ESLint.




## Writing Components

We like to separate what a component does from how it looks like, and so when we have more than a couple of styled components in the same file, we move those to another file called `[Component].styles.ts` and import them from `[Component].tsx`, when then group those files in a folder called `[Component]` and export as default the Component from an `index.ts`.
Where it is clear what each styled component does, but the styled details are hidden.

When writing a component, we like to put hooks at the top of the function body, followed by derived state and only after that event handlers. There are of course exceptions like if you need some piece of derived state inside an hook, in this case is fine to declare it where it logically makes sense.
We write components as arrow functions since that improves type safety.

Here is an example: 


```javascript
// FancySection.tsx
import React, {useState, useEffect} from "react";

import {someSideEffect} from "@/utils";

type FancySectionProps = {
    // ... types for your props here.
}
const FancySection: React.FC<FancySectionProps> = ({firstProps, secondProp, ...etc}) => {
    // hooks first
    const [pressed, setPressed] = useState(false);
    const [count, setCount] = useState(0);

    useEffect(() => {
        someSideEffect(count);
    }, [count])
    // derived State
    const countedAndPressed = count > 0 && pressed

    const handleClick =() => {
       // do something here...
    }
    return (
        <Container>
            <Button pressed={pressed} onClick={handleClick}>Count: {count}</Button>
        </Container>
    )
}

```

## Styling components

We mainly use `@emotion/styled` to style components, if there is some style pattern or "snippet" that is repeated between multiple components, we like to use the `css` prop from `@emotion/react` to do so.
When possible, we like to use variables from our theme, which is imported from `@/shared/theme`, theme components should be distructured before being used. When possible, *always* use values from the theme as it helps keep the app consistent.

Here is a kitchen sink example:

```javascript
// YourComponent.styles.tsx
import styled from "@emotion/styled"
import { css } from "@emotion/react"

import { colors, sizes } from "@/shared/theme"


const blueIfPressed = (props) => css`
 Background-color: ${props => props.pressed ? colors.blue[500] : ''};

`
export const Container = styled.div`
	display: flex;
	background-color: ${colors.gray[500]};
`

export const Button = styled.button`
    font-size: ${oldTypography.sizes.h1};
    padding: ${sizes(4)};
    ${blueOnIfPressed};
` 
```
