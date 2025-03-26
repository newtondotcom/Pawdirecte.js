import {
  type Account,
  type AccountKind,
  BadCredentials,
  DoubleAuthRequired,
  InvalidVersion,
  type Session,
  SessionTokenRequired
} from "~/models";

import { Request } from "~/core/request";
import { decodeAccount } from "~/decoders/account";
import { encodeDoubleAuth } from "~/encoders/double-auth";
import { getCookiesFromResponse } from "@literate.ink/utilities";

const init = async (
  body: Record<string, unknown>,
  token: string | null = null
): Promise<Request> => {
  let gtk: string | undefined;
  let cookies: string[];

  {
    const request = new Request("/login.awp?gtk=1").addVersionURL();
    const response = await request.sendRaw();
    cookies = getCookiesFromResponse(response);

    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === "GTK") gtk = value;
    }

    if (!gtk) {
      throw new Error("GTK cookie not found in response");
    }
  }

  const request = new Request("/login.awp").addVersionURL().setFormData(body);
  request.headers["X-GTK"] = gtk;
  request.headers["Cookie"] = cookies.join("; ");

  if (token) request.setToken(token);
  return request;
};

export const login = async (
  session: Session,
  password: string
): Promise<Array<Account>> => {
  const encoded_double_auth = encodeDoubleAuth(session.double_auth);
  const request = await init(
    {
      ...encoded_double_auth,
      fa: encoded_double_auth && [encoded_double_auth],

      identifiant: session.username,
      uuid: session.device_uuid,
      isReLogin: false,
      sesouvenirdemoi: true,
      motdepasse: encodeURIComponent(password)
    },
    session.token
  );

  return pipe(session, request);
};

export const refresh = async (
  session: Session,
  account_kind: AccountKind
): Promise<Array<Account>> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = await init(
    {
      fa: [encodeDoubleAuth(session.double_auth)],

      identifiant: session.username,
      uuid: session.device_uuid,
      isReLogin: true,
      motdepasse: "???",
      typeCompte: account_kind,
      accesstoken: session.accessToken
    },
    session.token
  );

  return pipe(session, request);
};

const pipe = async (
  session: Session,
  request: Request
): Promise<Array<Account>> => {
  const response = await request.send(session.fetcher);
  session.token = response.token;

  switch (response.status) {
    case 505:
      throw new BadCredentials();
    case 517:
      throw new InvalidVersion();
    case 250:
      throw new DoubleAuthRequired();
  }

  return response.data.accounts.map(decodeAccount);
};

export const setAccessToken = (session: Session, account: Account) => {
  session.accessToken = account.access_token;
};
