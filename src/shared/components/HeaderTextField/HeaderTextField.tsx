import React, { useState, useRef } from 'react'
import { Container, Title, WarningText, StyledTooltip, StyledInput } from './HeaderTextField.style'

const HeaderTextField = () => {
  const [text, setText] = useState('Lorem ipsum dolor')
  const [isInEditMode, setEditMode] = useState(false)
  const inputElement = useRef<HTMLInputElement>(null)

  const handleTextChange = (e) => {
    if (e.key !== 'Enter' || inputElement.current === null) {
      return
    }
    setEditMode(false)
    // Some logic here
  }
  return (
    <Container>
      {isInEditMode ? (
        <StyledInput
          ref={inputElement}
          type="text"
          defaultValue={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => handleTextChange(e)}
        />
      ) : (
        <Title variant="h1" onClick={(e) => setEditMode(!isInEditMode)}>
          {text}
        </Title>
      )}
      {text.length < 2 && <WarningText variant="body1">Channel title must be at least 2 character</WarningText>}
      {!isInEditMode && text && <StyledTooltip data-text="Click to edit channel title!" />}
    </Container>
  )
}

export default HeaderTextField
