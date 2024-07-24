require('dotenv').config(); // Cargar variables de entorno al inicio

const mongoose = require("mongoose");
const { connectDB } = require("../database/database"); // Ajusta la ruta según tu estructura
const Post = require("../../api/posts/post.model");

const initialPosts = [
    {
        title: "¡Nuevas publicaciones!",
        description: "Descripción..."
    }
];

async function managePosts() {
    try {
        // Conectar a la base de datos MongoDB usando la función de conexión
        await connectDB();

        // Encontrar todas las publicaciones en la base de datos
        const allPosts = await Post.find();
        
        if (allPosts.length) {
            console.log("Eliminando publicaciones...");
            // Eliminar la colección Post si hay publicaciones
            await Post.collection.drop();
        } else {
            console.log("No hay publicaciones en la base de datos... añadiendo publicaciones");
        }

        // Insertar las publicaciones iniciales en la base de datos
        await Post.insertMany(initialPosts);
        console.log("¡Publicaciones añadidas con éxito!");

    } catch (error) {
        console.error("Error encontrado:", error);
    } finally {
        // Desconectar de la base de datos
        mongoose.disconnect();
    }
}

// Ejecutar la función para gestionar publicaciones
managePosts();