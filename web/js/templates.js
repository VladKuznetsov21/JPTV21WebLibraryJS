"use strict";
class template{
    templateAddBook(){
       let templateAddBook = new Blob(
       [`<h3 class="w-100 mt-5 d-flex justify-content-center">Новая книга</h3>
        <div class="w-100 d-flex justify-content-center p-5">
            <div class="card" style="width: 40rem;">
                <div class="card-body">
                    <p class="w-100 d-flex justify-content-center p-5"><a href="addCover">Добавить обложку для книги</a></p>
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
                                <option value="2" selected>Обложка для книги Отцы и дети</option>
                                <option value="1" selected>Обложка для книги Война и мир</option>
                            </select>
                        </div>
                      </div>

                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                          <button type="button" class="btn btn-primary me-md-2" id="addBook">Добавить</button>
                      </div>

                    </form>
                </div>
            </div>
        </div>`], {type: 'text/html'});
        return templateAddBook;
    }
}