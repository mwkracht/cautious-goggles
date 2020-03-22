import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';


export default class PageTitle extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    help: PropTypes.string.isRequired
  };

  state = {
    helpOpen: false
  };

  handleHelpClick = (e) => {
    e.preventDefault();

    this.setState({
      helpOpen: ! this.state.helpOpen
    })
  }

  render() {
    const { title, help } = this.props;

    return (
      <div>
        <h5 className='mb-0'>{title}</h5>
        <div className='small mb-2'>
          <a href="#" onClick={this.handleHelpClick}>{this.state.helpOpen ? 'hide' : 'show'} help</a>
        </div>
        {this.state.helpOpen && 
          <p className='mb-2 small'>{help}</p>
        }
      </div>
    )
  }
}
