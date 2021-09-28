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

import React, { Component } from "react";
import "./App.css";
import { BackTop } from "antd";
import * as Setting from "./Setting";
import { Switch, Route } from "react-router-dom";
import TopicPage from "./TopicPage";
import PageHeader from "./Header";
import PageFooter from "./Footer";
import RightSigninBox from "./rightbar/RightSigninBox";
import RightAccountBox from "./rightbar/RightAccountBox";
import SearchTag from "./main/SearchTag";
import * as AccountBackend from "./backend/AccountBackend";
import RightFavouriteBox from "./rightbar/RightFavouriteBox";
import RightNodeBox from "./rightbar/RightNodeBox";
import CustomGithubCorner from "./main/CustomGithubCorner";
import RightCheckinBonusBox from "./rightbar/RightCheckinBonusBox";
import RightLatestNodeBox from "./rightbar/RightLatestNodeBox";
import RightHotNodeBox from "./rightbar/RightHotNodeBox";
import RightHotTopicBox from "./rightbar/RightHotTopicBox";
import i18next from "i18next";
import "./node.css";
import "./i18n";
import * as FavoritesBackend from "./backend/FavoritesBackend";
import * as Conf from "./Conf";
import AuthCallback from "./auth/AuthCallback";
import LazyLoad from "./components/LazyLoad";
import HomePage from "./HomePage";

// lazy load imports
const SignoutBox = React.lazy(() => import("./main/SignoutBox"));
const TopicBox = React.lazy(() => import("./main/TopicBox"));
const MemberBox = React.lazy(() => import("./main/MemberBox"));
const AllCreatedTopicsBox = React.lazy(() =>
  import("./main/AllCreatedTopicsBox")
);
const NewBox = React.lazy(() => import("./main/NewBox"));
const NodesBox = React.lazy(() => import("./main/NodeBox"));
const FavoritesBox = React.lazy(() => import("./main/FavoritesBox"));
const RecentTopicsBox = React.lazy(() => import("./main/RecentTopicsBox"));
const SelectLanguageBox = React.lazy(() => import("./main/SelectLanguageBox"));
const SelectEditorTypeBox = React.lazy(() =>
  import("./main/SelectEditorTypeBox")
);
const NotificationBox = React.lazy(() => import("./main/NotificationBox"));
const PlaneBox = React.lazy(() => import("./main/PlaneBox"));
const BalanceBox = React.lazy(() => import("./main/BalanceBox"));
const CheckinBonusBox = React.lazy(() => import("./main/CheckinBonusBox"));
const MoveTopicNodeBox = React.lazy(() => import("./main/MoveTopicNodeBox"));
const EditBox = React.lazy(() => import("./main/EditBox"));
const FilesBox = React.lazy(() => import("./main/FilesBox"));
const RankingRichBox = React.lazy(() => import("./main/RankingRichBox"));
const AdminHomepage = React.lazy(() => import("./admin/AdminHomepage"));
const AdminNode = React.lazy(() => import("./admin/AdminNode"));
const AdminTab = React.lazy(() => import("./admin/AdminTab"));
const AdminPoster = React.lazy(() => import("./admin/AdminPoster"));
const AdminTranslation = React.lazy(() => import("./admin/AdminTranslation"));
const AdminPlane = React.lazy(() => import("./admin/AdminPlane"));
const AdminTopic = React.lazy(() => import("./admin/AdminTopic"));
const AdminSensitive = React.lazy(() => import("./admin/AdminSensitive"));
const AboutForum = React.lazy(() => import("./main/AboutForum"));
const SearchResultPage = React.lazy(() => import("./SearchResultPage"));
const NoMatch = React.lazy(() => import("./main/NoMatch"));
const Embed = React.lazy(() => import("./Embed"));
const AdminFrontConf = React.lazy(() => import("./admin/AdminFrontConfig"));

