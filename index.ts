import Server from "./classes/server";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const server = new Server();

// middleware
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//Routes
server.app.use('/user', userRoutes);

//Connection DB
mongoose.connect('mongodb://localhost:27017/home_inventory',
                    {
                        useNewUrlParser: true, 
                        useCreateIndex: true,
                        authSource: 'admin',
                        user:'root', 
                        pass:'example'
                    }, 
                    (err) => {
                      if(err) throw err;
                      console.log('Success online BD');
                    },
                )



server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
})