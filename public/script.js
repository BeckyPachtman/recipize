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
            $('.logoWrapper img:first-child').css('display', 'none');
            $('.logoWrapper img:last-child').css('display', 'block');
         
        } else {
            $('.nav').removeClass('sticky'); 
            $('.nav a').removeClass('stickyLinks'); 
            $('.nav img').removeClass('stickyLogo');
            $('.logoWrapper img:first-child').css('display', 'block');
            $('.logoWrapper img:last-child').css('display', 'none');
        }
    };
    stickyNav();
    $(window).scroll(function() {
        stickyNav();
    });


    /*let navWrapper = document.querySelector('nav'),
    navToogler =  document.querySelector('.navToggler')

    $(navToogler).on('click', function(){
        $(navWrapper).toggleClass('active navActive')
    })*/

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".navUl");
const links = document.querySelectorAll(".navUl li");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  links.forEach(link => {
    link.classList.toggle("fade");
  });
});


    /*
    This function show and hides the setting options on the view-one recipe page
    */
    
    $('.settings > img').on('click', function(){
        $('.iconWrapperSingleRec').fadeToggle()
    })
    /*
    This function adds a scrollbar when viewing one recipe and the directions get longer than a specified height
    */
    // if($('.details').height() > 750){
    //     $('.details').addClass('detailsScrollbar')
    //     $('.leftSide').addClass('leftSideScrollbarVisible')
    // }

    // if($('.recIng').height() > 300){
    //     $('.recipeIngredients').addClass('recipeIngrScrollbar')
    // }

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
    // $('.recImg').on('click', function(){
    //    $('.recipeImageModal').fadeToggle()
    //    $('.pageBody, .recipeBook').toggleClass('imageVisble')
    //    //$('.recipeBook hr').fadeToggle()
    //    $('.viewImage').toggleClass('viewImgLighter')
    //    $('.iconWrapperSingleRec div button, .iconWrapperSingleRec div a').toggleClass('recImageVisible')
    //    $('.details').toggleClass('detailsScrollbarImgVsbl')
    // })

    var modal = $('.recImgModal'),
    overlay = $('.overlay'),
    showModal = $('.recImg'),
    close = $('.close');
    
/*show modal and set dimensions based on window */
$(showModal).on('click', function(e){
  e.preventDefault();
  var windowWidth = $(window).width();


  $(overlay).show();
  $(overlay).addClass('overlayVisible')
  $(modal).css({});
  $('.viewRecPageBody').css('position', 'fixed')
});
/*close on click of 'x' */
$(close).on('click', function(){
  $(overlay).hide();
});
/* close on click outside of modal */
$(overlay).on('click', function(e) {
  if (e.target !== this) return;
  $(overlay).hide();
});


    

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
        $(this).parent().parent().parent().parent().children('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible');
    })


    //$('.recImg').on('click', function(){
        // $(this).css({
        //     'height': '100%',
        //     'margin': '0',
        // })
        //$(this).toggleClass('recImgBig')
        
        //console.log('clicked');
    //})
    /*
    This function check if the reipce total time hours is 1 and changes the word hours to hour.
    It checks if the hours are mising and removes the word all togethor in that case
    */
   var list = [];

    var prpTimeHrs = $('.prpTimeHrs').text()
    list.push({key:'prpTimeHrs', value: prpTimeHrs});

    var prpTimeMin = $('.prpTimeMin').text()
    list.push({key:'prpTimeMin', value:prpTimeMin});

    var ckTimeHrs = $('.ckTimeHrs').text()
    list.push({key:'ckTimeHrs', value: ckTimeHrs});

    var ckTimeMin = $('.ckTimeMin').text()
    list.push({key:'ckTimeMin', value: ckTimeMin});

    var ttlTimeHrs = $('.ttlTimeHrs').text()
    list.push({key:'ttlTimeHrs', value: ttlTimeHrs});

    var ttlTimeMin = $('.ttlTimeMin').text()
    list.push({key:'ttlTimeMin', value: ttlTimeMin});

    $.each(list, function(i,obj){
        if(obj.value === ' ' || obj.value == 0){
            $('.'+obj.key).css('display', 'none')

            if(obj.key ==='prpTimeHrs'){
                $('.prpTmeHrsSpan').css('display', 'none')
            }

            else if(obj.key ==='prpTimeMin'){
                $('.prpTmeMinSpan').css('display', 'none')
            }

            else if(obj.key ==='ckTimeHrs' ){
                $('.ckTmeHrsSpan').css('display', 'none')
            }

            else if(obj.key ==='ckTimeMin' ){
                $('.ckTmeMinSpan').css('display', 'none')
            }

            else if(obj.key ==='ttlTimeHrs' ){
                $('.ttlTmeHrsSpan').css('display', 'none')
            }

            else if(obj.key ==='ttlTimeMin' ){
                $('.ttlTmeMinSpan').css('display', 'none')
            }
        }
    });


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



    var yieldSelect = $('.yieldSelect');
    var otherOptionText = $('.otherOptionText')

    $(yieldSelect).on('change', function(){
        if(yieldSelect.val('Other')){
            $(otherOptionText).attr({type: 'text', name: 'yieldSelect'})
            $(otherOptionText).focus()
            $(this).attr('name', '')
        }
    })

    if(yieldSelect.val('Servings')){
        
        $('.yieldSelectViewRec').hide()
    }


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