class App extends Component {
  constructor(props) {
    super(props);
    let initalBreakpoint = "";
    if (window.innerWidth > 1360) {
      initalBreakpoint = "stage1";
    } else if (window.innerWidth > 1100) {
      initalBreakpoint = "stage2";
    } else if (window.innerWidth > 865) {
      initalBreakpoint = "stage3";
    } else if (window.innerWidth > 650) {
      initalBreakpoint = "stage4";
    } else if (window.innerWidth < 650) {
      initalBreakpoint = "stage5";
    }
    this.state = {
      classes: props,
      account: undefined,
      nodeId: null,
      showMenu: false,
      nodeBackgroundImage: "",
      nodeBackgroundColor: "",
      nodeBackgroundRepeat: "",
      BreakpointStage: initalBreakpoint,
    };

    Setting.initServerUrl();
    Setting.initCasdoorSdk(Conf.AuthConfig);
    Setting.initFullClientUrl();
    Setting.initBrowserType();
    Setting.getFrontConf("visualConf");
    this.getNodeBackground = this.getNodeBackground.bind(this);
    this.changeMenuStatus = this.changeMenuStatus.bind(this);
  }

  componentDidMount() {
    //Setting.SetLanguage();
    this.getAccount();
    this.getFavoriteNum();
    window.addEventListener("resize", this.handleResize.bind(this));
  }

  onSignin() {
    this.getAccount();
  }

  onSignout() {
    this.getAccount();
  }

  onUpdateAccount(account) {
    this.setState({
      account: account,
    });
  }

  getNodeBackground(id, backgroundImage, backgroundColor, backgroundRepeat) {
    this.setState({
      nodeId: id,
      nodeBackgroundImage: backgroundImage,
      nodeBackgroundColor: backgroundColor,
      nodeBackgroundRepeat: backgroundRepeat,
    });
  }

  getAccount() {
    AccountBackend.getAccount().then((res) => {
      let account = res.data;
      if (account !== null) {
        let language = account?.language;
        if (language !== "" && language !== i18next.language) {
          Setting.SetLanguage(language);
        }
        // i18n.changeCustomLanguage(language)
        let loginCallbackUrl = localStorage.getItem("loginCallbackUrl");
        localStorage.removeItem("loginCallbackUrl");
        if (loginCallbackUrl !== null) {
          loginCallbackUrl = decodeURIComponent(loginCallbackUrl);
          window.location.href = loginCallbackUrl;
        }
      }
      this.setState({
        account: account,
      });
    });
  }

