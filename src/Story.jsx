// @flow
import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import elasticClient from '../elastic/connection';
import esb from 'elastic-builder';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Story extends React.Component {

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
    console.log(nextProps);

    const requestBody = esb.requestBodySearch()
    .query(
      esb.matchQuery('message_guid',
                     nextProps.storyId)
    );

    const self = this;

    elasticClient.search({
        index: 'esb_ppr',
        type: 'correlate_msg',
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
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="28 Feb. 20:11:43"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title"><b>Message received</b></h3>
          <h4 className="vertical-timeline-element-subtitle"><b>by External (INT1) environment</b></h4>
          <div>
            From 192.5.34.22
          </div>
          <div>User INT1\Prd_ClientPool</div>
          <p>
            <button className='btn'
                    onClick={this.openModal}>Payload</button>
             <Modal
                style={customStyles}
                onRequestClose={this.closeModal}
                isOpen={this.state.modalIsOpen}
                contentLabel="Example Modal">
                <div>Payload is display here</div>
             </Modal>
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="+23 ms."
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title">Message analyzed</h3>
          <h4 className="vertical-timeline-element-subtitle">by External (INT1) environment</h4>
          <p>
            Creative Direction, User Experience, Visual Design, SEO, Online Marketing
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="+31 ms."
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title">Message routed</h3>
          <h4 className="vertical-timeline-element-subtitle">To Internal (DOM) environment</h4>
          <p>
            User Experience, Visual Design
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="April 2013"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
          <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
          <p>
            Strategy, Social Media
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="November 2012"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
          <h4 className="vertical-timeline-element-subtitle">Certification</h4>
          <p>
            Creative Direction, User Experience, Visual Design
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          date="2002 - 2006"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}

        >
          <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
          <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
          <p>
            Creative Direction, Visual Design
          </p>
        </VerticalTimelineElement>
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
