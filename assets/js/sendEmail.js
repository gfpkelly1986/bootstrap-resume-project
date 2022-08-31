// Function to send mail not working, check docs and re-do when time!
function sendMail(contactForm) {
    emailjs.send("service_z74targ","template_uvnrt79",{
        from_name: contactForm.name.value,
        to_name: contactForm.emailaddress.value,
        message: `Sending an email using the EmailJS API!!`,
        project_request: contactForm.projectsummary.value
    })
    .then(
        function() {
            console.log('Success', response);
        },
        function(error) {
            console.log('Failed', error);
        });
    
}