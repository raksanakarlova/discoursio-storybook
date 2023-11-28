import type {
  FollowingEntity,
  ShoutInput,
  Topic,
  Author,
  LoadShoutsOptions,
  ProfileInput,
  ReactionInput,
  ReactionBy,
  Shout,
  Result,
  QueryLoad_Authors_ByArgs,
} from '../schema/core.gen'

import createArticle from '../mutation/core/article-create'
import deleteShout from '../mutation/core/article-delete'
import updateArticle from '../mutation/core/article-update'
import followMutation from '../mutation/core/follow'
import reactionCreate from '../mutation/core/reaction-create'
import reactionDestroy from '../mutation/core/reaction-destroy'
import reactionUpdate from '../mutation/core/reaction-update'
import unfollowMutation from '../mutation/core/unfollow'
import updateProfile from '../mutation/core/update-profile'
import { getPrivateClient } from '../privateGraphQLClient'
import { getPublicClient } from '../publicGraphQLClient'
import shoutLoad from '../query/core/article-load'
import shoutsLoadBy from '../query/core/articles-load-by'
import draftsLoad from '../query/core/articles-load-drafts'
import myFeed from '../query/core/articles-load-feed'
import authorBy from '../query/core/author-by'
import authorFollowers from '../query/core/author-followers'
import authorsAll from '../query/core/authors-all'
import authorFollowed from '../query/core/authors-followed-by'
import authorsLoadBy from '../query/core/authors-load-by'
import mySubscriptions from '../query/core/my-followed'
import reactionsLoadBy from '../query/core/reactions-load-by'
import topicBySlug from '../query/core/topic-by-slug'
import topicsAll from '../query/core/topics-all'
import userFollowedTopics from '../query/core/topics-by-author'
import topicsRandomQuery from '../query/core/topics-random'

export const privateGraphQLClient = getPublicClient('core')
export const publicGraphQLClient = getPrivateClient('core')

