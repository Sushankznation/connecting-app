import { gql } from 'graphql-tag';

// Query to get posts from users the logged-in user follows
export const GET_FEED = gql`
  query GetFeed($userId: UUID!) {
    posts(where: { user_id: { _eq: $userId } }) {
      id
      content
      image_url
      created_at
      user {
        id
        username
      }
    }
  }
`;

// Mutation to create a new post
export const CREATE_POST = gql`
  mutation CreatePost($userId: UUID!, $content: String!, $image_url: String) {
    insert_posts(objects: { user_id: $userId, content: $content, image_url: $image_url }) {
      returning {
        id
        content
        image_url
        created_at
      }
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: UUID!, $followingId: UUID!) {
    insert_follows(objects: { follower_id: $followerId, following_id: $followingId }) {
      returning {
        id
      }
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: UUID!, $followingId: UUID!) {
    delete_follows(where: { follower_id: { _eq: $followerId }, following_id: { _eq: $followingId } }) {
      affected_rows
    }
  }
`;
