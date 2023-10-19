import { clsx } from 'clsx'
import { createMemo, createSignal, onMount, Show } from 'solid-js'
import { Author } from '../../../graphql/types.gen'
import { openPage } from '@nanostores/router'
import { router, useRouter } from '../../../stores/router'
import { SSEMessage, useNotifications } from '../../../context/notifications'
import { Userpic } from '../../Author/Userpic'
import { useLocalize } from '../../../context/localize'
import type { ArticlePageSearchParams } from '../../Article/FullArticle'
import { TimeAgo } from '../../_shared/TimeAgo'
import styles from './NotificationView.module.scss'

type Props = {
  notification: SSEMessage
  onClick: () => void
  dateTimeFormat: 'ago' | 'time' | 'date'
  class?: string
}

// NOTE: not a graphql generated type
export enum NotificationType {
  NewComment = 'NEW_COMMENT',
  NewReply = 'NEW_REPLY',
  NewFollower = 'NEW_FOLLOWER',
  NewShout = 'NEW_SHOUT',
  NewLike = 'NEW_LIKE',
  NewDislike = 'NEW_DISLIKE'
}

const TEMPLATES = {
  // FIXME: set proper templates
  'follower:join': 'new follower',
  'shout:create': 'new shout'
  /* 
  new_reaction0: 'new like',
  new_reaction1: 'new dislike',
  new_reaction2: 'new agreement',
  new_reaction3: 'new disagreement',
  new_reaction4: 'new proof',
  new_reaction5: 'new disproof',
  new_reaction6: 'new comment',
  new_reaction7: 'new quote',
  new_reaction8: 'new proposal',
  new_reaction9: 'new question',
  new_reaction10: 'new remark',
  //"new_reaction11": "new footnote",
  new_reaction12: 'new acception',
  new_reaction13: 'new rejection' 
  */
}

export const NotificationView = (props: Props) => {
  const {
    actions: { markNotificationAsRead }
  } = useNotifications()
  const [data, setData] = createSignal<SSEMessage>(null)
  const [kind, setKind] = createSignal<NotificationType>()
  const { changeSearchParam } = useRouter<ArticlePageSearchParams>()
  const { t, formatDate, formatTime } = useLocalize()

  onMount(() => {
    setTimeout(() => setData(props.notification))
  })
  const lastUser = createMemo(() => {
    return props.notification.entity === 'follower' ? data().payload : data().payload.author
  })
  const content = createMemo(() => {
    if (!data()) {
      return null
    }
    let caption: string, author: Author, ntype: NotificationType

    // TODO: count occurencies from in-browser notifications-db

    switch (props.notification.entity) {
      case 'follower': {
        caption = ''
        author = data().payload
        ntype = NotificationType.NewFollower
        break
      }
      case 'shout': {
        caption = data().payload.title
        author = data().payload.authors[-1]
        ntype = NotificationType.NewShout
        break
      }
      case 'reaction': {
        ntype = data().payload.replyTo ? NotificationType.NewReply : NotificationType.NewComment
        console.log(data().payload.kind)
        // TODO: handle all needed reaction kinds
      }
      default: {
        caption = data().payload.shout.title
        author = data().payload.author
      }
    }
    setKind(ntype) // FIXME: use it somewhere if needed or remove
    return t(TEMPLATES[`${props.notification.entity}:${props.notification.action}`], { caption, author })
  })

  const handleClick = () => {
    if (!props.notification.seen) {
      markNotificationAsRead(props.notification)
    }
    const subpath = props.notification.entity === 'follower' ? 'author' : 'article'
    const slug = props.notification.entity === 'reaction' ? data().payload.shout.slug : data().payload.slug
    openPage(router, subpath, { slug })
    props.onClick()
  }

  const formattedDateTime = createMemo(() => {
    switch (props.dateTimeFormat) {
      case 'ago': {
        return <TimeAgo date={props.notification.timestamp} />
      }
      case 'time': {
        return formatTime(new Date(props.notification.timestamp))
      }
      case 'date': {
        return formatDate(new Date(props.notification.timestamp), { month: 'numeric', year: '2-digit' })
      }
    }
  })

  return (
    <Show when={data()}>
      <div
        class={clsx(styles.NotificationView, props.class, {
          [styles.seen]: props.notification.seen
        })}
        onClick={handleClick}
      >
        <Userpic name={lastUser().name} userpic={lastUser().userpic} class={styles.userpic} />
        <div>{content()}</div>
        <div class={styles.timeContainer}>{formattedDateTime()}</div>
      </div>
    </Show>
  )
}
