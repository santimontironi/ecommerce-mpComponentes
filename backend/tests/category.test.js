import { allCategories, categoriesWithoutParents, addCategory, deleteCategory, getSubCategories } from "../controllers/category-controller.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

jest.mock("../models/Category.js");
jest.mock("../config/cloudinary.js");

// ============================================================================
// TEST: OBTENER TODAS LAS CATEGORÍAS
// ============================================================================

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

// ============================================================================
// TEST: OBTENER CATEGORÍAS SIN PADRES
// ============================================================================

describe("Test unitario para obtener categorías sin padres", () => {
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

    test("Debería obtener categorías sin padres activas", async () => {
        const fakeCategories = [
            { _id: "1", name: "Categoría 1", categoryParent: null, active: true },
            { _id: "2", name: "Categoría 2", categoryParent: null, active: true }
        ]

        Category.find.mockResolvedValue(fakeCategories);

        await categoriesWithoutParents(req, res);

        expect(Category.find).toHaveBeenCalledWith({ active: true, categoryParent: null });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Categorias obtenidas correctamente",
            categories: fakeCategories
        });
    })

    test("Debería manejar errores al obtener categorías sin padres", async () => {
        Category.find.mockRejectedValue(new Error("Error de base de datos"));

        await categoriesWithoutParents(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al obtener categorias",
            error: "Error de base de datos"
        });
    })
})

// ============================================================================
// TEST: AGREGAR UNA NUEVA CATEGORÍA
// ============================================================================

describe("Test unitario para agregar una nueva categoría", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                name: "Nueva Categoría",
                categoryParent: null
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
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Debería agregar una nueva categoría correctamente", async () => {
        const fakeCloudinaryResult = {
            secure_url: "https://cloudinary.com/fake-category-image.jpg"
        };

        const mockSave = jest.fn().mockResolvedValue(true);
        const fakeCategory = {
            _id: "1",
            name: "Nueva Categoría",
            image: fakeCloudinaryResult.secure_url,
            active: true,
            categoryParent: null,
            save: mockSave
        };

        Category.findOne.mockResolvedValue(null); // No existe la categoría
        cloudinary.uploader.upload.mockResolvedValue(fakeCloudinaryResult);
        Category.mockImplementation(function() {
            return fakeCategory;
        });

        await addCategory(req, res);

        expect(Category.findOne).toHaveBeenCalledWith({ name: "Nueva Categoría", active: true });
        expect(cloudinary.uploader.upload).toHaveBeenCalledWith(
            `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`
        );
        expect(mockSave).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Categoria agregada correctamente",
            category: fakeCategory
        });
    })

    test("Debería devolver error 400 si la categoría ya existe", async () => {
        const existingCategory = {
            _id: "1",
            name: "Nueva Categoría",
            active: true
        };

        Category.findOne.mockResolvedValue(existingCategory);

        await addCategory(req, res);

        expect(Category.findOne).toHaveBeenCalledWith({ name: "Nueva Categoría", active: true });
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "La categoria ya existe"
        });
        expect(cloudinary.uploader.upload).not.toHaveBeenCalled(); // No debería llegar aquí
    })

    test("Debería manejar errores al agregar una nueva categoría", async () => {
        const error = new Error("Error al subir imagen");
        
        Category.findOne.mockResolvedValue(null); // Permitir que pase la validación
        cloudinary.uploader.upload.mockRejectedValue(error);

        await addCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al agregar categoria",
            error: "Error al subir imagen"
        });
    })
})

// ============================================================================
// TEST: ELIMINAR UNA CATEGORÍA
// ============================================================================

describe("Test unitario para eliminar una categoría", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            params: {
                id: "1"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Debería eliminar una categoría correctamente", async () => {
       const fakeCategory = {
            _id: "1",
            name: "Categoría a eliminar",
            active: true
        };

        Category.findByIdAndUpdate.mockResolvedValue(fakeCategory);
        Category.updateMany.mockResolvedValue({ modifiedCount: 2 }); // Simula que se actualizaron 2 subcategorías

        await deleteCategory(req, res);

        expect(Category.findByIdAndUpdate).toHaveBeenCalledWith("1", { active: false });
        expect(Category.updateMany).toHaveBeenCalledWith({ categoryParent: "1" }, { active: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Categoria eliminada correctamente",
            category: fakeCategory
        });
    })

    test("Debería manejar errores al eliminar una categoría", async () => {
        const error = new Error("Error de base de datos");
        Category.findByIdAndUpdate.mockRejectedValue(error);

        await deleteCategory(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al eliminar categoria",
            error: "Error de base de datos"
        });
    })
})

// ============================================================================
// TEST: OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA PADRE
// ============================================================================

describe("Test unitario para obtener subcategorías de una categoría padre", () => {
    let req;
    let res;    

    beforeEach(() => {
        req = {
            params: {
                id: "1"
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Debería obtener subcategorías de una categoría padre correctamente", async () => {
        const fakeSubcategories = [
            { _id: "2", name: "Subcategoría 1", categoryParent: "1", active: true },
            { _id: "3", name: "Subcategoría 2", categoryParent: "1", active: true }
        ];

        Category.find.mockResolvedValue(fakeSubcategories);

        await getSubCategories(req, res);

        expect(Category.find).toHaveBeenCalledWith({ categoryParent: "1", active: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Categorias obtenidas correctamente",
            categories: fakeSubcategories
        });
    })

    test("Debería manejar errores al obtener subcategorías", async () => {
        const error = new Error("Error de base de datos");
        Category.find.mockRejectedValue(error);

        await getSubCategories(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Error al obtener categorias",
            error: "Error de base de datos"
        });
    })

})



