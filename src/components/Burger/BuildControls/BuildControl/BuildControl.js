import React from 'react';
import classes from './buildControl.css';


const buildControl = (props) => (
  <div className={classes.BuildControl}>
    <div classes={classes.Label}>{props.label}</div>
    <button classes={classes.Less}>Less</button>
    <button classes={classes.More}>More</button>
  </div>
);


export default buildControl;