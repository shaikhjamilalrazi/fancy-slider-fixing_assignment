const imagesArea = document.querySelector(".images");
const gallery = document.querySelector(".gallery");
const galleryHeader = document.querySelector(".gallery-header");
const searchBtn = document.getElementById("search-btn");
const sliderBtn = document.getElementById("create-slider");
const sliderContainer = document.getElementById("sliders");

const durationField = document.getElementById("duration");
const search = document.getElementById("search");
const dot = document.querySelector(".dots");

// selected image
let sliders = [];

// Api Key
const KEY = "15674931-a9d714b6e9d654524df198e00&q";

// show images
const showImages = (images) => {
  if (images.length !== 0) {
    imagesArea.style.display = "block";
    gallery.innerHTML = "";
    // show gallery title
    galleryHeader.style.display = "flex";
    images.forEach((image) => {
      let div = document.createElement("div");
      div.className = "col-lg-3 col-md-4 col-xs-6 img-item mb-2";
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div);
    });
  } else {
    imagesArea.style.display = "block";
    document.getElementById("selector").style.display = "none";
    gallery.innerHTML = '<span class="noData">😒 No data Found</span>';
  }

  toggleSpinner();
};

const getImages = (query) => {
  toggleSpinner();
  // added setTImeOut for showing spinner
  setTimeout(() => {
    fetch(
      `https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`
    )
      .then((response) => response.json())
      .then((data) => showImages(data.hits))
      .catch((err) => console.log(err));
  }, 1500);
};

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
    element.classList.remove("added");
  }
};
let timer;
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert("Select at least 2 image.");
    durationField.value = "";
    return;
  }
  search.value = "";

  const duration = durationField.value || 1000;

  if (duration < 500 || isNaN(duration)) {
    alert("Slider duration not valid");
    durationField.value = "";
    durationField.focus();
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = "";
  const prevNext = document.createElement("div");
  prevNext.className =
    "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext);
  document.querySelector(".main").style.display = "block";
  // hide image aria
  imagesArea.style.display = "none";

  dot.innerHTML = "";

  sliders.forEach((slide, i) => {
    let item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item);
    // created dynamic dots
    let itemSpan = document.createElement("span");
    itemSpan.className = "dot";
    dot.appendChild(itemSpan);
  });

  changeSlide(0);
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
};

// change slider index
const changeItem = (index) => {
  changeSlide((slideIndex += index));
};

// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll(".slider-item");
  const activeDot = document.querySelectorAll(".dot");
  if (index < 0) {
    slideIndex = items.length - 1;
    index = slideIndex;
  }

  if (index < 0) {
    slideIndex = activeDot.length - 1;
    index = slideIndex;
  }

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  if (index >= activeDot.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach((item) => {
    item.style.display = "none";
  });

  activeDot.forEach((item) => {
    item.classList = "dot";
  });

  items[index].style.display = "block";
  activeDot[index].classList.add("dot_active");
};

// hide shoe fields
const hideShowFields = () => {
  document.querySelector(".main").style.display = "none";
  clearInterval(timer);
  getImages(search.value);
  sliders.length = 0;
  durationField.value = "";
};

// getting data
searchBtn.addEventListener("click", function () {
  hideShowFields();
});

// creating slider
sliderBtn.addEventListener("click", function () {
  createSlider();
});

// pressing enter key
search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    hideShowFields();
  }
});

// Spinner
const toggleSpinner = () => {
  const spinner = document.querySelector("#loading-spinner");
  spinner.classList.toggle("d-flex");
};
