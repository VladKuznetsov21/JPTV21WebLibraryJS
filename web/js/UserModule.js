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
};
const userModule = new UserModule();
export {userModule};
