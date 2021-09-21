import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Page } from './components/base/base'
import { TopBar } from './components/TopBar'
import { GlobalStyle } from './global/GlobalStyle'
import { About } from './pages/About'
import { ClaimPage } from './pages/Claim'
import { All } from './pages/All'
import { ViewNFT } from './pages/ViewNFT'
import { NotificationsList } from './components/Transactions/History'

export function App() {
  return (
    <Page>
      <GlobalStyle />
      <BrowserRouter>
        <TopBar />
        <Switch>
          <Route path="/claim/:eventId/:fraction" render={({match}) => {
            return (
              <ClaimPage eventId={match.params.eventId} fraction={parseInt(match.params.fraction)} />
            );
          }} />
          <Route exact path="/" component={About} />
          <Route exact path="/all" component={All} />
          <Redirect exact from="/" to="/about" />
        </Switch>
      </BrowserRouter>
      <NotificationsList />
    </Page>
  )
}
