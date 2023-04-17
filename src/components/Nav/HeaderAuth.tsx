import styles from './Header.module.scss'
import { clsx } from 'clsx'
import { router, useRouter } from '../../stores/router'

import { Icon } from '../_shared/Icon'
import { createSignal, Show } from 'solid-js'
import Notifications from './Notifications'
import { ProfilePopup } from './ProfilePopup'
import Userpic from '../Author/Userpic'
import type { Author } from '../../graphql/types.gen'
import { showModal, useWarningsStore } from '../../stores/ui'
import { ShowOnlyOnClient } from '../_shared/ShowOnlyOnClient'
import { useSession } from '../../context/session'
import { useLocalize } from '../../context/localize'
import { getPagePath } from '@nanostores/router'
import { Button } from '../_shared/Button'

type HeaderAuthProps = {
  setIsProfilePopupVisible: (value: boolean) => void
}

export const HeaderAuth = (props: HeaderAuthProps) => {
  const { t } = useLocalize()
  const { page } = useRouter()
  const [visibleWarnings, setVisibleWarnings] = createSignal(false)
  const { warnings } = useWarningsStore()

  const { session, isSessionLoaded, isAuthenticated } = useSession()

  const toggleWarnings = () => setVisibleWarnings(!visibleWarnings())

  const handleBellIconClick = (event: Event) => {
    event.preventDefault()

    if (!isAuthenticated()) {
      showModal('auth')
      return
    }

    toggleWarnings()
  }

  return (
    <ShowOnlyOnClient>
      <Show when={isSessionLoaded()} keyed={true}>
        <div class={clsx(styles.usernav, 'col')}>
          <div class={clsx(styles.userControl, styles.userControl, 'col')}>
            <Show when={page().route !== 'edit'}>
              <div class={clsx(styles.userControlItem, styles.userControlItemVerbose)}>
                <a href={getPagePath(router, 'create')}>
                  <span class={styles.textLabel}>{t('Create post')}</span>
                  <Icon name="pencil" class={styles.icon} />
                </a>
              </div>
            </Show>

            <Show when={isAuthenticated() && page().route !== 'create'}>
              <div class={styles.userControlItem}>
                <a href="#" onClick={handleBellIconClick}>
                  <div>
                    <Icon name="bell-white" counter={isAuthenticated() ? warnings().length : 1} />
                  </div>
                </a>
              </div>
            </Show>

            <Show when={isAuthenticated() && page().route === 'create'}>
              <div class={clsx(styles.userControlItem, styles.userControlItemVerbose)}>
                <Button
                  value={
                    <>
                      <span class={styles.textLabel}>{t('Save')}</span>
                      <Icon name="save" class={styles.icon} />
                    </>
                  }
                  variant={'outline'}
                />
              </div>

              <div class={clsx(styles.userControlItem, styles.userControlItemVerbose)}>
                <Button
                  value={
                    <>
                      <span class={styles.textLabel}>{t('Publish')}</span>
                      <Icon name="publish" class={styles.icon} />
                    </>
                  }
                  variant={'outline'}
                />
              </div>

              <div class={clsx(styles.userControlItem, styles.userControlItemVerbose)}>
                <Button value={<Icon name="burger" />} variant={'outline'} onClick={() => {}} />
              </div>
            </Show>

            <Show when={visibleWarnings()}>
              <div class={clsx(styles.userControlItem, 'notifications')}>
                <Notifications />
              </div>
            </Show>

            <Show
              when={isAuthenticated() && page().route !== 'create'}
              fallback={
                <div class={clsx(styles.userControlItem, styles.userControlItemVerbose, 'loginbtn')}>
                  <a href="?modal=auth&mode=login">
                    <span class={styles.textLabel}>{t('Enter')}</span>
                    <Icon name="user-default" class={styles.icon} />
                  </a>
                </div>
              }
            >
              <div class={clsx(styles.userControlItem, styles.userControlItemInbox)}>
                <a href="/inbox">
                  {/*FIXME: replace with route*/}
                  <div classList={{ entered: page().path === '/inbox' }}>
                    <Icon name="inbox-white" counter={session()?.news?.unread || 0} />
                  </div>
                </a>
              </div>
              <ProfilePopup
                onVisibilityChange={(isVisible) => {
                  props.setIsProfilePopupVisible(isVisible)
                }}
                containerCssClass={styles.control}
                trigger={
                  <div class={styles.userControlItem}>
                    <button class={styles.button}>
                      <div classList={{ entered: page().path === `/${session().user?.slug}` }}>
                        <Userpic user={session().user as Author} class={styles.userpic} />
                      </div>
                    </button>
                  </div>
                }
              />
            </Show>
          </div>
        </div>
      </Show>
    </ShowOnlyOnClient>
  )
}
