$(document).ready(() =>{

    //only this on editRecipe page works fine
    //if add id first to other filedset with this on works fine

    $(function() {
        $('textarea').each(function() {
            $(this).height($(this).prop('scrollHeight'));
        });
    });


    //nav and footer functions
    $('.userOptions').hide()
    $('.userName').on('click', function(){
        $('.userOptions').fadeToggle()
    })

    ///sticky nav
   // var stickyNavTop = $('.nav').offset().top;
    var stickyNavTop = 50;
    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) { 
            $('.nav').addClass('sticky');
            $('.nav a').addClass('stickyLinks');
            $('.nav img:first-child').css('display', 'none');
            $('.nav img:last-child').css('display', 'block');
         
        } else {
            $('.nav').removeClass('sticky'); 
            $('.nav a').removeClass('stickyLinks'); 
            $('.nav img').removeClass('stickyLogo');
            $('.nav img:first-child').css('display', 'block');
            $('.nav img:last-child').css('display', 'none');
        }
    };
    stickyNav();
    $(window).scroll(function() {
        stickyNav();
    });
    
    /*
    This function adds a scrollbar when viewing one recipe and the directions get longer than a specified height
    */
    if($('.details').height() > 750){
        $('.details').addClass('detailsScrollbar')
        $('.leftSide').addClass('leftSideScrollbarVisible')
    }

    if($('.recIng').height() > 300){
        $('.recipeIngredients').addClass('recipeIngrScrollbar')
    }

    //This function adds a scrollbar to the add new form at tips, ifredients, and tips
    $('.addTiptoListBttn').on('click', function(){
        if($('.tipUl').height() > 80){
            $('.tipUl').addClass('listWrapprScrollbar listWrapprTipScrollbar')
        }
    })

    $('.adIngrdntToListBttn').on('click', function(){
        if($('.igUl').height() > 250){
            $('.igUl').addClass('listWrapprScrollbar')
        }
    })
    
    $('.adDirToDirListBttn').on('click', function(){
        if($('.dirOl').height() > 250){
            $('.dirOl').addClass('listWrapprScrollbar')
        }
    })
    /*
    This function toggles a recipe's image visibilty
    */
    $('.viewImage').on('click', function(){
       $('.recipeImageModal').fadeToggle()
       $('.pageBody, .recipeBook').toggleClass('imageVisble')
       $('.recipeBook hr').fadeToggle()
       $('.viewImage').toggleClass('viewImgLighter')
       $('.iconWrapperSingleRec div button, .iconWrapperSingleRec div a').toggleClass('recImageVisible')
       $('.details').toggleClass('detailsScrollbarImgVsbl')
    })
    

    /*Activats next/previous buttons on form .*/
    $('button[class^="next_btn"]:not(.btnToIngrdnts)').click(function(){
        $(this).parent().parent().next().css('display', 'flex')
        $(this).parent().parent().css('display', 'none')
       $('.active').next().addClass('active')
    })

    $('.btnToIng').on('click', function(){
        $(this).parent().parent().next().css({'visibility': 'visible', 'overflow': 'visible', 'height': 574})
        $(this).parent().parent().css('display', 'none')
    })

    $('.btnToDir').on('click', function(){
        $(this).parent().parent().next().css({'visibility': 'visible', 'overflow': 'visible', 'height': 574})
        $(this).parent().parent().css('visibility', 'hidden')
    })

    $('.preToIng').on('click', function(){
        $(this).parent().parent().prev().css({'visibility': 'visible', 'overflow': 'visible', 'height': 574})
        $(this).parent().parent().css('display', 'none')
    })

    $('.pre_btn').click(function(){
        $(this).parent().parent().prev().css('display', 'flex')
        $(this).parent().parent().css('display', 'none')
        $('.active:last').removeClass('active')
    })

    
    if($('.tipsInputGroup').height() > 100){
            $('.tipsInputGroup').addClass('recipeTipEditScrlbr')
        }

    if($('.ingInputGroup').height() > 270){
        $('.ingInputGroup').addClass('recipeIngDirEditScrlbr')
    }

console.log($('.ingInputGroup2').height());
  

    if($('.ingInputGroup2').height() > 250){
        $('.ingInputGroup2').css('overflow-y', 'scroll')         
    }
    
    if($('.ingInputGroup2').height() < 50){
        $('.ingInputGroup2').css('overflow-y', 'hidden')         
    }
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
    var ttlTimeSlctHrs = $('.ttlTimeHrs')
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


    /*
    This function takes the select values and puts them into inputs so we can get their values to the form easier
    
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

    rToInput.val($('dirctnLiTxt').text())*/


    var deleteItm = $('.removeEditItem');
        $(deleteItm).on('click', function(){
            $(this).parent().children().remove()
    })

    /*
    This function helps add ingredients to the list to edit an then update the recipe
    
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
    })*/

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

    var selectName = $('.editSelectValue').find(":selected").text();
        if(selectName === 'Servings'){
            $('.selectServings').css('display', 'none')
        }else if(selectName === 'Other' || selectName === 'Minutes'){
            $('.selectOther').css('display', 'none')
    }

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var device = 'api'
        }else{
            device = 'web'
        }
    $('a.footerWhApp').attr('href', 'https://'+device+'.whatsapp.com/send?phone=972533402859&text&source&data&app_absent');

        
})

