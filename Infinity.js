const count = 10;
const KEY = 'BkxbaGupsJapuhYYLjc0OrXYeoyt1Xt_Sr7UKeaoVIc';
const apiURL = `https://api.unsplash.com/photos/random/?client_id=${KEY}&count=${count}`

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

const getPhotos = async () => {
    try {
        const response = await fetch(apiURL);
        photosArray = await response.json();
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