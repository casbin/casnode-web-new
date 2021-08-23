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
import Avatar from "../Avatar";
import "../node.css";
import i18next from "i18next";
import { Link } from "react-router-dom";

import "./TopicList.css";
const pangu = require("pangu");

class TopicList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  addTopicHitCount(topicId) {
    TopicBackend.addTopicHitCount(topicId).then((res) => {
      if (res?.status === "fail") {
        Setting.showMessage("error", res?.msg);
      }
      //goToLink(`/t/${topicId}?from=${encodeURIComponent(window.location.href)}`)
    });
  }

  topTopicStyle = {
    backgroundImage: `url('${Setting.getStatic(
      "/static/img/corner_star.png"
    )}')`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "20px 20px",
    backgroundPosition: "right top",
  };

  // return style according to whether it is a topped topic.
  topStyle(nodeTopTime, tabTopTime, homePageTopTime) {
    switch (this.props.topType) {
      case "node":
        if (nodeTopTime !== "") {
          return this.topTopicStyle;
        }
        return null;
      case "tab":
        if (tabTopTime !== "") {
          return this.topTopicStyle;
        }
        return null;
      case "homePage":
        if (homePageTopTime !== "") {
          return this.topTopicStyle;
        }
    }
    return null;
  }

  renderTopic(topic) {
    const pcBrowser = Setting.PcBrowser;

    return (
      <Link
        to={`/t/${topic?.id}`}
        onClick={() => this.addTopicHitCount(topic?.id)}
        className={`${this.props.nodeId}`}
      >
        <div key={topic?.id} className="listBox">
          <div className="avatar">
            <Avatar
              username={topic?.author}
              avatar={topic?.avatar}
              size={Setting.PcBrowser ? "" : "medium"}
            />
          </div>

          <div className="content">
            <div className="title">
              <span className="node">
                <Link to={`/go/${topic.nodeId}`}>{topic.nodeName}</Link>
              </span>
              {pangu.spacing(topic.title)}
            </div>

            <div className="info">
              <span className="user">
                <Link
                  to={`/member/${topic.author}`}
                  className={`${this.props.nodeId} member`}
                >
                  {topic.author}
                </Link>
              </span>{" "}
              {pcBrowser ? (
                <span>
                  &nbsp;•&nbsp;{" "}
                  <span className="time">
                    {topic.lastReplyTime === "" ||
                    this.props.timeStandard === "createdTime"
                      ? Setting.getPrettyDate(topic.createdTime)
                      : Setting.getPrettyDate(topic.lastReplyTime)}
                  </span>
                  {topic.lastReplyUser === "" ? null : (
                    <div style={{ display: "inline" }}>
                      {" "}
                      &nbsp;•&nbsp; {i18next.t("topic:last reply from")}{" "}
                      <span className="user">
                        <Link
                          to={`/member/${topic.lastReplyUser}`}
                          className={`${this.props.nodeId} member`}
                        >
                          {topic.lastReplyUser}
                        </Link>
                      </span>
                    </div>
                  )}
                </span>
              ) : null}
            </div>
          </div>
          <div className="count">
            {topic.replyCount === 0 ? null : (
              <Link
                to={`/t/${topic?.id}`}
                onClick={() => this.addTopicHitCount(topic?.id)}
              >
                {topic.replyCount}
              </Link>
            )}
          </div>
        </div>
      </Link>
    );
  }

  render() {
    return (
      <div style={{ backgroundColor: "white" }}>
        {this.props.topics?.map((topic) => {
          return this.renderTopic(topic);
        })}
      </div>
    );
  }
}

export default TopicList;
