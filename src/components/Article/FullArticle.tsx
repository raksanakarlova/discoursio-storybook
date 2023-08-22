import { createEffect, For, createMemo, onMount, Show, createSignal, onCleanup } from 'solid-js'
import { Title } from '@solidjs/meta'
import { clsx } from 'clsx'
import { getPagePath } from '@nanostores/router'

import MD from './MD'

import type { Author, Shout } from '../../graphql/types.gen'
import { useSession } from '../../context/session'
import { useLocalize } from '../../context/localize'
import { useReactions } from '../../context/reactions'

import { MediaItem } from '../../pages/types'

import { router, useRouter } from '../../stores/router'

import { formatDate } from '../../utils'
import { getDescription } from '../../utils/meta'
import { imageProxy } from '../../utils/imageProxy'
import { isDesktop } from '../../utils/media-query'
import { AuthorCard } from '../Author/AuthorCard'
import { TableOfContents } from '../TableOfContents'
import { AudioPlayer } from './AudioPlayer'
import { SharePopup } from './SharePopup'
import { ShoutRatingControl } from './ShoutRatingControl'
import { CommentsTree } from './CommentsTree'
import stylesHeader from '../Nav/Header.module.scss'
import { AudioHeader } from './AudioHeader'

import { Popover } from '../_shared/Popover'
import { VideoPlayer } from '../_shared/VideoPlayer'
import { Icon } from '../_shared/Icon'
import { SolidSwiper } from '../_shared/SolidSwiper'
import styles from './Article.module.scss'
import { CardTopic } from '../Feed/CardTopic'
import { createPopper } from '@popperjs/core'

interface Props {
  article: Shout
  scrollToComments?: boolean
}

