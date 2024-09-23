import PropTypes from "prop-types";
import '../css/todoItem.css'

const TodoItem = ({ item, onDelete, onToggle }) => {
    function customFormat(date) {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yyyy = date.getFullYear();

      dd = dd < 10 ? '0' + dd : dd;
      mm = mm < 10 ? '0' + mm : mm;

      return `${dd}/${mm}/${yyyy}`;
    }

    return (
      <li className="todo-item">
        
        {" "}
        <div className="item-wrapper">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
          />

          <div className="item-content">
            <div className="item-content-wrapper">
              <h3 className={item.completed ? "completed" : ""}>{item.name}</h3>


              <p className={item.completed ? "completed" : ""}>{item.text}</p>

              <div className="item-content-date">
                <div className="item-content-date-wrapper">
                  <p className={item.completed ? "completed" : ""}>{customFormat(new Date(item.creationDate))}</p>
                  <p className={item.completed ? "completed" : ""}>{Math.floor((Date.now() - new Date(item.creationDate))/1000/60/60/24 )+ " дней"}</p>
                </div>

              </div>
            </div>
            

          </div>
        </div>
        


        
        <button className="todo-btn" onClick={() => onDelete(item.id)}>
          Удалить
        </button>
      </li>
    );
  };
  
TodoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    creationDate: PropTypes.number.isRequired,
    task: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    countDays: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

  export default TodoItem;