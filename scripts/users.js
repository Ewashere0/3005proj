document.getElementById('addInfo').addEventListener('click', addInfo)

function addInfo(){
    let name = document.getElementById('name').value
    let cardNum = document.getElementById('cardNum').value
    let address = document.getElementById('address').value

    let data = {'name': name, 
                'cardNum': cardNum, 
                'address': address
    }
    console.log(data)

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/');
            alert('Information added!')
            return;
        }
        if(this.readyState==4 && this.status==418){
            alert('Username already taken');
            return;
        }
    };
    xhttp.open("PUT", "/users", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}
