const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const Post = require('./src/api/posts/post.model'); // Ajusta la ruta según sea necesario

dotenv.config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
const app = express();

// Conexión a la base de datos
mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas CRUD
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/posts', async (req, res) => {
    const { title, description, image } = req.body;
    try {
        const newPost = new Post({ title, description, image });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, image } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(id, { title, description, image }, { new: true });
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
