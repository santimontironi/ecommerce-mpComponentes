import { products, productById, productsWithoutStock, addProduct, deleteProduct, editProduct, orderProduct } from "../controllers/product-controller.js";
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import mail_transporter from "../config/nodemailer_config.js";

jest.mock("../models/Product.js");
jest.mock("../config/cloudinary.js");
jest.mock("../config/nodemailer_config.js");

// ============================================================================
// TEST: OBTENCIÓN DE PRODUCTOS
// ============================================================================

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

// ============================================================================
// TEST: OBTENER PRODUCTO POR ID
// ============================================================================

describe("Test unitario de productById", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { id: "product123" }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 200 y el producto encontrado", async () => {
        const fakeProduct = { 
            _id: "product123", 
            name: "Producto Test", 
            price: 100 
        };

        Product.findById.mockResolvedValue(fakeProduct);

        await productById(req, res);

        expect(Product.findById).toHaveBeenCalledWith("product123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto obtenido correctamente',
            product: fakeProduct
        });
    });

    test("Devuelve 500 si ocurre un error", async () => {
        Product.findById.mockRejectedValue(new Error("Error en la base de datos"));

        await productById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al obtener producto',
            error: "Error en la base de datos"
        });
    });
});

// ============================================================================
// TEST: PRODUCTOS SIN STOCK
// ============================================================================

describe("Test unitario de productsWithoutStock", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 200 y productos con stock menor a 5", async () => {
        const fakeProducts = [
            { name: "Producto 1", stock: 2, active: true },
            { name: "Producto 2", stock: 4, active: true }
        ];

        Product.find.mockResolvedValue(fakeProducts);

        await productsWithoutStock(req, res);

        expect(Product.find).toHaveBeenCalledWith({
            active: true,
            stock: { $lt: 5 }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Productos sin stock obtenidos correctamente',
            products: fakeProducts
        });
    });

    test("Devuelve 500 si ocurre un error", async () => {
        Product.find.mockRejectedValue(new Error("Error al buscar productos"));

        await productsWithoutStock(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al obtener productos sin stock',
            error: "Error al buscar productos"
        });
    });
});

// ============================================================================
// TEST: AGREGAR PRODUCTO
// ============================================================================

describe("Test unitario de addProduct", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: "Producto Nuevo",
                price: 200,
                description: "Descripción del producto",
                category: "cat123",
                stock: 10
            },
            file: {
                mimetype: "image/jpeg",
                buffer: Buffer.from("fake-image-data")
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 201 y crea un producto correctamente", async () => {
        const fakeCloudinaryResult = {
            secure_url: "https://cloudinary.com/fake-image.jpg"
        };

        cloudinary.uploader.upload.mockResolvedValue(fakeCloudinaryResult);

        const fakeProduct = {
            _id: "newProduct123",
            name: "Producto Nuevo",
            image: fakeCloudinaryResult.secure_url,
            price: 200,
            category: "cat123",
            stock: 10,
            description: "Descripción del producto",
            save: jest.fn().mockResolvedValue(true)
        };

        Product.mockImplementation(() => fakeProduct);

        await addProduct(req, res);

        expect(cloudinary.uploader.upload).toHaveBeenCalled();
        expect(fakeProduct.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto agregado correctamente',
            product: fakeProduct
        });
    });

    test("Devuelve 500 si ocurre un error al subir la imagen", async () => {
        cloudinary.uploader.upload.mockRejectedValue(new Error("Error al subir imagen"));

        await addProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al agregar producto',
            error: "Error al subir imagen"
        });
    });
});

// ============================================================================
// TEST: ELIMINAR PRODUCTO
// ============================================================================

describe("Test unitario de deleteProduct", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { id: "product123" }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 200 y marca el producto como inactivo", async () => {
        const fakeProduct = {
            _id: "product123",
            name: "Producto Test",
            active: false
        };

        Product.findByIdAndUpdate.mockResolvedValue(fakeProduct);

        await deleteProduct(req, res);

        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith("product123", { active: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Producto eliminado correctamente',
            product: fakeProduct
        });
    });

    test("Devuelve 500 si ocurre un error", async () => {
        Product.findByIdAndUpdate.mockRejectedValue(new Error("Error al eliminar"));

        await deleteProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al eliminar producto',
            error: "Error al eliminar"
        });
    });
});

// ============================================================================
// TEST: EDITAR PRODUCTO
// ============================================================================

describe("Test unitario de editProduct", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            params: { id: "product123" },
            body: {
                name: "Producto Editado",
                price: 250,
                stock: 15
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 200 y edita el producto sin imagen", async () => {
        const updatedProduct = {
            _id: "product123",
            name: "Producto Editado",
            price: 250,
            stock: 15
        };

        Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

        await editProduct(req, res);

        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
            "product123",
            req.body,
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Producto editado correctamente",
            product: updatedProduct
        });
    });

    test("Devuelve código 200 y edita el producto con nueva imagen", async () => {
        req.file = {
            mimetype: "image/png",
            buffer: Buffer.from("nueva-imagen")
        };

        const fakeCloudinaryResult = {
            secure_url: "https://cloudinary.com/nueva-imagen.jpg"
        };

        cloudinary.uploader.upload.mockResolvedValue(fakeCloudinaryResult);

        const updatedProduct = {
            _id: "product123",
            name: "Producto Editado",
            price: 250,
            stock: 15,
            image: fakeCloudinaryResult.secure_url
        };

        Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

        await editProduct(req, res);

        expect(cloudinary.uploader.upload).toHaveBeenCalled();
        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
            "product123",
            expect.objectContaining({
                name: "Producto Editado",
                price: 250,
                stock: 15,
                image: fakeCloudinaryResult.secure_url
            }),
            { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Producto editado correctamente",
            product: updatedProduct
        });
    });

    test("Devuelve 500 si ocurre un error", async () => {
        Product.findByIdAndUpdate.mockRejectedValue(new Error("Error al actualizar"));

        await editProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al editar producto",
            error: "Error al actualizar"
        });
    });
});

// ============================================================================
// TEST: ORDENAR PRODUCTO (REALIZAR PEDIDO)
// ============================================================================

describe("Test unitario de orderProduct", () => {

    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: "Juan",
                surname: "Pérez",
                email: "juan@example.com",
                phone: "123456789",
                productName: "Producto Test"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Devuelve código 200 y envía el email correctamente", async () => {
        mail_transporter.sendMail.mockResolvedValue({ messageId: "test-message-id" });

        await orderProduct(req, res);

        expect(mail_transporter.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                from: "juan@example.com",
                to: process.env.EMAIL_USER,
                subject: "Nuevo encargo: Producto Test"
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Pedido enviado correctamente'
        });
    });

    test("Devuelve 500 si ocurre un error al enviar el email", async () => {
        mail_transporter.sendMail.mockRejectedValue(new Error("Error al enviar email"));

        await orderProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Error al encargar producto',
            error: "Error al enviar email"
        });
    });
});