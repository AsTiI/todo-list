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
        
        if(stored){
            
            stored = stored.map((task)=>{
                if(!task.completed && formatDate(new Date(task.creationDate),'DD MM YYYY') < formatDate(new Date(Date()), 'DD MM YYYY')){
                    return {
                            ...task, 
                            countDays: Math.floor((Date.now() - new Date(task.creationDate))/1000/60/60/24 )
                        } 
                } else {
                    return task
                }
            })
            setStore(stored);

            updateLocalStorage(stored);

            let filteredStored = stored.filter(
                (el)=> (!el.completed && formatDate(new Date(el.creationDate),'DD MM YYYY') < formatDate(new Date(Date()), 'DD MM YYYY') 
                        && formatDate(new Date(Date()), 'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY'))
                        || (el.completed && formatDate(new Date(el.completedDate),'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY'))
                        || (formatDate(new Date(el.creationDate),'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY')
                        && formatDate(new Date(Date()),'DD MM YYYY') === formatDate(new Date(selectedDate), 'DD MM YYYY')))
            setTasks(filteredStored);
        }
    },[selectedDate])

    const updateLocalStorage = (updatedTasks) => {
        localStorage.setItem("todo", JSON.stringify(updatedTasks));
    }

    const addTodo = () => {
        if(todo.name && todo.text){
            const newTask = {
                id: Date.now(), 
                creationDate: selectedDate, 
                completedDate: "",
                name: todo.name, 
                text: todo.text, 
                countDays: 0, 
                completed: false
            };
            const updatedTasks = [ ...store, newTask ];
            setTasks([...tasks, newTask]);
            updateLocalStorage(updatedTasks);
            setStore(updatedTasks)
            setTodo({creationDate: 0, name: '', text: '', countDays: 0});
        }else {
            alert('Заполните поля')
        }
    }

    const deleteTodo = (id) => {
        const updatedTasks = store.filter((item)=> item.id !== id );
        setTasks(tasks.filter((item)=> item.id !== id ))
        updateLocalStorage(updatedTasks);
        setStore(updatedTasks)
    }
    
    const toggleTodo = (id) => {
        const updatedTasks = store.map((item) =>
          item.id === id ? { ...item, completed: !item.completed, completedDate: !item.completed? selectedDate : "" } : item
        );
        setTasks(tasks.map((item) =>
        item.id === id ? { ...item, completed: !item.completed, completedDate: !item.completed? selectedDate : "" } : item
      ))
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
                        onChange={(e) => setTodo({creationDate: selectedDate, completedDate: '', name: e.target.value, text: todo.text, countDays: 0})}
                    />
                    <input
                        type="text"
                        className="input-text"
                        value={todo.text}
                        onChange={(e) => setTodo({creationDate: selectedDate, completedDate: '', name: todo.name, text: e.target.value, countDays: 0})}
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