export const apiClient = {
  getRandomTopics: async ({ amount }: { amount: number }) => {
    const response = await publicGraphQLClient.query(topicsRandomQuery, { amount }).toPromise()

    if (!response.data) {
      console.error('[graphql.client.core] getRandomTopics', response.error)
    }

    return response.data.get_topics_random
  },

  follow: async ({ what, slug }: { what: FollowingEntity; slug: string }) => {
    const response = await privateGraphQLClient.mutation(followMutation, { what, slug }).toPromise()
    return response.data.follow
  },
  unfollow: async ({ what, slug }: { what: FollowingEntity; slug: string }) => {
    const response = await privateGraphQLClient.mutation(unfollowMutation, { what, slug }).toPromise()
    return response.data.unfollow
  },

  getAllTopics: async () => {
    const response = await publicGraphQLClient.query(topicsAll, {}).toPromise()
    if (response.error) {
      console.debug('[graphql.client.core] get_topicss_all', response.error)
    }
    return response.data.get_topics_all
  },
  getAllAuthors: async () => {
    const response = await publicGraphQLClient.query(authorsAll, {}).toPromise()
    if (response.error) {
      console.debug('[graphql.client.core] get_authors_all', response.error)
    }
    return response.data.get_authors_all
  },
  getAuthor: async (params: { slug?: string; author_id?: number; user?: string }): Promise<Author> => {
    const response = await publicGraphQLClient.query(authorBy, params).toPromise()
    return response.data.get_author
  },
  getAuthorFollowers: async ({ slug }: { slug: string }): Promise<Author[]> => {
    const response = await publicGraphQLClient.query(authorFollowers, { slug }).toPromise()
    return response.data.get_author_followers
  },
  getAuthorFollowingUsers: async ({ slug }: { slug: string }): Promise<Author[]> => {
    const response = await publicGraphQLClient.query(authorFollowed, { slug }).toPromise()
    return response.data.get_author_followed
  },
  getAuthorFollowingTopics: async ({ slug }: { slug: string }): Promise<Topic[]> => {
    const response = await publicGraphQLClient.query(userFollowedTopics, { slug }).toPromise()
    return response.data.userFollowedTopics
  },
  updateProfile: async (input: ProfileInput) => {
    const response = await privateGraphQLClient.mutation(updateProfile, { profile: input }).toPromise()
    return response.data.update_profile
  },
  getTopic: async ({ slug }: { slug: string }): Promise<Topic> => {
    const response = await publicGraphQLClient.query(topicBySlug, { slug }).toPromise()
    return response.data.get_topic
  },
  createArticle: async ({ article }: { article: ShoutInput }): Promise<Shout> => {
    const response = await privateGraphQLClient.mutation(createArticle, { shout: article }).toPromise()
    return response.data.create_shout.shout
  },
  updateArticle: async ({
    shoutId,
    shoutInput,
    publish,
  }: {
    shoutId: number
    shoutInput?: ShoutInput
    publish: boolean
  }): Promise<Shout> => {
    const response = await privateGraphQLClient
      .mutation(updateArticle, { shoutId, shoutInput, publish })
      .toPromise()
    console.debug('[graphql.client.core] updateArticle:', response.data)
    return response.data.update_shout.shout
  },
  deleteShout: async ({ shoutId }: { shoutId: number }): Promise<void> => {
    const response = await privateGraphQLClient.mutation(deleteShout, { shout_id: shoutId }).toPromise()
    console.debug('[graphql.client.core] deleteShout:', response)
  },
  getDrafts: async (): Promise<Shout[]> => {
    const response = await privateGraphQLClient.query(draftsLoad, {}).toPromise()
    console.debug('[graphql.client.core] getDrafts:', response)
    return response.data.load_shouts_drafts
  },
  createReaction: async (input: ReactionInput) => {
    const response = await privateGraphQLClient.mutation(reactionCreate, { reaction: input }).toPromise()
    console.debug('[graphql.client.core] createReaction:', response)
    return response.data.create_reaction.reaction
  },
  destroyReaction: async (id: number) => {
    const response = await privateGraphQLClient.mutation(reactionDestroy, { id: id }).toPromise()
    console.debug('[graphql.client.core] destroyReaction:', response)
    return response.data.delete_reaction.reaction
  },
  updateReaction: async (id: number, input: ReactionInput) => {
    const response = await privateGraphQLClient
      .mutation(reactionUpdate, { id: id, reaction: input })
      .toPromise()
    console.debug('[graphql.client.core] updateReaction:', response)
    return response.data.update_reaction.reaction
  },
  getAuthorsBy: async (options: QueryLoad_Authors_ByArgs) => {
    const resp = await publicGraphQLClient.query(authorsLoadBy, options).toPromise()
    return resp.data.load_authors_by
  },
  getShoutBySlug: async (slug: string) => {
    const resp = await publicGraphQLClient
      .query(shoutLoad, {
        slug,
      })
      .toPromise()

    // if (resp.error) {
    //   console.error(resp)
    // }

    return resp.data.get_shout
  },
  getShoutById: async (shout_id: number) => {
    const resp = await publicGraphQLClient
      .query(shoutLoad, {
        shout_id,
      })
      .toPromise()

    if (resp.error) {
      console.error(resp)
    }

    return resp.data.get_shout
  },

  getShouts: async (options: LoadShoutsOptions) => {
    const resp = await publicGraphQLClient.query(shoutsLoadBy, { options }).toPromise()
    if (resp.error) {
      console.error(resp)
    }

    return resp.data.load_shouts_by
  },

  getMyFeed: async (options: LoadShoutsOptions) => {
    const resp = await privateGraphQLClient.query(myFeed, { options }).toPromise()

    if (resp.error) {
      console.error(resp)
    }

    return resp.data.load_shouts_feed
  },

  getReactionsBy: async ({ by, limit }: { by: ReactionBy; limit?: number }) => {
    const resp = await publicGraphQLClient
      .query(reactionsLoadBy, { by, limit: limit ?? 1000, offset: 0 })
      .toPromise()
    return resp.data.load_reactions_by
  },
  getMySubscriptions: async (): Promise<Result> => {
    const resp = await privateGraphQLClient.query(mySubscriptions, {}).toPromise()
    // console.debug(resp.data)
    return resp.data.get_my_followed
  },
}