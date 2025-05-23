import {Request, Response} from "express"
import * as UsersServices from  "../services/users.service"

export const loginUser = async(req:Request,res:Response) =>{
    const data = req.body
    try{
        const token = await UsersServices.LoginUser(data)
        res.status(200).json(token)
    }catch(e:unknown){
        if(e instanceof Error){
            console.error(e.message)
            res.status(404).json({error:e.message})
        }else{
            res.status(500).json({error:"Unknown error"})
        }
    }
}

export const createUser = async(req:Request, res:Response) =>{
    const data = req.body
    try{
        const token = await UsersServices.CreateUser(data)
        res.status(200).cookie('access_token', token, {
            httpOnly:true,
        }).send("token enviado")
    }catch(e){
        if(e instanceof Error){
            console.error(e)
            console.error(e.message)
            res.status(404).json({error:e.message})
        }else{
            console.error(e)
            res.status(500).json({error:"Unknown error"})
        }
    }
}