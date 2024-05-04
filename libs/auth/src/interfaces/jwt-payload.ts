export interface JwtPayload {
  // The identifier of the subject or owner of the token
  sub: string;
  // The expiration time of the token
  exp?: number;
  // The time at which the token was issued
  iat?: number;
}
