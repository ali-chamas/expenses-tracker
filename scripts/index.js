

//Auth
const session = window.localStorage.getItem('session');

if(!session || session=='loggedOut'){
    window.location.assign('/pages/login.html')
}

const currenciesContainer=document.getElementById('currencies-container');
const amountsContainer=document.getElementById('amounts-container')
const financesContainer=document.getElementById('finances-container')
const loaderSection=document.getElementById('loader')
const filterBtn=document.getElementById('filter-btn');
const selectExpense=document.getElementById('select-expense')
const selectIncome=document.getElementById('select-income')
const expenseName=document.getElementById('expense-name')
const expenseAmount=document.getElementById('expense-amount')
const expenseBtn=document.getElementById('expense-adder')
const incomeName=document.getElementById('income-name')
const incomeAmount=document.getElementById('income-amount')
const incomeBtn=document.getElementById('income-adder')
const infoPopup=document.getElementById('info-popup');
const logouBtn=document.getElementById('logout-btn')


//localstorage
const user = JSON.parse(window.localStorage.getItem('session'))
const users = JSON.parse(window.localStorage.getItem('users'))




const fetchedCurrency=window.localStorage.getItem('activeCurrency')

let currencies=[];

let totalExpenses=0;
let totalIncomes=0;
let currencyBtns=[];
let finances=user.finances;
let activeCurrency={};

let editPopup={};
let confirmEdit={};

const fetchCurrencies=async()=>{

    try {
        const res = await fetch('https://dull-pink-sockeye-tie.cyclic.app/students/available');
        currencies=await res.json();
    } catch (error) {
        console.log(error);
    }

    currencies.forEach(curr=> 
        currenciesContainer.innerHTML+=`<button class="secondary-bg currency-btn">${curr.symbol}</button>`)
   
    
}





const setActiveCurrency=(btns)=>{
    activeCurrency&&
    btns.forEach(curr=>{
        if(curr.innerHTML==activeCurrency.symbol){
        curr.classList.remove('secondary-bg')
        curr.classList.add('active')
        }
        else{
        curr.classList.add('secondary-bg')
        curr.classList.remove('active')
        }
    })
}

const convertAmount=async(from,to,amount)=>{
    const data={"from":from,"to":to,"amount":amount}
    try {
        const res = await fetch('https://dull-pink-sockeye-tie.cyclic.app/students/convert',
        {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(data),
           
        })
        return await res.json();
    } catch (error) {
        console.log(error)
    }
  
}



const getTotal=async()=>{
    totalExpenses=0;
    totalIncomes=0;
   
        for(let i=0;i<finances.length;i++){
            if(finances[i].type=='expense'){
                totalExpenses+=await convertAmount(finances[i].currency,activeCurrency.code,finances[i].amount)
            }
            else{
                totalIncomes+=await convertAmount(finances[i].currency,activeCurrency.code,finances[i].amount)
            }
        }
}


const formatDouble=(num)=>{
    return (Math.round(num * 100) / 100).toFixed(2);
}

const setAmounts=()=>{
    amountsContainer.innerHTML='';
    let types=[
       {title:'expenses',amount:formatDouble(totalExpenses),icon:'<i class="fa-solid fa-arrow-trend-down"></i>'},
       {title:'incomes',amount:formatDouble(totalIncomes),icon:'<i class="fa-solid fa-arrow-trend-up"></i>'},
       {title:'balance',amount:formatDouble(totalIncomes-totalExpenses),icon:'<i class="fa-solid fa-scale-balanced"></i>'}
    ]

    types.forEach(type=>
        amountsContainer.innerHTML+=`<div class="flex column gap align-center primary-bg">
                                    <h2>${type.title} ${type.icon} </h2>
                                    <p class='${type.title=='expenses'||type.amount<=0 ?'text-red':'text-green'}'>${type.amount} ${activeCurrency.symbol}<p/>
                                </div>`
    )
    
}


