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
import Container from "../components/container";
import { Card } from "antd";

import "./AllCreatedTopicsBox.css";

class SelectLanguageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      previous: "",
    };
    this.state.previous = this.props.location.query?.previous;
  }

  ChangeLanguage(language) {
    if (this.state.previous === undefined) {
      Setting.ChangeLanguage(language, "/");
    } else {
      Setting.ChangeLanguage(language, this.state.previous);
    }
  }

  render() {
    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            {Setting.PcBrowser ? <div className="sep20" /> : null}
            <Card
              title={`Please select the language you would like to use on ${Setting.getForumName()}`}
              style={{
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div>
                <ul style={{ listStyle: "none" }}>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("en")}
                      className={"lang-selector"}
                    >
                      English
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("zh")}
                      className={"lang-selector"}
                    >
                      ????????????
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("fr")}
                      className={"lang-selector"}
                    >
                      Fran??ais
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("de")}
                      className={"lang-selector"}
                    >
                      Deutsch
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("ko")}
                      className={"lang-selector"}
                    >
                      ?????????
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("ru")}
                      className={"lang-selector"}
                    >
                      ??????????????
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() => this.ChangeLanguage("ja")}
                      className={"lang-selector"}
                    >
                      ?????????
                    </a>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(SelectLanguageBox);
