const count = 10;
const KEY = 'BkxbaGupsJapuhYYLjc0OrXYeoyt1Xt_Sr7UKeaoVIc';
let query = '';

const imageContainer = document.getElementById('Image__Container');
const loader = document.getElementById('Loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let totalLoadedImages = 0;
const titleColumn = document.querySelector('.Title__Column');
const imageCounter = document.getElementById('image-counter');

const imageLoaded = async () => {
    console.log('Image loaded...');
    imagesLoaded++;
    totalLoadedImages++;
    imageCounter.textContent = totalLoadedImages;
    
    if (imagesLoaded === totalImages) {
        console.log('All images loaded...');
        imagesLoaded = 0;
        ready = true;
        loader.hidden = true;
    }
}

const setAttributes = (element, attributes) => {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

const displayPhotos = () => {
    totalImages = photosArray.length;
    console.log(`Displaying ${totalImages} photos...`);

    photosArray.forEach(photo => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });

        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        img.addEventListener('load', () => {
            imageLoaded();
        })

        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

const getApiUrl = () => {
    const baseUrl = 'https://api.unsplash.com/photos/';
    const searchUrl = 'https://api.unsplash.com/search/photos/';
    const params = `client_id=${KEY}&count=${count}`;
    
    return query 
        ? `${searchUrl}?query=${query}&${params}`
        : `${baseUrl}random/?${params}`;
};

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

const handleSearch = () => {
    query = searchInput.value;
    imageContainer.innerHTML = '';
    totalLoadedImages = 0;
    imageCounter.textContent = '0';
    loader.hidden = false;
    getPhotos();
};

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

const getPhotos = async () => {
    try {
        const response = await fetch(getApiUrl());
        const data = await response.json();
        
        photosArray = query ? data.results : data;
        
        displayPhotos();
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

window.addEventListener('scroll', () => {
    const { innerHeight, scrollY } = window;
    const { offsetHeight } = document.body;
    if (innerHeight + scrollY >= offsetHeight -1000 && ready) {
        ready = false;
        console.log('Fetching more photos...');
        getPhotos();
    }

    if (scrollY > 50) {
        titleColumn.classList.add('scrolled');
    } else {
        titleColumn.classList.remove('scrolled');
    }
})

getPhotos();