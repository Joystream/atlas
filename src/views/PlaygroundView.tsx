import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import { Text } from '@/shared/components'
import Link from '@/components/Link'

type Inputs = {
  title: string
  videoSelect: string
  header: string
  check: string
  textarea: string
}

const textFieldValidation = (inputName: string) => ({
  required: {
    value: true,
    message: `${inputName} cannot be empty`,
  },
  minLength: {
    value: 3,
    message: `${inputName} must be longer than 3 characters.`,
  },
  maxLength: {
    value: 20,
    message: `${inputName} cannot be longer than 20 characters.`,
  },
})

const selectValidation = () => ({
  required: {
    value: true,
    message: 'Option must be selected',
  },
})

const items: SelectedItem[] = [
  { name: 'Public (Anyone can see this video', value: 'public' },
  { name: 'Private', value: 'private' },
]

export const PlaygroundView = () => {
  const { register, handleSubmit, control, setValue, watch, errors } = useForm<Inputs>({
    shouldFocusError: false,
  })
  const onSubmit = handleSubmit((data) => console.log(data))
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [checkboxValue, setCheckboxValue] = useState(false)
  return (
    <Container>
      <Text variant="h2">Internal testing view</Text>
      <LinksContainer>
        <Link to="./first">First</Link>
        <Link to="./second">Second</Link>
        <Link to="./third">Third</Link>
      </LinksContainer>
      <Routes>
        <Route key="first" path="/first" element={<p>First</p>} />
        <Route key="second" path="/second" element={<p>Second</p>} />
        <Route key="third" path="/third" element={<p>Third</p>} />
      </Routes>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 2rem 2rem;
`

const LinksContainer = styled.div`
  display: flex;
  gap: 20px;
  a {
    font-size: 16px;
  }
`

const StyledCheckboxContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
  p {
    margin-left: 20px;
  }
`

export default PlaygroundView
