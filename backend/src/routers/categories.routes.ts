import {Request, Response, Router} from "express"
import {prisma} from "../db"
const router = Router()

router.get("/categories", async(req:Request, res:Response) =>{
    const categories = await prisma.category.findMany()
    res.json(categories)
} )

router.post("/categories", async(req:Request, res:Response)=>{
    const newCategory = await prisma.category.create({
        data: req.body,
        include:{
            services:true
        }
    })
    res.json(newCategory)
})



export default router
