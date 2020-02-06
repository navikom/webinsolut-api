export interface AuthType {
  email: string;
  userId: number;
  unique_key: string | null;
  phone: string;
  password: string;
  refreshToken?: string;

};

export interface LoginType {
  email: string;
  password: string;
  token: string,
  grantType: 'password' | 'refresh_token'
}

export interface JWTTokenType {
  exp: number;
  userId: number
}
