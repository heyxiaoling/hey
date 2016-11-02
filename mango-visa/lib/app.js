// import "../css/common.css";
// import "../css/holiday.css";
import React, {Component, PropTypes} from 'react';
import {render} from 'react-dom';
import {createStore,applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createHistory, useBasename} from 'history';
import {Router,Route,Link,IndexRoute,Redirect } from 'react-router';

import Reducers from './reducers/index';



import VISA from './visa/index';
import NotFound from './common/notFound';

const history = useBasename(createHistory)({
	basename: '/',
	queryKey: true
});


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(Reducers);

render(
	<Provider store={store}>
		<Router History={history}>
			<Route path="">
				<Redirect from="/" to="visa" />
				<Route path="visa">
					<IndexRoute component={VISA.HOME} name="签证"/>
					<Route path="orderlist/:id" component={VISA.ORDERLIST} name="签证订单列表"/>
					<Route path="details/:id" component={VISA.DETAILS} name="签证订单详情"/>
					<Route path="applicants/:id" component={VISA.APPLICANTS} name="申请人列表"/>
					<Route path="newapplicants" component={VISA.NEWAPPLICANTS} name="新添加申请人"/>
					<Route path="address/:id" component={VISA.ADDRESS} name="查找国家"/>
					<Route path="upload" component={VISA.UPLOAD} name="上传材料"/>
					<Route path="cancel" component={VISA.CANCEL} name="取消订单"/>
				</Route>
			</Route>
			<Route path="*" component={NotFound}/>
		</Router>
	</Provider>,
	document.getElementById('app')
)

