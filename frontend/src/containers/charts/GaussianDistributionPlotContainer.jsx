import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts';

import { hoverOnStep } from '../../actions';

/* eslint-disable prefer-destructuring */

class GaussianDistributionPlotContainer extends React.Component {
  constructor(props) {
    super(props);

    this.chart = React.createRef();
  }

  render() {
    const {
      logDataRows, focusedStep, selectedActionDimensionIndices, actionColors, stateValueReturned,
    } = this.props;

    logDataRows.forEach((logDataRow) => {
      /* eslint-disable-next-line no-param-reassign */
      logDataRow.trustRange = {};

      selectedActionDimensionIndices.forEach((actionIdx) => {
        /* eslint-disable-next-line no-param-reassign */
        logDataRow.trustRange[actionIdx] = [
          parseFloat(logDataRow.action_means[actionIdx] - Math.sqrt(logDataRow.action_vars[actionIdx])),
          parseFloat(logDataRow.action_means[actionIdx] + Math.sqrt(logDataRow.action_vars[actionIdx])),
        ];
      });
    });

    return (
      <ResponsiveContainer aspect={(16 / (9 * 0.85))} width="100%" height={null}>
        <AreaChart
          height={460}
          data={logDataRows}
          ref={this.chart}
          onMouseMove={() => { this.props.hoverOnStep(this.chart.current.state.activeLabel); }}
          stackOffset="silhouette"
        >
          {
            selectedActionDimensionIndices.map((actionIdx) => (
              <Area
                yAxisId="left"
                type="monotone"
                dot={false}
                dataKey={(v) => v.action[actionIdx]}
                key={`${actionIdx}_taken`}
                fill="#00000000"
                stroke={actionColors[actionIdx]}
              />
            ))
          }
          {
            selectedActionDimensionIndices.map((actionIdx) => (
              <Area
                yAxisId="left"
                type="monotone"
                dot={false}
                stroke={actionColors[actionIdx]}
                fill="#00000000"
                strokeDasharray="3 4 5 2"
                dataKey={(v) => v.action_means[actionIdx]}
                key={`${actionIdx}_mean`}
              />
            ))
          }
          {
            selectedActionDimensionIndices.map((actionIdx) => (
              <Area
                yAxisId="left"
                dataKey={(row) => row.trustRange[actionIdx]}
                stroke={actionColors[actionIdx]}
                fill={actionColors[actionIdx]}
                key={`${actionIdx}_trust_range`}
              />
            ))
          }
          {
            stateValueReturned && (
              <Area
                yAxisId="right"
                type="monotone"
                dot={false}
                fill="#00000000"
                stroke="red"
                dataKey="state_value"
              />
            )
          }
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="step" />
          <YAxis yAxisId="left" domain={['dataMin', 'dataMax']} tickFormatter={(v) => Number.parseFloat(v).toFixed(3)} />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <ReferenceLine yAxisId="left" x={focusedStep} stroke="green" />
        </AreaChart>
      </ResponsiveContainer>
    );
  }
}


GaussianDistributionPlotContainer.propTypes = {
  logDataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  focusedStep: PropTypes.number.isRequired,
  selectedActionDimensionIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  hoverOnStep: PropTypes.func.isRequired,
  actionColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  stateValueReturned: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  logDataRows: state.log.logDataRows.slice(state.plotRange.plotRangeLeft, state.plotRange.plotRangeRight + 1),
  focusedStep: state.plotRange.focusedStep,
  selectedActionDimensionIndices: state.chartControl.selectedActionDimensionIndices,
  actionColors: state.settings.actionColors,
  stateValueReturned: state.agentProfile.stateValueReturned,
});

export default connect(mapStateToProps, {
  hoverOnStep,
})(GaussianDistributionPlotContainer);
