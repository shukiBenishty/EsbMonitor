import _ from 'lodash';

const INITIAL_STATE = {
  eventId: 0,
  issued: Date()
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'NEW_EVENT':
      state = _.assign({}, state, {
                                      eventId: action.data.eventId,
                                      issued: new Date(action.data.issued)
                                  });

  }

  return state;

}

export default reducers;
