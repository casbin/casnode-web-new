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
import Header from "./Header";
import { withRouter } from "react-router-dom";
import * as AccountBackend from "../backend/AccountBackend";
import i18next from "i18next";
import * as Setting from "../Setting";
import Container from "../components/container";
import { Card, Button } from "antd";

class SignoutBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  onSigninAgain() {
    this.props.history.push(Setting.getSigninUrl());
  }

  onRetrySignout() {
    AccountBackend.signout().then((res) => {
      if (res.status === "ok") {
        this.props.onSignout();
        this.props.history.push("/signout");
      } else {
        this.props.history.push("/signout");
      }
    });
  }

  render() {
    const isSignedIn =
      this.props.account !== undefined && this.props.account !== null;

    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            <Card
              title={i18next.t("member:Sign Out")}
              style={{
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              {isSignedIn ? (
                <div className="inner">
                  {i18next.t(
                    "error:We had a problem when you signed out, please try again."
                  )}
                  <div className="sep20" />
                  <Button
                    type="primary"
                    onClick={this.onRetrySignout.bind(this)}
                  >
                    {i18next.t("error:Retry Sign Out")}
                  </Button>
                </div>
              ) : (
                <div className="inner">
                  {i18next.t(
                    "member:You have signed out completely, no personal information is left on this computer."
                  )}
                  <div className="sep20" />
                  <Button
                    type="primary"
                    onClick={this.onSigninAgain.bind(this)}
                  >
                    {i18next.t("member:Sign In Again")}
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(SignoutBox);
