// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import elasticClient from '../elastic/connection';
import esb from 'elastic-builder';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import sampleStory from './SampleStory';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    width                 : '600px',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

type State = {
  modalIsOpen: boolean
}

type Props = {
  storyId: string
}

class Story extends React.Component<Props, State> {

  constructor(props) {

    super(props);

    this.state = {
      events: [],
      modalIsOpen: false
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillReceiveProps(nextProps) {

    const requestBody = esb.requestBodySearch()
    .query(
      esb.matchQuery('message_guid',
                     nextProps.storyId)
    );

    const self = this;

    elasticClient.search({
        index: 'esb_ppr',
        type: 'msg',
        body: requestBody.toJSON()
    }).then( response => {
      console.log(response);

      self.setState({
        events: response.hits.hits
      })

    }).catch( error => {
      console.error(error);
    });
  }

  render() {

    return (
      <VerticalTimeline>
        {
          sampleStory.map( (esbEvent, index) => {

            let iconStyle = ( esbEvent.status == 'INFO' ) ?
                              { background: 'rgb(33, 150, 243)', color: '#fff' } :
                              { background: 'rgb(233, 30, 99)', color: '#fff' };

            return <VerticalTimelineElement key={index}
                      className="vertical-timeline-element--work"
                      date={moment(esbEvent.trace_Date).format('DD/MM/YYYY, h:mm:ss')}
                      iconStyle={iconStyle}
                      >
                      <h3 className="vertical-timeline-element-title"><b>{esbEvent.message}</b></h3>
                      <h4 className="vertical-timeline-element-subtitle"><b>by {esbEvent.environment} environment</b></h4>
                      <div>From {esbEvent.client_ip}</div>
                      <div>User {esbEvent.client_user}</div>
                      <p>
                        <button className='btn'
                              onClick={this.openModal}>Payload</button>
                        <Modal
                           style={customStyles}
                           onRequestClose={this.closeModal}
                           isOpen={this.state.modalIsOpen}
                           ariaHideApp={false}
                           contentLabel="Payload">
                           <div>{esbEvent.payload}</div>
                        </Modal>
                      </p>
                   </VerticalTimelineElement>
          })
        }
      </VerticalTimeline>
    )
  }

}

function mapStateToProps(state) {
    return {
      storyId: state.storyId
    }
}

export default connect(mapStateToProps)(Story);
