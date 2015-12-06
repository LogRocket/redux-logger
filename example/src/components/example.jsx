import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AuthActions from 'actions/auth';

import uuid from 'uuid';

import UI from 'components/ui';
const { Grid } = UI;

class Example extends Component {
  updateToken() {
    this.props.actions.setToken(uuid.v4());
  }

  removeToken() {
    this.props.actions.removeToken();
  }

  loadUser() {
    this.props.actions.setInfo(1, `theaqua`);
  }

  render() {
    return (
      <Grid.Container>
        <h1>Open your console!</h1>

        <Grid.Row>
          <Grid.Col xs={12}>
            <h2>Auth actions</h2>

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

            <ul>
              <li><strong>Remove token</strong> will not be logged because logger uses <code>predicate</code> option which ignore action with type <code>AUTH_REMOVE_TOKEN</code>.</li>
              <li><strong>Load user info</strong> has <code>next state</code> as green because logger uses custom <code>colors</code> option.</li>
            </ul>
          </Grid.Col>
        </Grid.Row>

        <Grid.Row>
          <Grid.Col xs={12}>
            <h2>State info</h2>
            <pre>{JSON.stringify(this.props.state, null, 2)}</pre>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    );
  }
}

const pickState = (state) => ({ state });
const pickActions = (dispatch) => ({ actions: bindActionCreators(AuthActions, dispatch) });

export default connect(pickState, pickActions)(Example);
