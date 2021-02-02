$(document).ready(() =>{

    /*
        This function opens and closes the user login and signup modal
        window when the button on the home page or link on the navbar is clicked
    */
    function openClosemodal(){
        const open = $('[data-open]');
        const close = $('[data-close]');
        const modalVisible = 'modalVisible';

        open.on('click', function(){
            const modalId = this.dataset.open;
            $('#' + modalId).addClass(modalVisible)
            $('#indexPage').css('position', 'fixed')
            $('#indexPage').css('width', '100%')
            
        })

        for(const eachButton of close){
            eachButton.addEventListener('click', () =>{
                $('#modal').removeClass(modalVisible)
            })
        }
    }
    openClosemodal()

    /*
        This function allows you to switch between both the login and signup form in the modal window.
        It will display the appropiate form acording to what you specify
    */

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


    /*
        This function clears the appropiate form on login or signup when the reset button on the form is clicked
    */
    $('.reset').on('click', function(){
        $('.eachInput input').val('')
        $('.errMsg').css('display', 'none')
    })


    /*
        This function toggles the login and signup forms' password visiblity
    */
   $('.showHidePassIcon').on('click', function(){
        var passwordField = $(this).siblings()
        var passAtr = passwordField.attr('type') === 'password' ? 'text' : 'password'
        passwordField.attr('type', passAtr)
        $('.showHidePassIcon img').toggle()
    })

})