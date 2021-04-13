import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Chart from "chart.js";
import {Doughnut} from 'react-chartjs-2';
import FirstGraph from './firstGraph';
import SecondGraph from './secondGraph';
import ThirdGraph from './thirdGraph';
import FourthGraph from './fourthGraph';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

var originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
    draw: function() {
        originalDoughnutDraw.apply(this, arguments);

        var chart = this.chart;
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = chart.config.data.text,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 2;

        ctx.fillText(text, textX, textY);
    }
});
const dataDefault = {
    labels: [
        'Green',
        'Red'
    ],
    datasets: [{
        data: [0,100],
        backgroundColor: [
            '#43dd28',
            "#FF2332"
        ],
        hoverBackgroundColor: [
            '#43dd28',
            '#FF2332'
        ]
    }],
    text: '0%'
};
class FormPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stateLoc: "",
            year: "",
            farmC: "",
            flipSpecific: false, // Show table if false, Show farmcode doughnuts if true
            soilData: dataDefault,
            biomassData: dataDefault,
            ccData: dataDefault,
            yieldData: dataDefault,
            specShow: 0, // 0 for show nothing, 1 for Soil, 2 for Bio, 3 for CC, 4 for yield
            farmPercent: this.props.percents
        };

        this.handleChangeTeam = this.handleChangeTeam.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
        this.handleChangeCode = this.handleChangeCode.bind(this);
        this.handleChangeTable = this.handleChangeTable.bind(this);
        this.handleChangeFarmOverallClick = this.handleChangeFarmOverallClick.bind(this);
    }

    componentDidUpdate(prevProp, prevState, snapshot){
        if(prevProp.percents !== this.props.percents) {
            console.log(this.prevProp, this.props)
            if(this.state.farmC) {
                this.handleChangeFarmOverallClick("update", this.state.farmC)
            }
        }
    }
    /*
        This function made for the button style of farmcode on Overall Table. Allows use
        to correctly set  doughnut values.
     */
    handleChangeFarmOverallClick(event, farmCode) {
        //console.log(farmCode)
        this.setState({farmC: farmCode, flipSpecific: true});
        var dataDef = {
            labels: [
                'Green',
                'Red'
            ],
            datasets: [{
                data: [0,100],
                backgroundColor: [
                    '#43dd28',
                    "#FF2332"
                ],
                hoverBackgroundColor: [
                    '#43dd28',
                    '#FF2332'
                ]
            }],
            text: '0%'
        };
        if (farmCode !== "") {
            var target = farmCode;
            var eJson = this.props.percents;
            if (eJson !== null) {
                if (eJson[target] !== undefined){
                    var soilD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [Number(eJson[target].soil),100 - eJson[target].soil],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].soil).toString() + "%"
                    };
                    var bioD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].biomass,100 - eJson[target].biomass],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].biomass).toString() + "%"
                    };
                    var yieldD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].yield,100 - eJson[target].yield],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].yield).toString() + "%"
                    };
                    var bagD =  {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].bag,100 - eJson[target].bag],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].bag).toString() + "%"
                    };
                    this.setState({soilData: soilD,biomassData:bioD,yieldData:yieldD,ccData:bagD});
                } else {
                    this.setState({soilData: dataDef,biomassData: dataDef,yieldData: dataDef,ccData: dataDef});
                }
            }
        }
    }

    /*
        This function is used whenever stateLoc state changes. Is called team because it was previously changed a
        state called team.
     */
    handleChangeTeam(event) {
        this.setState({stateLoc: event.target.value});
    }
    /*
        Function used when state year is changed by a input field
     */
    handleChangeYear(event) {
        this.setState({year: event.target.value});
    }
    /*
        Function used when state farmC is changed by a input field or by button click.
        Because it represents showing specific farmcode data, it needs to create doughnut data
        related to the correct farmCode.
     */
    handleChangeCode(event){
        var dataDef = {
            labels: [
                'Green',
                'Red'
            ],
            datasets: [{
                data: [0,100],
                backgroundColor: [
                    '#43dd28',
                    "#FF2332"
                ],
                hoverBackgroundColor: [
                    '#43dd28',
                    '#FF2332'
                ]
            }],
            text: '0%'
        };
        this.setState({farmC: event.target.value});
        if (event.target.value !== "") {
            var target = event.target.value;
            var eJson = this.props.percents; // Child param value that comes from index.js and holds tempPercent.
            if (eJson !== null) {
                if (eJson[target] !== undefined){
                    var soilD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [Number(eJson[target].soil),100 - eJson[target].soil],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].soil).toString() + "%"
                    };
                    var bioD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].biomass,100 - eJson[target].biomass],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].biomass).toString() + "%"
                    };
                    var yieldD = {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].yield,100 - eJson[target].yield],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].yield).toString() + "%"
                    };
                    var bagD =  {
                        labels: [
                            'Green',
                            'Red'
                        ],
                        datasets: [{
                            data: [eJson[target].bag,100 - eJson[target].bag],
                            backgroundColor: [
                                '#43dd28',
                                "#FF2332"
                            ],
                            hoverBackgroundColor: [
                                '#43dd28',
                                '#FF2332'
                            ]
                        }],
                        text: Math.round(eJson[target].bag).toString() + "%"
                    };
                    this.setState({soilData: soilD,biomassData:bioD,yieldData:yieldD,ccData:bagD});
                } else {
                    // Stanadard 0 data doughnuts
                    this.setState({soilData: dataDef,biomassData: dataDef,yieldData: dataDef,ccData: dataDef});
                }
            }
            this.setState({flipSpecific: true}); //Start using specific charts
        } else { // When input is empty, go back to overall chart
            this.setState( {flipSpecific: false});
            this.setState({specShow: 0}); //Overall chart is when specShow == 0
            this.setState({soilData: dataDef,biomassData: dataDef,ccData: dataDef,yieldData: dataDef});
        }
        //console.log(this.state.soilData);
    }

    // Function used to change state specShow to soil if 1, biomass if 2, bag if 3, and yield if 4
    handleChangeTable(code){
        this.setState({specShow: code});
    }

    /*
        Bottom of the Bottom row of FormPage tab. This portion shows based on state specShow, what checkerboard to show
     */
    botRightTable(){
        if (this.state.specShow === 1){
            return <FirstGraph tableData={this.props.fullInfo} farmCode={this.state.farmC}/> // send aggregated form submission data to component
        } else if (this.state.specShow ===  2){
                return <SecondGraph tableData={this.props.fullInfo} farmCode={this.state.farmC}/>
        } else if (this.state.specShow === 3){
            return <ThirdGraph tableData={this.props.fullInfo} farmCode={this.state.farmC}/>
        } else if (this.state.specShow === 4){
            return <FourthGraph tableData={this.props.fullInfo} farmCode={this.state.farmC}/>
        } else {
            return <div style={{justifyContent:"center",textAlign:"center", height:"100%",width:"100%"}}>
                <span style={{fontSize: "Xx-large", fontWeight:"600"}}>Click a doughnut to view data about it</span>
            </div>
        }
    }

    /*
        Function that returns the row for the overall table.
        Icons are red cross by default and only changes to a green check when looked up variable is 100.00.
        If statements used as logic for the filter.
     */
    queryPercents(entry,index){
        var soilIcon = <i style={{fontSize:"2em", color:"red",verticalAlign:"sub"}} disabled className="fa fa-window-close"></i>
        var biomassIcon = <i style={{fontSize:"2em", color:"red" ,verticalAlign:"sub"}} disabled className="fa fa-window-close"></i>
        var bagIcon = <i style={{fontSize:"2em", color:"red" ,verticalAlign:"sub"}} disabled className="fa fa-window-close"></i>
        var yieldIcon = <i style={{fontSize:"2em", color:"red" ,verticalAlign:"sub"}} disabled className="fa fa-window-close"></i>
        if (this.props.percents[entry].soil == 100.00){soilIcon = <i style={{fontSize:"2em",color:"green" ,verticalAlign:"sub"}} disabled className="fa fa-check-square"></i>}
        if (this.props.percents[entry].biomass == 100.00){biomassIcon = <i style={{fontSize:"2em",color:"green" ,verticalAlign:"sub"}} disabled className="fa fa-check-square"></i>}
        if (this.props.percents[entry].bag == 100.00){bagIcon = <i style={{fontSize:"2em",color:"green" ,verticalAlign:"sub"}} disabled className="fa fa-check-square"></i>}
        if (this.props.percents[entry].yield == 100.00){yieldIcon = <i style={{fontSize:"2em",color:"green" ,verticalAlign:"sub"}} disabled className="fa fa-check-square"></i>}
        if (this.state.stateLoc === "" && this.state.year === ""){
            return(
                <tr key={index} >
                    <td ><Button variant="primary" onClick={(event) => this.handleChangeFarmOverallClick(event, {entry}.entry)}>{entry}</Button></td>
                    <td>{this.props.percents[entry].state}</td>
                    <td>{this.props.percents[entry].year}</td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].soil}</div> <div style={{float:"right",width:"50%"}}>{soilIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].biomass}</div> <div style={{float:"right",width:"50%"}}>{biomassIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].bag}</div> <div style={{float:"right",width:"50%"}}>{bagIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].yield}</div> <div style={{float:"right",width:"50%"}}>{yieldIcon}</div></td>
                </tr>)
        } else if ( (this.state.stateLoc.toString() === this.props.percents[entry].state.toString()) && (this.state.year.toString() === this.props.percents[entry].year.toString()) ) {
            return(
                <tr key={index} >
                    <td><Button variant="primary" onClick={(event) => this.handleChangeFarmOverallClick(event, {entry}.entry)}>{entry}</Button></td>
                    <td>{this.props.percents[entry].state}</td>
                    <td>{this.props.percents[entry].year}</td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].soil}</div> <div style={{float:"right",width:"50%"}}>{soilIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].biomass}</div> <div style={{float:"right",width:"50%"}}>{biomassIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].bag}</div> <div style={{float:"right",width:"50%"}}>{bagIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].yield}</div> <div style={{float:"right",width:"50%"}}>{yieldIcon}</div></td>
                </tr>)

        } else if (this.state.stateLoc === this.props.percents[entry].state && this.state.year.toString() === "" ){ //stateLoc field is different from default
            return(
                <tr key={index} >
                    <td><Button variant="primary" onClick={(event) => this.handleChangeFarmOverallClick(event, {entry}.entry)}>{entry}</Button></td>
                    <td>{this.props.percents[entry].state}</td>
                    <td>{this.props.percents[entry].year}</td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].soil}</div> <div style={{float:"right",width:"50%"}}>{soilIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].biomass}</div> <div style={{float:"right",width:"50%"}}>{biomassIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].bag}</div> <div style={{float:"right",width:"50%"}}>{bagIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].yield}</div> <div style={{float:"right",width:"50%"}}>{yieldIcon}</div></td>
                </tr>)

        } else if (this.state.year == this.props.percents[entry].year && this.state.stateLoc.toString() === ""){ //year field is different from default
            return(
                <tr key={index} >
                    <td><Button variant="primary" onClick={(event) => this.handleChangeFarmOverallClick(event, {entry}.entry)}>{entry}</Button></td>
                    <td>{this.props.percents[entry].state}</td>
                    <td>{this.props.percents[entry].year}</td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].soil}</div> <div style={{float:"right",width:"50%"}}>{soilIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].biomass}</div> <div style={{float:"right",width:"50%"}}>{biomassIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].bag}</div> <div style={{float:"right",width:"50%"}}>{bagIcon}</div></td>
                    <td><div style={{float:"left",width:"50%"}}>{this.props.percents[entry].yield}</div> <div style={{float:"right",width:"50%"}}>{yieldIcon}</div></td>
                </tr>)

        }

    }

    // Shows specific data about a farm code. Shows four doughnuts based on Soil/Biomass/Bag/Yield data
    // Uses handleChangeTable(int) function to determine what checkered data to show
    rightDisplay() {
        if (this.state.flipSpecific === true){ // Show specific based on input

            return <div className="container-fluid" style={{height:"100%",width:"100%",padding:0}}>
                <div className="row" style={{/*height:"30%"*/}}>
                    <div className="col-sm-3" style={{/*height:"100%"*/}} >
                        <div className="row" style={{height:"30%",justifyContent:"center",paddingTop:10}}>
                            <span style={{fontSize: "x-large", fontWeight:"500"}}>Soil</span>
                        </div>
                        <div className="row" style={{height:"70%",maxHeight:"100%",justifyContent:"center"}}>
                    <Doughnut onElementsClick={() => this.handleChangeTable(1)} data={this.state.soilData} options={{legend: {display: false},maintainAspectRatio:false,responsive:true,tooltips: {enabled: false}}}/>
                        </div>
                    </div>


                    <div className="col-sm-3" style={{/*height:"100%"*/}} >
                        <div className="row" style={{height:"30%",justifyContent:"center",paddingTop:10}}>
                            <span style={{fontSize: "x-large", fontWeight:"500"}}>Biomass</span>
                        </div>
                        <div className="row" style={{height:"70%",maxHeight:"100%",justifyContent:"center"}}>
                            <Doughnut onElementsClick={() => this.handleChangeTable(2)} data={this.state.biomassData} options={{legend: {display: false},maintainAspectRatio:false,tooltips: {enabled: false}}}/>
                        </div>
                    </div>


                    <div className="col-sm-3" style={{/*height:"100%"*/}} >
                        <div className="row" style={{height:"30%",justifyContent:"center",paddingTop:10}}>
                            <span style={{fontSize: "x-large", fontWeight:"500"}}>Bag Data</span>
                        </div>
                        <div className="row" style={{height:"70%",maxHeight:"100%",justifyContent:"center"}}>
                            <Doughnut onElementsClick={() => this.handleChangeTable(3)} data={this.state.ccData} options={{legend: {display: false},maintainAspectRatio:false,tooltips: {enabled: false}}}/>
                        </div>
                    </div>


                    <div className="col-sm-3" style={{/*height:"100%"*/}} >
                        <div className="row" style={{height:"30%",justifyContent:"center",paddingTop:10}}>
                            <span style={{fontSize: "x-large", fontWeight:"500"}}>Yield</span>
                        </div>
                        <div className="row" style={{height:"70%",maxHeight:"100%",justifyContent:"center"}}>
                            <Doughnut onElementsClick={() => this.handleChangeTable(4)} data={this.state.yieldData} options={{legend: {display: false},maintainAspectRatio:false,tooltips: {enabled: false}}}/>
                        </div>
                    </div>

                </div>
                <hr style={{marginTop: "0.4rem", borderTop: "1.2px solid #8c8b8b"}}/>
                <div className="row" style={{/*height:"65%",width:"100%"*/}}>
                    {this.botRightTable()}
                </div>
            </div>
        }else { // Show Full table, uses map function to list out farm information rows
            return <div className="container-fluid table-responsive" style={{height:"100%"}}>
                <table className="table table-striped" style={{height:"100%",maxHeight:"100%",maxWidth:"100%"}}>
                    <thead>
                    <tr>
                        <th scope="col">Farmcode</th>
                        <th scope="col">State</th>
                        <th scope="col">Year</th>
                        <th scope="col">Soil</th>
                        <th scope="col">Biomass</th>
                        <th scope="col">Bag</th>
                        <th scope="col">Yield</th>
                    </tr>
                    </thead>
                    <tbody>

                {Object.keys(this.props.percents).map( (entry,index) => {
                   return( this.queryPercents(entry,index))
                })}
                    </tbody>
                </table>
            </div>
        }
    }

    render() {
        var displayStyle = {
            display: "block",
            height: "100%"
        }
        var leftColStyle = {
            height:"85%",
            width: "100%",
            padding:0
        }
        var rightColStyle = {
            height:"100%",
            borderStyle: "solid",
            borderWidth: "thin",
            width: "100%"
        }
        /*
            Layout is split into two sections. Top row is the three filters that changes states using
            onChange() function. When farmcode is changed, the bottom section will automatically change from table
            to specific's section.
            Bottom row by default is the overall table of farmcode and percentages. State and year filter will change
            what is displayed here. Any changes to farmcode will switch this section to the specefic section.
         */
        return (
            <div style={displayStyle} className="container-fluid">
                <div className="row justify-content-around" style={{height:"100%"}}>
                    <div className="row" style={{width:"100%"}}>
                    <div className="col-12" style={{height:"100%"}}>
                    <Card style={{height:"100%",width:"100%"}}>
                        <Card.Header>Filters</Card.Header>
                        <div className="container-fluid" style={{height:"100%",maxHeight:"!00%"}}>
                        <div className="row" style={{height:"80%"}}>
                            <div className="col-sm-4" style={{height:"100%",maxHeight:"100%",paddingRight:0}}>
                                <br/>
                                <InputGroup size="lg">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-lg">Farm Code</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"value={this.state.farmC} onChange={this.handleChangeCode} />
                                </InputGroup>
                            </div>
                            <div className="col-sm-4" style={{height:"100%",maxHeight:"100%"}}>
                                <br/>
                                <InputGroup size="lg">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-lg">State</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <form >
                                        <label style={{height:"100%",width:"100%"}}>
                                            <select value={this.state.team} style={{width:"100%",height:"100%"}}  onChange={this.handleChangeTeam}>
                                                <option value=""></option>
                                                <option value="AL">Alabama</option>
                                                <option value="AK">Alaska</option>
                                                <option value="AZ">Arizona</option>
                                                <option value="AR">Arkansas</option>
                                                <option value="CA">California</option>
                                                <option value="CO">Colorado</option>
                                                <option value="CT">Connecticut</option>
                                                <option value="DE">Delaware</option>
                                                <option value="DC">District Of Columbia</option>
                                                <option value="FL">Florida</option>
                                                <option value="GA">Georgia</option>
                                                <option value="HI">Hawaii</option>
                                                <option value="ID">Idaho</option>
                                                <option value="IL">Illinois</option>
                                                <option value="IN">Indiana</option>
                                                <option value="IA">Iowa</option>
                                                <option value="KS">Kansas</option>
                                                <option value="KY">Kentucky</option>
                                                <option value="LA">Louisiana</option>
                                                <option value="ME">Maine</option>
                                                <option value="MD">Maryland</option>
                                                <option value="MA">Massachusetts</option>
                                                <option value="MI">Michigan</option>
                                                <option value="MN">Minnesota</option>
                                                <option value="MS">Mississippi</option>
                                                <option value="MO">Missouri</option>
                                                <option value="MT">Montana</option>
                                                <option value="NE">Nebraska</option>
                                                <option value="NV">Nevada</option>
                                                <option value="NH">New Hampshire</option>
                                                <option value="NJ">New Jersey</option>
                                                <option value="NM">New Mexico</option>
                                                <option value="NY">New York</option>
                                                <option value="NC">North Carolina</option>
                                                <option value="ND">North Dakota</option>
                                                <option value="OH">Ohio</option>
                                                <option value="OK">Oklahoma</option>
                                                <option value="OR">Oregon</option>
                                                <option value="PA">Pennsylvania</option>
                                                <option value="RI">Rhode Island</option>
                                                <option value="SC">South Carolina</option>
                                                <option value="SD">South Dakota</option>
                                                <option value="TN">Tennessee</option>
                                                <option value="TX">Texas</option>
                                                <option value="UT">Utah</option>
                                                <option value="VT">Vermont</option>
                                                <option value="VA">Virginia</option>
                                                <option value="WA">Washington</option>
                                                <option value="WV">West Virginia</option>
                                                <option value="WI">Wisconsin</option>
                                                <option value="WY">Wyoming</option>
                                            </select>
                                        </label>
                                    </form>
                                </InputGroup>
                            </div>
                            <div className="col-sm-4" style={{height:"100%",maxHeight:"100%",paddingLeft:0}}>
                                <br/>
                                <InputGroup size="lg">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroup-sizing-lg">Year</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm"value={this.state.year} onChange={this.handleChangeYear} />
                                </InputGroup>
                            </div>
                        </div>
                            <br/>
                        </div>
                        </Card>

                    </div>
                    </div>
                    <div className="row" style={{height:"100%",width:"100%"}}>
                    <div className="col-12" style={{height:"113%"}}>
                        <Card style={{height:"100%",width:"100%"}}>
                            <Card.Header>Farm Percentage</Card.Header>
                            <Card.Body className="table-responsive">{this.rightDisplay()}</Card.Body>
                        </Card>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default FormPage;
