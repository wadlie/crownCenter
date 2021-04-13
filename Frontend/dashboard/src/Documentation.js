import React, {Component} from "react";
//import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.css';
import ReactMarkdown from 'react-markdown';
//import test from './testMD.md';
import docs from './docs.md';

class Docs extends Component {

    constructor(props) {
        super(props)

        this.state = { terms: null }
    }

    componentWillMount() {
        fetch(docs).then((response) => response.text()).then((text) => {
            this.setState({ terms: text })
        })
    }

    render() {
        var displayStyle = {
            display: "block",
            weight: "100%",
            height: "100%"
        }
        return (

            <div className="container-fluid" style={displayStyle}>
                <div>
                <ReactMarkdown source={this.state.terms}></ReactMarkdown>
                </div>
            </div>

        );
    }

}

export default Docs;
