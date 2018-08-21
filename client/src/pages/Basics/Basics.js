import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { StateDropdown, StateDropdownItem } from "../../components/StateDropdown";
import { CityDropdown, CityDropdownItem } from "../../components/CityDropdown";
import { Input, TextArea, FormBtn } from "../../components/Form";
import "./Basics.css";


class Basics extends Component {
  state = {
    basics: [],
    usa_state: "",
    usa_city: "",
    stateList: [],
    cityList: []
  };

  componentDidMount() {
    this.loadBasics();
  }

  loadBasics = () => {
    API.getBasics()
      .then(res => {
        this.buildStateArray(res.data);
      })
      .catch(err => console.log(err));
  };

  buildStateArray(passedData) {
    const listOfStates = passedData.map(p => p.usa_state);
    this.setState({ basics: passedData, stateList: listOfStates, cityList: [] })
  }

  change = event => {
    event.preventDefault();
    // console.log(event.target.value)
    // console.log(this.state.basics)
    for ( var s = 0; s < this.state.basics.length; s++) {
      if (this.state.basics[s].usa_state === event.target.value) {

        let tempArray = [];
        tempArray = this.state.basics[s].usa_city.split(","); 
        console.log(tempArray);
        this.setState({ 
          usa_state: event.target.value, 
          cityList: tempArray
        });
        // console.log(this.state.cityList);
       }
    }

  }

  changeCity = event => {
    console.log("changeCity")
    console.log("event.target.value=" + event.target.value)
    this.setState({ 
      usa_city: event.target.value
    });
  }
  
  render() {
    return (
      <Container fluid>
        <video id="bgVideo" loop autoPlay>
          <source src="./USA_Map.mp4" type="video/mp4" />
          <source src="./USA_Map.mp4'" type="video/ogg" />
          Your browser does not support the video tag.
      </video>
        <Row>
          <Col size="md-12">
            <img src={"./flag9c.png"} alt="AmeriGuide" height="70px" />
          </Col>
        </Row>
        <Row>
          <Col size="md-6">
            {/* *********************** */}
            {/* ***  STATE DROPDOWN *** */}
            {/* *********************** */}
            {this.state.basics.length ? (
              <StateDropdown onChange={this.change} value={this.name}>
                {this.state.basics.map(basic => {
                  return (
                    <StateDropdownItem
                      key={basic._id}
                      name={basic.usa_state}
                      onChange={this.change}
                    />
                  )
                })}
              </StateDropdown>
            ) : (
                <h3>Loading...</h3>
              )}
          </Col>
          <Col size="md-6">
            {/* ********************** */}
            {/* ***  CITY DROPDOWN *** */}
            {/* ********************** */}
    
            {this.state.cityList.length ? (
               <CityDropdown onChange={this.changeCity} value={this.name}>
            {this.state.cityList.map(city=>{
              return(
              <CityDropdownItem
                       key={city}
                      name={city}
                      onChange={this.changeCity}
                   />)
            })}</CityDropdown>
            
            ) : (
                <h3>Loading...</h3>
              )}
          </Col>
         
        </Row>
        <Row>
          <Col size="md-6">
          <br/>
            <Jumbotron>
              <h1>Left</h1>
            </Jumbotron>
            {/* <form>
              <Input value={this.state.usa_state} 
                    onChange={this.handleInputChange} 
                    name="usa-state" 
                    placeholder="State (required)" />
              <Input value={this.state.usa_city} 
                    onChange={this.handleInputChange} 
                    name="usa-city" 
                    placeholder="City (required)" />
              <TextArea value={this.state.usa_city} 
                    onChange={this.handleInputChange} 
                    name="usa-other" 
                    placeholder="Other City (Optional)" />
              <FormBtn onClick={this.handleSubmit}>Submit Basic</FormBtn>
            </form> */}
          </Col>
          <Col size="md-6 sm-12">
          <br/>
            <Jumbotron>
              <h1>Right</h1>

            </Jumbotron>
            {/* {this.state.basics.length ? (
              <List>
                {this.state.basics.map(basic => {
                  console.log(basic)
                  return (
                    <ListItem key={basic._id}>
                      <a href={"/basics/" + basic._id}>
                        <strong> */}

            {/* {basic.usa_state} by {basic.usa_city}
                        </strong>
                      </a>
                      <DeleteBtn databasicid={basic._id} onClick={this.deleteBasic} />
                    </ListItem>
                  );
                })}
              </List>
            ) : ( */}
            <h3>No Results to Display</h3>
            {/* )} */}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Basics;
