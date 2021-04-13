import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import gardener_lg from "./images/gardener_lg.png";
import Spinner from "react-bootstrap/Spinner";

class LoadingScreen extends React.Component {
  render() {
      const centerLoader = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-50px',
        marginLeft: '-50px',
        width: "100px",
        height: '100px'
      }
    return (
      <div style={centerLoader}>
            <Spinner animation="border" style={{width: '5em', height: '5em'}} />
      </div>
    );
  }
}

export default LoadingScreen;
