const express = require('express');
const Contenedor = require('./service/Contenedor');

let contenedor = new Contenedor('data/productos.txt');

const app = express();

const router = express.Router();


app.use(express.json())

// Get all products
router.get('/', async (req, res) => {
    let productos;
    try {
        productos = await contenedor.getAll();
        console.log(productos);
        return res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
            error
        });
    }
});

// Get product by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const numId = parseInt(id);
    try {
        const producto = await contenedor.getById(numId);
        console.log(producto);
        if (producto !== null) {
            return res.status(200).json(producto);
        } else {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
            error
        });
    }
});

// save product
router.post('/', async (req, res) => {
    const { title, price, thumbnail } = req.body;

    const validator = (title !== null && price !== null && thumbnail !== null)
        && (title !== '' && price !== '' && thumbnail !== '');
    if (validator) {
        try {
            await contenedor.save(title, price, thumbnail);//almaceno en el file el producto

            const allPruductos = await contenedor.getAll();
            const productAdded = allPruductos.length;//Para sacar el ultimo index
            const producto = await contenedor.getById(productAdded);//Obtengo el ultimo producto agregado

            return res.status(201).json(producto);//Muestra el ultimo producto agregado
        } catch (err) {
            return res.status(500).json({
                message: 'Error al guardar el producto',
                err
            });
        }
    } else {
        return res.status(400).json({ message: 'Campos invalidos o vacios' });
    }
});

// delete product by id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const numId = parseInt(id);
    try {
        const foundId = await contenedor.getById(numId);
        if (foundId !== null && foundId !== undefined) {
            await contenedor.deleteById(foundId.id);
            return res.status(200).json({
                message: 'Producto eliminado'
            });
        } else {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Error al eliminar el producto',
            error
        });
    }

});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { title, price, thumbnail } = req.body;

    const numId = parseInt(id);

    const validator = (title !== null && price !== null && thumbnail !== null)
            && (title !== '' && price !== '' && thumbnail !== '');

    try {
        const foundId = await contenedor.getById(numId);
        if (foundId !== null && foundId !== undefined) {
            const idFound = parseInt(foundId.id);      
            if (validator) {
                await contenedor.updateById(idFound, title, price, thumbnail);
                return res.status(200).json({
                    message: 'Producto actualizado'
                });
            }else{
                return res.status(400).json({ message: 'Campos invalidos o vacios' });
            }
        } else {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: 'Error al actualizar el producto',
            error
        });
    }

});

app.get('/api/productoRandom', async (req, res) => {
    let productos;
    try {
        productos = await contenedor.getAll();
        let totalProductos = productos.length;
        console.log("total productos -> ", totalProductos);
        let numeroRandom = Math.floor(Math.random() * totalProductos);
        console.log("numero random -> ", numeroRandom);
        console.log(productos);

        return res.status(200).json(productos[numeroRandom]);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
            error
        });
    }
});

app.use('/api/productos', router);

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})