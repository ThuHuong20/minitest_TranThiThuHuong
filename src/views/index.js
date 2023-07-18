import axios from 'axios';
import express from 'express'
const router = express.Router();
import fs from 'fs';
import path from 'path';

router.use('/', (req, res) => {
    fs.readFile(path.join(__dirname, "templates/todolist.html"), 'utf-8', async (err, data) => {
        if (err) {
            return res.send("Load ui error")
        }
        let todoContent = ``;

        let todos;
        await axios.get("http://localhost:3000/api/v1/todos")
            .then(res => {
                todos = res.data.data
            })
            .catch(err => {
                todos = [];
            })



        todos.map((todo) => {
            todoContent += `
                <li class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                         <div class="d-flex align-items-center">
                             ${todo.completed
                    ? `     <input class="form-check-input me-2" type="checkbox" value="" checked="false" onChange={changeTodo(event,${todo.id})}
                         aria-label="..." />`
                    : `     <input class="form-check-input me-2" type="checkbox" value=""  onChange={changeTodo(event,${todo.id})}
                         aria-label="..." />`}

                        
                               ${!todo.completed ? `<span>${todo.title} </span>` : `<span style="text-decoration: line-through">${todo.title} </span>`}
                        </div>
                         <button  style="color:white" onclick={deleteTodo(${todo.id})} type="button" class="btn btn-danger">Delete</button>
                 </li>
            `
        })
        res.send(data.replace("{{todoContent}}", todoContent));
    })
})


module.exports = router;