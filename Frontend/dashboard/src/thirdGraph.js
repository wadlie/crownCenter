import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

class ThirdGraph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ""
        };

    }

    /*
        Determines wether or not a row value should be a red times or a green circle
     */
    eachEntry(entry,index){
        var barcode = entry.barcode;
        var bag_date_tid = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var bag_date = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var bag_date_target = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var painted = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var empty = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var field = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var lat = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var longitude = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var actual = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var dwt = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var crucible = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var total65 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var total550 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var ovenDry = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var ashWeight = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var ashOne = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var carbon = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var nitrogen = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        if (entry.bag_date_tid !== null){bag_date_tid = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.bag_date !== null){bag_date = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.bag_date_target !== null){bag_date_target = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.painted_bag_number !== null){painted = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.empty_bag_weight !== null){empty = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.in_field_bag_fresh_weight !== null){field = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.latitude !== null){lat = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.longitude !== null){longitude = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.actual_recovery_date !== null){actual = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.total_dwt !== null){dwt = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.crucible_weight !== null){crucible = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.total_weight_65 !== null){total65 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.total_weight_550 !== null){total550 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.oven_dry_weight !== null){ovenDry = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.ash_weight !== null){ashWeight = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.ash_one_litter_weight !== null){ashOne = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.carbon_concentration_percent !== null){carbon = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.nitrogen_concentration_percent !== null){nitrogen = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}

        //<i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>
        return(
            <tr key={index} style={{textAlign:"center"}}>
                <td>{barcode}</td>
                <td>{bag_date_tid}</td>
                <td>{bag_date}</td>
                <td>{bag_date_target}</td>
                <td>{painted}</td>
                <td>{empty}</td>
                <td>{field}</td>
                <td>{lat}</td>
                <td>{longitude}</td>
                <td>{actual}</td>
                <td>{dwt}</td>
                <td>{crucible}</td>
                <td>{total65}</td>
                <td>{total550}</td>
                <td>{ovenDry}</td>
                <td>{ashWeight}</td>
                <td>{ashOne}</td>
                <td>{carbon}</td>
                <td>{nitrogen}</td>
            </tr>)
    }

    /*
        Shows the table with icons remarking wether the value for the barcode is null or not
     */
    displayTable(){

        if (this.props.tableData[this.props.farmCode] !== undefined){
            // Bruh wth is that syntax V
            return( Object.keys(this.props.tableData[this.props.farmCode].bag).map((entry,index) => {
                return (this.eachEntry(this.props.tableData[this.props.farmCode].bag[entry],index))
            }))
        }
    }

    render() {


        return (
            <div className="container-fluid" style={{height:"100%",width:"100%"}}>
                <div className="row" style={{height:"15%",width:"100%"}} >
                    <div className="col-3" style={{paddingLeft:30,paddingRight:0}}>
                        <span style={{fontSize: "Xx-large", fontWeight:"600"}}>Bag Data</span>
                    </div>
                </div>
                <div className="row" style={{height:"85%",width:"100%",paddingLeft:10}}>
                    <div className="col-12 table-responsive" style={{height:"100%",paddingLeft:30,paddingRight:0,maxHeight:"100%",maxWidth:"100%",overflow:"scroll"}}>
                        <table className="table table-bordered text-nowrap" style={{maxHeight:"100%",maxWidth:"100%",}}>
                            <thead>
                            <tr>
                                <th scope="col">Barcode</th>
                                <th scope="col">Bag Date Tid</th>
                                <th scope="col">Bag Date</th>
                                <th scope="col">Bag Date Target</th>
                                <th scope="col">Painted Bag Number</th>
                                <th scope="col">Empty Bag Weight</th>
                                <th scope="col">In Field Bag Fresh Weight</th>
                                <th scope="col">Latitude</th>
                                <th scope="col">Longitude</th>
                                <th scope="col">Actual Recovery Date</th>
                                <th scope="col">Total DWT</th>
                                <th scope="col">Crucible Weight</th>
                                <th scope="col">Total Weight 65</th>
                                <th scope="col">Total Weight 550</th>
                                <th scope="col">Oven Dry Weight</th>
                                <th scope="col">Ash Weight</th>
                                <th scope="col">Ash One Litter Weight</th>
                                <th scope="col">Carbon Concentrate Percent</th>
                                <th scope="col">Nitrogen Concentrate Percent</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.displayTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default ThirdGraph;
