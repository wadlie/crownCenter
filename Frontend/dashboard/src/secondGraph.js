import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';

class SecondGraph extends Component {
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
        var drill = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var subA = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var subB = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var empty = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var avg = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var target = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        var legume = <i style={{fontSize:"2em", color:"red"}} disabled className="fa fa-times-circle"></i>
        if (entry.drill_line_spacing !== null){drill = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.subsample_a_weight !== null){subA = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.subsample_b_weight !== null){subB = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.empty_bag_weight !== null){empty = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.average_fresh_biomass_excludes_bag_weight !== null){avg = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.target_fresh_biomass_per_bag_weight !== null){target = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}
        if (entry.is_over_40_percent_legume !== null){legume = <i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>}


        //<i style={{fontSize:"2em",color:"green"}} disabled className="fa fa-check-circle"></i>
        return(
            <tr key={index} style={{textAlign:"center"}}>
                <td>{barcode}</td>
                <td>{drill}</td>
                <td>{subA}</td>
                <td>{subB}</td>
                <td>{empty}</td>
                <td>{avg}</td>
                <td>{target}</td>
                <td>{legume}</td>
            </tr>)
    }

    /*
        Shows the table with icons remarking wether the value for the barcode is null or not
     */
    displayTable(){

        if (this.props.tableData[this.props.farmCode] !== undefined){
            // Bruh wth is that syntax V
            return( Object.keys(this.props.tableData[this.props.farmCode].biomass).map((entry,index) => {
                return (this.eachEntry(this.props.tableData[this.props.farmCode].biomass[entry],index))
            }))
        }
    }

    render() {


        return (
            <div className="container-fluid" style={{height:"100%",width:"100%"}}>
                <div className="row" style={{height:"15%",width:"100%"}} >
                    <div className="col-sm-4" style={{paddingLeft:30,paddingRight:0}}>
                        <span style={{fontSize: "Xx-large", fontWeight:"600"}}>Biomass Data</span>
                    </div>
                </div>
                <div className="row" style={{height:"85%",width:"100%",paddingLeft:10}}>
                    <div className="col-sm-12 table-responsive" style={{height:"100%",paddingLeft:30,paddingRight:0,maxHeight:"100%",maxWidth:"100%",overflow:"scroll"}}>
                        <table className="table table-bordered text-nowrap" style={{maxHeight:"100%",maxWidth:"100%",}}>
                            <thead>
                            <tr>
                                <th scope="col">Barcode</th>
                                <th scope="col">Drill Line Spacing</th>
                                <th scope="col">Subsample A Weight</th>
                                <th scope="col">Subsample B Weight</th>
                                <th scope="col">Empty Bag Weight</th>
                                <th scope="col">Avg Fresh exclude Bag Weight</th>
                                <th scope="col">Target Fresh Biomass per bag Weight</th>
                                <th scope="col">Over 40% Legume</th>
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

export default SecondGraph;
