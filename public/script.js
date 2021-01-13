$(document).ready(() =>{

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

    //This function adds a scrollbar to the add new form at tips, ingredients, and tips
    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');
    var tipsInput = $('.tipsInput');

    /*
    This function cheks the height of the tip textarea when cre
    */
    $(tipsInput).keydown(function(e){
        if(e.keyCode == 13 && $('.tipUl').height() > 100){
            e.preventDefault()
            $('.addTipUl').addClass('listWrapprScrollbar listWrapprTipScrollbar')
            $('.editTipsInputGroup').addClass('recipeEditScrlbr')
        }
    })   

    $('.addTiptoListBttn').on('click', function(){
        if($('.tipUl').height() > 100){
            $('.addTipUl').addClass('listWrapprScrollbar listWrapprTipScrollbar')
            $('.editTipsInputGroup').addClass('recipeEditScrlbr')
        }
    })


    $(ingrdntsInput).keydown(function(e){
        if(e.keyCode == 13 && $('.igUl').height() > 250){
            e.preventDefault()
            $('.addIgUl').addClass('listWrapprScrollbar')
        }

        if(e.keyCode == 13 && $('.igUl').height() > 50){
            e.preventDefault()
            $('.editTipsInputGroup').addClass('listWrapprScrollbar')
        }

    })

    $('.adIngrdntToListBttn').on('click', function(){
        if($('.igUl').height() > 250){
            $('.addIgUl').addClass('listWrapprScrollbar')
        }

        if($('.igUl').height() > 50){
            $('.editTipsInputGroup').addClass('listWrapprScrollbar')
        }

    })

    $(dirctnsInput).keydown(function(e){
        if(e.keyCode == 13){
            e.preventDefault()
            if($('.dirOl').height() > 250){
                $('.addDirOl').addClass('listWrapprScrollbar')
                $('.editTipsInputGroup').addClass('recipeEditScrlbr')
            }
        }
    })
    
    $('.adDirToDirListBttn').on('click', function(){
        if($('.dirOl').height() > 250){
            $('.addDirOl').addClass('listWrapprScrollbar')
            $('.editTipsInputGroup').addClass('recipeEditScrlbr')
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

    if($('.tipsInputGroup').height() > 90){
        $('.tipsInputGroup').addClass('editListItemScrol')
    } 

    if($('.ingInputGroup').height() > 270){
        $('.ingInputGroup').addClass('recipeIngDirEditScrlbr')
    }  

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
        $(this).parent().parent().children('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible');
    })

    $('.dltRecCnfrmSngleRec').on('click', function(){
        $(this).parent().parent().siblings('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible');
    })

    /*
    This function check if the reipce total time hours is 1 and changes the word hours to hour.
    It checks if the hours are mising and removes the word all togethor in that case
    */
    var prpTimeHrs = $('.prpTimeHrs').text()
    var prpTimeMin = $('.prpTimeMin').text()
    var ckTimeHrs = $('.ckTimeHrs').text()
    var ckTimeMin = $('.ckTimeMin').text()
    var ttlTimeHrs = $('.ttlTimeHrs').text()
    var ttlTimeMin = $('.ttlTimeMin').text()

    if(prpTimeHrs === ' ' || prpTimeHrs == 0){
        $('.prpTimeHrs').css('display', 'none')
        $('.prpTmeHrsSpan').css('display', 'none')
    }
    if(prpTimeMin === '' || prpTimeMin == 0){
        $('.prpTimeMin').css('display', 'none')
        $('.prpTmeMinSpan').css('display', 'none')
    }

    if(ckTimeHrs === '' || ckTimeHrs == 0){
        $('.ckTimeHrs').css('display', 'none')
        $('.ckTmeHrsSpan').css('display', 'none')
    }
     if(ckTimeMin === '' || ckTimeMin == 0){
        $('.ckTimeMin').css('display', 'none')
        $('.ckTmeMinSpan').css('display', 'none')
    }

    if(ttlTimeHrs === ' ' || ttlTimeHrs == 0){
        $('.ttlTimeHrs').css('display', 'none')
        $('.ttlTmeHrsSpan').css('display', 'none')
    }
     if(ttlTimeMin === '' || ttlTimeMin == 0){
        $('.ttlTimeMin').css('display', 'none')
        $('.ttlTmeMinSpan').css('display', 'none')
    }

    $('#searchRecipes').on('keyup', function(){
        var searchInput = document.getElementById("searchRecipes");
        var filterValue = searchInput.value.toUpperCase().trim();
        var title = $(".recipeTitle")

        for (var i = 0 ; i < title.length ; i++){
            var a = title[i].getElementsByTagName("a")[0];

            title[i].parentElement.parentElement.classList.remove('searchNotResult');
            title[i].parentElement.parentElement.parentElement.classList.remove('oneRecipeDisplayWrapperResult')
            title[i].parentElement.parentElement.parentElement.classList.add('oneRecipeDisplayWrapper')

            if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
                
                }else{
                    title[i].parentElement.parentElement.classList.add('searchNotResult');
                    title[i].parentElement.parentElement.parentElement.classList.remove('oneRecipeDisplayWrapper')
                    title[i].parentElement.parentElement.parentElement.classList.add('oneRecipeDisplayWrapperResult')
            }
        }
    })

    var deleteItm = $('.removeEditItem');
        $(deleteItm).on('click', function(){
            $(this).parent().children().remove()
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

    console.log($('.recipeTips li').height());

    function isOverflown(element) {
        return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
      }
      
      var els = document.querySelectorAll('.recipeTips li'); //li
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        el.style.borderColor = (isOverflown(el) ? 'red' : 'green');
        console.log("Element #" + i + " is " + (isOverflown(el) ? '' : 'not ') + "overflown.");
      }





    var yieldSelect = $('.yieldSelect');
    var otherOptionText = $('.otherOptionText')

    $(yieldSelect).on('change', function(){
        if(yieldSelect.val('Other')){
            $(otherOptionText).attr({type: 'text', name: 'yieldSelect'})
            $(otherOptionText).focus()
            $(this).attr('name', '')
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

