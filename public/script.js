
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
var str = $(document.createElement('span'))

function runSpan(){
    $(str).text('x').appendTo('.igUl');
    str.addClass('DeleteListItem')
}

function addLiToList(){
    $(document.createElement('li'),{}).text($(ingrdntsInput).val()).appendTo('.igUl');
    
        $(ingrdntsInput).val(' ')
        $(ingrdntsInput).focus()
        //str.addClass('DeleteListItem')   
}

$('.adIngrdntToListBttn').on('click', function(){
    addLiToList();
    runSpan()
})

$(ingrdntsInput).keydown(function(e){
    if(e.keyCode == 13){
        addLiToList()
        e.preventDefault()
        runSpan()
    }
})


$(str).on('click', function(e){
    $(this).parent().css('color', 'red')
    $(this).parent().css('border', 'solid 1px green')
    e.preventDefault()
})