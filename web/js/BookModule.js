import {coverModule} from './CoverModule.js';
class BookModule{
    async printCreateBook(){
        // const add_book = document.getElementById('add_book');
         document.getElementById('content').innerHTML=
                 //add_book;
             `<h3 class="w-100 mt-5 d-flex justify-content-center">Новая книга</h3>
             <div class="w-100 d-flex justify-content-center p-5">
                 <div class="card" style="width: 40rem;">
                     <div class="card-body">
                         <p class="w-100 d-flex justify-content-center p-5"><a id="addCover" href="#">Добавить обложку для книги</a></p>
                         <form method="POST" action="createBook">
                           <div class="mb-3 row">
                             <label for="bookName" class="col-sm-5 col-form-label">Название книги:</label>
                             <div class="col-sm-7">
                               <input type="text" class="form-control" id="bookName" name="name" value="">
                             </div>
                           </div>
                           <div class="mb-3 row">
                             <label for="published-year" class="col-sm-5 col-form-label">Год издания книги:</label>
                             <div class="col-sm-7">
                               <input type="text" class="form-control" id="publishedYear" name="publishedYear" value="">
                             </div>
                           </div>
                           <div class="mb-3 row">
                             <label for="quantity" class="col-sm-5 col-form-label">Количество экземпляров книги:</label>
                             <div class="col-sm-7">
                               <input type="text" class="form-control" id="quantity" name="quantity" value="">
                             </div>
                           </div>
                           <div class="mb-3 row">
                             <label for="authorId" class="col-sm-5 col-form-label">Список авторов:</label>
                             <div class="col-sm-7">
                                 <select name="authors" id="authorId" class="form-select" multiple>
                                     <option value="1">Лев Толстой</option>
                                     <option value="2">Иван Тургенев</option>
                                 </select>
                             </div>
                           </div>
                           <div class="mb-3 row">
                             <label for="coverId" class="col-sm-5 col-form-label justify-content-md-end">Обложки:</label>
                             <div class="col-sm-7">
                                 <select name="coverId" id="coverId" class="form-select">
                                 </select>
                             </div>
                           </div>
                           <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                               <button type="button" class="btn btn-primary me-md-2" id="addBook">Добавить</button>
                           </div>
                         </form>
                     </div>
                 </div>
             </div>
         `;
         await fetch('getListCovers',{
             method:'GET',
             headers: {'Content-Type':'application/json'}
         })
             .then(listCovers=>listCovers.json())
             .then(listCovers => {
                 let coverSelect = document.getElementById('coverId');
                 for(let i=0;i<listCovers.length;i++){
                     const cover = listCovers[i];
                     let option = document.createElement("option");
                     option.text=cover.description;
                     option.value = cover.id;
                     coverSelect.appendChild(option);
                 };
             })
             .catch(error=>{
                 document.getElementById('info').innerHTML="Ошибка чтения списка обложек";
             });
         const addBook = document.getElementById('addBook');
         addBook.addEventListener('click',e=>{
             const createBookObject = {
                 'bookName': document.getElementById('bookName').value,
                 'publishedYear': document.getElementById('publishedYear').value,
                 'quantity': document.getElementById('quantity').value,
                 'authorId': document.getElementById('authorId').value,
                 'coverId': document.getElementById('coverId').value
             };
             bookModule.cretateNewBook(createBookObject);
         });
         const addCover = document.getElementById('addCover');
         addCover.addEventListener('click',e=>{
             coverModule.printFormAddCover();
         });
    };
    async printListBooks(){
       document.getElementById('content').innerHTML=
               `<h3 class="w-100 mt-5 d-flex justify-content-center">Список книг</h3>
                   <div id="box_listBooks" class="w-100 d-flex justify-content-center p-5">
                   </div>`;
       await fetch('listBooks',{
           method: 'GET',
           headers: {'Content-Type': 'application/json'}
       })
               .then(listBooks=>listBooks.json())//преобразовываем полученную строку в которой
       //записан json-массив с книгами в js-массив
               .then(listBooks => {
                   let boxListBooks = document.getElementById('box_listBooks');//сюда будем вставлять карты с книгами
                   for(let i=0;i<listBooks.length;i++){
                       const book = listBooks[i];//получаем книгу из массива и вставляем из нее данные в html с помощью {{...}}
                       let cart = `<div class="card " style="width: 18rem">
                                       <a href="book?id=${book.id}">
                                           <img src="insertFile/${book.cover.url}" class="card-img-top image-size" alt="...">
                                       </a>
                                   </div>`;

                       boxListBooks.insertAdjacentHTML("beforeend", cart);
                   }
               })
               .catch(error => "error: "+error);
    }
    async cretateNewBook(createBookObject){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(createBookObject)
        };
        await fetch('createBook',requestOptions)
                .then(response => response.json())
                .then(response => {
                    document.getElementById('info').innerHTML=response.info;
                })
                .catch(error=>console.log('error: '+error));
    }
}
const bookModule = new BookModule();
export {bookModule};