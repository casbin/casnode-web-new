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

export const AuthConfig = {
  // serverUrl: "https://door.casbin.com",
  serverUrl: "http://localhost:8000",
  clientId: "c27c22c1c293cce07d43",
  appName: "casnode",
  organizationName: "built-in",
};

export const AuthState = "casnode";

export const GoogleClientId = "";
export const GoogleAuthScope = "profile+email";
export const GoogleOauthUri = "https://accounts.google.com/signin/oauth";

export const GithubClientId = "";
export const GithubAuthScope = "user:email+read:user";
export const GithubOauthUri = "https://github.com/login/oauth/authorize";

export const QQClientId = "";
export const QQAuthScope = "get_user_info";
export const QQOauthUri = "https://graph.qq.com/oauth2.0/authorize";

export const WechatClientId = "";
export const WeChatAuthScope = "snsapi_login";
export const WeChatOauthUri = "https://open.weixin.qq.com/connect/qrconnect";

export const ShowGithubCorner = true;
export const GithubRepo = "https://github.com/casbin/casnode";

export const Domain = "forum.casbin.com";

export const DefaultLanguage = "en";

// Support: richtext | markdown
export const DefaultEditorType = "markdown";

//Default search engine
//Support: baidu(www.baidu.com) | google(www.google.com) | cn-bing(cn.bing.com)
export const DefaultSearchSite = "google";

export const EnableNotificationAutoUpdate = false;

export const NotificationAutoUpdatePeriod = 10; // second

export const DefaultTopicPageReplyNum = 100;

//Wiki URL at header
export const WikiUrl = "https://casdoor.org/docs/overview";

export const FooterSlogan1 = "World is powered by code";

export const FooterSlogan2 = "♥ Do have faith in what you're doing.";

//Will display on sign in box
export const SiteSlogan = "Casbin = way to authorization";

export const SiteDescription = "A place for Casbin developers and users";

export const CustomizeSideBarItems = [
  {
    title: "Casbin",
    imageUrl: "https://casbin.org/img/store.png",
    content: [
      {
        line: "test 1",
      },
      {
        line: "test 2",
      },
    ],
  },
  {
    title: "test",
    imageUrl: null,
    content: [
      {
        line: "test 1",
      },
      {
        line: "test 2",
      },
    ],
  },
];

export const HomepageRowLimit = 3;

export const HomepageTopConfig = [
  {
    img: "https://gocn.vip/uploads/svg/topics.svg",
    title: "communication",
    url: "/topics",
    special: "left",
  },
  {
    img: "https://gocn.vip/uploads/svg/doc.svg",
    title: "swagger",
    url: "http://localhost:7000/swagger/",
    special: "",
  },
  {
    img: "https://gocn.vip/uploads/svg/job.svg",
    title: "work",
    url: "",
    special: "",
  },
  {
    img: "https://gocn.vip/uploads/svg/news.svg",
    title: "news",
    url: "",
    special: "right",
  },
];
