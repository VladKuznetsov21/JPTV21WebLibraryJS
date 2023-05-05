class AuthorModule{
    async printCreateAuthor(){
        // const add_book = document.getElementById('add_book');
         document.getElementById('content').innerHTML=
        `<h1  class="w-100 d-flex justify-content-center">Новый автор:</h1>
        <div class="w-100 d-flex justify-content-center">
            <div class="card border-0" style="width: 25rem;">
                <div class="card-body">
                <form method="POST" action="createAuthor">
                    <div class="mb-2 row">
                        <label for="firstName" class="col-sm-3 col-form-label">Имя:</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" id="firstName" name="firstname" value="">
                        </div>
                    </div>
                    <div class="mb-2 row">
                        <label for="lastName" class="col-sm-3 col-form-label">Фамилия:</label>
                        <div class="col-sm-9">
                          <input type="text" class="form-control" id="lastName" name="lastname" value="">
                        </div>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button type="button" id="btnAddAuthor" class="btn btn-primary me-md-2">Добавить</button>
                    </div>
                </form>
            </div>
        </div>`;
        const btnAddAuthor = document.getElementById('btnAddAuthor');
        btnAddAuthor.addEventListener('click',e=>{
            e.preventDefault();
            const createAuthorObject = {
                 'firstname': document.getElementById('firstName').value,
                 'lastname': document.getElementById('lastName').value,
            };
            authorModule.createNewAuthor(createAuthorObject);
        });
    }
    
    async createNewAuthor(createAuthorObject){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(createAuthorObject)
        };
        await fetch('createAuthor',requestOptions)
                .then(response => response.json())
                .then(response => {
                    document.getElementById('info').innerHTML=response.info;
                    authorModule.printCreateAuthor();
                })
                .catch(error=>console.log('error: '+error));
    }  
    
    async printListAuthors(){
       
       await fetch('listAuthors',{
           method: 'GET',
           headers: {'Content-Type': 'application/json'}
       })
               .then(mapAuthors=>{
                   console.log(mapAuthors);
                   mapAuthors.json();
                   console.log(JSON.stringify(mapAuthors));
                   
                })
               .then(mapAuthors => {
                    let content = document.getElementById('content');
                    let cart = `
                    <h3 class="w-100 mt-5 d-flex justify-content-center">Список книг</h3>
                    <div id="box_listBooks" class="w-100 d-flex justify-content-center p-5">
                    </div>`;
                    content.insertAdjacentHTML("beforeend", cart);
                    const table = document.createElement('table');
                    let headers = ["№", "Автор", "Книги автора"];
                    let thead = table.createTHead();
                    let row = thead.insertRow();
                    for(let i = 0; i < headers.length;i++){
                        let th = document.createElement("th");
                        let text = document.createTextNode(headers[i]);
                        th.appendChild(text);
                        row.appendChild(th);
                    }
                    let tbody = table.createTBody();
                    mapAuthors.forEach((author,index)=>{
                        let tr = tbody.insertRow();
                        let td1 = tr.insertCell();
                        td1.innerHTML = index;
                        let td2 = tr.insertCell();
                        td2.innerHTML = author.firstname+' '+author.lastname;
                        let td3 = tr.insertCell();
                        td3.innerHTML = '';
                    });
                    let box_listBooks = document.getElementById('box_listBooks');
                    box_listBooks.insertAdjacentHTML("beforeend", table);
                        
                })
               .catch(error => "error: "+error);
    }
}
const authorModule = new AuthorModule();
export {authorModule};
