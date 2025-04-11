// --- START OF js/cardDetails.js ---

// Function to get CSRF token from cookies (Essential for Django POST requests)
function getCsrfToken() {
    let csrfToken = null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.startsWith('csrftoken=')) {
            csrfToken = decodeURIComponent(cookie.substring('csrftoken='.length));
            break;
        }
    }
    return csrfToken;
}

// Function to generate star rating string (used for *displaying* existing comments)
function generateStars(rating) {
    let stars = '';
    const ratingNum = parseInt(rating, 10); // Ensure it's a number
    for (let i = 1; i <= 5; i++) {
        stars += i <= ratingNum ? '⭐' : '☆'; // Filled star if i <= rating, otherwise outline
    }
    return stars;
}

// Function to handle description truncation and 'Read More'
function truncateDescription() {
    const descriptionElement = document.getElementById('bookDescriptiontxt');
    if (!descriptionElement) return;

    const descriptionTxt = descriptionElement.textContent;
    const maxLength = 700; // Adjust as needed

    if (descriptionTxt.length > maxLength) {
        descriptionElement.textContent = descriptionTxt.slice(0, maxLength);
        const readMoreSpan = document.createElement("span");
        readMoreSpan.textContent = " ... Read More";
        readMoreSpan.id = "readMoreSpan";
        readMoreSpan.style.color = "#27ae60"; // Use green theme
        readMoreSpan.style.fontWeight = "500";
        readMoreSpan.style.cursor = "pointer";
        descriptionElement.appendChild(readMoreSpan);

        readMoreSpan.addEventListener("click", () => {
            const readmorePanel = document.getElementById('readmorePanel');
            if (readmorePanel) {
                readmorePanel.style.display = 'flex';
            }
        });
    }

    // Setup close handlers for popups
    const closereadmorePanel = document.getElementById('closereadmorePanel');
    if (closereadmorePanel) {
        closereadmorePanel.addEventListener("click", function () {
            const readmorePanel = document.getElementById('readmorePanel');
            if (readmorePanel) readmorePanel.style.display = 'none';
        });
    }

    const closeShowMoreInfo = document.getElementById('closeShowMoreInfo');
     if (closeShowMoreInfo) {
        closeShowMoreInfo.addEventListener("click", function () {
            const showMoreInfo = document.getElementById('showMoreInfo');
             if (showMoreInfo) showMoreInfo.style.display = 'none';
        });
    }

    const moreDetails = document.getElementById('moreDetails');
    if (moreDetails) {
        moreDetails.addEventListener("click", function () {
            const showMoreInfo = document.getElementById('showMoreInfo');
            if (showMoreInfo) showMoreInfo.style.display = 'flex';
        });
    }
}

// Function to handle interactive star rating input
function handleStarRating() {
    const starContainer = document.getElementById('starRatingContainer');
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll('.star');
    const ratingInput = document.getElementById('commentRatingValue');
    const ratingError = document.getElementById('ratingError'); // Optional error display

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const ratingValue = this.getAttribute('data-value');
            ratingInput.value = ratingValue; // Update hidden input
            if(ratingError) ratingError.style.display = 'none'; // Hide error on selection

            stars.forEach(s => {
                s.classList.toggle('selected', parseInt(s.getAttribute('data-value')) <= parseInt(ratingValue));
            });
        });

        star.addEventListener('mouseover', function() {
            const hoverValue = this.getAttribute('data-value');
            stars.forEach(s => {
                 s.style.color = parseInt(s.getAttribute('data-value')) <= parseInt(hoverValue) ? '#2ecc71' : '#ccc';
            });
        });

        star.addEventListener('mouseout', function() {
            const currentRating = ratingInput.value;
            stars.forEach(s => {
                s.style.color = ''; // Remove inline style, rely on .selected class
                s.classList.toggle('selected', parseInt(s.getAttribute('data-value')) <= parseInt(currentRating));
            });
        });
    });
}

