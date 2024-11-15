import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation CreatePost(
    $userId: UUID!,
    $content: String!,
    $imageUrl: String
  ) {
    insertIntopostsCollection(
      objects: [
        {
          user_id: $userId,
          content: $content,
          image_url: $imageUrl
        }
      ]
    ) {
      records {
        id
        user_id
        content
        image_url
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


export const GET_FOLLOWED_USER_IDS = gql`
  query GetFollowedUserIds($followerId: uuid!) {
    followsCollection(where: { follower_id: { _eq: $followerId } }) {
      edges {
        node {
          followed_id
        }
      }
    }
  }
`;

// Fetch posts by the followed user IDs
export const GET_POSTS_BY_USER_IDS = gql`
  query GetPostsByUserIds($userIds: [uuid!]) {
    postsCollection(where: { user_id: { _in: $userIds } }, order_by: { created_at: desc }) {
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