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
import { withRouter, Link } from "react-router-dom";
import * as Setting from "../Setting";
import "./NoMatch.css";
import i18next from "i18next";
import { Card } from "antd";
import Container from "../components/container";

class NoMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  renderBox() {
    return (
      <div align="center">
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
              <div>
                <div className="title" style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "18px" }}>404 Object Not Found</span>
                </div>
              </div>
              <div className="box-transparent">
                <div className="cell-translucent">
                  The object you were looking for is not found on the{" "}
                  {Setting.getForumName()} Space Station.
                </div>
                <div className="cell-translucent">
                  你要寻找的物件不存在于 {Setting.getForumName()} 空间站上。
                </div>
                <div className="cell-translucent">
                  L'objet que vous cherchiez ne se trouve pas sur la station
                  spatiale {Setting.getForumName()}.
                </div>
                <div className="cell-translucent">
                  Das von Ihnen gesuchte Objekt wird auf der{" "}
                  {Setting.getForumName()}
                  -Raumstation nicht gefunden.
                </div>
                <div className="cell-translucent">
                  お探しの物体は {Setting.getForumName()}{" "}
                  宇宙ステーションにはありません。
                </div>
                <div className="cell-translucent">
                  Объект, который вы искали, не найден на космической станции{" "}
                  {Setting.getForumName()}.
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  render() {
    return (
      <div>
        {(this, this.renderBox())}
        <div align="center" style={{ marginTop: "20px" }}>
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
                <div>
                  <div className="title" style={{ marginBottom: "20px" }}>
                    <span style={{ fontSize: "18px" }}>
                      {i18next.t("general:Navigation")}
                    </span>
                  </div>
                </div>
                <div className="box-transparent">
                  <div className="cell-translucent">
                    &nbsp;›&nbsp;
                    <a href="/planes">{i18next.t("plane:Plane list")}</a>
                  </div>
                  <div className="cell-translucent">
                    &nbsp;›&nbsp;
                    <a href="/recent">{i18next.t("topic:Recent Topics")}</a>
                  </div>
                </div>
              </Card>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(NoMatch);
