// DOM Selectors
let searchField = document.querySelector('#search-field');    // Input search field
let submitBtn = document.querySelector('#submit-btn');        // Submit button
let results = document.querySelector('.results');             // Results section
let favourites = document.querySelector('.favourite-items');  // Favourites section

//Initialize list of favourited items
let favourited = [];
let favouritedHTML = '<h2>Favourites</h2>';


window.onload = function() {
  //  
  searchField.addEventListener('keyup', (e) => {
    // Search for results when enter is hit
    if (e.keyCode === 13) {
      getResults();
    }

    // Clear list of results when search field is cleared
    if (searchField.value === '') {
      results.innerHTML = '';
      console.log('delete');
    }
  })

  // Search for results when submit button is clicked
  submitBtn.addEventListener('click', getResults);
  
  // Toggle favourite items
  document.body.addEventListener('click', (e) => {
    let classNames = e.target.parentElement.className;
    let classList = e.target.parentElement.classList;
    let row = e.target.parentElement.parentElement;
    let title = e.target.parentElement.nextSibling.nextSibling.textContent;
    
    // Add item to favourites
    if (classNames === 'star ' || classNames === 'star') {

      // Change color of star to green
      classList.add('favourite');

      // row.toString
      // console.log(typeof(row));
      console.log(row.outerHTML);
      console.log(typeof(row.outerHTML));
      console.log(row.toString());



      // Add HTML of item to list of favourites
      favouritedHTML += row.outerHTML;

      // Render list of favourite items
      favourites.innerHTML = favouritedHTML;

      

      // Add item to favourited array
      favourited.push(title);

        // console.log(favourited);
    }
    
    // Remove item from favourites
    if (classNames == 'star favourite') {

      // Change color of star to grey
      classList.remove('favourite');

      // Remove item from favourited array
      let index = favourited.indexOf(title);
      favourited.splice(index, 1);
      // console.log(favourited);
    }
  });
}

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
          <div class="row">
            <div class="star ${(favourited.indexOf(item.title) !== -1) ? 'favourite': ''}">
                <i class="fas fa-star"></i>
            </div>
            <div class="item">${item.title}</div>
            <div class="description">
                ${decodeHtml(item.body)}
            </div>
          </div>
          `;
        }; 
        results.innerHTML = output;
      });
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

// Update list of favourites
function updateFavourites(title, output) {

}