export const FullArticle = (props: Props) => {
  const { t } = useLocalize()
  const {
    user,
    isAuthenticated,
    actions: { requireAuthentication }
  } = useSession()
  const [isReactionsLoaded, setIsReactionsLoaded] = createSignal(false)

  const formattedDate = createMemo(() => formatDate(new Date(props.article.createdAt)))

  const mainTopic = createMemo(
    () =>
      props.article.topics?.find((topic) => topic?.slug === props.article.mainTopic) ||
      props.article.topics[0]
  )

  const canEdit = () => props.article.authors?.some((a) => a.slug === user()?.slug)

  const handleBookmarkButtonClick = (ev) => {
    requireAuthentication(() => {
      // TODO: implement bookmark clicked
      ev.preventDefault()
    }, 'bookmark')
  }

  const body = createMemo(() => {
    if (props.article.layout === 'literature') {
      try {
        const media = JSON.parse(props.article.media)
        if (media.length > 0) {
          return media[0].body
        }
      } catch (error) {
        console.error(error)
      }
    }
    return props.article.body
  })
  const media = createMemo(() => {
    return JSON.parse(props.article.media || '[]')
  })

  const commentsRef: { current: HTMLDivElement } = { current: null }
  const scrollToComments = () => {
    window.scrollTo({
      top: commentsRef.current.offsetTop - 96,
      left: 0,
      behavior: 'smooth'
    })
  }

  const { searchParams, changeSearchParam } = useRouter()

  createEffect(() => {
    if (props.scrollToComments) {
      scrollToComments()
    }
  })

  createEffect(() => {
    if (searchParams()?.scrollTo === 'comments' && commentsRef.current) {
      scrollToComments()
      changeSearchParam('scrollTo', null)
    }
  })

  createEffect(() => {
    if (searchParams().commentId && isReactionsLoaded()) {
      const commentElement = document.querySelector(`[id='comment_${searchParams().commentId}']`)
      if (commentElement) {
        commentElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })

  const {
    actions: { loadReactionsBy }
  } = useReactions()

  onMount(async () => {
    await loadReactionsBy({
      by: { shout: props.article.slug }
    })

    setIsReactionsLoaded(true)
  })

  const clickHandlers = []
  const documentClickHandlers = []

  onMount(() => {
    const tooltipElements: NodeListOf<HTMLLinkElement> =
      document.querySelectorAll('[data-toggle="tooltip"]')
    if (!tooltipElements) return

    tooltipElements.forEach((element) => {
      const tooltip = document.createElement('div')
      tooltip.classList.add(styles.tooltip)
      tooltip.textContent = element.dataset.originalTitle
      document.body.appendChild(tooltip)
      element.setAttribute('href', 'javascript: void(0);')
      createPopper(element, tooltip, {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })

      tooltip.style.visibility = 'hidden'
      let isTooltipVisible = false

      const handleClick = () => {
        if (isTooltipVisible) {
          tooltip.style.visibility = 'hidden'
          isTooltipVisible = false
        } else {
          tooltip.style.visibility = 'visible'
          isTooltipVisible = true
        }
      }

      const handleDocumentClick = (e) => {
        if (isTooltipVisible && e.target !== element && e.target !== tooltip) {
          tooltip.style.visibility = 'hidden'
          isTooltipVisible = false
        }
      }

      element.addEventListener('click', handleClick)
      document.addEventListener('click', handleDocumentClick)

      clickHandlers.push({ element, handler: handleClick })
      documentClickHandlers.push(handleDocumentClick)
    })
  })

  onCleanup(() => {
    clickHandlers.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler)
    })
    documentClickHandlers.forEach((handler) => {
      document.removeEventListener('click', handler)
    })
  })

  return (
    <>
      <Title>{props.article.title}</Title>
      <div class="wide-container">
        <div class="row position-relative">
          <article class="col-md-16 col-lg-14 col-xl-12 offset-md-5">
            {/*TODO: Check styles.shoutTopic*/}
            <Show when={props.article.layout !== 'audio'}>
              <div class={styles.shoutHeader}>
                <Show when={mainTopic()}>
                  <CardTopic title={mainTopic().title} slug={props.article.mainTopic} />
                </Show>

                <h1>{props.article.title}</h1>
                <Show when={props.article.subtitle}>
                  <h4>{props.article.subtitle}</h4>
                </Show>

                <div class={styles.shoutAuthor}>
                  <For each={props.article.authors}>
                    {(a: Author, index) => (
                      <>
                        <Show when={index() > 0}>, </Show>
                        <a href={getPagePath(router, 'author', { slug: a.slug })}>{a.name}</a>
                      </>
                    )}
                  </For>
                </div>
                <Show
                  when={
                    props.article.cover &&
                    props.article.layout !== 'video' &&
                    props.article.layout !== 'image'
                  }
                >
                  <div
                    class={styles.shoutCover}
                    style={{ 'background-image': `url('${imageProxy(props.article.cover)}')` }}
                  />
                </Show>
              </div>
            </Show>
            <Show when={props.article.lead}>
              <section class={styles.lead} innerHTML={props.article.lead} />
            </Show>
            <Show when={props.article.layout === 'audio'}>
              <AudioHeader
                title={props.article.title}
                cover={props.article.cover}
                artistData={media()?.[0]}
                topic={mainTopic()}
              />
              <Show when={media().length > 0}>
                <div class="media-items">
                  <AudioPlayer media={media()} articleSlug={props.article.slug} body={body()} />
                </div>
              </Show>
            </Show>
            <Show when={media() && props.article.layout === 'video'}>
              <div class="media-items">
                <For each={media() || []}>
                  {(m: MediaItem) => (
                    <div class={styles.shoutMediaBody}>
                      <VideoPlayer
                        articleView={true}
                        videoUrl={m.url}
                        title={m.title}
                        description={m.body}
                      />
                      <Show when={m?.body}>
                        <MD body={m.body} />
                      </Show>
                    </div>
                  )}
                </For>
              </div>
            </Show>

            <Show when={body()}>
              <div id="shoutBody" class={styles.shoutBody}>
                <Show when={!body().startsWith('<')} fallback={<div innerHTML={body()} />}>
                  <MD body={body()} />
                </Show>
              </div>
            </Show>
          </article>
          <Show when={isDesktop() && body()}>
            <TableOfContents variant="article" parentSelector="#shoutBody" body={body()} />
          </Show>
        </div>
      </div>

      <Show when={props.article.layout === 'image'}>
        <div class="floor floor--important">
          <div class="wide-container">
            <div class="row">
              <div class="col-md-20 offset-md-2">
                <SolidSwiper images={media()} />
              </div>
            </div>
          </div>
        </div>
      </Show>

      <div class="wide-container">
        <div class="row">
          <div class="col-md-16 offset-md-5">
            <div class={styles.shoutStats}>
              <div class={styles.shoutStatsItem}>
                <ShoutRatingControl shout={props.article} class={styles.ratingControl} />
              </div>

              <Popover content={t('Comment')}>
                {(triggerRef: (el) => void) => (
                  <div class={styles.shoutStatsItem} ref={triggerRef} onClick={scrollToComments}>
                    <Icon name="comment" class={styles.icon} />
                    <Icon name="comment-hover" class={clsx(styles.icon, styles.iconHover)} />
                    {props.article.stat?.commented ?? ''}
                  </div>
                )}
              </Popover>

              <Show when={props.article.stat?.viewed}>
                <div class={clsx(styles.shoutStatsItem, styles.shoutStatsItemViews)}>
                  <Icon name="eye" class={styles.icon} />
                  <Icon name="eye" class={clsx(styles.icon, styles.iconHover)} />
                  {props.article.stat?.viewed}
                </div>
              </Show>

              <Popover content={t('Share')}>
                {(triggerRef: (el) => void) => (
                  <div class={styles.shoutStatsItem} ref={triggerRef}>
                    <SharePopup
                      title={props.article.title}
                      description={getDescription(props.article.body)}
                      imageUrl={props.article.cover}
                      containerCssClass={stylesHeader.control}
                      trigger={
                        <div class={styles.shoutStatsItemInner}>
                          <Icon name="share-outline" class={styles.icon} />
                          <Icon name="share-outline-hover" class={clsx(styles.icon, styles.iconHover)} />
                        </div>
                      }
                    />
                  </div>
                )}
              </Popover>
              <Popover content={t('Add to bookmarks')}>
                {(triggerRef: (el) => void) => (
                  <div class={styles.shoutStatsItem} ref={triggerRef} onClick={handleBookmarkButtonClick}>
                    <div class={styles.shoutStatsItemInner}>
                      <Icon name="bookmark" class={styles.icon} />
                      <Icon name="bookmark-hover" class={clsx(styles.icon, styles.iconHover)} />
                    </div>
                  </div>
                )}
              </Popover>
              <Show when={canEdit()}>
                <Popover content={t('Edit')}>
                  {(triggerRef: (el) => void) => (
                    <div class={styles.shoutStatsItem} ref={triggerRef}>
                      <a
                        href={getPagePath(router, 'edit', { shoutId: props.article.id.toString() })}
                        class={styles.shoutStatsItemInner}
                      >
                        <Icon name="pencil-outline" class={styles.icon} />
                        <Icon name="pencil-outline-hover" class={clsx(styles.icon, styles.iconHover)} />
                      </a>
                    </div>
                  )}
                </Popover>
              </Show>
              <div class={clsx(styles.shoutStatsItem, styles.shoutStatsItemAdditionalData)}>
                <div class={clsx(styles.shoutStatsItem, styles.shoutStatsItemAdditionalDataItem)}>
                  {formattedDate()}
                </div>
              </div>
            </div>
            <div class={styles.help}>
              <Show when={isAuthenticated() && !canEdit()}>
                <button class="button">{t('Cooperate')}</button>
              </Show>
              <Show when={canEdit()}>
                <button class="button button--light">{t('Invite to collab')}</button>
              </Show>
            </div>

            <Show when={props.article.topics.length}>
              <div class={styles.topicsList}>
                <For each={props.article.topics}>
                  {(topic) => (
                    <div class={styles.shoutTopic}>
                      <a href={getPagePath(router, 'topic', { slug: topic.slug })}>{topic.title}</a>
                    </div>
                  )}
                </For>
              </div>
            </Show>

            <div class={styles.shoutAuthorsList}>
              <Show when={props.article.authors.length > 1}>
                <h4>{t('Authors')}</h4>
              </Show>
              <For each={props.article.authors}>
                {(a) => (
                  <div class="col-xl-12">
                    <AuthorCard author={a} hasLink={true} liteButtons={true} />
                  </div>
                )}
              </For>
            </div>
            <div id="comments" ref={(el) => (commentsRef.current = el)}>
              <Show when={isReactionsLoaded()}>
                <CommentsTree
                  shoutId={props.article.id}
                  shoutSlug={props.article.slug}
                  commentAuthors={props.article.authors}
                />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
