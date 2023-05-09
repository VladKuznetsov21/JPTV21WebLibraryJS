import{bookModule} from './BookModule.js';
import{authorModule} from './AuthorModule.js';
import{userModule} from './UserModule.js';
import{loginModule} from './LoginModule.js';
import{adminModule} from './AdminModule.js';
let debug = false;

const newBook = document.getElementById('newBook');
    newBook.addEventListener('click', e=>{
        bookModule.printCreateBook();
});
const listBooks = document.getElementById('listBooks');
    listBooks.addEventListener('click',e=>{
        bookModule.printListBooks();
});
const newAuthor = document.getElementById('newAuthor');
    newAuthor.addEventListener('click', e=>{
        authorModule.printCreateAuthor();
});
const listAuthors = document.getElementById('listAuthors');
    listAuthors.addEventListener('click', e=>{
        authorModule.printListAuthors();
    });
const newUser = document.getElementById('newUser');
    newUser.addEventListener('click', e=>{
        userModule.printFormNewUser();
    });
const listUsers = document.getElementById('listUsers');
    listUsers.addEventListener('click', e=>{
        userModule.printListUsers();
    });
const logIn = document.getElementById('logIn');
    logIn.addEventListener('click', e=>{
        e.preventDefault();
        loginModule.printFormLogin();
    });
const logOut = document.getElementById('logout');
    logOut.addEventListener('click', e=>{
        e.preventDefault();
        loginModule.logout();
    });
const changeRole = document.getElementById('changeRole');
    changeRole.addEventListener('click', e=>{
        e.preventDefault();
        adminModule.printFormChangeRole();
    });
checkAuthUser();
function checkAuthUser(){
    let authUser = JSON.parse(sessionStorage.getItem('authUser'));
    if(authUser === null){
        newBook.hidden = true;
        listUsers.hidden = true;
        newAuthor.hidden = true;
        logOut.hidden = true;
        return;
    }
    logOut.hidden = false;
    logIn.hidden = true;
    document.getElementById('userLogin').innerHTML = authUser.login; 
    let USER = false;
    let EMPLOYEE = false;
    let ADMINISTRATOR = false;
    for(let key in authUser.roles){
        if(authUser.roles[key] === "USER"){
            USER = true;
        }
        if(authUser.roles[key] === "EMPLOYEE"){
            EMPLOYEE = true;
        }
        if(authUser.roles[key] === "ADMINISTRATOR"){
            ADMINISTRATOR = true;
        }
    }
    if(USER){
        
    }
    if(EMPLOYEE){
        
    }
    if(ADMINISTRATOR){
        
    }
    
}
export{checkAuthUser};