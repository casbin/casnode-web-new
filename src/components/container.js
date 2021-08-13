import React from "react";

export default class Container extends React.Component {
  render() {
    let contentWidth = 0;

    if (this.props.BreakpointStage == "stage1") {
      contentWidth = 1270;
    } else if (this.props.BreakpointStage == "stage2") {
      contentWidth = 1070;
    } else if (this.props.BreakpointStage == "stage3") {
      contentWidth = 785;
    } else if (this.props.BreakpointStage == "stage4") {
      contentWidth = 580;
    }

    return (
      <div
        className="container"
        style={{
          justifyContent: "center",
          position: "relative",
          display: "flex",
          width:
            this.props.BreakpointStage != "stage5"
              ? [`${contentWidth}px`]
              : "100%",
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
