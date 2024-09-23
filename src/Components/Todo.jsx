import React, { useState, useEffect } from 'react'
import { formatDate } from '../utils/helpers/date';
import TodoItem from './TodoItem';
import Calendar from './calendar/Calendar'
import '../static/css/global.css'
import '../css/todo.css'


const Todo = () =>{
    const [store, setStore] = useState([]);
    const [selectedDate, setSelectedDay] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [todo, setTodo] = useState({});

    useEffect(()=>{
        let stored = JSON.parse(localStorage.getItem("todo"));
        setStore(stored);
        if(stored){
            let filteredStored = stored.filter(
                (el)=> formatDate(new Date(el.creationDate),'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY'))
            setTasks(filteredStored);
        }
    },[selectedDate])

    const updateLocalStorage = (updatedTasks) => {
        localStorage.setItem("todo", JSON.stringify(updatedTasks));
        let filteredStored = updatedTasks.filter(
            (el)=> formatDate(new Date(el.creationDate),'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY'))
        setTasks(filteredStored);  
    }

    const addTodo = () => {
        if(todo.name && todo.text){
            const newTask = {
                id: Date.now(), 
                creationDate: selectedDate, 
                name: todo.name, 
                text: todo.text, 
                countDays: 0, 
                completed: false
            };
            const updatedTasks = [ ...store, newTask ];
            updateLocalStorage(updatedTasks);
            setStore(updatedTasks)
            setTodo({creationDate: 0, name: '', text: '', countDays: 0});
        }else {
            alert('Заполните поля')
        }
    }

    const deleteTodo = (id) => {
        const updatedTasks = store.filter((item)=> item.id !== id );
        updateLocalStorage(updatedTasks);
        setStore(updatedTasks)
    }
    
    const toggleTodo = (id) => {
        const updatedTasks = store.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );
        updateLocalStorage(updatedTasks);
        setStore(updatedTasks)
      };
     
  return (
    <div class='todo-container'>
        <Calendar selectedDate={selectedDate} selectDate={(date) => setSelectedDay(date)} />
        
        <div className='date__container'>{formatDate(selectedDate, 'DDD DD MMM YYYY')}</div>
        <div className="add-todo">
            <div className="add-todo-wrapper">
                <div className="todo-data">
                    <input 
                        type="text" 
                        className="input-name"
                        value={todo.name}
                        onChange={(e) => setTodo({creationDate: selectedDate, name: e.target.value, text: todo.text, countDays: 0})}
                    />
                    <input
                        type="text"
                        className="input-text"
                        value={todo.text}
                        onChange={(e) => setTodo({creationDate: selectedDate, name: todo.name, text: e.target.value, countDays: 0})}
                    />
                </div>
                
                <button className="todo-btn" onClick={addTodo}>
                Добавить задачу
                </button>
            </div>
            
        </div>

        <div className="todo-list">
            <h2>Список задач</h2>
            <ul>
            {tasks.map((item) => (
                <TodoItem
                key={item.id}
                item={item}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
                />
            ))}
            </ul>
        </div>

    </div>
  )
}

export default Todo
