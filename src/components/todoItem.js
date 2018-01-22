import React from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';
import {observable, expr} from 'mobx';
import { TASKS_LABEL } from '../constants';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

@observer
export default class TodoItem extends React.Component {
	@observable editText = "";

	render() {
		const {viewStore, todo} = this.props;
		return (
			<li className={[
				todo.completed ? "completed": "",
				expr(() => todo === viewStore.todoBeingEdited ? "editing" : "")
			].join(" ")}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={this.handleToggle}
					/>
					<label onDoubleClick={this.handleEdit} onClick={this.handleAddTag}>
						{todo.title}
					</label>
					<button className="destroy" onClick={this.handleDestroy} />
				</div>
				<input
					ref="editField"
					className="edit"
					value={this.editText}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
				/>
			</li>
		);
	}

	// TODO : onBlur={this.handleSubmit} Removed, figure out if it was needed...

	handleSubmit = (event) => {
		const val = this.editText.trim();

		if (this.props.viewStore.todoAddingTags) {
			// TODO : Add the ability to add multiple tags
			if (val !== TASKS_LABEL) {
				this.props.todo.tags = val.split(',').map(tag => tag.trim());
			}
		} else if (val) {
			this.props.todo.setTitle(val);
			this.editText = val;
		} else {
			this.handleDestroy();
		}

		this.props.viewStore.todoBeingEdited = null;
		this.props.viewStore.todoAddingTags = false;
	};

	handleDestroy = () => {
		this.props.todo.destroy();
		this.props.viewStore.todoBeingEdited = null;
	};

	handleEdit = () => {
		const todo = this.props.todo;
		this.props.viewStore.todoBeingEdited = todo;
		this.editText = todo.title;
	};

	handleKeyDown = (event) => {
		if (event.which === ESCAPE_KEY) {
			this.editText = this.props.todo.title;
			this.props.viewStore.todoBeingEdited = null;
		} else if (event.which === ENTER_KEY) {
			this.handleSubmit(event);
		}
	};

	handleChange = (event) => {
		this.editText = event.target.value;
	};

	handleToggle = () => {
		this.props.todo.toggle();
	};

	handleAddTag = (event) => {
		if (event.altKey) {		
			const todo = this.props.todo;

			this.props.viewStore.todoBeingEdited = todo;
			this.props.viewStore.todoAddingTags = true;

			if (this.props.todo.tags != null && this.props.todo.tags.length > 0) {
				this.editText = this.props.todo.tags.join(',');
			} else {
				this.editText = TASKS_LABEL;	
			}
		}
	}
}

TodoItem.propTypes = {
	todo: PropTypes.object.isRequired,
	viewStore: PropTypes.object.isRequired
};