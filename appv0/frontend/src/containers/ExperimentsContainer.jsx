import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container, Row, Col, Card, CardBody, CardTitle, Input, Label, FormGroup,
} from 'reactstrap';
import {
  LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer,
} from 'recharts';

import { startFetchExperiments, changeLeftYAxis } from '../actions';

class ExperimentsContainer extends React.Component {
  componentDidMount() {
    const { projectId } = this.props.match.params; /* eslint-disable-line react/destructuring-assignment */
    this.props.startFetchExperiments(projectId); /* eslint-disable-line react/destructuring-assignment */
  }

  render() {
    const { experiments, keys, leftYAxis } = this.props;

    let data;
    if (experiments.length > 0) {
      data = experiments[0].log;
    } else {
      data = [];
    }

    return (
      <Container fluid>
        <Row>
          <Col xs="3">
            <Card>
              <CardBody>
                <CardTitle>Select YAxis</CardTitle>
                <FormGroup check>
                  {
                    keys.map((key) => (
                      <div key={key}>
                        <Label check>
                          <Input
                            type="radio"
                            name="yaxis"
                            value={key}
                            checked={key === leftYAxis}
                            onChange={(e) => { this.props.changeLeftYAxis(e.target.value); }} /* eslint-disable-line react/destructuring-assignment */
                          />
                          {' '}
                          {key}
                        </Label>
                      </div>
                    ))
                  }
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col xs="9">
            <ResponsiveContainer width="100%" height={700}>
              <LineChart data={data}>
                <XAxis dataKey="steps" />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dot={false} dataKey={leftYAxis} />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </Container>
    );
  }
}

ExperimentsContainer.propTypes = {
  match: PropTypes.any.isRequired, /* eslint-disable-line react/forbid-prop-types */
  experiments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      command: PropTypes.string.isRequired,
      args: PropTypes.object.isRequired,
      environ: PropTypes.object.isRequired,
      log: PropTypes.arrayOf(PropTypes.any).isRequired,
    })
  ).isRequired,
  keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  leftYAxis: PropTypes.string.isRequired,
  startFetchExperiments: PropTypes.func.isRequired,
  changeLeftYAxis: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const ret = {
    experiments: state.experiments,
    leftYAxis: state.leftYAxis,
  };

  if (state.experiments.length > 0 && state.experiments[0].log.length > 0) {
    ret.keys = Object.keys(state.experiments[0].log[0]);
  } else {
    ret.keys = [];
  }

  return ret;
};

export default connect(mapStateToProps, {
  startFetchExperiments,
  changeLeftYAxis,
})(ExperimentsContainer);
