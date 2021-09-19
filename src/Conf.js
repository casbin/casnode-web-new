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
  serverUrl: "http://localhost:7001",
  clientId: "c27c22c1c293cce07d43",
  appName: "casnode",
  organizationName: "built-in",
};

export let FrontConfig = {
  forumName: "casnode",
  logoImage: "",
  footerLogoImage: "",
  footerLogoUrl: "",
  signinBoxStrong: "Casbin = way to authorization",
  signinBoxSpan: "A place for Casbin developers and users",
  footerDeclaration: "World is powered by code",
  footerAdvise: "♥ Do have faith in what you're doing.",
};

export const ShowEmbedButtons = false;

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

export const ReplyMaxDepth = 10;

export const ForceLanguage = "";

export const ReplyMobileMaxDepth = 3;

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
