export interface JwtTokenBody {
  id: string;
}

export interface JwtOptions {
  secret: string;
  expiresIn: string;
}
