import './css/styles.css';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import { showLoader, hideLoader } from './js/loader';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loaderWrapper = document.querySelector('.loader-wrapper');

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async e => {
  e.preventDefault();

  query = form.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
    });
    return;
  }

  page = 1;
  clearGallery(gallery);
  loadMoreBtn.classList.add('hidden');
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
    } else {
      const markup = renderGallery(data.hits);
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();

      if (totalHits > perPage) {
        loadMoreBtn.classList.remove('hidden');
      }
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();

  try {
    const data = await fetchImages(query, page, perPage);
    const markup = renderGallery(data.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    smoothScroll();

    const totalLoaded = page * perPage;
    if (totalLoaded >= totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.message,
    });
  } finally {
    hideLoader();
  }
});

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
