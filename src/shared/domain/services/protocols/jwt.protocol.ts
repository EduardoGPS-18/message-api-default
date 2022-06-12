export type JwtPayload = {
  id: string;
  email: string;
};

export abstract class JwtProtocol {
  abstract sign(payload: JwtPayload): string;
  abstract verify(token: string): JwtPayload;
}
