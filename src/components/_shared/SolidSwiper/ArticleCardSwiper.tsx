import { createSignal, For, Show } from 'solid-js'
import { Icon } from '../Icon'
import { register } from 'swiper/element/bundle'
import SwiperCore, { Manipulation, Navigation, Pagination } from 'swiper'
import { SwiperRef } from './swiper'
import { clsx } from 'clsx'
import styles from './Swiper.module.scss'
import { Shout } from '../../../graphql/types.gen'
import { ArticleCard } from '../../Feed/ArticleCard'

type Props = {
  slides: Shout[]
  title?: string
}

register()

SwiperCore.use([Pagination, Navigation, Manipulation])

export const ArticleCardSwiper = (props: Props) => {
  const [slideIndex, setSlideIndex] = createSignal(0)

  const mainSwipeRef: { current: SwiperRef } = { current: null }

  const handleSlideChange = () => {
    setSlideIndex(mainSwipeRef.current.swiper.activeIndex)
  }

  return (
    <div class={clsx(styles.Swiper, styles.articleMode, styles.ArticleCardSwiper)}>
      <Show when={props.title}>
        <h2 class={styles.sliderTitle}>{props.title}</h2>
      </Show>
      <div class={styles.container}>
        <Show when={props.slides.length > 0}>
          <div class={styles.holder}>
            <swiper-container
              ref={(el) => (mainSwipeRef.current = el)}
              centered-slides={true}
              observer={true}
              onSlideChange={handleSlideChange}
              space-between={20}
              breakpoints={{
                576: { spaceBetween: 20, slidesPerView: 1.5 },
                992: { spaceBetween: 52, slidesPerView: 1.5 }
              }}
              round-lengths={true}
              loop={true}
              speed={800}
              /*
              autoplay={{
                disableOnInteraction: false,
                delay: 6000,
                pauseOnMouseEnter: true
              }}
*/
            >
              <For each={props.slides}>
                {(slide, index) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <swiper-slide virtual-index={index()}>
                    <ArticleCard
                      article={slide}
                      settings={{
                        additionalClass: 'swiper-slide',
                        isFloorImportant: true,
                        isWithCover: true,
                        nodate: true
                      }}
                    />
                  </swiper-slide>
                )}
              </For>
            </swiper-container>
            <div
              class={clsx(styles.navigation, styles.prev)}
              onClick={() => mainSwipeRef.current.swiper.slidePrev()}
            >
              <Icon name="swiper-l-arr" class={styles.icon} />
            </div>
            <div
              class={clsx(styles.navigation, styles.next)}
              onClick={() => mainSwipeRef.current.swiper.slideNext()}
            >
              <Icon name="swiper-r-arr" class={styles.icon} />
            </div>
          </div>
        </Show>
      </div>
    </div>
  )
}