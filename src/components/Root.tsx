// FIXME: breaks on vercel, research
// import 'solid-devtools'

import { Component, createMemo, lazy } from 'solid-js'
import { Routes, useRouter } from '../stores/router'
import { Dynamic } from 'solid-js/web'
import { getLogger } from '../utils/logger'

import type { PageProps } from './types'

// do not remove
// for debugging, to disable lazy loading
// import HomePage from './Pages/HomePage'
// import AllTopicsPage from './Pages/AllTopicsPage'
// import TopicPage from './Pages/TopicPage'
// import AllAuthorsPage from './Pages/AllAuthorsPage'
// import AuthorPage from './Pages/AuthorPage'
// import FeedPage from './Pages/FeedPage'
// import ArticlePage from './Pages/ArticlePage'
// import SearchPage from './Pages/SearchPage'
// import FourOuFourPage from './Pages/FourOuFourPage'

const HomePage = lazy(() => import('./Pages/HomePage'))
const AllTopicsPage = lazy(() => import('./Pages/AllTopicsPage'))
const TopicPage = lazy(() => import('./Pages/TopicPage'))
const AllAuthorsPage = lazy(() => import('./Pages/AllAuthorsPage'))
const AuthorPage = lazy(() => import('./Pages/AuthorPage'))
const FeedPage = lazy(() => import('./Pages/FeedPage'))
const ArticlePage = lazy(() => import('./Pages/ArticlePage'))
const SearchPage = lazy(() => import('./Pages/SearchPage'))
const FourOuFourPage = lazy(() => import('./Pages/FourOuFourPage'))

const log = getLogger('root')

const pagesMap: Record<keyof Routes, Component<PageProps>> = {
  home: HomePage,
  topics: AllTopicsPage,
  topic: TopicPage,
  authors: AllAuthorsPage,
  author: AuthorPage,
  feed: FeedPage,
  article: ArticlePage,
  search: SearchPage
}

export const Root = (props: PageProps) => {
  const { getPage } = useRouter()

  // log.debug({ route: getPage().route })

  const pageComponent = createMemo(() => {
    const result = pagesMap[getPage().route]

    // log.debug('page', getPage())

    if (!result) {
      return FourOuFourPage
    }

    return result
  })
  // TODO: move MainLayout here
  return <Dynamic component={pageComponent()} {...props} />
}