# learning-cognito-flow

🧆🧆🧆 Cognitoを用いてOAuth2.0の認証フローを学ぶ！  

## 実行方法

`.env.example`をコピーして`.env`を作成してください。  
中身は適切に設定してください。  

DevContainerに入ってから以下のコマンドで、CloudFormationテンプレートをデプロイします。  
※ `~/.aws/credentials`に適切なAWSの認証情報が設定されていることを前提としています。  

```shell
source .env

aws cloudformation deploy \
  --template-file template.yml \
  --stack-name ${STACK_NAME} \
  --parameter-overrides UserPoolName=${USER_POOL_NAME} UserPoolClientName=${USER_POOL_CLIENT_NAME}
```

デプロイ後、CloudFormationのOutputsにある`UserPoolId`と`UserPoolClientId`を確認してください。  

```shell
source .env

aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs[*].{Key:OutputKey,Value:OutputValue}' \
  --output table

OUTPUTS=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[0].Outputs' \
  --output json)

export USER_POOL_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey == "UserPoolId") | .OutputValue')
export USER_POOL_CLIENT_ID=$(echo "$OUTPUTS" | jq -r '.[] | select(.OutputKey == "UserPoolClientId") | .OutputValue')

echo "USER_POOL_ID: ${USER_POOL_ID}"
echo "USER_POOL_CLIENT_ID: ${USER_POOL_CLIENT_ID}"
```