// Function to handle comment form submission
function handleCommentSubmission() {
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    const bookIdInput = document.getElementById('bookId');
    const ratingValueInput = document.getElementById('commentRatingValue');
    const userProfileImage = document.getElementById('userProfileImage');
    const ratingError = document.getElementById('ratingError'); // Optional error display

    if (!commentForm || !commentsList || !bookIdInput || !ratingValueInput) {
        console.warn("Comment form, list, book ID, or rating input not found.");
        return;
    }

    const userProfileSrc = userProfileImage ? userProfileImage.src : 'images/default-avatar.png'; // Provide a fallback

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const commentText = document.getElementById('commentText').value.trim();
        const commentRating = ratingValueInput.value;
        const bookId = bookIdInput.value;

        // Validation
        if (!commentText || commentRating === "0") {
            if (commentRating === "0" && ratingError) {
                ratingError.style.display = 'block'; // Show rating error
            } else {
                 alert('Please provide a comment.');
            }
            if (!commentText){
                 alert('Please provide a comment.');
            }
            return;
        }

        const ratingValue = parseInt(commentRating, 10);

        // --- 1. Local Update ---
        const newCommentElement = document.createElement('div');
        newCommentElement.classList.add('comment');
        // (Avatar creation...)
        const commentAvatar = document.createElement('div');
        commentAvatar.classList.add('commentAvatar');
        const avatarImg = document.createElement('img');
        avatarImg.src = userProfileSrc;
        avatarImg.alt = "User Avatar";
        commentAvatar.appendChild(avatarImg);
        // (Content creation...)
        const commentContent = document.createElement('div');
        commentContent.classList.add('commentContent');
        const commentHeader = document.createElement('div');
        commentHeader.classList.add('commentHeader');
        const authorStrong = document.createElement('strong');
        authorStrong.classList.add('commentAuthor');
        authorStrong.textContent = 'You'; // Replace if user info available
        const ratingSpan = document.createElement('span');
        ratingSpan.classList.add('commentRating');
        ratingSpan.innerHTML = generateStars(ratingValue);
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('commentDate');
        dateSpan.textContent = `- Just now`;
        commentHeader.appendChild(authorStrong);
        commentHeader.appendChild(ratingSpan);
        commentHeader.appendChild(dateSpan);
        const commentBodyP = document.createElement('p');
        commentBodyP.classList.add('commentBody');
        commentBodyP.textContent = commentText;
        commentContent.appendChild(commentHeader);
        commentContent.appendChild(commentBodyP);
        // (Append to comment element)
        newCommentElement.appendChild(commentAvatar);
        newCommentElement.appendChild(commentContent);
        // (Add to list)
        commentsList.insertBefore(newCommentElement, commentsList.firstChild);

        // --- 2. Send to Backend ---
        const commentData = { book_id: bookId, comment_text: commentText, rating: ratingValue };
        const csrfToken = getCsrfToken();
        const backendUrl = '/add_comment/'; // *** YOUR BACKEND URL HERE ***

        fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify(commentData)
        })
        .then(response => {
            if (!response.ok) return response.json().then(err => { throw new Error(err.message || 'Failed to post comment'); });
            return response.json();
        })
        .then(data => {
            console.log('Comment Success:', data);
            if (data.status === 'success') {
                commentForm.reset(); // Clear form
                ratingValueInput.value = "0"; // Reset hidden rating
                document.querySelectorAll('#starRatingContainer .star').forEach(s => s.classList.remove('selected')); // Reset stars
                if(ratingError) ratingError.style.display = 'none'; // Hide error
            } else {
                throw new Error(data.message || 'Backend reported an issue.');
            }
        })
        .catch(error => {
            console.error('Error posting comment:', error);
            alert(`Error: ${error.message}`);
            // Optional: Remove local comment on failure
            // commentsList.removeChild(newCommentElement);
        });
    });
}

// --- NEW: Function to handle Like Button Click ---
function handleLikeButton() {
    const likeBtn = document.querySelector('.likeBtn');
    const likeCountElement = document.getElementById('likeCount');
    const bookIdInput = document.getElementById('bookId');

    if (!likeBtn || !likeCountElement || !bookIdInput) {
        console.warn("Like button, count element, or book ID input not found.");
        return;
    }

    likeBtn.addEventListener('click', function() {
        const currentCount = parseInt(likeCountElement.textContent, 10);
        if (isNaN(currentCount)) return; // Safety check

        const bookId = bookIdInput.value;
        const originalCount = currentCount; // Store original count for potential revert

        // 1. Optimistic UI Update
        likeCountElement.textContent = originalCount + 1;
        // Optional: Add visual feedback like a temporary animation or color change
        likeBtn.classList.add('liked-animation'); // Add a class for CSS animation
        setTimeout(() => likeBtn.classList.remove('liked-animation'), 300); // Remove after animation

        // 2. Send request to backend
        const likeData = { book_id: bookId };
        const csrfToken = getCsrfToken();
        const backendUrl = '/like_book/'; // *** YOUR BACKEND URL HERE ***

        fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify(likeData)
        })
        .then(response => {
            if (!response.ok) {
                 // Revert UI on failure
                 likeCountElement.textContent = originalCount;
                 return response.json().then(err => { throw new Error(err.message || 'Failed to like book'); });
            }
            return response.json(); // Expecting { status: 'success', new_count: 459 } or similar
        })
        .then(data => {
            console.log('Like Success:', data);
            if (data.status === 'success' && data.new_count !== undefined) {
                // Optional: Update count from backend response for accuracy
                likeCountElement.textContent = data.new_count;
            } else if (data.status !== 'success') {
                 // Revert UI if backend reports specific issue
                 likeCountElement.textContent = originalCount;
                 throw new Error(data.message || 'Backend reported like issue.');
            }
            // If status is success but no new_count, the optimistic update stands
        })
        .catch(error => {
            console.error('Error liking book:', error);
            alert(`Error liking book: ${error.message}`);
            // Revert UI on fetch error
            likeCountElement.textContent = originalCount;
        });
    });
}

