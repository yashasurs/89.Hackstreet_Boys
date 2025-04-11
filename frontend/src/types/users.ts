export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

export interface Profile {
  id: number;
  user: User;
  profile_picture?: string;
  bio?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}