import React from "react";
import { withRouter } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
    }
    if (errorInfo) {
      this.props.history.push("/error");
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
