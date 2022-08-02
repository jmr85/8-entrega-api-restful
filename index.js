const express = require('express');
const Contenedor = require('./service/Contenedor');

let contenedor = new Contenedor('data/productos.txt');

const app = express();

app.use(express.json())

app.get('/api/productos', async (req, res) => {
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

app.get('/api/productos/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const numId = parseInt(id);
    try {
        const producto = await contenedor.getById(numId);
        console.log(producto);
        return res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({
            message: 'Error al obtener los productos',
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

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})