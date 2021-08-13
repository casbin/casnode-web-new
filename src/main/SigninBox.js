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

// restored from commit 9f260a7
// modified to adapt Casdoor JavaScript SDK

import React from "react";
import Header from "./Header";
import * as AccountBackend from "../backend/AccountBackend";
import * as Setting from "../Setting";
import { withRouter } from "react-router-dom";
import i18next from "i18next";
import { AuthConfig } from "../Conf";

import { Button, Card, Alert } from "antd";

import { authConfig } from "../auth/Auth";
import Container from "../components/container";
import * as Auth from "../auth/Auth";
import "./SigninBox.css";
import * as Conf from "../Conf";
class SigninBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      form: {},
      isTypingStarted: false,
      problem: [],
      message: "",
    };
  }

  updateFormField(key, value) {
    let form = this.state.form;
    form[key] = value;
    this.setState({
      form: form,
      isTypingStarted: true,
    });
  }

  onSignin(event) {
    event.preventDefault();
    if (this.props.Casdoor === undefined) {
      this.setState({ message: "Casdoor error." });
      return;
    }

    let result = this.props.Casdoor.signin(
      this.state.form.information,
      this.state.form.password,
      false
    );

    if (result === undefined) {
      this.setState({ message: i18next.t("login:Signin failed.") });
      return;
    }

    result.then((res) => {
      this.setState({ message: res });
    });
  }

  signOut() {
    if (!window.confirm(i18next.t("signout:Are you sure to log out?"))) {
      return;
    }

    AccountBackend.signout().then((res) => {
      if (res.status === "ok") {
        this.props.onSignout();
        this.props.history.push("/signout");
      } else {
        this.props.history.push("/signout");
      }
    });
  }

  clearMessage() {
    this.setState({
      message: "",
    });
  }

  renderProblem() {
    if (!this.state.isTypingStarted) {
      return null;
    }

    let problems = [];
    if (this.state.form.username === "") {
      problems.push(i18next.t("error:Please input username"));
    }
    if (this.state.form.password === "") {
      problems.push(i18next.t("error:Please input password"));
    }

    if (this.state.message !== "") {
      problems.push(this.state.message);
    }

    if (problems.length === 0) {
      return null;
    }

    return (
      <Alert
        style={{ textAlign: "left" }}
        message={i18next.t(
          "error:Please resolve the following issues before submitting"
        )}
        description={problems.map((problem, i) => {
          return "· " + i18next.t(`error:${problem}`);
        })}
        type="warning"
        closable
        showIcon
      />
    );
  }

  renderMessage() {
    if (this.state.message === "" || this.state.message === "Captcha error") {
      return null;
    }

    return (
      <Alert
        style={{ textAlign: "left" }}
        message={i18next.t(
          "error:We had a problem when you signed in, please try again"
        )}
        type="error"
        showIcon
        closable
      />
    );
  }

  redirectTo(link) {
    window.location.href = link;
  }

  renderWechatSignin(link) {
    return (
      <div className="cell" style={{ textAlign: "center" }}>
        <div className="signin_method" onClick={() => this.redirectTo(link)}>
          <div className="signin_method_icon signin_method_wechat" />
          <div className="signin_method_label" style={{ width: 140 }}>
            {i18next.t("signin:Sign in with WeChat")}
          </div>
        </div>
      </div>
    );
  }

  renderGoogleSignin(link) {
    return (
      <div className="cell" style={{ textAlign: "center" }}>
        <div className="signin_method" onClick={() => this.redirectTo(link)}>
          <div className="signin_method_icon signin_method_google" />
          <div className="signin_method_label" style={{ width: 140 }}>
            {i18next.t("signin:Sign in with Google")}
          </div>
        </div>
      </div>
    );
  }

  renderGithubSignin(link) {
    return (
      <div className="cell" style={{ textAlign: "center" }}>
        <div className="signin_method" onClick={() => this.redirectTo(link)}>
          <div className="signin_method_icon signin_method_github" />
          <div className="signin_method_label" style={{ width: 140 }}>
            {i18next.t("signin:Sign in with Github")}
          </div>
        </div>
      </div>
    );
  }

  renderQQSignin(link) {
    return (
      <div className="cell" style={{ textAlign: "center" }}>
        <div className="signin_method" onClick={() => this.redirectTo(link)}>
          <div className="signin_method_icon signin_method_qq" />
          <div className="signin_method_label" style={{ width: 140 }}>
            {i18next.t("signin:Sign in with QQ")}
          </div>
        </div>
      </div>
    );
  }

  renderProvider() {
    if (
      window.location.pathname === "/signin" &&
      this.props.OAuthObjects !== undefined &&
      this.props.OAuthObjects !== null &&
      this.props.OAuthObjects.length !== 0
    ) {
      return (
        <div>
          <div className="title">{i18next.t("bar:Other Sign In Methods")}</div>
          {this.props.OAuthObjects.map((obj) => {
            switch (obj.type) {
              case "Google":
                return this.renderGoogleSignin(obj.link);
              case "GitHub":
                return this.renderGithubSignin(obj.link);
              case "WeChat":
                return this.renderWechatSignin(obj.link);
              case "QQ":
                return this.renderQQSignin(obj.link);
              default:
                return null;
            }
          })}
        </div>
      );
    }
  }

  renderRightBar() {
    if (
      this.props.BreakpointStage == "stage4" ||
      this.props.BreakpointStage == "stage5"
    ) {
      return null;
    }
    return (
      <div>
        <Card style={{ marginTop: "30px", marginLeft: "40px" }}>
          <div className="cell">
            <strong>{Conf.SiteSlogan}</strong>
            <div className="sep5" />
            <span className="fade">{Conf.SiteDescription}</span>
          </div>
          <div className="sep5" />
          <ul
            style={{ listStyle: "none", textAlign: "left", fontSize: "18px" }}
          >
            <li>
              <div style={{ padding: "10px 0" }}>
                <a href={Auth.getSignupUrl()}>{i18next.t("bar:Sign Up Now")}</a>
              </div>
            </li>
            <li>
              <div style={{ padding: "10px 0" }}>
                <a
                  href={`${AuthConfig.serverUrl}/forget/${AuthConfig.appName}`}
                >
                  {i18next.t("general:Forgot Password")}
                </a>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    );
  }

  render() {
    return (
      <Container BreakpointStage={this.props.BreakpointStage}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", marginTop: "10px" }}>
            {this.renderProblem()}
            {this.renderMessage()}
          </div>
          <div
            className={`${this.props.BreakpointStage}`}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ flex: "1" }}>
              <Card style={{ textAlign: "left", marginTop: "30px" }}>
                <div>
                  <div className="title">
                    {i18next.t("general:Sign in")} {authConfig.appName}
                  </div>

                  <form onSubmit={this.onSignin}>
                    <div>
                      <input
                        type="text"
                        value={this.state.form.information}
                        onChange={(event) => {
                          this.updateFormField(
                            "information",
                            event.target.value
                          );
                        }}
                        className="input"
                        name="username"
                        autoFocus="autofocus"
                        autoCorrect="off"
                        spellCheck="false"
                        autoCapitalize="off"
                        placeholder={i18next.t(
                          "general:Username, email address or phone number"
                        )}
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        value={this.state.form.password}
                        onChange={(event) => {
                          this.updateFormField("password", event.target.value);
                        }}
                        className="input"
                        name="password"
                        autoCorrect="off"
                        spellCheck="false"
                        autoCapitalize="off"
                        placeholder={i18next.t("general:Password")}
                      />
                    </div>

                    <Button
                      htmlType="submit"
                      onClick={(event) => this.onSignin(event)}
                      block="true"
                      type="primary"
                      className="button"
                    >
                      {i18next.t("general:Sign In")}
                    </Button>

                    <input type="hidden" value="/signup" name="next" />
                  </form>
                </div>
              </Card>

              <Card style={{ marginTop: "30px" }}>{this.renderProvider()}</Card>
            </div>
            {this.renderRightBar()}
          </div>
        </div>
      </Container>
    );
  }
}

export default withRouter(SigninBox);
