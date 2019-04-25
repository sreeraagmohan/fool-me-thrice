import React from 'react';
import Cards, { Card } from 'react-swipe-card'

import { getKeywords } from '../actions/api';
import { withRouter } from 'react-router';

// Logos
import DashboardLogo from '../assets/dashboard.svg';
import ReadLogo from '../assets/read.svg';
import WriteBlackLogo from '../assets/write-black.svg';

import '../App.css';

class WritePageComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      dummy: [1]
    }

    if (!(sessionStorage.getItem('token'))) {
      this.props.history.push('/');
    }
  }

  // Navigate to Read
  navigateToRead() {
    this.props.history.push('/read');
  }

  renderKeywords() {
    getKeywords()
      .then(res => console.log(res, 'x'));
  }

  render() {
    return (
      <div>
        <Cards className='master-root'>
        {this.state.dummy.map(x =>
                <Card
                  key={x}
                >
                    <div>
                      <div className="card-body">
                        <div className="keyword-container">
                          {this.renderKeywords()}
                        </div>
                      </div>
                      <div className="card-footer">
                        <div className="app-icons-row">
                          <div onClick={(e) => this.navigateToRead()} className="col-4">
                            <img width="40" height="40" src={ReadLogo} alt="Read Logo" />
                          </div>
                          <div className="col-4">
                            <img width="40" height="40" src={DashboardLogo} alt="Dashboard Logo" />
                          </div>
                          <div className="col-4">
                            <img width="40" height="40" src={WriteBlackLogo} alt="Write Logo" />
                          </div>
                        </div>
                      </div>
                    </div>
                </Card>
            )}
        </Cards>
        }
      </div>
    )
  }
}

export default (withRouter)(WritePageComponent);