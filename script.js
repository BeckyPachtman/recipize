$('#nav').load('header.html')

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