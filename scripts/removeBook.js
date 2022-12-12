document.getElementById('remove').addEventListener('click', removeBook)

function removeBook(){
    let ISBN = document.getElementById('ISBN').value

    let data = {
        'ISBN': ISBN, 
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/');
            alert('Book remove!')
            return;
        }
        if(this.readyState==4 && this.status==404){
            alert('No such book!')
            return;
        }
    };
    xhttp.open("DELETE", "/books/remove", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}
