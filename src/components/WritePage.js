import React from 'react';
import Cards, { Card } from 'react-swipe-card';
import { Modal, Button } from 'react-bootstrap';

import { getKeywords, createCard } from '../actions/api';
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
      dummy: [1],
      subjects: [],
      verbs: [],
      victims: [],
      selectedWords: [],
      row0: ['', '', ''],
      row1: ['', '', ''],
      row2: ['', '', ''],
      showConfirmModal: false,
      showSuccessModal: false
    }

    if (!(sessionStorage.getItem('token'))) {
      this.props.history.push('/');
    }

    getKeywords()
      .then(res => {
        this.setState({
          ...this.state,
          topic_id: res.topic.id,
          subjects: res.subjects.map(x => x.name),
          verbs: res.verbs.map(x => x.name),
          victims: res.victims.map(x => x.name)
        })
      });
  }

  // Navigate to Read
  navigateToRead() {
    this.props.history.push('/read');
  }

  // Navigate to Dashboard
  navigateToDashboard() {
    this.props.history.push('/dashboard');
  }

  handleButtonClick = (word) => {
    let x = this.state.selectedWords;
    if (x.length < 3) {
      x.push(word);
      this.setState({ ...this.state, selectedWords: x });
    }
    this.renderSentenceConstruct();
  }

  handleRemoveWord = (word) => {
    let x = this.state.selectedWords;
    x = x.filter(item => item !== word)
    this.setState({ ...this.state, selectedWords: x });
    this.renderSentenceConstruct();
  }

  handleInputChange = (index, position, input) => {

    let x = this.state[`row${index}`];
    x[position] = input;

    this.setState({
      ...this.state,
      [`row${index}`]: x
    })
  }

  resetStates = () => {
    this.setState({
      ...this.state,
      showConfirmModal: false,
      showSuccessModal: false,
      selectedWords: [],
      row0: ['', '', ''],
      row1: ['', '', ''],
      row2: ['', '', '']
    })

    // Get new words from the API
    getKeywords()
    .then(res => {
      this.setState({
        ...this.state,
        topic_id: res.topic.id,
        subjects: res.subjects.map(x => x.name),
        verbs: res.verbs.map(x => x.name),
        victims: res.victims.map(x => x.name)
      })
    });
  }

  createFakeCard = () => {

    // Get all selected words and interpolate them
    this.state.selectedWords.forEach((word, index) => {
      let x = this.state[`row${index}`];
      x[1] = word;
      this.setState({
        ...this.state,
        [`row${index}`]: x
      })
    });

    // Concatenate all words and build the string
    let x = this.state.row0.concat(this.state.row1, this.state.row2);
    x = x.join(' ');

    this.setState({
      ...this.state,
      currentSentence: x,
      showConfirmModal: true
    });
  }

  handleSubmit = () => {

    this.showConfirmModal = false;

    let body = {
      topic_id: this.state.topic_id,
      description: this.state.currentSentence,
      fake: true
    }

    createCard(body)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            ...this.state,
            showSuccessModal: true
          })
        }
      });
  }

  renderSentenceConstruct() {
    return (
      this.state.selectedWords.map((word, index) => {
        return (
          <div key={index}>
            <div className="row inputs-row">
              <input value={this.state[`row${index}[0]`]} onChange={(e) => this.handleInputChange(index, 0, e.target.value)} className="form-control write-form-control" type="text"></input>
              <button onClick={() => this.handleRemoveWord(word)} className="btn btn-dark selector-button">{word}</button>
              <input value={this.state[`row${index}[2]`]} onChange={(e) => this.handleInputChange(index, 2, e.target.value)} className="form-control write-form-control" type="text"></input>
            </div>
            {index > 1 &&
              <div className="row create-btn-row m-0">
                <button onClick={() => this.createFakeCard()} className="btn create-btn btn-success">Create</button>
              </div>}
          </div>
        )
      })
    )
  }

  renderKeywords() {
    let words = [];
    words = words.concat(this.state.subjects, this.state.verbs, this.state.victims);
    return (
      words.map((s, index) => <div key={index} className="col-6 selector-btn-col"><button type="button" className="btn btn-dark selector-button" onClick={() => this.handleButtonClick(s)}>{s}</button></div>)
    )
  }

  render() {
    return (
      <div>
        <Cards className='master-root'>
          {this.state.dummy.map(x =>
            <Card
              key={x}
            >
              <div className="write-card-wrapper">
                <h5 className="card-header">Construct your card</h5>
                <div className="card-body-write">
                  <div className="sentence-construct-container">
                    {this.renderSentenceConstruct()}
                  </div>
                  <div className="keyword-select-container">
                    <div className="row">
                      <div onClick={() => this.resetStates()} className="col-1 ml-1">
                        <i className="material-icons refresh-icon">refresh</i>
                      </div>
                    </div>
                    <div className="row">
                      {this.renderKeywords()}
                    </div>
                  </div>
                </div>
                <div className="my-card-footer">
                  <div className="app-icons-row">
                    <div onClick={(e) => this.navigateToRead()} className="col-4">
                      <img width="40" height="40" src={ReadLogo} alt="Read Logo" />
                    </div>
                    <div onClick={(e) => this.navigateToDashboard()} className="col-4">
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
        <Modal animation={false} show={this.state.showConfirmModal} onHide={() => this.setState({...this.state, showConfirmModal: false})}>
          <Modal.Header>
            <Modal.Title>Confirm your card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.currentSentence}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({...this.state, showConfirmModal: false})}>Cancel</Button>
            <Button onClick={() => this.handleSubmit()}>Create Card</Button>
          </Modal.Footer>
        </Modal>
        <Modal animation={false} show={this.state.showSuccessModal} onHide={() => this.setState({...this.state, showSuccessModal: false})}>
          <Modal.Header>
            <Modal.Title>New card created</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.currentSentence}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.resetStates()}>Okay</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default (withRouter)(WritePageComponent);