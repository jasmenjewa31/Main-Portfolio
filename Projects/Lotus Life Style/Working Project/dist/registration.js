const registrationDialog=document.querySelector('.registration-dialog');
const registrationForm=registrationDialog.querySelector('form');
const registrationStatus=document.querySelector('#registration-status');
const registrationSubmit=registrationForm.querySelector('.registration-submit');
let registrationTrigger;
document.querySelectorAll('[data-register]').forEach(button=>button.addEventListener('click',()=>{registrationTrigger=button;registrationDialog.showModal();document.body.classList.add('registration-open')}));
registrationDialog.querySelector('.registration-close').addEventListener('click',()=>registrationDialog.close());
registrationDialog.addEventListener('close',()=>{document.body.classList.remove('registration-open');registrationTrigger?.focus()});
registrationForm.addEventListener('submit',async event=>{
 event.preventDefault();if(!registrationForm.reportValidity())return;
 registrationSubmit.disabled=true;registrationSubmit.textContent='Saving your registration…';
 const fields=new FormData(registrationForm);
 try{
  const response=await fetch('/api/registrations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:fields.get('name'),email:fields.get('email'),interest:fields.get('interest'),consent:fields.get('consent')==='on'})});
  const data=await response.json().catch(()=>null);
  if(!response.ok||!data?.ok)throw new Error(data?.error||'Registration is unavailable here. Please try again from the local Lotus preview.');
  registrationForm.reset();registrationForm.querySelector('.registration-fields').hidden=true;registrationSubmit.hidden=true;
  registrationStatus.classList.add('registration-success');registrationStatus.textContent='You’re on the list. Your interest in the 20% membership offer has been saved. No payment has been taken and your membership is not yet active.';registrationStatus.focus();
 }catch(error){registrationStatus.textContent=error.message;registrationSubmit.disabled=false;registrationSubmit.textContent='Register for 20% off';registrationStatus.focus()}
});

