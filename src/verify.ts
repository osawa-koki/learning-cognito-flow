import fs from "fs";

import { loadConfig } from "@aws-sdk/node-config-provider";

import { CognitoJwtVerifier } from "aws-jwt-verify";

import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

export default async function verify() {
  for (const tokenType of ["id", "access"]) {
    console.log(`Verifying ${tokenType}...`);

    const token = fs.readFileSync(`./tokens/${tokenType}Token.txt`, "utf8");

    {
      // Ref: https://github.com/awslabs/aws-jwt-verify
      const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.USER_POOL_ID!,
        clientId: process.env.USER_POOL_CLIENT_ID!,
        tokenUse: tokenType as "id" | "access",
      });

      try {
        const payload = await verifier.verify(token);
        // console.log("🎉 Token is valid. Payload:", payload);
        console.log(`🎉 Token is valid. type: ${tokenType} method: aws-jwt-verify Payload: ${JSON.stringify(payload)}`);
      } catch (error) {
        console.log(`🚨 Token not valid! type: ${tokenType} method: aws-jwt-verify`);
        console.log("    Error:", error);
      }
    }

    {
      // Ref: https://docs.aws.amazon.com/ja_jp/cognito/latest/developerguide/amazon-cognito-user-pools-using-tokens-verifying-a-jwt.html
      try {
        const region = await loadConfig({
          environmentVariableSelector: (env) => env.AWS_REGION ?? env.AWS_DEFAULT_REGION,
          configFileSelector: (profile) => profile.region,
          default: "ap-northeast-1",
        })();
        const jwkUrl = `https://cognito-idp.${region}.amazonaws.com/${process.env.USER_POOL_ID!}/.well-known/jwks.json`;
        const jwk = await fetch(jwkUrl).then((res) => res.json());

        const decodedHeader = jwt.decode(token, { complete: true })!.header!;
        const kid = decodedHeader.kid;

        const pem = jwkToPem(jwk.keys.find((key: { kid: string }) => key.kid === kid));
        jwt.verify(token, pem, { algorithms: ["RS256"] }, function (error, decodedToken) {
          if (error != null) {
            console.log(`🚨 Token not valid! type: ${tokenType} method: jwt.verify`);
            console.log("    Error:", error);
          } else {
            console.log(`🎉 Token is valid. type: ${tokenType} method: jwt.verify Payload: ${JSON.stringify(decodedToken)}`);
          }
        });
      } catch (error) {
        console.log(`🚨 Token not valid! type: ${tokenType} method: jwt.verify`);
        console.log("    Error:", error);
      }
    }
  }
}
