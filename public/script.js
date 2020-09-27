
$('#nav').load('../views/header.html')

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
var adIngrdntToListBttn = $('.adIngrdntToListBttn');
var dsd = $(document.createElement('input')).addClass('hu')


function addLiToList(){
    liStr = $(document.createElement('li')).text($(ingrdntsInput).val()).appendTo('.igUl');
    //liStr = $(document.createElement('input')).val($(ingrdntsInput).val()).appendTo('.igUl');
    liStr.addClass('IngredientItem')
    $(liStr).attr('name', 'ingrdnts')

    var deleteIng = $(document.createElement('span')).text('x').appendTo(liStr);
    $(deleteIng).addClass('DeleteListItem')

    $(deleteIng).on('click', function(){
        $(this).parent().remove()
    })
        $(ingrdntsInput).val(' ')
        $(ingrdntsInput).focus()
}

$('.adIngrdntToListBttn').on('click', function(){
    addLiToList();
})

$(ingrdntsInput).keydown(function(e){
    if(e.keyCode == 13){
        addLiToList()
        e.preventDefault()
    }
})
