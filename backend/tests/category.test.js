import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { allCategories } from "../controllers/category-controller.js";

jest.mock("../models/Category.js");
jest.mock("../config/cloudinary.js");

describe("Test unitario para obtener todas las categorías", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Debería obtener todas las categorías activas", async () => {
        const fakeCategories = [
            { _id: "1", name: "Categoría 1", active: true },
            { _id: "2", name: "Categoría 2", active: true }
        ]

        Category.find.mockResolvedValue(fakeCategories);

        await allCategories(req, res);

        expect(Category.find).toHaveBeenCalledWith({ active: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Categorias obtenidas correctamente",
            categories: fakeCategories
        });
    })

    test("Debería manejar errores al obtener categorías", async () => {
        Category.find.mockRejectedValue(new Error("Error de base de datos"));

        await allCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al obtener categorias",
            error: "Error de base de datos"
        });
    })
})