// kich hoat env
import dotenv from 'dotenv'
dotenv.config()
import express, { application } from 'express'// goij thu vien express
const server = express();//dung thu vien express tao ra server

// cau hinh cors cho phep moi nguon call api
import cors from 'cors';
server.use(cors());

//cau hinh req.body
import bodyParser from 'body-parser';
server.use(bodyParser.json())

// doi cau hin routing va yeu cau server bat/api voi routing do
import routerConfig from './routes'
server.use('/api', routerConfig)

// goi cau hinh view
import viewConfig from './views';
server.use(viewConfig);

/* public folder domain/file */
server.use(express.static("public"));
//res.setHeader('content-type', 'application/json')


// yeu cau server lawng nghe tai cong 3000 tren may
server.listen(process.env.PORT, () => {
    console.log("server dax chayj tu port", 3000);
})