const reuse1 = `<style>.forms .formWrapper:nth-child(3){display: flex;}</style>`
const reuse2 = `<script> document.getElementById('SignUpBtnWrpr').classList.add('active')</script>`
const reuse3 = `<script> document.getElementById('signUpErr').innerHTML = "";</script>`
const reuse4 = `<script> document.getElementById('loginBtnWrpr').classList.remove('active');
                document.getElementById('loginErr').innerHTML = ""; </script>`

const loginReAttempt = `<script>document.getElementById('loginErr').innerHTML = "<strong class='errMsg'>Already logged in</strong>"; </script>
<style> .signUpButton{pointer-events: none} #SignUpBtnWrpr:hover{cursor:not-allowed;}</style>
<script> var allElem = document.querySelectorAll('.eachInput input');        
for(var i = 0; i < allElem.length; i += 1){allElem[i].disabled = true};
document.getElementById('closeModalForm').style.display = 'block';
document.getElementById('closeModal').style.display = 'none';
</script>`

const closeModal = `<script>document.getElementById('modal').classList.remove('modalVisible')</script>`;

const removeLoginBttn = `<style>.loginPropmtButtonWrrpr{display:none}.mainPageRecDisply{display:block}</style>`;

const showGalleryBttn = `<style>.mainPageRecDisply{display:block}</style>`;

const emailFieldEmpty = `<style> .modal{opacity: 1; visibility: visible;}
.forms .formWrapper:nth-child(2){display: none;}</style>
<strong class="errMsg">Please fill in all fields</strong>`

const SignupUserExists = `<style> .modal{opacity: 1; visibility: visible;}
.forms .formWrapper:nth-child(2){display: none;}</style>
<strong class="errMsg">This user already exists, log in or choose a different email</strong>`

const loginUserNotFound = `<style> .modal{opacity: 1; visibility: visible;} </style>
<strong class="errMsg">Email is not found, please try again</strong>`

const wrongPassword = `<style> .modal{ opacity: 1;visibility: visible;}</style>
<strong class="errMsg">Password incorrect, please try again</strong>`

const recFieldEmpty = `<strong>Please fill in all fields</strong>
<style>.msg{padding: .4em .7em}</style>`

const notRecAuthor = `<span>Only the author of this recipe can edit this recipe</span>
<style>.authorMsg{padding: .4em .7em}</style>`

const userLoginAfterSignup = `<style> .modal{opacity: 1; visibility: visible;}
.errMsg{color: green; background: #1997002a;}
.forms .formWrapper:nth-child(3){display: none;}</style>
<strong class="errMsg">Signup successfull, please log in</strong>
<script> document.getElementById('loginBtnWrpr').classList.add('active')
document.getElementById('SignUpBtnWrpr').classList.remove('active') </script>`

const fieldEmpty = emailFieldEmpty + reuse1 + reuse2 + reuse4;
const userExists = SignupUserExists + reuse1 + reuse2 + reuse4;
const loginAfterSignup = userLoginAfterSignup + reuse3;
const userNotFound = loginUserNotFound + reuse3;
const password = wrongPassword + reuse3;

module.exports = {loginReAttempt, closeModal, removeLoginBttn, showGalleryBttn, loginAfterSignup, fieldEmpty, userExists, userNotFound, password, recFieldEmpty, notRecAuthor};