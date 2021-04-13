import React from 'react';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

class ManagePage extends React.Component{

    constructor(props){
        super(props)
        this.state = {farmers: null, farms: null}
    }


    componentDidMount() {
        axios.get('/api/farmer').then(response => this.setState({farmers: response.data}))
        axios.get('/api/farm').then(response => this.setState({farms: response.data}))
    }

    render() {
        return(
        <Card>
            <Card.Body>
                <Table>
                    <thead>
                        <tr>Farmer</tr>
                        <tr>Farms</tr>
                    </thead>
                {this.state.farmers.map((farmer,index) => {
                    return 
                })}
                </Table>
            </Card.Body>
        </Card>
        )
    }
}


export default ManagePage;