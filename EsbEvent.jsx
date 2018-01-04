import React from 'react';
import moment from 'moment';

type Props = {
  data: Object
}

class EsbEvent extends React.Component<Props> {

  render() {

    let issued = moment(this.props.data.issued).format('DD/MM/YYYY HH:mm"s');

    return(<div>
              <div>{issued}</div>
              <div>{this.props.data.eventId}</div>
           </div>);

  }

};

export default EsbEvent;
