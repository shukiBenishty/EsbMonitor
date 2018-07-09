// @flow
import _ from 'lodash';

const INITIAL_STATE = {
  errorsCount: 0,
  storyId: '',
  analyzedStoryID: '',
  serviceName: '',
  message: '',
  eventId: 0,
  issued: Date(),
  status: '',
  filterValue: '',
  categories: [],
  activeTracing: true,
  activeEnvironment: 'test',
  inactiveEnvironment: 'production'
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'ENVIRONMENT_CHANGED': {

      state = _.assign({}, state, {
        inactiveEnvironment: state.activeEnvironment,
        activeEnvironment: action.data.environment
      })
    }
    break;

    case 'NEW_EVENT': {

      state = _.assign({}, state, {
                                    storyId: action.data.storyId,
                                    serviceName: action.data.serviceName,
                                    message: action.data.message,
                                    eventId: action.data.eventId,
                                    issued: new Date(action.data.issued),
                                    status: action.data.status
                                 });

      if( action.data.status.localeCompare("ERROR") == 0 ) {

        state = _.assign({}, state, {
                              errorsCount: ++state.errorsCount
                            })
      }
    }
    break;

    case 'ACTIVE_TRACING': {
      state = _.assign({}, state, {
                              activeTracing: action.data.activeTracing
                            })
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
