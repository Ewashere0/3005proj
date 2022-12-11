document.getElementById('login').addEventListener('click', loginUser)

function loginUser(){
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    let user = {'username': username, 
                'password': password, 
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/users/'+username);
            alert('Successful login')
            return;
        }
        else if (this.readyState==4 && this.status==404){
            alert('Invalid username/password');
            return;
        }
    };
    xhttp.open("POST", "/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(user));
}
