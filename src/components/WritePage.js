import React from 'react';
import Cards, { Card } from 'react-swipe-card'

import { getCards, updateScore } from '../actions/api';
import { withRouter } from 'react-router';

// Logos
import DashboardLogo from '../assets/dashboard.svg';
import ReadLogo from '../assets/read.svg';
import WriteBlackLogo from '../assets/write-black.svg';

import '../App.css';

class WritePageComponent extends React.Component {

  constructor() {
    super();

    if (!(sessionStorage.getItem('token'))) {
      this.props.history.push('/');
    }

    this.state = {
      isSwiped: false,
      cards: []
    }

    getCards()
      .then(response => {
        if (response.length === 0) {
          let endcard = 
          [{
            id: -1,
            description: 'Come back again to check new cards! Team Fool Me Thrice',
            upvotes: ''
          }];
          this.setState({...this.state, cards: endcard });
        } else {
          this.setState({ ...this.state, cards: response })
        }
      });
  }

  // Navigate to Write
  navigateToWrite() {
    this.props.history.push('/write');
  }

  // Handle the swipe action
  handleSwipe(dir, card) {

    if (dir === 'end') {
      let endcard = 
        {
          id: -1,
          description: 'Come back again to check new cards! Team Fool Me Thrice',
          upvotes: ''
        };
        this.setState({...this.state, cards: this.state.cards.push(endcard)});
    }

    let body = {
      card_id: card.id,
      answer: dir
    }

    updateScore(body)
      .then(response => console.log(response, 'x'));
  }

  render() {
    return (
      <div>
        {this.state.isSwiped === false &&
          <Cards onEnd={() => this.handleSwipe('end')} className='master-root'>
            {this.state.cards.map(x =>
              <Card
                key={x.id}
                onSwipeLeft={() => this.handleSwipe(false, x)}
                onSwipeRight={() => this.handleSwipe(true, x)}
              >
                <div className="card-header">
                  <div className="points">
                    <i className="material-icons">favorite</i>
                    <div className="points-text">{x.upvotes}</div>
                  </div>
                </div>
                <div className="card-body">
                  <p className="content-styles">{x.description}</p>
                  <div className="share-row">
                    <i className="material-icons share-icon">share</i>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="app-icons-row">
                    <div className="col-4">
                      <img width="40" height="40" src={ReadLogo} alt="Read Logo" />
                    </div>
                    <div className="col-4">
                      <img width="40" height="40" src={DashboardLogo} alt="Dashboard Logo" />
                    </div>
                    <div onClick={(e) => this.navigateToWrite()} className="col-4">
                      <img width="40" height="40" src={WriteBlackLogo} alt="Write Logo" />
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