'use strict';
/**
 * Created by kinfen on 16/1/30.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';

var MainLoading = React.createClass({
	getInitialState () {
		return {
			loading:false

		};
	},
	componentDidMount () {

	},
	render(){
		var node;
		if (this.state.loading)
		{
			node = (
				<div className="loadingSpinner">
					<div className="dot1" />
					<div className="dot2" />
				</div>
			);
			$('#loading').show();
		}
		else {
			node = null;
			
			$('#loading').hide();
		}

		return node;
	},
		
});

mainLoading = ReactDOM.render(
	<MainLoading />,
	$('#loading')[0]
);
