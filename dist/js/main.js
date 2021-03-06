// DOM Selectors
let searchField = document.querySelector('#search-field');    // Input search field
let submitBtn = document.querySelector('#submit-btn');        // Submit button
let results = document.querySelector('.results');             // Results section
let favourites = document.querySelector('.favourite-items');  // Favourites section
let favList = document.querySelector('.list');                // List of favourite items


//Initialize list of favourited items
let favouritedArr = [];                        // Array to be populated with title of favourited items
let favouritedHTML = '';                       // HTML to be rendered in favourites section

// Add event listeners when content of page is done loading
window.onload = function() {

  // Handle search field events
  searchField.addEventListener('keyup', (e) => {

    // Search for results when enter is hit
    if (e.keyCode === 13) {
      getResults();
    }

    // Clear list of results when search field is cleared
    if (searchField.value === '') {
      results.innerHTML = '';
    }
  });

  // Search for results when submit button is clicked
  submitBtn.addEventListener('click', getResults);
  
  // Toggle favourite items
  document.body.addEventListener('click', (e) => {
    
    // DOM Selectors
    let classNames = e.target.parentElement.className;  // Element classes
    let classList = e.target.parentElement.classList;   // List of element classes
    let row = e.target.parentElement.parentElement;     // Item row

    // Check to see if star is clicked before adding/removing item from favourites list
    if (e.target.className === 'fas fa-star') {
      let title = e.target.parentElement.nextSibling.nextSibling.textContent;

      // Add item to favourites if it is not already favourited
      if (classNames === 'star ' || classNames === 'star') {
        addToFavourites(classList, row, title);
      }
      
      // Remove item from favourites if it is already favourited
      if (classNames == 'star favourite') {
        removeFromFavourites(row, title);
      }
    } 
  });
}


/******************** FUNCTIONS ********************/

// Search for and render results
function getResults() {

  // Get JSON from the Waste Wizard Lookup Data
  axios.get(`https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000`)
    .then((response) => {
      let items = response.data;    // JSON data
      let output = '';              // Initialize output to be rendered
      let searchString = '';        // String to search through

      // Loop through each item and check if it matches the input search value
      items.forEach((item, index) => {
      
        // Combine all JSON data into one string to simplify searching
        searchString = `${items[index].body} ${items[index].category} ${items[index].title} ${items[index].keywords}`;
        searchString = searchString.toLowerCase();
        
        // Render item if input value matches something in the combined search string 
        if (searchString.indexOf(searchField.value.toLowerCase()) !== -1) {
          output += `
          <div class="row" id="item-${index}">
            <div class="star ${(favouritedArr.indexOf(item.title) !== -1) ? 'favourite': ''}">
                <i class="fas fa-star"></i>
            </div>
            <div class="item">${item.title}</div>
            <div class="description">
                ${decodeHtml(item.body)}
            </div>
          </div>
          `;
        } 
        results.innerHTML = output;
      });

      // Display error message if no results are found
      if (output === '') {
          results.innerHTML = `
            <div class="no-results">
              <p>No results found</p>
            </div>
          `;
      }; 
    })
    .catch((err) => {
      console.log(err);
    })
}


// Convert character entities to regular text
function decodeHtml(html) {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

// Add item to favourites
function addToFavourites(classList, row, title) {
  // Change color of star to green
  classList.add('favourite');

  // Add HTML of item to list of favourites
  favouritedHTML += row.outerHTML;

  // Add item to favourited array
  favouritedArr.push(title);

  // Render hidden list of favourite items
  favList.innerHTML = favouritedHTML;

  // Make list of favourite items visible if there is more than one item in the list
  if (favouritedArr.length > 1) {
    favourites.style.visibility = 'visible';
  }
}

// Remove item from favourites
function removeFromFavourites(row, title){
  let itemID = row.id;                                                        // Item id
  let resultsRow = document.querySelector(`.results #${itemID}`);             // Item in results section
  let favouritesRow = document.querySelector(`.favourite-items #${itemID}`);  // Item in favourites section
  
  // Remove item from favourited array
  let index = favouritedArr.indexOf(title);
  favouritedArr.splice(index, 1);
  
  // Change color of star in results section back to grey if it's listed
  if (resultsRow) {
    resultsRow.firstChild.nextSibling.className = 'star';
  }
  
  // Remove item from rendered list of favourite items
  favouritesRow.remove();

  // Hide list of favourite items when there are less than 2 items
  if (favouritedArr.length < 2) {
    favourites.style.visibility = 'hidden';
  }

  // Update variable containing HTML of list of favourites
  favouritedHTML = favList.outerHTML;
}