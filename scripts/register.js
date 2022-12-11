document.getElementById('register').addEventListener('click', register)

function register(){
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let type = document.querySelector('input[name="accountType"]:checked').value

    let data = {'username': username, 
                'password': password, 
                'type': type
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/');
            alert('Account created!')
            return;
        }
        if(this.readyState==4 && this.status==418){
            alert('Username already taken');
            return;
        }
    };
    xhttp.open("PUT", "/registration", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

