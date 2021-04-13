import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

class FirstGraph extends Component {

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
        var emptyBagWeight = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var totalMoistWeight = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var totalRockWeight = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var subEmpty = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var subMoist = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var subDry = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var vial = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var soilDry = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var amon = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var nitrate = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var sand = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var silt = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var clay = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var texture = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        if (entry.empty_bag_weight !== null){emptyBagWeight = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.total_moist_weight !== null){totalMoistWeight = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.total_rock_weight !== null){totalRockWeight = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.tin_sub_empty_weight !== null){subEmpty = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.tin_sub_moist_weight !== null){subMoist = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.tin_sub_dry_weight !== null){subDry = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.vial_number !== null){vial = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.soil_dry_weight !== null){soilDry = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.ammonium_content !== null){amon = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.nitrate_content !== null){nitrate = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.sand !== null){sand = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.silt !== null){silt = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.clay !== null){clay = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.textural_class !== null){texture = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}

            //<i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>
        return(
            <tr key={index} style={{textAlign:"center"}}>
                <td>{barcode}</td>
                <td>{emptyBagWeight}</td>
                <td>{totalMoistWeight}</td>
                <td>{totalRockWeight}</td>
                <td>{subEmpty}</td>
                <td>{subMoist}</td>
                <td>{subDry}</td>
                <td>{vial}</td>
                <td>{soilDry}</td>
                <td>{amon}</td>
                <td>{nitrate}</td>
                <td>{sand}</td>
                <td>{silt}</td>
                <td>{clay}</td>
                <td>{texture}</td>
            </tr>)
    }

    /*
        Shows the table with icons remarking wether the value for the barcode is null or not
     */
    displayTable(){

        if (this.props.tableData[this.props.farmCode] !== undefined){
            // Bruh wth is that syntax V
           return( Object.keys(this.props.tableData[this.props.farmCode].soil).map((entry,index) => {
              return (this.eachEntry(this.props.tableData[this.props.farmCode].soil[entry],index))
            }))
        }
    }

    render() {


        return (
            <div className="container-fluid" style={{height:"100%",width:"100%"}}>
            <div className="row" style={{height:"15%",width:"100%"}} >
                <div className="col-3" style={{paddingLeft:30,paddingRight:0}}>
                    <span style={{fontSize: "Xx-large", fontWeight:"600"}}>Soil Data</span>
                </div>
            </div>
                <div className="row" style={{height:"85%",width:"100%",paddingLeft:10}}>
                    <div className="col-12 table-responsive" style={{height:"100%",paddingLeft:30,paddingRight:0,maxHeight:"100%",maxWidth:"100%",overflow:"scroll"}}>
                        <table className="table table-bordered text-nowrap" style={{maxHeight:"100%",maxWidth:"100%",}}>
                            <thead>
                            <tr>
                                <th scope="col">Barcode</th>
                                <th scope="col">Empty bag Weight</th>
                                <th scope="col">Total Moist Weight</th>
                                <th scope="col">Total Rock Weight</th>
                                <th scope="col">Tin Sub empty Weight</th>
                                <th scope="col">Tin Sub moist Weight</th>
                                <th scope="col">Tin Sub Dry Weight</th>
                                <th scope="col">Vial number</th>
                                <th scope="col">Soil Dry Weight</th>
                                <th scope="col">Ammonium Content</th>
                                <th scope="col">Nitrate Content</th>
                                <th scope="col">Sand</th>
                                <th scope="col">Silt</th>
                                <th scope="col">Clay</th>
                                <th scope="col">Texture Class</th>
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

export default FirstGraph;
