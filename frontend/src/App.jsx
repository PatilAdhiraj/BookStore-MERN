
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
const API_URL = `${import.meta.env.VITE_API_URL}/books`;

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    year: "",
    price: "",
    publisher: "",
    author: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Unable to load books. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.isbn ||
      !formData.title ||
      !formData.year ||
      !formData.price ||
      !formData.publisher ||
      !formData.author
    ) {
      alert("Please fill in all fields.");
      return false;
    }

    if (Number(formData.price) < 0) {
      alert("Price cannot be negative.");
      return false;
    }

    if (Number(formData.year) < 0) {
      alert("Year cannot be negative.");
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setFormData({
      isbn: "",
      title: "",
      year: "",
      price: "",
      publisher: "",
      author: "",
    });

    setEditingId(null);
  };

  const addBook = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError("");

      const response = await axios.post(API_URL, {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
      });

      setBooks([...books, response.data]);

      clearForm();
    } catch (error) {
      console.error("Error adding book:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to add book.");
      }
    }
  };

  const startEdit = (book) => {
    setEditingId(book._id);

    setFormData({
      isbn: book.isbn,
      title: book.title,
      year: book.year,
      price: book.price,
      publisher: book.publisher,
      author: book.author,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const updateBook = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setError("");

      const response = await axios.put(`${API_URL}/${editingId}`, {
        ...formData,
        year: Number(formData.year),
        price: Number(formData.price),
      });

      setBooks(
        books.map((book) =>
          book._id === editingId ? response.data : book
        )
      );

      clearForm();
    } catch (error) {
      console.error("Error updating book:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to update book.");
      }
    }
  };

  const deleteBook = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      setBooks(books.filter((book) => book._id !== id));

      if (viewingBook?._id === id) {
        setViewingBook(null);
      }
    } catch (error) {
      console.error("Error deleting book:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete book.");
      }
    }
  };

  const viewDetails = (book) => {
    setViewingBook(book);
  };

  return (
    <div className="container">
      <h1>Book Store</h1>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={fetchBooks}>Try Again</button>
        </div>
      )}

      <section className="form-section">
        <h2>{editingId ? "Edit Book" : "Add Book"}</h2>

        <form onSubmit={editingId ? updateBook : addBook}>
          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
          />

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="text"
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
          />

          <input
            type="text"
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
          />

          <div>
            <button type="submit">
              {editingId ? "Update Book" : "Add Book"}
            </button>

            {editingId && (
              <button type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2>Books</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <div className="books">
            {books.map((book) => (
              <div className="book-card" key={book._id}>
                <h2>{book.title}</h2>

                <p>
                  <strong>Author:</strong> {book.author}
                </p>

                <p>
                  <strong>Price:</strong> ₹{book.price}
                </p>

                <button onClick={() => viewDetails(book)}>
                  View Details
                </button>

                <button onClick={() => startEdit(book)}>
                  Edit
                </button>

                <button onClick={() => deleteBook(book._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {viewingBook && (
        <div className="details">
          <h2>Book Details</h2>

          <p>
            <strong>ISBN:</strong> {viewingBook.isbn}
          </p>

          <p>
            <strong>Title:</strong> {viewingBook.title}
          </p>

          <p>
            <strong>Author:</strong> {viewingBook.author}
          </p>

          <p>
            <strong>Year:</strong> {viewingBook.year}
          </p>

          <p>
            <strong>Price:</strong> ₹{viewingBook.price}
          </p>

          <p>
            <strong>Publisher:</strong> {viewingBook.publisher}
          </p>

          <button onClick={() => setViewingBook(null)}>
            Close Details
          </button>
        </div>
      )}
    </div>
  );
}

export default App;