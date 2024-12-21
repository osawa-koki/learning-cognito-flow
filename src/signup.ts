import {
  AdminConfirmSignUpCommand,
  CognitoIdentityProviderClient,
  NotAuthorizedException,
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
    console.log("processing signup command");
    await client.send(command);
  } catch (error) {
    if (!(error instanceof UsernameExistsException)) {
      throw error;
    }
  }

  const confirmCommand = new AdminConfirmSignUpCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: process.env.COGNITO_USER_USERNAME!,
  });
  try {
    console.log("processing confirm command");
    await client.send(confirmCommand);
  } catch (error) {
    if (!(error instanceof NotAuthorizedException)) {
      throw error;
    }
  }
  return;
}
