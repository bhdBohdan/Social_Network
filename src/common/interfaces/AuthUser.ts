export interface AuthUser {
  email: string;
  firstName: string;
  id: string;
  image?: string;
  interests?: string;
  lastName: string;
  ppUrl?: string;
}

export interface PostUser {
  _id: string;
  email: string;
  firstName?: string;
  image?: string;
  lastName?: string;
  ppUrl?: string;
}
