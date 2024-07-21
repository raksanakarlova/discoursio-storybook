import { For, Show, createMemo } from 'solid-js'

import { useLocalize } from '~/context/localize'

import { Author, Topic } from '~/graphql/schema/core.gen'
import { Userpic } from '../../Author/Userpic'

import styles from './FollowingCounters.module.scss'

type Props = {
  followers?: Author[]
  followersAmount?: number
  following?: Array<Author | Topic>
  followingAmount?: number
  authors?: Author[]
  authorsAmount?: number
  topics?: Topic[]
  topicsAmount?: number
}

const UserpicList = (props: { items: Array<Author | Topic> }) => (
  <div class={styles.subscribersList}>
    <For each={props.items.slice(0, 3)}>
      {(item) => (
        <Userpic
          size="XS"
          name={'name' in item ? item.name || '' : 'title' in item ? item.title || '' : ''}
          userpic={item.pic || ''}
          class={styles.subscribersItem}
        />
      )}
    </For>
  </div>
)

const Counter = (props: { count: number; label: string }) => (
  <div class={styles.subscribersCounter}>{props.label}</div>
)

export const FollowingCounters = (props: Props) => {
  const { t } = useLocalize()

  const getFollowersCount = createMemo(() => props.followersAmount || props.followers?.length || 0)
  const getFollowingCount = createMemo(() => props.followingAmount || props.following?.length || 0)
  const getAuthorsCount = createMemo(() => props.authorsAmount || props.authors?.length || 0)
  const getTopicsCount = createMemo(() => props.topicsAmount || props.topics?.length || 0)

  return (
    <>
      <a href="?m=followers" class={styles.subscribers}>
        <Show when={getFollowersCount() > 0}>
          <UserpicList items={props.followers || []} />
        </Show>
        <Counter count={getFollowersCount()} label={t('some followers', { count: getFollowersCount() })} />
      </a>

      <a href="?m=following" class={styles.subscribers}>
        <Show when={getFollowingCount() > 0}>
          <UserpicList items={props.following || []} />
        </Show>
        <Show
          when={getFollowingCount() > 0}
          fallback={
            <>
              <Show when={getAuthorsCount() > 0}>
                <UserpicList items={props.authors || []} />
                <Counter
                  count={getAuthorsCount()}
                  label={t('some authors', { count: getAuthorsCount() })}
                />
              </Show>
              <Show when={getTopicsCount() > 0}>
                <Counter count={getTopicsCount()} label={t('some topics', { count: getTopicsCount() })} />
              </Show>
            </>
          }
        >
          <Counter
            count={getFollowingCount()}
            label={t('some followings', { count: getFollowingCount() })}
          />
        </Show>
      </a>
    </>
  )
}
