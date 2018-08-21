import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";

class Detail extends Component {
  state = {
    basic: {}
  };
  // Add code to get the basic with an _id equal to the id in the route param
  // e.g. http://localhost:3000/basics/:id
  // The basic id for this route can be accessed using this.props.match.params.id
  componentDidMount(){
    console.log(this.props);
    API.getBasic(this.props.match.params.id)
    .then(res => {
      console.log(res);
      this.setState({
        basic: res.data
      })
    })
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>
                {/* {this.state.basic.title} by {this.state.basic.author} */}                
                {this.state.basic.usa_state} by {this.state.basic.usa_city}
              </h1>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col size="md-10 md-offset-1">
            <article>
              <h1>Synopsis</h1>
              {/* <p>{this.state.basic.synopsis}</p> */}
              <p>{this.state.basic.usa_city}</p>
            </article>
          </Col>
        </Row>
        <Row>
          <Col size="md-2">
            <Link to="/">← Back</Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Detail;