const setFinances=async(array)=>{
    financesContainer.innerHTML='';
    for(let i=0;i<array.length;i++){
            financesContainer.innerHTML+=` <div class="w-full flex justify-between align-center single-finance" onClick='openInfo(${array[i].id})'>
                                            <div class="flex gap align-center">
                                                <p>${array[i].name}</p>
                                                <small>${array[i].date}</small>
                                            </div>

                                            <div class="flex gap align-center ${array[i].type=='expense'?'text-red':'text-green'}">
                                                <p>${formatDouble(await convertAmount(array[i].currency,activeCurrency.code,array[i].amount))}<span>${activeCurrency.symbol}</span></p> 
                                                ${array[i].type=='expense'?'<i class="fa-solid fa-arrow-trend-down"></i>':'<i class="fa-solid fa-arrow-trend-up"></i>'}</i>
                                            </div>
                                            
                                        </div>`
    }
}

const loader=()=>{
    loaderSection.classList.toggle('flex')
}

const setAllAmounts=async()=>{
    
    setActiveCurrency(currencyBtns)
    await getTotal();
    setAmounts();
    await setFinances(finances);
    
}

const changeActiveCurrency=async(symbol)=>{
    loader()
    currencies.forEach(curr=>{
        if(curr.symbol==symbol)
        activeCurrency=curr;
    })
    window.localStorage.setItem('activeCurrency',JSON.stringify(activeCurrency))
    await setAllAmounts()
    loader()
}

const filterFinances=async(value)=>{
    loader()
    let filteredFinances=[]
    if(value=='expenses'){
        filteredFinances=finances.filter((finance)=>
            finance.type=='expense'
        )
        
    }else if(value=='incomes'){
        filteredFinances=finances.filter((finance)=>
            finance.type=='income'
        )
    }else{
        filteredFinances=finances;
    }

    await setFinances(filteredFinances)
    
    loader()
}



//forms

const fillCurrencies=()=>{

    currencies.forEach(curr=>{
        selectExpense.innerHTML+=`<option value="${curr.code}">
                                        ${curr.code}
                                   </option>`
        selectIncome.innerHTML+=`<option value="${curr.code}">
                                        ${curr.code}
                                   </option>`
        
    })
    
}

let expense={
    id:Math.floor(Math.random()*9999999),
    name:'',
    amount:0,
    currency:'USD',
    type:'expense',
    date:new Date().toLocaleDateString()
}

let income={
    id:Math.floor(Math.random()*9999999),
    name:'',
    amount:0,
    currency:'USD',
    type:'income',
    date:new Date().toLocaleDateString()
}

const formAdders=()=>{
    
    

    expenseName.addEventListener('change',(e)=>expense.name=e.target.value);
    expenseAmount.addEventListener('change',(e)=>expense.amount=e.target.value);
    incomeName.addEventListener('change',(e)=>income.name=e.target.value);
    incomeAmount.addEventListener('change',(e)=>income.amount=e.target.value);
    selectExpense.addEventListener('change',(e)=>expense.currency=e.target.value)
    selectIncome.addEventListener('change',(e)=>income.currency=e.target.value)


    expenseBtn.addEventListener('click',()=>addFinance(expense))
    incomeBtn.addEventListener('click',()=>addFinance(income))

    
    
}

const addFinance=(finance)=>{

    finances.push(finance);
    user.finances=finances;
    window.localStorage.setItem('session',JSON.stringify(user))

    users.map(u=>{
        if(u.username==user.username)
        u.finances=user.finances;
    })
   
    window.localStorage.setItem('users',JSON.stringify(users));
    resetFinances()
    setAllAmounts()
}

const resetFinances=()=>{
    expense={
        id:Math.floor(Math.random()*9999999),
        name:'',
        amount:0,
        currency:'USD',
        type:'expense',
        date:new Date().toLocaleDateString()}
    
    income={
        id:Math.floor(Math.random()*9999999),
        name:'',
        amount:0,
        currency:'USD',
        type:'income',
        date:new Date().toLocaleDateString()
    }
}


