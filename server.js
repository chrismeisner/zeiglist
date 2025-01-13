// File: /Users/chrismeisner/Projects/zeiglist/server.js

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

// --- Test the Airtable connection on server startup ---
base(AIRTABLE_TABLE_NAME)
  .select({ maxRecords: 1 })
  .firstPage((err, records) => {
    if (err) {
      console.error('[Server] Failed to connect to Airtable:', err);
    } else {
      console.log('[Server] Connected to Airtable successfully!');
    }
  });

/**
 * POST /api/save-to-airtable
 * Save data to Airtable, including eventDateTime
 */
app.post('/api/save-to-airtable', async (req, res) => {
  try {
    console.log('[Server] POST /api/save-to-airtable called.');
    const { title, tasks, createdAt, eventDateTime } = req.body;

    if (!title || !tasks || !createdAt) {
      return res.status(400).json({ message: 'Invalid data format.' });
    }

    const records = [
      {
        fields: {
          Title: title,
          Tasks: JSON.stringify(tasks),
          CreatedAt: new Date(createdAt).toISOString(),
          // NEW FIELD to store countdown data:
          EventDateTime: eventDateTime || '',
        },
      },
    ];

    base(AIRTABLE_TABLE_NAME).create(records, (err, records) => {
      if (err) {
        console.error('[Server] Error saving to Airtable:', err);
        return res
          .status(500)
          .json({ message: 'Failed to save data to Airtable.' });
      }

      console.log('[Server] Data successfully saved to Airtable:', records);
      return res
        .status(200)
        .json({ message: 'Data saved to Airtable successfully!' });
    });
  } catch (error) {
    console.error('[Server] Server Error:', error);
    return res.status(500).json({ message: 'Server encountered an error.' });
  }
});

/**
 * GET /api/saved-lists
 * List all saved records in Airtable
 */
app.get('/api/saved-lists', async (req, res) => {
  try {
    console.log('[Server] GET /api/saved-lists called.');

    base(AIRTABLE_TABLE_NAME)
      .select({ view: 'Grid view' })
      .all((err, records) => {
        if (err) {
          console.error('[Server] Error fetching Airtable data:', err);
          return res
            .status(500)
            .json({ message: 'Failed to fetch data from Airtable.' });
        }

        // Map records to desired structure
        const savedLists = records.map((record) => ({
          id: record.id,
          title: record.fields.Title,
          createdAt: record.fields.CreatedAt,
          link: `${req.protocol}://${req.get('host')}/api/saved-lists/${record.id}`,
        }));

        console.log('[Server] Saved lists fetched:', savedLists);
        return res.status(200).json(savedLists);
      });
  } catch (error) {
    console.error('[Server] Server Error:', error);
    return res.status(500).json({ message: 'Server encountered an error.' });
  }
});

/**
 * GET /api/saved-lists/:id
 * Fetch a single list by ID, including eventDateTime
 */
app.get('/api/saved-lists/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[Server] GET /api/saved-lists/${id} called.`);

  base(AIRTABLE_TABLE_NAME).find(id, (err, record) => {
    if (err) {
      console.error('[Server] Error fetching Airtable record:', err);
      return res.status(404).json({ message: 'List not found.' });
    }

    console.log('[Server] Fetched list:', record);
    const listData = {
      id: record.id,
      title: record.fields.Title,
      tasks: JSON.parse(record.fields.Tasks || '[]'),
      createdAt: record.fields.CreatedAt,
      // NEW FIELD: Load eventDateTime from Airtable
      eventDateTime: record.fields.EventDateTime || '',
    };

    return res.status(200).json(listData);
  });
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
