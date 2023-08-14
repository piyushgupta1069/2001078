const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

// Middleware to handle the /numbers endpoint
app.get('/numbers', async (req, res) => {
    const urls = Array.isArray(req.query.url) ? req.query.url : [req.query.url];
  
//   if (!urls || !Array.isArray(urls)) {
//     return res.status(400).json({ error: 'Invalid URL(s)' });
//   }
  
  const uniqueNumbers = await getUniqueNumbersFromUrls(urls);
  
  res.json({ numbers: uniqueNumbers });
});

// Function to retrieve and merge unique numbers from URLs
async function getUniqueNumbersFromUrls(urls) {
  const fetchPromises = urls.map(async (url) => {
    try {
        console.log(url.trim().length);
      const response = await axios.get(url, { timeout: 500 });
      
      return response.data.numbers;
    } catch (error) {
      return [];
    }
  });
  
  const responses = await Promise.allSettled(fetchPromises);
  
  const allNumbers = responses.reduce((acc, response) => {
    if (response.status === 'fulfilled') {
      acc.push(...response.value);
    }
    return acc;
  }, []);
  
  const uniqueNumbers = [...new Set(allNumbers)];
  
  return uniqueNumbers.sort((a, b) => a - b);
}

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