// --- NEW: Function to handle Add to Favourite Button Click ---
function handleFavouriteButton() {
    const favoBtn = document.querySelector('.addToFavoBtn');
    const bookIdInput = document.getElementById('bookId');

    if (!favoBtn || !bookIdInput) {
        console.warn("Favourite button or book ID input not found.");
        return;
    }

    // --- Get references to inner elements for UI update ---
    const favoIcon = favoBtn.querySelector('i'); // Assumes one 'i' tag
    const favoText = favoBtn.querySelector('p'); // Assumes one 'p' tag

    // --- Store original state (could also be fetched initially if needed) ---
    const originalText = favoText ? favoText.textContent : "Favourite";
    const originalBgColor = favoBtn.style.backgroundColor; // Get initial style if set inline, otherwise rely on CSS
    const originalIconClass = favoIcon ? favoIcon.className : 'bx bxs-heart'; // Default icon

    favoBtn.addEventListener('click', function() {
        const bookId = bookIdInput.value;

        // --- Add temporary loading state (optional) ---
        favoBtn.style.opacity = '0.7';
        favoBtn.style.pointerEvents = 'none';

        // --- Send request to backend ---
        const favoData = { book_id: bookId };
        const csrfToken = getCsrfToken();
        const backendUrl = '/toggle_favourite/'; // *** YOUR BACKEND URL HERE ***

        fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify(favoData)
        })
        .then(response => {
            // Remove loading state regardless of outcome
            favoBtn.style.opacity = '1';
            favoBtn.style.pointerEvents = 'auto';

            if (!response.ok) {
                 return response.json().then(err => { throw new Error(err.message || 'Failed to update favourite status'); });
            }
            return response.json(); // Expecting { status: 'success', is_favourite: true/false }
        })
        .then(data => {
            console.log('Favourite Toggle Success:', data);
            if (data.status === 'success' && typeof data.is_favourite === 'boolean') {
                // --- Update UI based on the NEW state returned by backend ---
                updateFavouriteButtonUI(favoBtn, favoText, favoIcon, data.is_favourite);
            } else {
                throw new Error(data.message || 'Backend reported favourite toggle issue.');
            }
        })
        .catch(error => {
            console.error('Error toggling favourite:', error);
            alert(`Error updating favourite: ${error.message}`);
             // Optional: Revert to original state on error? Depends on desired UX.
             // updateFavouriteButtonUI(favoBtn, favoText, favoIcon, /* need original state here */);
        });
    });
}

// --- NEW: Helper function to update Favourite Button UI ---
function updateFavouriteButtonUI(buttonElement, textElement, iconElement, isFavourite) {
     // Define states
    const favouritedText = "Favourited";
    const favouritedBgColor = "#e74c3c"; // Example: Red for favourited
    const favouritedIconClass = "bx bxs-heart-circle"; // Example: Different filled icon

    const defaultText = "Favourite";
    const defaultBgColor = ""; // Let CSS handle default color (.addToFavoBtn style)
    const defaultIconClass = "bx bxs-heart"; // Original filled icon

    if (isFavourite) {
        if (textElement) textElement.textContent = favouritedText;
        buttonElement.style.backgroundColor = favouritedBgColor;
        if (iconElement) iconElement.className = favouritedIconClass; // Change icon
        buttonElement.classList.add('is-favourited'); // Add class for CSS styling
    } else {
        if (textElement) textElement.textContent = defaultText;
        buttonElement.style.backgroundColor = defaultBgColor; // Reset to default (CSS takes over)
         if (iconElement) iconElement.className = defaultIconClass; // Change icon back
        buttonElement.classList.remove('is-favourited'); // Remove class
    }
}


// --- Initialize all functions when DOM is ready ---
document.addEventListener('DOMContentLoaded', () => {
    truncateDescription();
    handleStarRating();
    handleCommentSubmission();
    handleLikeButton(); // Initialize Like button listener
    handleFavouriteButton(); // Initialize Favourite button listener
});
