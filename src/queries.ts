// src/queries.ts
import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost($userId: uuid!, $content: String!, $image_url: String) {
    insert_posts(objects: { user_id: $userId, content: $content, image_url: $image_url }) {
      returning {
        id
        content
        created_at
      }
    }
  }
`;

export const GET_FOLLOWED_POSTS = gql`
  query GetFollowedPosts($followerId: uuid!) {
    followsCollection(where: { follower_id: { _eq: $followerId } }) {
      edges {
        node {
          followed_id
        }
      }
    }
    postsCollection(
      where: { user_id: { _in: followsCollection(where: { follower_id: { _eq: $followerId } }) { followed_id } } }
      order_by: { created_at: desc }
    ) {
      edges {
        node {
          id
          content
          created_at
          image_url
          user {
            id
            username
          }
        }
      }
    }
  }
`;
export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: uuid!, $followingId: uuid!) {
    insert_follows(objects: { follower_id: $followerId, followed_id: $followingId }) {
      returning {
        id
        follower_id
        followed_id
      }
    }
  }
`;

// Mutation to unfollow a user
export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: uuid!, $followingId: uuid!) {
    delete_follows(where: { follower_id: { _eq: $followerId }, followed_id: { _eq: $followingId } }) {
      affected_rows
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($followerId: uuid!) {
    usersCollection {
      edges {
        node {
          id
          username
          email
          isFollowing: followsCollection(
            where: { follower_id: { _eq: $followerId }, followed_id: { _eq: id } }
          ) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

