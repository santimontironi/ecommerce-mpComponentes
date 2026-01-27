import { products } from "../controllers/product-controller.js";
import Product from "../models/Product.js";

jest.mock("../models/Product.js");

describe("Test unitario de la obtención de productos", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Limpiar mocks después de cada test, evita que un test “ensucie” al siguiente
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve codigo 200 de los productos sin params", async () => {

        const fakeProducts = [
            { name: "Producto 1", active: true },
            { name: "Producto 2", active: true }
        ];

        Product.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeProducts)
        });

        await products(req, res);

        expect(Product.find).toHaveBeenCalledWith({ active: true });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: "Productos obtenidos correctamente",
            products: fakeProducts
        });
    });

    test("Devuelve codigo 200 de los productos con params", async () => {

        req.params.categoryId = "cat123";

        const fakeProducts = [
            { name: "Producto categoría", category: "cat123" }
        ];

        Product.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeProducts)
        });

        await products(req, res);

        expect(Product.find).toHaveBeenCalledWith({
            active: true,
            category: "cat123"
        });

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            message: "Productos obtenidos correctamente",
            products: fakeProducts
        });
    });

    test("Devuelve 500 si ocurre un error", async () => {

        Product.find.mockReturnValue({
            sort: jest.fn().mockRejectedValue(new Error("Error al obtener productos"))
        });

        await products(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            message: "Error al obtener productos",
            error: "Error al obtener productos"
        });
    });
})