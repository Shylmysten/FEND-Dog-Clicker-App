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
        },
        // passed an obj from the appcontroller when the admin save button is clicked and adds the user info to the name, images and clickcount array
        updateDogs: function (obj) {
            // if the image already exists when save is clicked, then we aren't interested
            if (data.allDogs.names.includes(obj.name)| data.allDogs.images.includes(obj.image)) {
                return;
            }
            data.allDogs.names.push(obj.name);
            data.allDogs.images.push(obj.image);
            data.allDogs.clickCounters.push(parseInt(obj.clickCount));
        }

    };

})(); // end of Data Module


// @@ UI Module controls getting and setting data in the DOM it, it does not
// have direct access to the data module which keeps data private
const UIModule = (function () {

    // store the dom selectors to be passed to the appController
    const DOMstrings = {
        imgContainer: '#img-container',
        dogPic: '#dog-picture',
        formContainer: '.form-container',
        name: '#name',
        clickCounter: '#clickCount',
        listItems: '#list-of-names',
        adminCtrlPnl: '#admin-control-panel',
        adminBtn: '#admin-btn',
        adminSave: '#admin-save',
        adminCancel: '#admin-cancel',
        inputName: '#inputName',
        inputUrl: '#inputUrl',
        inputClicks: '#inputClicks'
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
            document.querySelector(DOMstrings.dogPic).setAttribute('src', obj.image);
            // display this dog's click count
            clickCounter: document.querySelector(DOMstrings.clickCounter).innerHTML= parseInt(obj.counter);
        },
        // passed in a clickCount from the app controller after a user clicks on an image and updates the UI with the new count
        updateClickCounter: function (clickCount) {
            // display the current click count
            document.querySelector(DOMstrings.clickCounter).innerHTML= clickCount;
        },
        // passed in an obj with a name, image and clickcount from the app controller to be displayed in the UI
        makeList: function (obj) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<li>${obj.name}</li>`;
            $(DOMstrings.listItems)[0].appendChild(listItem);
        },
        // gets the object currently being displayed and updates the admin fields with the new object
        getCurObj: function () {
            $(DOMstrings.inputName)[0].value = $(DOMstrings.name)[0].innerHTML
            $(DOMstrings.inputUrl)[0].value = $(DOMstrings.dogPic)[0].getAttribute('src');
            $(DOMstrings.inputClicks)[0].value = $(DOMstrings.clickCounter)[0].innerHTML;
        },
        // gets the user input and returns an Obj to the app controller when called
        // returns {name, image, clickCount}
        getInput: function () {
          return {
            name: $(DOMstrings.inputName)[0].value,
            image: $(DOMstrings.inputUrl)[0].value,
            clickCount: $(DOMstrings.inputClicks)[0].value
          }
        },
        toggleAdmin: function () {
          $(DOMstrings.formContainer)[0].classList.toggle('hidden');
        }

    };

})(); // End of UI Module

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


            // 2. if the current image exist in the names array, return its idx position
            const idx = ($.inArray(e.target.innerText, data.names));

            // if the idx = -1 the target does not exist in the array, we aren't interested
            if ( idx != -1) {
                // call displayNewDog function and pass it the idx of the element that was clicked on in the names array
                displayNewDog(idx);
                // call getCurObj() in the UI to update the admin form when the object being displayed is changed by the user
                UIMdl.getCurObj();
            }
        });

        // listen for clicks on the image to count clicks
        $(DOM.imgContainer).click(function(e) {

            // 1. prevent Default
            e.preventDefault();

            // 2. if the current image exist in the images array, return the idx position
            const idx = ($.inArray(e.target.getAttribute('src'), data.images));

            // if the idx = -1 the target does not exist in the array, we aren't interested
            if ( idx != -1) {
                // update the objects clickcount
                updateClickCounter(idx);
            }
        });

        // listen for clicks on the admin button
        $(DOM.adminCtrlPnl).click(function (e) {
            e.preventDefault();

            // if admin button is clicked
            if ('#'+e.target.id === DOM.adminBtn) {
                // Toggles the hidden class on and off to hide the container when the admin button is clicked
                UIMdl.toggleAdmin();
                // get the current object being displayed in the UI and update the admin Fields
                UIMdl.getCurObj();
            }

            // if saved button is clicked
            if ('#'+e.target.id === DOM.adminSave) {
                // 1. get the input fields obj contains {name, imageUrl, #ofclicks}
                const obj = UIMdl.getInput();

                // 2. update data with Admin input on save
                dataMdl.updateDogs(obj);

                // 3. update the UI with new Dog
                // update the names list
                makeList();
                // update the object being displayed
                displayNewDog(data.names.length-1);
                // rehide the admin panel
                UIMdl.toggleAdmin();
            }
            // if cancel button is clicked
            if ('#'+e.target.id === DOM.adminCancel) {
                // rehide the admin panel
                UIMdl.toggleAdmin();
            }
        });
    }



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

    // ***** begin Private functions *****//

    // diplayNewDog is passed the index of the current element in the
    // forEachLoop of the eventlistener attached to the images to determine
    // the IDENTITY of the "Dog" that was selected because the "Dog's" info
    // is positioned identically in each array
    const  displayNewDog = function(idx) {

        // update the dog being displayed in the UI with the user's selection
        UIMdl.displayNewDog(new newDog(idx));

    }; // end displayNewDog function

    const updateClickCounter = function (idx) {
        // update the clickCounter in the dataModule
        let clickCount = dataMdl.updateClickCounter(idx);
        // update the clickCounter in the UI
        UIMdl.updateClickCounter(clickCount);
        // Update the click Count in the Admin Panel
        UIMdl.getCurObj();
    };

    const makeList =  function () {
        $(DOM.listItems).empty();
        // loop through the names array and make a list item for each name in the Array
        data.names.forEach(function (cur, idx) {
            // Update the UI with the newDog name
            UIMdl.makeList(new newDog(idx));
        });
    };

    // return public methods
    return {

       // sets up a METHOD to pass into PUBLIC to initialize the application
       init: function() {
         console.log('Application has started.');
         // make the clickable list of Dog
         makeList();
         // display first dog in the list
         UIMdl.displayNewDog(new newDog(0));
         // calls all EventListeners to begin listening for events
         setupEventListeners();
        }
    }

})(dataModule, UIModule); // pass in the dataModule and the UIModule

// initialize the app on page load
appController.init();
});
