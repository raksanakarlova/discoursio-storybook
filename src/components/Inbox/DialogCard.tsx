import styles from './DialogCard.module.scss'
import DialogAvatar from './DialogAvatar'
import type { Author } from '../../graphql/types.gen'
import { apiClient } from '../../utils/apiClient'
import { t } from '../../utils/intl'
import { useInbox } from '../../context/inbox'

type DialogProps = {
  online?: boolean
  message?: string
  counter?: number
  author?: Author
  ownSlug: Author['slug']
}

const DialogCard = (props: DialogProps) => {
  return (
    //DialogCardView - подумать
    <div class={styles.DialogCard}>
      <div class={styles.avatar}>
        <DialogAvatar name={props.author.name} url={props.author.userpic} online={props.online} />
      </div>
      <div class={styles.row}>
        <div class={styles.name}>{props.author.name}</div>
        <div class={styles.message}>
          Указать предпочтительные языки для результатов поиска можно в разделе
        </div>
      </div>
      <div class={styles.activity}>
        <div class={styles.time}>22:22</div>
        <div class={styles.counter}>
          <span>12</span>
        </div>
      </div>
    </div>
  )
}

export default DialogCard
