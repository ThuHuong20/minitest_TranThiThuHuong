import express from 'express';
const router = express.Router();
import fs from "fs";
import path from 'path';
import multiparty from 'multiparty';

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Some error occurred while reading file."
            })
        }
        return res.status(200).json({
            message: 'success!',
            data: JSON.parse(data)
        })
    })
})


router.get('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, 'todo.json'), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: 'Get data failed !'
                    }
                )
            }
            let todos = JSON.parse(data);

            for (let i in todos) {
                const todo = todos.find(todo => todo.id == req.params.id)
                console.log("todo", todo);
                fs.writeFile(path.join(__dirname, 'todo.json'), JSON.stringify(todos), (err) => {
                    if (err) {
                        return res.status(500).json(
                            {
                                message: 'Save data failed !'
                            }
                        )
                    }
                    return res.status(200).json(
                        {
                            data: todo
                        }
                    )
                })
            }

        })

    } else {
        res.status(500).json(
            {
                message: 'Failed!!!',
            }
        )
    }

})


router.post('/', (req, res) => {

    let form = new multiparty.Form();
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!")
        }
        console.log("fields", fields)

        let newTodo = {
            id: Date.now(),
            title: fields.title[0],
            completed: false
        }


        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Đọc dữ liệu thất bại!"
                    }
                )
            }

            let oldData = JSON.parse(data);

            for (let i in oldData) {
                if (oldData[i].title.includes(newTodo.title)) {
                    return res.status(500).json({
                        message: "Dữ liệu bị trùng"
                    })
                }
            }

            oldData.unshift(newTodo)
            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(oldData), (err) => {
                if (err) {
                    return res.status(500).json(
                        {
                            message: "Ghi file thất bại!"
                        }
                    )
                }
                return res.redirect("/todos")
            })
        })
    })
})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Error in deleting"
                })
            }
            let todos = JSON.parse(data);
            //let todoDelete = todos.find(todo => todo.id == req.params.id);
            todos = todos.filter(todo => todo.id != req.params.id)
            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: 'error writing to json.'
                    })
                }
                return res.status(200).json(
                    {
                        message: "Xóa thành công!"
                    }
                )
            })
        })
    }
})

router.patch('/:id', (req, res) => {
    // console.log(req.body)
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "todo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                })
            }
            let todos = JSON.parse(data);

            todos = todos.map(todo => {
                if (todo.id == req.params.id) {
                    flag = true;
                    return {
                        ...todo,
                        ...req.body
                    }
                }
                return todo
            })

            fs.writeFile(path.join(__dirname, "todo.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json(
                    {
                        message: "Patch todo thanh cong"
                    }
                )
            })
        })
    }
})
module.exports = router;