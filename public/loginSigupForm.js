$(document).ready(() =>{


    /*
    This function opens and closes the user login and signup modal window
    */
    function openClosemodal(){
        const open = document.querySelector('[data-open]');
        const close = document.querySelectorAll('[data-close]');
        const modalVisible = 'modalVisible';

        open.addEventListener('click', function(){
            const modalId = this.dataset.open;
            document.getElementById(modalId).classList.add(modalVisible)
        })

        for(const eachButton of close){
            eachButton.addEventListener('click', () =>{
                document.getElementById('modal').classList.remove(modalVisible)
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
    This function clears the appropiate form when the reset button on the form is clicked
    */
    $('.reset').on('click', function(){
        $('.eachInput input').val('')
        $('.errMsg').css('display', 'none')
    })
    /*
    This function toggles the forms' password visiblity
    */
    $('.showHidePassIcon').on('click', function(){
        var passwordField = $('.password');
        var passAtr = passwordField.attr('type') === 'password' ? 'text' : 'password'
        passwordField.attr('type', passAtr)
        $('.showHidePassIcon img').toggle()
    })

})