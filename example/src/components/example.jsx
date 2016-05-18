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
              <li><strong>Remove token</strong> produces an action of <code>AUTH_REMOVE_TOKEN</code> type that is not logged because <code>predicate</code> option ignores it.</li>
              <li><strong>Load user info</strong> shows the next state in green because logger uses custom <code>colors</code> option.</li>
              <li><strong>Update token</strong> is logged with states difference because <code>diff</code> option is turned on. Diff is limited to current action only because of <code>diffPredicate</code> option.</li>
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
