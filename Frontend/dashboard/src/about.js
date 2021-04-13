import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

class About extends Component {


    render() {
        var displayStyle = {
            display: "block",
            weight: "100%",
            height: "100%"
        }
        return(<a href="./about/index.html">Press</a>)
        // return (
        //     <div className="container-fluid" style={displayStyle}>

        //         <div className="row" style={{height:"85%",width:"100%",backgroundColor:"#808080",backgroundRepeat:"no-repeat",backgroundSize:"100% 100%", backgroundImage:"url(https://www.greenamerica.org/sites/default/files/2018-02/loren-gu-146826.jpg)"}}>
        //             <div className="container-fluid">
        //                 <div className="row" style={{height:"25%"}}>
        //                     <div className="col align-self-center">
        //                         <br/>
        //                     <h2 className="text-center text-uppercase text-black-50" style={{fontSize:"3.5em"}}>About</h2>
        //                 </div>
        //                 </div>
        //             <div className="row" style={{height:"5%"}}>
        //                 <div className="col align-self-center">
        //                     <hr className="star-light mb-5" style={{border:"2.5px solid gray",width:"40%"}}/>
        //                 </div>
        //             </div>
        //                 <div className="row" style={{height:"60%"}}>
        //                     <div className="col" style={{textAlign:"center"}}>
        //                         <span style={{fontSize:"xx-large",color:"white"}}>The purpose of this project is to assist farmers, researchers, and technicians in the CROWN project to report and analyze their data easily and efficiently.</span>
        //                     </div>
        //                 </div>
        //         </div>
        //         </div>
        //         <div className="row" style={{height:"85%",width:"100%",backgroundColor:"skyBlue"}}></div>
        //         <div className="row" style={{height:"55%",width:"100%",backgroundColor:"lightGreen"}}>

        //         </div>
        //         <br/>
        //     </div>
        // );
    }

}

export default About;
