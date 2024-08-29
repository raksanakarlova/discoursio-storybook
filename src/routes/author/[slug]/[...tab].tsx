import { RouteSectionProps, createAsync } from '@solidjs/router'
import { ErrorBoundary, Suspense, createEffect, createSignal, on } from 'solid-js'
import { AuthorView } from '~/components/Views/Author'
import { FourOuFourView } from '~/components/Views/FourOuFour'
import { LoadMoreItems, LoadMoreWrapper } from '~/components/_shared/LoadMoreWrapper'
import { Loading } from '~/components/_shared/Loading'
import { PageLayout } from '~/components/_shared/PageLayout'
import { useAuthors } from '~/context/authors'
import { SHOUTS_PER_PAGE, useFeed } from '~/context/feed'
import { useLocalize } from '~/context/localize'
import { ReactionsProvider } from '~/context/reactions'
import { loadAuthors, loadShouts, loadTopics } from '~/graphql/api/public'
import {
  Author,
  LoadShoutsOptions,
  QueryLoad_Authors_ByArgs,
  Shout,
  Topic
} from '~/graphql/schema/core.gen'
import { getImageUrl } from '~/lib/getThumbUrl'

const fetchAuthorShouts = async (slug: string, offset?: number) => {
  const opts: LoadShoutsOptions = { filters: { author: slug }, limit: SHOUTS_PER_PAGE, offset }
  const shoutsLoader = loadShouts(opts)
  return await shoutsLoader()
}

const fetchAllTopics = async () => {
  const topicsFetcher = loadTopics()
  return await topicsFetcher()
}

const fetchAuthor = async (slug: string) => {
  const authorFetcher = loadAuthors({ by: { slug }, limit: 1, offset: 0 } as QueryLoad_Authors_ByArgs)
  const aaa = await authorFetcher()
  return aaa?.[0]
}

export const route = {
  load: async ({ params, location: { query } }: RouteSectionProps<{ articles: Shout[] }>) => {
    const offset: number = Number.parseInt(query.offset, 10)
    console.debug('route loading with offset', offset)
    return {
      author: await fetchAuthor(params.slug),
      articles: await fetchAuthorShouts(params.slug, offset),
      topics: await fetchAllTopics()
    }
  }
}

export type AuthorPageProps = { articles?: Shout[]; author?: Author; topics?: Topic[] }

export default function AuthorPage(props: RouteSectionProps<AuthorPageProps>) {
  const { t } = useLocalize()

  // load author's profile
  const { addAuthor, authorsEntities } = useAuthors()
  const [author, setAuthor] = createSignal<Author | undefined>(undefined)
  createEffect(
    on(
      author,
      async (profile) => {
        // update only if no profile loaded
        if (!profile) {
          const loadedAuthor =
            authorsEntities()[props.params.slug] || (await fetchAuthor(props.params.slug))
          if (loadedAuthor) {
            addAuthor(loadedAuthor)
            setAuthor(loadedAuthor)
          }
        }
      },
      { defer: true }
    )
  )

  // author's data, view counter
  const [title, setTitle] = createSignal<string>('')
  const [desc, setDesc] = createSignal<string>('')
  const [cover, setCover] = createSignal<string>('')
  const [viewed, setViewed] = createSignal(false)
  createEffect(
    on(
      [author, () => window],
      ([a, win]) => {
        if (a && win) {
          console.debug('[routes] author/[slug] author loaded fx')
          if (!a) return
          setTitle(() => `${t('Discours')}${a.name ? ` :: ${a.name}` : ''}`)
          setDesc(() => a.about || a.bio || '')
          setCover(() => (a.pic ? getImageUrl(a.pic || '', { width: 1200 }) : 'log.png'))

          // views google counter increment
          if (!viewed()) {
            window?.gtag?.('event', 'page_view', {
              page_title: author()?.name || '',
              page_location: window?.location.href || '',
              page_path: window?.location.pathname || ''
            })
            setViewed(true)
          }
        }
      },
      {}
    )
  )

  // author's shouts
  const { addFeed, feedByAuthor } = useFeed()
  const [loadMoreHidden, setLoadMoreHidden] = createSignal(true)
  const authorShouts = createAsync(async () => {
    const sss: Shout[] = (props.data.articles as Shout[]) || feedByAuthor()[props.params.slug] || []
    const result = sss || (await fetchAuthorShouts(props.params.slug, 0))
    if (!result) setLoadMoreHidden(true)
    return result
  })

  // load more shouts
  const loadAuthorShoutsMore = async (offset: number) => {
    const loadedShouts = await fetchAuthorShouts(props.params.slug, offset)
    loadedShouts && addFeed(loadedShouts)
    return (loadedShouts || []) as LoadMoreItems
  }

  return (
    <ErrorBoundary fallback={(_err) => <FourOuFourView />}>
      <Suspense fallback={<Loading />}>
        <PageLayout
          title={title()}
          headerTitle={author()?.name || ''}
          slug={author()?.slug}
          desc={desc()}
          cover={cover()}
        >
          <ReactionsProvider>
            <LoadMoreWrapper
              loadFunction={loadAuthorShoutsMore}
              pageSize={SHOUTS_PER_PAGE}
              hidden={loadMoreHidden()}
            >
              <AuthorView
                author={author() as Author}
                authorSlug={props.params.slug}
                shouts={authorShouts() || []}
              />
            </LoadMoreWrapper>
          </ReactionsProvider>
        </PageLayout>
      </Suspense>
    </ErrorBoundary>
  )
}