const openInfo=async(id)=>{
    let newName='';
    let newAmount=0;
    let newCurrency='USD';
    let finance={};
    finances.forEach(fin=>{
        if(fin.id==id)
            finance=fin;
    })
    infoPopup.innerHTML=`<div class="info-popup flex column center">
                <div class="flex gap align-center">
                    <div class="flex column gap">
                        <h2>${finance.name}</h2>
                        <small>${finance.date}</small>
                    </div>
                    <p>${formatDouble(await convertAmount(finance.currency,activeCurrency.code,finance.amount))}<span>${activeCurrency.symbol}</span></p>
                </div>
                <div class="flex gap">
                    <button class="btn-style bg-secondary"  onClick='openEditPopup()'>Edit <i class="fa-solid fa-pen"></i></button>
                    <button class="btn-style bg-danger text-white" onClick='deleteFinance(${finance.id})'>Delete <i class="fa-solid fa-trash" ></i></button>
                </div>
            
                <button type="button" class="exit-form text-red" id='exit-btn' ><i class="fa-solid fa-x"  ></i></button>
                <form class=" column gap editor-popup" id="edit-popup">
                    <input type="text" placeholder="new name" id="new-name">
                    <input type="number" placeholder="new amount" id="new-amount">
                    <select  id="select-edit">
                
                    </select>
                    <button type="button" class="btn-style active" id="confirm-edit">confirm</button>
                </form>

            </div>`
   
     const exitBtn=document.getElementById('exit-btn');
     
     editPopup=document.getElementById('edit-popup');
     const confirmEdit=document.getElementById('confirm-edit');
     const editName=document.getElementById('new-name');
     const editAmount=document.getElementById('new-amount');
     const editCurrency=document.getElementById('select-edit');

     //fill currencies in select
     currencies.forEach(curr=>{
        editCurrency.innerHTML+=`<option value='${curr.code}'>${curr.code}</option>`
     })


     editName.addEventListener('change',(e)=>newName=e.target.value);
     editAmount.addEventListener('change',(e)=>newAmount=e.target.value);
     editCurrency.addEventListener('change',(e)=>newCurrency=e.target.value);
     confirmEdit.addEventListener('click',()=>editFinance(finance.id,newName,newAmount,newCurrency))
     
     exitBtn.addEventListener('click',closePopup);   
     infoPopup.classList.add('flex');

}



const closePopup=()=>{
    infoPopup.classList.remove('flex')
}

const deleteFinance=async(id)=>{
    loader()
    finances=finances.filter(fin=>fin.id!=id);
    user.finances=finances;
    window.localStorage.setItem('session',JSON.stringify(user))

    users.map(u=>{
        if(u.username==user.username)
        u.finances=user.finances;
    })
    window.localStorage.setItem('users',JSON.stringify(users))

    infoPopup.classList.remove('flex')
    await setAllAmounts()
    loader()
}

const openEditPopup=()=>{
    editPopup.classList.toggle('flex')
}

const editFinance=async(id,name,amount,currency)=>{
    loader()
    finances.map(fin=>{
        if(fin.id==id){
            fin.name=name;
            fin.amount=amount;
            fin.currency=currency;
        }
    })
    user.finances=finances
    window.localStorage.setItem('session',JSON.stringify(user));
    users.map(u=>{
        if(u.username==user.username)
        u.finances=user.finances;
    })
    window.localStorage.setItem('users',JSON.stringify(users));
    await setAllAmounts()
    loader()
}

const logout=()=>{
    window.localStorage.setItem('session','loggedOut');
    window.location.assign('/')
}


const app=async()=>{

    loader()
        //do all the fetching before the loader ends
        await fetchCurrencies();
        
        if(!fetchedCurrency){
            if(currencies.length>0)
                window.localStorage.setItem('activeCurrency',JSON.stringify(currencies[0]));
            else
            window.localStorage.setItem('activeCurrency',JSON.stringify({code:'USD',symbol:'$'}));
            
        }

        
        activeCurrency=JSON.parse(window.localStorage.getItem('activeCurrency'));
        logouBtn.addEventListener('click',logout)
        currencyBtns=document.querySelectorAll('.currency-btn')
        await setAllAmounts();
        currencyBtns.forEach((btn)=>{
            btn.addEventListener('click',async()=>await changeActiveCurrency(btn.innerHTML))
        })
        filterBtn.addEventListener('change',async(e)=>{
            await filterFinances(e.target.value)
        })

        const username = document.getElementById('username');
        username.innerHTML=user.username
        fillCurrencies()
        formAdders()
        
       

    loader()
    

}

app()

