/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlets;

import convertors.ConvertToJson;
import entity.Book;
import entity.History;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import session.HistoryFacade;
import session.UserFacade;
import tools.PassEncrypt;

/**
 *
 * @author pupil
 */
@WebServlet(name = "UserServlet", urlPatterns = {
    "/userRegistration",
    "/listUsers",
    "/getReadingBooks",
    "/returnBook"
    
})
public class UserServlet extends HttpServlet {
    public static enum Role {USER,EMPLOYEE,ADMINISTRATOR};
    private PassEncrypt passEncrypt;
    @EJB UserFacade userFacade;
    @EJB HistoryFacade historyFacade;
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
        if(!authUser.getRoles().contains(UserServlet.Role.EMPLOYEE.toString())){
            job.add("info", "Вы не авторизованы!");
            try (PrintWriter out = response.getWriter()) {
                out.println(job.build().toString());
            }
            return;
        }
        String path = request.getServletPath();
        switch (path) {
            case "/userRegistration":
                JsonReader jsonReader = Json.createReader(request.getReader());
                JsonObject jsonObject = jsonReader.readObject();
                String firstname = jsonObject.getString("firstname");
                String lastname = jsonObject.getString("lastname");
                String phone = jsonObject.getString("phone");
                String login = jsonObject.getString("login");
                String password = jsonObject.getString("password");
               
                User user = new User();
                user.setFirstname(firstname);
                user.setLastname(lastname);
                user.setPhone(phone);
                user.setLogin(login);
                passEncrypt = new PassEncrypt();
                user.setSalt(passEncrypt.getSalt());
                password = passEncrypt.getEncryptedPass(password, user.getSalt());
                user.setPassword(password);
                user.getRoles().add(UserServlet.Role.USER.toString());
                userFacade.create(user);
                job.add("info", "Пользователь добавлен");
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
                }
              break;
            case "/listUsers":
                List<User> listUsers = userFacade.findAll();
                Map<User,List<Book>> mapUsers = new HashMap<>();
                for (int i = 0; i < listUsers.size(); i++) {
                    user = listUsers.get(i);
                    List<Book> readingBooks = historyFacade.getReadingBooks(user);
                    mapUsers.put(user, readingBooks);
                }
                JsonArray JsonArrayMapListUsers = new ConvertToJson().getJsonObjectMapUsers(mapUsers);
                try (PrintWriter out = response.getWriter()) {
                    out.println(JsonArrayMapListUsers.toString());
                }
              break;
            case "/getReadingBooks":
                List<History> listReadingBooksHistory = historyFacade.getReadingBooksHistory(authUser);
                job = Json.createObjectBuilder();
                job.add("histories", new ConvertToJson().getJsonArrayHistory(listReadingBooksHistory));
                job.add("info", " ");
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
                }
                break;
            case "/returnBook":
                jsonReader = Json.createReader(request.getReader());
                jsonObject = jsonReader.readObject();
                String historyId = jsonObject.getString("historyId");
                History history = historyFacade.find(Long.parseLong(historyId));
                history.setReturnBook(new GregorianCalendar().getTime());
                historyFacade.edit(history);
                job = Json.createObjectBuilder();
                job.add("info", "Книга возвращена");
                try (PrintWriter out = response.getWriter()) {
                    out.println(job.build().toString());
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
