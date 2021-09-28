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
import * as PlaneBackend from "../backend/PlaneBackend";
import * as NodeBackend from "../backend/NodeBackend";
import * as Setting from "../Setting";
import { Link } from "react-router-dom";
import i18next from "i18next";
import Container from "../components/container";
import { Card } from "antd";

class PlaneBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      planes: [],
      nodesNum: 0,
    };
  }

  componentDidMount() {
    this.getPlaneList();
    this.getNodesNum();
  }

  getPlaneList() {
    PlaneBackend.getPlaneList().then((res) => {
      this.setState({
        planes: res?.data,
      });
    });
  }

  getNodesNum() {
    NodeBackend.getNodesNum().then((res) => {
      this.setState({
        nodesNum: res?.data,
      });
    });
  }

  renderNode(node) {
    return (
      <Link
        key={node?.id}
        to={`/go/${encodeURIComponent(node?.id)}`}
        className="item_node"
      >
        {node?.name}
      </Link>
    );
  }

  renderPlane(plane) {
    return (
      <span key={plane?.id}>
        <div className="sep20"></div>
        <div className="box">
          <div
            className="header"
            style={{
              backgroundColor: plane?.backgroundColor,
              color: plane?.color,
            }}
          >
            <img src={plane?.image} border="0" align="absmiddle" width="24" />{" "}
            &nbsp; {plane?.name}
            <span
              className="fr"
              style={{ color: plane?.color, lineHeight: "20px" }}
            >
              {plane?.id} •{" "}
              <span className="small">{plane?.nodes.length} nodes</span>
            </span>
          </div>
          <div className="inner">
            {plane?.nodes.map((node) => {
              return this.renderNode(node);
            })}
          </div>
        </div>
      </span>
    );
  }

  render() {
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
                  {i18next.t("plane:Plane list")}&nbsp;
                </span>
                <span style={{ marginLeft: "5px", fontSize: "15px" }}>
                  {this.state.nodesNum} nodes now and growing.
                </span>
              </div>

              <span>
                {this.state.planes?.map((plane) => {
                  return this.renderPlane(plane);
                })}
              </span>
            </Card>
          </div>
        </Container>
      </div>
    );
  }
}

export default PlaneBox;
