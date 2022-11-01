export interface IJwtConfig {
  secret: string;
  accessTokenExpiry: number;
  refreshTimeExpiry: number;
}
