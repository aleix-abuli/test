// Hamburger Menu
function hambMenu() {
    let navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('nav-hidden');
}

// hambMenu() is called as an 'onclick' event (index.html, line 16)

// Splash page
const splash = document.querySelector('.splash');

document.addEventListener('DOMContentLoaded',(e) => {
    setTimeout(() => {
        splash.classList.add('display-none');
    }, 4200);
});


// Skewing Effect
const content = document.querySelector('.skewContainer');
let currentPosition = window.pageYOffset;
const maxSkew = 5;
const maxRotate = 5;

function skewEffect() {
    const newPosition = window.pageYOffset;
    const dif = newPosition - currentPosition;

    let skew = dif*.09;
    let rotate = dif*.1;

    if(skew > maxSkew || skew < -maxSkew) {
        if(skew > 0) skew = maxSkew;
        if(skew < 0) skew = -maxSkew;
    };

    if(rotate > maxRotate || rotate < -maxRotate) {
        if(rotate > 0) rotate = maxRotate;
        if(rotate < 0) rotate = -maxRotate;
    };

    content.style.transform = `skewY(${skew}deg) rotateY(${rotate}deg)`;

    currentPosition = newPosition;
    requestAnimationFrame(skewEffect);
};

skewEffect();

// --------- REVIEW SECTION ---------
const memoji1 = document.querySelector('.memoji1');
const memoji2 = document.querySelector('.memoji2');
const memoji3 = document.querySelector('.memoji3');
const memoji4 = document.querySelector('.memoji4');
const memojiArr = [memoji1, memoji2, memoji3, memoji4];
const opinionsArr = [
    'Circle helped us through every stage of our startup.\n We really enjoyed working with you.',
    'Everyone I spoke with provides excellent customer service,\n and took the time to answer all of our questions.',
    'The service is smooth and straightforward. My advisor was helpful.\n I would recommend deal direct.',
    'Customer service is obviously their strategy and it shows.\n I have referred others already.'
]
const testimonial = document.querySelector('.testim-text p');
const profile = document.querySelector('.testim-profile');
const profilePic = document.querySelector('.profile');
const profileName = document.querySelector('.name');

function addTestimonialListener(memoji, text) {
    if(memoji) memoji.addEventListener('click', () => {
        testimonial.innerText = `"${text}"`;
        profile.style.display = 'block';
        profilePic.setAttribute('src', memoji.src);
        profileName.innerText = memoji.alt;
    });
};

function setTestimonials() {
    memojiArr.forEach((memoji, index) => {
        addTestimonialListener(memoji, opinionsArr[index]);
    });
};

setTestimonials();

// Getting the ID of the project from URL. It helps us to do the fetch and also to check whether we are inside projects.html or index.html
let projNum = window.location.search.split('?')[1];

// --------- FETCHING PROJECTS DYNAMICALLY ---------
let fetchUrlProj = "https://jsonplaceholder.typicode.com";

let projectImg = document.querySelectorAll('.img-project'); // extra data added to db.json
let projectTitle = document.querySelectorAll('.project-title');
let projectDesc = document.querySelectorAll('.project-description');


function fetchProj() {

    let fetchUrl = projNum ? `${fetchUrlProj}/posts?_start=${projNum}&_limit=3` : `${fetchUrlProj}/posts?_start=0&_limit=3`;

    if(projectTitle.length > 0 && projectDesc.length > 0) {
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    projectTitle[i].innerText = data[i].title;
                    projectDesc[i].innerText = data[i].body;
                }
            })
            .catch(err => console.log(err));
    };
};

fetchProj();

// --------- MAKING PROJECT PAGE DYNAMIC ---------
let projWrap = document.querySelectorAll('.project-wrap');
let projWrapOther = document.querySelectorAll('.project-wrap-other');

function addEndpoint() {

    let fetchUrl;

    if(projNum) fetchUrl = `${fetchUrlProj}/posts?_start=${projNum}&_limit=3`;
    else fetchUrl = `${fetchUrlProj}/posts?_start=0&_limit=3`;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                if (projWrap.length > 0) {
                    projWrap[i].setAttribute('href', `projects.html?${data[i].id}`);
                }
                
                if (projWrapOther.length > 0) {
                    console.log(data[i]);
                    projWrapOther[i].setAttribute('href', `projects.html?${data[i].id}`);
                };
            };
        })
        .catch(err => console.log(err));
};

addEndpoint();

let articleTitle = document.querySelector('.article-title');
let articleAuthor = document.querySelector('.article-author');
let articleLoc = document.querySelector('.author-location');
let articleImg = document.querySelector('.article-img');
let projectText = document.querySelector('.project-text');

function dynamicProjectPage() {
    if (projNum) {
        fetch(`${fetchUrlProj}/posts/${projNum}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                articleTitle.innerText = data.title;
                projectText.innerHTML = data.body; // data[i].content
                fetch(`${fetchUrlProj}/users/${data.userId}`)
                .then(res => res.json())
                .then(data => {
                    articleAuthor.innerText = `by ${data.name}`;
                    articleLoc.innerText = data.address.city;
                })
            })
            .catch(err => console.log(err));
    };
};

dynamicProjectPage();

// --------- CONTACT FORM VALIDATION ---------
let form = document.querySelector('.form-contact-form');
let fetchUrlForm = "http://localhost:8000/messages";
let validation = true;

function saveData(event) {
    event.preventDefault(); // stop the form submitting

    let data = {
        fullname: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phone: document.querySelector('#phone').value,
        message: document.querySelector('#message').value
    }

    let divValidation = document.querySelector('.contact-validation');

    divValidation.innerHTML = ''; // reset previous validations

    if (!data.fullname) {
        divValidation.innerHTML += `<p class="validation wrong">Name field must not be empty</p>`;
        validation = false;
    }

    if (!data.email) {
        divValidation.innerHTML += `<p class="validation wrong">Email field must not be empty</p>`;
        validation = false;
    }

    if (data.phone.length < 9) {
        divValidation.innerHTML += `<p class="validation wrong">Phone number field must contain at least 9 characters</p>`;
        validation = false;
    }

    if (data.message.length < 30) {
        divValidation.innerHTML += `<p class="validation wrong">Message must contain at least 30 characters</p>`;
        validation = false;
    }

    if (!validation) return; // no guardar los datos

    // Saving Contact Form Data
    fetch(fetchUrlForm, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(results => results.json());

    divValidation.innerHTML += `<p class="validation right">Your contact details were sent succesfully</p>`;
    return;
}

form.addEventListener('submit', saveData);