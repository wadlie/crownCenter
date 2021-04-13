import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

class FourthGraph extends Component {

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
        var rowSpace = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var grainWeight = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var moist1 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var moist2 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var weight1 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var weight2 = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var numPlants = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        if (entry.row_spacing !== null){rowSpace = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.grain_weight_per_ten_feet !== null){grainWeight = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.grain_moisture_one !== null){moist1 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.grain_moisture_two !== null){moist2 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.grain_test_weight_one !== null){weight1 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.grain_test_weight_two !== null){weight2 = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.number_of_plants_per_ten_feet_long_row !== null){numPlants = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}


        //<i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>
        return(
            <tr key={index} style={{textAlign:"center"}}>
                <td>{barcode}</td>
                <td>{rowSpace}</td>
                <td>{grainWeight}</td>
                <td>{moist1}</td>
                <td>{moist2}</td>
                <td>{weight1}</td>
                <td>{weight2}</td>
                <td>{numPlants}</td>
            </tr>)
    }

    /*
        Shows the table with icons remarking wether the value for the barcode is null or not
     */
    displayTable(){

        if (this.props.tableData[this.props.farmCode] !== undefined){
            // Bruh wth is that syntax V
            return( Object.keys(this.props.tableData[this.props.farmCode].yield).map((entry,index) => {
                return (this.eachEntry(this.props.tableData[this.props.farmCode].yield[entry],index))
            }))
        }
    }

    render() {


        return (
            <div className="container-fluid" style={{height:"100%",width:"100%"}}>
                <div className="row" style={{height:"15%",width:"100%"}} >
                    <div className="col-3" style={{paddingLeft:30,paddingRight:0}}>
                        <span style={{fontSize: "Xx-large", fontWeight:"600"}}>Yield Data</span>
                    </div>
                </div>
                <div className="row" style={{height:"85%",width:"100%",paddingLeft:10}}>
                    <div className="col-12 table-responsive" style={{height:"100%",paddingLeft:30,paddingRight:0,maxHeight:"100%",maxWidth:"100%",overflow:"scroll"}}>
                        <table className="table table-bordered text-nowrap" style={{maxHeight:"100%",maxWidth:"100%",}}>
                            <thead>
                            <tr>
                                <th scope="col">Barcode</th>
                                <th scope="col">Row Spacing</th>
                                <th scope="col">Grain Weight Per 10</th>
                                <th scope="col">Grain Moisture 1</th>
                                <th scope="col">Grain Moisture 2</th>
                                <th scope="col">Grain Test Weight 1</th>
                                <th scope="col">Grain Test Weight 2</th>
                                <th scope="col"># Plants per 10 feet row</th>
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

export default FourthGraph;
