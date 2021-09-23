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
import { Link } from "react-router-dom";
import i18next from "i18next";
import Container from "../components/container";
import { Card } from "antd";
class SelectLanguageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            {Setting.PcBrowser ? <div className="sep20" /> : null}
            <Card
              title={`Please select the Default Editor you would like to use on ${Setting.getForumName()}`}
              style={{
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <a
                href="javascript:void(0);"
                onClick={() => Setting.ChangeEditorType("markdown")}
                className={"lang-selector"}
              >
                {i18next.t("new:MarkDown")}
              </a>
              <a
                href="javascript:void(0);"
                onClick={() => Setting.ChangeEditorType("richtext")}
                className={"lang-selector"}
              >
                {i18next.t("new:RichText")}
              </a>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default SelectLanguageBox;
