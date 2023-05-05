const debug = false;
//alert("JavaScript подлючен!");
const addBook = document.getElementById('addBook');
if(debug) console.log("addBook = "+addBook.innerHTML);
//JavaScript Object
const createBookData = {
    'bookName':'',
    'publishedYear':'',
    'quantity':'',
    'authorId':'',
    'coverId':''
};
if(debug) console.log("addBook = "+addBook.innerHTML);
addBook.addEventListener('click',e=>{
    if(debug)console.log("Кнопка работает.");
    const bookName = document.getElementById('bookName');
    if(debug)console.log("bookName="+bookName.value);
    createBookData.bookName = bookName.value;
    bookName.value='';
    const publishedYear = document.getElementById('published-year');
    if(debug)console.log("publishedYear="+publishedYear.value);
    createBookData.publishedYear=publishedYear.value;
    publishedYear.value='';
    const quantity = document.getElementById('quantity');
    if(debug)console.log("quantity="+quantity.value);
    createBookData.quantity=quantity.value;
    quantity.value='';
    const authorsSelect = document.getElementById('authors_select');
    if(debug)console.log("authorsSelect="+authorsSelect.value);
    createBookData.authorId=authorsSelect.value;
    authorsSelect.value='';
    const coversSelect = document.getElementById('covers_select');
    if(debug)console.log("coversSelect="+coversSelect.value);
    createBookData.coverId=coversSelect.value;
    coversSelect.value='';
    //Вывод объекта js, преобразованного в JSON формат (строку)
    console.log(JSON.stringify(createBookData));
    createBookToDB(createBookData);
});
async function createBookToDB(createBookData){
    console.log('createBookToDB запущена');
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(createBookData)
    };
    
    await fetch('createBook',requestOptions)
            .then(response => response.json())
            .then(response => console.log(response.info))
            .catch(error => console.log('Произошла ошибка: '+error));
}