import { gql } from '@urql/core'

export default gql`
  query MyFeedQuery($options: LoadShoutsOptions) {
    load_shouts_feed(options: $options) {
      id
      title
      subtitle
      slug
      layout
      cover
      # community
      # mainTopic
      topics {
        id
        title
        body
        slug
      }
      authors {
        id
        name
        slug
        pic
        created_at
      }
      created_at
      published_at
      stat {
        viewed
        reacted
        rating
      }
    }
  }
`