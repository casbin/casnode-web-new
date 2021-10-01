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
import * as TopicBackend from "../backend/TopicBackend";
import * as NodeBackend from "../backend/NodeBackend";
import { withRouter } from "react-router-dom";
import Avatar from "../Avatar";
import ReplyBox from "./ReplyBox";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import * as BalanceBackend from "../backend/BalanceBackend";
import * as TranslatorBackend from "../backend/TranslatorBackend";
import "../node.css";
import Zmage from "react-zmage";
import { Link } from "react-router-dom";
import "codemirror/lib/codemirror.css";
import Container from "../components/container";
import { Card, Button } from "antd";
import i18next from "i18next";
import "./TopicBox.css";

require("codemirror/mode/markdown/markdown");

const ReactMarkdown = require("react-markdown");
const pangu = require("pangu");
const ButtonGroup = Button.Group;
class TopicBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      topicId: props.match.params.topicId,
      event: props.match.params.event,
      topic: [],
      topicThanksCost: 15,
      favoritesStatus: false,
      defaultTopTopicTime: 10,
      from: "/",
      showTranslateBtn: false,
      translation: {
        translated: false,
        from: "",
        content: "",
      },
    };

    const params = new URLSearchParams(this.props.location.search);
    this.state.from = params.get("from");
    if (this.state.from === null) {
      this.state.from = "/";
    } else {
      this.state.from = decodeURIComponent(this.state.from);
    }
  }

  componentDidMount() {
    this.getTopic();
    this.getFavoriteStatus();
    TopicBackend.addTopicBrowseCount(this.state.topicId);
    this.renderTranslateButton();
  }

  componentWillUnmount() {
    this.props.getNodeBackground("", "", "", "");
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location !== this.props.location) {
      if (this.judgeAnchorElement()) {
        return;
      }
      this.setState(
        {
          topicId: newProps.match.params.topicId,
          event: newProps.match.params.event,
        },
        () => this.getTopic()
      );
    }
  }

  judgeAnchorElement() {
    let url = window.location.href;
    let id = url.substring(url.lastIndexOf("#") + 1);
    let anchorElement = document.getElementById(id);
    return !!anchorElement;
  }

  getTopic(event) {
    TopicBackend.getTopic(this.state.topicId).then((res) => {
      this.setState(
        {
          topic: res,
        },
        () => {
          if (event === "refresh") {
            return;
          }

          this.getNodeInfo();
          //this.props.getNodeId(this.state.topic?.nodeId);
          NodeBackend.addNodeBrowseCount(this.state.topic?.nodeId);
        }
      );
    });
  }

  getNodeInfo() {
    NodeBackend.getNode(this.state.topic?.nodeId).then((res) => {
      this.props.getNodeBackground(
        this.state.nodeId,
        res?.backgroundImage,
        res?.backgroundColor,
        res?.backgroundRepeat
      );
    });
  }

  getFavoriteStatus() {
    if (this.state.event === "review" || this.props.account === null) {
      return;
    }

    FavoritesBackend.getFavoritesStatus(this.state.topicId, 1).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  renderOutdatedProblem() {
    const diffDays = Setting.getDiffDays(this.state.topic?.createdTime);

    if (diffDays <= 30) {
      return null;
    }

    return (
      <div
        style={{
          fontSize: "16px",
          marginTop: "25px",
          border: "0",
          padding: "15px 25px",
          textAlign: "left",
          backgroundColor: "#fff8ef",
          color: "#eb5424",
        }}
      >
        <i style={{ marginRight: "10px" }} class="fas fa-info-circle"></i>
        {i18next.t("topic:This is a topic created")} {diffDays}{" "}
        {i18next.t("topic:days ago, the information in it may have changed.")}
      </div>
    );
  }

  addFavorite() {
    FavoritesBackend.addFavorites(this.state.topicId, 1).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: res.data,
        });
        this.getTopic("refresh");
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  deleteFavorite() {
    FavoritesBackend.deleteFavorites(this.state.topicId, 1).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favoritesStatus: !res.data,
        });
        this.getTopic("refresh");
        this.props.refreshFavorites();
      } else {
        Setting.showMessage("error", res.msg);
      }
    });
  }

  ignoreTopic() {}

  translateTopic() {
    //https://html.spec.whatwg.org/multipage/system-state.html#language-preferences
    //Use navigator.languages to get an array of language tags representing the user's preferred languages

    if (!this.state.translation.translated) {
      TopicBackend.translateTopic(this.state.topicId, navigator.language).then(
        (res) => {
          this.setState((prevState) => {
            prevState.translation.content = res.target;
            prevState.translation.from = res.srcLang;
            prevState.translation.translated = true;
            return prevState;
          });
        }
      );
    } else {
      this.setState({
        translation: {
          translated: false,
        },
      });
    }
  }

  deleteTopic() {
    if (window.confirm(`Are you sure to delete this topic?`)) {
      TopicBackend.deleteTopic(this.state.topicId).then((res) => {
        if (res) {
          this.props.history.push(this.state.from);
        }
      });
    }
  }

  thanksTopic(id, author) {
    if (
      window.confirm(
        `Are you sure to spend ${this.state.topicThanksCost} coins in thanking @${author} for this topic?`
      )
    ) {
      BalanceBackend.addThanks(id, 1).then((res) => {
        if (res?.status === "ok") {
          this.getTopic("refresh");
        } else {
          alert(res?.msg);
        }
      });
    }
  }

  downVoteTopic() {}

  topTopic(topType) {
    if (this.props.account?.isAdmin || this.state.topic?.nodeModerator) {
      //let time = prompt(i18next.t("topic:How long do you want to top this topic? (minute)"), this.state.defaultTopTopicTime)
      if (
        window.confirm(`${i18next.t("topic:Are you sure to top this topic?")}`)
      ) {
        TopicBackend.topTopic(this.state.topic?.id, "", topType).then((res) => {
          if (res?.status === "ok") {
            this.getTopic("refresh");
          } else {
            alert(i18next.t(`error:${res?.msg}`));
          }
        });
        return;
      }
      return;
    }

    if (this.state.topic?.topExpiredTime !== "") {
      alert(i18next.t("topic:This topic has been topped"));
      return;
    }

    if (
      window.confirm(
        `${i18next.t("topic:Are you sure you want to pin this topic for")} ${
          this.state.defaultTopTopicTime
        } ${i18next.t(
          "topic:minutes? The operation price is 200 copper coins."
        )}`
      )
    ) {
      TopicBackend.topTopic(this.state.topic?.id, 10, topType).then((res) => {
        if (res?.status === "ok") {
          this.props.history.push("/");
        } else {
          alert(i18next.t(`error:${res?.msg}`));
        }
      });
    }
  }

  upVoteTopic() {}

  openShare() {}

  cancelTopTopic(topType) {
    if (this.props.account?.isAdmin || this.state.topic?.nodeModerator) {
      if (
        window.confirm(
          `${i18next.t("topic:Are you sure to cancel top this topic?")}`
        )
      ) {
        TopicBackend.cancelTopTopic(this.state.topic?.id, topType).then(
          (res) => {
            if (res?.status === "ok") {
              this.getTopic("refresh");
            } else {
              alert(i18next.t(`error:${res?.msg}`));
            }
          }
        );
      }
    }
  }

  renderTopTopic() {
    return (
      <div className="box">
        <div className="inner">
          <div className="fr">
            &nbsp;{" "}
            <a href="#;" onClick={() => {}}>
              {i18next.t("topic:Sink")} ↓
            </a>
            &nbsp;{" "}
            {this.props.account?.isAdmin ? (
              <a href="#;" onClick={() => this.topTopic()}>
                {i18next.t("topic:Top this topic")}
              </a>
            ) : (
              <a href="#;" onClick={() => this.topTopic()}>
                {i18next.t("topic:Top")} {this.state.defaultTopTopicTime}{" "}
                {i18next.t("topic:minutes")}
              </a>
            )}
          </div>
          &nbsp;
        </div>
      </div>
    );
  }

  renderImage = ({ alt, src }) => {
    return <Zmage src={src} alt={alt} />;
  };

  renderLink = (props) => {
    let check = Setting.checkPageLink(props.href);
    if (check) {
      return <a {...props} />;
    }
    return <a {...props} target="_blank" rel="nofollow noopener noreferrer" />;
  };

  renderMobileButtons() {
    return (
      <div className="social-share-button" style={{ height: "16px" }}>
        <a
          rel="nofollow "
          data-site="twitter"
          onClick="window.open('https://twitter.com/share?url=https://www.example.com/t/123456?r=username&amp;related=casbinforum&amp;hashtags=inc&amp;text=title', '_blank', 'width=550,height=370'); recordOutboundLink(this, 'Share', 'twitter.com');"
          href="#"
        >
          {" "}
          <i class="fab fa-twitter-square"></i>
        </a>
        <a
          rel="nofollow "
          data-site="weibo"
          onclick="shareTopic(``);"
          title="分享到 新浪微博"
          href="#"
        >
          <i class="fab fa-weibo"></i>
        </a>
      </div>
    );
  }

  renderTranslateButton() {
    TranslatorBackend.visibleTranslator().then((res) => {
      let translateBtn = false;
      if (res?.data) {
        translateBtn = true;
      }
      this.setState({
        showTranslateBtn: translateBtn,
      });
    });
  }

  renderDesktopButtons() {
    return (
      <div className="social-share-button" style={{ height: "16px" }}>
        <a
          rel="nofollow "
          data-site="twitter"
          class="ssb-icon ssb-twitter"
          onClick={() => this.openShare()}
          title="分享到 Twitter"
          href="#"
        >
          <i class="fab fa-twitter-square"></i>
        </a>
        <a
          rel="nofollow "
          data-site="weibo"
          class="ssb-icon ssb-weibo"
          onClick={() => this.openShare()}
          title="分享到 新浪微博"
          href="#"
        >
          <i class="fab fa-weibo"></i>
        </a>
      </div>
    );
  }

  renderRightBox() {
    const pcBrowser = Setting.PcBrowser;
    return (
      <div style={{ flex: "0 0 25%", maxWidth: "25%", marginLeft: "20px" }}>
        <div style={{ position: "fixed", width: "272px" }}>
          <Card class="card">
            <div class="buttons">
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#666",
                }}
              >
                {this.props.account !== undefined &&
                this.props.account !== null ? (
                  this.state.favoritesStatus ? (
                    <a
                      title="赞"
                      style={{
                        textDecoration: "none",
                        color: "#eb5424",
                        display: "block",
                        width: "90px",
                        margin: "0 auto",
                        borderRadius: "5px",
                        padding: "10px 0",
                      }}
                      class="likeable"
                      href="#"
                      onClick={() => {
                        this.deleteFavorite();
                      }}
                    >
                      <i class="icon fa fa-bookmark"></i>
                      <span style={{ display: "block", color: "#666" }}>
                        {this.state.topic.favoriteCount}
                      </span>
                    </a>
                  ) : (
                    <a
                      title="赞"
                      style={{
                        textDecoration: "none",
                        color: "#404040",
                        display: "block",
                        width: "90px",
                        margin: "0 auto",
                        borderRadius: "5px",
                        padding: "10px 0",
                      }}
                      class="likeable"
                      href="#"
                      onClick={() => {
                        this.addFavorite();
                      }}
                    >
                      <i class="icon fa fa-bookmark"></i>
                    </a>
                  )
                ) : null}
              </div>
              <div
                class="group"
                style={{ marginBottom: "0", textAlign: "center" }}
              >
                <ButtonGroup shape="round">
                  {this.props.account !== undefined &&
                  this.props.account !== null &&
                  this.props.account?.name !== this.state.topic?.author ? (
                    this.state.topic?.thanksStatus === false ? (
                      <Button
                        shape="round"
                        onClick={() =>
                          this.thanksTopic(
                            this.state.topic?.id,
                            this.state.topic?.author
                          )
                        }
                      >
                        <i
                          class="fa fa-heart"
                          style={{ marginRight: "5px" }}
                        ></i>{" "}
                        {i18next.t("topic:Thank")}
                      </Button>
                    ) : (
                      <Button shape="round">
                        <i
                          class="fa fa-heart"
                          style={{ color: "#eb5424", marginRight: "5px" }}
                        ></i>{" "}
                        {i18next.t("topic:Thanked")}
                      </Button>
                    )
                  ) : null}
                  {pcBrowser ? (
                    <Button onClick={() => this.ignoreTopic()}>
                      <i
                        class="fa fa-bell-slash"
                        style={{ marginRight: "5px" }}
                      ></i>{" "}
                      {i18next.t("topic:Ignore")}
                    </Button>
                  ) : (
                    <Button onClick="if (confirm('Are you sure to ignore this topic?')) { location.href = '/ignore/topic/123456?once=39724'; }">
                      <i
                        class="fa fa-bell-slash"
                        style={{ marginRight: "5px" }}
                      ></i>{" "}
                      {i18next.t("topic:Ignore")}
                    </Button>
                  )}
                </ButtonGroup>
              </div>
            </div>
            <hr />
            <div
              class="group"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              {Setting.PcBrowser
                ? this.renderDesktopButtons()
                : this.renderMobileButtons()}
            </div>
            <hr />
            <div class="reply-buttons">
              <div class="total" style={{ marginBottom: "10px" }}>
                共收到 <b>{this.state.topic.replyCount}</b> 条回复
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  renderContent() {
    console.log(this.state.topic);
    const pcBrowser = Setting.PcBrowser;
    return (
      <div
        style={{
          flex: "0 0 75%",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            marginBottom: "15px",
            border: "1px solid,hsla(210,8%,51%,.09)",
            background: "#fff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            borderRadius: ".25rem",
          }}
        >
          <div
            style={{
              padding: "25px 25px 0",
              fontSize: "18px",
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: "1" }}>
              <h1
                style={{
                  fontSize: "22px",
                  color: "#404040",
                  textAlign: "left",
                  lineHeight: "150%",
                  marginBottom: "8px",
                }}
              >
                <a
                  style={{ color: "#666", marginRight: "3px" }}
                  href={`/go/${encodeURIComponent(this.state.topic?.nodeId)}`}
                >
                  {this.state.topic?.nodeName}
                </a>
                <span style={{ lineHeight: "150%", fontSize: "22px" }}>
                  {this.state.topic?.title}
                </span>
              </h1>
              <div className={`header ${this.state.topic.nodeId}`}>
                {Setting.PcBrowser ? (
                  <span>
                    <div id="topic_677954_votes" className="votes">
                      <a
                        href="#;"
                        onClick={this.upVoteTopic()}
                        className={`vote ${this.state.topic.nodeId}`}
                      >
                        <li className="fa fa-chevron-up" />
                      </a>{" "}
                      &nbsp;
                      <a
                        href="#;"
                        onClick={this.downVoteTopic()}
                        className={`vote ${this.state.topic.nodeId}`}
                      >
                        <li className="fa fa-chevron-down" />
                      </a>
                    </div>
                    &nbsp;{" "}
                  </span>
                ) : null}
                <small className="gray">
                  <Link
                    to={`/member/${this.state.topic?.author}`}
                    className={`${this.state.topic.nodeId}`}
                  >
                    {this.state.topic?.author}
                  </Link>{" "}
                  · {Setting.getPrettyDate(this.state.topic?.createdTime)} ·{" "}
                  {this.state.topic?.hitCount} {i18next.t("topic:hits")}
                  &nbsp;{" "}
                  {this.props.account?.isAdmin ? (
                    <span>
                      {this.state.topic?.homePageTopTime === "" ? (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.topTopic("homePage")}
                            className="op"
                          >
                            {i18next.t("topic:HomePageTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      ) : (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.cancelTopTopic("homePage")}
                            className="op"
                          >
                            {i18next.t("topic:CancelHomePageTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      )}
                      {this.state.topic?.tabTopTime === "" ? (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.topTopic("tab")}
                            className="op"
                          >
                            {i18next.t("topic:TabTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      ) : (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.cancelTopTopic("tab")}
                            className="op"
                          >
                            {i18next.t("topic:CancelTabTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      )}
                      {this.state.topic?.nodeTopTime === "" ? (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.topTopic("node")}
                            className="op"
                          >
                            {i18next.t("topic:NodeTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      ) : (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.cancelTopTopic("node")}
                            className="op"
                          >
                            {i18next.t("topic:CancelNodeTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      )}
                    </span>
                  ) : this.state.topic?.nodeModerator ? (
                    <span>
                      {this.state.topic?.nodeTopTime === "" ? (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.topTopic("node")}
                            className="op"
                          >
                            {i18next.t("topic:NodeTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      ) : (
                        <span>
                          <a
                            href="#;"
                            onClick={() => this.cancelTopTopic("node")}
                            className="op"
                          >
                            {i18next.t("topic:CancelNodeTop")}
                          </a>
                          &nbsp;{" "}
                        </span>
                      )}
                    </span>
                  ) : null}
                  {this.state.topic?.editable ? (
                    <span>
                      <Link
                        to={`/edit/topic/${this.state.topic?.id}`}
                        className="op"
                      >
                        {i18next.t("topic:EDIT")}
                      </Link>
                      &nbsp;{" "}
                      <Link
                        to={`/move/topic/${this.state.topic?.id}`}
                        className="op"
                      >
                        {i18next.t("topic:MOVE")}
                      </Link>
                      &nbsp;{" "}
                      {this.props.account?.isAdmin ||
                      this.state.topic?.nodeModerator ? (
                        <Link
                          onClick={() => this.deleteTopic()}
                          to="#;"
                          className="op"
                        >
                          {i18next.t("topic:DELETE")}
                        </Link>
                      ) : null}
                    </span>
                  ) : null}
                </small>
              </div>
            </div>
            <div style={{ float: "right" }}>
              <Avatar
                username={this.state.topic?.author}
                size={pcBrowser ? "large" : "middle"}
                avatar={this.state.topic?.avatar}
              />
            </div>
          </div>
          {this.renderOutdatedProblem()}
          <Card>
            <div className="content">
              <div className={`topic_content ${this.state.topic.nodeId}`}>
                <div className="markdown_body">
                  <ReactMarkdown
                    renderers={{
                      image: this.renderImage,
                      link: this.renderLink,
                    }}
                    source={Setting.getFormattedContent(
                      this.state.topic?.content,
                      true
                    )}
                    escapeHtml={false}
                  />
                  {this.state.showTranslateBtn ? (
                    <a href="#;" onClick={() => this.translateTopic()}>
                      <p style={{ margin: 15 }}>
                        {this.state.translation.translated ? (
                          <span>
                            {`Translate from ${this.state.translation.from} by  `}
                            <img
                              height={18}
                              src="https://cdn.casbin.org/img/logo_google.svg"
                            ></img>
                          </span>
                        ) : (
                          <span>Translate</span>
                        )}
                      </p>
                    </a>
                  ) : (
                    ""
                  )}
                  {this.state.translation.translated ? (
                    <ReactMarkdown
                      renderers={{
                        image: this.renderImage,
                        link: this.renderLink,
                      }}
                      source={Setting.getFormattedContent(
                        this.state.translation.content,
                        true
                      )}
                      escapeHtml={false}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </Card>
          <div
            style={{ fontSize: "16px", padding: "0 25px 25px", border: "0" }}
          >
            <div style={{ color: "#666", textAlign: "left" }}>
              {this.props.account !== undefined &&
              this.props.account !== null &&
              this.props.account?.name !== this.state.topic?.author ? (
                this.state.topic?.thanksStatus === false ? (
                  <a
                    className="bottom-opt"
                    href="#"
                    onClick={() =>
                      this.thanksTopic(
                        this.state.topic?.id,
                        this.state.topic?.author
                      )
                    }
                  >
                    <i
                      style={{ display: "inline-block" }}
                      class="icon fa fa-heart"
                    ></i>{" "}
                    <span>{i18next.t("topic:Thank")}</span>
                  </a>
                ) : (
                  <a className="bottom-opt" href="#">
                    <i
                      style={{ display: "inline-block", color: "#eb5424" }}
                      class="icon fa fa-heart"
                    ></i>{" "}
                    <span>{i18next.t("topic:Thanked")}</span>
                  </a>
                )
              ) : null}
              {pcBrowser ? (
                <a
                  className="bottom-opt"
                  href="#"
                  onClick={() => this.ignoreTopic()}
                >
                  <i
                    class="fa fa-bell-slash"
                    style={{ marginRight: "5px" }}
                  ></i>
                  {i18next.t("topic:Ignore")}
                </a>
              ) : (
                <a
                  className="bottom-opt"
                  href="#"
                  onClick="if (confirm('Are you sure to ignore this topic?')) { location.href = '/ignore/topic/123456?once=39724'; }"
                >
                  <i
                    class="fa fa-bell-slash"
                    style={{ marginRight: "5px" }}
                  ></i>
                  {i18next.t("topic:Ignore")}
                </a>
              )}
              {this.props.account !== undefined &&
              this.props.account !== null ? (
                this.state.favoritesStatus ? (
                  <a
                    title={i18next.t("topic:Cancel Favor")}
                    class="bottom-opt"
                    href="#"
                    onClick={() => {
                      this.deleteFavorite();
                    }}
                  >
                    <i
                      class="icon fa fa-bookmark"
                      style={{
                        color: "#eb5424",
                        display: "inline-block",
                        marginRight: "5px",
                      }}
                    ></i>
                    {i18next.t("topic:Cancel Favor")}
                  </a>
                ) : (
                  <a
                    title={i18next.t("topic:Favor")}
                    class="bottom-opt"
                    href="#"
                    onClick={() => {
                      this.addFavorite();
                    }}
                  >
                    <i
                      class="icon fa fa-bookmark"
                      style={{ display: "inline-block", marginRight: "5px" }}
                    ></i>
                    {i18next.t("topic:Favor")}
                  </a>
                )
              ) : null}
            </div>
          </div>
        </div>

        <ReplyBox
          account={this.props.account}
          topic={this.state.topic}
          isEmbedded={false}
        />
      </div>
    );
  }

  render() {
    if (
      this.props.account === undefined ||
      (this.state.topic !== null && this.state.topic.length === 0)
    ) {
      return (
        <div align="center">
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card
                title={i18next.t("loading:Topic is loading")}
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

    if (this.state.topic === null) {
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
                    {Setting.getHomeLink()}{" "}
                    <span class="chevron">&nbsp;›&nbsp;</span>{" "}
                    {i18next.t("error:Topic not found")}
                  </span>
                </div>
                <div class="box">
                  <div class="cell">
                    <span class="gray bigger">404 Topic Not Found</span>
                  </div>
                  <div class="inner">
                    ←{" "}
                    {Setting.getHomeLink(i18next.t("error:Back to Home Page"))}
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    if (this.state.event === "review") {
      if (
        this.props.account === null ||
        this.props.account?.name !== this.state.topic?.author
      ) {
        this.props.history.push(`/t/${this.state.topic?.id}`);
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
                    <Link to={`/t/${this.state.topic?.id}`}>
                      {pangu.spacing(this.state.topic?.title)}
                    </Link>{" "}
                    <span class="chevron">&nbsp;›&nbsp;</span> Review
                  </span>
                </div>
                <div class="box">
                  <div class="cell topic_content markdown_body">
                    <p>
                      {i18next.t(
                        "topic:The new topic has been successfully created on the"
                      )}{" "}
                      <Link
                        to={`/go/${encodeURIComponent(
                          this.state.topic?.nodeId
                        )}`}
                      >
                        {this.state.topic?.nodeName}
                      </Link>{" "}
                      {i18next.t(
                        "topic:node, you can click on the title below to continue to view"
                      )}
                    </p>
                    <h1>
                      <Link to={`/t/${this.state.topic?.id}`}>
                        {pangu.spacing(this.state.topic?.title)}
                      </Link>
                    </h1>
                    <p>
                      {i18next.t(
                        "topic:Following are some guides to help you better use the topic management related functions of the"
                      )}{" "}
                      {Setting.getForumName()} {i18next.t("topic:community")}
                    </p>
                    <ul>
                      <li>
                        {i18next.t("topic:The topic is currently at")}&nbsp;
                        <Link
                          to={`/go/${encodeURIComponent(
                            this.state.topic?.nodeId
                          )}`}
                        >
                          {this.state.topic?.nodeName}
                        </Link>{" "}
                        {i18next.t(
                          "topic:node, within 10 minutes after creation, you can"
                        )}{" "}
                        <Link to={`/move/topic/${this.state.topic?.id}`}>
                          {i18next.t("topic:move freely")}
                        </Link>
                      </li>
                      <li>
                        {i18next.t(
                          "topic:If you are not satisfied with the content, within 10 minutes of creation, you can"
                        )}{" "}
                        <Link to={`/edit/topic/${this.state.topic?.id}`}>
                          {i18next.t("topic:edit topic")}
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div class="cell topic_content markdown_body">
                    <h3>{i18next.t("topic:Topic meta information")}</h3>
                    <table
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      width="100%"
                    >
                      <tr>
                        <td align="right" width="120">
                          ID
                        </td>
                        <td align="left">{this.state.topic?.id}</td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Creator")}</td>
                        <td align="left">
                          <Link to={`/member/${this.state.topic?.author}`}>
                            {this.state.topic?.author}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Node")}</td>
                        <td align="left">
                          <Link
                            to={`/go/${encodeURIComponent(
                              this.state.topic?.nodeId
                            )}`}
                          >
                            {this.state.topic?.nodeName}
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td align="right">
                          {i18next.t("topic:Text syntax format")}
                        </td>
                        <td align="left">Markdown</td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Hot")}</td>
                        <td align="left">{this.state.topic?.hot}</td>
                      </tr>
                      <tr>
                        <td align="right">
                          {i18next.t("topic:Topic created")}
                        </td>
                        <td align="left">
                          {Setting.getPrettyDate(this.state.topic?.createdTime)}
                        </td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Sticky state")}</td>
                        <td align="left">否</td>
                      </tr>
                      <tr>
                        <td align="right">
                          {i18next.t("topic:Remaining time to top")}
                        </td>
                        <td align="left">0</td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Movable")}</td>
                        <td align="left">
                          {Setting.getBoolConvertedText(
                            this.state.topic?.editable
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Editable")}</td>
                        <td align="left">
                          {Setting.getBoolConvertedText(
                            this.state.topic?.editable
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td align="right">{i18next.t("topic:Appendable")}</td>
                        <td align="left">否</td>
                      </tr>
                    </table>
                  </div>
                  <div class="cell topic_content markdown_body">
                    <h3>{i18next.t("topic:Related resources")}</h3>
                    <ul>
                      <li>
                        <Link
                          to={`/go/${encodeURIComponent(
                            this.state.topic?.nodeId
                          )}`}
                        >
                          {this.state.topic?.nodeName}
                        </Link>
                        <Link to="/help/currency">
                          {i18next.t("topic:Virtual currency system")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/help/node">
                          {i18next.t("topic:Node usage help")}
                        </Link>
                      </li>
                      <li>
                        <Link to="/help/spam">
                          {i18next.t(
                            "topic:Treatment of link handling type spam"
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      );
    }

    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div
            style={
              this.props.BreakpointStage === "stage1" ||
              this.props.BreakpointStage === "stage2"
                ? { display: "flex" }
                : { display: "flex", flexDirection: "column" }
            }
          >
            {this.renderContent()}
            {this.props.BreakpointStage === "stage1" ||
            this.props.BreakpointStage === "stage2"
              ? this.renderRightBox()
              : null}
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(TopicBox);
