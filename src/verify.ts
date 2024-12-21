import fs from "fs";

import { CognitoJwtVerifier } from "aws-jwt-verify";

export default async function verify() {
  for (const tokenType of ["id", "access"]) {
    console.log(`Verifying ${tokenType}...`);

    const idToken = fs.readFileSync(`./tokens/${tokenType}Token.txt`, "utf8");

    {
      // Ref: https://github.com/awslabs/aws-jwt-verify
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID!,
        clientId: process.env.USER_POOL_CLIENT_ID!,
        tokenUse: tokenType as "id" | "access",
      });

      try {
        const payload = await verifier.verify(idToken);
        console.log("🎉 Token is valid. Payload:", payload);
      } catch {
        console.log("🚨 Token not valid!");
      }
    }
  }
}
