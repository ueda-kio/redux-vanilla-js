// initial state
let initialState = {
	todos: [],
	visibilityFilter: 'SHOW_ALL',
};

// action types
const todoActionObj = {
	ADD_TODO: 'ADD_TODO',
	DELETE_TODO: 'DELETE_TODO',
};
const visibilityFilterActionObj = {
	SET_VISIBILITY_FILTER: 'SET_VISIBILITY_FILTER',
};

// const ADD_TODO = 'ADD_TODO';
// const DELETE_TODO = 'DELETE_TODO';
// const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

// action creators
/**
 *
 * @param {string} value todoに追加する文字列
 * @returns {object} action
 */
const addTodo = (value) => ({
	type: todoActionObj.ADD_TODO,
	payload: {
		id: Date.now(),
		value,
	},
});

const deleteTodo = (id) => ({
	type: todoActionObj.DELETE_TODO,
	payload: id,
});

const setVisibilityFilter = (filter) => ({
	type: visibilityFilterActionObj.SET_VISIBILITY_FILTER,
	payload: filter,
});

// todos reducer
const todosReducer = (state = initialState, action) => {
	switch (action.type) {
		case todoActionObj.ADD_TODO:
			return {
				...state,
				todos: [...state.todos, action.payload],
			};
		case todoActionObj.DELETE_TODO:
			return {
				...state,
				todos: state.todos.filter((todo) => todo.id !== action.payload),
			};
		default:
			return state;
	}
};

// visibilityFilter reducer
const visibilityFilterReducer = (state = initialState, action) => {
	switch (action.type) {
		case visibilityFilterActionObj.SET_VISIBILITY_FILTER:
			return {
				...state,
				visibilityFilter: action.payload,
			};
		default:
			return state;
	}
};

// rootReducer
const rootReducer = Redux.combineReducers({
	todosReducer,
	visibilityFilterReducer,
});

// store
const store = Redux.createStore(rootReducer, initialState);

const todoHtml = () =>
	`<li class="todoList__item">
		<span class="todoList__text" data-todo-value></span>
		<div class="todoList__btnWrapper">
			<button type="button" class="todoList__Btn -delete" data-button="delete">削除</button>
			<button type="button" class="todoList__Btn -complete" data-button="complete">完了</button>
		</div>
	</li>`.replace(/\t+/g, '');

// render todos
const renderTodos = (todos) => {
	const todoList = document.getElementById('todoList');
	todoList.innerHTML = '';

	todos.forEach((todo) => {
		const fragment = document.createRange().createContextualFragment(todoHtml());
		const deleteButton = fragment.querySelector('[data-button="delete"]');
		const todoValue = fragment.querySelector('[data-todo-value]');
		if (!deleteButton || !todoValue) return;

		deleteButton.addEventListener('click', () => {
			store.dispatch(deleteTodo(todo.id));
		});
		todoValue.textContent = todo.value;

		todoList.appendChild(fragment);
		console.log(fragment.children);
	});
};

// render filter
const renderFilter = (filter) => {
	const filterList = document.getElementById('filter-list');
	filterList.innerHTML = '';

	const filters = ['SHOW_ALL', 'SHOW_ACTIVE', 'SHOW_COMPLETED'];

	filters.forEach((f) => {
		const li = document.createElement('li');
		const button = document.createElement('button');
		button.innerText = f;
		button.disabled = f === filter;

		button.addEventListener('click', () => {
			store.dispatch(setVisibilityFilter(f));
		});

		li.appendChild(button);
		filterList.appendChild(li);
	});
};

// subscribe to store changes
store.subscribe(() => {
	const currentState = store.getState();

	renderTodos(currentState.todosReducer.todos);
	renderFilter(currentState.visibilityFilter);
});

// add todo form
const addTodoForm = document.getElementById('add-todo-form');
addTodoForm.addEventListener('submit', (e) => {
	e.preventDefault();
	/** @type {string} */
	const value = e.currentTarget.todo.value.trim();
	if (value) {
		store.dispatch(addTodo(value));
		e.currentTarget.reset();
	}
});
