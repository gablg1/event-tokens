import React from 'react'
import styled from 'styled-components'
import { Colors, Shadows, Sizes, Transitions } from '../global/styles'
import { HeaderContainer } from './base/base'
import { useMediaQuery } from 'react-responsive'


export function TopBar() {
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 800px)'});
  return (
    <Header>
      <HeaderContainer>
        <HeaderNav>
          { isDesktopOrLaptop &&
            <ToMain href="/">
              <span>Crypto Tokens</span>
              <ToMainBottom>
                Made with <EmojiSpacing>🖤</EmojiSpacing> by Brex
              </ToMainBottom>
            </ToMain>
          }
        </HeaderNav>
      </HeaderContainer>
    </Header>
  )
}

const Header = styled.header`
  display: flex;
  position: fixed;
  top: 0;
  align-items: center;
  width: 100%;
  height: ${Sizes.headerHeight};
  background-color: ${Colors.Brex.White};
  box-shadow: ${Shadows.main};
  z-index: 100;
`

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
`

const ToMain = styled.a`
  display: flex;
  flex-direction: column;
  width: fit-content;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  transition: ${Transitions.all};

  &:hover {
    color: ${Colors.Brex.Orange};
  }
`

const ToMainBottom = styled.span`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  align-items: center;
  width: fit-content;
  font-size: 10px;
  line-height: 14px;
  font-weight: 500;
`

const EmojiSpacing = styled.span`
  letter-spacing: -0.3em;
`
