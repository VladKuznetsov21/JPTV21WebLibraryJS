/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import convertors.ConvertMapToJson;
import entity.Author;
import entity.Book;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import session.AuthorFacade;
import session.BookFacade;

/**
 *
 * @author pupil
 */
@WebServlet(name = "AuthorServlet", urlPatterns = {
    "/createAuthor",
    "/listAuthors",
    
    
})
public class AuthorServlet extends HttpServlet {
    @EJB private AuthorFacade authorFacade;
    @EJB private BookFacade bookFacade;
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
        String path = request.getServletPath();
        switch (path) {
            case "/createAuthor":
                JsonReader jsonReader = Json.createReader(request.getReader());
                JsonObject createBookJsonObject = jsonReader.readObject();
                String firstname = createBookJsonObject.getString("firstname");
                String lastname = createBookJsonObject.getString("lastname");
                
                Author author = new Author();
                author.setFirstname(firstname);
                author.setLastname(lastname);
                JsonObjectBuilder job = Json.createObjectBuilder();
                try {             
                    authorFacade.create(author);
                    job.add("info", "автор успешно добавлен");
                } catch (Exception e) {
                    job.add("info", "Ошибка: "+e);
                }
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
                }
                break;
            
            case "/listAuthors":
                Map<Author,List<Book>> mapAuthorBooks = new HashMap<>();
                List<Author> listAuthors = authorFacade.findAll();
                List<Book> listBooks  = bookFacade.findAll();
                for (int i = 0; i < listBooks.size(); i++) {
                    Book currentBook = listBooks.get(i); //берем книгу
                    for (int j = 0; j < listAuthors.size(); j++) {
                        Author currentAuthor = listAuthors.get(j);
                        //если в книге есть автор, добавляем ее в mapAuthorBook автору
                        if(currentBook.getAuthors().contains(currentAuthor)){
                            if(mapAuthorBooks.get(currentAuthor) == null){
                                List<Book> listBookAuthors = new ArrayList<>();
                                listBookAuthors.add(currentBook);
                                mapAuthorBooks.put(currentAuthor, listBookAuthors);
                            }else{
                                mapAuthorBooks.get(currentAuthor).add(currentBook);
                            }
                        }
                    };
                }
                ConvertMapToJson cmtj = new ConvertMapToJson();
                String jsonString = cmtj.getJsonObjectMap(mapAuthorBooks).toString();
                try (PrintWriter out = response.getWriter()) {
                    out.println(jsonString); //отправляем в out json-массив с книгами в виде строки
                }
                break;
        }
        
      
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
