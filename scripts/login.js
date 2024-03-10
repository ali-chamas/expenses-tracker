const loginForm=document.getElementById('login-form');
const signupForm=document.getElementById('signup-form');
const loginSwitch=document.getElementById('login-switch');
const signupSwitch=document.getElementById('signup-switch');
const session = window.localStorage.getItem('session');
const users = window.localStorage.getItem('users');

if(!users){
    window.localStorage.setItem('users',JSON.stringify([]))
}

let allUsers=JSON.parse(users);

let newUser={
    name:'',
    username:'',
    password:'',
    finances:[]
}




signupForm.style.display='none';

signupSwitch.addEventListener('click',()=>{
    loginForm.style.display='none';
    signupForm.style.display='flex';
})
loginSwitch.addEventListener('click',()=>{
    loginForm.style.display='flex';
    signupForm.style.display='none';
})