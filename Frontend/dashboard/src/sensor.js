import React, {Component} from "react";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';

//run npm install react-bootstrap-table-next --save
//run npm install react-bootstrap-table2-filter --save
//run npm install react-bootstrap-table2-paginator --save


class Sensor extends Component{
	constructor(props) {
		super(props);
		this.state = {
			sensordata:[],
			treatmentCount:[],
			rhCount:[],
			latestTreatment:[],
			latestRhTreatment:[],
			farmsInfo:[],

		}
	}




    combineAll(trtCount, humidityCount, lstTrtTime, lstRhTime, farmInfo){
    	/*if (this.state.sensordata === undefined || this.state.sensordata.length ===  0) {
			return false;
		}*/
		//else{

			var combined = []
			var sensorTable = [];
			var farmsToState = new Map();
			var groupedByState = [];
			groupedByState = farmInfo.reduce((h, obj) => Object.assign(h, { [obj.state]:(h[obj.state] || [] ).concat(obj) }), []);
			//renameProp = (oldProp, newProp, {[oldProp]:old, ...others}) => ({[newProp]: old,...others});
			for (const [state, data2] of Object.entries(groupedByState)){
					data2.forEach(function(arrItem){
						farmsToState.set(arrItem.farmcode, state)
					});
			}

			for (var i = 0; i < trtCount.length; i++){
				if (trtCount[i].trt == "b"){
					trtCount[i].countB = trtCount[i].count;
					//delete trtCount[i].count;
				}
				else if (trtCount[i].trt == "c"){
					trtCount[i].countC = trtCount[i].count;
					//delete trtCount[i].max;
				}
			}

			for (var i = 0; i < humidityCount.length; i++){
				humidityCount[i]["RHcount"] = humidityCount[i]["count"];
			}

			for (var i = 0; i < lstTrtTime.length; i++){
				if (lstTrtTime[i].trt == "b"){
					lstTrtTime[i].maxB = lstTrtTime[i].max;
				}
				else if (lstTrtTime[i].trt == "c"){
					lstTrtTime[i].maxC = lstTrtTime[i].max;
				}
			}

			for (var i = 0; i < lstRhTime.length; i++){
				lstRhTime[i].maxRH = lstRhTime[i].max;
			}

			Array.prototype.push.apply(combined,trtCount);
			Array.prototype.push.apply(combined,humidityCount);
			Array.prototype.push.apply(combined,lstTrtTime);
			Array.prototype.push.apply(combined,lstRhTime);

			//console.log(combined);

			var groupedT1 = Object.values(combined).reduce((h, obj) => Object.assign(h, { [obj.code]:(h[obj.code] || [] ).concat(obj) }), []);
			//console.log(groupedT1);
			
			for (const [code, data] of Object.entries(groupedT1)){
				groupedT1[code] = data.reduce(function(result, current) {
  					return Object.assign(result, current);}, {});
				if (!("countB" in groupedT1[code])){
					groupedT1[code].countB = '0';
					groupedT1[code].maxB = "No Timestamp Recorded";
				}
				if (!("countC" in groupedT1[code])){
					groupedT1[code].countC = '0';
					groupedT1[code].maxC = "No Timestamp Recorded";
				}
				if (!("RHcount" in groupedT1[code])){
					groupedT1[code].RHcount = '0';
					groupedT1[code].maxRH = "No Timestamp Recorded";
				}
				//console.log(groupedT1[code]);
			}

			//console.log(groupedT1);
			for (const [code,data] of Object.entries(groupedT1)){
				data["totalCount"] = parseInt(data.countB) + parseInt(data.countC);
				var validDates = [];
				if (data.maxB != "No Timestamp Recorded"){
					validDates.push(new Date(data.maxB));
					data["maxB"] = new Date(data.maxB).toLocaleString();
				}
				if (data.maxC != "No Timestamp Recorded"){
					validDates.push(new Date(data.maxC));
					data["maxC"] = new Date(data.maxC).toLocaleString();
				}
				if (data.maxRH != "No Timestamp Recorded"){
					validDates.push(new Date(data.maxRH));
					data["maxRH"] = new Date(data.maxRH).toLocaleString();
				}
				//console.log(validDates);
				data["lastUpdate"] = Math.floor((new Date() - new Date(Math.max.apply(null,validDates)))/(1000*60*60));
				data["state"] = farmsToState.get(code);
				// console.log(data);
				sensorTable.push(data);
			}
			return sensorTable;
		//}
    	
    }




