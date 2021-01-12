import routes from '@/config/routes'
import { Icon } from '@/shared/components'
import { navigate, RouteComponentProps } from '@reach/router'
import React, { useState } from 'react'
import {
  FullLogo,
  Header,
  LoginButton,
  LoginButtonsContainer,
  LogoLink,
  NavigationContainer,
  PlaylistButton,
  SearchbarContainer,
  ShortLogo,
  StyledSearchbar,
} from './Navbar.style'

type NavbarProps = RouteComponentProps

const Navbar: React.FC<NavbarProps> = () => {
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && search.trim()) {
      navigate(routes.search(search))
    }
    if (e.key === 'Escape' || e.key === 'Esc') {
      setIsFocused(false)
      setSearch('')
      e.currentTarget.blur()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setSearch(e.currentTarget.value)
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleCancel = () => {
    setSearch('')
    setIsFocused(false)
  }
  return (
    <Header hasFocus={isFocused}>
      <NavigationContainer>
        <LogoLink to="/">
          <ShortLogo />
          <FullLogo />
        </LogoLink>
      </NavigationContainer>
      <SearchbarContainer>
        <StyledSearchbar
          placeholder="Search..."
          onChange={handleChange}
          value={search}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onCancel={handleCancel}
          showCancelButton={isFocused}
          controlled
        />
      </SearchbarContainer>
      <LoginButtonsContainer>
        <LoginButton variant="secondary">Login</LoginButton>
        <PlaylistButton>
          <Icon name="bars-play" />
        </PlaylistButton>
      </LoginButtonsContainer>
    </Header>
  )
}

export default Navbar
