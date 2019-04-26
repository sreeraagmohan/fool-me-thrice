import React from 'react';
import Cards, { Card } from 'react-swipe-card'

import { getStats } from '../actions/api';
import { withRouter } from 'react-router';

// Logos
import DashboardBlackLogo from '../assets/dashboard-black.svg';
import ReadLogo from '../assets/read.svg';
import WriteLogo from '../assets/write.svg';

import '../App.css';

class DashboardPageComponent extends React.Component {

  constructor() {
    super();

    this.state = {
      dummy: [1],
      top_cards: [],
      top_performers: []
    }

    if (!(sessionStorage.getItem('token'))) {
      this.props.history.push('/');
    }

    getStats()
      .then(response => {
        this.setState({
          ...this.state,
          top_cards: response.top_cards.slice(0, 3),
          top_performers: response.top_performers.slice(0, 3)
        })
      })

  }

  // Navigate to Read
  navigateToRead() {
    this.props.history.push('/read');
  }

  // Navigate to Read
  navigateToWrite() {
      this.props.history.push('/write');
  }

  renderTopCards() {
    return this.state.top_cards.map((item, index) => {
      return (
          <div key={index} className="row m-0 p-1">
            <div className="col-2 number-col-db">{item.upvotes}</div>
            <div className="col-10 text-col-db">{item.description}</div>
          </div>
        )
    })
  }

  renderTopPerformers() {
    return this.state.top_performers.map((user, index) => {
      return (
          <div key={index} className="row m-0 p-1">
            <div className="col-2 number-col-db">{user.sum}</div>
            <div className="col-10 text-col-db">{user.email}</div>
          </div>
        )
    })   
  }

  render() {
    return (
      <div>
        <Cards className='master-root'>
          {this.state.dummy.map(x =>
            <Card
              key={x}
            >
              <div className="dashboard-card-wrapper">
                <h5 className="card-header">Statistics</h5>
                <div className="card-body-dashboard p-2">
                  <div className="row m-0 p-1 row-header-db">
                    Top Cards
                  </div>
                  {this.renderTopCards()}
                  <hr></hr>
                  <div className="row m-0 p-1 row-header-db">
                    Top Performers
                  </div>
                  {this.renderTopPerformers()}
                </div>
                <div className="my-card-footer">
                  <div className="app-icons-row">
                    <div onClick={(e) => this.navigateToRead()} className="col-4">
                      <img width="40" height="40" src={ReadLogo} alt="Read Logo" />
                    </div>
                    <div className="col-4">
                      <img width="40" height="40" src={DashboardBlackLogo} alt="Dashboard Logo" />
                    </div>
                    <div onClick={(e) => this.navigateToWrite()} className="col-4">
                      <img width="40" height="40" src={WriteLogo} alt="Write Logo" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Cards>
      </div>
    )
  }
}

export default (withRouter)(DashboardPageComponent);