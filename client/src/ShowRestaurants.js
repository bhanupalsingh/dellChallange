import React, { Component } from 'react';
import './App.css';
import {CardPanel} from 'react-materialize'
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Autocomplete from 'react-autocomplete'
import { Container, Row, Col } from 'reactstrap';




//styles
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: 400,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    actions: {
      display: 'flex',
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto'
     
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: red[500],
    },
  }));
  





var cuisines = [];


const RecipeReviewCard = ({rest}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
  
    function handleExpandClick() {
      setExpanded(!expanded);
    }

    return (
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                R
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title="Shrimp and Chorizo Paella"
            subheader="September 14, 2016"
          />

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
        </Card>
    );
}


const RenderEachRestuarent = ({response,classes}) => {
    return response.map(rest => {
        return (
        <Col>
          <Card className={classes.card}>
              <CardHeader
              avatar={
                  <Avatar aria-label="Recipe" className={classes.avatar}>
                  {rest["Restaurant Name"][0]}
                  </Avatar>
              }
              action={
                  <IconButton>
                  <MoreVertIcon />
                  </IconButton>
              }
              title={rest["Restaurant Name"]}
              subheader={rest["Cuisines"]}
              />
  
              <CardPanel className="teal lighten-4 black-text">
                  
                  <div className="card-content " >
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
          </Card>
        </Col> 
        );
      })
}


const RenderSurveys = ({response}) => {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
  
    function handleExpandClick() {
      setExpanded(!expanded);
    }

    if(response.length > 0){
    
    return (
        <Container>
            <Row>
                <RenderEachRestuarent response = {response} classes = {classes}/>
            </Row>
        </Container>
    );
    }else{
        return (
            <div>
                No Data Available
                {console.log("No data available.")}
            </div>
        );
    }
  }

class ShowRestaurants extends Component {

    state = {
        response: [],
        post: '',
        responseToPost: '',
        name : '',
        cuisines : [],
        searchText: '' ,
        searchSort : '',
        sort : ['Votes' ,'Rating' , 'Cost','Votes-desc' ,'Rating-desc' , 'Cost-desc',],
        expanded: false 
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

      handleExpandClick = () => {
        this.setState(state => ({ expanded: !state.expanded }));
      };


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
            <RenderSurveys response = {this.state.response}/>
          </div>
            </MuiThemeProvider>
          
        );
      }
    }
  export default ShowRestaurants;
  