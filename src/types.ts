// src/types.ts (create this file to store your types if it doesn't exist)
export interface User {
    id: string;
    username: string;
    email: string;
    isFollowing: {
      edges: { node: { id: string } }[];
    };
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
  
