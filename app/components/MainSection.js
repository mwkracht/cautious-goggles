import React, { Component } from 'react';
import GBInvestment from './GBInvestment';
import GBMain from './GBMain';
import Motivations from './Motivations';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';

export default class MainSection extends Component {

  render() {
    return (
      <div className="MainSection">
        <Tabs defaultActiveKey="greatbuilding" id="top-level-tabs">
          <Tab eventKey="greatbuilding" title="GB">
            <GBMain />
          </Tab>
          <Tab eventKey="motivation" title="Motivations">
            <Motivations />
          </Tab>
        </Tabs>
      </div>
    );
  }
}
