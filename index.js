let initialState = {
	todos: [],
};

// Action types
// const actionTypesObj = {
// 	ADD_TODO: 'ADD_TODO',
// 	DELETE_TODO: 'DELETE_TODO'
// }
const ADD_TODO = 'ADD_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Action creators
const addTodo = (text) => {
	return {
		type: ADD_TODO,
		payload: {
			id: Date.now(),
			text: text,
		},
	};
};

const deleteTodo = (id) => ({
	type: DELETE_TODO,
	payload: id,
});

// Reducer
const reducer = (state = [], action) => {
	switch (action.type) {
		case ADD_TODO:
			return {
				...state,
				todos: [...state.todos, action.payload],
			};
		case DELETE_TODO:
			return {
				...state,
				todos: state.todos.filter((todo) => todo.id !== action.payload),
			};
		default:
			return state;
	}
};

// Store
const store = Redux.createStore(reducer, initialState);

// Render function
const render = () => {
	const todos = store.getState();
	const todoList = document.getElementById('todoList');
	todoList.innerHTML = '';
	todos.forEach((todo) => {
		const li = document.createElement('li');
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.textContent = 'delete';
		btn.addEventListener('click', handleClickDeleteButton);
		li.textContent = todo.text;
		li.appendChild(btn);
		todoList.appendChild(li);
	});
};

// Subscribe to state changes and render the initial state
store.subscribe(render);
render();

// Handle button click event
const addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
	const input = document.getElementById('todoInput');
	const text = input.value.trim();
	if (text !== '') {
		const action = addTodo(text);
		store.dispatch(action);
	}
	input.value = '';
});

/** @param {Event} e */
const handleClickDeleteButton = (e) => {
	const target = e.currentTarget;
	if (!(target instanceof HTMLButtonElement)) return;
	const parent = target.closest('li');
	parent?.remove();
};
