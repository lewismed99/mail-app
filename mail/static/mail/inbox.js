document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit',send_email)

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function viewEmail(id){
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
     // document.querySelector('#emails-view').style.display="none"
     // document.querySelector('#compose-view').style.display = 'none';
     // document.querySelector('#email-detail-view').style.display="block";


     // document.querySelector('#email-detail-view').innerHTMl='hi'


      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#email-detail-view').style.display = 'block';
    
     // document.querySelector('#email-detail-view').innerHTML='hi'
      document.querySelector('#email-detail-view').innerHTML=`<ul class="list-group">
      <li class="list-group-item active"><strong>From:</strong>${email.sender}</li>
      <li class="list-group-item active"><strong>To:</strong>${email.recipients}</li>
      <li class="list-group-item active"><strong>subject:</strong>${email.subject}</li>
      <li class="list-group-item active"><strong>Timestamp:</strong>${email.timestamp}</li>
      <li class="list-group-item active"><strong>Body:</strong>${email.body}</li>
    </ul>`
      // ... do something else with email ...

//change to read
if(!email.read){

  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}


//archive and unarchive 
  });



  console.log(id)
  
  }

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    // loop through emails and load foreach
    emails.forEach(singleEmail=>{
      console.log(singleEmail)
      const newEmail = document.createElement('div');

      newEmail.className='list-group-item'
      
      newEmail.innerHTML = `<h6>sender: ${singleEmail.sender}</h6>
      <h5>${ singleEmail.subject}</h5>
      <p>${singleEmail.timestamp}</p>`// this give us the time stamp or time email was sent subhjecvt and who sent the email
    

      //change background color on email if read to grey and whiote if unread
      console.log(singleEmail.read)

      if (singleEmail.read==true){
        newEmail.className='read'
        newEmail.style.backgroundColor="grey"
      }
      else{
        newEmail.className='unread'
        newEmail.style.backgroundColor="white"
      }

      console.log(newEmail.className)
    //  newEmail.className=singleEmail.read?'read':'unread';

      newEmail.addEventListener('click', function(){
        viewEmail(singleEmail.id)
      });
      document.querySelector('#emails-view').append(newEmail);

      //create div for each email
    })




    // ... do something else with emails ...
});
}




function send_email(event){
  event.preventDefault()
  const recipients =document.querySelector('#compose-recipients').value 
  const subject= document.querySelector('#compose-subject').value
  const body=document.querySelector('#compose-body').value
//send data to backend

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body:body
    })
  })
  .then(response => response.json())
  .then(result => {
      // loop through email asnd create div for each
      console.log(result);
      load_mailbox('sent')
  });

}

