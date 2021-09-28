// Copyright 2020 The casbin Authors. All Rights Reserved.
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
import * as Setting from "../Setting";
import * as MemberBackend from "../backend/MemberBackend";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import * as TopicBackend from "../backend/TopicBackend";
import { withRouter, Link } from "react-router-dom";
import Avatar from "../Avatar";
import AllCreatedTopicsBox from "./AllCreatedTopicsBox";
import i18next from "i18next";
import { Button, Card } from "antd";
import Container from "../components/container";

import "./member.css";
import "./icons.css";

class MemberBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      memberId: props.match.params.memberId,
      member: [],
      favoritesStatus: false,
      getFavoriteStatus: false,
      createdTopicsNum: 0,
    };
  }

  componentDidMount() {
    this.getMember();
    this.getFavoriteStatus();
    this.getCreatedTopicNum(this.state.memberId);
    this.getFavoriteNum();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location !== this.props.location) {
      this.setState(
        {
          memberId: newProps.match.params.memberId,
        },
        () => this.getMember()
      );
    }
  }

  getMember() {
    MemberBackend.getMember(this.state.memberId).then((res) => {
      this.setState({
        member: res.data,
      });
    });
  }

  getCreatedTopicNum(id) {
    TopicBackend.getCreatedTopicsNum(id).then((res) => {
      this.setState({
        createdTopicsNum: res,
      });
    });
  }

  getFavoriteNum() {
    if (
      this.props.account === undefined ||
      this.props.account === null ||
      this.state.getFavoriteStatus
    ) {
      return;
    }

    FavoritesBackend.getAccountFavoriteNum().then((res) => {
      if (res.status === "ok") {
        this.setState({
          topicFavoriteNum: res?.data[1],
          followingNum: res?.data[2],
          nodeFavoriteNum: res?.data[3],
          getFavoriteStatus: true,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  getFavoriteStatus() {
    FavoritesBackend.getFavoritesStatus(this.state.memberId, 2).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  addFavorite(memberId) {
    FavoritesBackend.addFavorites(memberId, 2).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
        this.getFavoriteStatus();
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  block(memberId) {}

  deleteFavorite(memberId) {
    FavoritesBackend.deleteFavorites(memberId, 2).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: !res.data,
        });
        this.getFavoriteStatus();
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  renderMember() {
    if (this.state.member !== null && this.state.member.length === 0) {
      return (
        <div align="center">
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                title={i18next.t("loading:Member profile is loading")}
                style={{
                  alignItems: "center",
                  flex: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <span className="gray bigger">
                  {i18next.t("loading:Please wait patiently...")}
                </span>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    if (this.state.member === null) {
      return (
        <div align="center">
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                title={i18next.t("error:Member does not exist")}
                style={{
                  alignItems: "center",
                  flex: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <div className="cell">
                  <span className="gray bigger">404 Member Not Found</span>
                </div>
                <div className="inner">
                  ← <Link to="/">{i18next.t("error:Back to Home Page")}</Link>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    const isSelf =
      this.props.account !== undefined &&
      this.props.account !== null &&
      this.state.memberId !== this.props.account?.name;

    return (
      <div className={`${this.props.BreakpointStage}-left`}>
        <div style={{ flex: "auto" }}>
          <Card>
            <div
              className="media"
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              <div className="avatar" style={{ marginRight: "15px" }}>
                <Avatar
                  username={this.state.member?.name}
                  size={Setting.PcBrowser ? "large" : "middle"}
                  avatar={this.state.member?.avatar}
                />
              </div>
              <div class="media-body" style={{ flex: "1" }}>
                <div
                  class="items name-box flex aic jcsb"
                  style={{
                    marginBottom: "5px",
                    textDecoration: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      class="fullname"
                      style={{
                        textAlign: "initial",
                        fontSize: "18px",
                        color: "#333",
                        fontWeight: "700",
                      }}
                    >
                      {this.state.member?.name}
                    </div>
                    <div style={{ color: "#999", textAlign: "initial" }}>
                      {i18next.t("member:No.")} {this.state.member?.ranking}{" "}
                      {i18next.t("member:member")}{" "}
                    </div>

                    <div class="items number" style={{ color: "#999" }}>
                      <span>
                        {Setting.getFormattedDate(
                          this.state.member?.createdTime
                        )}
                      </span>
                    </div>
                  </div>
                  {this.state.member.title != "" ? (
                    <div class="user-badge" style={{ textAlign: "right" }}>
                      <div class="level">
                        <span
                          class="badge-role role-member"
                          style={{
                            background: "#564cf5",
                            fontSize: "12px",
                            fontWeight: "400",
                            fontFamily: "sans-serif",
                            color: "#fff",
                            borderRadius: ".25rem",
                            padding: ".25em .4em",
                            lineHeight: "1",
                            display: "inline-block",
                          }}
                        >
                          {this.state.member?.title}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <hr style={{ borderTop: "1px solid #e5e5e5", margin: "15px 0" }} />
            <div class="user-items" style={{ textAlign: "justify" }}>
              {this.state.member.affiliation != "" ? (
                <div
                  class="items company"
                  style={{ color: "#333", marginBottom: "5px" }}
                >
                  <i class="icon fa fa-company"></i>
                  {this.state.member?.affiliation}
                </div>
              ) : null}
              {this.state.member.location != "" ? (
                <div
                  class="items location"
                  style={{ color: "#333", marginBottom: "5px" }}
                >
                  <i class="fas fa fa-map-marked"></i>
                  <a
                    href={`http://www.google.com/maps?q=${this.state.member?.location}`}
                    style={{ color: "#333" }}
                  >
                    {this.state.member?.location}
                  </a>
                </div>
              ) : null}
              <div class="items counts" style={{ color: "#999" }}>
                <span>{`${this.state.createdTopicsNum}`}</span> 篇帖子
              </div>
              <div
                class="items social"
                style={{ fontSize: "24px", marginBottom: "5px" }}
              >
                {this.renderIdp(this.state.member, "GitHub")}
                {this.renderIdp(this.state.member, "Google")}
                {this.renderIdp(this.state.member, "WeChat")}
                {this.renderIdp(this.state.member, "QQ")}
              </div>
              {!isSelf ? (
                <div
                  style={{
                    borderTop: "1px solid #f2f2f2",
                    textAlign: "center",
                    marginTop: "15px",
                    paddingTop: "15px",
                    display: "flex",
                  }}
                >
                  <div
                    class="col-sm-4 followers"
                    style={{ flex: "0 0 33.33%", maxWidth: "33.33%" }}
                  >
                    <a
                      class="counter"
                      href="/my/topics"
                      style={{ fontSize: "32px", color: "#404040" }}
                    >
                      {`${this.state.topicFavoriteNum}`}
                    </a>
                    <a
                      href="/my/topics"
                      style={{ color: "#999", display: "block" }}
                    >
                      {i18next.t("bar:Topics")}
                    </a>
                  </div>
                  <div
                    class="col-sm-4 following"
                    style={{ flex: "0 0 33.33%", maxWidth: "33.33%" }}
                  >
                    <a
                      class="counter"
                      href="/my/nodes"
                      style={{ fontSize: "32px", color: "#404040" }}
                    >
                      {`${this.state.nodeFavoriteNum}`}
                    </a>
                    <a
                      href="/my/nodes"
                      style={{ color: "#999", display: "block" }}
                    >
                      {i18next.t("bar:Nodes")}
                    </a>
                  </div>
                  <div
                    class="col-sm-4 stars"
                    style={{ flex: "0 0 33.33%", maxWidth: "33.33%" }}
                  >
                    <a
                      class="counter"
                      href="/my/following"
                      style={{ fontSize: "32px", color: "#404040" }}
                    >
                      {`${this.state.followingNum}`}
                    </a>
                    <a
                      href="/my/following"
                      style={{ color: "#999", display: "block" }}
                    >
                      {i18next.t("bar:Watch")}
                    </a>
                  </div>
                </div>
              ) : null}
              {isSelf ? (
                <div
                  class="buttons row"
                  style={{
                    display: "flex",
                    borderTop: "1px solid #f2f2f2",
                    marginTop: "15px",
                    paddingTop: "15px",
                  }}
                >
                  <div
                    style={{
                      flex: "0 0 50%",
                      maxWidth: "50%",
                      position: "relative",
                      textAlign: "center",
                      padding: "0 15px",
                    }}
                  >
                    {this.state.favoritesStatus ? (
                      <Button
                        type="primary"
                        danger
                        block={true}
                        size="large"
                        onClick={() =>
                          this.deleteFavorite(this.state.member?.name)
                        }
                      >
                        <i class="fa fa-user"></i>{" "}
                        <span>{i18next.t("member:Cancel Following")}</span>
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        block={true}
                        size="large"
                        onClick={() =>
                          this.addFavorite(this.state.member?.name)
                        }
                      >
                        <i class="fa fa-user"></i>{" "}
                        <span>{i18next.t("member:Watch")}</span>
                      </Button>
                    )}
                  </div>
                  <div
                    style={{
                      flex: "0 0 50%",
                      maxWidth: "50%",
                      position: "relative",
                      textAlign: "center",
                      padding: "0 15px",
                    }}
                  >
                    <Button
                      onClick={this.block(this.state.memberId)}
                      block={true}
                      size="large"
                    >
                      <i class="fa fa-eye-slash"></i>{" "}
                      <span>{i18next.t("member:Block")}</span>
                    </Button>
                  </div>
                </div>
              ) : null}
              <div
                style={{
                  color: "#999",
                  borderTop: "1px solid #f2f2f2",
                  marginTop: "10px",
                  padding: "10px 10px 0",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {this.state.member.bio}
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  getProviderLink(user, provider) {
    if (provider.type === "GitHub") {
      return `https://github.com/${this.getUserProperty(
        user,
        provider.type,
        "username"
      )}`;
    } else if (provider.type === "Google") {
      return "https://mail.google.com";
    } else {
      return "";
    }
  }

  getUserProperty(user, providerType, propertyName) {
    const key = `oauth_${providerType}_${propertyName}`;
    if (user.properties === null) return "";
    return user.properties[key];
  }

  renderIdp(user, providerType) {
    const lowerProviderName = providerType.toLowerCase();
    if (this.state.member[lowerProviderName].length === 0) {
      return null;
    }

    const provider = { type: providerType };

    const linkedValue = user[provider.type.toLowerCase()];
    const profileUrl = this.getProviderLink(user, provider);
    const id = this.getUserProperty(user, provider.type, "id");
    const username = this.getUserProperty(user, provider.type, "username");
    const displayName = this.getUserProperty(
      user,
      provider.type,
      "displayName"
    );
    const email = this.getUserProperty(user, provider.type, "email");
    let avatarUrl = this.getUserProperty(user, provider.type, "avatarUrl");

    if (avatarUrl === "" || avatarUrl === undefined) {
      avatarUrl = Setting.getProviderLogoLink(provider);
    }

    let name =
      username === undefined ? displayName : `${displayName} (${username})`;
    if (name === undefined) {
      if (id !== undefined) {
        name = id;
      } else if (email !== undefined) {
        name = email;
      } else {
        name = linkedValue;
      }
    }

    return (
      <a
        class={`${providerType}`}
        rel="nofollow noopener noreferrer"
        href={profileUrl}
        style={{ color: "#333" }}
      >
        <i class={`fab fa-${providerType}`}></i>{" "}
      </a>
    );
  }

  render() {
    console.log(this.state.member);
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div
            className={`${this.props.BreakpointStage}-container`}
            style={{ display: "flex" }}
          >
            {Setting.PcBrowser ? (
              <div className="sep20" />
            ) : (
              <div className="sep5" />
            )}
            {this.renderMember()}
            {Setting.PcBrowser ? (
              <div className="sep20" />
            ) : (
              <div className="sep5" />
            )}
            <AllCreatedTopicsBox
              BreakpointStage={this.props.BreakpointStage}
              member={this.state.member}
            />
            {Setting.PcBrowser ? (
              <div className="sep20" />
            ) : (
              <div className="sep5" />
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(MemberBox);
