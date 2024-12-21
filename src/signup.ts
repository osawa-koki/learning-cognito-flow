import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";

export default async function signup() {
  const client = new CognitoIdentityProviderClient({});

  const command = new SignUpCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID!,
    Username: process.env.COGNITO_USER_USERNAME!,
    Password: process.env.COGNITO_USER_PASSWORD!,
    UserAttributes: [
      { Name: "email", Value: process.env.COGNITO_USER_EMAIL! },
    ],
  });

  try {
    const response = await client.send(command);
    return response;
  } catch (error) {
    if (error instanceof UsernameExistsException) {
      return {
        status: "success",
        message: "User already exists",
      };
    }
    throw error;
  }
}
