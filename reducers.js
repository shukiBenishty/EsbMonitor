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
  categories: []
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'STORY_ID': {
      state = _.assign({}, state, {
                                    analyzedStoryID: action.data
                                  }
                      )
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
