$(document).ready(function(){

    if(document.getElementById('indexPage')!=null){
        openClosemodal()
    }
  
    function openClosemodal(){
        const open = document.querySelector('[data-open]');
        const close = document.querySelectorAll('[data-close]');
        const modalVisible = 'modalVisible';

        open.addEventListener('click', function(){
            const modalId = this.dataset.open;
            document.getElementById(modalId).classList.add(modalVisible)
        })

        for(const eachButton of close){
            eachButton.addEventListener('click', function(){
                document.getElementById('modal').classList.remove(modalVisible)
            })
        }
    }


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

    $('.reset').on('click', function(){
        $('.eachInput input').val('')
        
    })

    

    $('.showHidePassIcon').on('click', function(){
        var passwordField = $('#password');
        
        
       /* if( $(passwordField).type === 'password'){
            $(this).type ='text'
            console.log('text');
        }else{
            $(this).type ='password'
            console.log('pass');
        }*/

        var passAtr = passwordField.attr('type') === 'password' ? 'text' : 'password'
        passwordField.attr('type', passAtr)

        $('.showHidePassIcon img').toggle()
    })


    if($('.details').height() > 752){
        $('.details').addClass('detailsScrollbar')
    }

    var recipeImageModal = $('.recipeImageModal');

    $('.viewImage').on('click', function(){
        $(recipeImageModal).fadeToggle()
        $('.pageBody, .recipeBook, .back').toggleClass('imageVisble')
        $('.viewImage').toggleClass('viewImgLighter')
    })


    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');


    /*Ingredients function*/
    function addLiToList(){
        liStr = $(document.createElement('li')).text($(ingrdntsInput).val()).appendTo('.igUl');
    //liStr.addClass('IngredientItem');

        var liStrToInput = $('<input type="hidden" />').attr({
            name: 'ingrdnts'
        }).appendTo('form');

        $(liStrToInput).val(liStr.text());

        var deleteIng = $(document.createElement('span')).text('x').appendTo(liStr);
        $(deleteIng).addClass('DeleteListItem')

        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(liStrToInput).remove()
        })
            $(ingrdntsInput).val(' ')
            $(ingrdntsInput).focus()
    }

    $('.adIngrdntToListBttn').on('click', function(){
        addLiToList();
    });
    $(ingrdntsInput).keydown(function(e){
        if(e.keyCode == 13){
            addLiToList()
            e.preventDefault()
        }
    })

    /*Directions Function */
    function addLDirToDirList(){
        DirLiStr = $(document.createElement('li')).text($(dirctnsInput).val()).appendTo('.dirOl');

        var DirliStrToInput = $('<input type="hidden" />').attr({
            name: 'dirctns'
        }).appendTo('form');

        $(DirliStrToInput).val(DirLiStr.text());

        var deleteIng = $(document.createElement('span')).text('x').appendTo(DirLiStr);
        $(deleteIng).addClass('DeleteListItem')

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

})

