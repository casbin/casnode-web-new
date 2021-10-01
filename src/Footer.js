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
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import * as BasicBackend from "./backend/BasicBackend";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import i18next from "i18next";
import { Layout } from "antd";

import Container from "./components/container";
import { createFromIconfontCN } from "@ant-design/icons";

import "./Footer.css";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2717339_hu7ls0q10p.js",
});
const { Footer } = Layout;

class PageFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      version: "",
      online: 0,
      highest: 0,
    };
  }

  componentDidMount() {
    this.getForumVersion();
    this.getOnlineNum();
  }

  getForumVersion() {
    BasicBackend.getForumVersion().then((res) => {
      this.setState({
        version: res.data,
      });
    });
  }

  getOnlineNum() {
    BasicBackend.getOnlineNum().then((res) => {
      this.setState({
        online: res?.data,
        highest: res?.data2,
      });
    });
  }

  render() {
    const loadingTime = Math.floor(
      performance.getEntries()[0].responseEnd -
        performance.getEntries()[0].requestStart
    );
    const date = new Date();

    if (!Setting.PcBrowser) {
      return (
        <div id="Bottom">
          <div className="content">
            <div className="inner" style={{ textAlign: "center" }}>
              &copy; {date.getFullYear()} {Setting.getForumName()} ·{" "}
              {loadingTime}ms ·{" "}
              <a
                href={`${Conf.GithubRepo}/commit/${this.state.version}`}
                target="_blank"
              >
                {this.state.version.substring(0, 7)}
              </a>
              <div>
                <strong>
                  <Link to="/about" className="dark">
                    {i18next.t("footer:About")}
                  </Link>
                  &nbsp;·&nbsp;
                  <Link
                    to={{
                      pathname: "/select/language",
                      query: { previous: this.props.location.pathname },
                    }}
                    title="Select Language"
                    className="dark"
                  >
                    Language
                  </Link>
                </strong>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const utcTime = moment().utc(false).format("HH:mm");
    const laxTime = moment().utcOffset(-7).format("HH:mm");
    const pvgTime = moment().format("HH:mm");
    const jfkTime = moment().utcOffset(-4).format("HH:mm");

    return (
      <Footer
        style={{
          justifyContent: "center",
          backgroundColor: "#f4f4f4",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          padding: "0px",
        }}
      >
        <Container BreakpointStage={this.props.BreakpointStage}>
          <div className="fr">
            <a
              href={Conf.FrontConfig.footerLogoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                id="logoFooter"
                style={{
                  backgroundImage: `url(${Conf.FrontConfig.footerLogoImage})`,
                }}
              />
            </a>
          </div>
          {/*<div className="fr">*/}
          {/*  <a href="https://casbin.org" target="_blank">*/}
          {/*    <div className="footer-logo" />*/}
          {/*  </a>*/}
          {/*</div>*/}
          <div style={{ flex: "1", alignItems: "center", fontSize: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <Link to="/about" target="_self" className="titles">
                {i18next.t("footer:About")}
              </Link>
              <span className="slash">/</span>
              <Link to="/faq" target="_self" className="titles">
                FAQ
              </Link>
              <span className="slash">/</span>
              <Link to="/api" target="_self" className="titles">
                API
              </Link>
              <span className="slash">/</span>
              <Link to="/mission" target="_self" className="titles">
                {i18next.t("footer:Mission")}
              </Link>
              <span className="slash">/</span>
              <Link to="/advertise" target="_self" className="titles">
                {i18next.t("footer:Advertise")}
              </Link>
              <span className="slash">/</span>
              <Link to="/advertise/2019.html" target="_self" className="titles">
                {i18next.t("footer:Thanks")}
              </Link>
              <span className="slash">/</span>
              <Link to="/tools" target="_self" className="titles">
                {i18next.t("footer:Tools")}
              </Link>
            </div>

            <div style={{ textAlign: "center" }}>
              <span style={{ marginRight: "30px" }}>
                {this.state.online} {i18next.t("footer:Online")}
                <span style={{ marginLeft: "10px" }}>
                  {i18next.t("footer:Highest")}
                  {":"} {this.state.highest}
                </span>
              </span>
              {i18next.t("footer:Community of Creators")}
              <div style={{ color: "gray" }}>
                {Conf.FrontConfig.footerDeclaration}
              </div>
            </div>
            <div style={{ textAlign: "center", color: "gray" }}>
              VERSION:
              <a
                href={`${Conf.GithubRepo}/commit/${this.state.version}`}
                target="_blank"
              >
                {this.state.version.substring(0, 7)}
              </a>
              · {loadingTime}ms · UTC {utcTime} · PVG {pvgTime} · LAX {laxTime}·
              JFK {jfkTime}
              <br />
              {Conf.FrontConfig.footerAdvise}
            </div>
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <IconFont style={{ fontSize: "25px" }} type="icon-rss" />

              <span style={{ marginLeft: "30px" }}>
                <Link
                  to={{
                    pathname: "/select/language",
                    query: { previous: this.props.location.pathname },
                  }}
                  className="f11"
                >
                  <img
                    src={Setting.getStatic("/img/language.png")}
                    width="16"
                    align="absmiddle"
                    id="ico-select-language"
                  />{" "}
                  {i18next.t("footer:Select Language")}
                </Link>
                &nbsp;
                <Link to="/select/editorType" className="f11">
                  <img
                    src={Setting.getStatic("/img/editType.png")}
                    width="16"
                    align="absmiddle"
                    id="ico-select-editorType"
                  />{" "}
                  {i18next.t("footer:Select Editor")}
                </Link>
              </span>
            </div>
          </div>
        </Container>
      </Footer>
    );
  }
}

export default withRouter(PageFooter);
