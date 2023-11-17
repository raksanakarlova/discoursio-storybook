import type { PageProps } from './types'
import type { PageContext } from '../renderer/types'

import { apiClient } from '../utils/apiClient'

export const onBeforeRender = async (pageContext: PageContext) => {
  const { slug } = pageContext.routeParams

  const topic = await apiClient.getTopic({ slug })

  const pageProps: PageProps = { topic, seo: { title: topic.title } }

  return {
    pageContext: {
      pageProps,
    },
  }
}
