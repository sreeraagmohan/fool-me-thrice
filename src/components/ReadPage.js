import React from 'react';
import Cards, { Card } from 'react-swipe-card';
import Lottie from 'react-lottie'
import correctAnimation from '../assets/lottie-files/433-checked-done.json';
import incorrectAnimation from '../assets/lottie-files/4386-connection-error.json';

import { getCards, updateScore } from '../actions/api';
import { withRouter } from 'react-router';

// Logos
import DashboardLogo from '../assets/dashboard.svg';
import ReadBlackLogo from '../assets/read-black.svg';
import WriteLogo from '../assets/write.svg';

import '../App.css';

class ReadPageComponent extends React.Component {

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
              id: -3,
              description: 'Come back again to check new cards!',
              upvotes: ''
            }];
          this.setState({ ...this.state, cards: endcard });
        } else {
          this.setState({ ...this.state, cards: response })
        }
      });
  }

  // Navigate to Write
  navigateToWrite() {
    this.props.history.push('/write');
  }


  // Navigate to Dashboard
  navigateToDashboard() {
    this.props.history.push('/dashboard');
  }

  // Handle the swipe action
  handleSwipe(dir, card, position) {
    if (dir === 'end') {
      let endcard =
      {
        id: -3,
        description: 'Come back again to check new cards!',
        upvotes: ''
      };
      this.setState({ ...this.state, cards: this.state.cards.push(endcard) });
    } else if ((card.id > 0) && (dir === card.fake)) {
      let error_card = {
        id: -2,
        description: 'You got fooled by the propaganda machine!',
        upvotes: '',
      };

      let body = {
        card_id: card.id,
        answer: dir
      }

      updateScore(body)
        .then(response => response);

      let temp = this.state.cards;
      temp.splice(position + 1, 0, error_card);

      this.setState({ ...this.state, cards: temp });
    } else if ((card.id > 0) && (dir !== card.fake)) {
      let positive_card = {
        id: -3,
        description: "You're right! What a player!",
        upvotes: ''
      };

      let temp = this.state.cards;
      temp.splice(position + 1, 0, positive_card);

      this.setState({ ...this.state, cards: temp });

      let body = {
        card_id: card.id,
        answer: dir
      }

      updateScore(body)
        .then(response => response);
    }
  }

  render() {

    const correctAnimationOptions = {
      loop: true,
      autoplay: true, 
      animationData: correctAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    const incorrectAnimationOptions = {
      loop: true,
      autoplay: true, 
      animationData: incorrectAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }     
    }

    return (
      <div>
        {this.state.isSwiped === false &&
          <Cards className='master-root'>
            {this.state.cards.map((x, index) =>
                <Card
                  key={x.id}
                  onSwipeLeft={(e) => this.handleSwipe(false, x, index)}
                  onSwipeRight={(e) => this.handleSwipe(true, x, index)}
                >
                  {x.id > 0 &&
                    <div className="card">
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
                      <div className="my-card-footer">
                        <div className="app-icons-row">
                          <div className="col-4">
                            <img width="40" height="40" src={ReadBlackLogo} alt="Read Logo" />
                          </div>
                          <div className="col-4">
                            <img width="40" height="40" src={DashboardLogo} alt="Dashboard Logo" />
                          </div>
                          <div onClick={(e) => this.navigateToWrite()} className="col-4">
                            <img width="40" height="40" src={WriteLogo} alt="Write Logo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {x.id === -3 &&                     
                    <div>
                      <div className="card-header"></div>
                      <div className="card-body-anim">
                        <Lottie options={correctAnimationOptions}
                          height={300}
                          width={300}
                        /> 
                        <p className="content-styles-anim">{x.description}</p>
                      </div>
                      <div className="my-card-footer">
                        <div className="app-icons-row">
                          <div className="col-4">
                            <img width="40" height="40" src={ReadBlackLogo} alt="Read Logo" />
                          </div>
                          <div onClick={(e) => this.navigateToDashboard()} className="col-4">
                            <img width="40" height="40" src={DashboardLogo} alt="Dashboard Logo" />
                          </div>
                          <div onClick={(e) => this.navigateToWrite()} className="col-4">
                            <img width="40" height="40" src={WriteLogo} alt="Write Logo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  {x.id === -2 &&                     
                    <div>
                      <div className="card-header"></div>
                      <div className="card-body-anim">
                        <Lottie 
                          options={incorrectAnimationOptions}
                          height={300}
                          width={300}
                        /> 
                        <p className="content-styles-anim">{x.description}</p>
                      </div>
                      <div className="my-card-footer">
                        <div className="app-icons-row">
                          <div className="col-4">
                            <img width="40" height="40" src={ReadBlackLogo} alt="Read Logo" />
                          </div>
                          <div className="col-4">
                            <img width="40" height="40" src={DashboardLogo} alt="Dashboard Logo" />
                          </div>
                          <div onClick={(e) => this.navigateToWrite()} className="col-4">
                            <img width="40" height="40" src={WriteLogo} alt="Write Logo" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </Card>
            )}
          </Cards>
        }
      </div>
    )
  }
}

export default (withRouter)(ReadPageComponent);