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

import React from "react";
import * as Setting from "../Setting";
import * as TopicBackend from "../backend/TopicBackend";
import { withRouter, Link } from "react-router-dom";
import LatestReplyBox from "./LatestReplyBox";
import PageColumn from "./PageColumn";
import TopicList from "./TopicList";
import * as MemberBackend from "../backend/MemberBackend";
import i18next from "i18next";

import { Card, Tabs } from "antd";
import "./member.css";
import "./AllCreatedTopicsBox.css";
const { TabPane } = Tabs;

class AllCreatedTopicsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      memberId: props.match.params.memberId,
      tab: props.match.params.tab,
      topics: [],
      limit: 20,
      p: "",
      page: 1,
      minPage: 1,
      maxPage: -1,
      topicsNum: 1,
      temp: 0,
      member: [],
      url: "",
      TAB_LIST: [
        { label: "Q&A", value: "qna" },
        { label: "Tech", value: "tech" },
        { label: "Play", value: "play" },
        { label: "Jobs", value: "jobs" },
        { label: "Deals", value: "deals" },
        { label: "City", value: "city" },
      ],
    };
    const params = new URLSearchParams(this.props.location.search);
    this.state.p = params.get("p");
    if (this.state.p === null) {
      this.state.page = 1;
    } else {
      this.state.page = parseInt(this.state.p);
    }
    if (this.state.tab === undefined) {
      this.state.limit = 10;
    }
  }

  componentDidMount() {
    this.getAllCreatedTopics();
    this.geCreatedTopicsNum();
    this.getMember();
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
          this.getAllCreatedTopics();
          this.geCreatedTopicsNum();
        }
      );
    }
  }

  getMember() {
    if (this.state.tab === undefined) {
      return;
    }

    MemberBackend.getMember(this.state.memberId).then((res) => {
      this.setState({
        member: res,
      });
    });
  }

  getAllCreatedTopics() {
    TopicBackend.getAllCreatedTopics(
      this.state.memberId,
      this.state.tab,
      this.state.limit,
      this.state.page
    ).then((res) => {
      this.setState({
        topics: res,
        tab: this.props.match.params.tab,
      });
    });
  }

  geCreatedTopicsNum() {
    if (this.state.tab === undefined) {
      return;
    }

    TopicBackend.getCreatedTopicsNum(this.state.memberId).then((res) => {
      this.setState({
        topicsNum: res,
      });
    });
  }

  renderTab(tab) {
    return {
      ...(this.state.tab === tab.value ? (
        <Link
          key={tab.value}
          to={`/member/${this.state.memberId}/${tab.value}`}
          className="cell_tab_current"
        >
          {" "}
          {tab.label}{" "}
        </Link>
      ) : (
        <Link
          key={tab.value}
          to={`/member/${this.state.memberId}/${tab.value}`}
          className="cell_tab"
        >
          {" "}
          {tab.label}{" "}
        </Link>
      )),
    };
  }

  renderProfileItems(item) {
    if (this.props.member[item] !== "" && this.props.member[item] !== null) {
      return (
        <div style={{ padding: "5px 0", textAlign: "justify" }}>
          <label
            style={{
              color: "#666",
              display: "inline-block",
              width: "100px",
              marginRight: "10px",
            }}
          >
            {item}
          </label>
          <span>{this.props.member[item]}</span>
        </div>
      );
    }
  }

  renderPersonalProfile() {}
  render() {
    if (this.props.member === null) {
      return null;
    }

    return (
      <div className={`${this.props.BreakpointStage}-right`}>
        <Tabs type="card">
          <TabPane tab={i18next.t("general:Personal Profile")} key="1">
            <Card>
              {this.renderProfileItems("homepage")}
              {this.renderProfileItems("dingtalk")}
              {this.renderProfileItems("gitee")}
              {this.renderProfileItems("github")}
              {this.renderProfileItems("gitlab")}
              {this.renderProfileItems("google")}
              {this.renderProfileItems("region")}
            </Card>
          </TabPane>
          <TabPane tab={i18next.t("general:Topics")} key="2">
            <Card>
              <TopicList
                topics={this.state.topics}
                showNodeName={true}
                showAvatar={true}
              />
            </Card>
          </TabPane>
          <TabPane tab={i18next.t("general:Replies")} key="3">
            <Card>
              <LatestReplyBox member={this.state.member} />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(AllCreatedTopicsBox);
