const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    return users.some(user => user.username === username);
}

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    
    // Return error if username or password is missing
    if (!username || !password) {
        return res.status(400).json({message: "Both username and password required."});
    };
        
    // Check if username already exists
    if (doesExist(username)) {
        return res.status(409).json({message: "Username already exists!"});
    }

    users.push({username, password});
    return res.status(201).json({
        message: "User successfully registered.", user: { username }});    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];
    for (const key in books) {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    }
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for this author."});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];
    for (const key in books) {
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        }
    }
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for this title."});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn].reviews;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

       if (Object.keys(reviews).length > 0) {
        res.json(reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book." });
    }
});

module.exports.general = public_users;
