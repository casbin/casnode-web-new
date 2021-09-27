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
import * as SensitiveBackend from "../backend/SensitiveBackend.js";
import * as Setting from "../Setting";
import i18next from "i18next";
import Container from "../components/container.js";
import { Card, Button } from "antd";

class AdminSensitive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensitiveList: null,
      newSensitive: null,
    };
  }

  componentDidMount() {
    SensitiveBackend.getSensitiveList().then((res) => {
      this.setState({
        sensitiveList: res,
      });
    });
  }

  delSensitive(item) {
    SensitiveBackend.delSensitive(item).then((res) => {
      if (res.status === "ok") {
        SensitiveBackend.getSensitiveList().then((res) => {
          this.setState({
            sensitiveList: res,
          });
        });
      } else alert(res.msg);
    });
  }

  renderSensitiveItem(item) {
    return (
      <div style={{ padding: "20px", borderBottom: "1px solid #e2e2e2" }}>
        <a
          href="javascript:void(0);"
          //   onClick={}
        >
          {item}
        </a>
        <Button
          danger
          type=""
          style={{ float: "right" }}
          onClick={() => this.delSensitive(item)}
        >
          delete
        </Button>
      </div>
    );
  }

  addSensitive() {
    SensitiveBackend.addSensitive(
      document.getElementById("newsensitive").value
    ).then((res) => {
      if (res.status === "ok") {
        SensitiveBackend.getSensitiveList().then((res) => {
          this.setState({
            sensitiveList: res,
          });
        });
      } else alert(res.msg);
    });
  }
  // font-size: 14px;
  // position: relative;
  // margin: 10px 0 9px;
  // padding: 15px 0;
  // height: 35px;
  // border-radius: 20px;
  // border: 1px solid #ced4da;
  // display: flex;
  // align-items: center;
  // justify-content: space-around;
  // width: 200px;
  renderNewSensitive() {
    return (
      <div
        style={{
          padding: "20px 0",
          borderBottom: "1px solid #e2e2e2",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            padding: "3px 8px",
            borderRadius: "20px",
            border: "1px solid #ced4da",
            flex: "1",
          }}
        >
          <input
            placeholder={i18next.t(
              "general:Please input new sensitive words here"
            )}
            style={{
              border: "none",
              margin: "0 0 0 5px",
              outline: "none",
              flex: "1",
              justifyContent: "space-between",
            }}
            type="text"
            id="newsensitive"
          />
        </span>
        <Button
          type="primary"
          style={{ float: "right", marginLeft: "40px" }}
          onClick={() => this.addSensitive()}
        >
          add
        </Button>
      </div>
    );
  }

  render() {
    // return this.renderHeader();
    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            <Card
              title={i18next.t("sensitive:sensitive management")}
              style={{
                alignItems: "center",
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <span>
                {this.props.event === "new"
                  ? i18next.t("sensitive:new sensitive")
                  : ""}
              </span>

              <div>
                {this.state.sensitiveList !== null &&
                this.state.sensitiveList.length !== 0 ? (
                  this.state.sensitiveList.map((word) =>
                    this.renderSensitiveItem(word)
                  )
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      height: "100px",
                      lineHeight: "100px",
                    }}
                  >
                    {"No data"}
                  </div>
                )}
                {this.renderNewSensitive()}
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(AdminSensitive);
