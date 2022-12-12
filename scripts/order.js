document.getElementById('addCart').addEventListener('click', addToCart)
document.getElementById('confirmOrder').addEventListener('click', confirmOrder)

let cart=[]

function addToCart(){
   let selectedBook=document.getElementById("book-select").value;
   let quantity=parseInt(document.getElementById('quantity').value)
   let text=document.getElementById(selectedBook).textContent;
   let arr = [];

   let firstSplit = text.split(',');
   for (let i = 0; i < firstSplit.length; i++) {
       let subset = firstSplit[i].split(':');
       for (let j = 1; j < subset.length; j+=1) {
           arr.push(subset[j]);
       }
   }

   order={'title':arr[0],'bookId':arr[1],'price':arr[2],'curInventory':arr[3],'amount':quantity}

   if(parseInt(order.curInventory)<quantity){
    alert('Not enough of this book in stock to support this order');
   }
   
   else{
    cart.push(order)
    displayCart()
   }
}

function displayCart(){	
    result=""
    subtotal=0
    for (let i = 0 ; i < cart.length;i++){
        result+=cart[i].title+' X '+cart[i].amount+' <br> '
        subtotal+=parseFloat(cart[i].price.split('$')[1])*cart[i].amount
    }
    result+='-----------------------<br>Subtotal: $'+subtotal+' <br>'
    document.getElementById("cart").innerHTML = 'Current cart: <br> '+ result;
}

function confirmOrder(){
    cardNumber = document.getElementById('cardNumber').value
    cardName = document.getElementById('name').value
    address = document.getElementById('address').value

    console.log(cart)
    if(cardNumber == "" || cardName == "" || address == ""){
        alert('Please enter complete payment information')
        return
    }

    let data = {
        'billingInfo' :{
            'cardNumber' : cardNumber,
            'cardName' : cardName,
            'address' : address
        },
        'cart': cart
    }


    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            alert('Order placed successfully')
        }
        if(this.readyState==4 && this.status==406){
            alert('Order incomplete. Make sure Billing info is correct.')
        }
    };

    xhttp.open("POST", "/order", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}