import jwt from "jsonwebtoken"
import { ROLEENUM } from "../modules/admin/adminSchema"

export const createToken = ({ id, name, role }: { id: string | number, name: string, role: ROLEENUM }) => {
    return jwt.sign({ id, name, role }, process.env.JWTTOKEN, { expiresIn: "5h" })
}



export const verifyToken = (token: string) => { return jwt.verify(token, process.env.JWTTOKEN) as { id: string | number, name: string, role: ROLEENUM } }

