import React from 'react';
import {Row, Col, Grid} from 'react-bootstrap';

const styles = {
    container: {
        textAlign: "center",
        margin: "0 auto",
        width: "100%"
    },
    button:{
        margin: "15px",
        width: "100px",
        borderRadius: '7px',
        backgroundColor: '#00b359',
        border:"bisque"
    },
    title:{
        marginTop: "50px",
        textAlign: "center"
    },
    apartmentData:{
        textAlign: "center",
        marginTop: "20px"
    },
    ftTextBox: {
        width: '60px',
        marginRight: '10px'
    },
    valueBox: {
        marginRight: '10px',
        border: 'black'
    },
    result:{
        fontSize: "20px"
    },
    disclaimer:{
        fontSize: "10px",
        marginTop: "300px",
        color: "red"
    }
};

var RentEstimator = React.createClass({
    
    getInitialState() {
        return {
            hasEstimate: false,
            rooms: 1,
            baths: 1,
            sqft: 1
        };
    },

    getEstimate(e){
        var request = new XMLHttpRequest();
        request.open("GET", "/api/rent/estimate?rooms=" + this.state.rooms + "&bath=" + this.state.baths + "&sqft=" + this.state.sqft);
        var that = this;

        request.onreadystatechange = function() {
            if (request.readyState != 4 || request.status != 200) {
                return;
            }

            var response = JSON.parse(request.responseText);
            that.setState({hasEstimate: response.estimate});
        };
        request.send(); 
    },

    roomsChange(e){
        this.setState({rooms: Number(e.target.value)});
    },

    bathChange(e){
        this.setState({baths: Number(e.target.value)});
    },

    sqftChange(e){
        this.setState({sqft: Number(e.target.value)});
    },
    isMobile() {
        var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile']; 
         for (var i in mobile){
            if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0){
                return true;
            }
         }

        return false;
    },
    render() {
        if(this.isMobile()){
            styles.button.width = "300px";
            styles.button.height = "100px";
            styles.container.marginLeft = "200px";
            styles.ftTextBox.width = "200px";
            styles.container.fontSize = "50px";
            styles.disclaimer.fontSize = "30px";
            styles.result.fontSize = "70px";
            styles.title.fontSize = "50px";
        }
        
        return (
            <Grid  style={styles.container}>
                <Row>
                    <Col sm={6}>
                        <h3 style= {styles.title}> Estimate your rent</h3>
                    </Col>
                </Row>
                <Row style={styles.apartmentData}>
                    <Col sm={2} > 
                        <select onChange={this.roomsChange} style={styles.valueBox}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <b>Beds</b>
                    </Col>
                        
                    <Col sm={2} >
                        <select onChange={this.bathChange} style={styles.valueBox}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <b>Baths</b>
                    </Col>
                    <Col sm={2} > 
                        <input type="number" min = "1" onChange={this.sqftChange} value= {this.state.sqft}style={styles.ftTextBox}/>
                        <b>Sqft </b>
                    </Col>              
                </Row>
                <Row>
                    <Col sm={6}>
                        <button onClick={this.getEstimate} style={styles.button}> get estimate</button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} style={styles.result}>
                        {this.state.hasEstimate ?
                            <div> 
                                your Estimate:<b> {this.state.hasEstimate} $</b>

                                <div style={styles.disclaimer} >**disclaimer: values are based on median rents with similar values</div>
                            </div>

                        :null}
                    </Col>
                </Row>
            </Grid> 
        );
    }
});

module.exports = RentEstimator;
