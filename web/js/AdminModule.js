class AdminModule{
    printFormChangeRole(){
        document.getElementById('content').innerHTML = 
                `<h2  class="w-100 d-flex justify-content-center mt-5">Администрирование</h2>
                    <div class="w-100 d-flex justify-content-center mt-4">
                        <div class="card border-0" style="width: 24rem;">
                            <form action="updateRole" method="POST">
                                <h5>Пользователи:</h5> 
                                <select class="form-select" name="userId" id="userSelect">
                                    <option selected disabled>Выберите пользователя</option>
                                    
                                </select>
                                <h5>Роли:</h5> 
                                <select class="form-select" name="roleId" id="roleSelect">
                                    <option selected disabled>Выберите роль</option>
                                    
                                </select>
                                <p class="w-100 mt-5 d-flex justify-content-evenly">
                                    <input id="btnAddRole" class="btn btn-secondary w-25" type="submit" name="action" value="Добавить">
                                    <input id="btnRemoveRole" class="btn btn-secondary w-25" type="submit" name="action" value="Удалить">
                                </p>
                            </form>
                        </div>
                    </div>`;
        document.getElementById('btnAddRole').addEventListener('click',e=>{
            e.preventDefault();
            adminModule.addRole();
        });
        document.getElementById('btnRemoveRole').addEventListener('click',e=>{
            e.preventDefault();
            adminModule.removeRole();
        });
        fetch('changeRoleData',{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        })
                .then(response => response.json())
                .then(response => {
                    //console.log('response: '+JSON.stringify(response));
                    if(response.status){
                       let userSelect = document.getElementById('userSelect');
                       for(let i=0;i<response.users.length;i++){
                           let option = document.createElement('option');
                           option.text = response.users[i].login;
                           option.text += ' {';
                           for(let j=0;j<response.users[i].roles.length;j++){
                               if(j===0){
                                    option.text +=response.users[i].roles[j];
                               }else{
                                   option.text +='; '+response.users[i].roles[j];
                               }
                           }
                           option.text += '}';
                           option.value = response.users[i].id
                           userSelect.appendChild(option);
                       }
                       let roleSelect = document.getElementById('roleSelect');
                       for(let i=0;i<response.roles.length;i++){
                           let option = document.createElement('option');
                           option.text = response.roles[i];
                           option.value = response.roles[i];
                           roleSelect.appendChild(option);
                       }
                    }else{
                        document.getElementById('info').innerHTML='Не удалось получить данные от сервера';
                    }
                })
                .catch(error => document.getElementById('info').innerHTML='Ошибка формирования JSON: '+error)
    }
    addRole(){
        let data={
            userId: document.getElementById('userSelect').value,
            role: document.getElementById('roleSelect').value
        }
        fetch('addRole',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
                .then(response => response.json())
                .then(response => {
                    console.log('response: '+JSON.stringify(response));
                    if(response.status){
                       document.getElementById('info').innerHTML=response.info; 
                       adminModule.printFormChangeRole(); 
                    }else{
                       document.getElementById('info').innerHTML=response.info;
                    }
                })
                .catch(error => document.getElementById('info').innerHTML='Ошибка формирования JSON: '+error)
    }
    removeRole(){
     let data={
            userId: document.getElementById('userSelect').value,
            role: document.getElementById('roleSelect').value
        }
        fetch('removeRole',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        })
                .then(response => response.json())
                .then(response => {
                    console.log('response: '+JSON.stringify(response));
                    if(response.status){
                       document.getElementById('info').innerHTML=response.info; 
                       adminModule.printFormChangeRole(); 
                    }else{
                       document.getElementById('info').innerHTML=response.info;
                    }
                })
                .catch(error => document.getElementById('info').innerHTML='Ошибка формирования JSON: '+error)
       
    }
}
const adminModule = new AdminModule();
export {adminModule};


