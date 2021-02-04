$(document).ready(() =>{

    /*
        The following function adds whatever text is added to a new recipe
        tip input and adds them to a list underneath the input until you submit
    */
    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');
    var tipsInput = $('.tipsInput');

    function addTipstoTipsList(){
        // var input = `<div class="tipWrppr"><span class="circle">○</span>
        //             <textarea name="tips" rows="1" id="jsCreatedTextarea">${$(tipsInput).val()}</textarea>
        //             <span class="deleteIng">x</span></div>`

        var input = document.createElement('div')
        input.classList.add('tipWrppr')

        var circle = document.createElement('span')
        circle.innerHTML = 'o'
        circle.classList.add('circle')

        var textarea = document.createElement('textarea')
        textarea.setAttribute('id', 'jsCreatedTextarea')
        textarea.setAttribute('name', 'tips')
        textarea.innerHTML = document.getElementById('tipsInput').value
        

        var deleteIng = document.createElement('span')
        deleteIng.innerHTML = 'x'
        deleteIng.classList.add('deleteIng')
    

 
var hght = textarea.innerText.length
if(hght >= 70){
    $(textarea).css('height', '1.5em')
    console.log(hght);
} if(hght >= 100){
    $(textarea).css('height', '2.5em')
    console.log(hght);
}if(hght >= 160){
    $(textarea).css('height', '3em')
    console.log(hght);
}if(hght >= 200){
    $(textarea).css('height', '3.7em')
    console.log(hght);
}if(hght >= 250){
    $(textarea).css('height', '4em')
    console.log(hght);
}if(hght >= 300){
    $(textarea).css('height', '5em')
    console.log(hght);
}if(hght >= 350){
    $(textarea).css('height', '6em')
    console.log(hght);
}if(hght >= 400){
    $(textarea).css('height', '6.5em')
    console.log(hght);
}if(hght >= 450){
    $(textarea).css('height', '7.5em')
    console.log(hght);
}else{
    console.log('smaller');
}

        input.append(circle, textarea, deleteIng)

        document.getElementById('tipUl').append(input)
        //$(input).appendTo($('.tipUl'));
       
        var deleteIng = $('.deleteIng')
        $(deleteIng).on('click', function(){
            $(this).parent().remove()
        })
        $(tipsInput).val(' ')
        $(tipsInput).focus()
    }

    $('.addTiptoListBttn').on('click', function(){
        addTipstoTipsList();
    });
    
    $(tipsInput).keydown(function(e){
        if(e.keyCode == 13){
            addTipstoTipsList()
            e.preventDefault()
        }
    })




    
        
      


    /*
        The following function adds whatever text is added to a new recipe
        ingredient input and adds them to a list underneath the input until you submit
    */
    function addIngrdntToList(){
        var input = `<div class="tipWrppr"><span class="circle">○</span>
                    <textarea name="ingrdnts" type="text" rows="1">${$(ingrdntsInput).val()}</textarea>
                    <span class="deleteIng">x</span></div>`

        $(input).appendTo($('.igUl'));
       
        var deleteIng = $('.deleteIng')
        $(deleteIng).on('click', function(){
            $(this).parent().remove()
        })
        $(ingrdntsInput).val(' ')
        $(ingrdntsInput).focus()
    }

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
        The following function adds whatever text is added to a new recipe
        direction input and adds them to a list underneath the input until you submit
    */
    function addLDirToDirList(){
        var input = `<div class="tipWrppr"><span class="circle">○</span>
                    <textarea name="dirctns" type="text" rows="1">${$(dirctnsInput).val()}</textarea>
                    <span class="deleteIng">x</span></div>`

        $(input).appendTo($('.dirOl'));
       
        var deleteIng = $('.deleteIng')
        $(deleteIng).on('click', function(){
            $(this).parent().remove()
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
        This function adjusts a texarea's height according to it's text
        on the edit form exsisting tips, ingredients, and directions
    */
    $('textarea').each(function() {
        $(this).height($(this).prop('scrollHeight'));
    });
    

    /*
        This function activtes the next and previous buttons
        on the 'Add recipe' and 'edit recipe' pages'
    */
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


    /*
        These following functions add a scrollbar to the tips, ingredients,
        and directions list on the edit page if the text is too long for the form to handle
    */

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
        This function deletes an item form the tip ingredient,
        or directions list if the user clicks on the x next to that item
    */
    var deleteItm = $('.removeEditItem');
        $(deleteItm).on('click', function(){
            $(this).parent().children().remove()
    })


    /*
        This function displays the 'Delete a recipe confirmation window' when clicking the delete a recipe icon
        to double check with the user that they indeed want to get rid of that specific recipe
    */
    $('.deleteRecConfirm').on('click', function(){
        $(this).parent().parent().children('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible');
    })
    $('.dltRecCnfrmSngleRec').on('click', function(){
        $(this).parent().parent().parent().parent().children('.dltRecWrrpModal').children('.modalDel').addClass('modalDelVisible');
    })


    /*
        These following functions add a scrollbar to the add new form at tips,
        ingredients, and directions if the section gets too long for the form to handle
    */
    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');
    var tipsInput = $('.tipsInput');
    /*
        This function checks the height of the tip textarea, as you are adding new items, and adds a scollbar if needed
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


    /*
        This function checks the height of the ingredients textarea, as you are adding new items, and adds a scollbar if needed
    */
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

    /*
        This function checks the height of the directions textarea, as you are adding new items, and adds a scollbar if needed
    */
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

})