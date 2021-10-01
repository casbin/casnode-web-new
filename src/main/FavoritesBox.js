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
import { withRouter, Link } from "react-router-dom";
import * as FavoritesBackend from "../backend/FavoritesBackend";
import TopicList from "./TopicList";
import PageColumn from "./PageColumn";
import i18next from "i18next";
import Container from "../components/container";
import { Card } from "antd";

class FavoritesBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      favoritesType: props.match.params.favorites,
      favorites: [],
      p: "",
      page: 1,
      limit: 20,
      minPage: 1,
      maxPage: -1,
      favoritesNum: 0,
      temp: 0,
      url: "",
    };
    const params = new URLSearchParams(this.props.location.search);
    this.state.p = params.get("p");
    if (this.state.p === null) {
      this.state.page = 1;
    } else {
      this.state.page = parseInt(this.state.p);
    }

    this.state.url = `/my/${this.state.favoritesType}`;
  }

  componentDidMount() {
    this.getFavoritesInfo();
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
          favoritesType: newProps.match.params.favorites,
        },
        () => this.getFavoritesInfo()
      );
    }
  }

  getFavoritesInfo() {
    let favoritesType;
    switch (this.state.favoritesType) {
      case "topics":
        favoritesType = 1;
        break;
      case "following":
        favoritesType = 2;
        break;
      case "nodes":
        favoritesType = 3;
        break;
      default:
        return;
    }
    FavoritesBackend.getFavorites(
      favoritesType,
      this.state.limit,
      this.state.page
    ).then((res) => {
      if (res.status === "ok") {
        this.setState({
          favorites: res.data,
          favoritesNum: res.data2,
        });
      }
    });
  }

  renderNodes(node) {
    if (node.nodeInfo == null) {
      return;
    }

    return (
      <Link to={`/go/${node?.nodeInfo.id}`}>
        <div
          style={{
            display: "table",
            padding: "20px 0px 20px 0px",
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          <img
            src={node?.nodeInfo.image}
            border="0"
            align="default"
            width="73"
            alt={node?.nodeInfo.name}
          />
          <div className="sep10"></div>
          {node?.nodeInfo.name}
          <div className="sep5"></div>
          <span className="fade f12">
            <li className="fa fa-comments"></li>
            {node?.topicNum}
          </span>
        </div>
      </Link>
    );
  }

  showPageColumn() {
    if (this.state.favoritesNum < this.state.limit) {
      return;
    }

    return (
      <PageColumn
        page={this.state.page}
        total={this.state.favoritesNum}
        url={this.state.url}
        defaultPageNum={this.state.limit}
      />
    );
  }

  render() {
    switch (this.state.favoritesType) {
      case "nodes":
        return (
          <div align="center">
            <Container BreakpointStage={this.props.BreakpointStage}>
              <div style={{ flex: "auto" }}>
                <Card
                  title={
                    <div>
                      {i18next.t("fav:My Favorite Nodes")}
                      <div
                        className="fr f12"
                        style={{ paddingTop: "5px", paddingRight: "10px" }}
                      >
                        <span className="snow">
                          {i18next.t("fav:Total nodes")} &nbsp;
                        </span>
                        <strong className="gray">
                          {this.state.favoritesNum}
                        </strong>
                      </div>
                    </div>
                  }
                  style={{
                    flex: "auto",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <div id="my-nodes">
                    {this.state.favorites.map((node) => {
                      return this.renderNodes(node);
                    })}
                  </div>
                </Card>
              </div>
            </Container>
          </div>
        );
      case "topics":
        return (
          <div align="center">
            <Container BreakpointStage={this.props.BreakpointStage}>
              <div style={{ flex: "auto" }}>
                <Card
                  title={
                    <div>
                      {i18next.t("fav:My favorite topics")}
                      <div
                        className="fr f12"
                        style={{ paddingTop: "5px", paddingRight: "10px" }}
                      >
                        <span className="snow">
                          {i18next.t("fav:Total topics")} &nbsp;
                        </span>
                        <strong className="gray">
                          {this.state.favoritesNum}
                        </strong>
                      </div>
                    </div>
                  }
                  style={{
                    flex: "auto",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <TopicList
                    topics={this.state.favorites}
                    showNodeName={true}
                    showAvatar={true}
                  />
                </Card>
              </div>
            </Container>
          </div>
        );
      case "following":
        return (
          <div align="center">
            <Container BreakpointStage={this.props.BreakpointStage}>
              <div style={{ flex: "auto" }}>
                <Card
                  title={
                    <div>
                      {i18next.t("fav:Latest topics from people I followed")}
                      <div
                        className="fr f12"
                        style={{ paddingTop: "5px", paddingRight: "10px" }}
                      >
                        <span className="snow">
                          {i18next.t("fav:Total topics")} &nbsp;
                        </span>
                        <strong className="gray">
                          {this.state.favoritesNum}
                        </strong>
                      </div>
                    </div>
                  }
                  style={{
                    flex: "auto",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  {Setting.PcBrowser ? this.showPageColumn() : null}
                  <TopicList
                    topics={this.state.favorites}
                    showNodeName={true}
                    showAvatar={true}
                  />
                  {this.showPageColumn()}
                </Card>
              </div>
            </Container>
          </div>
        );
    }
    return <div className="box">{this.state.favoritesType}</div>;
  }
}

export default withRouter(FavoritesBox);
