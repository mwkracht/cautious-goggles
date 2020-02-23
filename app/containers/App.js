import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MainSection from '../components/MainSection';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <MainSection />
      </div>
    );
  }
}
