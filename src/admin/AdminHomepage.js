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
import i18next from "i18next";
import Container from "../components/container";
import { Card } from "antd";

class AdminHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      form: {},
      manageItems: [
        {
          label: i18next.t("admin:Tab management"),
          value: "tab",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Node management"),
          value: "node",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Plane management"),
          value: "plane",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Topic management"),
          value: "topic",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Poster management"),
          value: "poster",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Member management"),
          value: "member",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Sensitive management"),
          value: "sensitive",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:Translation management"),
          value: "translation",
          image: Setting.getStatic("/img/settings.png"),
        },
        {
          label: i18next.t("admin:FrontConf management"),
          value: "frontconf",
          image: Setting.getStatic("/img/settings.png"),
        },
      ],
      message: "",
    };
  }

  componentDidMount() {
    //
  }

  renderManageItemInternal(item) {
    return (
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
          src={item?.image}
          border="0"
          align="default"
          width="73"
          alt={item?.value}
        />
        <div className="sep10" />
        {item?.label}
      </div>
    );
  }

  renderManageItem(item) {
    if (item.value === "member") {
      return (
        <a
          style={{ background: "white" }}
          className="grid_item"
          target="_blank"
          href={Setting.getMyProfileUrl(this.props.account)}
        >
          {this.renderManageItemInternal(item)}
        </a>
      );
    }

    return (
      <Link
        style={{ background: "white" }}
        className="grid_item"
        to={`admin/${item?.value}`}
      >
        {this.renderManageItemInternal(item)}
      </Link>
    );
  }

  render() {
    if (this.props.account === undefined) {
      return (
        <div align="center">
          <Container BreakpointStage={this.props.BreakpointStage}>
            <div style={{ flex: "auto" }}>
              <Card title={i18next.t("loading:Page is loading")}>
                <span className="gray bigger">
                  {i18next.t("loading:Please wait patiently...")}
                </span>
              </Card>
            </div>
          </Container>
        </div>
      );
    }
    if (this.props.account === null || !this.props.account?.isAdmin) {
      this.props.history.push("/");
    }

    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            <Card title={i18next.t("admin:Backstage management")}>
              <div>
                {this.state.manageItems.map((item) => {
                  return this.renderManageItem(item);
                })}
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(AdminHomepage);
