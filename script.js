const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader');
// state
const apiKey = 'ep46Rb9Ut6QUijuHMrS7AJrf-WejyDweRNj5d0_9gXU';
let photosArray = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
const howManyPicturesToLoad = 30;
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${howManyPicturesToLoad}`;

//Check if all images were loaded
const imageLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    loader.hidden = true;
    ready = true;
    imagesLoaded = 0;
  }
};

// helper function to make code dry=>setting the atributes
const attributeSetter = (element, object) => {
  for (let key in object) {
    element.setAttribute(key, object[key]);
  }
};

// create elements for links&photos and add to DOM
const displayPhotos = () => {
  totalImages = photosArray.length;
  // creating <a> to link to Unsplash
  for (let obj of photosArray) {
    const item = document.createElement('a');
    attributeSetter(item, { href: obj.links.html, target: '_blank' });
    const img = document.createElement('img');
    attributeSetter(img, {
      src: obj.urls.regular,
      alt: obj.alt_description,
      title: obj.alt_description,
    });
    // event listener,check when each img is finished loading
    img.addEventListener('load', imageLoaded);

    // Put img inside <a>,then put both inside imageContainer element
    item.append(img);
    imageContainer.append(item);
  }
};

// get photos from unsplash

const getPhotos = async () => {
  try {
    const response = await axios.get(apiUrl);
    photosArray = response.data;
    displayPhotos();
  } catch (error) {
    console.log(error);
  }
};

// check to see if scrolling near bottom of page,load more photos
// without ready we trigger this function a lot of times, not one each time

window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

getPhotos();
