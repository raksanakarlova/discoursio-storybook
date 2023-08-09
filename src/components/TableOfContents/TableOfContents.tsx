import { onMount, For, Show, createSignal } from 'solid-js'
import { clsx } from 'clsx'

import { DEFAULT_HEADER_OFFSET } from '../../stores/router'

import { useLocalize } from '../../context/localize'

import { Icon } from '../_shared/Icon'

import styles from './TableOfContents.module.scss'

interface Props {
  variant: 'article' | 'editor'
  parentSelector: string
}

const scrollToHeader = (element) => {
  window.scrollTo({
    behavior: 'smooth',
    top:
      element.getBoundingClientRect().top -
      document.body.getBoundingClientRect().top -
      DEFAULT_HEADER_OFFSET
  })
}

export const TableOfContents = (props: Props) => {
  const { t } = useLocalize()

  const [headings, setHeadings] = createSignal<Element[]>([])
  const [areHeadingsLoaded, setAreHeadingsLoaded] = createSignal<boolean>(false)

  const [isVisible, setIsVisible] = createSignal<boolean>(true)
  const toggleIsVisible = () => {
    setIsVisible((visible) => !visible)
  }

  onMount(() => {
    const { parentSelector } = props
    // eslint-disable-next-line unicorn/prefer-spread
    setHeadings(Array.from(document.querySelector(parentSelector).querySelectorAll('h2, h3, h4')))

    setAreHeadingsLoaded(true)
  })

  return (
    <Show when={areHeadingsLoaded()}>
      <div
        class={clsx(styles.TableOfContentsFixedWrapper, {
          [styles.TableOfContentsFixedWrapperLefted]: props.variant === 'editor'
        })}
      >
        <div class={styles.TableOfContentsContainer}>
          <Show when={isVisible()}>
            <div class={styles.TableOfContentsHeader}>
              <p class={styles.TableOfContentsHeading}>{t('contents')}</p>
            </div>
            <ul class={styles.TableOfContentsHeadingsList}>
              <For each={headings()}>
                {(h) => (
                  <li>
                    <button
                      class={clsx(styles.TableOfContentsHeadingsItem, {
                        [styles.TableOfContentsHeadingsItemH3]: h.nodeName === 'H3',
                        [styles.TableOfContentsHeadingsItemH4]: h.nodeName === 'H4'
                      })}
                      innerHTML={h.textContent}
                      onClick={(e) => {
                        e.preventDefault()

                        scrollToHeader(h)
                      }}
                    />
                  </li>
                )}
              </For>
            </ul>
          </Show>

          <button
            class={clsx(styles.TableOfContentsPrimaryButton, {
              [styles.TableOfContentsPrimaryButtonLefted]: props.variant === 'editor' && !isVisible()
            })}
            onClick={(e) => {
              e.preventDefault()

              toggleIsVisible()
            }}
          >
            <Show when={isVisible()} fallback={<Icon name="show-table-of-contents" class={'icon'} />}>
              <Icon
                name="hide-table-of-contents"
                class={clsx('icon', {
                  [styles.TableOfContentsIconRotated]: props.variant === 'editor'
                })}
              />
            </Show>
          </button>
        </div>
      </div>
    </Show>
  )
}