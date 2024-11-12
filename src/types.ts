// src/types.ts (create this file to store your types if it doesn't exist)
export interface User {
  id: string;
  email: string;
  username: string;
  name?: string; // Optional name field
  followers?: Followers; // Optional followers data
}
  
  // Props for UserList component
  export interface UserListProps {
    userId: string;
  }
  // src/types.ts

export interface FollowerEdge {
    node: {
      id: string;
    };
  }
  
  export interface Followers {
    edges: FollowerEdge[];
  }
  
  export interface User {
    id: string;
    email: string;
    username: string;
    followers?: Followers; // Optional followers data
  }
  
  export interface UsersCollection {
    edges: { node: User }[];
  }
  
  export interface GetUsersResponse {
    usersCollection: UsersCollection;
  }
  
  export interface Follow {
    follower_id: string;
    followed_id: string;
  }
export interface Post {
  id: string;
  content: string;
  created_at: string;
  image_url?: string;
  user_id: string;
}
  