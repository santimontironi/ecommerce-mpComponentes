import { loginAdmin } from "../controllers/admin-controllers.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/Admin.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// ============================================================================
// TEST: LOGIN DE ADMINISTRADOR
// ============================================================================

describe("Test unitarios del Login de Admin", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                username: "admin",
                password: "1234"
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn()
        };
    });

    test("Devuelve 401 si el admin no existe", async () => {
        Admin.findOne.mockResolvedValue(null);

        await loginAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Credenciales incorrectas"
        });
    });

    test("devuelve 401 si la contraseña es incorrecta", async () => {
        Admin.findOne.mockResolvedValue({
            _id: "123",
            username: "admin",
            password: "hash"
        });

        bcrypt.compare.mockResolvedValue(false);

        await loginAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: "Credenciales incorrectas"
        });
    });

    test("login exitoso devuelve 200, token y cookie", async () => {
        Admin.findOne.mockResolvedValue({
            _id: "123",
            username: "admin",
            password: "hash"
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("fake_token");

        await loginAdmin(req, res);

        expect(jwt.sign).toHaveBeenCalled();

        expect(res.cookie).toHaveBeenCalledWith(
            "token",
            "fake_token",
            expect.any(Object)
        );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Inicio de sesión exitoso",
            admin: {
                id: "123",
                username: "admin"
            }
        });
    });

    test("devuelve 500 si ocurre un error inesperado", async () => {
        Admin.findOne.mockRejectedValue(new Error("DB error"));

        await loginAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Error al iniciar sesión"
            })
        );
    });

});