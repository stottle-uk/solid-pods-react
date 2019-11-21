export interface Authorization {
  client_id: string;
  access_token: string;
  id_token: string;
}

import { Session } from 'solid-auth-client';

export interface Jwk {
  alg: string;
  e: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  n: string;
}

export interface Cnf {
  jwk: Jwk;
}

export interface IdClaims {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  nonce: string;
  azp: string;
  cnf: Cnf;
  at_hash: string;
}

export interface SessionStatus extends Session {
  credentialType: string;
  issuer: string;
  authorization: Authorization;
  sessionKey: string;
  idClaims: IdClaims;
  webId: string;
  idp: string;
}
