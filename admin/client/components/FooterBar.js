import React from 'react';
import blacklist from 'blacklist';

var FooterBar = React.createClass({
	propTypes: {
		style: React.PropTypes.object,
	},
	getDefaultProps () {
		return {
			style: {},
		};
	},
	getInitialState () {
		return {
			width: 'auto',
			height: 'auto',
			top: 0
		};
	},
	componentDidMount () {
		// Bail in IE8 because React doesn't support the onScroll event in that browser
		// Conveniently (!) IE8 doesn't have window.getComputedStyle which we also use here
		//if (!window.getComputedStyle) return;
		//var footer = this.refs.footer;
		//this.windowSize = this.getWindowSize();
		//var footerStyle = window.getComputedStyle(footer);
		//this.footerSize = {
		//	x: footer.offsetWidth,
		//	y: footer.offsetHeight + parseInt(footerStyle.marginTop || '0')
		//};
	},
	getWindowSize () {
		return {
			x: window.innerWidth,
			y: window.innerHeight,
		};
	},
	render () {
		var wrapperStyle = {
			height: this.state.height
		};
		var footerProps = blacklist(this.props, 'children', 'style');
		var footerStyle = Object.assign({}, this.props.style, {
			width: this.state.width,
			height: this.state.height
		});
		return (
			<div ref="wrapper" style={wrapperStyle}>
				<div ref="footer" style={footerStyle} {...footerProps}>{this.props.children}</div>
			</div>
		);
	},
});

module.exports = FooterBar;
