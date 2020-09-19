const express = require("express");
const basicRouter = express.Router();
const mongoose = require("mongoose");
require("../../models/Book");
const Book = mongoose.model("books");

const { auth } = require("../auth");

// Read all books
basicRouter.get("/", (req, res) => {
    Book.find().lean().then(books => {
        res.send({books: books});
    })
    .catch(() => console.log("Erro ao listar livros!"));
});

// Read specific book
basicRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    const HATEOAS = [
        {
            href: "http://localhost:3000/books/" + id,
            method: "DELETE",
            rel: "delete_book"
        },
        {
            href: "http://localhost:3000/books/" + id,
            method: "PUT",
            rel: "update_book"
        }
    ]
    Book.findOne({_id: req.params.id}).lean()
        .then(item => {
            const links = [item, HATEOAS];
            res.send(links);
        })
        .catch(err => {
            res.status(404);
            res.send("Este livro não existe!");
        });
});

// Create book
basicRouter.post("/", auth, (req, res) => {
    const { genre, title, year, author, description } = req.body;
    const errors = [];

    if(!genre || genre !== String(genre) || genre.length < 4) {
        errors.push({text: "Gênero inválido!"})
    }
    if(!title || title !== String(title) || title.length < 4) {
        errors.push({text: "Título inválido!"})
    }
    if(!year || year !== Number(year) || year.length !== 4) {
        errors.push({text: "Ano inválido!"})
    }
    if(!author || author !== String(author) || author.length < 4) {
        errors.push({text: "Autor inválido!"})
    }
    if(!description || description !== String(description) || description.length < 4) {
        errors.push({text: "Descrição inválida!"})
    }
    if(errors.length > 0) {
        res.status(400);
        res.send({errors: errors});
    }

    const newBook = {
        genre: genre,
        title: title,
        year: year,
        author: author,
        description: description
    }
    new Book(newBook).save()
        .then(() => res.send("Livro publicado com sucesso!"))
        .catch(err => console.log("Erro ao publicar o livro: " + err));
});

// Update Book
basicRouter.put("/:id", auth, (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(item => {
            item.genre = req.body.genre;
            item.title = req.body.title;
            item.author = req.body.author;
            item.description = req.body.description;
            item.year = req.body.year;

            item.save()
                .then(() => {
                    res.send("Livro editado com sucesso!");
                })
                .catch(err => {
                    res.send("Erro ao editar o livro: " + err);
                })
        }).catch(err => {
            res.send("Erro ao editar: " + err);
        });
});

// Delete book
basicRouter.delete("/:id", auth, (req, res) => {
    Book.findOne({_id: req.params.id})
        .then(() => {
            Book.remove({_id: req.params.id})
                .then(() => {
                    res.send("Livro deletado com sucesso!");
                })
                .catch(err => {
                    res.send("Falha ao deletar: " + err);
                });
        })
        .catch(() => {
            res.status(404);
            res.send("Este livro não existe!");
        })
});

module.exports = basicRouter;