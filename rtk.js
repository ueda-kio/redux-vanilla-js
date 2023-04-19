(() => {
	const todoListSlice = RTK.createSlice({
		name: 'todoList',
		initialState: {
			todo: [],
			complete: [],
		},
		reducers: {
			addTodo: (state, action) => {
				return {
					todo: [
						...state.todo,
						{
							id: RTK.nanoid(),
							value: action.payload,
						},
					],
					complete: [...state.complete],
				};
			},
			completeTodo: (state, action) => {
				const target = state.todo.find((todo) => todo.id === action.payload);
				return {
					todo: state.todo.filter((todo) => todo.id !== action.payload),
					complete: [...state.complete, target],
				};
			},
			deleteTodo: (state, action) => {
				return {
					todo: state.todo.filter((todo) => todo.id !== action.payload),
					complete: [...state.complete],
				};
			},
		},
	});

	const { addTodo, deleteTodo, completeTodo } = todoListSlice.actions;

	const todoHtml = () =>
		`<li class="todoList__item">
		<span class="todoList__text" data-todo-value></span>
		<div class="todoList__btnWrapper">
			<button type="button" class="todoList__Btn -delete" data-button="delete">削除</button>
			<button type="button" class="todoList__Btn -complete" data-button="complete">完了</button>
		</div>
	</li>`.replace(/\t+/g, '');

	// render todos
	const renderTodos = (todo) => {
		const todoList = document.getElementById('todoList');
		todoList.innerHTML = '';

		todo.todo.forEach((todo) => {
			const fragment = document.createRange().createContextualFragment(todoHtml());
			const deleteButton = fragment.querySelector('[data-button="delete"]');
			const completeButton = fragment.querySelector('[data-button="complete"]');
			const todoValue = fragment.querySelector('[data-todo-value]');
			if (!deleteButton || !todoValue || !completeButton) return;

			deleteButton.addEventListener('click', () => {
				store.dispatch(deleteTodo(todo.id));
			});
			completeButton.addEventListener('click', () => {
				store.dispatch(completeTodo(todo.id));
			});
			todoValue.textContent = todo.value;

			todoList.appendChild(fragment);
		});
	};

	const rootReducer = {
		todoReducer: todoListSlice.reducer,
	};
	const store = RTK.configureStore({ reducer: rootReducer });

	// subscribe to store changes
	store.subscribe(() => {
		const currentState = store.getState();

		renderTodos(currentState.todoReducer);
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
})();
