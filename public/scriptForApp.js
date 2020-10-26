function toRunFromApp(){
    $(this).parent().addClass('active')
    $(this).parent().siblings().removeClass('active')

    var href = $(this).attr('href')
    $('.formWrapper').hide()
    $(href).fadeIn(500)
}

//module.exports = toRunFromApp()

