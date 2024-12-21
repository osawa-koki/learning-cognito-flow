import fs from "fs";

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export default async function signin() {
  const client = new CognitoIdentityProviderClient({
  });

  const command = new InitiateAuthCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID!,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: process.env.COGNITO_USER_USERNAME!,
      PASSWORD: process.env.COGNITO_USER_PASSWORD!,
    },
  });

  const response = await client.send(command);
  const tokens = response.AuthenticationResult!;
  const idToken = tokens.IdToken!;
  const accessToken = tokens.AccessToken!;
  const refreshToken = tokens.RefreshToken!;

  fs.writeFileSync("./tokens/idToken.txt", idToken);
  fs.writeFileSync("./tokens/accessToken.txt", accessToken);
  fs.writeFileSync("./tokens/refreshToken.txt", refreshToken);

  return;
}
