import routes from '@/config/routes'
import { navigate, RouteComponentProps } from '@reach/router'
import React, { useState } from 'react'
import {
  FullLogo,
  Header,
  LogoLink,
  NavigationContainer,
  SearchbarContainer,
  ShortLogo,
  StyledSearchbar,
} from './TopNavbar.style'

type TopNavbarProps = RouteComponentProps

const TopNavbar: React.FC<TopNavbarProps> = () => {
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
    </Header>
  )
}

export default TopNavbar
