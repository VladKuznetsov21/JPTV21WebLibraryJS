/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package session;

import entity.Book;
import entity.History;
import entity.User;
import java.util.ArrayList;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 *
 * @author pupil
 */
@Stateless
public class HistoryFacade extends AbstractFacade<History> {

    @PersistenceContext(unitName = "JPTV21WebLibraryJSPU")
    private EntityManager em;

    @Override
    protected EntityManager getEntityManager() {
        return em;
    }

    public HistoryFacade() {
        super(History.class);
    }
    public List<Book> getReadingBooks(User user) {
        List<Book> readingBooks = new ArrayList<>();
        readingBooks = em.createQuery("SELECT h.book FROM History h WHERE h.user = :user AND h.returnBook = null")
                .setParameter("user", user)
                .getResultList();
        return readingBooks;
    }

}