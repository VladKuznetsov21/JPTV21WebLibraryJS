/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlet;

import convertors.ConvertToJson;
import entity.Author;
import entity.Book;
import entity.Cover;
import entity.History;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.GregorianCalendar;
import java.util.List;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import servlets.UserServlet;
import session.AuthorFacade;
import session.BookFacade;
import session.CoverFacade;
import session.HistoryFacade;

/**
 *
 * @author pupil
 */
@WebServlet(name = "BookServlet", urlPatterns = {
    "/createBook",
    "/createCover",
    "/listCovers",
    "/listBooks",
    "/createHistory",
    
    
})
@MultipartConfig
public class BookServlet extends HttpServlet {
    @EJB private AuthorFacade authorFacade;
    @EJB private CoverFacade coverFacade;
    @EJB private BookFacade bookFacade;
    @EJB private HistoryFacade historyFacade;
    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        request.setCharacterEncoding("UTF-8");
        JsonObjectBuilder job = Json.createObjectBuilder();
        HttpSession session = request.getSession(false);
        if(session == null){
            job.add("info", "Вы не авторизованы!");
            try (PrintWriter out = response.getWriter()) {
                out.println(job.build().toString());
            }
            return;
        }
        User authUser = (User) session.getAttribute("authUser");
        if(authUser == null){
            job.add("info", "Вы не авторизованы!");
            try (PrintWriter out = response.getWriter()) {
                out.println(job.build().toString());
            }
            return;
        }
        if(!authUser.getRoles().contains(UserServlet.Role.USER.toString())){
            job.add("info", "Вы не авторизованы!");
            try (PrintWriter out = response.getWriter()) {
                out.println(job.build().toString());
            }
            return;
        }
        String path = request.getServletPath();
        switch (path) {
            case "/createBook":
                JsonReader jsonReader = Json.createReader(request.getReader());
                JsonObject createBookJsonObject = jsonReader.readObject();
                String bookName = createBookJsonObject.getString("bookName");
                String publishedYear = createBookJsonObject.getString("publishedYear");
                String quantity = createBookJsonObject.getString("quantity");
                String authorId = createBookJsonObject.getString("authorId");
                String coverId = createBookJsonObject.getString("coverId");
                Book book = new Book();
                book.setBookName(bookName);
                book.setPublishedYear(publishedYear);
                book.setQuantity(quantity);
                //автора берем из базы данных по полученному из формы id
                Author author = authorFacade.find(Long.parseLong(authorId));
                if(author == null){
                    job.add("info", "Error: Нет такого автора");
                    try (PrintWriter out = response.getWriter()) {
                        out.println(job.build().toString());
                        return;
                    }
                }

                book.getAuthors().add(author);
                Cover cover = coverFacade.find(Long.parseLong(coverId));
                if(cover == null){
                    job.add("info", "Error: Нет такой обложки");
                    try (PrintWriter out = response.getWriter()) {
                        out.println(job.build().toString());
                        return;
                    }
                }
                book.setCover(cover);
                try {
                    bookFacade.create(book);
                    job.add("info", "Книга успешно добавлена");
                } catch (Exception e) {
                    job.add("info", "Ошибка: "+e);
                }
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
                }
                break;
            case "/createCover":
                String description = request.getParameter("description");
                Part part = request.getPart("file");
                String fileName = getFileName(part);
                String pathToDir = "D:\\UploadDir\\JPTV21WebLibrarJS";
                File file = new File(pathToDir);
                file.mkdirs();
                String pathToFile = pathToDir+File.separator+fileName;
                file = new File(pathToFile);
                try(InputStream fileContent = part.getInputStream()){
                    Files.copy(fileContent, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                cover = new Cover();
                cover.setUrl(pathToFile);
                cover.setDescription(description);
                job = Json.createObjectBuilder();
                try {
                    coverFacade.create(cover);
                    job.add("info", "Обложка успешно добавлена");
                } catch (Exception e) {
                    job.add("info", "Добавить обложку не удалось");
                    
                }
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
                }
                break;
            case "/listCovers":
                List<Cover>listCovers = coverFacade.findAll();
                ConvertToJson convertToJson = new ConvertToJson();
                try (PrintWriter out = response.getWriter()) {
                    JsonArray jsonListCovers = convertToJson.getJsonArrayCovers(listCovers);
                    out.println(jsonListCovers.toString());
                }
                break;
            case "/listBooks":
                //создаем json-массив jabBooks для книг
                JsonArrayBuilder jabBooks = Json.createArrayBuilder();
                List<Book> listBooks = bookFacade.findAll();
                for (int i = 0; i < listBooks.size(); i++) {
                    Book b = listBooks.get(i);
                    //для массива авторов книги создаем json-массив jabAuthors
                    JsonArrayBuilder jabAuthors = Json.createArrayBuilder();
                    for (int j = 0; j < b.getAuthors().size(); j++) {
                        Author a = b.getAuthors().get(j);
                        job = Json.createObjectBuilder();
                        job.add("id", a.getId());
                        job.add("firstname", a.getFirstname());
                        job.add("lastname", a.getLastname());
                        jabAuthors.add(job.build()); //в json-массиве лежат json объекты авторов
                    };
                    //создаем json-объект Cover
                    JsonObjectBuilder jsonCover = Json.createObjectBuilder();//создаем json-объект Cover
                    jsonCover.add("id", b.getCover().getId());
                    jsonCover.add("url", b.getCover().getUrl());
                    jsonCover.add("description",b.getCover().getDescription()); 
                    //создаем json-объект книги
                    job = Json.createObjectBuilder();
                    job.add("id", b.getId());
                    job.add("bookName", b.getBookName());
                    job.add("publishedYear", b.getPublishedYear());
                    job.add("quantity", b.getQuantity());
                    job.add("cover", jsonCover.build());
                    job.add("authors", jabAuthors.build());
                    jabBooks.add(job.build());// в json-массиве jabBooks дежат json-объекты книг
                }
                try (PrintWriter out = response.getWriter()) {
                    out.println(jabBooks.build().toString()); //отправляем в out json-массив с книгами в виде строки
                }
                break;
            case "/createHistory":
                jsonReader = Json.createReader(request.getReader());
                JsonObject jsonObject = jsonReader.readObject();
                String bookId = jsonObject.getString("selectedBookId");
                book = bookFacade.find(Long.parseLong(bookId));
                History history = new History();
                history.setBook(book);
                history.setUser(authUser);
                history.setTakeOnBook(new GregorianCalendar().getTime());
                historyFacade.create(history);
                job = Json.createObjectBuilder();
                job.add("info", "Книга выдана");
                 try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString()); //отправляем в out json-массив с книгами в виде строки
                }
                break;
        }
    }
    private String getFileName(Part part) {
        for (String content : part.getHeader("content-disposition").split(";")){
            if(content.trim().startsWith("filename")){
                return content
                        .substring(content.indexOf('=')+1)
                        .trim()
                        .replace("\"",""); 
            }
        }
        return null;
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
