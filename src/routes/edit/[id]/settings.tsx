import { RouteSectionProps } from '@solidjs/router'
import { createEffect, createMemo, createSignal, on } from 'solid-js'
import { AuthGuard } from '~/components/AuthGuard'
import EditSettingsView from '~/components/Views/EditView/EditSettingsView'
import { PageLayout } from '~/components/_shared/PageLayout'
import { coreApiUrl } from '~/config'
import { useLocalize } from '~/context/localize'
import { useSession } from '~/context/session'
import { graphqlClientCreate } from '~/graphql/client'
import getShoutDraft from '~/graphql/query/core/article-my'
import { Shout } from '~/graphql/schema/core.gen'

export default (props: RouteSectionProps) => {
  const { t } = useLocalize()
  const { session } = useSession()
  const client = createMemo(() => graphqlClientCreate(coreApiUrl, session()?.access_token))
  createEffect(on(session, (s) => s?.access_token && loadDraft(), { defer: true }))
  const [shout, setShout] = createSignal<Shout>()
  const loadDraft = async () => {
    const shout_id = Number.parseInt(props.params.id)
    const result = await client()?.query(getShoutDraft, { shout_id }).toPromise()
    if (result) {
      const { shout: loadedShout, error } = result.data.get_my_shout
      if (error) throw new Error(error)
      setShout(loadedShout)
    }
  }
  return (
    <PageLayout title={`${t('Discours')} :: ${t('Publication settings')}`}>
      <AuthGuard>
        <EditSettingsView shout={shout() as Shout} />
      </AuthGuard>
    </PageLayout>
  )
}
