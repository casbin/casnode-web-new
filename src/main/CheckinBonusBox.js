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
import * as BalanceBackend from "../backend/BalanceBackend";
import { withRouter, Link } from "react-router-dom";
import i18next from "i18next";
import Container from "../components/container";
import { Card, Button, Alert } from "antd";

class CheckinBonusBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      checkinBonusStatus: false,
      date: null,
      showSuccess: false,
    };
  }

  componentDidMount() {
    this.getCheckinBonusStatus();
  }

  getCheckinBonusStatus() {
    BalanceBackend.getCheckinBonusStatus().then((res) => {
      this.setState({
        checkinBonusStatus: res.data,
        date: res.data2,
      });
    });
  }

  getDailyCheckinBonus() {
    BalanceBackend.getCheckinBonus().then((res) => {
      if (res.status !== "ok") {
        Setting.showMessage("error", res.msg);
      } else {
        this.setState({
          checkinBonusStatus: true,
          showSuccess: true,
        });
      }
    });
  }

  changeSuccessStatus() {
    this.setState({
      showSuccess: !this.state.showSuccess,
    });
  }

  render() {
    if (this.state.checkinBonusStatus) {
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
                <div className="title" style={{ marginBottom: "25px" }}>
                  <span style={{ fontSize: "18px" }}>
                    {i18next.t("mission:Daily tasks")}&nbsp;
                  </span>
                </div>
                <div>
                  {this.state.showSuccess ? (
                    <Alert
                      message={i18next.t(
                        "mission:Successfully received daily checkin bonus"
                      )}
                      type="error"
                      onClick={() => this.changeSuccessStatus()}
                      closable
                      style={{
                        marginBottom: "10px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    />
                  ) : null}
                  <div className="cell">
                    <Alert
                      message={i18next.t(
                        "mission:Daily checkin bonus has been received"
                      )}
                      type="info"
                      closable
                      style={{
                        marginBottom: "10px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    />

                    <div className="sep10"></div>
                    <Button
                      type="primary"
                      onClick={() => (window.location.href = "/balance")}
                    >
                      {i18next.t("mission:Check my account balance")}
                    </Button>
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
                  {i18next.t("mission:Daily tasks")}&nbsp;
                </span>
              </div>
              <div className="cell">
                <Button
                  type="primary"
                  onClick={() => this.getDailyCheckinBonus()}
                >
                  {i18next.t("mission:Receive X copper coins")}
                </Button>
              </div>
              <div className="cell">
                {i18next.t("mission:Logged in continuously")}{" "}
                {i18next.t("mission:Successfully received daily checkin bonus")}
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(CheckinBonusBox);
