import type { Reaction } from '../../../graphql/types.gen'

import { clsx } from 'clsx'
import { Show } from 'solid-js'

import { useLocalize } from '../../../context/localize'
import { Icon } from '../../_shared/Icon'

import styles from './CommentDate.module.scss'

type Props = {
  comment: Reaction
  isShort?: boolean
  isLastInRow?: boolean
  showOnHover?: boolean
}

export const CommentDate = (props: Props) => {
  const { t, formatDate } = useLocalize()

  const formattedDate = (date: number) => {
    const formatDateOptions: Intl.DateTimeFormatOptions = props.isShort
      ? { month: 'long', day: 'numeric', year: 'numeric' }
      : { hour: 'numeric', minute: 'numeric' }

    return formatDate(new Date(date), formatDateOptions)
  }

  return (
    <div
      class={clsx(styles.commentDates, {
        [styles.commentDatesLastInRow]: props.isLastInRow,
        [styles.showOnHover]: props.showOnHover,
      })}
    >
      <time class={styles.date}>{formattedDate(props.comment.createdAt)}</time>
      <Show when={props.comment.updatedAt}>
        <time class={styles.date}>
          <Icon name="edit" class={styles.icon} />
          <span class={styles.text}>
            {t('Edited')} {formattedDate(props.comment.updatedAt)}
          </span>
        </time>
      </Show>
    </div>
  )
}
