import React, { Component } from 'react';
import './App.css';
import {CardPanel} from 'react-materialize'
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Autocomplete from 'react-autocomplete'


var cuisines = [];

class ShowRestaurants extends Component {

    state = {
        response: [],
        post: '',
        responseToPost: '',
        name : '',
        cuisines : [],
        searchText: '' ,
        searchSort : '',
        sort : ['Votes' ,'Rating' , 'Cost','Votes-desc' ,'Rating-desc' , 'Cost-desc',]
      };


    componentDidMount() {
        var cuisi = new Set([]);
        this.callApi()
          .then( (res) => {
              this.setState({ response: res })
              
              for(var i=0;i<res.length;i++){
                var tempData = res[i]['Cuisines'].trim().split(",");
                for(var j=0;j<tempData.length;j++){
                    cuisi.add(tempData[j].trim());
                }
              }
            
            console.log(cuisi);
            var array = [...cuisi];
            this.setState({cuisines : array });     
              
          })
          .catch(err => console.log(err));
      }
      callApi = async () => {
        const response = await fetch('/api/restaurants');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        console.log(body);
        return body;
      };

      handleSubmit = async(data) => {
          
        if(data){
            const response = await fetch('/api/restaurants/name/'+data);
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            console.log(body);
            return body;
        }else if(data === "") {
            return this.callApi();
        }
      }


      setName = (e) => {
        this.setState({ name : e.target.value });
        this.handleSubmit(e.target.value)
          .then(res => this.setState({ response: res }))
          .catch(err => console.log(err))
      }




      handleUpdateInput = (searchText) => {
        this.setState({
          searchText: searchText,
        });
        this.handleCuisinesSubmit(searchText)
          .then( (res) => {
              this.setState({ response: res })
          }).catch(err => console.log(err)); 

      };


      handleUpdateInputSort = (searchSort) => {
        this.setState({
            searchSort: searchSort,
        });
        this.handleSortSubmit(searchSort)
          .then( (res) => {
              this.setState({ response: res })
          }).catch(err => console.log(err)); 
      };
    
      handleSortSubmit = async(data) => {
        if(data){
            const response = await fetch('/api/restaurants/sort/'+data);
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            console.log(body);
            return body;
        }else if(data === "") {
            return this.callApi();
        }
      }


     handleCuisinesSubmit = async(data) => {
        if(data){
            const response = await fetch('/api/restaurants/cuisines/'+data);
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            console.log(body);
            return body;
        }else if(data === "") {
            return this.callApi();
        }
      }


    renderSurveys() {
        if(this.state.response.length > 0){
        return this.state.response.map(rest => {
          return (
            <div className="card darken-1 " key={rest._id}>
            <CardPanel className="teal lighten-4 black-text">
            
                <div className="card-content " >
                    <span className="card-title">{rest["Restaurant Name"]}</span>
                    <p>
                    {rest["Cuisines"]}
                    </p>
                    <p className="left">
                    {rest["Average Cost for two"]}  {rest["Currency"]}
                    </p>
                    
                    <p className="right">
                    Table Booking: {rest["Has Table booking"]} 
                    </p>
                    <br/>
                    <p className="right">
                        Online Delivery : {rest["Has Online delivery"]}  
                    </p>
                </div>
                <div className="card-action">
                    <p><font color={rest["Rating color"].replace(/ /g, '').toLowerCase()}>{rest["Aggregate rating"]} {rest["Rating text"]}</font></p>
                    <p>{rest["Votes"]}</p>
                </div>
            </CardPanel>
              
            </div>
          );
        });
        }else{
            return (
                <div>
                    No Data Available
                </div>
            );
        }
      }


    renderSearchBox(){
        return (
            <form>
                <div className="row">
                    <div className="col s12">
                    <div className="input-field inline">
                        <input id="name_inline" type="text"  onChange={ this.setName } value={ this.state.name } placeholder = "Type Restuarent Name"/>

                        <div>
                            <AutoComplete
                            hintText="plaese write cuisines name"
                            searchText={this.state.searchText}
                            onUpdateInput={this.handleUpdateInput}
                            onNewRequest={this.handleNewRequest}
                            dataSource={this.state.cuisines}
                            filter={(searchText, key) => (key.indexOf(searchText) !== -1)}
                            openOnFocus={true}
                            /> 
                        </div>


                        <div>
                            <AutoComplete
                            hintText="sort "
                            searchText={this.state.searchSort}
                            onUpdateInput={this.handleUpdateInputSort}
                            onNewRequest={this.handleNewRequest}
                            dataSource={this.state.sort}
                            filter={(searchSort, key) => (key.indexOf(searchSort) !== -1)}
                            openOnFocus={true}
                            /> 
                        </div>



                    </div>
                    </div>
                </div>
                
            </form>
        );
    }
    
      render() {
        return (
            <MuiThemeProvider>
                <div >
            {this.renderSearchBox()}  
            <br/>
            <br/>
            {this.renderSurveys()}
          </div>
            </MuiThemeProvider>
          
        );
      }
    }
  export default ShowRestaurants;
  