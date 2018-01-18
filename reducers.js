// @flow
import _ from 'lodash';

const INITIAL_STATE = {
  storyId: '',
  serviceName: '',
  message: '',
  eventId: 0,
  issued: Date(),
  status: '',
  filterValue: '',
  socketSwitch: true
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'TOOGLE_SOCKET':
      state = _.assign({}, state, {
                                    socketSwitch: action.switch
                                  })
      break;

    case 'CLEAN_EVENTS': {

    }
    break;

    case 'NEW_EVENT': {

      if( state.socketSwitch ) {

        state = _.assign({}, state, {
                                      storyId: action.data.storyId,
                                      serviceName: action.data.serviceName,
                                      message: action.data.message,
                                      eventId: action.data.eventId,
                                      issued: new Date(action.data.issued),
                                      status: action.data.status
                                   })
      }
    }
    break;

    case 'FILTER_CHANGED': {
      state = _.assign({}, state, {
                                    filterValue: action.data.filterValue
                                 })
    }
    break;

  }

  return state;

};

export default reducers;
