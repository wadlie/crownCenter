import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs.js";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import HomePage from "./homepage";
import Sensor from "./sensor";
import FormPage from "./formPage";
import About from "./about";
import axios from "axios";

import gardener from "./images/gardener.png";
import LoadingScreen from "./LoadingScreen";
import FAQ from "./FAQ";
import Docs from "./Documentation";
import Button from "react-bootstrap/Button";

import { onNewFormSubmission, onNewFarm } from "./socket";

class Header extends React.Component {
  render() {
    var textStyle = {
      fontSize: 28,
      fontFamily: "sans-serif",
      color: "#333",
      fontWeight: "bold",
      weight: "100%",
      height: "10%",
      padding: "20px"
    };
    var hrStyle = {
      marginTop: "0.4rem",
      borderTop: "1.2px solid #8c8b8b"
    };

    return (
      <>
        <Navbar bg="light">
          <Navbar.Brand href="#home">
            <img src={gardener} /> CROWNCenter Dashboard
          </Navbar.Brand>

          <Nav className="justify-content-end">
            <Nav.Link href="./about">About</Nav.Link>
          </Nav>
        </Navbar>
      </>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="container" style={{ bottom: 0 }}>
        Icons made by{" "}
        <a href="https://www.freepik.com/" title="Freepik">
          Freepik
        </a>{" "}
        from{" "}
        <a href="https://www.flaticon.com/" title="Flaticon">
          www.flaticon.com
        </a>{" "}
        is licensed by{" "}
        <a
          href="http://creativecommons.org/licenses/by/3.0/"
          title="Creative Commons BY 3.0"
          target="_blank"
        >
          CC 3.0 BY
        </a>
      </div>
    );
  }
}

class TabsSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingForm: true,
      isLoadingFarm: true,
      formSub: [],
      farmsInfo: []
    };

    this.percentSoil = this.percentSoil.bind(this);
    onNewFormSubmission((err, formsubmissions) => {
      this.setState({ formSub: formsubmissions });
    });

    onNewFarm((err, farms) => {
      this.setState({ farmsInfo: farms });
    });
  }

  /* When application runs, this is run
   *  Runs 2 api requests, first gets all the form submissions and stores it into the state 'formSub'
   *  Second gets all farm's info and stores them in the state 'farmsInfo'
   * */
  componentDidMount() {
    axios
      .get("/api/formsubmission", {headers: 
        {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}})
      .then(response =>
        this.setState({ formSub: response.data, isLoadingForm: false })
      );
    axios
      .get("/api/farm", {headers: 
        {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}})
      .then(res =>
        this.setState({ farmsInfo: res.data, isLoadingFarm: false })
      );

    //axios.get('URL',
    // {headers: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA0LTI0VDE5OjAyOjE1Ljg1NloiLCJpYXQiOjE1NTYxMzI1MzV9.P9rfjFbYplP85kc1X99Jr5Pig8wtGHkOu2OOTDP7k_o"} }
    // ).then(response => this.setState({formSub: response.data}));
  }

  /*
  Function that calculates the percentages of a specific formSoil Submission.
  Finds the amount of nulls and divides it by the total amount of available values.
  Then subtracts the ratio of nulls fom 100 to get the percentages of non-null values
   */
  percentSoil(soilJson, len) {
    if (len === 0) {
      return 0;
    }
    var dist = 15; // 15 without notes
    var totalSize = dist * len;
    var count = 0; // count for nulls
    Object.keys(soilJson).forEach(item => {
      // Item is each indivisual form Soil per farmcode
      if (soilJson[item].barcode === null) {
        count++;
      }
      if (soilJson[item].empty_bag_weight === null) {
        count++;
      }
      if (soilJson[item].total_moist_weight === null) {
        count++;
      }
      if (soilJson[item].total_rock_weight === null) {
        count++;
      }
      if (soilJson[item].tin_sub_empty_weight === null) {
        count++;
      }
      if (soilJson[item].tin_sub_moist_weight === null) {
        count++;
      }
      if (soilJson[item].tin_sub_dry_weight === null) {
        count++;
      }
      if (soilJson[item].vial_number === null) {
        count++;
      }
      if (soilJson[item].soil_dry_weight === null) {
        count++;
      }
      if (soilJson[item].ammonium_content === null) {
        count++;
      }
      if (soilJson[item].nitrate_content === null) {
        count++;
      }
      if (soilJson[item].sand === null) {
        count++;
      }
      if (soilJson[item].silt === null) {
        count++;
      }
      if (soilJson[item].clay === null) {
        count++;
      }
      if (soilJson[item].textural_class === null) {
        count++;
      }
      //console.log(JSON.stringify(soilJson[item],null,2))
    });
    return 100 - (count / totalSize).toFixed(4) * 100;
  }

  /*
  Function that calculates the percentages of a specific formBiomass Submission.
  Finds the amount of nulls and divides it by the total amount of available values.
  Then subtracts the ratio of nulls fom 100 to get the percentages of non-null values
 */
  percentBiomass(bioJson, len) {
    if (len === 0) {
      return 0;
    }
    var dist = 8;
    var totalSize = dist * len;
    var count = 0; // count for nulls
    Object.keys(bioJson).forEach(item => {
      if (bioJson[item].barcode === null) {
        count++;
      }
      if (bioJson[item].drill_line_spacing === null) {
        count++;
      }
      if (bioJson[item].subsample_a_weight === null) {
        count++;
      }
      if (bioJson[item].subsample_b_weight === null) {
        count++;
      }
      if (bioJson[item].empty_bag_weight === null) {
        count++;
      }
      if (bioJson[item].average_fresh_biomass_excludes_bag_weight === null) {
        count++;
      }
      if (bioJson[item].target_fresh_biomass_per_bag_weight === null) {
        count++;
      }
      if (bioJson[item].is_over_40_percent_legume === null) {
        count++;
      }
      //console.log(JSON.stringify(bioJson[item],null,2))
    });
    return 100 - (count / totalSize).toFixed(4) * 100;
  }

  /*
Function that calculates the percentages of a specific formYield Submission.
Finds the amount of nulls and divides it by the total amount of available values.
Then subtracts the ratio of nulls fom 100 to get the percentages of non-null values
 */
  percentYield(yieldJson, len) {
    if (len === 0) {
      return 0;
    }
    var dist = 8;
    var totalSize = dist * len;
    var count = 0; // count for nulls
    Object.keys(yieldJson).forEach(item => {
      if (yieldJson[item].barcode === null) {
        count++;
      }
      if (yieldJson[item].row_spacing === null) {
        count++;
      }
      if (yieldJson[item].grain_weight_per_ten_feet === null) {
        count++;
      }
      if (yieldJson[item].grain_moisture_one === null) {
        count++;
      }
      if (yieldJson[item].grain_moisture_two === null) {
        count++;
      }
      if (yieldJson[item].grain_test_weight_one === null) {
        count++;
      }
      if (yieldJson[item].grain_test_weight_two === null) {
        count++;
      }
      if (yieldJson[item].number_of_plants_per_ten_feet_long_row === null) {
        count++;
      }
      //console.log(JSON.stringify(bioJson[item],null,2))
    });
    return 100 - (count / totalSize).toFixed(4) * 100;
  }

  /*
Function that calculates the percentages of a specific formBag Submission.
Finds the amount of nulls and divides it by the total amount of available values.
Then subtracts the ratio of nulls fom 100 to get the percentages of non-null values
 */
  percentBag(bagJson, len) {
    if (len === 0) {
      return 0;
    }
    var dist = 19;
    var totalSize = dist * len;
    var count = 0; // count for nulls
    Object.keys(bagJson).forEach(item => {
      if (bagJson[item].barcode === null) {
        count++;
      }
      if (bagJson[item].bag_date_tid === null) {
        count++;
      }
      if (bagJson[item].bag_date === null) {
        count++;
      }
      if (bagJson[item].bag_date_target === null) {
        count++;
      }
      if (bagJson[item].painted_bag_number === null) {
        count++;
      }
      if (bagJson[item].empty_bag_weight === null) {
        count++;
      }
      if (bagJson[item].in_field_bag_fresh_weight === null) {
        count++;
      }
      if (bagJson[item].latitude === null) {
        count++;
      }
      if (bagJson[item].longitude === null) {
        count++;
      }
      if (bagJson[item].actual_recovery_date === null) {
        count++;
      }
      if (bagJson[item].total_dwt === null) {
        count++;
      }
      if (bagJson[item].crucible_weight === null) {
        count++;
      }
      if (bagJson[item].total_weight_65 === null) {
        count++;
      }
      if (bagJson[item].total_weight_550 === null) {
        count++;
      }
      if (bagJson[item].oven_dry_weight === null) {
        count++;
      }
      if (bagJson[item].ash_weight === null) {
        count++;
      }
      if (bagJson[item].ash_one_litter_weight === null) {
        count++;
      }
      if (bagJson[item].carbon_concentration_percent === null) {
        count++;
      }
      if (bagJson[item].nitrogen_concentration_percent === null) {
        count++;
      }
      //console.log(JSON.stringify(bioJson[item],null,2))
    });
    return 100 - (count / totalSize).toFixed(4) * 100;
  }

  render() {
    /*Variable temp holds an array of key -> json objects with farmCodes as each key.
     * Uses farmsInfo to iterate and grab all farmCodes to be used as keys.
     * Each value of a  farmcode in Temp holds an array that gets appened to by forms from formSubmission
     * Variable temp Percent holds farmCodes as a key with json objects as values. This holds the integer percents that come from
     * functions percentSoil/Biomass/Yield/Bag*/
    let temp = [];
    let tempPercent = [];
    /*Iterate through farms and create key value pairs */
    if (this.state.farmsInfo !== []) {
      this.state.farmsInfo.forEach(item => {
        tempPercent[item.farmcode] = JSON.parse(
          '{"state":"","year":"","soil":0,"biomass":0,"yield":0,"bag":0}'
        );
        temp[item.farmcode] = JSON.parse(
          '{"state":"","year":"","soil":[],"biomass":[],"yield":[],"bag":[]}'
        );
        temp[item.farmcode].state = item.state;
        temp[item.farmcode].year = item.year;
        tempPercent[item.farmcode].state = item.state;
        tempPercent[item.farmcode].year = item.year;
      });
    }
    if (Object.keys(temp).length !== 0) {
      this.state.formSub.forEach(item => {
        if (item.FormBag !== null) {
          temp[item.farmcode].bag.push(item.FormBag);
        }
        if (item.FormSoil !== null) {
          temp[item.farmcode].soil.push(item.FormSoil);
        }
        if (item.FormYield !== null) {
          temp[item.farmcode].yield.push(item.FormYield);
        }
        if (item.FormBiomass !== null) {
          temp[item.farmcode].biomass.push(item.FormBiomass);
        }
      });
    }
    if (Object.keys(temp).length !== 0) {
      Object.keys(temp).forEach(item => {
        var soilx = temp[item].soil;
        var biomassx = temp[item].biomass;
        var yieldx = temp[item].yield;
        var bagx = temp[item].bag;
        // item => farmcode
        var soilLen = Object.keys(soilx).length;
        var biomassLen = Object.keys(biomassx).length;
        var yieldLen = Object.keys(yieldx).length;
        var bagLen = Object.keys(bagx).length;

        var soilPer = this.percentSoil(soilx, soilLen);
        var bioPer = this.percentBiomass(biomassx, biomassLen);
        var yieldPer = this.percentYield(yieldx, yieldLen);
        var bagPer = this.percentBag(bagx, bagLen);
        //console.log(JSON.stringify(bagx,null,2))
        //console.log(bagPer);
        tempPercent[item].soil = soilPer.toFixed(2);
        tempPercent[item].biomass = bioPer.toFixed(2);
        tempPercent[item].yield = yieldPer.toFixed(2);
        tempPercent[item].bag = bagPer.toFixed(2);
        //console.log(item + ": " + JSON.stringify(tempPercent[item],null,2));
      });
    }

    var tabStyle = {
      border: "15px",
      width: "100%",
      margin: "auto",
      paddingLeft: 20,
      paddingRight: 20,
      height: "90%"
    };
    var indivisualTabStyle = {
      margin: "auto",
      width: "100%",
      height: "100%",
      padding: "15px"
    };
    if (this.state.isLoadingFarm || this.state.isLoadingForm) {
      return <LoadingScreen />;
    } else {
      /*
       *  Uses Bootstrap tab to create individual tab pages. for each page we need. Calls a component per tab
       *  */
        return (
            <div style={tabStyle}>
              <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
                <Tab eventKey="home" title="Home" style={indivisualTabStyle}>
                  <HomePage percents={tempPercent} />
                </Tab>
                <Tab eventKey="Sensor" title="Sensor" style={indivisualTabStyle}>
                  <Sensor />
                </Tab>
                <Tab eventKey="Form" title="Form" style={indivisualTabStyle}>
                  <FormPage percents={tempPercent} fullInfo={temp}/>
                </Tab>
                <Tab eventKey="FAQ" title="FAQ" style={indivisualTabStyle}>
                  <FAQ />
                </Tab>
                <Tab eventKey="Docs" title="Docs" style={indivisualTabStyle}>
                  <Docs />
                </Tab>
              </Tabs>
            </div>
          );

    }
  }
}

var overallStyle = {
  height: "100%"
};
ReactDOM.render(
  <div style={overallStyle}>
    <Header />
    <TabsSection />
    {/* <Footer /> */}
  </div>,
  document.querySelector("#container")
);
