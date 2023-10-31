#!/bin/sh

if [ "$TRAVIS_BRANCH" = "master" ]; then
  beanstalk-deploy "$AWS_APP_NAME" "$AWS_APP_ENV_PROD" "$EB_DEPLOY_VERSION" "$AWS_DEPLOY_REGION" deploy.zip
elif [ "$TRAVIS_BRANCH" = "develop" ]; then
  beanstalk-deploy "$AWS_APP_NAME" "$AWS_APP_ENV_DEV" "$EB_DEPLOY_VERSION" "$AWS_DEPLOY_REGION" deploy.zip
else
  beanstalk-deploy "$AWS_APP_NAME" "$AWS_APP_ENV_DIRTY" "$EB_DEPLOY_VERSION" "$AWS_DEPLOY_REGION" deploy.zip
fi