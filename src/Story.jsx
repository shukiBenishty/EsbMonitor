// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import elasticClient from '../elastic/connection';
import esb from 'elastic-builder';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import Icon from './Icon';
import 'react-vertical-timeline-component/style.min.css';

import settings from './settings.json';
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
  modalIsOpen: boolean,
  events: []
}

type Props = {
  storyId: string,
  styles: {}
}

class Story extends React.Component<Props, State> {

  state = {
    events: [],
    modalIsOpen: false
  }

  constructor() {

    super();

    this.styles = {
      noDataStyle: {
        width: '36%',
        margin: '0 auto'
      }
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {

    let storyId = this.props.match.params.storyId;

    const requestBody = esb.requestBodySearch()
    .query(
      esb.matchQuery('message_guid',
                     storyId)
    )
    .sort(esb.sort('start_date', 'asc'));

    const self = this;
    console.log(settings[this.props.activeEnvironment].raw_index_name);

    elasticClient.search({
        index: settings[this.props.activeEnvironment].raw_index_name,
        type: 'track',
        body: requestBody.toJSON()
    }).then( response => {
      console.log(response);

      if( response.hits.hits.length > 0  ) {
        self.setState({
          events: response.hits.hits
        })
      } else {
        self.setState({
          events: []
        })
      }

    }).catch( error => {
      console.error(error);

      // Only for tests purpose
      self.setState({
        events: sampleStory
      })
    });
  }

  render() {

    if( this.state.events.length == 0 ) {
      return (<h4 style={this.styles.noDataStyle}>No data was collected for this invocation</h4>

              )
    }

    const { location } = this.props;
    let serviceName = location.serviceName;

    return (
      <React.Fragment>
        <h2 style={this.styles.noDataStyle}>Story for {serviceName}</h2>
        <VerticalTimeline>
        {
          this.state.events.map( (esbEvent, index) => {

            let iconStyle = ( esbEvent._source.status == 'Success' ) ?
                              { background: 'rgb(33, 150, 243)', color: '#fff' } :
                              { background: 'rgb(233, 30, 99)', color: '#fff' };

            let iconType = ( esbEvent._source.status == 'Success' )  ?
                            'icon ti-info' :
                            'icon ti-alert';

            let latency = moment.duration(moment(esbEvent._source.end_date).diff(moment(esbEvent._source.start_date)));
            let environment = ( esbEvent._source.environment == 2 ) ? 'External' : 'Internal';

            return <VerticalTimelineElement key={index}
                      className="vertical-timeline-element"
                      date={moment(esbEvent._source.start_date).format('DD/MM/YYYY, h:mm:ss.SS') + ' Latency: ' + latency + ' ms.'}
                      iconStyle={iconStyle}
                      icon={<Icon type={iconType}/>}
                      >
                      <h3 className="vertical-timeline-element-title"><b>{esbEvent._source.message}</b></h3>
                      <h4 className="vertical-timeline-element-subtitle"><b>by {environment} environment</b></h4>
                      <div>From {esbEvent._source.client_ip}</div>
                      <div>User {esbEvent._source.client_user}</div>
                      <p>
                        <button className='btn'
                              onClick={::this.openModal}>Payload</button>
                        <Modal
                           style={customStyles}
                           onRequestClose={::this.closeModal}
                           isOpen={this.state.modalIsOpen}
                           ariaHideApp={false}
                           contentLabel="Payload">
                           <div>{esbEvent._source.payload}</div>
                        </Modal>
                      </p>
                   </VerticalTimelineElement>
          })
        }
      </VerticalTimeline>
      </React.Fragment>
    )
  }

}

const mapStateToProps = state => {
  return {
    activeEnvironment: state.activeEnvironment
  }
}

export default connect(mapStateToProps)(Story);
