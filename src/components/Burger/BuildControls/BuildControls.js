import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'bacon' },
  { label: 'Meat', type: 'bacon' }
];
const buildControls = (props) => (
  <div className={classes.BuildControls}>
    {controls.map(ctrl => (
      <BuildControl key={ctrl.lablel} label={ctrl.label} />
    ))}
  </div>
);

export default buildControls;