import React, { Component } from 'react';
import './TodoList.scss';

class TodoList extends Component {
	constructor() {
		super();

		this.state = {
			todos: [],
			todo: '',
			urgency: 'urgent',
            mood: 0,
            totalMood: 0
		};
	}

	componentDidMount() {
		console.log('mounted');
		const localStorageList = localStorage.getItem('todoList');
        const list = localStorageList ? JSON.parse(localStorageList) : [];
        const num = list.length
        this.setState({mood: num})
		this.setState({ todos: list });
	}

	componentDidUpdate() {
		console.log('updated');
		const stringified = JSON.stringify(this.state.todos);
        localStorage.setItem('todoList', stringified);
    }
    
    moodConfigurator = () => {
        const totalItems = this.state.todos.length;
        const moodTotal = this.state.mood + totalItems;
        this.setState({totalMood: moodTotal})
    }

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	submitHandler = (e) => {
		e.preventDefault();
		const todo = {
			id: Date.now(),
			todo: this.state.todo,
			importance: this.state.urgency,
			completed: false,
		};

		this.setState((prevState) => {
			return { todos: [ ...prevState.todos, todo ] };
        });
        this.moodConfigurator()
    };
    
    delete = (id) => {
        console.log(id)
        const filtered = this.state.todos.filter(el => {
            return el.id !== id
        })
        this.setState((prev) => {
            return this.setState({todos: filtered, mood: prev.mood - 1})
        })
        this.moodConfigurator()
    }

	moodHandler = (e) => {
        e.preventDefault();
        const questions = document.getElementsByClassName('questions')
        questions[0].classList.add('hidden')

    };

	valueChange = (e) => {
		const val = e.target.value;
		this.setState((prevState) => {
			return { mood: Number(prevState.mood) + Number(val) };
		});
	};
	render() {
		return (
			<div className='wrapper'>
				{console.log(localStorage)}
				<form onSubmit={(e) => this.submitHandler(e)}>
					<input value={this.state.todo} name='todo' onChange={(e) => this.onChange(e)} placeholder='item to do' />

					<select value={this.state.urgency} name='urgency' onChange={(e) => this.onChange(e)} id='importance'>
						<option value='urgent'>Urgent</option>
						<option value='important'>Important</option>
						<option value='notUrgent'>Not Urgent</option>
					</select>
					<button>Add Item</button>
				</form>
				<div className='todo-section'>
					{this.state.todos.map((item) => {
						return (
							<div  className='todo' key={item.id}>
								<p>{item.todo}</p>
                                <p>{item.importance}</p>
                                <p onClick={(() => this.delete(item.id))}>X</p>
							</div>
						);
					})}
				</div>
				<div className='questions'>
					<form onSubmit={(e) => this.moodHandler(e)}>
						<p>How Overwhelmed Do You Feel</p>
						<select name='mood' onChange={(e) => this.valueChange(e)}>
							<option value={4}>Very Overwhelmed</option>
							<option value={3}>Some What Overwhelmed</option>
							<option selected value={0}>
								I'm good
							</option>
						</select>
						<p>Describe your current mood</p>
						<select onChange={(e) => this.valueChange(e)} name='mood'>
							<option selected value={0}>
								😀
							</option>
							<option value={2}>😐</option>
							<option value={4}>😡</option>
                        </select>
                        <button>Submit</button>
                    </form>
                    
                </div>
                {this.state.mood > 7 ? <h1>Seek Help You Are Way Overwhelmed</h1>: <h1>You're Still Cool</h1>}
			</div>
		);
	}
}

export default TodoList;
