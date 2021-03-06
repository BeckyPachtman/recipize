$(document).ready(() =>{

    /*
        This function exchages the original nav with a more
        visible one once the page is scrolled a bit
    */
 
    var stickyNavTop = 50;
    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) { 
            $('.nav').addClass('sticky');
            $('.nav a').addClass('stickyLinks');
            $('.logoWrapper img:first-child').css('display', 'none');
            $('.logoWrapper img:last-child').css('display', 'block');
         
        }else{
            $('.nav').removeClass('sticky');
            $('.nav a').removeClass('stickyLinks');
            $('.nav img').removeClass('stickyLogo');
            $('.logoWrapper img:first-child').css('display', 'block');
            $('.logoWrapper img:last-child').css('display', 'none');
        }
    };

    $(window).scroll(function() {
        stickyNav();
    });


    /* 
        This function opens and closes the mobile nav
        when clicking on the icon menu on smaller screens
    */
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
        This function displays the log out option
        when the user nickname is clicked on
    */
    $('.userOptions').hide()
    $('.userName').on('click', function(){
        $('.userOptions').fadeToggle()
    })


    /*
        This function show and hides the setting options of edit and delete
        recipe when the settings wheel is clicked on the view-one recipe page
    */
    $('.settings > img').on('click', function(){
        $('.iconWrapperSingleRec').fadeToggle()
    })

    
    /*
        This function shows a larger version of the image when the image on the 'View-on recipe page' is clicked
        if anywhere on the screen but on the image is clicked the image will close
    */
   
    overlay = $('.overlay'),
    showModal = $('.recImg'),
    close = $('.close');

    $(showModal).on('click', function(e){
        e.preventDefault();
        $(overlay).show();
        $(overlay).addClass('overlayVisible')
       
    });
    $(overlay).on('click', function(e) {
        if (e.target !== this) return;
        $(overlay).hide();
    });

    
    /*
        This function check if the reipce prep, cook, and total times are
        1 and changes the word hours to hour. It also checks if there are
        hours or minutes empty and, in that case, removes the word all togethor
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

    $.each(list, function(i, obj){
        if(obj.value === ' ' || obj.value == 0){
            $('.' + obj.key).css('display', 'none')

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

    /*
        This function searches for a recipe title according to what
        is searched for in the search bar, it will then display
        the recipes that are relevant
    */
    function searchRecipes(){
        var searchInput = document.getElementById("searchRecipes");
        var filterValue = searchInput.value.toUpperCase().trim();
        var title = $(".recipeTitle")

        for (var i = 0 ; i < title.length; i++){
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
    }
    $('#searchRecipes').on('keyup', function(){
        searchRecipes()
    })


    /*
        This function is part of the search recipe function,
        it will empty the search bar and display all recipes
        if he x on the searchbar is clicked
    */
    if($(".recPageBody").length) {
        document.getElementById("searchRecipes").addEventListener("search", function() {
            var title = $(".recipeTitle")

            for (var i = 0 ; i < title.length; i++){
                title[i].parentElement.parentElement.classList.remove('searchNotResult');
                title[i].parentElement.parentElement.parentElement.classList.remove('oneRecipeDisplayWrapperResult')
                title[i].parentElement.parentElement.parentElement.classList.add('oneRecipeDisplayWrapper')
            }
        });
    }

    /*
        This function checks if the yield select field text is Other
        if so it displays a text box to let the user add some free text
    */

    var yieldSelect = $('.yieldSelect');
    var category = $('.category');
    var addRecSelect = $('.addRecSelect')
    var otherOptionText = $('.otherOptionText')

    $(addRecSelect).on('change', function(){
        $(otherOptionText).attr({type: 'hidden', name: ''})
        $(otherOptionText).hide()
        $(yieldSelect).attr('name', 'yieldSelect')
        $(category).attr('name', 'category')

        if($(yieldSelect).val() != 'Servings'){
            $($(this).parent().children(otherOptionText)).attr({type: 'text', name: 'yieldSelect'})
            
            $($(this).parent().children(otherOptionText)).show()
            $($(this).parent().children(otherOptionText)).focus()
            $(this).attr('name', '')
        }

        if($(category).val() == 'Other'){
            $($(this).parent().children(otherOptionText)).attr({type: 'text', name: 'category'})
            
            $($(this).parent().children(otherOptionText)).show()
            $($(this).parent().children(otherOptionText)).focus()
            $(this).attr('name', '')
        }
    })

  
    
    /*
        This function checks if the user is on a mobile or desktop
        device and will open the appropiate whatsapp to chat to, mobile or web, accordingly
    */
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var device = 'api'
    }else{
        device = 'web'
    }
    $('a.footerWhApp').attr('href', 'https://'+device+'.whatsapp.com/send?phone=972533402859&text&source&data&app_absent');
})

