import { createMemo, createSignal, For, onMount, Show } from 'solid-js'
import Banner from '../Discours/Banner'
import { NavTopics } from '../Nav/Topics'
import { Row5 } from '../Feed/Row5'
import { Row3 } from '../Feed/Row3'
import { Row2 } from '../Feed/Row2'
import { Row1 } from '../Feed/Row1'
import Hero from '../Discours/Hero'
import { Beside } from '../Feed/Beside'
import RowShort from '../Feed/RowShort'
import Slider from '../Feed/Slider'
import Group from '../Feed/Group'
import type { Shout, Topic } from '../../graphql/types.gen'
import { t } from '../../utils/intl'
import { useTopicsStore } from '../../stores/zine/topics'
import { loadShouts, useArticlesStore } from '../../stores/zine/articles'
import { useTopAuthorsStore } from '../../stores/zine/topAuthors'
import { locale } from '../../stores/ui'
import { restoreScrollPosition, saveScrollPosition } from '../../utils/scroll'
import { splitToPages } from '../../utils/splitToPages'

type HomeProps = {
  randomTopics: Topic[]
  shouts: Shout[]
}

export const PRERENDERED_ARTICLES_COUNT = 5
export const RANDOM_TOPICS_COUNT = 12
const CLIENT_LOAD_ARTICLES_COUNT = 29
const LOAD_MORE_PAGE_SIZE = 16 // Row1 + Row3 + Row2 + Beside (3 + 1) + Row1 + Row 2 + Row3

export const HomeView = (props: HomeProps) => {
  const {
    sortedArticles,
    articlesByLayout,
    topArticles,
    topCommentedArticles,
    topMonthArticles,
    topViewedArticles
  } = useArticlesStore({
    shouts: props.shouts
  })
  const { randomTopics, topTopics } = useTopicsStore({
    randomTopics: props.randomTopics
  })
  const [isLoadMoreButtonVisible, setIsLoadMoreButtonVisible] = createSignal(false)
  const { topAuthors } = useTopAuthorsStore()

  onMount(async () => {
    if (sortedArticles().length < PRERENDERED_ARTICLES_COUNT + CLIENT_LOAD_ARTICLES_COUNT) {
      const { hasMore } = await loadShouts({
        filters: { visibility: 'public' },
        limit: CLIENT_LOAD_ARTICLES_COUNT,
        offset: sortedArticles().length
      })

      setIsLoadMoreButtonVisible(hasMore)
    }
  })

  const randomLayout = createMemo(() => {
    const filledLayouts = Object.keys(articlesByLayout()).filter(
      // FIXME: is 7 ok? or more complex logic needed?
      (layout) => articlesByLayout()[layout].length > 7
    )

    const selectedRandomLayout =
      filledLayouts.length > 0 ? filledLayouts[Math.floor(Math.random() * filledLayouts.length)] : ''

    return (
      <Show when={Boolean(selectedRandomLayout)}>
        <Group articles={articlesByLayout()[selectedRandomLayout]} header={''} />
      </Show>
    )
  })

  const loadMore = async () => {
    saveScrollPosition()

    const { hasMore } = await loadShouts({
      filters: { visibility: 'public' },
      limit: LOAD_MORE_PAGE_SIZE,
      offset: sortedArticles().length
    })
    setIsLoadMoreButtonVisible(hasMore)

    restoreScrollPosition()
  }

  const pages = createMemo<Shout[][]>(() =>
    splitToPages(
      sortedArticles(),
      PRERENDERED_ARTICLES_COUNT + CLIENT_LOAD_ARTICLES_COUNT,
      LOAD_MORE_PAGE_SIZE
    )
  )

  return (
    <Show when={locale() && sortedArticles().length > 0}>
      <NavTopics topics={randomTopics()} />

      <Row5 articles={sortedArticles().slice(0, 5)} />

      <Hero />

      <Show when={sortedArticles().length > PRERENDERED_ARTICLES_COUNT}>
        <Beside
          beside={sortedArticles()[5]}
          title={t('Top viewed')}
          values={topViewedArticles().slice(0, 5)}
          wrapper={'top-article'}
        />

        <Row3 articles={sortedArticles().slice(6, 9)} />

        <Beside
          beside={sortedArticles()[9]}
          title={t('Top authors')}
          values={topAuthors()}
          wrapper={'author'}
        />

        <Slider title={t('Top month articles')} articles={topMonthArticles()} />

        <Row2 articles={sortedArticles().slice(10, 12)} />

        <RowShort articles={sortedArticles().slice(12, 16)} />

        <Row1 article={sortedArticles()[16]} />
        <Row3 articles={sortedArticles().slice(17, 20)} />
        <Row3 articles={topCommentedArticles().slice(0, 3)} header={<h2>{t('Top commented')}</h2>} />

        {randomLayout()}

        <Slider title={t('Favorite')} articles={topArticles()} />

        <Beside
          beside={sortedArticles()[20]}
          title={t('Top topics')}
          values={topTopics().slice(0, 5)}
          wrapper={'topic'}
          isTopicCompact={true}
        />

        <Row3 articles={sortedArticles().slice(21, 24)} />

        <Banner />

        <Row2 articles={sortedArticles().slice(24, 26)} />
        <Row3 articles={sortedArticles().slice(26, 29)} />
        <Row2 articles={sortedArticles().slice(29, 31)} />
        <Row3 articles={sortedArticles().slice(31, 34)} />
      </Show>

      <For each={pages()}>
        {(page) => (
          <>
            <Row1 article={page[0]} />
            <Row3 articles={page.slice(1, 4)} />
            <Row2 articles={page.slice(4, 6)} />
            <Beside values={page.slice(6, 9)} beside={page[9]} wrapper="article" />
            <Row1 article={page[10]} />
            <Row2 articles={page.slice(11, 13)} />
            <Row3 articles={page.slice(13, 16)} />
          </>
        )}
      </For>

      <Show when={isLoadMoreButtonVisible()}>
        <p class="load-more-container">
          <button class="button" onClick={loadMore}>
            {t('Load more')}
          </button>
        </p>
      </Show>
    </Show>
  )
}
