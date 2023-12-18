import type { ConfirmEmailSearchParams } from './types'

import { clsx } from 'clsx'
import { createEffect, createSignal, onMount, Show } from 'solid-js'

import { useLocalize } from '../../../context/localize'
import { useSession } from '../../../context/session'
import { ApiError } from '../../../graphql/error'
import { useRouter } from '../../../stores/router'
import { hideModal } from '../../../stores/ui'

import styles from './AuthModal.module.scss'

export const EmailConfirm = () => {
  const { t } = useLocalize()
  const {
    actions: { confirmEmail, loadSession, loadAuthor },
    session,
  } = useSession()
  const [confirmedEmail, setConfirmedEmail] = createSignal<boolean>(
    Boolean(session()?.user?.email_verified),
  )

  const [isTokenExpired, setIsTokenExpired] = createSignal(false)
  const [isTokenInvalid, setIsTokenInvalid] = createSignal(false)
  const { searchParams, changeSearchParam } = useRouter<ConfirmEmailSearchParams>()

  onMount(async () => {
    const token = searchParams().access_token
    if (token) {
      try {
        await confirmEmail({ token })
        await loadSession()
        changeSearchParam({})
        await loadAuthor()
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.code === 'token_expired') {
            setIsTokenExpired(true)
            return
          }

          if (error.code === 'token_invalid') {
            setIsTokenInvalid(true)
            return
          }
        }

        console.log(error)
      }
    }
  })

  createEffect(() => setConfirmedEmail(session()?.user?.email_verified))

  return (
    <div>
      {/* TODO: texts */}
      <Show when={isTokenExpired()}>
        <div class={styles.title}>Ссылка больше не действительна</div>
        <div class={styles.text}>
          <a href="/?modal=auth&mode=login">
            {/*TODO: temp solution, should be send link again, but we don't have email here*/}
            Вход
          </a>
        </div>
      </Show>
      <Show when={isTokenInvalid()}>
        <div class={styles.title}>Неправильная ссылка</div>
        <div class={styles.text}>
          <a href="/?modal=auth&mode=login">
            {/*TODO: temp solution, should be send link again, but we don't have email here*/}
            Вход
          </a>
        </div>
      </Show>
      <Show when={Boolean(confirmedEmail())}>
        <div class={styles.title}>{t('Hooray! Welcome!')}</div>
        <div class={styles.text}>
          {t("You've confirmed email")} {confirmedEmail()}
        </div>
        <div>
          <button class={clsx('button', styles.submitButton)} onClick={() => hideModal()}>
            {t('Go to main page')}
          </button>
        </div>
      </Show>
    </div>
  )
}
