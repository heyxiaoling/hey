import {combineReducers } from 'redux';
import RDcount from './reducer';
import Visa from './visa';



const Reducers = combineReducers({RDcount,Visa});
export default Reducers;