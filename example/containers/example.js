import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AuthActions from '../actions/auth';
import * as PropertiesActions from '../actions/properties';

class Example extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  render() {
    return (
      <section className="container">
        <div>
          <h1 className="header-title text-center">
            Open your console!
          </h1>
          <div className="container-modal text-center">
            <p>
              <button className="btn btn-pink" onClick={this.setToken.bind(this, '123456')}>Set token</button>
              <button className="btn btn-pink" onClick={this.setToken.bind(this, 'qwerty')}>Change token</button>
              <button className="btn btn-pink" onClick={this.removeToken.bind(this, '1', 'theaqua')}>Remove token</button>
              <button className="btn btn-pink" onClick={this.setInfo.bind(this, '1', 'theaqua')}>Set info</button>
            </p>
            <pre>auth: {JSON.stringify(this.props.auth)}</pre>
            <p>
              <button className="btn btn-blue" onClick={this.createProperties.bind(this)}>Load array</button>
              <button className="btn btn-blue" onClick={this.updateProperties.bind(this)}>Update array array</button>
            </p>
            <pre>properties: {JSON.stringify(this.props.properties)}</pre>
          </div>
        </div>
      </section>
    );
  }

  setToken(token) {
    this.props.actions.setToken(token);
  }

  setInfo(id, username) {
    this.props.actions.setInfo(id, username);
  }

  removeToken() {
    this.props.actions.removeToken();
  }

  createProperties() {
    this.props.actions.updateProperties([{
      id: 1,
      name: 'house',
    }, {
      id: 2,
      name: 'townhouse',
    }, {
      id: 3,
      name: 'flat',
    }]);
  }

  updateProperties() {
    this.props.actions.updateProperties([{
      id: 4,
      name: 'townhouse',
    }, {
      id: 5,
      name: 'flat',
    }]);
  }
}

function mapState(state) {
  return state;
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators({...AuthActions, ...PropertiesActions}, dispatch),
  };
}

const reduxConnector = connect(mapState, mapDispatch)(Example);

export default reduxConnector;
