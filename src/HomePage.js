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
import Container from "./components/container";
import TopicList from "./main/TopicList";
import * as TopicBackend from "./backend/TopicBackend";
import NodeNavigationBox from "./main/NodeNavigationBox";
import i18next from "i18next";
import * as AuthConfig from "./Conf";

import "./HomePage.css";
class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      topics: [],
      topics2: [],
    };
  }

  componentDidMount() {
    this.getTopics();
  }

  getTopics() {
    TopicBackend.GetSortedTopics(
      "0",
      "2",
      "0",
      "0",
      AuthConfig.HomepageRowLimit,
      1
    ).then((res) => {
      this.setState({
        topics: res.data,
      });
    });
    TopicBackend.GetSortedTopics(
      "0",
      "2",
      "0",
      "0",
      AuthConfig.HomepageRowLimit,
      2
    ).then((res) => {
      this.setState({
        topics2: res.data,
      });
    });
  }

  renderTop(item) {
    return (
      <div class={`col-md-3 ${item.special}`}>
        <div class="item">
          <div class="icon">
            <a href={item.url}>
              <img src={item.img} style={{ width: "55px" }} />
            </a>
          </div>
          <div class="text">
            <a href={item.url}>
              {item.title}
              <i class="pull-right fa fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "30px 0px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container
          BreakpointStage={this.props.BreakpointStage}
          class="row home-icons hidden-sm hidden-xs"
        >
          <div className={`${this.props.BreakpointStage}-entry`}>
            {AuthConfig.HomepageTopConfig?.map((item) => {
              return this.renderTop(item);
            })}
          </div>
        </Container>
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div className={`${this.props.BreakpointStage}-topics`}>
            <TopicList
              topics={this.state.topics}
              showNodeName={true}
              showAvatar={true}
            />
            <TopicList
              topics={this.state.topics2}
              showNodeName={true}
              showAvatar={true}
            />
          </div>
        </Container>
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div
            style={{
              backgroundColor: "white",
              flex: "1",
              textAlign: "left",
              flex: "1",
              height: "80px",
            }}
          >
            <a href="/topics?sort=hs" className="more-topics">
              {i18next.t("Homepage:export more hot topics...")}
            </a>
          </div>
        </Container>
        <div style={{ marginTop: "30px" }} />
        <Container BreakpointStage={this.props.BreakpointStage}>
          <NodeNavigationBox />
        </Container>
      </div>
    );
  }
}

export default HomePage;
