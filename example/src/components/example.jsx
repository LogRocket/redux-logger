import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToken, removeToken, setInfo } from 'actions/auth';

import uuid from 'uuid';

import UI from 'components/ui';
const { Grid } = UI;

class Example extends Component {
  updateToken() {
    this.props.dispatch(setToken(uuid.v4()));
  }

  removeToken() {
    this.props.dispatch(removeToken());
  }

  loadUser() {
    this.props.dispatch(setInfo(1, `evgenyrodionov`));
  }

  render() {
    return (
      <Grid.Container>
        <h1>Open your console!</h1>

        <Grid.Row>
          <Grid.Col xs={12}>
            <h2>Actions</h2>

            <Grid.Row>
              <Grid.Col sm={3}>
                <UI.Button kind="primary" block onClick={::this.updateToken}>Update token</UI.Button>
              </Grid.Col>
              <Grid.Col sm={3}>
                <UI.Button kind="primary" block onClick={::this.removeToken}>Remove token</UI.Button>
              </Grid.Col>
              <Grid.Col sm={3}>
                <UI.Button kind="primary" block onClick={::this.loadUser}>Load user info</UI.Button>
              </Grid.Col>
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>

        <Grid.Row>
          <Grid.Col xs={12}>
            <h2>State</h2>
            <pre>{JSON.stringify(this.props.state, null, 2)}</pre>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    );
  }
}

const pickState = (state) => ({ state });

export default connect(pickState)(Example);
