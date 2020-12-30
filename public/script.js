$(document).ready(() =>{

    /*
    This function checks if the page you are currently on has the id of index page.
    It will only run the open and close modal function if it indeed finds the id on that page
    */
    if(document.getElementById('indexPage')!=null){
        openClosemodal()
    }

    /*
    This function opens and closes the user login and signup modal window
    */
    function openClosemodal(){
        const open = document.querySelector('[data-open]');
        const close = document.querySelectorAll('[data-close]');
        const modalVisible = 'modalVisible';

        open.addEventListener('click', function(){
            const modalId = this.dataset.open;
            document.getElementById(modalId).classList.add(modalVisible)
        })


        for(const eachButton of close){
            eachButton.addEventListener('click', () =>{
                document.getElementById('modal').classList.remove(modalVisible)
            })
        }
    }

    /*
    This function allows you to switch between both the login and signup form in the modal window.
    It will dispaly the appropiate form acording to what you specify
    */

    $('.tab a').on('click', function(){   
        $(this).parent().addClass('active')
        $(this).parent().siblings().removeClass('active')

        var href = $(this).attr('href')
        $('.formWrapper').hide()
        $(href).fadeIn(500)
    })

    $('.signUpButton').on('click', function(){
        $('.signUpFormWrapper').css('display', 'flex')
    })

    $('.loginButton').on('click', function(){
        $('.loginFormWrapper').css('display', 'flex')
    })

    /*
    This function clears the appropiate form when the reset button on the form is clicked
    */
    $('.reset').on('click', function(){
        $('.eachInput input').val('')
        $('.errMsg').css('display', 'none')
    })

    /*
    This function toggles the forms' password visiblity
    */
    $('.showHidePassIcon').on('click', function(){
        var passwordField = $('.password');
        var passAtr = passwordField.attr('type') === 'password' ? 'text' : 'password'
        passwordField.attr('type', passAtr)
        $('.showHidePassIcon img').toggle()
    })

    /*
    This function adds a scrollbar when viewing one recipe and the directions get longer than a specified height
    */
    if($('.details').height() > 700){
        $('.details').addClass('detailsScrollbar')
    }

    /*
    This function toggles a recipe's image visibilty
    */
    $('.viewImage').on('click', function(){
       $('.recipeImageModal').fadeToggle()
       $('.pageBody, .recipeBook').toggleClass('imageVisble')
       $('.recipeBook hr').fadeToggle()
       $('.viewImage').toggleClass('viewImgLighter')
       $('.iconWrapperSingleRec div button, .iconWrapperSingleRec div a').toggleClass('recImageVisible')
    })

    /*
    This function takes each recipe ingredient as you add it to a new recipe and let's 
    you click enter to let the new ingredient be displayed as a list undernath the field
    togethor with all the other ingredients until you submit
    */

    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');

    function addIngrdntToList(){
        liStr = $(document.createElement('li')).text($(ingrdntsInput).val()).appendTo('.igUl');

        var liStrToInput = $('<input type="hidden"/>').attr({
            name: 'ingrdnts'
        }).appendTo('form');

        $(liStrToInput).val(liStr.text());

        /* TRY TO MOVE THIS AFTER ALL FUNCTIONS FOR THIS THING
        This function displays an x icon to delete an ingredient that we added to the list but decided to remove
        */
        var deleteIng = $(document.createElement('span')).text('x').prependTo(liStr);
        $(deleteIng).addClass('deleteListItem')

        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(liStrToInput).remove()
        })

        /*
        This part of the function empties the ingredient field
        every time you add the current ingredient to the ingredient list in the form 
        */
        $(ingrdntsInput).val(' ')
        $(ingrdntsInput).focus()
    }

    /*
    These functions runs the above function when the enter key
    is pressed or when the plus buttn on the input is clicked
    */
    $('.adIngrdntToListBttn').on('click', function(){
        addIngrdntToList();
    });

    $(ingrdntsInput).keydown(function(e){
        if(e.keyCode == 13){
            addIngrdntToList()
            e.preventDefault()
        }
    })

    /*
    This function takes each recipe direction as you add it to a new recipe and let's 
    you click enter to let the new direction be displayed as a list undernath the field
    togethor with all the other directions specified until you submit
    */
    function addLDirToDirList(){
        DirLiStr = $(document.createElement('li')).text($(dirctnsInput).val()).appendTo('.dirOl');

        var DirliStrToInput = $('<input type="hidden" />').attr({
            name: 'dirctns'
        }).appendTo('form');

        $(DirliStrToInput).val(DirLiStr.text());

        var deleteIng = $(document.createElement('span')).text('x').prependTo(DirLiStr);
        $(deleteIng).addClass('deleteListItem')

        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(DirliStrToInput).remove()
        })
        $(dirctnsInput).val(' ')
        $(dirctnsInput).focus()
    }

    $('.adDirToDirListBttn').on('click', function(){
        addLDirToDirList();
    });
    $(dirctnsInput).keydown(function(e){
        if(e.keyCode == 13){
            addLDirToDirList()
            e.preventDefault()
        }
    })

    /*
    This function displays the 'delete a recipe confirmation window' when clicking the delete a recipe icon
    */
    $('.deleteRecConfirm').on('click', function(){
      $('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible'); 
    })

    /*
    This function check if the reipce total time hours is 1 and changes the word hours to hour.
    It checks if the hours are mising and removes the word althogethor in that case
    */
    var ttlTimeHrs = $('.ttlTimeHrs').text()
    var ttlTimeSlctHrs = $('.ttlTimeSlctHrs')
    var ttlTimeMin = $('.ttlTimeMin').text()
    var ttlTimeSlctMin = $('.ttlTimeSlctMin')

    $(ttlTimeSlctHrs).text('Hours')

    if(ttlTimeHrs == 1){
        $(ttlTimeSlctHrs).text('Hour')
    }else if(ttlTimeHrs == ''){
        $(ttlTimeSlctHrs).text('')
    }

    /*
    This function check if the recipe total time minutes is 1 and changes the word minutes to minutes
    It checks if the minutes are mising and removes the word althogethor in that case
    */

    $(ttlTimeSlctMin).text('Minutes')

    if(ttlTimeMin == 1){
        $(ttlTimeSlctMin).text('Minute')
    }else if(ttlTimeMin == ''){
        $(ttlTimeSlctMin).text('')
    }


    // var ingrdntLi = $('.recipeIngredients li');
    // if(ingrdntLi.text == ''){
    //     console.log('emtyp');
    //     //$(ingrdntLi).remove()
    //     $(ingrdntLi).css('display', 'none')
    // }else{
    //     $(ingrdntLi).css('display', 'block')
    // }
    /*
    This function takes the select values and puts them into inputs so we ca get their values to the form easier
    */
    var prpTimeSelect = $('<input type="hidden"/>').attr({
        name: 'recipe[prpTimeSlct]'
    }).appendTo('form')

    prpTimeSelect.val('Minutes')
    $('.prpTimeSelect').on('click', function(){
        prpTimeSelect.val($(this).val())
    })

    var ckTimeSelect = $('<input type="hidden"/>').attr({
        name: 'recipe[ckTimeSlct]'
    }).appendTo('form')

    ckTimeSelect.val('Minutes')
    $('.ckTimeSelect').on('click', function(){
        ckTimeSelect.val($(this).val())
    })
    

    var rToInput = $('<input type="hidden" />').attr({
        name: 'recipe[dirctns]'
    }).appendTo('form');

    rToInput.val($('dirctnLiTxt').text())

     var deleteItm = $('.removeEditItem');

     $(deleteItm).on('click', function(){
         $(this).parent().children().remove()
     })

    /*
    This function helps add ingredients to the list to edit an then update the recipe
    */
    var editAdIngrdntInpt = $('.editAdIngrdntInpt')
   
    function editAddNewItem(){
        var newItemVal = $(editAdIngrdntInpt).val()
        var newEditItem = $(`<span class="circle">○</span><input type="text" name="ingrdnts" class="editInputs" value='${newItemVal}'>`)
        $(newEditItem).appendTo('.ingrInputWrapper .eachInput')
        $(editAdIngrdntInpt).val(' ')

        var deleteIng = $('<span class="removeEditItem removeEditItemFromJs">x</span>').appendTo(newEditItem);
        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(newEditItem).remove()
        })

     }

    $('.adIngrdntToListBttnEdit').on('click', function(){
        editAddNewItem()
    });
    $(editAdIngrdntInpt).keydown(function(e){
        if(e.keyCode == 13){
            editAddNewItem()
            e.preventDefault()
        }
    })

    /*
    This function helps add ingredients to the list to edit an then update the recipe
    */
    var editAdDirctnInpt = $('.editAdDirctnInpt')
   
    function editAddNewItemDrctn(){
        var newItemVal = $(editAdDirctnInpt).val()
        var newEditItem = $(`<span class="circle">○</span><input type="text" name="dirctns" class="editInputs" value='${newItemVal}'>`)
        $(newEditItem).appendTo('.drctnInputWrapper .eachInput')
        $(editAdDirctnInpt).val(' ')

        var deleteIng = $('<span class="removeEditItem removeEditItemFromJs">x</span>').appendTo(newEditItem);
        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(newEditItem).remove()
        })

     }

    $('.adDirToDirListBttn').on('click', function(){
        editAddNewItemDrctn()
    });
    $(editAdDirctnInpt).keydown(function(e){
        if(e.keyCode == 13){
            editAddNewItemDrctn()
            e.preventDefault()
        }
    })

    var recipeTitle = $('.recipeTitle').text()
    var recipeTitle2 = document.querySelectorAll('.recipeTitle')

    
    //var splitTitle = recipeTitle.split(',')
    
    //console.log(splitTitle);

    var searchInput = $('.navSearchInput');
       
    
    // splitTitle.forEach(function(){
    //     console.log($(this));
    // })

