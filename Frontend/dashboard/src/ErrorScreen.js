import React from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.css';


class ErrorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    axios
      .get("/api/errorlog/filter?count=25", {headers: 
        {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}})
      .then(response => this.setState({ errors: response.data }));
  }

  render() {
    if (this.state.errors) {
      return (
        <div style={{height:"100%",maxHeight:"100%"}}>
          <ol style={{wordBreak:"break-word"}}>
            {this.state.errors.map((value, index) => {
              return <li style={{"color": "white", fontSize: '0.8em'}} key={index}>
              <b style={{'color': 'yellow'}}>({value.createdAt}) </b>farmcode: <b style={{'color':'green'}}> {value.farmcode}</b>  
              {" " + value.type} error with message: <b style={{'color':'red'}}>{value.message}</b></li>;
            })}
          </ol>
        </div>
      );
    }else{
        return("No errors")
    }
  }
}

export default ErrorScreen;
