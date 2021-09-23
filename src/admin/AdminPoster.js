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
import * as PosterBackend from "../backend/PosterBackend";
import * as Setting from "../Setting";
import i18next from "i18next";
import Container from "../components/container";
import { Card, Button, Input, Form, Alert } from "antd";

class AdminPoster extends React.Component {
  constructor(props) {
    super(props);
    this.adver = React.createRef();
    this.links = React.createRef();
    this.p_link = React.createRef();
    this.state = {
      classes: props,
      message: "",
      form: {
        name: "",
        advertiser: "",
        link: "",
        picture_link: "",
      },
      memberId: props.match.params.memberId,
    };

    this.state.url = `/admin/poster`;
  }

  componentDidMount() {
    this.readposter();
  }

  changeinputval() {
    let a_val = this.state.form["advertiser"];
    let l_val = this.state.form["link"];
    let p_val = this.state.form["picture_link"];
    if (a_val !== undefined) {
      this.adver.current.value = a_val;
    }
    if (l_val !== undefined) {
      this.links.current.value = l_val;
    }
    if (p_val !== undefined) {
      this.p_link.current.value = p_val;
    }
  }

  readposter() {
    PosterBackend.readposter("r_box_poster").then((res) => {
      let poster = res;
      if (poster) {
        this.setState(
          {
            form: poster,
          },
          () => {
            this.changeinputval();
          }
        );
      }
      console.log(poster);
    });
  }

  updateposter() {
    this.changeinputval();
    PosterBackend.updateposter_info(this.state.form).then((res) => {
      if (res.status === "ok") {
        this.setState({
          message: i18next.t("poster:Update poster information success"),
        });
      } else {
        this.setState({
          message: res?.msg,
        });
      }
    });
  }

  clearMessage() {
    this.setState({
      message: "",
    });
  }

  inputChange(id) {
    let a_val = this.adver.current.value;
    let l_val = this.links.current.value;
    let p_val = this.p_link.current.value;
    this.setState({
      form: {
        advertiser: a_val,
        link: l_val,
        picture_link: p_val,
        id: id,
        state: "1",
      },
    });
  }

  render() {
    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            <Card
              title={i18next.t("poster:Poster management")}
              style={{
                alignItems: "center",
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <div>
                {this.state.message !== "" ? (
                  <Alert
                    message={this.state.message}
                    type="info "
                    onClick={() => this.clearMessage()}
                    closable
                    style={{
                      marginBottom: "10px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  />
                ) : null}
                <Form
                  name="basic"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  autoComplete="off"
                >
                  <Form.Item
                    label={i18next.t("poster:Advertiser")}
                    name="Advertiser"
                    rules={[
                      { required: true, message: "Please input Advertiser!" },
                    ]}
                  >
                    <Input
                      onChange={() => this.inputChange("r_box_poster")}
                      ref={this.adver}
                    />
                  </Form.Item>

                  <Form.Item
                    label={i18next.t("poster:Link")}
                    name="link"
                    rules={[
                      { required: true, message: "Please input your ad link!" },
                    ]}
                  >
                    <Input
                      onChange={() => this.inputChange("r_box_poster")}
                      ref={this.links}
                    />
                  </Form.Item>

                  <Form.Item
                    label={i18next.t("poster:Picture link")}
                    name="picture_link"
                    rules={[
                      {
                        required: true,
                        message: "Please input your picture link!",
                      },
                    ]}
                  >
                    <Input
                      onChange={() => this.inputChange("r_box_poster")}
                      ref={this.p_link}
                    />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={() => this.updateposter("r_box_poster")}
                    >
                      {i18next.t("poster:Save")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(AdminPoster);
