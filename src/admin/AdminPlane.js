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
import Container from "../components/container.js";
import { Card, Alert, Button, Form, Input, Tabs } from "antd";

import "./AdminPlane.css";
const { TabPane } = Tabs;

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

  handleColorChange = (color, event) => {
    if (event === "color") {
      this.updateFormField("color", color.hex);
      return;
    }

    this.updateFormField("backgroundColor", color.hex);
  };

  handleColorClick = (event) => {
    if (event === "color") {
      this.setState({
        displayColorPicker: !this.state.displayColorPicker,
      });
      return;
    }

    this.setState({
      displayBackgroundColorPicker: !this.state.displayBackgroundColorPicker,
    });
  };

  handleColorClose = (event) => {
    if (event === "color") {
      this.setState({
        displayColorPicker: false,
      });
      return;
    }

    this.setState({
      displayBackgroundColorPicker: false,
    });
  };

  changeEvent(event) {
    this.setState({
      event: event,
      message: "",
    });
    if (this.props.event !== "new") {
      this.initForm();
    }
  }

  resetColor(event) {
    if (event === "color") {
      this.updateFormField("color", this.state.color);
      return;
    }

    this.updateFormField("backgroundColor", this.state.backgroundColor);
  }

  renderColorPicker(event) {
    return (
      <div
        style={{
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        }}
        onClick={() => this.handleColorClick(event)}
      >
        <div
          style={{
            width: "36px",
            height: "14px",
            borderRadius: "2px",
            background:
              event === "color"
                ? `${this.state.form.color}`
                : `${this.state.form.backgroundColor}`,
          }}
        />
      </div>
    );
  }

  renderNode(node) {
    return (
      <span>
        <Link to={`/go/${encodeURIComponent(node.id)}`}>{node.name}</Link>{" "}
        &nbsp;{" "}
      </span>
    );
  }

  renderProblem() {
    let problems = [];

    if (this.state.errorMessage !== "") {
      problems.push(i18next.t(`error:${this.state.errorMessage}`));
    }

    if (problems.length === 0) {
      return null;
    }

    return (
      <div>
        <Alert
          message={i18next.t(
            "error:Please resolve the following issues before submitting"
          )}
          type="error"
          onClick={() => this.clearErrorMessage()}
          closable
          style={{
            marginBottom: "10px",
            alignItems: "center",
            cursor: "pointer",
          }}
        />
        {problems.map((problem) => {
          return (
            <Alert
              message={problem}
              type="error"
              onClick={() => this.clearErrorMessage()}
              closable
              style={{
                marginBottom: "10px",
                alignItems: "center",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
    );
  }

  renderManagementList(item) {
    return (
      <a
        href="javascript:void(0);"
        className={this.state.event === item.value ? "tab_current" : "tab"}
        onClick={() => this.changeEvent(item.value)}
      >
        {i18next.t(`plane:${item.label}`)}
      </a>
    );
  }

  renderPlanes(plane) {
    const pcBrowser = Setting.PcBrowser;

    return (
      <div className="cell">
        <table cellPadding="0" cellSpacing="0" border="0" width="100%">
          <tbody>
            <tr>
              <td width={pcBrowser ? "200" : "auto"} align="left">
                <span className="gray">{plane?.name}</span>
              </td>
              <td width={pcBrowser ? "100" : "auto"} align="center">
                <Button href={`/admin/plane/edit/${plane?.id}`}>
                  {i18next.t("plane:Manage")}
                </Button>
              </td>
              <td width="10"></td>
              <td
                width={pcBrowser ? "120" : "80"}
                valign="middle"
                style={{ textAlign: "center" }}
              >
                <span style={{ fontSize: "13px" }}>
                  {plane?.nodesNum} {i18next.t("plane:nodes")}
                </span>
              </td>
              <td
                width={pcBrowser ? "120" : "80"}
                align="left"
                style={{ textAlign: "center" }}
              >
                {plane?.visible ? (
                  <span className="positive">{i18next.t("plane:Visible")}</span>
                ) : (
                  <span className="gray">{i18next.t("plane:Invisible")}</span>
                )}
              </td>
              <td width="50" align="left" style={{ textAlign: "right" }}>
                <Button
                  danger
                  onClick={() =>
                    this.deletePlane(plane?.name, plane?.id, plane?.nodesNum)
                  }
                >
                  {i18next.t("plane:Delete")}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderBasic() {
    const plane = this.state.plane;
    const newPlane = this.props.event === "new";
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          {this.renderProblem()}
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
          <div className="inner">
            <table cellPadding="8" cellSpacing="0" border="0" width="100%">
              <tbody>
                {newPlane ? (
                  <tr>
                    <td width="120" align="right">
                      {i18next.t("plane:Plane ID")}
                    </td>
                    <td width="auto" align="left">
                      <Input
                        type="text"
                        className="sl"
                        style={{ width: "200px" }}
                        name="id"
                        id="plane_id"
                        value={this.state.form?.id}
                        onChange={(event) =>
                          this.updateFormField("id", event.target.value)
                        }
                        autoComplete="off"
                      />
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Plane name")}
                  </td>
                  <td width="auto" align="left">
                    <Input
                      type="text"
                      className="sl"
                      style={{ width: "200px" }}
                      name="name"
                      id="plane_name"
                      value={
                        this.state.form?.name === undefined
                          ? ""
                          : this.state.form?.name
                      }
                      onChange={(event) =>
                        this.updateFormField("name", event.target.value)
                      }
                      autoComplete="off"
                    />
                  </td>
                </tr>
                {!newPlane ? (
                  <tr>
                    <td width="120" align="right">
                      {i18next.t("plane:Created time")}
                    </td>
                    <td width="auto" align="left">
                      <span className="gray">{plane?.createdTime}</span>
                    </td>
                  </tr>
                ) : null}
                {!newPlane ? (
                  <tr>
                    <td width="120" align="right">
                      {i18next.t("plane:Total nodes")}
                    </td>
                    <td width="auto" align="left">
                      <span className="gray">{plane?.nodesNum}</span>
                    </td>
                  </tr>
                ) : null}
                {!newPlane ? (
                  <tr>
                    <td width="120" align="right">
                      {i18next.t("plane:Nodes")}
                    </td>
                    <td width="auto" align="left">
                      <span className="gray">
                        {this.state.plane?.nodes.length !== 0
                          ? this.state.plane?.nodes.map((node) =>
                              this.renderNode(node)
                            )
                          : i18next.t("plane:No node yet")}
                      </span>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Sorter")}
                  </td>
                  <td width="auto" align="left">
                    <Input
                      type="range"
                      className="range-input"
                      min="1"
                      max="1000"
                      step="1"
                      value={
                        this.state.form?.sorter === undefined
                          ? 1
                          : this.state.form?.sorter
                      }
                      onChange={(event) =>
                        this.updateFormField(
                          "sorter",
                          parseInt(event.target.value)
                        )
                      }
                    />
                    &nbsp; &nbsp;{" "}
                    <input
                      type="number"
                      className="number-input"
                      name="sorter"
                      min="1"
                      max="1000"
                      step="1"
                      value={this.state.form?.sorter}
                      onChange={(event) =>
                        this.updateFormField(
                          "sorter",
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right"></td>
                  <td width="auto" align="left">
                    <span className="gray">
                      {i18next.t("plane:Decide the order of node navigation")}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Visible")}
                  </td>
                  <td width="auto" align="left">
                    <input
                      type="radio"
                      onClick={() => this.updateFormField("visible", true)}
                      checked={this.state.form?.visible}
                      name="visible"
                    />
                    {i18next.t("plane:Visible")}{" "}
                    <input
                      type="radio"
                      onClick={() => this.updateFormField("visible", false)}
                      checked={!this.state.form?.visible}
                      name="visible"
                    />
                    {i18next.t("plane:Invisible")}
                  </td>
                </tr>
                {!this.state.form.visible ? (
                  <tr>
                    <td width="120" align="right"></td>
                    <td width="auto" align="left">
                      <span className="gray">
                        {i18next.t(
                          "plane:This plane will not appear on the node navigation"
                        )}
                      </span>
                    </td>
                  </tr>
                ) : null}
                <tr>
                  <td width="120" align="right"></td>
                  <td width="auto" align="left">
                    {!newPlane ? (
                      <Button
                        type="primary"
                        onClick={() => this.updatePlaneInfo()}
                      >
                        {i18next.t("plane:Save")}
                      </Button>
                    ) : null}
                  </td>
                </tr>
                {newPlane ? (
                  <tr>
                    <td width="120" align="right"></td>
                    <td width="auto" align="left">
                      <span className="gray">
                        {i18next.t(
                          "plane:Please go to the display page to continue to improve the information and submit"
                        )}
                      </span>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  renderDisplay() {
    const plane = this.state.plane;
    const newPlane = this.props.event === "new";
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          {this.renderProblem()}
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
            <table cellPadding="8" cellSpacing="0" border="0" width="100%">
              <tbody>
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Image")}
                  </td>
                  <td width="auto" align="left">
                    {this.state.form?.image === undefined ||
                    this.state.form?.image === "" ? (
                      <span className="gray">{i18next.t("plane:Not set")}</span>
                    ) : (
                      <Zmage
                        src={this.state.form?.image}
                        alt={this.state.form?.id}
                        style={{ maxWidth: "48px", maxHeight: "48px" }}
                      />
                    )}
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right">
                    {newPlane
                      ? i18next.t("plane:Set image")
                      : i18next.t("plane:Change image")}
                  </td>
                  <td width="auto" align="left">
                    <Input
                      type="text"
                      className="sl"
                      style={{ width: "200px" }}
                      name="image"
                      id="change_image"
                      style={{ width: "200px" }}
                      value={
                        this.state.form?.image === undefined
                          ? ""
                          : this.state.form?.image
                      }
                      onChange={(event) =>
                        this.updateFormField("image", event.target.value)
                      }
                      autoComplete="off"
                    />
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Font color")}
                  </td>
                  <td width="auto" align="left">
                    {this.renderColorPicker("color")}
                    {this.state.displayColorPicker ? (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: "2",
                        }}
                      >
                        <div
                          style={{
                            position: "fixed",
                            top: "0px",
                            right: "0px",
                            bottom: "0px",
                            left: "0px",
                          }}
                          onClick={() => this.handleColorClose("color")}
                        />
                        <SketchPicker
                          color={this.state.form.color}
                          onChange={(color) =>
                            this.handleColorChange(color, "color")
                          }
                        />
                      </div>
                    ) : null}{" "}
                    &nbsp;{" "}
                    {!newPlane ? (
                      <a href="#" onClick={() => this.resetColor("color")}>
                        {i18next.t("plane:Restore")}
                      </a>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Background color")}
                  </td>
                  <td width="auto" align="left">
                    {this.renderColorPicker("backgroundColor")}
                    {this.state.displayBackgroundColorPicker ? (
                      <div
                        style={{
                          position: "absolute",
                          zIndex: "2",
                        }}
                      >
                        <div
                          style={{
                            position: "fixed",
                            top: "0px",
                            right: "0px",
                            bottom: "0px",
                            left: "0px",
                          }}
                          onClick={() =>
                            this.handleColorClose("backgroundColor")
                          }
                        />
                        <SketchPicker
                          color={this.state.form.backgroundColor}
                          onChange={(color) =>
                            this.handleColorChange(color, "backgroundColor")
                          }
                        />
                      </div>
                    ) : null}{" "}
                    &nbsp;{" "}
                    {!newPlane ? (
                      <a
                        href="#"
                        onClick={() => this.resetColor("backgroundColor")}
                      >
                        {i18next.t("plane:Restore")}
                      </a>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right">
                    {i18next.t("plane:Preview")}
                  </td>
                  <td width="auto" align="left">
                    <div
                      className="header"
                      style={{
                        backgroundColor: this.state.form?.backgroundColor,
                        color: this.state.form?.color,
                        fontSize: Setting.PcBrowser ? "" : "13px",
                        width: "350px",
                      }}
                    >
                      <img
                        src={this.state.form?.image}
                        border="0"
                        align="absmiddle"
                        width="24"
                      />{" "}
                      &nbsp; {this.state.form?.name}
                      <span
                        className="fr"
                        style={{
                          color: this.state.form?.color,
                          lineHeight: "20px",
                        }}
                      >
                        {this.state.form?.id} •{" "}
                        {!newPlane ? (
                          <span className="small">{plane?.nodesNum} nodes</span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="120" align="right"></td>
                  <td width="auto" align="left">
                    {newPlane ? (
                      <Button type="submit" onClick={() => this.postNewPlane()}>
                        {i18next.t("plane:Create")}
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => this.updatePlaneInfo()}
                      >
                        {i18next.t("plane:Save")}
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  render() {
    const newPlane = this.props.event === "new";

    if (this.state.planeId !== undefined || newPlane) {
      if (this.state.planeId !== undefined) {
        if (this.state.plane !== null && this.state.plane.length === 0) {
          return (
            <div align="center">
              <Container BreakpointStage={this.props.BreakpointStage}>
                <div style={{ flex: "auto" }}>
                  <Card
                    title={i18next.t("loading:Page is loading")}
                    style={{
                      alignItems: "center",
                      flex: "auto",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                    }}
                  >
                    <span className="gray bigger">
                      {i18next.t("loading:Please wait patiently...")}
                    </span>
                  </Card>
                </div>
              </Container>
            </div>
          );
        }

        if (this.state.plane === null) {
          return (
            <div align="center">
              <Container BreakpointStage={this.props.BreakpointStage}>
                <div style={{ flex: "auto" }}>
                  <Card
                    title={i18next.t("error:Plane not found")}
                    style={{
                      alignItems: "center",
                      flex: "auto",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                    }}
                  >
                    <span className="gray bigger">
                      {i18next.t(
                        "error:The plane you are trying to view does not exist"
                      )}
                    </span>
                  </Card>
                </div>
              </Container>
            </div>
          );
        }
      }

      if (this.state.event === "basic") {
        return (
          <div align="center">
            <Container
              BreakpointStage={this.props.BreakpointStage}
              className="translation"
            >
              <div style={{ flex: "auto" }}>
                <Card
                  title={i18next.t("plane:Plane management")}
                  style={{
                    flex: "auto",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab={i18next.t(`plane:Basic Info`)} key="1">
                      {this.renderBasic()}
                    </TabPane>
                    <TabPane tab={i18next.t(`plane:Display`)} key="2">
                      {this.renderDisplay()}
                    </TabPane>
                  </Tabs>
                </Card>
              </div>
            </Container>
          </div>
        );
      }
    }

    return (
      <div align="center">
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div style={{ flex: "auto" }}>
            <Card
              title={
                <div>
                  {i18next.t("plane:Plane management")}
                  <div
                    className="fr f12"
                    style={{ paddingTop: "5px", paddingRight: "10px" }}
                  >
                    <span className="snow">
                      {i18next.t("plane:Total planes")} &nbsp;
                    </span>
                    <strong className="gray">
                      {this.state.planes === null
                        ? 0
                        : this.state.planes.length}
                    </strong>
                  </div>
                </div>
              }
              style={{
                flex: "auto",
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
              extra={
                <strong className="gray" style={{ paddingTop: "5px" }}>
                  <Link to="plane/new">{i18next.t("plane:Add new plane")}</Link>{" "}
                  &nbsp;
                </strong>
              }
            >
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
              <div id="all-planes">
                {this.state.planes !== null &&
                this.state.planes.length !== 0 ? (
                  this.state.planes.map((plane) => this.renderPlanes(plane))
                ) : (
                  <div
                    className="cell"
                    style={{
                      textAlign: "center",
                      height: "100px",
                      lineHeight: "100px",
                    }}
                  >
                    {this.state.planes === null
                      ? i18next.t("loading:Data is loading...")
                      : i18next.t("plane:No plant yet")}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(AdminPoster);
