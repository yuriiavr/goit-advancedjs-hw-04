import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50907676-d0d9b555ff9217a4c5273e1b0';

export async function fetchImages(query, page = 1, perPage = 15) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
