import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {pluralize} from '../utils';

@observer
export default class TodoTag extends React.Component {
	render() {
		const {tag} = this.props;

		return (
			<li 
				onClick={this.applyTagFiltering.bind(this)}
				data-tag={tag}
			>
				<a href="#" className={tag === this.props.viewStore.todoFilter ? "selected" : ""}> {tag} </a>
			</li>
		);
	}

	applyTagFiltering = (e, data) => {
		var tagFilter = e.currentTarget.dataset.tag;

		this.props.viewStore.todoFilter = tagFilter;
	}
}

TodoTag.propTypes = {
	viewStore: PropTypes.object.isRequired
}
