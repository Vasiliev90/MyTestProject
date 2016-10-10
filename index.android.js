/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Text, 
  View,
  StyleSheet,
  TextInput,
  ToastAndroid,
  Slider, 
  AppRegistry, 
  Navigator, 
  TouchableHighlight,
  TouchableNativeFeedback, 
  Platform,
  Image,
  ListView,
  Dimensions

} from 'react-native';


import GridView from 'react-native-grid-view';


var API_KEY = '3438813-7b8f217c074b960f4612c6732';
var SEARCH_REQUEST = "";
var API_URL;
var PARAMS;
var REQUEST_URL;
var MOVIES_PER_ROW = 4;
var SPACE = 3;

const window = Dimensions.get('window');
var square = 150;

class MyTestProject extends Component {
  
  render() {
    
    return (
            <Navigator
                initialRoute={{name: 'FirstScene', component: FirstScene}}
                configureScene={() => {
                    return Navigator.SceneConfigs.FloatFromRight;
                }}
                renderScene={(route, navigator) => {
                    // count the number of func calls
                    console.log(route, navigator); 

                    if (route.component) {
                        return React.createElement(route.component, { navigator });
                    }
                }}
             />
        );
  }

}

class SliderExample extends Component {
  static defaultProps = {
    value: 1,
  };

  state = {
    value: this.props.value,
  };

  render() {

    MOVIES_PER_ROW = this.state.value;
    square = (window.width - SPACE) / MOVIES_PER_ROW - SPACE;

    return (

      <View style={styles.sliderView}>
        <Slider {...this.props}
          onValueChange={(value) => this.setState({value: value}) } />
        <Text style={styles.text} >
          {this.state.value && +this.state.value.toFixed(3)}
        </Text>
        
      </View>
    );
  }
}

export default class FirstScene extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      request: "",

    };

  }

  onPressSearch() {
    console.log(this.state.request);
        let request = this.state.request;

        SEARCH_REQUEST = request;
        

        this.props.navigator.push({
            name: 'SecondScene',
            component: SecondScene
        });
  }

  render() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
     TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View style={styles.container}>

        <View style={styles.searchView}>
          <Text style={styles.welcome}>
            Search Term:
          </Text>
          <TextInput style={styles.textinput}
            placeholder="Enter a request"
            ref= "request"
            onChangeText={(request) => this.setState({request: request})}
            value={this.state.request}
            >

          </TextInput>
        </View>

        <View style={styles.searchView}>
          <Text style={styles.welcome}>
            Columns:
          </Text>
          <SliderExample
          width={200}
          minimumValue={1}
          maximumValue={6}
          step={1}

        />
        </View>

        <TouchableElement
          style={styles.button}
          onPress={this.onPressSearch.bind(this)}>
            <View>
            <Text style={styles.welcome}> 
              SEARCH 
            </Text>
          </View>
        </TouchableElement> 
        <Text>{this.state.request}</Text>

      </View>
    );
  }
}

export class SecondScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      loaded: false,
    }
  }

  onPressSearch() {
    console.log(this.state.request);
              

        this.props.navigator.pop({
            name: 'FirstScene',
            component: FirstScene
        });
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData() {

    API_URL = 'https://pixabay.com/api/?key=3438813-7b8f217c074b960f4612c6732&q=soccer&image_type=photo&pretty=true';
    PARAMS = '?key=' +  API_KEY + '&q=' + SEARCH_REQUEST + '&image_type=photo&pretty=true';
    REQUEST_URL = API_URL + PARAMS;

    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: responseData.hits,
          loaded: true,
        });
      })
      .done();
  }

  render() {


    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
         TouchableElement = TouchableNativeFeedback;
        }
    return ( 
       <View style={styles.container}> 
        
        <View  style={styles.overlay}>
        <GridView
           items={this.state.dataSource}
           itemsPerRow={MOVIES_PER_ROW}
           renderItem={this.renderItem}
           style={styles.listView}
         />
       </View>

        <View style={styles.addButton}>
          <TouchableElement style={styles.addButton}
           underlayColor='#ff7043' onPress={this.onPressSearch.bind(this)}>
            <View>
              <Text style={{fontSize: 15, color: 'black'}}>
                back
              </Text>
            </View>
          </TouchableElement>
        </View>
        </View>

    );
  }

  renderLoadingView() {
    return (
      <View>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  }

  renderItem(item) {
      return <Movie image={item} />
  }
}

class Movie extends Component {
  render() {
      return (
        <View 
        style={{height: square + SPACE, flex: 1, alignItems: 'center', flexDirection: 'column'}}
         
         >
          <Image
            source={{uri: this.props.image.previewURL}}
            style={{width: square, height: square}}

          />

        </View>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  searchView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#F5FCFF',
  },
  sliderView: {

    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 10,
    margin: 5,
  },
  button: {
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 7,
    padding: 10,
    borderRadius: 15,
  },
  welcome: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
  textinput: {
    width: 200,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  list: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
  },
  item: {
       backgroundColor: '#CCC',
       margin: 10,
       width: 100,
       height: 100
  },

  title: {
    fontSize: 10,
    marginBottom: 8,
    width: 90,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },

  listView: {
    paddingTop: 5,
    backgroundColor: '#F5FCFF',
  },
  addButton: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
    borderWidth: 1,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
    left:20,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },


});



AppRegistry.registerComponent('MyTestProject', () => MyTestProject);
