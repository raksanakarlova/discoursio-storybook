import type { JSX } from 'solid-js'
import { clsx } from 'clsx'
import styles from './Button.module.scss'

type Props = {
  value: string | JSX.Element
  size?: 'S' | 'M' | 'L'
  variant?: 'primary' | 'secondary' | 'inline'
  type?: 'submit' | 'button'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      type={props.type ?? 'button'}
      disabled={props.loading || props.disabled}
      class={clsx(styles.button, styles[props.size ?? 'M'], styles[props.variant ?? 'primary'], {
        [styles.loading]: props.loading
      })}
    >
      {props.value}
    </button>
  )
}

export default Button