//     $(searchInput).on('keyup', function(e){

//     var recTitle = document.querySelectorAll('.recipeTitle')

//     for(var i = 0; i < recTitle.length; i++){
//         //console.log(recTitle[i]);
//     var splitRecipe = recTitle[i]
// console.log(splitRecipe);


//         var searchInputText = e.target.value.toLowerCase();

//         if($(recTitle).toLowerCase().includes(searchInputText)){
//             console.log(searchInputText);
//             console.log(recipeTitle[i]);
//         }else{
//             console.log('none');
//         }

//      }   

        // var filteredTitles = splitTitle.filter(function(){
        //     return(
        //         recipeTitle.toLowerCase().includes(searchInputText)
        //     )
        // })
        // console.log(filteredTitles);
    
        
  //  }) 
  


    var arr = [];
    for (i = 0; i < recipeTitle2.length; i++) {
        arr.push(recipeTitle2[i]);
        
        var iterator = arr.values()

        for (const value of iterator) {
                //console.log(value);
        
            $(searchInput).on('keyup', function(e){
                var searchInputText = e.target.value;
            

            var filteredTitles = arr.filter(function(){
                return(
                    value.includes(searchInputText)
                )
            })
                //console.log(arr);
                //console.log(filteredTitles);
            })
        }
    }
    //this worked originally
    // if(recipeTitle.toLowerCase().includes(searchInputText)){
    //     console.log(searchInputText);
    // }else{
    //     console.log('none');
    // }

    $('.userOptions').hide()
    $('.userName').on('click', function(){
        $('.userOptions').fadeToggle()
    })
        
})

