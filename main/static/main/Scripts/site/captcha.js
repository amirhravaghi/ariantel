$("document").ready(()=>{
    let captcha;
    let alphabets = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
    captchaGenerate = () => {
        let first = alphabets[Math.floor(Math.random() * alphabets.length)];
        let second = Math.floor(Math.random() * 10);
        let third = Math.floor(Math.random() * 10);
        let fourth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let fifth = alphabets[Math.floor(Math.random() * alphabets.length)];
        let sixth = Math.floor(Math.random() * 10);
        captcha = first.toString()+second.toString()+third.toString()+fourth.toString()+fifth.toString()+sixth.toString();
        document.getElementById('generated-captcha').value = captcha;
        document.getElementById("entered-captcha").value = '';
    }
    
    captchaCheck = () => {
        let userValue = document.getElementById("entered-captcha").value;
        captcha = document.getElementById("generated-captcha").value;
        if(userValue == captcha){
            return true;
        }else{
            document.getElementById("entered-captcha").value = '';
            return false;
        }
    }
});
