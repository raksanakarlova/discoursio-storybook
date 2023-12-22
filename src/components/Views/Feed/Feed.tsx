import type { Author, LoadShoutsOptions, Reaction, Shout } from '../../../graphql/schema/core.gen'

import { getPagePath } from '@nanostores/router'
import { Meta } from '@solidjs/meta'
import { clsx } from 'clsx'
import { createEffect, createSignal, For, on, onMount, Show } from 'solid-js'

import { useLocalize } from '../../../context/localize'
import { useReactions } from '../../../context/reactions'
import { apiClient } from '../../../graphql/client/core'
import { router, useRouter } from '../../../stores/router'
import { useArticlesStore, resetSortedArticles } from '../../../stores/zine/articles'
import { useTopAuthorsStore } from '../../../stores/zine/topAuthors'
import { useTopicsStore } from '../../../stores/zine/topics'
import { getImageUrl } from '../../../utils/getImageUrl'
import { Icon } from '../../_shared/Icon'
import { Loading } from '../../_shared/Loading'
import { CommentDate } from '../../Article/CommentDate'
import { AuthorLink } from '../../Author/AhtorLink'
import { AuthorBadge } from '../../Author/AuthorBadge'
import { ArticleCard } from '../../Feed/ArticleCard'
import { Sidebar } from '../../Feed/Sidebar'

import styles from './Feed.module.scss'
import stylesBeside from '../../Feed/Beside.module.scss'
import stylesTopic from '../../Feed/CardTopic.module.scss'

export const FEED_PAGE_SIZE = 20
const UNRATED_ARTICLES_COUNT = 5

type FeedSearchParams = {
  by: 'publish_date' | 'rating' | 'last_comment'
}

const getOrderBy = (by: FeedSearchParams['by']) => {
  if (by === 'rating') {
    return 'rating_stat'
  }

  if (by === 'last_comment') {
    return 'last_comment'
  }

  return ''
}

type Props = {
  loadShouts: (options: LoadShoutsOptions) => Promise<{
    hasMore: boolean
    newShouts: Shout[]
  }>
}

