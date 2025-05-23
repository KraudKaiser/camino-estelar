import {Request, Response, Router} from "express"
import {prisma} from "../db"
const router = Router()
router.get("/services", async(req:Request, res:Response) =>{
    const services = await prisma.service.findMany()
    res.json(services)
} )

router.get("/services/:id", async(req:Request, res:Response) =>{
    const serviceId = parseInt(req.params.id)
    const serviceFound = await prisma.service.findFirst({
        where:{
            id:serviceId
        },
        include:{
            category:true
        }
    })

    if(!serviceFound){
        res.status(404).json({error:"service not found"})
    }

    res.json(serviceFound)
})

router.post("/services", async(req:Request, res:Response)=>{
    const newProduct = await prisma.service.create({
        data: req.body
    })
    res.json(newProduct)
})

router.put("/services/:id", async(req:Request, res:Response) =>{
    const serviceId = parseInt(req.params.id)
    const serviceUpdated = await prisma.service.update({
        where:{
            id:serviceId
        },
        data:req.body
    })

    if(!serviceUpdated){
        res.status(404).json({error:"service not found"})
    }

    res.json(serviceUpdated)
})



router.delete("/services/:id", async(req:Request, res:Response) =>{
    const serviceId = parseInt(req.params.id)
    const serviceDeleted = await prisma.service.delete({
        where:{
            id:serviceId
        }
    })

    if(!serviceDeleted){
        res.status(404).json({error:"service not found"})
    }

    res.json(serviceDeleted)
})



export default router