$('#nav').load('header.html')

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
var recipeBook = $('#recipeBook');

    


$(recipeBook).on('click', function(){
   $(this).addClass('bookOpened');
   $('.cover').addClass('openRecipeBook')
   //$(this).css('left', '50%')
  

});
 if($(this).hasClass('.bookOpened')){
        console.log('has');
        
     }else{
         console.log('gdfd');
         
     }
$('#closeRecipe').on('click', function(){

    if($('.cover').hasClass('.bookOpened')){
        console.log('has');
        
     }else{
         console.log('no');
         
     }

    $('.cover').addClass('closeRecipeBook');
 
    $(recipeBook).addClass('bookClosed')
    //$(recipeBook).css('left', '0%')
    console.log(1234);
    
})




$('.buttonForClosing').on('click', function(){
    //$('.cover').fadeOut()
    $('.wrapperForThatDiv').toggleClass('rotated')
    //$('.cover').css('color', 'red')
})