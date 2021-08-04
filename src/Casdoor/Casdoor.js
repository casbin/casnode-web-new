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

import { CasdoorOAuthObject } from "./OAuth";

export class Casdoor {
  constructor(endpoint, organization, application, clientId, redirectUri) {
    this.endpoint = endpoint;
    this.organizationName = organization;
    this.applicationName = application;
    this.clientId = clientId;
    this.redirectUri = redirectUri;
  }

  connect() {
    return fetch(
      `${this.endpoint}/api/get-app-login?clientId=${this.clientId}&responseType=code&redirectUri=${this.redirectUri}&scope=read&state=${this.application}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "ok") return;
        this.application = res.data;
        return this;
      });
  }

  signin(username, password, remember) {
    if (this.application === undefined) return;
    if (this.application === null) return;
    if (!this.application.enablePassword) return;

    let values = {};
    values["application"] = this.applicationName;
    values["organization"] = this.organizationName;
    values["username"] = username;
    values["password"] = password;
    values["remember"] = remember;
    values["autoSignin"] = remember;
    values["type"] = "code";

    return fetch(
      `${this.endpoint}/api/login?clientId=${this.clientId}&responseType=code&redirectUri=${this.redirectUri}$scope=read&state=${this.applicationName}`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(values),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== "ok") return res.msg;
        let code = res.data;
        window.location.href = `${this.redirectUri}?code=${code}&state=${this.applicationName}`;
        return "";
      });
  }

  getOAuthSigninObjects() {
    let ret = [];
    if (this.application === undefined || this.application === null) return ret;
    let providers = this.application.providers;
    if (providers === undefined || providers === null) return ret;
    providers.forEach((provider) => {
      if (provider.canSignIn) {
        ret.push(
          new CasdoorOAuthObject(
            this,
            provider.provider,
            "signup",
            this.redirectUri
          )
        );
      }
    });
    return ret;
  }
}
