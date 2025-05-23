import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

const prisma = new PrismaClient()
dotenv.config()


export const LoginUser = async(data) =>{
    const {email, password} = data
    const user = await prisma.user.findUnique({
        where:{
            email:email,
        }
    })

    if(!user){
        throw new Error("Tu correo electronico y/o contraseña son invalidos. Vuelve a intentarlo")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        throw new Error("Tu correo electronico y/o contraseña son invalidos. Vuelve a intentarlo")
    }

    const token = jwt.sign(
        {
            userId:user.id,
            email:user.email,
            role:user.role
        },
        process.env.JWT_SECRET!,
        {expiresIn:"1h"}
        
    )

    return token
}

export const CreateUser = async(data) =>{
    const {email, name, password} = data

    if(typeof email != "string") throw new Error("email must be a string")
    if(!email.includes("@")) throw new Error("Verify that you have a valid email")

    if(typeof name != "string") throw new Error("name must be a string")
    if(name.length < 3) throw new Error("name must be at least 2 characters long")


    if(typeof password != "string") throw new Error("password must be a string")
    if(password.length < 6) throw new Error("password must be at least 6 characters long")

    const foundUser = await prisma.user.findUnique({
        where:{
            email
        }
    })

    if(foundUser) throw new Error("User already exists!")
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!))

    const user = await prisma.user.create({
        data:{
            name:name,
            email:email,
            password:hashedPassword
        }
    })

    const token = jwt.sign({
        id:user.id,
        name:user.name,
        email:user.email,
        role:user.role
    },
    process.env.JWT_SECRET!,
    {expiresIn:"1h"}
)

return token

}