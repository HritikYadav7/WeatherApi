const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

const apiKey = '00a572cf7e2d358aa1936e1ca924072f';

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({ error: 'Invalid input. Please provide an array of cities.' });
    }

    const weatherData = await getWeatherData(cities);

    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getWeatherData(cities) {
  const weatherData = {};

  for (const city of cities) {
    try {
      const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const temperature = response.data.main.temp;
      weatherData[city] = `${temperature}C`;
    } catch (error) {
      console.error(`Error fetching weather for ${city}:`, error.message);
      weatherData[city] = 'N/A';
    }
  }

  return weatherData;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
