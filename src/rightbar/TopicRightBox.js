import i18next from "i18next";
import React from "react";
import { Link } from "react-router-dom";

import { Button, Card } from "antd";

import * as BasicBackend from "../backend/BasicBackend";
import * as PosterBackend from "../backend/PosterBackend";
import * as AuthConfig from "../Conf";
import "./TopicRightBox.css";

class TopicRightBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      info: null,
      poster: {
        name: "",
        advertiser: "",
        link: "",
        picture_link: "",
      },
    };
  }
  componentDidMount() {
    this.getHealthInfo();
    this.readposter();
  }

  readposter() {
    PosterBackend.readposter("r_box_poster").then((res) => {
      let poster = res;
      if (poster) {
        this.setState({
          poster: poster,
        });
      }
    });
  }

  getHealthInfo() {
    if (this.state.info !== null) {
      return;
    }
    BasicBackend.getCommunityHealth().then((res) => {
      this.setState({
        info: res.data,
      });
    });
  }

  renderAddNewTopic() {
    return (
      <Card style={{ marginBottom: "20px" }}>
        <a href="/new">
          <Button block="true" type="primary">
            {i18next.t("general:New Topic")}
          </Button>
        </a>
      </Card>
    );
  }

  renderPoster() {
    return (
      <Card style={{ marginBottom: "20px" }}>
        <div>
          <a href={this.state.poster["link"]} target="_blank">
            <img
              src={this.state.poster["picture_link"]}
              border="0"
              width="250"
              height="250"
              alt={this.state.poster["advertiser"]}
              style={{ vertical: "bottom" }}
            ></img>
          </a>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <a href={this.state.poster["link"]} target="_blank">
            {this.state.poster["advertiser"]}
          </a>
          <a href="/" target="_blank">
            {i18next.t("bar:Poster")}
          </a>
        </div>
      </Card>
    );
  }

  renderStaticBox() {
    return (
      <Card style={{ marginBottom: "20px" }}>
        <div className="BoxTitle">{i18next.t("bar:Community Stats")}</div>
        <ul className="contentList">
          <li>
            <span style={{ marginRight: "10px" }}>
              {i18next.t("bar:Member")}
            </span>
            <strong>{this.state.info?.member}</strong>
          </li>
          <li>
            <span style={{ marginRight: "10px" }}>
              {i18next.t("bar:Topic")}
            </span>
            <strong>{this.state.info?.topic}</strong>
          </li>
          <li>
            <span style={{ marginRight: "10px" }}>
              {i18next.t("bar:Reply")}
            </span>
            <strong>{this.state.info?.reply}</strong>
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flex: "1",
            margin: "0 10px",
          }}
        >
          <div>
            <Link to="/top/rich">{i18next.t("bar:Rich List")}</Link>
          </div>
          <div>
            <Link to="/top/player">{i18next.t("bar:Consumption list")}</Link>
          </div>
        </div>
      </Card>
    );
  }

  renderCustomizeItems(item) {
    return (
      <Card style={{ marginBottom: "20px" }}>
        <div className="BoxTitle">{item.title}</div>
        {item.imageUrl ? (
          <div>
            <img
              src={item.imageUrl}
              border="0"
              width="150"
              height="150"
              alt={item.title}
              style={{ vertical: "bottom" }}
            ></img>
          </div>
        ) : null}
        {item.content?.map((content) => {
          return (
            <ul className="contentList">
              {this.renderCustomizeContentList(content)}
            </ul>
          );
        })}
      </Card>
    );
  }
  renderCustomizeContentList(content) {
    return (
      <li>
        <span style={{ marginRight: "10px" }}>{content.line}</span>
      </li>
    );
  }

  render() {
    return (
      <div>
        {this.renderAddNewTopic()}
        {this.renderPoster()}
        {this.renderStaticBox()}
        {AuthConfig.CustomizeSideBarItems?.map((item) => {
          return this.renderCustomizeItems(item);
        })}
      </div>
    );
  }
}
export default TopicRightBox;
