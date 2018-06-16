const dataModule = (function () {
    const data = {
        allDogs: {
            names: ['Mr. MoneyMaker','Mr. Chill','Mr. Blue-Eyes','Father and Daughter','Daddy\'s Dog-Tired'],
            images: ['images/4784_1113603514041_5792182_n.jpg','images/1914414_1170498856389_3791320_n.jpg','images/1914414_1170498176372_1876897_n.jpg','images/1914414_1170498896390_5590963_n.jpg','images/1914414_1170498616383_2650714_n.jpg'],
            clickCounters: [0,0,0,0,0]
        }
    };

    return {
        getDogs: function () {
            return {
                names: data.allDogs.names,
                images: data.allDogs.images,
                clickCounters: data.allDogs.clickCounters
            };
        }
    };

})();

const UIModule = (function () {
    const DOMstrings = {
        imgContainer: '#img-container',
        dogPic: '#dog-picture',
        name: '#name',
        clickCounter: '#clickCount',
        listItems: '#list-of-names'
    };

    return {

        // Establishes a method to pass the DOMstrings between modules (PUBLIC) so
        // they can be used outside the UIModule IIFE
        getDOMstrings: function() {
            return DOMstrings;
        },

        displayNewImage: function(userSelectedDog) {
            document.querySelector('#dog-picture').setAttribute('src', userSelectedDog.newImage);
            document.querySelector(DOMstrings.name).innerHTML = userSelectedDog.newName;
            clickCounter: document.querySelector(DOMstrings.clickCounter).innerHTML= parseInt(userSelectedDog.newCounter);
        },

        updateClickCounter: function (clickCount) {
            document.querySelector(DOMstrings.clickCounter).innerHTML= clickCount;
        }


    };

})();

const appController = (function (dataMdl, UIMdl) {
    const DOM = UIMdl.getDOMstrings();

    // Object of 3 arrays, [names,images,clickCounters]
    const data = dataMdl.getDogs();
    const setupEventListeners = function () {



        $(DOM.listItems).click(function (e) {
            e.preventDefault();
            data.names.forEach(function (cur, idx) {
                if (cur === e.target.innerText) {
                    updateImage(idx);
                }
            });


        });


        $(DOM.imgContainer).click(function(e) {
            // 1. determine which image was clicked on
            e.preventDefault();
            data.images.forEach(function (cur, idx) {
                if (cur === e.target.getAttribute('src')) {
                    updateClickCounter(idx);
                }
            });
        });
    }

    const updateImage = function(idx) {
        const userSelectedDog = {
            newImage: data.images[idx],
            newName: data.names[idx],
            newCounter: data.clickCounters[idx]
        };

        // 1. update the dog being displayed in the UI
        UIMdl.displayNewImage(userSelectedDog);

    }; // end  updateImage function

    const updateClickCounter = function (idx) {
        // update the clickCounter in the dataModule
        data.clickCounters[idx]++;
        // update the clickCounter in the UI
        UIMdl.updateClickCounter(data.clickCounters[idx]);
    };

    return {

       // sets up a METHOD to pass into PUBLIC to initialize the application
       init: function() {
         console.log('Application has started.');


         // calls all EventListeners to begin listening for events
         setupEventListeners();
        }
    }

})(dataModule, UIModule);

appController.init();
