// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { trim } from "./Util";

export let authConfig = {
  serverUrl: "http://example.com", // your Casdoor URL, like the official one: https://door.casbin.com
  clientId: "xxx", // your Casdoor OAuth Client ID
  appName: "app-example", // your Casdoor application name, like: "app-built-in"
  organizationName: "org-example", // your Casdoor organization name, like: "built-in"
};

export function initAuthWithConfig(config) {
  authConfig = config;
}

export function getSignupUrl() {
  // return `${trim(authConfig.serverUrl)}/signup/${authConfig.appName}`;
  return getSigninUrl().replace(
    "/login/oauth/authorize",
    "/signup/oauth/authorize"
  );
}

export function getSigninUrl() {
  const redirectUri = `${window.location.origin}/callback`;
  const scope = "read";
  const state = authConfig.appName;
  return `${trim(authConfig.serverUrl)}/login/oauth/authorize?client_id=${
    authConfig.clientId
  }&response_type=code&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
}

export function getUserProfileUrl(userName, account) {
  let param = "";
  if (account !== undefined && account !== null) {
    param = `?access_token=${account.accessToken}`;
  }
  return `${trim(authConfig.serverUrl)}/users/${
    authConfig.organizationName
  }/${userName}${param}`;
}

export function getMyProfileUrl(account) {
  let param = "";
  if (account !== undefined && account !== null) {
    param = `?access_token=${account.accessToken}`;
  }
  return `${trim(authConfig.serverUrl)}/account${param}`;
}
