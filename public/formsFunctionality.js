$(document).ready(() =>{

    /*Add items to tips, ingredients, directions list */
    var ingrdntsInput = $('.ingrdntsInput');
    var dirctnsInput = $('.dirctnsInput');
    var tipsInput = $('.tipsInput');

    function addTipstoTipsList(){
        tipsList = $(document.createElement('li')).text($(tipsInput).val()).appendTo('.tipUl');

        var tipsListToInput = $('<input type="hidden" />').attr({
            name: 'tips'
        }).appendTo('form');

        $(tipsListToInput).val(tipsList.text());

        var deleteIng = $(document.createElement('span')).text('x').prependTo(tipsList);

        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(tipsListToInput).remove()
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

    
    /*This function takes each recipe ingredient as you add it to a new recipe and let's 
    you click enter to let the new ingredient be displayed as a list undernath the field
    togethor with all the other ingredients until you submit*/
    function addIngrdntToList(){
        liStr = $(document.createElement('li')).text($(ingrdntsInput).val()).appendTo('.igUl');

        var liStrToInput = $('<input type="hidden"/>').attr({
            name: 'ingrdnts'
        }).appendTo('form');

        $(liStrToInput).val(liStr.text());
        
        /*This part of the function empties the ingredient field
        every time you add the current ingredient to the ingredient list in the form*/

        $(ingrdntsInput).val(' ')
        $(ingrdntsInput).focus();

        /*This function displays an x icon to delete an ingredient that we added to the list but decided to remove*/

        var deleteIng = $(document.createElement('span')).text('x').prependTo(liStr);

        $(deleteIng).on('click', function(){
            $(this).parent().remove()
            $(liStrToInput).remove()
        })
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

    /*This function takes each recipe direction as you add it to a new recipe and let's 
    you click enter to let the new direction be displayed as a list undernath the field
    togethor with all the other directions specified until you submit*/

    function addLDirToDirList(){
        DirLiStr = $(document.createElement('li')).text($(dirctnsInput).val()).appendTo('.dirOl');

        var DirliStrToInput = $('<input type="hidden" />').attr({
            name: 'dirctns'
        }).appendTo('form');

        $(DirliStrToInput).val(DirLiStr.text());

        var deleteIng = $(document.createElement('span')).text('x').prependTo(DirLiStr);

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