import React from 'react';

import RentEstimator from './rentEstimator.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        <RentEstimator/>
      </div>
    );
  }
}
