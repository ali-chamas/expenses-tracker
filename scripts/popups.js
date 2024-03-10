const openExpense=document.getElementById('open-expense');
const openIncome=document.getElementById('open-income');
const expensePopup=document.getElementById('expense-popup')
const incomePopup=document.getElementById('income-popup')
const financeInfo=document.getElementById('info-popup')
const exitBtn=document.querySelectorAll('.exit-form')








openExpense.addEventListener('click',()=>{expensePopup.classList.add('flex')});
openIncome.addEventListener('click',()=>{incomePopup.classList.add('flex')});


exitBtn.forEach(btn=>{
    btn.addEventListener('click',()=>{btn.parentElement.parentElement.classList.toggle('flex')})

})
