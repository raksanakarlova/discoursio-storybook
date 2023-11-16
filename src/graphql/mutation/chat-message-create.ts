import { gql } from '@urql/core'

export default gql`
  mutation createMessage($chat: String!, $body: String!, $reply_to: Int) {
    createMessage(chat: $chat, body: $body, reply_to: $reply_to) {
      error
      message {
        id
        body
        author
        created_at
        reply_to
        updated_at
      }
    }
  }
`
