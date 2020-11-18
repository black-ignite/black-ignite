import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapStoreToProps from '../../redux/mapStoreToProps';
import AppBar from '../AppBar/AppBar';
import JurorTalkCategory from '../JurorTalkCategory/JurorTalkCategory';
import './JurorPage.css';

class JurorView extends Component {
  componentDidMount() {
    this.getTalk();
    this.getLike();
  }

  getTalk = () => {
    console.log('Fetching talks');

    this.props.dispatch({
      type: 'FETCH_ALL_TALKS',
    });
  };

  getLike = () => {
    console.log('fetching max likes');
    this.props.dispatch({
      type: 'FETCH_MAX_LIKES',
    });
  };

  render() {
    console.log('this.props for jurorPage', this.props);
    let remainingLikes = this.props.store.likes.likes;
    return (
      <div>
        <div id="topicContainer">
          <p>You have {JSON.stringify(remainingLikes)} likes remaining.</p>
          <AppBar />
          {this.props.store.talks.map((talk) => (
            <JurorTalkCategory
              key={talk.id}
              id={talk.id}
              topicId={talk.id}
              title={talk.title}
              remainingLikes={remainingLikes}
              getLikeFunction={this.getLike}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStoreToProps)(JurorView);
