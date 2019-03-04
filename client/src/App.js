import React, { Component } from 'react';
import './App.css';
import ShowRestaurants from './ShowRestaurants';


class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  componentDidMount() {
    // this.callApi()
    //   .then(res => this.setState({ response: res }))
    //   .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch('/api/restaurants');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    this.setState({ responseToPost: body });
  };
render() {
    return (
      <div className="App">
        
          {/* <p>
            <strong>www.bhanupal.com</strong> <br/>
            <strong>http://bhanuchatsystem.herokuapp.com</strong> <br/>
            <strong>http://bhanupalsingh.herokuapp.com</strong> <br/>
          </p>  */}
        
        <ShowRestaurants />
        </div>
    );
  }
}
export default App;
