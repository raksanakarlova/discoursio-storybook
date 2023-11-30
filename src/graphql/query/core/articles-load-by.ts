import { gql } from '@urql/core'

export default gql`
  query LoadShoutsQuery($options: LoadShoutsOptions) {
    load_shouts_by(options: $options) {
      id
      title
      lead
      description
      subtitle
      slug
      layout
      cover
      lead
      created_by {
        id
        name
        slug
        pic
        created_at
      }
      topics {
        id
        title
        body
        slug
        stat {
          shouts
          authors
          followers
        }
      }
      authors {
        id
        name
        slug
        pic
        created_at
        bio
      }
      created_at
      published_at
      stat {
        viewed
        reacted
        rating
        commented
      }
    }
  }
`
