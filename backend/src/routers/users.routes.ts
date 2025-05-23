import { Router } from "express"
import * as UsersController from "../controllers/users.controller"

const router = Router()


router.post("/users", UsersController.loginUser)
router.post("/users/create", UsersController.createUser)

export default router