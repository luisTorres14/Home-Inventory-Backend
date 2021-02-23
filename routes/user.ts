import { Request, Response, Router } from "express";
import { User } from "../models/user.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verifyToken } from "../middlewares/authentication";

const userRoutes = Router();

//Login
userRoutes.post('/login', (req:Request, res:Response) => {
    const body = req.body;
    User.findOne({email: body.email}, (err:any, userDB:any) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                message: 'Usuario/contraseña no son correctas'
            })
        }

       if(userDB.comparePassword(body.password)){
           const tokenUser = Token.getJwtToken({
               _id: userDB._id,
               name: userDB.name,
               email: userDB.email,
               avatar: userDB.avatar
           });
           res.json({
               ok: true,
               token: tokenUser
           });
       }else{
        return res.json({
            ok: false,
            message: 'Usuario/contraseña no son correctas'
        })
       }
    })
})

// Creación de usuario
userRoutes.post('/create', (req:Request, res:Response)=> {
    
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };

    User.create( user ).then( userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        })
    })
});

userRoutes.put('/update', verifyToken, (req:any, res:Response)=> {

    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar
    }

    User.findByIdAndUpdate( req.user._id, user, { new: true }, (err, userDB) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                message: 'No existe un usuario con ese id'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser
        });
    })
});

userRoutes.get('/example', (req, res)=>{
    console.log('Entra');
    res.json({
        ok: true
    })
})

export default userRoutes;