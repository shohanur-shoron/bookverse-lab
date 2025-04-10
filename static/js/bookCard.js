const imageWrapper = document.querySelectorAll('.imageWrapper');
const info = document.querySelectorAll('.info');

for(let i=0; i<imageWrapper.length; i++){
    imageWrapper[i].addEventListener('mouseenter', function(e){
        info[i].style.opacity = 1;
    });
    imageWrapper[i].addEventListener('mouseleave', function(e){
        info[i].style.opacity = 0;
    });
}


// function for handle long book and auther name
function truncateBookName() {
    const bookNameElements = document.querySelectorAll('.bookname');
    const auther = document.querySelectorAll('.auther')

    bookNameElements.forEach(element => {
        const bookNameP = element.querySelector('.booknameText');

        let fullBookName = bookNameP.textContent;

        if (fullBookName.length > 19) {
            bookNameP.textContent = fullBookName.slice(0, 18) + '..';

            let fullBookNameP = document.createElement('p');
            fullBookNameP.className = 'fullbooknameText';
            element.appendChild(fullBookNameP);
            fullBookNameP.textContent = fullBookName;
        }
    });

    auther.forEach(element => {
        const autherNameP = element.querySelector('.autherName');

        let fullautherName = autherNameP.textContent;

        if (fullautherName.length > 22) {
            autherNameP.textContent = fullautherName.slice(0, 22) + '..';

            let fullautherNameP = document.createElement('p');
            fullautherNameP.className = 'fullautherName';
            element.appendChild(fullautherNameP);
            fullautherNameP.textContent = fullautherName;
        }
    });






        // add to favourite btn image change
    const favoriteDivs = document.querySelectorAll('.favourite');

    favoriteDivs.forEach(div => {

        div.onclick = () => {
        const img = div.querySelector('img');
        const p = div.querySelector('p');
        const span = div.querySelector('span').innerText;
        console.log(span);

            if (img.src.includes('icons8-favorite-50-white.png')) {
                fetch(`http://127.0.0.1:8000/books/add_to_favorites/${span}/`);
                img.src = img.getAttribute('data-green-src');
                p.textContent = 'Added to Favorite';

            }
            else {
                img.src = img.getAttribute('data-white-src');
                p.textContent = 'Add to Favorite';
                fetch(`http://127.0.0.1:8000/books/remove_from_favorites/${span}/`);
            }
        };
    });
}

// Call the function when the DOM is fully loaded to handle long book and auther name
document.addEventListener('DOMContentLoaded', truncateBookName);


