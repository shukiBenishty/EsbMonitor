// @flow
import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Modal from 'react-modal';
import elasticClient from '../elastic/connection';
import esb from 'elastic-builder';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import Icon from './Icon';
import settings from './settings.json';
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
  modalIsOpen: boolean,
  events: [],
  curentEventIndex: number,
  serviceName: String
}

type Props = {
  storyId: string
}

class Story extends React.Component<Props, State> {

  state = {
    events: [],
    modalIsOpen: false,
    curentEventIndex: 0,
    serviceName: ''
  }

  constructor(props) {

    super(props);

    //const { match } = this.props;

    // this.state = {
    //   events: [],
    //   modalIsOpen: false,
    //   curentEventIndex: 0,
    //   serviceName: ''
    // }

    // this.styles = {
    //   noDataStyle: {
    //     width: '36%',
    //     margin: '0 auto'
    //   }
    // }

    //this.openModal = this.openModal.bind(this);
    //this.closeModal = this.closeModal.bind(this);
    //this.afterOpenModal = this.afterOpenModal.bind(this);
  }

  openModal(index: number) {

    this.setState({
      modalIsOpen: true,
      curentEventIndex: index}
    );
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.payload.textContent = this.state.events[this.state.curentEventIndex]._source.payload;
  }

  async getStoryEvents(storyId: number, rawIndexName: String) {

    try {

      const requestBody = esb.requestBodySearch()
      .query(
        esb.matchQuery('message_guid',
                       storyId)
      )
      .sort(esb.sort('start_date', 'asc'));

      const response = await elasticClient.search({
          index: rawIndexName,
          type: 'track',
          body: requestBody.toJSON()
      });

      if( response.hits.hits.length > 0  ) {

        this.setState({
          events: response.hits.hits
        })

      } else {

        this.setState({
          events: []
        })

      }

    } catch( err ) {
      console.error(err);

      // Only for tests purpose
      // this.setState({
      //   events: sampleStory
      // })

    }

  }

  async getServiceName(storyId: number, summaryIndexName: String, servicesIndexName: String) {

    try {

      let requestBody = esb.requestBodySearch()
      .query(
        esb.matchQuery('message_guid',
                       storyId)
      );

      let response = await elasticClient.search({
        index: summaryIndexName,
        type: 'summary',
        body: requestBody.toJSON()
      });

      if( response.hits.hits.length == 0  ) {
        console.error(`No results from ${summaryIndexName}`);
        return;
      }

      const serviceId = response.hits.hits[0]._source.service_id;

      requestBody = esb.requestBodySearch()
      .query(
        esb.matchQuery('service_id',
                       serviceId)
      );
      response = await elasticClient.search({
         index: servicesIndexName,
         body: requestBody.toJSON()
      });

      if( response.hits.hits.length == 0  ) {
        console.error(`No results from ${servicesIndexName}`);
        return;
      }

      this.setState({
        serviceName: response.hits.hits[0]._source.name
      });

    } catch( err ){
      console.error(err);
    }

  }

   componentDidMount() {

    let storyId = this.props.match.params.storyId;

    const rawIndexName = settings[this.props.environment].raw_index_name;
    const summaryIndexName = settings[this.props.environment].summary_index_name;
    const servicesIndexName = settings[this.props.environment].services_index_name;
    console.log(`Using ${rawIndexName} index`);

    // Execute search query against Raw index to get full story details
    // This is asynchronous invocation
    ::this.getStoryEvents(storyId, rawIndexName);
    // Execute almost (except order) same search query
    // against Summary index to get the details for caption
    //
    // This is also an asynchronous invocation
    ::this.getServiceName(storyId, summaryIndexName, servicesIndexName);

  }

  render() {

    if( this.state.events.length == 0 ) {
      return (<h4 className='noData'>No data was collected for this invocation</h4>

              )
    }

    return (
      <React.Fragment>
        <h2 className='serviceNameCaption'>Flow of {this.state.serviceName}</h2>
        <h3 className='serviceNameCaption'>({this.props.match.params.storyId})</h3>
        <VerticalTimeline>
          <Modal
             style={customStyles}
             onRequestClose={::this.closeModal}
             onAfterOpen={::this.afterOpenModal}
             isOpen={this.state.modalIsOpen}
             ariaHideApp={false}
             currentEventIndex = {1}
             contentLabel="Payload">
             <h2>Payload</h2>
             <div ref={ div => this.payload = div }>Message</div>
          </Modal>

          {

            this.state.events.map( (esbEvent, index) => {

              let iconStyle = ( esbEvent._source.status == 'success' ) ?
                                { background: 'rgb(33, 150, 243)', color: '#fff' } :
                                { background: 'rgb(233, 30, 99)', color: '#fff' };

              let iconType = ( esbEvent._source.status == 'success' )  ?
                              'icon ti-info' :
                              'icon ti-alert';

              let latency = moment.duration(moment(esbEvent._source.end_date).diff(moment(esbEvent._source.start_date)));
              let environment = ( esbEvent._source.environment == 'INT1' ) ? 'External' : 'Internal';

              return <VerticalTimelineElement key={index}
                        className="vertical-timeline-element"
                        date={moment(esbEvent._source.start_date).format('DD/MM/YYYY, hh:mm:ss.SS')}
                        iconStyle={iconStyle}
                        icon={<Icon type={iconType}/>}
                        >
                        <h3 className="vertical-timeline-element-title"><b>{esbEvent._source.message}</b></h3>
                        <h4 className="vertical-timeline-element-subtitle"><b>by Router at {environment} environment</b></h4>
                        <div>From {esbEvent._source.client_ip}</div>
                        <div>User {esbEvent._source.client_user}</div>
                        <p>
                          <button className='btn'
                                onClick={ () => ::this.openModal(index) }>Payload</button>
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
    environment: state.activeEnvironment
  }
}

export default connect(mapStateToProps)(Story);