  getFavoriteNum() {
    if (this.state.account === null) {
      return;
    }

    FavoritesBackend.getAccountFavoriteNum().then((res) => {
      if (res.status === "ok") {
        this.setState({
          favorites: res?.data,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  renderMain() {
    const pcBrowser = Setting.PcBrowser;
    return (
      <Switch>
        <Route exact path="/">
          {pcBrowser ? <div className="sep20" /> : null}

          <HomePage BreakpointStage={this.state.BreakpointStage} />
        </Route>
        <Route exact path="/callback" component={AuthCallback} />
        <Route exact path="/topics">
          <TopicPage
            account={this.state.account}
            BreakpointStage={this.state.BreakpointStage}
          />
        </Route>
        <Route exact path="/signout">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <SignoutBox
              account={this.state.account}
              onSignout={this.onSignout.bind(this)}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/t/:topicId/:event">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <TopicBox
                account={this.state.account}
                getNodeBackground={this.getNodeBackground}
                refreshFavorites={this.getFavoriteNum.bind(this)}
              />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/t/:topicId">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <TopicBox
                account={this.state.account}
                getNodeBackground={this.getNodeBackground}
                refreshFavorites={this.getFavoriteNum.bind(this)}
              />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/member/:memberId">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <MemberBox
              account={this.state.account}
              refreshFavorites={this.getFavoriteNum.bind(this)}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/new">
          <div id={pcBrowser ? "Main" : ""}>
            <LazyLoad>
              <NewBox
                BreakpointStage={this.state.BreakpointStage}
                account={this.state.account}
              />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/tag/:tagId">
          {pcBrowser ? <div className="sep20" /> : null}
          <SearchTag BreakpointStage={this.state.BreakpointStage} />
        </Route>
        <Route exact path="/new/:nodeId">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <NewBox account={this.state.account} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/go/:nodeId">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <LazyLoad>
              <NodesBox
                account={this.state.account}
                getNodeBackground={this.getNodeBackground}
                refreshAccount={this.getAccount.bind(this)}
                refreshFavorites={this.getFavoriteNum.bind(this)}
                BreakpointStage={this.state.BreakpointStage}
              />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/go/:nodeId/:event">
          <LazyLoad>
            <NodesBox
              account={this.state.account}
              getNodeBackground={this.getNodeBackground}
              refreshAccount={this.getAccount.bind(this)}
              refreshFavorites={this.getFavoriteNum.bind(this)}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/my/:favorites">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <FavoritesBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/recent">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <RecentTopicsBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/select/language">
          <LazyLoad>
            {pcBrowser ? <div className="sep20" /> : null}
            <SelectLanguageBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/select/editorType">
          <LazyLoad>
            {pcBrowser ? <div className="sep20" /> : null}
            <SelectEditorTypeBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/notifications">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <NotificationBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/planes">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <PlaneBox />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/balance">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <BalanceBox account={this.state.account} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/mission/daily">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <CheckinBonusBox />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/move/topic/:id">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <MoveTopicNodeBox BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/edit/:editType/:id">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <EditBox account={this.state.account} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/i">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <FilesBox account={this.state.account} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/i/:event">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <FilesBox account={this.state.account} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/i/edit/:event">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <FilesBox account={this.state.account} edit={true} />
            </LazyLoad>
          </div>
        </Route>
        <Route exact path="/top/rich">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <RankingRichBox />
            </LazyLoad>
          </div>
        </Route>
        {/*BACKSTAGE*/}
        <Route exact path="/admin">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminHomepage
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/node">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminNode
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        {/* TODO:codemirror */}
        <Route exact path="/admin/node/new">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminNode
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
              event={"new"}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/node/edit/:nodeId">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminNode
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/tab">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTab
              BreakpointStage={this.state.BreakpointStage}
              account={this.state.account}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/tab/new">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTab
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
              event={"new"}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/tab/edit/:tabId">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTab
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/poster">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminPoster BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/translation">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTranslation BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/plane">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminPlane
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/plane/new">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminPlane
              account={this.state.account}
              event={"new"}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/plane/edit/:planeId">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminPlane
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/topic">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTopic
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/topic/edit/:topicId">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminTopic
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/sensitive">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminSensitive
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/sensitive/new">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminSensitive
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
              event={"new"}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/admin/frontconf">
          {pcBrowser ? <div className="sep20" /> : null}
          <LazyLoad>
            <AdminFrontConf
              account={this.state.account}
              BreakpointStage={this.state.BreakpointStage}
            />
          </LazyLoad>
        </Route>
        <Route exact path="/about">
          <LazyLoad>
            <AboutForum BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route exact path="/search">
          <LazyLoad>
            <SearchResultPage BreakpointStage={this.state.BreakpointStage} />
          </LazyLoad>
        </Route>
        <Route path="*">
          <div id={pcBrowser ? "Main" : ""}>
            {pcBrowser ? <div className="sep20" /> : null}
            <LazyLoad>
              <NoMatch />
            </LazyLoad>
          </div>
        </Route>
      </Switch>
    );
  }

  renderRightbar() {
    if (this.state.account === undefined) {
      return null;
    }

    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;

    if (uri === "/select/language") {
      return null;
    }

    const isSignedIn = this.state.account !== null;
    if (!isSignedIn) {
      if (uri === "/signup" || uri.startsWith("/member/")) {
        return null;
      }
    }

    return (
      <div id="Rightbar">
        <div className="sep20" />
        {isSignedIn ? (
          <RightAccountBox
            account={this.state.account}
            nodeId={this.state.nodeId}
            favorites={this.state.favorites}
          />
        ) : (
          <RightSigninBox
            OAuthObjects={this.state.OAuthObjects}
            nodeId={this.state.nodeId}
          />
        )}
        <Switch>
          <Route exact path="/">
            <span>
              <RightCheckinBonusBox account={this.state.account} />
              <div className="sep20" />
              {/* <RightCommunityHealthBox /> */}
              <div className="sep20" />
              <RightFavouriteBox />
              <div className="sep20" />
              <RightHotTopicBox />
              <div className="sep20" />
              <RightHotNodeBox />
              <div className="sep20" />
              <RightLatestNodeBox />
            </span>
          </Route>
          <Route exact path="/go/:nodeId">
            <span>
              <div className="sep20" />
              <RightNodeBox />
            </span>
          </Route>
        </Switch>
      </div>
    );
  }

  changeMenuStatus(status) {
    if (this.state.showMenu === status) {
      return;
    }
    this.setState({
      showMenu: status,
    });
  }

  getThemeLink() {
    let themeMode = undefined;
    let modeArray = document.cookie.split("; ");
    for (let i = 0; i < modeArray.length; i++) {
      let kvset = modeArray[i].split("=");
      if (kvset[0] === "themeMode") themeMode = kvset[1];
    }
    if (themeMode === undefined) themeMode = "true";
    if (themeMode === "true") return "";
    else return Setting.getStatic("/css/night.css");
  }

  handleResize() {
    let width = window.innerWidth;
    const breakPointOne = 1360;
    const breakPointRight = 1100;
    const breakPointLeft = 865;
    const breakPointMobile = 650;

    if (width > breakPointOne) {
      this.setState({ BreakpointStage: "stage1" });
    } else if (width > breakPointRight) {
      this.setState({ BreakpointStage: "stage2" });
    } else if (width > breakPointLeft) {
      this.setState({ BreakpointStage: "stage3" });
    } else if (width > breakPointMobile) {
      this.setState({ BreakpointStage: "stage4" });
    } else if (width < breakPointMobile) {
      this.setState({ BreakpointStage: "stage5" });
    }
  }

  render() {
    console.log(window.innerWidth);
    if (window.location.pathname.startsWith("/embedded-replies")) {
      return (
        <LazyLoad>
          <Embed account={this.state.account} />
        </LazyLoad>
      );
    }
    return (
      <div>
        <link
          type="text/css"
          rel="stylesheet"
          media="all"
          id="dark-mode"
          href={this.getThemeLink()}
        />
        <BackTop />
        <PageHeader
          account={this.state.account}
          onSignout={this.onSignout.bind(this)}
          changeMenuStatus={this.changeMenuStatus.bind(this)}
          showMenu={this.state.showMenu}
          BreakpointStage={this.state.BreakpointStage}
        />
        <div
          id="Wrapper"
          style={{
            backgroundColor: `${this.state.nodeBackgroundColor}`,
            backgroundImage: `url(${this.state.nodeBackgroundImage}), url(https://cdn.jsdelivr.net/gh/casbin/static/img/shadow_light.png)`,
            backgroundRepeat: `${this.state.nodeBackgroundRepeat}, repeat-x`,
          }}
          className={this.state.nodeId}
          onClick={() => this.changeMenuStatus(false)}
        >
          <div>
            <div id="Leftbar" />
            {Setting.PcBrowser ? <CustomGithubCorner /> : null}
            {/* {Setting.PcBrowser ? this.renderRightbar() : null} */}
            {this.renderMain()}
            <div className="c" />
            {Setting.PcBrowser ? <div className="sep20" /> : null}
          </div>
        </div>
        <PageFooter BreakpointStage={this.state.BreakpointStage} />
      </div>
    );
  }
}

export default App;
