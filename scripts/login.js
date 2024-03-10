
//Auth
const session = window.localStorage.getItem('session');

if(!session || session=='loggedOut'){

}else{
    window.location.assign('/')
}



const loginForm=document.getElementById('login-form');
const signupForm=document.getElementById('signup-form');
const loginSwitch=document.getElementById('login-switch');
const signupSwitch=document.getElementById('signup-switch');

const users = window.localStorage.getItem('users');
const usernameLoginInput=document.getElementById('username-login');
const passwordLoginInput=document.getElementById('pass-login');
const nameSignupInput=document.getElementById('name-signup');
const usernameSignupInput=document.getElementById('username-signup');
const passwordSignupInput=document.getElementById('pass-signup');
const loginBtn=document.getElementById('login-btn');
const signupBtn=document.getElementById('signup-btn');
const loginError=document.getElementById('login-error');
const signupError=document.getElementById('signup-error');



if(!users){
    window.localStorage.setItem('users',JSON.stringify([]))
}

let allUsers=JSON.parse(users);

if(!session || session=='loggedOut'){

}else{
    window.location.assign('/')
}

let newUser={
    name:'',
    username:'',
    password:'',
    finances:[]
}

let oldUser={
    username:'',
    password:''
}


signupForm.style.display='none';

signupSwitch.addEventListener('click',()=>{
    loginForm.style.display='none';
    signupForm.style.display='flex';
    resetInputs();
    resetErrors()
})
loginSwitch.addEventListener('click',()=>{
    loginForm.style.display='flex';
    signupForm.style.display='none';
    resetInputs();
    resetErrors()
})





const resetOldUser=()=>{
    oldUser={
        username:'',
        password:''
    }
}
const resetNewUser=()=>{
    newUser={
        name:'',
        username:'',
        password:'',
        finances:[]
    }
}

const resetInputs=()=>{
    usernameLoginInput.value='';
    usernameSignupInput.value='';
    passwordLoginInput.value='';
    passwordSignupInput.value='';
    nameSignupInput.value='';
}

const checkEmptyInputs=(type)=>{
    if(type=='login'){
        if(oldUser.username=='' || oldUser.password==''){
            return true
        }
    }else if(type=='signup'){
        if(newUser.username=='' || newUser.name==''||newUser.password==''){
            return true
        }
    }
    return false;
}

const signUp=()=>{
    
    if(checkEmptyInputs('signup')){
        displaySignupError('please fil empty fields')
    }else{
        allUsers.push(newUser)
        window.localStorage.setItem('session',JSON.stringify(newUser));
        window.localStorage.setItem('users',JSON.stringify(allUsers));
        window.location.assign('/')
    }
}


const login=()=>{

    if(checkEmptyInputs('login')){
        displayLoginError('please fill empty fields');
    }else{

    let error=false;

    for(let i=0;i<allUsers.length;i++){
        if(oldUser.username.toLowerCase()==allUsers[i].username.toLowerCase() || oldUser.password===allUsers[i].password){
            window.localStorage.setItem('session',JSON.stringify(allUsers[i]));
            window.location.assign('/');
            break;
        }
        else{
            error=true;
        }
    }
    
  
        resetOldUser()
        resetInputs()
        displayLoginError('wrong email or password')
}
    
    
  
}

const displayLoginError=(message)=>{
    loginError.innerHTML=message;
}

const displaySignupError=(message)=>{
    signupError.innerHTML=message;
}

const resetErrors=()=>{
    loginError.innerHTML='';
    signupError.innerHTML='';
}

usernameLoginInput.addEventListener('change',(e)=>{
    oldUser.username=e.target.value;
})

passwordLoginInput.addEventListener('change',(e)=>{
    oldUser.password=e.target.value;
})

nameSignupInput.addEventListener('change',(e)=>{
    newUser.name=e.target.value;
})

usernameSignupInput.addEventListener('change',(e)=>{
    newUser.username=e.target.value;
})

passwordSignupInput.addEventListener('change',(e)=>{
    newUser.password=e.target.value;
})




loginBtn.addEventListener('click',login)
signupBtn.addEventListener('click',signUp)