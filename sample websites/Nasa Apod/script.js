const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// nasa API
const count=10;
const apiKey = 'DEMO_KEY';  
const apiUrl =`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray =[] ;
let favourites = {} ;

function createDOMNodes(page) {
    const currentArray =  page === 'results' ? resultsArray : Object.values(favourites) ;
    console.log('Current array' , page , currentArray);  
    console.log(page);

    currentArray.forEach( (result)=> { 
        // Card container 
        const card = document.createElement('div');
        card.classList.add('card');
        //link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full Image';
        link.target = '_blank' ;
        // Image
        const image = document.createElement('img');
        image.src = result.url ;
        image.alt = 'Nasa Picture of the day' ;
        image.loading = 'lazy' ;
        image.classList.add('card-img-top');   
        //Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
         // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title ;
        //Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = 'Add to Favourites' ;
        saveText.setAttribute('onclick' , `saveFavorite('${result.url}')` );
         // Card Text 
         const cardText = document.createElement('p');
         cardText.textContent = result.explanation ; 
         //footer Container ;
         const footer = document.createElement('small');
         footer.classList.add('text-muted');
         //Date
         const date = document.createElement('strong');
         date.textContent = result.date ;
         //Copyright
         const copyrightResult = result.copyright === undefined ? ' '  : result.copyright ; 
         const copyright = document.createElement('span');
         copyright.textContent = `${copyrightResult}` ;
         // Append
         footer.append( date , copyright);
         cardBody.append(cardTitle ,  saveText , cardText ,footer) ;
         link.appendChild(image);
         card.append(link , cardBody);
        imagesContainer.appendChild(card) ;
    }) ;
}


function updateDOM(page) {
    //get Favourites from localstorage
    if(localStorage.getItem('nasaFavorites')){
        favourites  = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('favorites from local storage' ,favourites);
    }
   createDOMNodes(page);

}

//Get random 10 images
async function getNasaPictures(){
    try{
       const  response =  await fetch(apiUrl);
       resultsArray = await response.json();
        updateDOM('favorites');
       
    }
    catch(error){

    }
}

// add result to favorites
function saveFavorite(itemUrl){
resultsArray.forEach( (item) => {
 if( item.url.includes(itemUrl) && !favourites[itemUrl]){
     favourites[itemUrl] = item ;
     //show  save confirmation for 2 seconds
     saveConfirmed.hidden = false ;
     setTimeout(() => {
         saveConfirmed.hidden = true ;
     }, 2000);
     localStorage.setItem( 'nasaFavorites' , JSON.stringify(favourites))
 }

})

}


//onLoad
getNasaPictures();