export const FeedView = (props: Props) => {
  const { t } = useLocalize()
  const { page, searchParams } = useRouter<FeedSearchParams>()
  const [isLoading, setIsLoading] = createSignal(false)
  const [isRightColumnLoaded, setIsRightColumnLoaded] = createSignal(false)

  const { sortedArticles } = useArticlesStore()
  const { topTopics } = useTopicsStore()
  const { topAuthors } = useTopAuthorsStore()
  const [isLoadMoreButtonVisible, setIsLoadMoreButtonVisible] = createSignal(false)
  const [topComments, setTopComments] = createSignal<Reaction[]>([])
  const [unratedArticles, setUnratedArticles] = createSignal<Shout[]>([])

  const {
    actions: { loadReactionsBy },
  } = useReactions()

  const loadUnratedArticles = async () => {
    const result = await apiClient.getUnratedShouts(UNRATED_ARTICLES_COUNT)
    setUnratedArticles(result)
  }

  const loadTopComments = async () => {
    const comments = await loadReactionsBy({ by: { comment: true }, limit: 5 })
    setTopComments(comments)
  }

  onMount(() => {
    loadMore()
    // eslint-disable-next-line promise/catch-or-return
    Promise.all([loadUnratedArticles(), loadTopComments()]).finally(() => setIsRightColumnLoaded(true))
  })

  createEffect(
    on(
      () => page().route + searchParams().by,
      () => {
        resetSortedArticles()
        loadMore()
      },
      { defer: true },
    ),
  )
  const loadFeedShouts = () => {
    const options: LoadShoutsOptions = {
      limit: FEED_PAGE_SIZE,
      offset: sortedArticles().length,
    }

    const orderBy = getOrderBy(searchParams().by)

    if (orderBy) {
      options.order_by = orderBy
    }

    return props.loadShouts(options)
  }

  const loadMore = async () => {
    setIsLoading(true)
    const { hasMore, newShouts } = await loadFeedShouts()

    setIsLoading(false)

    loadReactionsBy({
      by: {
        shouts: newShouts.map((s) => s.slug),
      },
    })

    setIsLoadMoreButtonVisible(hasMore)
  }

  const ogImage = getImageUrl('production/image/logo_image.png')
  const description = t(
    'Independent media project about culture, science, art and society with horizontal editing',
  )
  const ogTitle = t('Feed')

  return (
    <div class="wide-container feed">
      <Meta name="descprition" content={description} />
      <Meta name="keywords" content={t('keywords')} />
      <Meta name="og:type" content="article" />
      <Meta name="og:title" content={ogTitle} />
      <Meta name="og:image" content={ogImage} />
      <Meta name="twitter:image" content={ogImage} />
      <Meta name="og:description" content={description} />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:title" content={ogTitle} />
      <Meta name="twitter:description" content={description} />
      <div class="row">
        <div class={clsx('col-md-5 col-xl-4', styles.feedNavigation)}>
          <Sidebar />
        </div>

        <div class="col-md-12 offset-xl-1">
          <ul class={clsx(styles.feedFilter, 'view-switcher')}>
            <li
              class={clsx({
                'view-switcher__item--selected': searchParams().by === 'publish_date' || !searchParams().by,
              })}
            >
              <a href={getPagePath(router, page().route)}>{t('Recent')}</a>
            </li>
            {/*<li>*/}
            {/*  <a href="/feed/?by=views">{t('Most read')}</a>*/}
            {/*</li>*/}
            <li
              class={clsx({
                'view-switcher__item--selected': searchParams().by === 'rating',
              })}
            >
              <a href={`${getPagePath(router, page().route)}?by=rating`}>{t('Top rated')}</a>
            </li>
            <li
              class={clsx({
                'view-switcher__item--selected': searchParams().by === 'last_comment',
              })}
            >
              <a href={`${getPagePath(router, page().route)}?by=last_comment`}>{t('Most commented')}</a>
            </li>
          </ul>

          <Show when={!isLoading()} fallback={<Loading />}>
            <Show when={sortedArticles().length > 0}>
              <For each={sortedArticles().slice(0, 4)}>
                {(article) => (
                  <ArticleCard article={article} settings={{ isFeedMode: true }} desktopCoverSize="M" />
                )}
              </For>

              <div class={styles.asideSection}>
                <div class={stylesBeside.besideColumnTitle}>
                  <h4>{t('Popular authors')}</h4>
                  <a href="/authors">
                    {t('All authors')}
                    <Icon name="arrow-right" class={stylesBeside.icon} />
                  </a>
                </div>

                <ul class={stylesBeside.besideColumn}>
                  <For each={topAuthors().slice(0, 5)}>
                    {(author) => (
                      <li>
                        <AuthorBadge author={author} />
                      </li>
                    )}
                  </For>
                </ul>
              </div>

              <For each={sortedArticles().slice(4)}>
                {(article) => (
                  <ArticleCard article={article} settings={{ isFeedMode: true }} desktopCoverSize="M" />
                )}
              </For>
            </Show>

            <Show when={isLoadMoreButtonVisible()}>
              <p class="load-more-container">
                <button class="button" onClick={loadMore}>
                  {t('Load more')}
                </button>
              </p>
            </Show>
          </Show>
        </div>

        <aside class={clsx('col-md-7 col-xl-6 offset-xl-1', styles.feedAside)}>
          <Show when={isRightColumnLoaded()}>
            <Show when={topComments().length > 0}>
              <section class={styles.asideSection}>
                <h4>{t('Comments')}</h4>
                <For each={topComments()}>
                  {(comment) => {
                    return (
                      <div class={styles.comment}>
                        <div class={clsx('text-truncate', styles.commentBody)}>
                          <a
                            href={`${getPagePath(router, 'article', {
                              slug: comment.shout.slug,
                            })}?commentId=${comment.id}`}
                            innerHTML={comment.body}
                          />
                        </div>
                        <div class={styles.commentDetails}>
                          <AuthorLink author={comment.created_by as Author} size={'XS'} />
                          <CommentDate comment={comment} isShort={true} isLastInRow={true} />
                        </div>
                        <div class={clsx('text-truncate', styles.commentArticleTitle)}>
                          <a href={`/${comment.shout.slug}`}>{comment.shout.title}</a>
                        </div>
                      </div>
                    )
                  }}
                </For>
              </section>
            </Show>

            <Show when={topTopics().length > 0}>
              <section class={styles.asideSection}>
                <h4>{t('Hot topics')}</h4>
                <For each={topTopics().slice(0, 7)}>
                  {(topic) => (
                    <span class={clsx(stylesTopic.shoutTopic, styles.topic)}>
                      <a href={`/topic/${topic.slug}`}>{topic.title}</a>{' '}
                    </span>
                  )}
                </For>
              </section>
            </Show>

            <section class={clsx(styles.asideSection, styles.pinnedLinks)}>
              <h4>{t('Knowledge base')}</h4>
              <ul class="nodash">
                <li>
                  <a href={getPagePath(router, 'guide')}>Как устроен Дискурс</a>
                </li>
                <li>
                  <a href="/how-to-write-a-good-article">Как создать хороший текст</a>
                </li>
                <li>
                  <a href="#">Правила конструктивных дискуссий</a>
                </li>
                <li>
                  <a href={getPagePath(router, 'principles')}>Принципы сообщества</a>
                </li>
              </ul>
            </section>
            <Show when={unratedArticles().length > 0}>
              <section class={clsx(styles.asideSection)}>
                <h4>{t('Be the first to rate')}</h4>
                <For each={unratedArticles()}>
                  {(article) => (
                    <ArticleCard article={article} settings={{ noimage: true, nodate: true }} />
                  )}
                </For>
              </section>
            </Show>
          </Show>
        </aside>
      </div>
    </div>
  )
}