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
import i18next from "i18next";
import * as ConfBackend from "../backend/ConfBackend";
import Container from "../components/container.js";
import { Card, Alert, Button, Form, Input, Tabs } from "antd";

import "./AdminPlane.css";

const { TabPane } = Tabs;
class AdminFrontConf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      Management_LIST: [{ label: "Visual Conf", value: "visualConf" }],
      field: "visualConf",
      conf: [
        { Id: "forumName", Value: "" },
        { Id: "logoImage", Value: "" },
        { Id: "signinBoxStrong", Value: "" },
        { Id: "signinBoxSpan", Value: "" },
        { Id: "footerAdvise", Value: "" },
        { Id: "footerDeclaration", Value: "" },
        { Id: "footerLogoImage", Value: "" },
        { Id: "footerLogoUrl", Value: "" },
      ],
      form: {},
      changeForm: {},
      message: "",
      memberId: props.match.params.memberId,
    };
    this.state.url = `/admin/frontconf`;
  }

  componentDidMount() {
    this.getFrontConf(this.state.field);
  }

  changeField(field) {
    this.setState(
      {
        field: field,
      },
      () => {
        this.getFrontConf(this.state.field);
      }
    );
  }

  renderManagementList(item) {
    return (
      <a
        href="javascript:void(0);"
        className={this.state.field === item.value ? "tab_current" : "tab"}
        onClick={() => this.changeField(item.value)}
      >
        {item.label}
      </a>
    );
  }

  getFrontConf(field) {
    ConfBackend.getFrontConfByField(field).then((res) => {
      let form = this.state.form;
      let conf = this.state.conf;
      for (var k in res) {
        form[res[k].Id] = res[k].Value;
      }
      for (var i in conf) {
        conf[i].Value = form[conf[i].Id];
      }
      this.setState({
        conf: conf,
        form: form,
      });
    });
  }

  clearMessage() {
    this.setState({
      message: "",
    });
  }

  inputChange(event, id) {
    event.target.style.height = event.target.scrollHeight + "px";
    let forms = this.state.changeForm;
    let form = this.state.form;
    form[id] = event.target.value;
    forms[id] = event.target.value;
    this.setState({
      form: form,
      changeForm: forms,
    });
  }

  updateConf() {
    let confs = [];
    for (var k in this.state.changeForm) {
      confs.push({ Id: k, Value: this.state.changeForm[k] });
    }
    ConfBackend.updateFrontConfs(confs).then((res) => {
      if (res.status === "ok") {
        this.setState({
          message: i18next.t("poster:Update frontconf information success"),
        });
      } else {
        this.setState({
          message: res?.msg,
        });
      }
    });
  }

  updateConfToDefault() {
    ConfBackend.updateFrontConfToDefault().then((res) => {
      if (res.status === "ok") {
        this.setState({
          message: i18next.t("poster:Update frontconf information success"),
        });
      } else {
        this.setState({
          message: res?.msg,
        });
      }
      window.location.reload();
    });
  }

  convert(s) {
    let str;
    switch (s) {
      case "forumName":
        str = i18next.t("frontConf:Forum name");
        break;
      case "logoImage":
        str = i18next.t("frontConf:Logo image");
        break;
      case "footerLogoImage":
        str = i18next.t("frontConf:Footer Logo image");
        break;
      case "footerLogoUrl":
        str = i18next.t("frontConf:Footer Logo URL");
        break;
      case "signinBoxStrong":
        str = i18next.t("frontConf:Right title");
        break;
      case "signinBoxSpan":
        str = i18next.t("frontConf:Right subtitle");
        break;
      case "footerDeclaration":
        str = i18next.t("frontConf:Footer title");
        break;
      case "footerAdvise":
        str = i18next.t("frontConf:Footer subtitle");
        break;
    }
    return str;
  }

  render() {
    return (
      <div align="center">
        <Container
          BreakpointStage={this.props.BreakpointStage}
          className="translation"
        >
          <div style={{ flex: "auto" }}>
            <Card
              title={i18next.t("admin:FrontConf management")}
              style={{
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <Tabs defaultActiveKey="1" type="card">
                <TabPane tab={i18next.t(`frontend:Visual Conf`)} key="1">
                  <div>
                    {this.state.message !== "" ? (
                      <Alert
                        message={this.state.message}
                        type="info"
                        onClick={() => this.clearMessage()}
                        closable
                        style={{
                          marginBottom: "10px",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                      />
                    ) : null}
                    <div>
                      <table
                        cellPadding="8"
                        cellSpacing="0"
                        border="0"
                        width="100%"
                      >
                        <tbody>
                          {this.state.conf.map((item) => {
                            return (
                              <tr>
                                <td
                                  width={Setting.PcBrowser ? "120" : "90"}
                                  align="right"
                                >
                                  {this.convert(item.Id)}
                                </td>
                                <td width="auto" align="left">
                                  <Input
                                    style={{ width: "80%" }}
                                    value={this.state.form[item.Id]}
                                    onChange={(event) =>
                                      this.inputChange(event, item.Id)
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td
                              width={Setting.PcBrowser ? "120" : "90"}
                              align="right"
                            ></td>
                            <td width="auto" align="left">
                              <Button
                                type="primary"
                                onClick={() => this.updateConf()}
                              >
                                {i18next.t("frontConf:Save")}
                              </Button>
                              &emsp;&emsp;&emsp;&emsp;
                              <Button
                                onClick={() => this.updateConfToDefault()}
                              >
                                {i18next.t("frontConf:Reset")}
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(AdminFrontConf);
