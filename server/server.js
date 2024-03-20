import express from "express";
import multer from "multer";
import cors from "cors";

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({ dest: "uploads/" });

// Route for handling file uploads
app.post("/upload", upload.array("files"), (req, res) => {
  console.log(req.body); // This will log the selected days and the destruct checkbox state
  console.log(req.files); // This will log the uploaded files

  // Assuming the files are stored in a public directory accessible via a URL
  // For example, if the files are stored in 'uploads/' directory, the URL might be 'http://localhost:3000/uploads/filename'
  // You might need to adjust this based on your actual file storage and server setup
  const fileLinks = req.files.map(
    (file) => `http://localhost:3000/uploads/${file.filename}`,
  );

  // Send the links in the response
  res.json({ message: "Files uploaded successfully!", links: fileLinks });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
