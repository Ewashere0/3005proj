document.getElementById('addBook').addEventListener('click', addBook)

function addBook(){
    let ISBN = document.getElementById('ISBN').value
    let title = document.getElementById('title').value
    let genre = document.getElementById('genre').value
    let author = document.getElementById('author').value
    let publisher = document.getElementById('publisher').value
    let pageNum = document.getElementById('pageNum').value
    let price = document.getElementById('price').value
    let year = document.getElementById('year').value

    let data = {
        'ISBN': ISBN, 
        'title': title, 
        'genre': genre,
        'author':author,
        'publisher':publisher,
        'pageNum':pageNum,
        'price':price,
        'year':year
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            window.location.replace('/');
            return;
        }
    };
    xhttp.open("POST", "/addBook", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}
