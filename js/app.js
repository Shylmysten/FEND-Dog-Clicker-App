$(document).ready(function(){
const dataModule = (function () {

    // sets up image names, locations and clickcounts in their named arrays
    // The location of each piece of data in the arrays are by association
    // location 0 is the first images info, location 1 is the second dog's info
    // and so on...
    const data = {
        allDogs: {
            names: ['Mr. MoneyMaker','Mr. Chill','Mr. Blue-Eyes','Father and Daughter','Daddy\'s Dog-Tired'],
            images: ['images/4784_1113603514041_5792182_n.jpg','images/1914414_1170498856389_3791320_n.jpg','images/1914414_1170498176372_1876897_n.jpg','images/1914414_1170498896390_5590963_n.jpg','images/1914414_1170498616383_2650714_n.jpg'],
            clickCounters: [0,0,0,0,0]
        }
    };

    // returns methods to the public scope
    return {
        // method places data into the public scope for testing purposes
        // THESE METHODS WILL NOT RUN AS dataModule.getDogs(); IN THE CONSOLE
        // WHILE WRAPPED IN THE $(document).ready(function () { above
        getDogs: function () {
            // returns an object of 3 arrays, Names, images, ClickCounters
            return {
                // returns the names array
                names: data.allDogs.names,
                // returns the images array
                images: data.allDogs.images,
                // returns the clickCounters array
                clickCounters: data.allDogs.clickCounters
            };
        },
        // passed the idx from the forEachloop in the eventlistener when a
        // user clicks the image currently being displayed
        updateClickCounter: function(idx) {
            // updates the clickCount for the image currently being displayed
            let clickCounted = ++data.allDogs.clickCounters[idx];
            // returns an integer to the updatedClickCounter function in the
            // app controller
            return clickCounted;
        }
    };

})(); // end of Data Module


// @@ UI Module controls getting and setting data in the DOM it, it does not
// have direct access to the data module which keeps data private
const UIModule = (function () {
    const DOMstrings = {
        imgContainer: '#img-container',
        dogPic: '#dog-picture',
        name: '#name',
        clickCounter: '#clickCount',
        listItems: '#list-of-names'
    };

    // Establishes a method to pass the DOMstrings between modules (PUBLIC)
    // so they can be used outside the UIModule IIFE

    return {

        // method gets the DOMstrings from the UI and returns them to the app
        // controller
        getDOMstrings: function() {
            return DOMstrings;
        },

        // Passed in an obj with a name, image, and clickCount from the app Controller to be displayed in the UI
        displayNewDog: function(obj) {
            // display this Dog's name in the UI
            document.querySelector(DOMstrings.name).innerHTML = obj.name;
            /// display this dog's image
            document.querySelector('#dog-picture').setAttribute('src', obj.image);
            // display this dog's click count
            clickCounter: document.querySelector(DOMstrings.clickCounter).innerHTML= parseInt(obj.counter);
        },
        // passed in a clickCount from the app controller after a user clicks on an image and updates the UI with the new count
        updateClickCounter: function (clickCount) {
            // display the current click count
            document.querySelector(DOMstrings.clickCounter).innerHTML= clickCount;
        }


    };

})();

//@@ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@ App Controller is passed in both the Data Module and UI Module to allow
//@@ access to the methods of each. It tells the UI module when to get and
//@@ update the DOM. It retrieves data from the data module to be passed back
//@@ to the UI that will be displayed, and passes the results of user actions
//@@ in the UI back to the data module to update those actions that are being
//@@ tracked/collected/stored The App controller passes data between the UI
//@@ module and the DataModule. It sends and recieves info from each
//@@ individually and acts as an intermediary between the two other modules.

const appController = (function (dataMdl, UIMdl) {
    // get the Dom strings from the UI Module
    const DOM = UIMdl.getDOMstrings();

    // retreives an Object of 3 arrays, [names,images,clickCounters] fro the
    // data Module
    const data = dataMdl.getDogs();

    // Function that is called in the init() function to setupEventListeners
    const setupEventListeners = function () {

        // listen for clicks on the list of names
        $(DOM.listItems).click(function (e) {
            // 1. prevent the default action
            e.preventDefault();
            // 2. loop through array & determine which image was clicked on
            data.names.forEach(function (cur, idx) {
                // prevents actions unless the current name in our array
                // matches the name in the list that was clicked on
                if (cur === e.target.innerText) {
                    // call displayNewDog function and pass it the idx of the
                    // cur element
                    displayNewDog(idx);
                }
            });


        });


        $(DOM.imgContainer).click(function(e) {
            // 1. prevent Default
            e.preventDefault();
            // 2. loop through array & determine which image was clicked on
            data.images.forEach(function (cur, idx) {

                // prevents actions unless the current image in our array
                // matches the src attribute of the clicked image
                if (cur === e.target.getAttribute('src')) {
                    // call updateClickCounter and pass it the idx of the
                    // current element
                    updateClickCounter(idx);
                }
            });
        });
    }

    // ***** begin Private functions *****//

    // diplayNewDog is passed the index of the current element in the
    // forEachLoop of the eventlistener attached to the images to determine
    // the IDENTITY of the "Dog" that was selected because the "Dog's" info
    // is positioned identically in each array
    const  displayNewDog = function(idx) {
        // @@ Class newDog defines newDog Obj
        // @@ Constructor is passed the index and uses it to create a newDog obj
        // return: obj with an images src, an image name, the  cur clickcount
        class newDog {
            constructor (idx) {
                this.image = data.images[idx];
                this.name = data.names[idx];
                this.counter = data.clickCounters[idx];
            };
        }


        // update the dog being displayed in the UI with the user's selection
        UIMdl.displayNewDog(new newDog(idx));

    }; // end  displayNewDog function

    const updateClickCounter = function (idx) {
        // update the clickCounter in the dataModule
        let clickCount = dataMdl.updateClickCounter(idx);
        // update the clickCounter in the UI
        UIMdl.updateClickCounter(clickCount);
    };

    // return public methods
    return {

       // sets up a METHOD to pass into PUBLIC to initialize the application
       init: function() {
         console.log('Application has started.');


         // calls all EventListeners to begin listening for events
         setupEventListeners();
        }
    }

})(dataModule, UIModule); // pass in the dataModule and the UIModule

// initialize the app on page load
appController.init();
});
