import { createMemo, createSignal, lazy, onMount, Show, Suspense } from 'solid-js'

import { Loading } from '../components/_shared/Loading'
import { PageLayout } from '../components/_shared/PageLayout'
import { AuthGuard } from '../components/AuthGuard'
import { useLocalize } from '../context/localize'
import { Shout } from '../graphql/types.gen'
import { useRouter } from '../stores/router'
import { apiClient } from '../utils/apiClient'

import { LayoutType } from './types'

const Edit = lazy(() => import('../components/Views/Edit'))

export const EditPage = () => {
  const { page } = useRouter()
  const { t } = useLocalize()

  const shoutId = createMemo(() => Number((page().params as Record<'shoutId', string>).shoutId))

  const [shout, setShout] = createSignal<Shout>(null)

  onMount(async () => {
    const loadedShout = await apiClient.getShoutById(shoutId())
    setShout(loadedShout)
  })

  const title = createMemo(() => {
    if (!shout()) {
      return t('Create post')
    }

    switch (shout().layout as LayoutType) {
      case 'music': {
        return t('Publish Album')
      }
      case 'image': {
        return t('Create gallery')
      }
      case 'video': {
        return t('Create video')
      }
      case 'literature': {
        return t('New literary work')
      }
      default: {
        return t('Write an article')
      }
    }
  })

  return (
    <PageLayout title={title()}>
      <AuthGuard>
        <Show when={shout()}>
          <Suspense fallback={<Loading />}>
            <Edit shout={shout()} />
          </Suspense>
        </Show>
      </AuthGuard>
    </PageLayout>
  )
}

export const Page = EditPage
