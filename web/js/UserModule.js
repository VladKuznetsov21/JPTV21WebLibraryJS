class UserModule{
    printFormNewUser(){
        document.getElementById('content').innerHTML= 
`       <h1 class="w-100 d-flex justify-content-center">Новый читатель:</h1>
         <div class="w-100 d-flex justify-content-center my-3">
             <div class="card border-0" style="width: 35rem;">
                 <div class="card-body">
                     <form id="userForm" method="POST">
                         <div class="mb-2 row">
                             <label for="firstName" class="col-sm-3 col-form-label">Имя:</label>
                             <div class="col-sm-9">
                               <input type="text" class="form-control" id="firstName" name="firstname">
                             </div>
                         </div>
                         <div class="mb-2 row">
                             <label for="lastName" class="col-sm-3 col-form-label">Фамилия:</label>
                             <div class="col-sm-9">
                               <input type="text" class="form-control" id="lastName" name="lastname">
                             </div>
                         </div>
                         <div class="mb-2 row">
                             <label for="phone" class="col-sm-3 col-form-label">Телефон:</label>
                             <div class="col-sm-9">
                               <input type="text" class="form-control" id="phone" name="phone">
                             </div>
                         </div>
                         <div class="mb-2 row">
                             <label for="login" class="col-sm-3 col-form-label">Логин:</label>
                             <div class="col-sm-9">
                               <input type="text" class="form-control" id="login" name="login">
                             </div>
                         </div>
                         <div class="mb-2 row">
                             <label for="password" class="col-sm-3 col-form-label">Пароль:</label>
                             <div class="col-sm-9">
                               <input type="password" class="form-control" id="password" name="password">
                             </div>
                         </div>
                         <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                             <input id="btnAddUser" type="button" class="btn btn-primary me-md-2" value="Добавить">
                         </div>
                     </form>
                 </div>
             </div>
         </div>`;
        document.getElementById("btnAddUser").addEventListener('click',e=>{
            
            userModule.sendUserRegistration();
        });
    }
    async sendUserRegistration(){
        const userForm = {
            "firstname": document.getElementById('firstName').value,
            "lastname": document.getElementById('lastName').value,
            "phone": document.getElementById('phone').value,
            "login": document.getElementById('login').value,
            "password": document.getElementById('password').value,
        }
        
        console.log(JSON.stringify(userForm));
       
         console.log(JSON.stringify(userForm));
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userForm)
        };
        await fetch('userRegistration',requestOptions)
                .then(response => response.json())
                .then(response => {
                    document.getElementById('info').innerHTML= response.info;
                })
                .catch(error => console.log('Ошибка сервера: '+error))
    }
    async printListUsers(){
       await fetch('listUsers',{
           method: 'GET',
           credentials: 'include',
           headers: {'Content-Type': 'application/json'}
       })
               .then(response=>response.json())
               .then(response => {
                    //console.log(JSON.stringify(response));
                    let content = document.getElementById('content');
                    content.innerHTML = '';
                    let html = `
                    <h3 class="w-100 mt-5 d-flex justify-content-center">Список пользователей</h3>
                    <div id="box_listUsers" class="w-100 d-flex justify-content-center p-5">

                    </div>`;
                    content.insertAdjacentHTML("beforeend", html);
                    let table = document.createElement('table');
                    table.setAttribute('class','table w-50');
                    let headers = ["№", "Пользователь", "Читает книги"];
                    let thead = table.createTHead();
                    let row = thead.insertRow();
                    for(let i = 0; i < headers.length;i++){
                        let th = document.createElement("th");
                        th.setAttribute('class','text-start');
                        let text = document.createTextNode(headers[i]);
                        th.appendChild(text);
                        row.appendChild(th);
                    }
                    let tbody = table.createTBody();
                    for(let i = 0;i< response.length;i++){
                        let entry = response[i];
                        let tr = tbody.insertRow();
                        let td1 = tr.insertCell();
                        td1.innerHTML = i+1;
                        let td2 = tr.insertCell();
                        td2.innerHTML = entry.key.firstname+' '+entry.key.lastname+ '. Логин: '+entry.key.login;
                        let td3 = tr.insertCell();
                        td3.innerHTML = '';
                        for(let j = 0;j< entry.value.length;j++){
                            let book = entry.value[j];
                            tr = tbody.insertRow();
                            td1 = tr.insertCell();
                            td1.innerHTML = '';
                            let td2 = tr.insertCell();
                            td2.innerHTML = '';
                            let td3 = tr.insertCell();
                            let a = document.createElement('a');
                            a.setAttribute('class','btn btn-outline-dark w-100 border-0 bg-white text-primary text-start');
                            a.innerHTML=book.bookName;
                            td3.appendChild(a);
                            a.addEventListener('click',e=>{
                                bookModule.printBook(book.id);
                            })
                        }
                    };
                    let box_listUsers = document.getElementById('box_listUsers');
                    box_listUsers.appendChild(table);
                        
                })
               .catch(error => "error: "+error);
    }
    printFormTakeOnBook(){
        document.getElementById('content').innerHTML = 
        `<h1 class="w-100 d-flex justify-content-center">Выдача книги</h1>
            <div class="w-100 d-flex justify-content-center">
                <div class="card border-0" style="width: 25rem;">
                  <div class="card-body">
                    <h3 class="card-title w-100 my-3">Список книг</h3>
                    <form action="" method="POST">
                        <p class="card-text w-100">
                            <select id="selectBooks" name="bookId" class="w-100">
                                <option selected disabled>Выберите книгу</option>
                                
                            </select>
                        </p>
                        <p class="card-text w-100 d-flex justify-content-end">
                            <input id="btnTakeOnBook" type="submit" value="Выдать книгу">
                        </p>
                    </form>

                  </div>
                </div>
            </div>`;
        fetch('listBooks', {
           method: 'GET',
           credentials: 'include',
           headers: {'Content-Type': 'application/json'}
        })
                .then(response => response.json())
                .then(response => {
                    let selectBooks = document.getElementById('selectBooks');
                    for(let i = 0; i < response.length; i++){
                        let option = document.createElement('option');
                        option.text = response[i].bookName+'. '+response[i].publishedYear;
                        option.value = response[i].id;
                        selectBooks.appendChild(option);
                    }
                })
                .catch(error => console.log('Ошибка сервера: '+error));
        const btnTakeOnBook = document.getElementById('btnTakeOnBook');
        btnTakeOnBook.addEventListener('click',e=>{
            e.preventDefault();
            userModule.takeOnBook();
        });
    }
    takeOnBook(){
        const data = {
            selectedBookId: document.getElementById('selectBooks').value
        };
        fetch('createHistory', {
         method: 'POST',
           credentials: 'include',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(data)
        })
                .then(response => response.json())
                .then(response => {
                    document.getElementById('info').innerHTML = response.info;
                })
                .catch(error => console.log('Ошибка сервера: '+error))
    }
    returnBookForm(){
        document.getElementById('content').innerHTML=
                `<h1 class="w-100 d-flex justify-content-center">Возврат книги</h1>
                    <div class="w-100 d-flex justify-content-center">
                        <div class="card border-0" style="width: 25rem;">
                            <div class="card-body">
                                <h3 class="card-title w-100 my-3">Список читаемых книг</h3>
                                <form action="" method="POST">
                                    <p class="card-text w-100">
                                        <select id="historySelect" name="historyId">
                                            <option value="#" selected readonly>Выберите книгу</option>
                                        </select>
                                    </p>
                                    <p class="card-text w-100 d-flex justify-content-end">
                                        <input id="btnReturnBook" type="submit" value="Вернуть книгу">
                                    </p>

                                </form>
                            </div>
                        </div>
                    </div>`;
        fetch('getReadingBooks',{
           method: 'GET',
           credentials: 'include',
           headers: {'Content-Type': 'application/json'},
        })
                .then(response => response.json())
                .then(response => {
                    let historySelect = document.getElementById('historySelect');
                    for(let i = 0; i < response.histories.length; i++){
                        let histories = response.histories[i];
                        let option = document.createElement('option');
                        option.text = histories.book.bookName+', читает: '+histories.user.firstname+' '+histories.user.lastname;
                        option.value = histories.id;
                        historySelect.appendChild(option);
                    }
                    document.getElementById('info').innerHTML = response.info;
                })
                .catch(error => console.log('Ошибка сервера: '+error));
        document.getElementById('btnReturnBook').addEventListener('click',e=>{
            e.preventDefault();
            userModule.returnBook();
        });
    }
    returnBook(){
        let data = {
            historyId: document.getElementById('historySelect').value
        };
        if(data.historyId === '#'){
            document.getElementById('info').innerHTML = 'Выберите книгу'
            return;
        }
        fetch('returnBook',{
          method: 'POST',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        }).then(response => response.json())
                .then(response => {
                    userModule.returnBookForm();
                    document.getElementById('info').innerHTML = response.info;
                })
                .catch(error => console.log('Ошибка сервера: '+error));
    }
};
const userModule = new UserModule();
export {userModule};
