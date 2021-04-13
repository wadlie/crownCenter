import React, { Component } from "react";
//import Grid from '@material-ui/core/Grid';

//import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import { Map, TileLayer, Marker, Popup } from "../node_modules/react-leaflet";
import L from "leaflet";
import axios from "axios";
import ErrorScreen from "./ErrorScreen";
import FarmScreen from "./FarmScreen";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs.js";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import openSocket from 'socket.io-client';
const  socket = openSocket('/');

delete L.Icon.Default.prototype._getIconUrl; //Makes markers work. I dont understand it, it just works
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

class HomePage extends Component {
  constructor(props) {
    super(props);
    /*
    * Value state used for the map farm lookup input field
    * Default position is College park Maryland
    * farmCode is used when changing the centralized pin for map
    * */
    this.state = {
      value: "",
      position: [38.9869183,-76.9425543],
      farmCode: "",
      farmsInfo: [], //stores get request
      dynamicMark: [], // will hold the html for markers
      sideTabIdx: 0 // current index of sidetab
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios
      .get("/api/farm", {headers: 
        {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}})
      .then(response => this.setState({ farmsInfo: response.data }));
      socket.on('farm', res => this.setState({ farmsInfo: res }))

  }

  /*
  Builds the farmsInfo list to hold lat and long variables
  */
  setFarmCode = farmcode => {
    this.state.farmsInfo.forEach(info => {
      if (info.farmcode === farmcode) {
        var lat = info.latitude;
        var long = info.longitude;
        this.setState({ position: [lat, long] });
      }
    });

    this.setState({ value: farmcode });
  };

  handleChange(event) {
    this.setState({ farmCode: "" });
    //var url = 'http://localhost:3000/api/farm/findOne';
    //axios.get(url,{params:{"farmcode": event.target.value} }).then(response => this.setState({farmCode: response.data}))
    this.state.farmsInfo.forEach(info => {
      if (info.farmcode === event.target.value) {
        var lat = info.latitude;
        var long = info.longitude;
        this.setState({ position: [lat, long] });
      }
    });

    this.setState({ value: event.target.value });
  }

  /*
    Returns the percent sign for soil percent
  */
  percentSoil(entry) {
    if (this.props.percents[entry.farmcode] !== undefined) {
      return this.props.percents[entry.farmcode].soil + "%";
    }
  }
    /*
      Returns the percent sign for biomass percent
    */
  percentBiomass(entry) {
    if (this.props.percents[entry.farmcode] !== undefined) {
      return this.props.percents[entry.farmcode].biomass + "%";
    }
  }
    /*
      Returns the percent sign for bag percent
    */
  percentBag(entry) {
    if (this.props.percents[entry.farmcode] !== undefined) {
      return this.props.percents[entry.farmcode].bag + "%";
    }
  }
    /*
      Returns the percent sign for yield percent
    */
  percentYield(entry) {
    if (this.props.percents[entry.farmcode] !== undefined) {
      return this.props.percents[entry.farmcode].yield + "%";
    }
  }

  render() {
    var mapStyle = {
      //style for map
      height: "100%",

      width: "100%",
      float: "left"
    };
    var homeStyle = {
      //Style for the whole tabbed page
      height: "100%",
      margin: "auto"
    };

    var textStyle = {
      //style for the input text to use
      width: "100%",
      paddingLeft: "5px"
    };
    console.log(this.state.api)
    return (
      <div style={homeStyle} className="container-fluid">
        <div className="row">
          <div className="col-3" style={{ paddingRight: 0 }}>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-md">
                  Farmcode
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Medium"
                aria-describedby="inputGroup-sizing-md"
                onChange={this.handleChange}
                value={this.state.value}
                
              />
            </InputGroup>
            {/* <form >
                    <label style={{width:"100%"}}>
                        <input type="text" style={textStyle} value={this.state.value} onChange={this.handleChange} placeholder="Enter a farm code or state" />
                    </label>
                </form> */}
          </div>
          <div className="col-1" style={{ paddingLeft: 5 }}>
            <i
              style={{ fontSize: "2em" }}
              disabled
              className="fa fa-info-circle"
              data-toggle="tooltip"
              data-placement="top"
              title="Please enter a farm code or state to view location of a farm. Clicking on the popup will provide additional information about the farm"
            />
          </div>
        </div>
        <div className="row" style={mapStyle}>
          <div className="col-lg-9 col-sm-12" style={{ height: "100%" }}>
            <Map
              center={this.state.position}
              zoom={13}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {this.state.farmsInfo.map(post => (
                <Marker
                  key={post.id}
                  position={[post.latitude, post.longitude]}
                >
                  <Popup>
                    Farm Code: {post.farmcode}
                    <br />
                    Year: {post.year}
                    <br />
                    State: {post.state}
                    <br />
                    Soil: {this.percentSoil(post)}
                    <br />
                    Biomass: {this.percentBiomass(post)}
                    <br />
                    Bag: {this.percentBag(post)}
                    <br />
                    Yield: {this.percentYield(post)}
                    <br />
                    Notes: {post.note}
                    <br />
                    <a
                      href={
                        // "https://www.google.com/maps/@" +
                        "https://www.google.com/maps/place/" + 
                        post.latitude +
                        "," +
                        post.longitude// +
                        // ",7z"
                      }
                      target="_blank"
                    >
                      Google map
                    </a>
                  </Popup>
                </Marker>
              ))}
            </Map>
          </div>
          <div
            className="col-lg-3 col-sm-12"
            style={{ height: "100%", maxHeight: "100%" }}
          >
            <Tabs defaultActiveKey="errorlogstab" id="side_tab">
              <Tab
                eventKey="errorlogstab"
                title="Error Logs"
                style={{ height: "100%" }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "black",
                    overflowY: "scroll"
                  }}
                >
                  <ErrorScreen />
                </div>
              </Tab>
              <Tab eventKey="farmtab" title="Farms" style={{ height: "100%" }}>
                <FarmScreen setFarmCode={this.setFarmCode} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
