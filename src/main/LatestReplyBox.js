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
import * as ReplyBackend from "../backend/ReplyBackend";
import { withRouter, Link } from "react-router-dom";
import PageColumn from "./PageColumn";
import i18next from "i18next";

import "./LatestReplyBox.css";

const ReactMarkdown = require("react-markdown");
const pangu = require("pangu");

class LatestReplyBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      memberId: props.match.params.memberId,
      p: "",
      page: 1,
      limit: 20,
      minPage: 1,
      maxPage: -1,
      repliesNum: 10,
      replies: [],
      member: null,
      url: "",
    };
    if (this.props.limit !== undefined) {
      this.state.limit = this.props.limit;
    }
    const params = new URLSearchParams(this.props.location.search);
    this.state.p = params.get("p");
    if (this.state.p === null) {
      this.state.page = 1;
    } else {
      this.state.page = parseInt(this.state.p);
    }

    this.state.url = `/member/${this.state.memberId}/replies`;
  }

  componentDidMount() {
    this.getLatestReplies();
    this.getRepliesNum();
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
          memberId: newProps.match.params.memberId,
        },
        () => {
          this.getLatestReplies();
          this.getRepliesNum();
        }
      );
    }
  }

  getLatestReplies() {
    ReplyBackend.getLatestReplies(
      this.state.memberId,
      this.state.limit,
      this.state.page
    ).then((res) => {
      this.setState({
        replies: res,
      });
    });
  }

  getRepliesNum() {
    if (this.props.size !== "large") {
      return;
    }

    ReplyBackend.getMemberRepliesNum(this.state.memberId).then((res) => {
      this.setState({
        repliesNum: res,
      });
    });
  }

  showPageColumn() {
    if (this.state.repliesNum < this.state.limit) {
      return;
    }

    return (
      <PageColumn
        page={this.state.page}
        total={this.state.repliesNum}
        url={this.state.url}
        defaultPageNum={this.state.limit}
      />
    );
  }

  renderReplies(reply) {
    return (
      <li className="list">
        <div className="title">
          <span className="topicName">
            <Link
              to={`/t/${reply.topicId}?from=${encodeURIComponent(
                window.location.href
              )}`}
            >
              {pangu.spacing(reply.topicTitle)}
            </Link>
          </span>{" "}
          <span className="info">
            {"at "}
            {Setting.getPrettyDate(reply.replyTime)}
          </span>
        </div>
        <div className="body">
          <ReactMarkdown
            renderers={{
              image: Setting.renderImage,
              link: Setting.renderLink,
            }}
            source={Setting.getFormattedContent(reply.replyContent, true)}
            escapeHtml={false}
          />
        </div>
      </li>
    );
  }

  render() {
    if (this.props.member === null) {
      return null;
    }

    if (this.props.size === "large") {
      return (
        <div className="box">
          <div className="header">
            <Link to="/">{Setting.getForumName()} </Link>
            <span className="chevron">&nbsp;›&nbsp;</span>
            <Link to={`/member/${this.state.memberId}`}>
              {" "}
              {this.state.memberId}
            </Link>{" "}
            <span className="chevron">&nbsp;›&nbsp;</span>{" "}
            {i18next.t("member:All Replies")}
            <div className="fr f12">
              <span className="snow">
                {i18next.t("member:Total Replies")}&nbsp;
              </span>{" "}
              <strong className="gray">{this.state.repliesNum}</strong>
            </div>
          </div>
          {Setting.PcBrowser ? this.showPageColumn() : null}
          {this.state.replies?.map((reply) => {
            return this.renderReplies(reply);
          })}
          {this.showPageColumn()}
        </div>
      );
    }

    return (
      <ul style={{ margin: "0" }}>
        {this.state.replies?.map((reply) => {
          return this.renderReplies(reply);
        })}
      </ul>
    );
  }
}

export default withRouter(LatestReplyBox);
