const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 8008;
const TIMEOUT = 500;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const uniqueNumbers = new Set();

  const requests = urls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: TIMEOUT });
      if (response.status === 200 && response.data && Array.isArray(response.data.numbers)) {
        response.data.numbers.forEach((number) => uniqueNumbers.add(number));
      }
    } catch (error) {}
  });

  await Promise.all(requests);

  const sortedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);
  const responseObj = { numbers: sortedNumbers };
  res.json(responseObj);
});

app.post('http://20.244.56.144/train/register', function (req, res) {
  const option = {
    "companyName": "Train Central",
    "ownerName": "Ram",
    "ownerEmail": "ram@gmail.com",
    "rollNo": "1",
    "clientID": "b46128a0-fbde-2c16-a4b1-6ae6ad718e27",
    "clientSecret": "iXejXjTJPhMQsmGz"
  };

  axios.post('http://20.244.56.144/train/auth', option)
    .then((response) => {
      console.log(response.data.access_token);
      axios.get('http://20.244.56.144/train/trains', {
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      }).then((output) => {
        console.log(output);
        res.json(output.data); // Sending response-data from remote server back to the client
      }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "failed to fetch data " });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "failed to authenticate" });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});