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
import * as NodeBackend from "../backend/NodeBackend";
import { Route, withRouter, Link } from "react-router-dom";
import * as TopicBackend from "../backend/TopicBackend";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import PageColumn from "./PageColumn";
import TopicList from "./TopicList";
import NewNodeTopicBox from "./NewNodeTopicBox";
import "../node.css";
import ReactMarkdown from "react-markdown";
import i18next from "i18next";
import Container from "../components/container";
import { Button, Card, Alert } from "antd";

import "../TopicPage.css";
import TopicRightBox from "../rightbar/TopicRightBox";

class NodeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      nodeId: props.match.params.nodeId,
      event: props.match.params.event,
      topicNum: 1,
      topics: [],
      p: "",
      page: 1,
      limit: 20,
      minPage: 1,
      maxPage: -1,
      showPages: [],
      favoritesNum: 0,
      favoritesStatus: true,
      nodeInfo: [],
      newModerator: "",
      url: "",
      message: "",
    };
    const params = new URLSearchParams(this.props.location.search);
    this.state.p = params.get("p");
    if (this.state.p === null) {
      this.state.page = 1;
    } else {
      this.state.page = parseInt(this.state.p);
    }

    this.state.url = `/go/${this.state.nodeId}`;
  }

  componentDidMount() {
    this.getTopics();
    this.getNodeInfo();
    //this.props.getNodeId(this.state.nodeId);
    NodeBackend.addNodeBrowseCount(this.state.nodeId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location !== this.props.location) {
      let params = new URLSearchParams(newProps.location.search);
      let page = params.get("p");
      if (page === null) {
        page = 1;
      }
      this.setState(
        {
          page: parseInt(page),
        },
        () => this.getTopics()
      );
    }
  }

  componentWillUnmount() {
    this.props.getNodeBackground("", "", "", "");
  }

  getNodeInfo() {
    NodeBackend.getNode(this.state.nodeId).then((res) => {
      this.setState(
        {
          nodeInfo: res,
        },
        () => {
          this.props.getNodeBackground(
            this.state.nodeId,
            this.state.nodeInfo?.backgroundImage,
            this.state.nodeInfo?.backgroundColor,
            this.state.nodeInfo?.backgroundRepeat
          );
        }
      );
    });
    NodeBackend.getNodeInfo(this.state.nodeId).then((res) => {
      if (res.status === "ok") {
        this.setState({
          topicNum: res?.data,
          favoritesNum: res?.data2,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });

    if (this.state.event !== undefined) {
      return;
    }

    FavoritesBackend.getFavoritesStatus(this.state.nodeId, 3).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  getNodeFavoriteStatus() {
    FavoritesBackend.getFavoritesStatus(this.state.nodeId, 3).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  getTopics() {
    if (this.state.event !== undefined) {
      return;
    }

    TopicBackend.getTopicsWithNode(
      this.state.nodeId,
      this.state.limit,
      this.state.page
    ).then((res) => {
      this.setState({
        topics: res,
      });
    });
  }

  addFavorite() {
    FavoritesBackend.addFavorites(this.state.nodeId, 3).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
        this.getNodeFavoriteStatus();
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  deleteFavorite() {
    FavoritesBackend.deleteFavorites(this.state.nodeId, 3).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: !res.data,
        });
        this.getNodeFavoriteStatus();
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  addNodeModerator(moderator) {
    NodeBackend.addNodeModerators({
      nodeId: this.state.nodeInfo?.id,
      memberId: moderator,
    }).then((res) => {
      if (res?.status === "ok") {
        this.setState({
          message: i18next.t("node:Add moderator success"),
        });
        this.getNodeInfo();
      } else {
        this.setState({
          message: res?.msg,
        });
      }
    });
  }

  deleteNodeModerator(moderator) {
    NodeBackend.deleteNodeModerators({
      nodeId: this.state.nodeInfo?.id,
      memberId: moderator,
    }).then((res) => {
      if (res?.status === "ok") {
        this.setState({
          message: i18next.t("node:Delete moderator success"),
        });
        this.getNodeInfo();
      } else {
        this.setState({
          message: res?.msg,
        });
      }
    });
  }

  inputNewModerator(value) {
    this.setState({
      newModerator: value,
    });
  }

  showPageColumn() {
    if (this.state.topicNum < this.state.limit) {
      return null;
    }

    return (
      <PageColumn
        page={this.state.page}
        total={this.state.topicNum}
        url={this.state.url}
        nodeId={this.state.nodeId}
      />
    );
  }

  clearMessage() {
    this.setState({
      message: "",
    });
  }

  renderMessage() {
    if (this.state.message === "") {
      return null;
    }

    return (
      <Alert
        style={{ textAlign: "left" }}
        message={i18next.t(`error:${this.state.message}`)}
        type="info"
        showIcon
        closable
        onClick={() => this.clearMessage()}
      />
    );
  }

  renderDesktopHeader() {
    const { nodeInfo, nodeId } = this.state;

    return (
      <div
        style={
          Setting.PcBrowser
            ? {
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                padding: "15px 20px",
              }
            : {
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "white",
                padding: "10px 15px",
              }
        }
      >
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div className="info">
              <div className="title">
                <span style={{ fontSize: "30px", marginBottom: "8px" }}>
                  {this.state.nodeInfo?.name}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    marginLeft: "12px",
                    color: "#666",
                  }}
                >
                  {i18next.t("node:Total topics")} {this.state.topicNum}
                </span>
              </div>
              <div className="disc" style={{ textAlign: "left" }}>
                {nodeInfo?.desc ? (
                  <ReactMarkdown
                    renderers={{
                      image: Setting.renderImage,
                      link: Setting.renderLink,
                    }}
                    source={nodeInfo?.desc}
                    escapeHtml={false}
                  />
                ) : (
                  <div>{"..."}</div>
                )}
              </div>
            </div>
            <span style={{ display: "flex", alignItems: "center" }}>
              {this.state.favoritesStatus ? (
                <Button
                  size={Setting.PcBrowser ? "middle" : "small"}
                  onClick={() => {
                    this.deleteFavorite();
                  }}
                  href="#"
                >
                  {i18next.t("fav:Cancel favorite")}
                </Button>
              ) : (
                <Button
                  size={Setting.PcBrowser ? "middle" : "small"}
                  onClick={() => {
                    this.addFavorite();
                  }}
                  href="javascript:void(0);"
                >
                  {i18next.t("fav:Add to favorite")}
                </Button>
              )}
            </span>
          </div>
        </Container>
      </div>
    );
  }

  renderNode() {
    const { page, limit } = this.state;
    let from, end;
    if (this.state.topicNum !== 0) {
      from = (page - 1) * limit + 1;
    } else {
      from = 0;
    }
    end = (page - 1) * limit + this.state.topics.length;

    return (
      <div style={{ width: "100%" }}>
        {Setting.PcBrowser ? this.showPageColumn() : null}
        <TopicList
          nodeId={this.state.nodeId}
          topics={this.state.topics}
          showNodeName={false}
          showAvatar={true}
          topType={"node"}
        />
        {this.showPageColumn()}
        <div className="cell" align="center">
          <div className="fr">{`${this.state.favoritesNum} ${i18next.t(
            "node:members have added this node to favorites"
          )}`}</div>
          <span className="gray">{`${i18next.t(
            "node:Topic"
          )} ${from} ${i18next.t("node:to")} ${end} ${i18next.t(
            "node:of all"
          )} ${this.state.topicNum} ${i18next.t("node:topics")}`}</span>
        </div>
      </div>
    );
  }

  renderNodeModerators(moderators) {
    return (
      <tr>
        <td width="120" align="right"></td>
        <td width="auto" align="left">
          <Link
            to={`/member/${moderators}`}
            style={{ fontWeight: "bolder" }}
            target="_blank"
          >
            {moderators}
          </Link>
        </td>
        <td width="auto" align="left">
          <a
            onClick={() => {
              this.deleteNodeModerator(moderators);
            }}
            href="javascript:void(0);"
          >
            {i18next.t("node:Cancel moderator permissions")}
          </a>
        </td>
      </tr>
    );
  }

  render() {
    const pcBrowser = Setting.PcBrowser;

    if (this.state.nodeInfo !== null && this.state.nodeInfo.length === 0) {
      return (
        <div align="center">
          {Setting.PcBrowser ? <div className="sep20" /> : null}
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                style={{
                  flex: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <div className="title" style={{ marginBottom: "25px" }}>
                  <span style={{ fontSize: "18px" }}>
                    {i18next.t("loading:Node is loading")}&nbsp;
                  </span>
                </div>
                <div className="cell">
                  <span className="gray bigger">
                    {i18next.t("loading:Please wait patiently...")}
                  </span>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    if (this.state.nodeInfo === null) {
      return (
        <div align="center">
          {Setting.PcBrowser ? <div className="sep20" /> : null}
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                style={{
                  flex: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <div className="title" style={{ marginBottom: "25px" }}>
                  <span style={{ fontSize: "18px" }}>
                    {i18next.t("error:Node not found")}&nbsp;
                  </span>
                </div>

                <div class="cell">
                  {i18next.t(
                    "error:The node you are trying to view does not exist, there are several possibilities"
                  )}
                  <div class="sep10"></div>
                  <ul>
                    <li>
                      {i18next.t(
                        "error:You entered a node ID that does not exist."
                      )}
                    </li>
                    <li>
                      {i18next.t(
                        "error:The node is currently in invisible state."
                      )}
                    </li>
                  </ul>
                </div>
                <div class="inner">
                  {this.props.account === null ? (
                    <span className="gray">
                      <span className="chevron">‹</span> &nbsp;
                      {i18next.t("error:Back to")}{" "}
                      <Link to="/">{i18next.t("error:Home Page")}</Link>
                    </span>
                  ) : (
                    <span className="gray">
                      <span className="chevron">‹</span> &nbsp;
                      {i18next.t("error:Back to")}{" "}
                      <Link to="/">{i18next.t("error:Home Page")}</Link>
                      <br />
                      <span className="chevron">‹</span> &nbsp;
                      {i18next.t("error:Back to")}{" "}
                      <Link to={`/member/${this.props.account?.name}`}>
                        {i18next.t("error:My profile")}
                      </Link>
                    </span>
                  )}
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    if (this.state.event === "moderators") {
      if (this.props.account === undefined) {
        return null;
      }
      if (this.props.account === null || !this.props.account?.isAdmin) {
        this.props.history.push(Setting.getSigninUrl());
      }

      return (
        <div align="center">
          {Setting.PcBrowser ? <div className="sep20" /> : null}
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                style={{
                  flex: "auto",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "left",
                }}
              >
                <div className="title" style={{ marginBottom: "25px" }}>
                  <span style={{ fontSize: "18px" }}>
                    {i18next.t("node:Moderator Management")}&nbsp;
                  </span>
                </div>
                {this.renderMessage()}
                <div className="cell">
                  <table
                    cellPadding="5"
                    cellSpacing="0"
                    border="0"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td width="120" align="right">
                          {i18next.t("node:Node name")}
                        </td>
                        <td width="auto" align="left">
                          {this.state.nodeInfo?.name}
                        </td>
                      </tr>
                      {this.state.nodeInfo?.moderators !== null &&
                      this.state.nodeInfo?.moderators.length !== 0 ? (
                        <tr>
                          <td width="120" align="right">
                            {i18next.t("node:Moderators")}
                          </td>
                          <td width="auto" align="left">
                            <Link
                              to={`/member/${this.state.nodeInfo?.moderators[0]}`}
                              style={{ fontWeight: "bolder" }}
                              target="_blank"
                            >
                              {this.state.nodeInfo?.moderators[0]}
                            </Link>
                          </td>
                          <td width="auto" align="left">
                            <a
                              onClick={() => {
                                this.deleteNodeModerator(
                                  this.state.nodeInfo?.moderators[0]
                                );
                              }}
                              href="javascript:void(0);"
                            >
                              {i18next.t("node:Cancel moderator permissions")}
                            </a>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td width="120" align="right">
                            {i18next.t("node:Moderators")}
                          </td>
                          <td width="auto" align="left">
                            <span class="gray">
                              {i18next.t("node:No moderators")}
                            </span>
                          </td>
                        </tr>
                      )}
                      {this.state.nodeInfo?.moderators !== null
                        ? this.state.nodeInfo?.moderators
                            .slice(1)
                            .map((moderators) =>
                              this.renderNodeModerators(moderators)
                            )
                        : null}
                    </tbody>
                  </table>
                </div>
                <div className="cell">
                  <table
                    cellPadding="5"
                    cellSpacing="0"
                    border="0"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td width="120" align="right">
                          {i18next.t("node:Add moderator")}
                        </td>
                        <td width="auto" align="left">
                          <input
                            type="text"
                            className="sl"
                            name="title"
                            maxLength="64"
                            value={this.state.newModerator}
                            onChange={(event) =>
                              this.inputNewModerator(event.target.value)
                            }
                          />
                        </td>
                      </tr>
                      <tr>
                        <td width="120" align="right"></td>
                        <td width="auto" align="left">
                          <Button
                            type="primary"
                            onClick={() =>
                              this.addNodeModerator(this.state.newModerator)
                            }
                          >
                            {i18next.t("node:Add")}
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    return (
      <React.Fragment>
        {this.renderDesktopHeader()}
        {Setting.PcBrowser ? <div className="sep20" /> : null}
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div
            style={{ display: "flex" }}
            className={`${this.props.BreakpointStage}-container`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
              }}
              className={`${this.props.BreakpointStage}-topic`}
            >
              {this.renderNode()}
              {pcBrowser ? <div className="sep20" /> : null}
            </div>
            <div className={`${this.props.BreakpointStage}-rightBox`}>
              <TopicRightBox />
            </div>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(NodeBox);
