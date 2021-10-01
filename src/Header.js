// Copyright 2021 The casbin Settingors. All Rights Reserved.
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

import React from "react";
import * as AccountBackend from "./backend/AccountBackend";
import * as NodeBackend from "./backend/NodeBackend";
import * as NotificationBackend from "./backend/NotificationBackend";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import { withRouter, Link } from "react-router-dom";
import i18next from "i18next";
import { ServerUrl } from "./Setting";

import { Layout, Menu, Dropdown, Avatar } from "antd";
import { createFromIconfontCN, CaretDownOutlined } from "@ant-design/icons";
import "./Header.css";

import Container from "./components/container";

const { Header } = Layout;
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2717339_r6fp7ddokf.js",
});
class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      searchValue: "",
      searchResShow: false,
      nodes: [],
      matchNodes: [],
    };
  }

  componentDidMount() {
    this.getNodes();
    this.getNotifications();
  }

  componentDidUpdate() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (this.state.uri !== uri) {
      this.updateMenuKey();
    }
  }

  getNotifications() {
    NotificationBackend.getNotifications(
      this.state.limit,
      this.state.page
    ).then((res) => {
      this.setState({
        notifications: res?.data,
        notificationNum: res?.data2,
      });
    });
  }

  updateMenuKey() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    this.setState({
      uri: uri,
    });
    if (uri === "/topics") {
      this.setState({ selectedMenuKey: 0 });
    } else if (uri.includes("signup")) {
      this.setState({ selectedMenuKey: 1 });
    } else if (uri.includes("signin")) {
      this.setState({ selectedMenuKey: 2 });
    } else if (uri.includes("swagger")) {
      this.setState({ selectedMenuKey: 3 });
    } else if (uri.includes(this.props.account?.name)) {
      this.setState({ selectedMenuKey: 4 });
    } else if (uri.includes("records")) {
      this.setState({ selectedMenuKey: 5 });
    } else if (uri.includes("i")) {
      this.setState({ selectedMenuKey: 6 });
    } else if (uri.includes("t")) {
      this.setState({ selectedMenuKey: 7 });
    }
  }

  getMatchNodes(nodes, curSearchVal, matchNodes) {
    if (!curSearchVal || !nodes) {
      return;
    }
    for (let i = 0; i < nodes.length; i++) {
      const name = nodes[i].name;
      const id = nodes[i].id;
      if (name.indexOf(curSearchVal) > -1 || id.indexOf(curSearchVal) > -1) {
        matchNodes.push(nodes[i]);
      }
    }
  }

  onSearchValueChange(e) {
    const nodes = this.state.nodes;
    const curSearchVal = e.target.value;
    const matchNodes = [];
    this.getMatchNodes(nodes, curSearchVal, matchNodes);
    this.setState({
      searchValue: curSearchVal,
      matchNodes: matchNodes,
      searchResShow: true,
    });
  }

  addSearchValue() {
    this.setState({
      searchValue: `${Conf.Domain}/t ` + this.state.searchValue,
    });
  }

  onKeyup(e) {
    if (e.keyCode === 13) {
      this.props.history.push(`/search?keyword=${this.state.searchValue}`);
      this.setState({
        searchResShow: false,
      });
    }
  }

  signout() {
    if (!window.confirm(i18next.t("signout:Are you sure to log out?"))) {
      return;
    }

    AccountBackend.signout().then((res) => {
      if (res.status === "ok") {
        this.props.onSignout();
        // this.props.history.push("/");
        window.location.href = "/";
      } else {
        // this.props.history.push("/");
        window.location.href = "/";
      }
    });
  }

  renderAvatar() {
    if (this.props.account?.avatar === "") {
      return (
        <Avatar
          style={{
            backgroundColor: Setting.getUserAvatar(this.props.account?.name),
            verticalAlign: "middle",
          }}
          size="medium"
        />
      );
    } else {
      return (
        <Avatar
          src={this.props.account?.avatar}
          style={{ verticalAlign: "middle" }}
          size="medium"
        />
      );
    }
  }

  renderItemRight() {
    const isSignedIn =
      this.props.account !== undefined && this.props.account !== null;

    const menu = (
      <ul className="nav">
        <li>
          <a href={Setting.getSignupUrl()} className="top">
            {i18next.t("general:Sign Up")}
          </a>
        </li>
        <li>
          <a href={Setting.getSigninUrl()} className="top">
            {i18next.t("general:Sign In")}
          </a>
        </li>
      </ul>
    );
    const account = (
      <Menu style={{ fontSize: "20px" }}>
        <Menu.Item>
          <Link to={`/member/${this.props.account?.name}`} className="top">
            {this.props.account?.name}
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a
            target="_blank"
            className="top"
            href={Setting.getMyProfileUrl(this.props.account)}
          >
            {i18next.t("general:Setting")}
          </a>
        </Menu.Item>
        <Menu.Item>
          <Link to="/i" className="top">
            {i18next.t("bar:File library")}
          </Link>
        </Menu.Item>
        <Menu.Item>
          {this.props.account?.isAdmin ? (
            <span>
              <Link to="/admin" className="top">
                {i18next.t("general:Admin")}
              </Link>
              &nbsp;&nbsp;&nbsp;
            </span>
          ) : null}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a href="#;" onClick={this.signout.bind(this)} className="top">
            {i18next.t("general:Sign Out")}
          </a>
        </Menu.Item>
      </Menu>
    );

    const newTopic = (
      <Menu>
        <Menu.Item>
          <Link to="/new" className={`${this.props.nodeId}`}>
            {i18next.t("bar:Compose")}
          </Link>
        </Menu.Item>
      </Menu>
    );

    const dropdown = (
      <ul className="nav dropdown">
        <li>
          <Link to="/notifications" style={{ padding: "0 0 0 5px" }}>
            <IconFont
              type={
                this.state.notificationNum == 0
                  ? "icon-notification"
                  : "icon-notifications_on"
              }
              style={{ fontSize: "21px" }}
            />
          </Link>
        </li>
        <li>
          <Dropdown overlay={newTopic} trigger="click">
            <div>
              <IconFont type="icon-plus" style={{ fontSize: "17px" }} />
              <CaretDownOutlined />
            </div>
          </Dropdown>
        </li>
        <li>
          <Dropdown overlay={account} trigger="click">
            <div>
              {this.renderAvatar()}
              <CaretDownOutlined />
            </div>
          </Dropdown>
        </li>
      </ul>
    );
    return isSignedIn ? dropdown : menu;
  }

  renderItemLeft() {
    const leftMenuItems = (
      <React.Fragment>
        <li
          key="1"
          className={this.state.selectedMenuKey === 0 ? "selected" : ""}
        >
          <Link to="/topics">{i18next.t("general:Topics")}</Link>
        </li>
        <li key="3">
          <a href="https://forum.casbin.com/swagger/">
            {i18next.t("general:Swagger")}
          </a>
        </li>
        <li key="100">
          <a href={Conf.WikiUrl}>{i18next.t("general:Wiki")}</a>
        </li>
      </React.Fragment>
    );
    const collapsed_menu = <ul className="nav-collapse">{leftMenuItems}</ul>;

    const menu = <ul className="nav nav-left">{leftMenuItems}</ul>;

    return this.props.BreakpointStage == "stage1" ||
      this.props.BreakpointStage == "stage2" ? (
      menu
    ) : (
      <Dropdown overlay={collapsed_menu} trigger="click" placement="topCenter">
        <IconFont
          style={{ fontSize: "17px", padding: "19px 19px" }}
          type="icon-dropdown"
        />
      </Dropdown>
    );
  }

  renderSearchEngine() {
    let searchUrl;
    switch (Conf.DefaultSearchSite) {
      case "google":
      case "Google":
        searchUrl = `https://www.google.com/search?q=site:${Conf.Domain}/t ${this.state.searchValue}`;
        break;
      case "bing":
      case "Bing":
        searchUrl = `https://cn.bing.com/search?q=site:${Conf.Domain}/t ${this.state.searchValue}`;
        break;
      case "baidu":
      case "Baidu":
        searchUrl = `https://www.baidu.com/s?q6=${Conf.Domain}&q3=${this.state.searchValue}`;
        break;
      default:
        searchUrl = "/search?keyword=" + this.state.searchValue;
    }

    return (
      <div className="cell">
        <a className="search-item" href={searchUrl} target="blank">
          {`${i18next.t("search:Click here to search in ")}${
            Conf.DefaultSearchSite
          }`}
        </a>
      </div>
    );
  }

  renderSearch() {
    if (Setting.PcBrowser) {
      return (
        <div id="Search">
          <div style={{ display: "flex", alignItems: "center" }} className="">
            <IconFont type="icon-search" />
            <input
              value
              placeholder={i18next.t("search:search")}
              style={{ width: "160px", margin: "0 0 0 5px" }}
              type="text"
              maxLength="40"
              name="q"
              id="q"
              autoComplete={"off"}
              value={this.state.searchValue}
              onKeyUp={(event) => this.onKeyup(event)}
              onChange={(event) => this.onSearchValueChange(event)}
              onFocus={() => {
                this.setState({
                  searchResShow: true,
                });
              }}
              onBlur={() => {
                setTimeout(() => {
                  this.setState({
                    searchResShow: false,
                  });
                }, 200);
              }}
            />
            {this.state.searchResShow && this.state.searchValue ? (
              <div
                id="search-result"
                className="box"
                style={{ display: "block", zIndex: "1" }}
              >
                <div className="cell">
                  {i18next.t("search:Press Enter to search in site.")}
                </div>
                {this.state.matchNodes.length !== 0 ? (
                  <div className="cell">
                    <span className="fade">
                      节点&nbsp;&nbsp;/&nbsp;&nbsp;Nodes
                    </span>
                    {this.state.matchNodes.map((val) => {
                      //TODO: maybe weshould add `active` iterm
                      return (
                        <a className="search-item" href={`/go/${val.id}`}>
                          {val.name}&nbsp;&nbsp;/&nbsp;&nbsp;{val.id}
                        </a>
                      );
                    })}
                  </div>
                ) : null}
                {this.renderSearchEngine()}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    if (this.props.account === undefined || this.props.account === null) {
      return null;
    }

    // mobile
    return (
      <input
        type="text"
        id="site-search"
        value={this.state.searchValue}
        onKeyUp={(event) => this.onKeyup(event)}
        onChange={(event) => this.onSearchValueChange(event)}
      />
    );
  }

  changeShowMenuStatus() {
    this.props.changeMenuStatus(!this.props.showMenu);
  }

  getNodes() {
    if (this.state.account === null) {
      return;
    }

    NodeBackend.getNodes().then((res) => {
      this.setState({
        nodes: res,
      });
    });
  }

  render() {
    return (
      <Header
        style={{
          justifyContent: "center",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          position: "relative",
          top: "0",
          padding: "0px",
        }}
      >
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ display: "flex", alignItems: "center", flex: "auto" }}>
            <Link to="/" style={{ lineHeight: "initial" }}>
              <div id="logo" style={{ marginRight: "10px" }} />
            </Link>
            {this.renderItemLeft()}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {this.props.BreakpointStage == "stage1" ? (
              this.renderSearch()
            ) : (
              <div style={{ display: "none" }} />
            )}
            <Menu mode="horizontal" style={{ fontSize: "16px" }}>
              {this.renderItemRight()}
            </Menu>
          </div>
        </Container>
      </Header>
    );
  }
}

export default withRouter(PageHeader);
