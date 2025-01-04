// server.js

const express = require('express');
const path = require('path');
const Airtable = require('airtable');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(express.json()); // parse JSON bodies

// Serve the static files from the React build folder
app.use(express.static(path.join(__dirname, 'build')));

// Airtable Configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

// Initialize Airtable base
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

// --- NEW CODE: Test the Airtable connection on server startup ---
base(AIRTABLE_TABLE_NAME)
  .select({ maxRecords: 1 })
  .firstPage((err, records) => {
    if (err) {
      console.error('[Server] Failed to connect to Airtable:', err);
    } else {
      console.log('[Server] Connected to Airtable successfully!');
      // Optionally, you could log the record(s) or something else
      // console.log('[Server] Found record(s):', records);
    }
  });

// POST route: Save data to Airtable
app.post('/api/save-to-airtable', async (req, res) => {
  try {
    console.log('[Server] POST /api/save-to-airtable called.');
    console.log('[Server] Request body:', req.body);

    // Check environment variables (for debug)
    console.log('[Server] Checking Airtable env vars...');
    console.log('  AIRTABLE_API_KEY:', AIRTABLE_API_KEY ? 'Loaded' : 'Missing');
    console.log('  AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID || 'Missing');
    console.log('  AIRTABLE_TABLE_NAME:', AIRTABLE_TABLE_NAME || 'Missing');

    // Destructure fields from the request body
    const { title, tasks, createdAt } = req.body;
    if (!title || !tasks || !createdAt) {
      console.log('[Server] Invalid data format. Missing title, tasks, or createdAt.');
      return res.status(400).json({ message: 'Invalid data format.' });
    }

    // Prepare record for Airtable
    const records = [
      {
        fields: {
          Title: title,
          Tasks: JSON.stringify(tasks),
          CreatedAt: new Date(createdAt).toISOString(),
        },
      },
    ];

    // Insert record into Airtable
    base(AIRTABLE_TABLE_NAME).create(records, (err, records) => {
      if (err) {
        console.error('[Server] Error saving to Airtable:', err);
        return res.status(500).json({ message: 'Failed to save data to Airtable.' });
      }

      console.log('[Server] Data successfully saved to Airtable:', records);
      const successJSON = { message: 'Data saved to Airtable successfully!' };
      console.log('[Server] Returning JSON:', successJSON);

      return res.status(200).json(successJSON);
    });
  } catch (error) {
    console.error('[Server] Server Error:', error);
    return res.status(500).json({ message: 'Server encountered an error.' });
  }
});

// Fallback: serve index.html for any other GET route
app.get('*', (req, res) => {
  console.log('[Server] GET fallback triggered: returning index.html');
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