	componentDidMount() { //would grab the farm codes
		let headers = {headers: 
			{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWQiOjEsInRpbWUiOiIyMDE5LTA1LTA3VDE5OjM0OjA4LjYxM1oiLCJpYXQiOjE1NTcyNTc2NDh9.egnrk3QHtD9pD9XdDlF5v526oTuxPFN4ew2T7djN61A"}}
		axios.get('/api/farm', headers).then(response => this.setState({farmsInfo: response.data}));
		axios.get('/api/sensordata/treatmentcounts',  headers).then(response => this.setState({treatmentCount: response.data}));
		axios.get('/api/sensordata/rhcounts',  headers).then(response => this.setState({rhCount: response.data}));
		axios.get('/api/sensordata/latesttreatmenttimestamp',  headers).then(response => this.setState({latestTreatment: response.data}));
		axios.get('/api/sensordata/latestrhtimestamp',  headers).then(response => this.setState({latestRhTreatment: response.data}));
	}


  	render() {
  		var tempSensor = this.combineAll(this.state.treatmentCount, this.state.rhCount, this.state.latestTreatment, this.state.latestRhTreatment, this.state.farmsInfo);

  		const columns1 = [{
  			dataField: 'state',
  			text: 'State ',
  			headerAlign: 'center',
  			filter: textFilter(),
  			headerStyle: () => {
      			return { width: "20px" };
    		}
  		}, {
  			dataField: 'code',
  			text: 'Farm Code ',
  			filter: textFilter(),
  			headerAlign: 'center',
  			headerStyle: (colum, colIndex) => {
  				return { width: '20px', textAlign: 'center' };
  			}
  		}, {
  			dataField: 'lastUpdate',
  			text: 'Hours Since Last Update',
  			sort: true,
  			headerStyle: (colum, colIndex) => {
  				return { width: '20px', textAlign: 'center' };
  			},
  			style: (cell, row, rowIndex, colIndex) => {
  				if(cell >= 2){
  					return{
  						backgroundColor : 'red'
  					};
  				}
  				else if(cell >= 1){
  					return{
  						backgroundColor : 'yellow'
  					};
  				}
  				else {
  					return{
  						backgroundColor : 'green'
  					};
  				}
  			}
  		}];

  		const columns2 = [{
  			dataField: 'state',
  			text: 'State',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}, {
  			dataField: 'code',
  			text: 'Farm Code',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			}
  		}, {
  			dataField: 'totalCount',
  			text: 'Total # Readings',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			}
  		}, {
  			dataField: 'RHcount',
  			text: 'Total # RH',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			}
  		}, {
  			dataField: 'countB',
  			text: '# of B treatments',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}, {
  			dataField: 'countC',
  			text: '# of C treatments',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}, {
  			dataField: 'maxRH',
  			text: 'Last RH',
  			sort: true,
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}, {
  			dataField: 'maxB',
  			text: 'Last B Treatment',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}, {
  			dataField: 'maxC',
  			text: 'Last C Treatment',
  			headerStyle: (colum, colIndex) => {
  				return { width: '80px', textAlign: 'center' };
  			},
  		}];


  		const defaultSorted = [{
  			dataField: 'lastUpdated',
  			order: 'desc'
  		}];

  		const defaultSorted2 = [{
  			dataField: 'lastReading',
  			order: 'asc'
  		}];

  		const options = {
  			paginationSize: 10,
  			pageStartIndex: 1,
  			// alwaysShowAllBtns: true, // Always show next and previous button
  			// withFirstAndLast: false, // Hide the going to First and Last page button
		  // hideSizePerPage: true, // Hide the sizePerPage dropdown always
		  // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
		  firstPageText: 'First',
		  prePageText: 'Back',
		  nextPageText: 'Next',
		  lastPageText: 'Last',
		  nextPageTitle: 'First page',
		  prePageTitle: 'Pre page',
		  firstPageTitle: 'Next page',
		  lastPageTitle: 'Last page',
		  showTotal: true,
		  /*sizePerPageList: [{
		  	text: '1', value: 3
		  }, {
		  	text: '5', value: 5
		  }, {
		  	text: 'All', value: this.state.farmsInfo.length
		  }]*/
		};

		  return (
		  	<div className = "row">
		  	<div className ="table-responsive col-md-4 w-auto">
		  	<BootstrapTable keyField='id' data={ tempSensor} 
		  	columns={ columns1 } filter={ filterFactory()} defaultSorted={ defaultSorted } pagination={ paginationFactory(options)} />
		  	</div>
		  	<div className ="table-responsive col-md-8">
		  	<BootstrapTable keyField='code' data={tempSensor} 
		  	columns={ columns2 } filter={ filterFactory()} defaultSorted={ defaultSorted2 } pagination={ paginationFactory(options)} />
		  	</div>
		  	</div>
		  	);
		}
		
	}

export default Sensor;
