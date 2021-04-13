import React from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import gardener from "./images/gardener.png";
import envelope from "./images/envelope.png";
import smartphone from "./images/smartphone.png";

import {onNewFarmFarmer} from './socket'

class FarmScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, farmer: { username: "temp", FarmFarmer: {is_active: false} }, farms: [] };
  
    onNewFarmFarmer((err, farms) => this.setState({farms: farms}))  
  }

  componentDidMount() {
    axios
      .get("/api/farmfarmer/ascend", {headers: 
        {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}})
      .then(response => this.setState({ farms: response.data }));
      
  }

  handleFarmSelect = e => {
    this.props.setFarmCode(e.target.innerText.split(" ")[0]);
  };

  handleModalShow(idx, farmer_idx) {
    let farmer = this.state.farms[idx].Farmers[farmer_idx];
    this.setState({ show: true, farmer: farmer });
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    if (this.state.farms) {
      return (
        <>
          <ListGroup
            variant="flush"
            style={{ overflowY: "scroll", height: "100%" }}
          >
            {this.state.farms.map((value, index) => {
              return (
                <div key={index}>
                  <ListGroup.Item
                    action
                    key={index}
                    onClick={this.handleFarmSelect}
                    bsPrefix="list-group-item"
                  >
                    {value.farmcode + " "}
                  </ListGroup.Item>
                  <Badge variant="primary">{value.state}</Badge>
                  <Badge variant="success">{value.year}</Badge>
                  <DropdownButton
                    id="dropdown-basic-button"
                    title="Farmers"
                    variant="info"
                    size="sm"
                    style={{ float: "right" }}
                  >
                    {value.Farmers.map((farmer, farmer_idx) => {
                      return (
                        <Dropdown.Item 
                          onClick={() =>
                            this.handleModalShow(index, farmer_idx)
                          }
                          key={farmer_idx}
                        >
                          {farmer.username}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </div>
              );
            })}
          </ListGroup>

          {/* Modal for farmer info  */}
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.farmer.username} 
              {this.state.farmer && this.state.farmer.FarmFarmer.is_active? 
              <Badge pill variant="success"> active </Badge> : 
              <Badge pill variant="secondary"> inactive </Badge>}
              </Modal.Title>

            </Modal.Header>
            <Modal.Body>
              <img src={gardener} />{" "}
              <p>
                <b>{this.state.farmer.lastname}</b>
              </p>
              <img src={envelope} />{" "}
              <p>
                <b>{this.state.farmer.email}</b>
              </p>
              <img src={smartphone} />{" "}
              <p>
                <b>{this.state.farmer.phone ? this.state.farmer.phone : "None"}</b>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    return "No farms found";
  }
}

export default FarmScreen;
