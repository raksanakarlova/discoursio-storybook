import { createSignal, onCleanup, onMount, Show } from 'solid-js'

import { HomeView, PRERENDERED_ARTICLES_COUNT, RANDOM_TOPICS_COUNT } from '../components/Views/Home'
import { PageLayout } from '../components/_shared/PageLayout'
import type { PageProps } from './types'
import { loadShouts, resetSortedArticles } from '../stores/zine/articles'
import { loadRandomTopics } from '../stores/zine/topics'
import { Loading } from '../components/_shared/Loading'
import { useLocalize } from '../context/localize'
import { ReactionsProvider } from '../context/reactions'

export const HomePage = (props: PageProps) => {
  const [isLoaded, setIsLoaded] = createSignal(Boolean(props.homeShouts))
  const { t } = useLocalize()

  onMount(async () => {
    if (isLoaded()) {
      return
    }

    await Promise.all([
      loadShouts({ filters: { visibility: 'public' }, limit: PRERENDERED_ARTICLES_COUNT }),
      loadRandomTopics({ amount: RANDOM_TOPICS_COUNT })
    ])

    setIsLoaded(true)
  })

  onCleanup(() => resetSortedArticles())

  return (
    <PageLayout withPadding={true} title={t('Discours')}>
      <ReactionsProvider>
        <Show when={isLoaded()} fallback={<Loading />}>
          <HomeView shouts={props.homeShouts || []} />
        </Show>
      </ReactionsProvider>
    </PageLayout>
  )
}

export const Page = HomePage
