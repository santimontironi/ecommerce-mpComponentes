import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// export const createAdmin = async (req, res) => {
//     try{
//         const {username,password} = req.body

//         const passwordHashed = await bcrypt.hash(password, 10);

//         const admin = new Admin({
//             username,
//             password: passwordHashed
//         })

//         await admin.save();

//         res.status(201).json({message:"Admin creado correctamente"});
//     }
//     catch(error){
//         res.status(500).json({message:"Error al crear el admin", error: error.message});
//     }
// }

export const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Credenciales incorrectas" });
        }    

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({ message: "Inicio de sesión exitoso", admin });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};

export const logoutAdmin = async (req, res) => {
    try {
        res.clearCookie("token",{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
        res.status(500).json({ message: "Error al cerrar sesión", error: error.message });
    }
};