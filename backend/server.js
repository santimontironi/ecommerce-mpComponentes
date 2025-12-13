import { connectDB } from "./bd/bd.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config()

async function startServer(){
    try{
        await connectDB()
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });
    }
    catch(error){
        console.error("Error al iniciar el servidor:", error);
    }
}

export default startServer